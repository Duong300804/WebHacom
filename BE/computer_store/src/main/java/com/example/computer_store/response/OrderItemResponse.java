package com.example.computer_store.response;

import com.example.computer_store.common.NumberUtils;
import lombok.Data;

@Data
public class OrderItemResponse {
    private Long id;
    private Long productId;
    private Integer quantity;
    private Long priceAtPurchase;

    public String getPriceAtPurchaseFormatted() {
        return NumberUtils.formatNumber(priceAtPurchase);
    }
}
