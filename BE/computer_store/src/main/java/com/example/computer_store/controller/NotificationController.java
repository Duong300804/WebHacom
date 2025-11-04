package com.example.computer_store.controller;

import com.example.computer_store.common.URLConstant;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.response.NotificationResponse;
import com.example.computer_store.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping(URLConstant.NOTIFICATION_API.GET_ALL_NOTIFICATIONS)
    public ResponseAPI<List<NotificationResponse>> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    @GetMapping(URLConstant.NOTIFICATION_API.GET_NOTIFICATION_BY_ID)
    public ResponseAPI<NotificationResponse> getNotificationById(@PathVariable Long id) {
        return notificationService.getNotificationById(id);
    }

    @PutMapping(URLConstant.NOTIFICATION_API.MARK_AS_READ)
    public ResponseAPI<NotificationResponse> markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }

    @PutMapping(URLConstant.NOTIFICATION_API.MARK_ALL_AS_READ)
    public ResponseAPI<String> markAllAsRead() {
        return notificationService.markAllAsRead();
    }

    @GetMapping(URLConstant.NOTIFICATION_API.GET_UNREAD_NOTIFICATIONS)
    public ResponseAPI<List<NotificationResponse>> getUnreadNotifications() {
        return notificationService.getUnreadNotifications();
    }
}