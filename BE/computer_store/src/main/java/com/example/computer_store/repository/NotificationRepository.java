package com.example.computer_store.repository;

import com.example.computer_store.model.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    List<NotificationEntity> findByUserIdAndDeleteFlag(Long userId, String deleteFlag);
    List<NotificationEntity> findByUserIdAndIsReadAndDeleteFlag(Long userId, boolean isRead, String deleteFlag);
}
