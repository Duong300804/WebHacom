package com.example.computer_store.service;

import com.example.computer_store.common.CommonConstant;
import com.example.computer_store.model.entity.BrandEntity;
import com.example.computer_store.repository.BrandRepository;
import com.example.computer_store.request.Brand.BrandFilterRequest;
import com.example.computer_store.request.Brand.BrandRequest;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.response.BrandResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandService {
    @Autowired
    private BrandRepository brandRepository;

    public ResponseAPI<List<BrandResponse>> getAllBrands() {
        try {
            List<BrandEntity> brands = brandRepository.findAll().stream()
                    .filter(brand -> CommonConstant.DELETE_FLG.NON_DELETE.equals(brand.getDeleteFlag()))
                    .collect(Collectors.toList());
            List<BrandResponse> brandResponseList = brands.stream().map(brand -> {
                BrandResponse response = new BrandResponse();
                response.setId(brand.getId());
                response.setName(brand.getName());
                response.setDescription(brand.getDescription());
                response.setCreatedAt(brand.getCreatedAt());
                response.setUpdatedAt(brand.getUpdatedAt());
                response.setDeleteFlag(brand.getDeleteFlag());
                return response;
            }).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, brandResponseList);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to get list brands: " + e.getMessage());
        }
    }

    public ResponseAPI<BrandResponse> getBrandById(Long id) {
        try {
            BrandEntity brand = brandRepository.findById(id).orElse(null);
            if (brand == null || CommonConstant.DELETE_FLG.DELETE.equals(brand.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_BRAND);
            }
            BrandResponse response = new BrandResponse();
            response.setId(brand.getId());
            response.setName(brand.getName());
            response.setDescription(brand.getDescription());
            response.setCreatedAt(brand.getCreatedAt());
            response.setUpdatedAt(brand.getUpdatedAt());
            response.setDeleteFlag(brand.getDeleteFlag());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to get brand: " + e.getMessage());
        }
    }

    public ResponseAPI<BrandResponse> createBrand(BrandRequest brandRequest) {
        try {
            if (!brandRequest.isValid()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
            }
            BrandEntity existingBrand = brandRepository.findByNameAndDeleteFlag(brandRequest.getName(), CommonConstant.DELETE_FLG.NON_DELETE);
            if (existingBrand != null) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.EXIST_BRAND_NAME);
            }
            BrandEntity brand = new BrandEntity();
            brand.setName(brandRequest.getName());
            brand.setDescription(brandRequest.getDescription());
            brand.setCreatedAt(new Date());
            brand.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
            brandRepository.save(brand);
            BrandResponse response = new BrandResponse();
            response.setId(brand.getId());
            response.setName(brand.getName());
            response.setDescription(brand.getDescription());
            response.setCreatedAt(brand.getCreatedAt());
            response.setUpdatedAt(brand.getUpdatedAt());
            response.setDeleteFlag(brand.getDeleteFlag());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CREATED, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to create brand: " + e.getMessage());
        }
    }

    public ResponseAPI<BrandResponse> updateBrand(Long id, BrandRequest brandRequest) {
        try {
            BrandEntity brand = brandRepository.findById(id).orElse(null);
            if (brand == null || CommonConstant.DELETE_FLG.DELETE.equals(brand.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_BRAND);
            }
            if (!brandRequest.isValidUpdate()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
            }
            BrandEntity existingBrand = brandRepository.findByNameAndDeleteFlag(brandRequest.getName(), CommonConstant.DELETE_FLG.NON_DELETE);
            if (existingBrand != null && existingBrand.getId() != brand.getId()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.EXIST_BRAND_NAME);
            }
            brand.setName(brandRequest.getName());
            brand.setDescription(brandRequest.getDescription());
            brand.setUpdatedAt(new Date());
            brandRepository.save(brand);
            BrandResponse response = new BrandResponse();
            response.setId(brand.getId());
            response.setName(brand.getName());
            response.setDescription(brand.getDescription());
            response.setCreatedAt(brand.getCreatedAt());
            response.setUpdatedAt(brand.getUpdatedAt());
            response.setDeleteFlag(brand.getDeleteFlag());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to update brand: " + e.getMessage());
        }
    }

    public ResponseAPI<String> deleteBrand(Long id) {
        try {
            BrandEntity brand = brandRepository.findById(id).orElse(null);
            if (brand == null || CommonConstant.DELETE_FLG.DELETE.equals(brand.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_BRAND);
            }
            String brandId = String.valueOf(brand.getId());
            brand.setName(brand.getName() + "_deleted_" + brandId);
            brand.setDeleteFlag(CommonConstant.DELETE_FLG.DELETE);
            brand.setUpdatedAt(new Date());
            brandRepository.save(brand);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, CommonConstant.COMMON_MESSAGE.BRAND_DELETED);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to delete brand: " + e.getMessage());
        }
    }

    public ResponseAPI<List<BrandResponse>> searchBrands(String keyword) {
        try {
            List<BrandEntity> brands = brandRepository.searchBrands(keyword, CommonConstant.DELETE_FLG.NON_DELETE);
            List<BrandResponse> brandResponseList = brands.stream().map(brand -> {
                BrandResponse response = new BrandResponse();
                response.setId(brand.getId());
                response.setName(brand.getName());
                response.setDescription(brand.getDescription());
                response.setCreatedAt(brand.getCreatedAt());
                response.setUpdatedAt(brand.getUpdatedAt());
                response.setDeleteFlag(brand.getDeleteFlag());
                return response;
            }).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, brandResponseList);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to search brands: " + e.getMessage());
        }
    }

    public ResponseAPI<List<BrandResponse>> filterBrands(BrandFilterRequest filterRequest) {
        try {
            List<BrandEntity> brands = brandRepository.filterBrands(
                    filterRequest.getName(),
                    filterRequest.getDescription(),
                    CommonConstant.DELETE_FLG.NON_DELETE
            );
            List<BrandResponse> brandResponseList = brands.stream().map(brand -> {
                BrandResponse response = new BrandResponse();
                response.setId(brand.getId());
                response.setName(brand.getName());
                response.setDescription(brand.getDescription());
                response.setCreatedAt(brand.getCreatedAt());
                response.setUpdatedAt(brand.getUpdatedAt());
                response.setDeleteFlag(brand.getDeleteFlag());
                return response;
            }).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, brandResponseList);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to filter brands: " + e.getMessage());
        }
    }
}
