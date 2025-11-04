package com.example.computer_store.controller;

import com.example.computer_store.common.URLConstant;
import com.example.computer_store.request.Brand.BrandFilterRequest;
import com.example.computer_store.request.Brand.BrandRequest;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.response.BrandResponse;
import com.example.computer_store.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class BrandController {
    @Autowired
    BrandService brandService;

    @GetMapping(URLConstant.BRAND_API.GET_ALL_BRAND)
    public ResponseAPI<List<BrandResponse>> getAllBrands() {
        return brandService.getAllBrands();
    }

    @GetMapping(URLConstant.BRAND_API.GET_BRAND_BY_ID)
    public ResponseAPI<BrandResponse> getBrandById(@PathVariable Long id) {
        return brandService.getBrandById(id);
    }

    @PostMapping(URLConstant.BRAND_API.CREATE_BRAND)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<BrandResponse> createBrand(@RequestBody BrandRequest brandRequest) {
        return brandService.createBrand(brandRequest);
    }

    @PutMapping(URLConstant.BRAND_API.UPDATE_BRAND)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<BrandResponse> updateBrand(@PathVariable Long id, @RequestBody BrandRequest brandRequest) {
        return brandService.updateBrand(id, brandRequest);
    }

    @DeleteMapping(URLConstant.BRAND_API.DELETE_BRAND)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<String> deleteBrand(@PathVariable Long id) {
        return brandService.deleteBrand(id);
    }

    @GetMapping(URLConstant.BRAND_API.SEARCH_BRAND)
    public ResponseAPI<List<BrandResponse>> searchBrands(@RequestParam String keyword) {
        return brandService.searchBrands(keyword);
    }

    @PostMapping(URLConstant.BRAND_API.FILTER_BRAND)
    public ResponseAPI<List<BrandResponse>> filterBrands(@RequestBody BrandFilterRequest filterRequest) {
        return brandService.filterBrands(filterRequest);
    }
}
