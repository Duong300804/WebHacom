package com.example.computer_store.controller;

import com.example.computer_store.common.URLConstant;
import com.example.computer_store.request.Banner.BannerRequest;
import com.example.computer_store.request.Banner.BannerFilterRequest;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.response.BannerResponse;
import com.example.computer_store.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class BannerController {
    @Autowired
    private BannerService bannerService;

    @GetMapping(URLConstant.BANNER_API.GET_ALL_BANNER)
    public ResponseAPI<List<BannerResponse>> getAllBanners() {
        return bannerService.getAllBanners();
    }

    @GetMapping(URLConstant.BANNER_API.GET_BANNER_BY_ID)
    public ResponseAPI<BannerResponse> getBannerById(@PathVariable Long id) {
        return bannerService.getBannerById(id);
    }

    @PostMapping(URLConstant.BANNER_API.CREATE_BANNER)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<BannerResponse> createBanner(@RequestBody BannerRequest bannerRequest) {
        return bannerService.createBanner(bannerRequest);
    }

    @PutMapping(URLConstant.BANNER_API.UPDATE_BANNER)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<BannerResponse> updateBanner(@PathVariable Long id, @RequestBody BannerRequest bannerRequest) {
        return bannerService.updateBanner(id, bannerRequest);
    }

    @DeleteMapping(URLConstant.BANNER_API.DELETE_BANNER)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<String> deleteBanner(@PathVariable Long id) {
        return bannerService.deleteBanner(id);
    }

    @GetMapping(URLConstant.BANNER_API.SEARCH_BANNER)
    public ResponseAPI<List<BannerResponse>> searchBanners(@RequestParam String keyword) {
        return bannerService.searchBanners(keyword);
    }

    @PostMapping(URLConstant.BANNER_API.FILTER_BANNER)
    public ResponseAPI<List<BannerResponse>> filterBanners(@RequestBody BannerFilterRequest filterRequest) {
        return bannerService.filterBanners(filterRequest);
    }
}