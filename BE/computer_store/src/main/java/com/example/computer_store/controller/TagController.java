package com.example.computer_store.controller;

import com.example.computer_store.common.URLConstant;
import com.example.computer_store.request.Tag.TagFilterRequest;
import com.example.computer_store.request.Tag.TagRequest;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.response.TagResponse;
import com.example.computer_store.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TagController {
    @Autowired
    TagService tagService;

    @GetMapping(URLConstant.TAG_API.GET_ALL_TAG)
    public ResponseAPI<List<TagResponse>> getAllTags() {
        return tagService.getAllTags();
    }

    @GetMapping(URLConstant.TAG_API.GET_TAG_BY_ID)
    public ResponseAPI<TagResponse> getTagById(@PathVariable Long id) {
        return tagService.getTagById(id);
    }

    @PostMapping(URLConstant.TAG_API.CREATE_TAG)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<TagResponse> createTag(@RequestBody TagRequest tagRequest) {
        return tagService.createTag(tagRequest);
    }

    @PutMapping(URLConstant.TAG_API.UPDATE_TAG)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<TagResponse> updateTag(@PathVariable Long id, @RequestBody TagRequest tagRequest) {
        return tagService.updateTag(id, tagRequest);
    }

    @DeleteMapping(URLConstant.TAG_API.DELETE_TAG)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<String> deleteTag(@PathVariable Long id) {
        return tagService.deleteTag(id);
    }

    @GetMapping(URLConstant.TAG_API.SEARCH_TAG)
    public ResponseAPI<List<TagResponse>> searchTags(@RequestParam String keyword) {
        return tagService.searchTags(keyword);
    }

    @PostMapping(URLConstant.TAG_API.FILTER_TAG)
    public ResponseAPI<List<TagResponse>> filterTags(@RequestBody TagFilterRequest filterRequest) {
        return tagService.filterTags(filterRequest);
    }
}
