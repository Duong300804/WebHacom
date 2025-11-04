package com.example.computer_store.repository;

import com.example.computer_store.model.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    UserEntity findByUsernameAndDeleteFlag(String username, String deleteFlag);
    UserEntity findByEmailAndDeleteFlag(String email, String deleteFlag);
    UserEntity findByPhoneAndDeleteFlag(String phone, String deleteFlag);
    long countByRoleAndDeleteFlag(String role, String deleteFlag);
    List<UserEntity> findTop5ByRoleAndDeleteFlagOrderByCreateDateDesc(String role, String deleteFlag);

    @Query("SELECT u FROM UserEntity u WHERE u.role = :role AND u.deleteFlag = :deleteFlag")
    List<UserEntity> findByRoleAndDeleteFlag(String role, String deleteFlag);

    @Query("SELECT u FROM UserEntity u WHERE u.deleteFlag = :deleteFlag "
            + "AND (LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) "
            + "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) "
            + "OR LOWER(u.role) LIKE LOWER(CONCAT('%', :keyword, '%')) "
            + "OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) "
            + "OR LOWER(u.phone) LIKE LOWER(CONCAT('%', :keyword, '%')) "
            + "OR LOWER(u.address) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<UserEntity> searchUsers(String keyword, String deleteFlag);

    @Query("SELECT u FROM UserEntity u WHERE u.deleteFlag = :deleteFlag "
            + "AND (:username IS NULL OR LOWER(u.username) = LOWER(:username)) "
            + "AND (:email IS NULL OR LOWER(u.email) = LOWER(:email)) "
            + "AND (:role IS NULL OR LOWER(u.role) = LOWER(:role)) "
            + "AND (:fullName IS NULL OR LOWER(u.fullName) = LOWER(:fullName)) "
            + "AND (:phone IS NULL OR LOWER(u.phone) = LOWER(:phone)) "
            + "AND (:position IS NULL OR LOWER(u.position) = LOWER(:position)) "
            + "AND (:address IS NULL OR LOWER(u.address) = LOWER(:address))")
    List<UserEntity> filterUsers(String username, String email, String role, String position, String fullName, String phone, String address, String deleteFlag);

//    @Query("SELECT u FROM UserEntity u WHERE u.deleteFlag = :deleteFlag "
//            + "AND (:username IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :username, '%'))) "
//            + "AND (:email IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%'))) "
//            + "AND (:role IS NULL OR LOWER(u.role) LIKE LOWER(CONCAT('%', :role, '%'))) "
//            + "AND (:fullName IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))) "
//            + "AND (:phone IS NULL OR LOWER(u.phone) LIKE LOWER(CONCAT('%', :phone, '%'))) "
//            + "AND (:address IS NULL OR LOWER(u.address) LIKE LOWER(CONCAT('%', :address, '%')))")
//    List<UserEntity> filterUsers(String username, String email, String role, String fullName, String phone, String address, String deleteFlag);

}
