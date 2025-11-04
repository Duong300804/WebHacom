package com.example.computer_store.request.Banner;

import lombok.Data;

@Data
public class BannerFilterRequest {
    private String title;
    private String position;
    private Boolean isActive;
}