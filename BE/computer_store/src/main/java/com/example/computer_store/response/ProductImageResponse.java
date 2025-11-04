package com.example.computer_store.response;

import lombok.Data;

@Data
public class ProductImageResponse {
    private long id;
    private String imageUrl;
    private boolean isMain;
}
