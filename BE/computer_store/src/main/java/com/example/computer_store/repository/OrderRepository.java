package com.example.computer_store.repository;

import com.example.computer_store.model.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByUserIdAndDeleteFlag(Long userId, String deleteFlag);

    long countByDeleteFlag(String deleteFlag);

    List<OrderEntity> findTop5ByDeleteFlagOrderByOrderDateDesc(String deleteFlag);

    List<OrderEntity> findByStatusAndDeleteFlag(String status, String deleteFlag);

    @Query("SELECT o FROM OrderEntity o WHERE o.id = :orderId AND o.user.phone = :phone AND o.deleteFlag = :deleteFlag")
    Optional<OrderEntity> findByIdAndUserPhoneAndDeleteFlag(Long orderId, String phone, String deleteFlag);

    @Query("SELECT o FROM OrderEntity o WHERE o.deleteFlag = :deleteFlag "
            + "AND (LOWER(o.status) LIKE LOWER(CONCAT('%', :keyword, '%')) "
            + "OR LOWER(o.shippingAddress) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<OrderEntity> searchOrders(String keyword, String deleteFlag);

    @Query("SELECT o FROM OrderEntity o WHERE o.deleteFlag = :deleteFlag "
            + "AND (:userId IS NULL OR o.user.id = :userId) "
            + "AND (:status IS NULL OR LOWER(o.status) = LOWER(:status)) "
            + "AND (:minTotal IS NULL OR o.totalAmount >= :minTotal) "
            + "AND (:maxTotal IS NULL OR o.totalAmount <= :maxTotal) "
            + "AND (:startDate IS NULL OR o.orderDate >= :startDate) "
            + "AND (:endDate IS NULL OR o.orderDate <= :endDate)")
    List<OrderEntity> filterOrders(Long userId, String status, Long minTotal, Long maxTotal, Date startDate, Date endDate, String deleteFlag);
}
