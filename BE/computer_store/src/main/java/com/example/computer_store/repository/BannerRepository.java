package com.example.computer_store.repository;

import com.example.computer_store.model.entity.BannerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<BannerEntity, Long> {
    @Query("SELECT b FROM BannerEntity b WHERE b.deleteFlag = :deleteFlag "
            + "AND (LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<BannerEntity> searchBanners(String keyword, String deleteFlag);

    @Query("SELECT b FROM BannerEntity b WHERE b.deleteFlag = :deleteFlag "
            + "AND (:title IS NULL OR LOWER(b.title) = LOWER(:title)) "
            + "AND (:position IS NULL OR LOWER(b.position) = LOWER(:position)) "
            + "AND (:isActive IS NULL OR b.isActive = :isActive)")
    List<BannerEntity> filterBanners(String title, String position, Boolean isActive, String deleteFlag);
}