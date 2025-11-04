package com.example.computer_store.service;

import com.example.computer_store.common.CommonConstant;
import com.example.computer_store.model.entity.NotificationEntity;
import com.example.computer_store.model.entity.UserEntity;
import com.example.computer_store.repository.NotificationRepository;
import com.example.computer_store.repository.UserRepository;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.response.NotificationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public ResponseAPI<List<NotificationResponse>> getAllNotifications() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            UserEntity user = userRepository.findByUsernameAndDeleteFlag(username, CommonConstant.DELETE_FLG.NON_DELETE);
            if (user == null) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_USER);
            }
            List<NotificationEntity> notifications = notificationRepository.findByUserIdAndDeleteFlag(user.getId(), CommonConstant.DELETE_FLG.NON_DELETE);
            List<NotificationResponse> responses = notifications.stream().map(this::mapToResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, responses);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Lỗi khi lấy danh sách thông báo: " + e.getMessage());
        }
    }

    public ResponseAPI<NotificationResponse> getNotificationById(Long id) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            UserEntity user = userRepository.findByUsernameAndDeleteFlag(username, CommonConstant.DELETE_FLG.NON_DELETE);
            if (user == null) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_USER);
            }
            NotificationEntity notification = notificationRepository.findById(id).orElse(null);
            if (notification == null || CommonConstant.DELETE_FLG.DELETE.equals(notification.getDeleteFlag()) || notification.getUser().getId() != user.getId()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, "Không tìm thấy thông báo");
            }
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, mapToResponse(notification));
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Lỗi khi lấy thông báo: " + e.getMessage());
        }
    }

    @Transactional
    public ResponseAPI<NotificationResponse> markAsRead(Long id) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            UserEntity user = userRepository.findByUsernameAndDeleteFlag(username, CommonConstant.DELETE_FLG.NON_DELETE);
            if (user == null) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_USER);
            }
            NotificationEntity notification = notificationRepository.findById(id).orElse(null);
            if (notification == null || CommonConstant.DELETE_FLG.DELETE.equals(notification.getDeleteFlag()) || notification.getUser().getId() != user.getId()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, "Không tìm thấy thông báo");
            }
            notification.setRead(true);
            notificationRepository.save(notification);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, "Đã đánh dấu thông báo là đã đọc", mapToResponse(notification));
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Lỗi khi đánh dấu thông báo: " + e.getMessage());
        }
    }

    @Transactional
    public ResponseAPI<String> markAllAsRead() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            UserEntity user = userRepository.findByUsernameAndDeleteFlag(username, CommonConstant.DELETE_FLG.NON_DELETE);
            if (user == null) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_USER);
            }
            List<NotificationEntity> notifications = notificationRepository.findByUserIdAndDeleteFlag(user.getId(), CommonConstant.DELETE_FLG.NON_DELETE);
            notifications.forEach(notification -> notification.setRead(true));
            notificationRepository.saveAll(notifications);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, "Đã đánh dấu tất cả thông báo là đã đọc", null);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Lỗi khi đánh dấu tất cả thông báo: " + e.getMessage());
        }
    }

    public ResponseAPI<List<NotificationResponse>> getUnreadNotifications() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            UserEntity user = userRepository.findByUsernameAndDeleteFlag(username, CommonConstant.DELETE_FLG.NON_DELETE);
            if (user == null) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_USER);
            }
            List<NotificationEntity> notifications = notificationRepository.findByUserIdAndIsReadAndDeleteFlag(user.getId(), false, CommonConstant.DELETE_FLG.NON_DELETE);
            List<NotificationResponse> responses = notifications.stream().map(this::mapToResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, responses);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Lỗi khi lấy thông báo chưa đọc: " + e.getMessage());
        }
    }

    private NotificationResponse mapToResponse(NotificationEntity entity) {
        NotificationResponse response = new NotificationResponse();
        response.setId(entity.getId());
        response.setUserId(entity.getUser().getId());
        response.setType(entity.getType());
        response.setMessage(entity.getMessage());
        response.setRead(entity.isRead());
        response.setCreatedAt(entity.getCreatedAt());
        response.setDeleteFlag(entity.getDeleteFlag());
        return response;
    }
}