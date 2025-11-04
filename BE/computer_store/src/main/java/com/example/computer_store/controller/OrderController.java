package com.example.computer_store.controller;

import com.example.computer_store.common.CommonConstant;
import com.example.computer_store.common.URLConstant;
import com.example.computer_store.request.Order.OrderFilterRequest;
import com.example.computer_store.request.Order.OrderRequest;
import com.example.computer_store.request.Order.OrderTrackingRequest;
import com.example.computer_store.request.Order.OrderUpdateRequest;
import com.example.computer_store.response.OrderResponse;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping(URLConstant.ORDER_API.GET_ALL_ORDER)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<List<OrderResponse>> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping(URLConstant.ORDER_API.GET_MY_ORDERS)
    public ResponseAPI<List<OrderResponse>> getMyOrders() {
        return orderService.getMyOrders();
    }

    @GetMapping(URLConstant.ORDER_API.GET_ORDER_BY_ID)
    public ResponseAPI<OrderResponse> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @PostMapping(URLConstant.ORDER_API.CREATE_ORDER)
    public ResponseAPI<OrderResponse> createOrder(@RequestBody OrderRequest orderRequest) {
        return orderService.createOrder(orderRequest);
    }

    @PutMapping(URLConstant.ORDER_API.UPDATE_ORDER)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<OrderResponse> updateOrder(@PathVariable Long id, @RequestBody OrderUpdateRequest updateRequest) {
        return orderService.updateOrder(id, updateRequest);
    }

    @DeleteMapping(URLConstant.ORDER_API.DELETE_ORDER)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<String> deleteOrder(@PathVariable Long id) {
        return orderService.deleteOrder(id);
    }

    @GetMapping(URLConstant.ORDER_API.SEARCH_ORDER)
    public ResponseAPI<List<OrderResponse>> searchOrders(@RequestParam String keyword) {
        return orderService.searchOrders(keyword);
    }

    @PostMapping(URLConstant.ORDER_API.FILTER_ORDER)
    public ResponseAPI<List<OrderResponse>> filterOrders(@RequestBody OrderFilterRequest filterRequest) {
        return orderService.filterOrders(filterRequest);
    }

    @PutMapping(URLConstant.ORDER_API.CANCEL_ORDER)
    public ResponseAPI<OrderResponse> cancelOrder(@PathVariable Long id) {
        return orderService.cancelOrder(id);
    }

    @PostMapping(URLConstant.ORDER_API.TRACK_ORDER)
    public ResponseAPI<OrderResponse> trackOrder(@RequestBody OrderTrackingRequest request) {
        return orderService.trackOrder(request);
    }
}