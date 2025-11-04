package com.example.computer_store.controller;

import com.example.computer_store.common.URLConstant;
import com.example.computer_store.request.News.NewsRequest;
import com.example.computer_store.request.News.NewsFilterRequest;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.response.NewsResponse;
import com.example.computer_store.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class NewsController {
    @Autowired
    private NewsService newsService;

    @GetMapping(URLConstant.NEWS_API.GET_ALL_NEWS)
    public ResponseAPI<List<NewsResponse>> getAllNews() {
        return newsService.getAllNews();
    }

    @GetMapping(URLConstant.NEWS_API.GET_NEWS_BY_ID)
    public ResponseAPI<NewsResponse> getNewsById(@PathVariable Long id) {
        return newsService.getNewsById(id);
    }

    @PostMapping(URLConstant.NEWS_API.CREATE_NEWS)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<NewsResponse> createNews(@RequestBody NewsRequest newsRequest) {
        return newsService.createNews(newsRequest);
    }

    @PutMapping(URLConstant.NEWS_API.UPDATE_NEWS)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<NewsResponse> updateNews(@PathVariable Long id, @RequestBody NewsRequest newsRequest) {
        return newsService.updateNews(id, newsRequest);
    }

    @DeleteMapping(URLConstant.NEWS_API.DELETE_NEWS)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<String> deleteNews(@PathVariable Long id) {
        return newsService.deleteNews(id);
    }

    @GetMapping(URLConstant.NEWS_API.SEARCH_NEWS)
    public ResponseAPI<List<NewsResponse>> searchNews(@RequestParam String keyword) {
        return newsService.searchNews(keyword);
    }

    @PostMapping(URLConstant.NEWS_API.FILTER_NEWS)
    public ResponseAPI<List<NewsResponse>> filterNews(@RequestBody NewsFilterRequest filterRequest) {
        return newsService.filterNews(filterRequest);
    }
}