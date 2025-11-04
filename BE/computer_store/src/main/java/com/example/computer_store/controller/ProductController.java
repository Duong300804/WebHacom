package com.example.computer_store.controller;

import com.example.computer_store.common.URLConstant;
import com.example.computer_store.request.Product.ProductFilterRequest;
import com.example.computer_store.request.Product.ProductRequest;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.response.ProductResponse;
import com.example.computer_store.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProductController {
    @Autowired
    ProductService productService;

    @GetMapping(URLConstant.PRODUCT_API.GET_ALL_PRODUCT)
    public ResponseAPI<List<ProductResponse>> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping(URLConstant.PRODUCT_API.GET_PRODUCT_BY_ID)
    public ResponseAPI<ProductResponse> getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @PostMapping(URLConstant.PRODUCT_API.CREATE_PRODUCT)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<ProductResponse> createProduct(@RequestBody ProductRequest productRequest) {
        return productService.createProduct(productRequest);
    }

    @PutMapping(URLConstant.PRODUCT_API.UPDATE_PRODUCT)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<ProductResponse> updateProduct(@PathVariable Long id, @RequestBody ProductRequest productRequest) {
        return productService.updateProduct(id, productRequest);
    }

    @DeleteMapping(URLConstant.PRODUCT_API.DELETE_PRODUCT)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<String> deleteProduct(@PathVariable Long id) {
        return productService.deleteProduct(id);
    }

    @GetMapping(URLConstant.PRODUCT_API.SEARCH_PRODUCT)
    public ResponseAPI<List<ProductResponse>> searchProducts(@RequestParam String keyword) {
        return productService.searchProducts(keyword);
    }

    @PostMapping(URLConstant.PRODUCT_API.FILTER_PRODUCT)
    public ResponseAPI<List<ProductResponse>> filterProducts(@RequestBody ProductFilterRequest filterRequest) {
        return productService.filterProducts(filterRequest);
    }

    @GetMapping(URLConstant.PRODUCT_API.GET_BY_CATEGORY)
    public ResponseAPI<List<ProductResponse>> getProductsByCategory(@PathVariable Long categoryId) {
        return productService.getProductsByCategory(categoryId);
    }

    @GetMapping(URLConstant.PRODUCT_API.SORT_PRODUCT_BY_PRICE_ASC)
    public ResponseAPI<List<ProductResponse>> getProductsSortedByPriceAsc() {
        return productService.getProductsSortedByPriceAsc();
    }

    @GetMapping(URLConstant.PRODUCT_API.SORT_PRODUCT_BY_PRICE_DESC)
    public ResponseAPI<List<ProductResponse>> getProductsSortedByPriceDesc() {
        return productService.getProductsSortedByPriceDesc();
    }

    @GetMapping(URLConstant.PRODUCT_API.SORT_PRODUCT_BY_NEWEST)
    public ResponseAPI<List<ProductResponse>> getProductsSortedByNewest() {
        return productService.getProductsSortedByNewest();
    }

    @PostMapping(URLConstant.PRODUCT_API.COUNT_PRODUCT_BY_FILTER)
    public ResponseAPI<Long> countProductsByFilter(@RequestBody ProductFilterRequest filterRequest) {
        return productService.countProductsByFilter(filterRequest);
    }
}
