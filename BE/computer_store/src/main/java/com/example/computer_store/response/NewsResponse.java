package com.example.computer_store.response;

import lombok.Data;

import java.util.Date;

@Data
public class NewsResponse {
    private long id;
    private String title;
    private String summary;
    private String content;
    private String thumbnailUrl;
    private boolean isHighlight;
    private boolean isActive;
    private Date createdAt;
    private Date updatedAt;
    private String deleteFlag;
}