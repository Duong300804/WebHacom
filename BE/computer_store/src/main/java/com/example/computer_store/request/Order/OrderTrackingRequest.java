package com.example.computer_store.request.Order;

import lombok.Data;
import org.springframework.util.StringUtils;

@Data
public class OrderTrackingRequest {
    private Long orderId;
    private String phone;

    public boolean isValid() {
        return orderId != null && StringUtils.hasText(phone);
    }
}