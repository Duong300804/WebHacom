package com.example.computer_store.service;

import com.example.computer_store.common.CommonConstant;
import com.example.computer_store.model.entity.CategoryEntity;
import com.example.computer_store.repository.CategoryRepository;
import com.example.computer_store.request.Category.CategoryFilterRequest;
import com.example.computer_store.request.Category.CategoryRequest;
import com.example.computer_store.response.CategoryResponse;
import com.example.computer_store.response.Common.ResponseAPI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public ResponseAPI<List<CategoryResponse>> getAllCategories() {
        try {
            List<CategoryEntity> categories = categoryRepository.findAll().stream()
                    .filter(category -> CommonConstant.DELETE_FLG.NON_DELETE.equals(category.getDeleteFlag()))
                    .collect(Collectors.toList());
            List<CategoryResponse> categoryResponseList = categories.stream().map(category -> {
                CategoryResponse response = new CategoryResponse();
                response.setId(category.getId());
                response.setName(category.getName());
                response.setParentId(category.getParent() != null ? category.getParent().getId() : null);
                response.setCreatedAt(category.getCreatedAt());
                response.setUpdatedAt(category.getUpdatedAt());
                response.setDeleteFlag(category.getDeleteFlag());
                return response;
            }).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, categoryResponseList);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to get list categories: " + e.getMessage());
        }
    }

    public ResponseAPI<CategoryResponse> getCategoryById(Long id) {
        try {
            CategoryEntity category = categoryRepository.findById(id).orElse(null);
            if (category == null || CommonConstant.DELETE_FLG.DELETE.equals(category.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_CATEGORY);
            }
            CategoryResponse response = new CategoryResponse();
            response.setId(category.getId());
            response.setName(category.getName());
            response.setParentId(category.getParent() != null ? category.getParent().getId() : null);
            response.setCreatedAt(category.getCreatedAt());
            response.setUpdatedAt(category.getUpdatedAt());
            response.setDeleteFlag(category.getDeleteFlag());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to get category: " + e.getMessage());
        }
    }

    public ResponseAPI<CategoryResponse> createCategory(CategoryRequest categoryRequest) {
        try {
            if (!categoryRequest.isValid()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
            }
            CategoryEntity existingCategory = categoryRepository.findByNameAndDeleteFlag(categoryRequest.getName(), CommonConstant.DELETE_FLG.NON_DELETE);
            if (existingCategory != null) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.EXIST_CATEGORY_NAME);
            }
            CategoryEntity category = new CategoryEntity();
            category.setName(categoryRequest.getName());
            if (categoryRequest.getParentId() != null) {
                CategoryEntity parent = categoryRepository.findById(categoryRequest.getParentId()).orElse(null);
                if (parent == null || CommonConstant.DELETE_FLG.DELETE.equals(parent.getDeleteFlag())) {
                    return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_PARENT_CATEGORY);
                }
                category.setParent(parent);
            }
            category.setCreatedAt(new Date());
            category.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
            categoryRepository.save(category);
            CategoryResponse response = new CategoryResponse();
            response.setId(category.getId());
            response.setName(category.getName());
            response.setParentId(category.getParent() != null ? category.getParent().getId() : null);
            response.setCreatedAt(category.getCreatedAt());
            response.setUpdatedAt(category.getUpdatedAt());
            response.setDeleteFlag(category.getDeleteFlag());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CREATED, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to create category: " + e.getMessage());
        }
    }

    public ResponseAPI<CategoryResponse> updateCategory(Long id, CategoryRequest categoryRequest) {
        try {
            CategoryEntity category = categoryRepository.findById(id).orElse(null);
            if (category == null || CommonConstant.DELETE_FLG.DELETE.equals(category.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_CATEGORY);
            }
            if (!categoryRequest.isValidUpdate()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
            }
            CategoryEntity existingCategory = categoryRepository.findByNameAndDeleteFlag(categoryRequest.getName(), CommonConstant.DELETE_FLG.NON_DELETE);
            if (existingCategory != null && existingCategory.getId() != category.getId()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.EXIST_CATEGORY_NAME);
            }
            if (categoryRequest.getParentId() != null) {
                CategoryEntity parent = categoryRepository.findById(categoryRequest.getParentId()).orElse(null);
                if (parent == null || CommonConstant.DELETE_FLG.DELETE.equals(parent.getDeleteFlag())) {
                    return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_PARENT_CATEGORY);
                }
                if (parent.getId() == category.getId()) {
                    return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARENT_CATEGORY);
                }
                category.setParent(parent);
            } else {
                category.setParent(null);
            }
            category.setName(categoryRequest.getName());
            category.setUpdatedAt(new Date());
            categoryRepository.save(category);
            CategoryResponse response = new CategoryResponse();
            response.setId(category.getId());
            response.setName(category.getName());
            response.setParentId(category.getParent() != null ? category.getParent().getId() : null);
            response.setCreatedAt(category.getCreatedAt());
            response.setUpdatedAt(category.getUpdatedAt());
            response.setDeleteFlag(category.getDeleteFlag());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to update category: " + e.getMessage());
        }
    }

    public ResponseAPI<String> deleteCategory(Long id) {
        try {
            CategoryEntity category = categoryRepository.findById(id).orElse(null);
            if (category == null || CommonConstant.DELETE_FLG.DELETE.equals(category.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_CATEGORY);
            }
            // Kiểm tra xem danh mục có danh mục con không
            List<CategoryEntity> subCategories = categoryRepository.findAll().stream()
                    .filter(c -> c.getParent() != null && c.getParent().getId() == id && CommonConstant.DELETE_FLG.NON_DELETE.equals(c.getDeleteFlag()))
                    .collect(Collectors.toList());
            if (!subCategories.isEmpty()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.CATEGORY_HAS_SUBCATEGORIES);
            }
            String categoryId = String.valueOf(category.getId());
            category.setName(category.getName() + "_deleted_" + categoryId);
            category.setDeleteFlag(CommonConstant.DELETE_FLG.DELETE);
            category.setUpdatedAt(new Date());
            categoryRepository.save(category);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, CommonConstant.COMMON_MESSAGE.CATEGORY_DELETED);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to delete category: " + e.getMessage());
        }
    }

    public ResponseAPI<List<CategoryResponse>> searchCategories(String keyword) {
        try {
            List<CategoryEntity> categories = categoryRepository.searchCategories(keyword, CommonConstant.DELETE_FLG.NON_DELETE);
            List<CategoryResponse> categoryResponseList = categories.stream().map(category -> {
                CategoryResponse response = new CategoryResponse();
                response.setId(category.getId());
                response.setName(category.getName());
                response.setParentId(category.getParent() != null ? category.getParent().getId() : null);
                response.setCreatedAt(category.getCreatedAt());
                response.setUpdatedAt(category.getUpdatedAt());
                response.setDeleteFlag(category.getDeleteFlag());
                return response;
            }).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, categoryResponseList);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to search categories: " + e.getMessage());
        }
    }

    public ResponseAPI<List<CategoryResponse>> filterCategories(CategoryFilterRequest filterRequest) {
        try {
            List<CategoryEntity> categories = categoryRepository.filterCategories(
                    filterRequest.getName(),
                    filterRequest.getParentId(),
                    CommonConstant.DELETE_FLG.NON_DELETE
            );
            List<CategoryResponse> categoryResponseList = categories.stream().map(category -> {
                CategoryResponse response = new CategoryResponse();
                response.setId(category.getId());
                response.setName(category.getName());
                response.setParentId(category.getParent() != null ? category.getParent().getId() : null);
                response.setCreatedAt(category.getCreatedAt());
                response.setUpdatedAt(category.getUpdatedAt());
                response.setDeleteFlag(category.getDeleteFlag());
                return response;
            }).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, categoryResponseList);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to filter categories: " + e.getMessage());
        }
    }
}
