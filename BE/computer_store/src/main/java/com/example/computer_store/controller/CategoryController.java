package com.example.computer_store.controller;

import com.example.computer_store.common.URLConstant;
import com.example.computer_store.request.Category.CategoryFilterRequest;
import com.example.computer_store.request.Category.CategoryRequest;
import com.example.computer_store.response.CategoryResponse;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping(URLConstant.CATEGORY_API.GET_ALL_CATEGORY)
    public ResponseAPI<List<CategoryResponse>> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping(URLConstant.CATEGORY_API.GET_CATEGORY_BY_ID)
    public ResponseAPI<CategoryResponse> getCategoryById(@PathVariable Long id) {
        return categoryService.getCategoryById(id);
    }

    @PostMapping(URLConstant.CATEGORY_API.CREATE_CATEGORY)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<CategoryResponse> createCategory(@RequestBody CategoryRequest categoryRequest) {
        return categoryService.createCategory(categoryRequest);
    }

    @PutMapping(URLConstant.CATEGORY_API.UPDATE_CATEGORY)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<CategoryResponse> updateCategory(@PathVariable Long id, @RequestBody CategoryRequest categoryRequest) {
        return categoryService.updateCategory(id, categoryRequest);
    }

    @DeleteMapping(URLConstant.CATEGORY_API.DELETE_CATEGORY)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<String> deleteCategory(@PathVariable Long id) {
        return categoryService.deleteCategory(id);
    }

    @GetMapping(URLConstant.CATEGORY_API.SEARCH_CATEGORY)
    public ResponseAPI<List<CategoryResponse>> searchCategories(@RequestParam String keyword) {
        return categoryService.searchCategories(keyword);
    }

    @PostMapping(URLConstant.CATEGORY_API.FILTER_CATEGORY)
    public ResponseAPI<List<CategoryResponse>> filterCategories(@RequestBody CategoryFilterRequest filterRequest) {
        return categoryService.filterCategories(filterRequest);
    }
}
