package com.example.computer_store.request.News;

import lombok.Data;

@Data
public class NewsFilterRequest {
    private String title;
    private Boolean isHighlight;
    private Boolean isActive;
}