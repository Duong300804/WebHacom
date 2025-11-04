package com.example.computer_store.response;

import lombok.Data;

import java.util.Date;

@Data
public class NotificationResponse {
    private Long id;
    private Long userId;
    private String type;
    private String message;
    private boolean isRead;
    private Date createdAt;
    private String deleteFlag;
}