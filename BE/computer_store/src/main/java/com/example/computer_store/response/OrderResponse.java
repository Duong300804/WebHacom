package com.example.computer_store.response;

import com.example.computer_store.common.NumberUtils;
import com.example.computer_store.common.TimeFormat;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private Long userId;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date orderDate;
    private String status;
    private Long totalAmount;
    private String shippingAddress;
    private String shippingMethod;
    private String paymentMethod;
    private String note;
    private Date createdAt;
    private Date updatedAt;
    private String deleteFlag;
    private List<OrderItemResponse> orderItems;

    // Có thể thêm formatted dates nếu cần, sử dụng TimeFormat
    public String getOrderDateFormatted() {
        return TimeFormat.formatteryyyyMMdd.format(orderDate);
    }

    public String getTotalAmountFormatted() {
        return NumberUtils.formatNumber(totalAmount);
    }
}
