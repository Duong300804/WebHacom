package com.example.computer_store.response;

import lombok.Data;

import java.util.Date;

@Data
public class ContentResponse {
    private long id;
    private String title;
    private String description;
    private String imageUrl;
    private Date createdAt;
    private Date updatedAt;
    private String deleteFlag;
}
