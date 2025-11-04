package com.example.computer_store.repository;

import com.example.computer_store.model.entity.TagEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<TagEntity, Long> {
    TagEntity findByNameAndDeleteFlag(String name, String deleteFlag);

    @Query("SELECT t FROM TagEntity t WHERE t.deleteFlag = :deleteFlag "
            + "AND LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<TagEntity> searchTags(String keyword, String deleteFlag);

    @Query("SELECT t FROM TagEntity t WHERE t.deleteFlag = :deleteFlag "
            + "AND (:name IS NULL OR LOWER(t.name) = LOWER(:name))")
    List<TagEntity> filterTags(String name, String deleteFlag);
}
