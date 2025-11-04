package com.example.computer_store.request.Order;

import lombok.Data;

import java.util.List;

@Data
public class OrderUpdateRequest {
    private String status; // Ví dụ: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED

    public boolean isValid() {
        // Kiểm tra status hợp lệ
        return status != null && List.of("PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED").contains(status.toUpperCase());
    }
}
