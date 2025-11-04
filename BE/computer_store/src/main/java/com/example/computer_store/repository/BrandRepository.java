package com.example.computer_store.repository;

import com.example.computer_store.model.entity.BrandEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrandRepository extends JpaRepository<BrandEntity, Long> {
    BrandEntity findByNameAndDeleteFlag(String name, String deleteFlag);

    @Query("SELECT b FROM BrandEntity b WHERE b.deleteFlag = :deleteFlag "
            + "AND (LOWER(b.name) LIKE LOWER(CONCAT('%', :keyword, '%')) "
            + "OR LOWER(b.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<BrandEntity> searchBrands(String keyword, String deleteFlag);

    @Query("SELECT b FROM BrandEntity b WHERE b.deleteFlag = :deleteFlag "
            + "AND (:name IS NULL OR LOWER(b.name) = LOWER(:name)) "
            + "AND (:description IS NULL OR LOWER(b.description) LIKE LOWER(CONCAT('%', :description, '%')))")
    List<BrandEntity> filterBrands(String name, String description, String deleteFlag);
}
