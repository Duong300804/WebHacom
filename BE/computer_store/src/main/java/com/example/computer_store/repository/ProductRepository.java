package com.example.computer_store.repository;

import com.example.computer_store.model.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
    ProductEntity findByCodeAndDeleteFlag(String code, String deleteFlag);

    long countByDeleteFlag(String deleteFlag);

    List<ProductEntity> findTop5ByDeleteFlagOrderByCreatedAtDesc(String deleteFlag);

    @Query("SELECT p FROM ProductEntity p WHERE p.deleteFlag = :deleteFlag "
            + "AND (LOWER(p.code) LIKE LOWER(CONCAT('%', :keyword, '%')) "
            + "OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<ProductEntity> searchProducts(String keyword, String deleteFlag);

    @Query("SELECT p FROM ProductEntity p WHERE p.deleteFlag = :deleteFlag "
            + "AND (:code IS NULL OR LOWER(p.code) = LOWER(:code)) "
            + "AND (:name IS NULL OR LOWER(p.name) = LOWER(:name)) "
            + "AND (:categoryId IS NULL OR p.category.id = :categoryId) "
            + "AND (:brandId IS NULL OR p.brand.id = :brandId) "
            + "AND (:tagId IS NULL OR p.tag.id = :tagId) "
            + "AND (:minPrice IS NULL OR p.discountPrice >= :minPrice) "
            + "AND (:maxPrice IS NULL OR p.discountPrice <= :maxPrice) "
            + "AND (:inStock IS NULL OR (:inStock = 1 AND p.inStock > 0) OR (:inStock = 0 AND p.inStock <= 0))")
    List<ProductEntity> filterProducts(String code, String name, Long categoryId, Long brandId, Long tagId, Long minPrice, Long maxPrice, Integer inStock, String deleteFlag);

//    @Query("SELECT p FROM ProductEntity p WHERE p.deleteFlag = :deleteFlag "
//            + "AND (:code IS NULL OR LOWER(p.code) = LOWER(:code)) "
//            + "AND (:name IS NULL OR LOWER(p.name) = LOWER(:name)) "
//            + "AND (:categoryId IS NULL OR p.category.id = :categoryId) "
//            + "AND (:brandId IS NULL OR p.brand.id = :brandId) "
//            + "AND (:tagId IS NULL OR p.tag.id = :tagId) "
//            + "AND (:minPrice IS NULL OR p.price >= :minPrice) "
//            + "AND (:maxPrice IS NULL OR p.price <= :maxPrice) "
//            + "AND (:inStock IS NULL OR (:inStock = 1 AND p.inStock > 0) OR (:inStock = 0 AND p.inStock <= 0))")
//    List<ProductEntity> filterProducts(String code, String name, Long categoryId, Long brandId, Long tagId, Long minPrice, Long maxPrice, Integer inStock, String deleteFlag);

    @Query("SELECT p FROM ProductEntity p WHERE p.deleteFlag = :deleteFlag AND p.category.id IN :categoryIds")
    List<ProductEntity> findByCategoryIds(List<Long> categoryIds, String deleteFlag);

    @Query("SELECT p FROM ProductEntity p WHERE p.deleteFlag = :deleteFlag ORDER BY p.price ASC")
    List<ProductEntity> findAllByOrderByPriceAsc(String deleteFlag);

    @Query("SELECT p FROM ProductEntity p WHERE p.deleteFlag = :deleteFlag ORDER BY p.price DESC")
    List<ProductEntity> findAllByOrderByPriceDesc(String deleteFlag);

    @Query("SELECT p FROM ProductEntity p WHERE p.deleteFlag = :deleteFlag ORDER BY p.createdAt DESC")
    List<ProductEntity> findAllByOrderByCreatedAtDesc(String deleteFlag);

    @Query("SELECT COUNT(p) FROM ProductEntity p WHERE p.deleteFlag = :deleteFlag "
            + "AND (:code IS NULL OR LOWER(p.code) = LOWER(:code)) "
            + "AND (:name IS NULL OR LOWER(p.name) = LOWER(:name)) "
            + "AND (:categoryId IS NULL OR p.category.id = :categoryId) "
            + "AND (:brandId IS NULL OR p.brand.id = :brandId) "
            + "AND (:tagId IS NULL OR p.tag.id = :tagId) "
            + "AND (:minPrice IS NULL OR p.discountPrice >= :minPrice) "
            + "AND (:maxPrice IS NULL OR p.discountPrice <= :maxPrice) "
            + "AND (:inStock IS NULL OR (:inStock = 1 AND p.inStock > 0) OR (:inStock = 0 AND p.inStock <= 0))")
    long countFilterProducts(String code, String name, Long categoryId, Long brandId, Long tagId, Long minPrice, Long maxPrice, Integer inStock, String deleteFlag);
}