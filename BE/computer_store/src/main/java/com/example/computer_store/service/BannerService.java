package com.example.computer_store.service;

import com.example.computer_store.common.CommonConstant;
import com.example.computer_store.model.entity.BannerEntity;
import com.example.computer_store.repository.BannerRepository;
import com.example.computer_store.request.Banner.BannerRequest;
import com.example.computer_store.request.Banner.BannerFilterRequest;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.response.BannerResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BannerService {
    @Autowired
    private BannerRepository bannerRepository;

    public ResponseAPI<List<BannerResponse>> getAllBanners() {
        try {
            List<BannerEntity> banners = bannerRepository.findAll().stream()
                    .filter(b -> CommonConstant.DELETE_FLG.NON_DELETE.equals(b.getDeleteFlag()))
                    .collect(Collectors.toList());
            List<BannerResponse> responses = banners.stream().map(this::mapToResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, responses);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Lỗi khi lấy danh sách banner: " + e.getMessage());
        }
    }

    public ResponseAPI<BannerResponse> getBannerById(Long id) {
        try {
            BannerEntity banner = bannerRepository.findById(id).orElse(null);
            if (banner == null || CommonConstant.DELETE_FLG.DELETE.equals(banner.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, "Không tìm thấy banner");
            }
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, mapToResponse(banner));
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Lỗi khi lấy banner: " + e.getMessage());
        }
    }

    @Transactional
    public ResponseAPI<BannerResponse> createBanner(BannerRequest request) {
        try {
            if (!request.isValid()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
            }
            BannerEntity banner = new BannerEntity();
            banner.setImageUrl(request.getImageUrl());
            banner.setTitle(request.getTitle());
            banner.setLink(request.getLink());
            banner.setPosition(request.getPosition());
            banner.setActive(request.getIsActive() != null ? request.getIsActive() : true);
            banner.setCreatedAt(new Date());
            banner.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);

            bannerRepository.save(banner);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CREATED, CommonConstant.COMMON_MESSAGE.OK, mapToResponse(banner));
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Lỗi khi tạo banner: " + e.getMessage());
        }
    }

    @Transactional
    public ResponseAPI<BannerResponse> updateBanner(Long id, BannerRequest request) {
        try {
            BannerEntity banner = bannerRepository.findById(id).orElse(null);
            if (banner == null || CommonConstant.DELETE_FLG.DELETE.equals(banner.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, "Không tìm thấy banner");
            }
            if (!request.isValidUpdate()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
            }
            if (request.getImageUrl() != null) banner.setImageUrl(request.getImageUrl());
            if (request.getTitle() != null) banner.setTitle(request.getTitle());
            if (request.getLink() != null) banner.setLink(request.getLink());
            if (request.getPosition() != null) banner.setPosition(request.getPosition());
            if (request.getIsActive() != null) banner.setActive(request.getIsActive());
            banner.setUpdatedAt(new Date());

            bannerRepository.save(banner);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, mapToResponse(banner));
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Lỗi khi cập nhật banner: " + e.getMessage());
        }
    }

    @Transactional
    public ResponseAPI<String> deleteBanner(Long id) {
        try {
            BannerEntity banner = bannerRepository.findById(id).orElse(null);
            if (banner == null || CommonConstant.DELETE_FLG.DELETE.equals(banner.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, "Không tìm thấy banner");
            }
            banner.setDeleteFlag(CommonConstant.DELETE_FLG.DELETE);
            banner.setUpdatedAt(new Date());
            bannerRepository.save(banner);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, "Banner đã được xóa thành công");
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Lỗi khi xóa banner: " + e.getMessage());
        }
    }

    public ResponseAPI<List<BannerResponse>> searchBanners(String keyword) {
        try {
            List<BannerEntity> banners = bannerRepository.searchBanners(keyword, CommonConstant.DELETE_FLG.NON_DELETE);
            List<BannerResponse> responses = banners.stream().map(this::mapToResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, responses);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Lỗi khi tìm kiếm banner: " + e.getMessage());
        }
    }

    public ResponseAPI<List<BannerResponse>> filterBanners(BannerFilterRequest filterRequest) {
        try {
            List<BannerEntity> banners = bannerRepository.filterBanners(
                    filterRequest.getTitle(),
                    filterRequest.getPosition(),
                    filterRequest.getIsActive(),
                    CommonConstant.DELETE_FLG.NON_DELETE
            );
            List<BannerResponse> responses = banners.stream().map(this::mapToResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, responses);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Lỗi khi lọc banner: " + e.getMessage());
        }
    }

    private BannerResponse mapToResponse(BannerEntity banner) {
        BannerResponse response = new BannerResponse();
        response.setId(banner.getId());
        response.setImageUrl(banner.getImageUrl());
        response.setTitle(banner.getTitle());
        response.setLink(banner.getLink());
        response.setPosition(banner.getPosition());
        response.setActive(banner.isActive());
        response.setCreatedAt(banner.getCreatedAt());
        response.setUpdatedAt(banner.getUpdatedAt());
        response.setDeleteFlag(banner.getDeleteFlag());
        return response;
    }
}