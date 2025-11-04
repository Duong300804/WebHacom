package com.example.computer_store.service;

import com.example.computer_store.common.CommonConstant;
import com.example.computer_store.model.entity.*;
import com.example.computer_store.repository.NotificationRepository;
import com.example.computer_store.repository.OrderRepository;
import com.example.computer_store.repository.ProductRepository;
import com.example.computer_store.repository.UserRepository;
import com.example.computer_store.request.Order.OrderFilterRequest;
import com.example.computer_store.request.Order.OrderRequest;
import com.example.computer_store.request.Order.OrderTrackingRequest;
import com.example.computer_store.request.Order.OrderUpdateRequest;
import com.example.computer_store.response.OrderItemResponse;
import com.example.computer_store.response.OrderResponse;
import com.example.computer_store.response.Common.ResponseAPI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationRepository notificationRepository;

    // Lấy tất cả đơn hàng
    public ResponseAPI<List<OrderResponse>> getAllOrders() {
        try {
            List<OrderEntity> orders = orderRepository.findAll().stream()
                    .filter(order -> order.getDeleteFlag().equals(CommonConstant.DELETE_FLG.NON_DELETE))
                    .collect(Collectors.toList());
            List<OrderResponse> orderResponses = orders.stream().map(this::mapToOrderResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, orderResponses);
        } catch (Exception e) {
            System.err.println("Error to get list order: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    // Lấy tất cả đơn hàng của người dùng hiện tại
    public ResponseAPI<List<OrderResponse>> getMyOrders() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            UserEntity user = userRepository.findByUsernameAndDeleteFlag(username, CommonConstant.DELETE_FLG.NON_DELETE);
            if (user == null) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_USER);
            }
            List<OrderEntity> orders = orderRepository.findByUserIdAndDeleteFlag(user.getId(), CommonConstant.DELETE_FLG.NON_DELETE);
            List<OrderResponse> orderResponses = orders.stream().map(this::mapToOrderResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, orderResponses);
        } catch (Exception e) {
            System.err.println("Error to get list order: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    // Hủy đơn hàng
    @Transactional
    public ResponseAPI<OrderResponse> cancelOrder(Long id) {
        try {
            // Kiểm tra đơn hàng tồn tại
            Optional<OrderEntity> orderOptional = orderRepository.findById(id);
            if (orderOptional.isEmpty() || orderOptional.get().getDeleteFlag().equals(CommonConstant.DELETE_FLG.DELETE)) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_ORDER);
            }
            OrderEntity order = orderOptional.get();
            String currentStatus = order.getStatus().toUpperCase();
            // Kiểm tra trạng thái đơn hàng có thể hủy
            if (!List.of("PENDING", "CONFIRMED").contains(currentStatus)) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.ORDER_STATUS_CANNOT_CHANGE);
            }
            // Kiểm tra người dùng hiện tại có phải chủ đơn hàng
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            UserEntity user = userRepository.findByUsernameAndDeleteFlag(username, CommonConstant.DELETE_FLG.NON_DELETE);
            if (user == null || order.getUser().getId() != user.getId()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NON_AUTH, CommonConstant.COMMON_MESSAGE.NOT_AUTHORITY);
            }
            // Hoàn lại tồn kho
            for (OrderItemEntity item : order.getOrderItems()) {
                Optional<ProductEntity> productOptional = productRepository.findById(item.getProduct().getId());
                if (productOptional.isPresent()) {
                    ProductEntity product = productOptional.get();
                    product.setInStock(product.getInStock() + item.getQuantity());
                    productRepository.save(product);
                }
            }
            // Cập nhật trạng thái đơn hàng thành CANCELLED
            order.setStatus("CANCELLED");
            order.setUpdatedAt(new Date());
            orderRepository.save(order);
            // Tạo thông báo cho người dùng
            NotificationEntity userNotification = new NotificationEntity();
            userNotification.setUser(user);
            userNotification.setType("ORDER_CANCELLED");
            userNotification.setMessage("Bạn đã hủy đơn hàng #" + order.getId());
            userNotification.setRead(false);
            userNotification.setCreatedAt(new Date());
            userNotification.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
            notificationRepository.save(userNotification);
            //Tạo thông báo cho admin
            List<UserEntity> admins = userRepository.findByRoleAndDeleteFlag("ADMIN", CommonConstant.DELETE_FLG.NON_DELETE);
            for (UserEntity admin : admins) {
                NotificationEntity adminNotification = new NotificationEntity();
                adminNotification.setUser(admin);
                adminNotification.setType("USER_CANCEL_ORDER");
                adminNotification.setMessage("Đơn hàng #" + order.getId() + " đã bị hủy bởi khách hàng " + user.getUsername());
                adminNotification.setRead(false);
                adminNotification.setCreatedAt(new Date());
                adminNotification.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
                notificationRepository.save(adminNotification);
            }
            //Thông báo cho staff
            List<UserEntity> staffs = userRepository.findByRoleAndDeleteFlag("STAFF", CommonConstant.DELETE_FLG.NON_DELETE)
                    .stream()
                    .filter(s -> s.getUsername() != null && !s.getUsername().isEmpty())
                    .collect(Collectors.toList());
            for (UserEntity staff : staffs) {
                NotificationEntity staffNotification = new NotificationEntity();
                staffNotification.setUser(staff);
                staffNotification.setType("USER_CANCEL_ORDER");
                staffNotification.setMessage("Đơn hàng #" + order.getId() + " đã bị hủy bởi khách hàng " + user.getUsername());
                staffNotification.setRead(false);
                staffNotification.setCreatedAt(new Date());
                staffNotification.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
                notificationRepository.save(staffNotification);
            }
            // Tạo response
            OrderResponse orderResponse = mapToOrderResponse(order);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.ORDER_CANCELLED, orderResponse);
        } catch (Exception e) {
            System.err.println("Error to cancel order: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    // Lấy đơn hàng theo ID
    public ResponseAPI<OrderResponse> getOrderById(Long id) {
        try {
            Optional<OrderEntity> orderOptional = orderRepository.findById(id);
            if (orderOptional.isEmpty() || orderOptional.get().getDeleteFlag().equals(CommonConstant.DELETE_FLG.DELETE)) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_ORDER);
            }
            OrderResponse orderResponse = mapToOrderResponse(orderOptional.get());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, orderResponse);
        } catch (Exception e) {
            System.err.println("Error to get order by id: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    public ResponseAPI<OrderResponse> trackOrder(OrderTrackingRequest request) {
        try {
            if (!request.isValid()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
            }
            Optional<OrderEntity> orderOptional = orderRepository.findByIdAndUserPhoneAndDeleteFlag(
                    request.getOrderId(), request.getPhone(), CommonConstant.DELETE_FLG.NON_DELETE);
            if (orderOptional.isEmpty()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_ORDER);
            }
            OrderResponse orderResponse = mapToOrderResponse(orderOptional.get());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, orderResponse);
        } catch (Exception e) {
            System.err.println("Error to track order: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    // Tạo đơn hàng mới
    @Transactional
    public ResponseAPI<OrderResponse> createOrder(OrderRequest orderRequest) {
        try {
            // Kiểm tra tính hợp lệ của request
            if (!orderRequest.isValid()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
            }
            // Lấy thông tin người dùng hiện tại
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            UserEntity user = userRepository.findByUsernameAndDeleteFlag(username, CommonConstant.DELETE_FLG.NON_DELETE);
            if (user == null) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_USER);
            }
            // Kiểm tra tồn kho sản phẩm
            for (var item : orderRequest.getOrderItems()) {
                Optional<ProductEntity> productOptional = productRepository.findById(item.getProductId());
                if (productOptional.isEmpty() || productOptional.get().getDeleteFlag().equals(CommonConstant.DELETE_FLG.DELETE)) {
                    return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_PRODUCT);
                }
                ProductEntity product = productOptional.get();
                if (product.getInStock() < item.getQuantity()) {
                    return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INSUFFICIENT_STOCK);
                }
            }
            // Tạo đơn hàng mới
            OrderEntity order = new OrderEntity();
            order.setUser(user);
            order.setOrderDate(new Date());
            order.setStatus("PENDING");
            order.setShippingAddress(orderRequest.getShippingAddress());
            order.setShippingMethod(orderRequest.getShippingMethod());
            order.setPaymentMethod(orderRequest.getPaymentMethod());
            order.setNote(orderRequest.getNote());
            order.setCreatedAt(new Date());
            order.setUpdatedAt(new Date());
            order.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
            // Tính tổng số tiền và thêm các mục đơn hàng
            long totalAmount = 0;
            List<OrderItemEntity> orderItems = new ArrayList<>();
            for (var item : orderRequest.getOrderItems()) {
                Optional<ProductEntity> productOptional = productRepository.findById(item.getProductId());
                ProductEntity product = productOptional.get();
                OrderItemEntity orderItem = new OrderItemEntity();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setQuantity(item.getQuantity());
                orderItem.setPriceAtPurchase(product.getDiscountPrice());
                totalAmount += product.getDiscountPrice() * item.getQuantity();
                orderItems.add(orderItem);
                // Giảm tồn kho
                product.setInStock(product.getInStock() - item.getQuantity());
                // Kiểm tra nếu sản phẩm hết hàng sau khi đặt
                if (product.getInStock() == 0) {
                    List<UserEntity> admins = userRepository.findByRoleAndDeleteFlag("ADMIN", CommonConstant.DELETE_FLG.NON_DELETE);
                    for (UserEntity admin : admins) {
                        NotificationEntity adminNotification = new NotificationEntity();
                        adminNotification.setUser(admin);
                        adminNotification.setType("PRODUCT_OUT_OF_STOCK");
                        adminNotification.setMessage("Sản phẩm " + product.getName() + " đã hết hàng sau đơn hàng mới đây");
                        adminNotification.setRead(false);
                        adminNotification.setCreatedAt(new Date());
                        adminNotification.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
                        notificationRepository.save(adminNotification);
                    }
                    // Thông báo cho STAFF
                    List<UserEntity> staffs = userRepository.findByRoleAndDeleteFlag("STAFF", CommonConstant.DELETE_FLG.NON_DELETE)
                            .stream()
                            .filter(s -> s.getUsername() != null && !s.getUsername().isEmpty())
                            .collect(Collectors.toList());
                    for (UserEntity staff : staffs) {
                        NotificationEntity staffNotification = new NotificationEntity();
                        staffNotification.setUser(staff);
                        staffNotification.setType("PRODUCT_OUT_OF_STOCK");
                        staffNotification.setMessage("Sản phẩm " + product.getName() + " đã hết hàng sau đơn hàng mới đây");
                        staffNotification.setRead(false);
                        staffNotification.setCreatedAt(new Date());
                        staffNotification.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
                        notificationRepository.save(staffNotification);
                    }
                }
                productRepository.save(product);
            }
            order.setTotalAmount(totalAmount);
            order.setOrderItems(orderItems);
            // Lưu đơn hàng
            orderRepository.save(order);
            // Tạo thông báo cho người dùng
            NotificationEntity notification = new NotificationEntity();
            notification.setUser(user);
            notification.setType("NEW_ORDER");
            notification.setMessage("Bạn vừa tạo đơn hàng mới #" + order.getId());
            notification.setRead(false);
            notification.setCreatedAt(new Date());
            notification.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
            notificationRepository.save(notification);
            //Tạo thông báo cho admin
            List<UserEntity> admins = userRepository.findByRoleAndDeleteFlag("ADMIN", CommonConstant.DELETE_FLG.NON_DELETE);
            for (UserEntity admin : admins) {
                NotificationEntity adminNotification = new NotificationEntity();
                adminNotification.setUser(admin);
                adminNotification.setType("NEW_ORDER_ADMIN");
                adminNotification.setMessage("Có đơn hàng mới #" + order.getId() + " từ khách hàng " + user.getUsername());
                adminNotification.setRead(false);
                adminNotification.setCreatedAt(new Date());
                adminNotification.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
                notificationRepository.save(adminNotification);
            }
            //Tạo thông báo cho staff
            List<UserEntity> staffs = userRepository.findByRoleAndDeleteFlag("STAFF", CommonConstant.DELETE_FLG.NON_DELETE)
                    .stream()
                    .filter(s -> s.getUsername() != null && !s.getUsername().isEmpty())
                    .collect(Collectors.toList());
            for (UserEntity staff : staffs) {
                NotificationEntity staffNotification = new NotificationEntity();
                staffNotification.setUser(staff);
                staffNotification.setType("NEW_ORDER_ADMIN");
                staffNotification.setMessage("Có đơn hàng mới #" + order.getId() + " từ khách hàng " + user.getUsername());
                staffNotification.setRead(false);
                staffNotification.setCreatedAt(new Date());
                staffNotification.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
                notificationRepository.save(staffNotification);
            }
            // Tạo response
            OrderResponse orderResponse = mapToOrderResponse(order);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CREATED, CommonConstant.COMMON_MESSAGE.ORDER_CREATED, orderResponse);
        } catch (Exception e) {
            System.err.println("Error to create order: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    // Cập nhật trạng thái đơn hàng
    @Transactional
    public ResponseAPI<OrderResponse> updateOrder(Long id, OrderUpdateRequest updateRequest) {
        try {
            // Kiểm tra tính hợp lệ của request
            if (!updateRequest.isValid()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_ORDER_STATUS);
            }
            // Kiểm tra đơn hàng tồn tại
            Optional<OrderEntity> orderOptional = orderRepository.findById(id);
            if (orderOptional.isEmpty() || orderOptional.get().getDeleteFlag().equals(CommonConstant.DELETE_FLG.DELETE)) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_ORDER);
            }
            OrderEntity order = orderOptional.get();
            // Kiểm tra trạng thái hiện tại để đảm bảo chuyển trạng thái hợp lệ
            String currentStatus = order.getStatus().toUpperCase();
            String newStatus = updateRequest.getStatus().toUpperCase();
            if (!isValidStatusTransition(currentStatus, newStatus)) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.ORDER_STATUS_CANNOT_CHANGE);
            }
            // Cập nhật trạng thái và thời gian
            order.setStatus(newStatus);
            order.setUpdatedAt(new Date());
            orderRepository.save(order);
            // Tạo thông báo cho người dùng
            NotificationEntity notification = new NotificationEntity();
            notification.setUser(order.getUser());
            notification.setType("ORDER_STATUS_UPDATED");
            notification.setMessage("Đơn hàng #" + order.getId() + " của bạn đã được cập nhật trạng thái: " + newStatus);
            notification.setRead(false);
            notification.setCreatedAt(new Date());
            notification.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
            notificationRepository.save(notification);
            // Tạo response
            OrderResponse orderResponse = mapToOrderResponse(order);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.ORDER_UPDATED, orderResponse);
        } catch (Exception e) {
            System.err.println("Error to update order: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    // Xóa mềm đơn hàng
    @Transactional
    public ResponseAPI<String> deleteOrder(Long id) {
        try {
            Optional<OrderEntity> orderOptional = orderRepository.findById(id);
            if (orderOptional.isEmpty() || orderOptional.get().getDeleteFlag().equals(CommonConstant.DELETE_FLG.DELETE)) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_ORDER);
            }
            OrderEntity order = orderOptional.get();
            // Hoàn lại tồn kho cho các sản phẩm trong đơn hàng
            for (OrderItemEntity item : order.getOrderItems()) {
                Optional<ProductEntity> productOptional = productRepository.findById(item.getProduct().getId());
                if (productOptional.isPresent()) {
                    ProductEntity product = productOptional.get();
                    product.setInStock(product.getInStock() + item.getQuantity());
                    productRepository.save(product);
                }
            }
            order.setDeleteFlag(CommonConstant.DELETE_FLG.DELETE);
            order.setUpdatedAt(new Date());
            orderRepository.save(order);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.ORDER_DELETED);
        } catch (Exception e) {
            System.err.println("Error to delete order: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    // Tìm kiếm đơn hàng theo từ khóa
    public ResponseAPI<List<OrderResponse>> searchOrders(String keyword) {
        try {
            List<OrderEntity> orders = orderRepository.searchOrders(keyword, CommonConstant.DELETE_FLG.NON_DELETE);
            List<OrderResponse> orderResponses = orders.stream().map(this::mapToOrderResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, orderResponses);
        } catch (Exception e) {
            System.err.println("Erro to search order: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    // Lọc đơn hàng theo các tiêu chí
    public ResponseAPI<List<OrderResponse>> filterOrders(OrderFilterRequest filterRequest) {
        try {
            List<OrderEntity> orders = orderRepository.filterOrders(
                    filterRequest.getUserId(),
                    filterRequest.getStatus(),
                    filterRequest.getMinTotal(),
                    filterRequest.getMaxTotal(),
                    filterRequest.getStartDate(),
                    filterRequest.getEndDate(),
                    CommonConstant.DELETE_FLG.NON_DELETE
            );
            List<OrderResponse> orderResponses = orders.stream().map(this::mapToOrderResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, orderResponses);
        } catch (Exception e) {
            System.err.println("Error to filter order: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    // Chuyển đổi OrderEntity thành OrderResponse
    private OrderResponse mapToOrderResponse(OrderEntity order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setUserId(order.getUser().getId());
        response.setOrderDate(order.getOrderDate());
        response.setStatus(order.getStatus());
        response.setTotalAmount(order.getTotalAmount());
        response.setShippingAddress(order.getShippingAddress());
        response.setShippingMethod(order.getShippingMethod());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setNote(order.getNote());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        response.setDeleteFlag(order.getDeleteFlag());
        response.setOrderItems(order.getOrderItems().stream().map(item -> {
            OrderItemResponse itemResponse = new OrderItemResponse();
            itemResponse.setId(item.getId());
            itemResponse.setProductId(item.getProduct().getId());
            itemResponse.setQuantity(item.getQuantity());
            itemResponse.setPriceAtPurchase(item.getPriceAtPurchase());
            return itemResponse;
        }).collect(Collectors.toList()));
        return response;
    }

    // Kiểm tra chuyển trạng thái đơn hàng hợp lệ
    private boolean isValidStatusTransition(String currentStatus, String newStatus) {
        switch (currentStatus) {
            case "PENDING":
                return List.of("CONFIRMED", "CANCELLED").contains(newStatus);
            case "CONFIRMED":
                return List.of("SHIPPED", "CANCELLED").contains(newStatus);
            case "SHIPPED":
                return List.of("DELIVERED").contains(newStatus);
            case "DELIVERED":
            case "CANCELLED":
                return false; // Không thể thay đổi trạng thái từ DELIVERED hoặc CANCELLED
            default:
                return false;
        }
    }
}