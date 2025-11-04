package com.example.computer_store.repository;

import com.example.computer_store.model.entity.NewsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<NewsEntity, Long> {
    @Query("SELECT n FROM NewsEntity n WHERE n.deleteFlag = :deleteFlag "
            + "AND (LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) "
            + "OR LOWER(n.summary) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<NewsEntity> searchNews(String keyword, String deleteFlag);

    @Query("SELECT n FROM NewsEntity n WHERE n.deleteFlag = :deleteFlag "
            + "AND (:title IS NULL OR LOWER(n.title) = LOWER(:title)) "
            + "AND (:isHighlight IS NULL OR n.isHighlight = :isHighlight) "
            + "AND (:isActive IS NULL OR n.isActive = :isActive)")
    List<NewsEntity> filterNews(String title, Boolean isHighlight, Boolean isActive, String deleteFlag);
}