package com.example.computer_store.repository;

import com.example.computer_store.model.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    CategoryEntity findByNameAndDeleteFlag(String name, String deleteFlag);

    @Query("SELECT c FROM CategoryEntity c WHERE c.deleteFlag = :deleteFlag "
            + "AND LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<CategoryEntity> searchCategories(String keyword, String deleteFlag);

    @Query("SELECT c FROM CategoryEntity c WHERE c.deleteFlag = :deleteFlag "
            + "AND (:name IS NULL OR LOWER(c.name) = LOWER(:name)) "
            + "AND (:parentId IS NULL OR c.parent.id = :parentId)")
    List<CategoryEntity> filterCategories(String name, Long parentId, String deleteFlag);
}
