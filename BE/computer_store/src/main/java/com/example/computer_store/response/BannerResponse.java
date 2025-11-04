package com.example.computer_store.response;

import lombok.Data;

import java.util.Date;

@Data
public class BannerResponse {
    private long id;
    private String imageUrl;
    private String title;
    private String link;
    private String position;
    private boolean isActive;
    private Date createdAt;
    private Date updatedAt;
    private String deleteFlag;
}