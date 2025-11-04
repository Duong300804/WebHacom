package com.example.computer_store.request.Order;

import lombok.Data;
import org.springframework.util.StringUtils;

import java.util.List;

@Data
public class OrderRequest {
    private String shippingAddress;
    private String shippingMethod;
    private String paymentMethod;
    private String note;
    private List<OrderItemRequest> orderItems;

    public boolean isValid() {
        if (!StringUtils.hasText(shippingAddress)) return false;
        if (orderItems == null || orderItems.isEmpty() || orderItems.stream().anyMatch(item -> item.getProductId() == null || item.getQuantity() <= 0)) return false;
        return true;
    }
}