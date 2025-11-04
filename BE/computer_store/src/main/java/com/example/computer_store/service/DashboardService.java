package com.example.computer_store.service;

import com.example.computer_store.common.CommonConstant;
import com.example.computer_store.model.entity.*;
import com.example.computer_store.repository.CategoryRepository;
import com.example.computer_store.repository.OrderRepository;
import com.example.computer_store.repository.ProductRepository;
import com.example.computer_store.repository.UserRepository;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.response.DashboardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // Tổng số sản phẩm
    public ResponseAPI<DashboardResponse> getTotalProducts() {
        try {
            long totalProducts = productRepository.countByDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
            DashboardResponse response = new DashboardResponse();
            response.setTotal(totalProducts);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            System.err.println("Error to get total product: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    // Tổng số sản phẩm đã bán
    public ResponseAPI<DashboardResponse> getTotalProductsSold() {
        try {
            List<OrderEntity> successfulOrders = orderRepository.findByStatusAndDeleteFlag("DELIVERED", CommonConstant.DELETE_FLG.NON_DELETE);
            long totalProductsSold = successfulOrders.stream()
                    .flatMap(order -> order.getOrderItems().stream())
                    .mapToLong(OrderItemEntity::getQuantity)
                    .sum();
            DashboardResponse response = new DashboardResponse();
            response.setTotal(totalProductsSold);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            System.err.println("Error to get total product sold: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    // Tổng doanh thu
    public ResponseAPI<DashboardResponse> getTotalRevenue() {
        try {
            List<OrderEntity> successfulOrders = orderRepository.findByStatusAndDeleteFlag("DELIVERED", CommonConstant.DELETE_FLG.NON_DELETE);
            long totalRevenue = successfulOrders.stream()
                    .mapToLong(OrderEntity::getTotalAmount)
                    .sum();
            DashboardResponse response = new DashboardResponse();
            response.setTotal(totalRevenue);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            System.err.println("Error to get total revenue: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    // Tổng số đơn hàng
    public ResponseAPI<DashboardResponse> getTotalOrders() {
        try {
            long totalOrders = orderRepository.countByDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
            DashboardResponse response = new DashboardResponse();
            response.setTotal(totalOrders);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            System.err.println("Error to get total order: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    // Tổng số khách hàng
    public ResponseAPI<DashboardResponse> getTotalCustomers() {
        try {
            long totalCustomers = userRepository.countByRoleAndDeleteFlag("USER", CommonConstant.DELETE_FLG.NON_DELETE);
            DashboardResponse response = new DashboardResponse();
            response.setTotal(totalCustomers);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            System.err.println("Error to get total customer: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    // Mới: Doanh thu theo tháng (chỉ tính đơn DELIVERED, từ đầu năm đến nay)
    public ResponseAPI<DashboardResponse> getRevenueByMonth() {
        try {
            List<OrderEntity> successfulOrders = orderRepository.findByStatusAndDeleteFlag("DELIVERED", CommonConstant.DELETE_FLG.NON_DELETE);
            Map<String, Long> revenueMap = successfulOrders.stream()
                    .collect(Collectors.groupingBy(
                            order -> new SimpleDateFormat("MM/yyyy").format(order.getOrderDate()),
                            Collectors.summingLong(OrderEntity::getTotalAmount)
                    ));
            List<DashboardResponse.RevenueByMonth> revenueByMonth = new ArrayList<>();
            YearMonth current = YearMonth.now();
            for (int i = 1; i <= current.getMonthValue(); i++) { // Từ tháng 1 đến tháng hiện tại
                String month = String.format("%02d/%d", i, current.getYear());
                long revenue = revenueMap.getOrDefault(month, 0L);
                DashboardResponse.RevenueByMonth item = new DashboardResponse.RevenueByMonth();
                item.setMonth(month);
                item.setRevenue(revenue);
                revenueByMonth.add(item);
            }
            DashboardResponse response = new DashboardResponse();
            response.setRevenueByMonth(revenueByMonth);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            System.err.println("Error to get revenue by month: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    // Mới: Doanh thu theo danh mục (tính từ đơn DELIVERED)
    public ResponseAPI<DashboardResponse> getRevenueByCategory() {
        try {
            List<OrderEntity> successfulOrders = orderRepository.findByStatusAndDeleteFlag("DELIVERED", CommonConstant.DELETE_FLG.NON_DELETE);
            Map<Long, Long> categoryRevenue = successfulOrders.stream()
                    .flatMap(order -> order.getOrderItems().stream())
                    .collect(Collectors.groupingBy(
                            item -> item.getProduct().getCategory().getId(),
                            Collectors.summingLong(item -> item.getPriceAtPurchase() * item.getQuantity())
                    ));
            long totalRevenue = categoryRevenue.values().stream().mapToLong(Long::longValue).sum();
            List<DashboardResponse.RevenueByCategory> revenueByCategory = new ArrayList<>();
            for (Map.Entry<Long, Long> entry : categoryRevenue.entrySet()) {
                CategoryEntity category = categoryRepository.findById(entry.getKey()).orElse(null);
                if (category != null) {
                    DashboardResponse.RevenueByCategory item = new DashboardResponse.RevenueByCategory();
                    item.setCategoryName(category.getName());
                    item.setRevenue(entry.getValue());
                    item.setPercentage(totalRevenue > 0 ? (double) entry.getValue() / totalRevenue * 100 : 0);
                    revenueByCategory.add(item);
                }
            }
            DashboardResponse response = new DashboardResponse();
            response.setRevenueByCategory(revenueByCategory);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            System.err.println("Error to get revenue by category: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    // Mới: Đơn hàng gần đây (5 đơn mới nhất, bất kể status)
    public ResponseAPI<DashboardResponse> getRecentOrders() {
        try {
            List<OrderEntity> recentOrders = orderRepository.findTop5ByDeleteFlagOrderByOrderDateDesc(CommonConstant.DELETE_FLG.NON_DELETE);
            List<DashboardResponse.RecentOrder> responseList = recentOrders.stream().map(order -> {
                DashboardResponse.RecentOrder item = new DashboardResponse.RecentOrder();
                item.setId(order.getId());
                item.setUserId(order.getUser().getId());
                item.setTotalAmount(order.getTotalAmount());
                item.setOrderDateFormatted(new SimpleDateFormat("yyyy/MM/dd").format(order.getOrderDate()));
                item.setStatus(order.getStatus());
                item.setUserName(order.getUser().getFullName()); // Lấy trực tiếp từ entity
                return item;
            }).collect(Collectors.toList());
            DashboardResponse response = new DashboardResponse();
            response.setRecentOrders(responseList);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            System.err.println("Error to get recent orders: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    // Mới: Sản phẩm vừa thêm (5 sản phẩm mới nhất)
    public ResponseAPI<DashboardResponse> getRecentProducts() {
        try {
            List<ProductEntity> recentProducts = productRepository.findTop5ByDeleteFlagOrderByCreatedAtDesc(CommonConstant.DELETE_FLG.NON_DELETE);
            List<DashboardResponse.RecentProduct> responseList = recentProducts.stream().map(product -> {
                DashboardResponse.RecentProduct item = new DashboardResponse.RecentProduct();
                item.setId(product.getId());
                item.setName(product.getName());
                item.setPriceFormatted(product.getDiscountPrice().toString().replaceAll("(\\d)(?=(\\d{3})+$)", "$1.")); // Format 25.000.000
                // Giả sử images là list ImageEntity
                item.setImages(product.getImages().stream().map(img -> {
                    DashboardResponse.RecentProduct.Image image = new DashboardResponse.RecentProduct.Image();
                    image.setImageUrl(img.getImageUrl());
                    image.setMain(img.isMain());
                    return image;
                }).collect(Collectors.toList()));
                return item;
            }).collect(Collectors.toList());
            DashboardResponse response = new DashboardResponse();
            response.setRecentProducts(responseList);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            System.err.println("Error to get recent products: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    // Mới: Sản phẩm bán chạy (top 5 dựa trên quantity sold từ đơn DELIVERED)
    public ResponseAPI<DashboardResponse> getTopProducts() {
        try {
            List<OrderEntity> successfulOrders = orderRepository.findByStatusAndDeleteFlag("DELIVERED", CommonConstant.DELETE_FLG.NON_DELETE);
            Map<Long, Long> productSold = successfulOrders.stream()
                    .flatMap(order -> order.getOrderItems().stream())
                    .collect(Collectors.groupingBy(
                            item -> item.getProduct().getId(),
                            Collectors.summingLong(OrderItemEntity::getQuantity)
                    ));
            Map<Long, Long> productRevenue = successfulOrders.stream()
                    .flatMap(order -> order.getOrderItems().stream())
                    .collect(Collectors.groupingBy(
                            item -> item.getProduct().getId(),
                            Collectors.summingLong(item -> item.getPriceAtPurchase() * item.getQuantity())
                    ));
            // Lấy top 5 theo soldQuantity
            List<Long> topProductIds = productSold.entrySet().stream()
                    .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                    .limit(5)
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());
            List<DashboardResponse.TopProduct> topProducts = topProductIds.stream().map(id -> {
                ProductEntity product = productRepository.findById(id).orElse(null);
                if (product != null) {
                    DashboardResponse.TopProduct item = new DashboardResponse.TopProduct();
                    item.setId(id);
                    item.setName(product.getName());
                    item.setSoldQuantity(productSold.getOrDefault(id, 0L));
                    item.setTotalRevenue(productRevenue.getOrDefault(id, 0L));
                    item.setImages(product.getImages().stream().map(img -> {
                        DashboardResponse.RecentProduct.Image image = new DashboardResponse.RecentProduct.Image();
                        image.setImageUrl(img.getImageUrl());
                        image.setMain(img.isMain());
                        return image;
                    }).collect(Collectors.toList()));
                    return item;
                }
                return null;
            }).filter(Objects::nonNull).collect(Collectors.toList());
            DashboardResponse response = new DashboardResponse();
            response.setTopProducts(topProducts);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            System.err.println("Error to get top products: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    // Mới: Khách hàng mới (top 5 mới nhất)
    public ResponseAPI<DashboardResponse> getRecentCustomers() {
        try {
            List<UserEntity> recentCustomers = userRepository.findTop5ByRoleAndDeleteFlagOrderByCreateDateDesc("USER", CommonConstant.DELETE_FLG.NON_DELETE);
            List<DashboardResponse.RecentCustomer> responseList = recentCustomers.stream().map(user -> {
                DashboardResponse.RecentCustomer item = new DashboardResponse.RecentCustomer();
                item.setId(user.getId());
                item.setFullName(user.getFullName());
                LocalDate localDate = user.getCreateDate()
                        .toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate();
                item.setCreateDate(localDate);
                return item;
            }).collect(Collectors.toList());
            DashboardResponse response = new DashboardResponse();
            response.setRecentCustomers(responseList);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            System.err.println("Error to get recent customers: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }
}