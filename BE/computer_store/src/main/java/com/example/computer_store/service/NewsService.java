package com.example.computer_store.service;

import com.example.computer_store.common.CommonConstant;
import com.example.computer_store.model.entity.NewsEntity;
import com.example.computer_store.repository.NewsRepository;
import com.example.computer_store.request.News.NewsRequest;
import com.example.computer_store.request.News.NewsFilterRequest;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.response.NewsResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NewsService {
    @Autowired
    private NewsRepository newsRepository;

    public ResponseAPI<List<NewsResponse>> getAllNews() {
        try {
            List<NewsEntity> news = newsRepository.findAll().stream()
                    .filter(n -> CommonConstant.DELETE_FLG.NON_DELETE.equals(n.getDeleteFlag()))
                    .collect(Collectors.toList());
            List<NewsResponse> responses = news.stream().map(this::mapToResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, responses);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Lỗi khi lấy danh sách tin tức: " + e.getMessage());
        }
    }

    public ResponseAPI<NewsResponse> getNewsById(Long id) {
        try {
            NewsEntity news = newsRepository.findById(id).orElse(null);
            if (news == null || CommonConstant.DELETE_FLG.DELETE.equals(news.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, "Không tìm thấy tin tức");
            }
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, mapToResponse(news));
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Lỗi khi lấy tin tức: " + e.getMessage());
        }
    }

    @Transactional
    public ResponseAPI<NewsResponse> createNews(NewsRequest request) {
        try {
            if (!request.isValid()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
            }
            NewsEntity news = new NewsEntity();
            news.setTitle(request.getTitle());
            news.setSummary(request.getSummary());
            news.setContent(request.getContent());
            news.setThumbnailUrl(request.getThumbnailUrl());
            news.setHighlight(request.getIsHighlight() != null ? request.getIsHighlight() : false);
            news.setActive(request.getIsActive() != null ? request.getIsActive() : true);
            news.setCreatedAt(new Date());
            news.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);

            newsRepository.save(news);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CREATED, CommonConstant.COMMON_MESSAGE.OK, mapToResponse(news));
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Lỗi khi tạo tin tức: " + e.getMessage());
        }
    }

    @Transactional
    public ResponseAPI<NewsResponse> updateNews(Long id, NewsRequest request) {
        try {
            NewsEntity news = newsRepository.findById(id).orElse(null);
            if (news == null || CommonConstant.DELETE_FLG.DELETE.equals(news.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, "Không tìm thấy tin tức");
            }
            if (!request.isValidUpdate()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
            }
            if (request.getTitle() != null) news.setTitle(request.getTitle());
            if (request.getSummary() != null) news.setSummary(request.getSummary());
            if (request.getContent() != null) news.setContent(request.getContent());
            if (request.getThumbnailUrl() != null) news.setThumbnailUrl(request.getThumbnailUrl());
            if (request.getIsHighlight() != null) news.setHighlight(request.getIsHighlight());
            if (request.getIsActive() != null) news.setActive(request.getIsActive());
            news.setUpdatedAt(new Date());

            newsRepository.save(news);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, mapToResponse(news));
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Lỗi khi cập nhật tin tức: " + e.getMessage());
        }
    }

    @Transactional
    public ResponseAPI<String> deleteNews(Long id) {
        try {
            NewsEntity news = newsRepository.findById(id).orElse(null);
            if (news == null || CommonConstant.DELETE_FLG.DELETE.equals(news.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, "Không tìm thấy tin tức");
            }
            news.setDeleteFlag(CommonConstant.DELETE_FLG.DELETE);
            news.setUpdatedAt(new Date());
            newsRepository.save(news);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, "Tin tức đã được xóa thành công");
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Lỗi khi xóa tin tức: " + e.getMessage());
        }
    }

    public ResponseAPI<List<NewsResponse>> searchNews(String keyword) {
        try {
            List<NewsEntity> news = newsRepository.searchNews(keyword, CommonConstant.DELETE_FLG.NON_DELETE);
            List<NewsResponse> responses = news.stream().map(this::mapToResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, responses);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Lỗi khi tìm kiếm tin tức: " + e.getMessage());
        }
    }

    public ResponseAPI<List<NewsResponse>> filterNews(NewsFilterRequest filterRequest) {
        try {
            List<NewsEntity> news = newsRepository.filterNews(
                    filterRequest.getTitle(),
                    filterRequest.getIsHighlight(),
                    filterRequest.getIsActive(),
                    CommonConstant.DELETE_FLG.NON_DELETE
            );
            List<NewsResponse> responses = news.stream().map(this::mapToResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, responses);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Lỗi khi lọc tin tức: " + e.getMessage());
        }
    }

    private NewsResponse mapToResponse(NewsEntity news) {
        NewsResponse response = new NewsResponse();
        response.setId(news.getId());
        response.setTitle(news.getTitle());
        response.setSummary(news.getSummary());
        response.setContent(news.getContent());
        response.setThumbnailUrl(news.getThumbnailUrl());
        response.setHighlight(news.isHighlight());
        response.setActive(news.isActive());
        response.setCreatedAt(news.getCreatedAt());
        response.setUpdatedAt(news.getUpdatedAt());
        response.setDeleteFlag(news.getDeleteFlag());
        return response;
    }
}