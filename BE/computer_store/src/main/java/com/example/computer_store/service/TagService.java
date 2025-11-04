package com.example.computer_store.service;

import com.example.computer_store.common.CommonConstant;
import com.example.computer_store.model.entity.TagEntity;
import com.example.computer_store.repository.TagRepository;
import com.example.computer_store.request.Tag.TagFilterRequest;
import com.example.computer_store.request.Tag.TagRequest;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.response.TagResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TagService {
    @Autowired
    private TagRepository tagRepository;

    public ResponseAPI<List<TagResponse>> getAllTags() {
        try {
            List<TagEntity> tags = tagRepository.findAll().stream()
                    .filter(tag -> CommonConstant.DELETE_FLG.NON_DELETE.equals(tag.getDeleteFlag()))
                    .collect(Collectors.toList());
            List<TagResponse> tagResponseList = tags.stream().map(tag -> {
                TagResponse response = new TagResponse();
                response.setId(tag.getId());
                response.setName(tag.getName());
                response.setCreatedAt(tag.getCreatedAt());
                response.setUpdatedAt(tag.getUpdatedAt());
                response.setDeleteFlag(tag.getDeleteFlag());
                return response;
            }).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, tagResponseList);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to get list tags: " + e.getMessage());
        }
    }

    public ResponseAPI<TagResponse> getTagById(Long id) {
        try {
            TagEntity tag = tagRepository.findById(id).orElse(null);
            if (tag == null || CommonConstant.DELETE_FLG.DELETE.equals(tag.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_TAG);
            }
            TagResponse response = new TagResponse();
            response.setId(tag.getId());
            response.setName(tag.getName());
            response.setCreatedAt(tag.getCreatedAt());
            response.setUpdatedAt(tag.getUpdatedAt());
            response.setDeleteFlag(tag.getDeleteFlag());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to get tag: " + e.getMessage());
        }
    }

    public ResponseAPI<TagResponse> createTag(TagRequest tagRequest) {
        try {
            if (!tagRequest.isValid()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
            }
            TagEntity existingTag = tagRepository.findByNameAndDeleteFlag(tagRequest.getName(), CommonConstant.DELETE_FLG.NON_DELETE);
            if (existingTag != null) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.EXIST_TAG_NAME);
            }
            TagEntity tag = new TagEntity();
            tag.setName(tagRequest.getName());
            tag.setCreatedAt(new Date());
            tag.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
            tagRepository.save(tag);
            TagResponse response = new TagResponse();
            response.setId(tag.getId());
            response.setName(tag.getName());
            response.setCreatedAt(tag.getCreatedAt());
            response.setUpdatedAt(tag.getUpdatedAt());
            response.setDeleteFlag(tag.getDeleteFlag());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CREATED, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to create tag: " + e.getMessage());
        }
    }

    public ResponseAPI<TagResponse> updateTag(Long id, TagRequest tagRequest) {
        try {
            TagEntity tag = tagRepository.findById(id).orElse(null);
            if (tag == null || CommonConstant.DELETE_FLG.DELETE.equals(tag.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_TAG);
            }
            if (!tagRequest.isValidUpdate()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
            }
            TagEntity existingTag = tagRepository.findByNameAndDeleteFlag(tagRequest.getName(), CommonConstant.DELETE_FLG.NON_DELETE);
            if (existingTag != null && existingTag.getId() != tag.getId()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.EXIST_TAG_NAME);
            }
            tag.setName(tagRequest.getName());
            tag.setUpdatedAt(new Date());
            tagRepository.save(tag);
            TagResponse response = new TagResponse();
            response.setId(tag.getId());
            response.setName(tag.getName());
            response.setCreatedAt(tag.getCreatedAt());
            response.setUpdatedAt(tag.getUpdatedAt());
            response.setDeleteFlag(tag.getDeleteFlag());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to update tag: " + e.getMessage());
        }
    }

    public ResponseAPI<String> deleteTag(Long id) {
        try {
            TagEntity tag = tagRepository.findById(id).orElse(null);
            if (tag == null || CommonConstant.DELETE_FLG.DELETE.equals(tag.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_TAG);
            }
            String tagId = String.valueOf(tag.getId());
            tag.setName(tag.getName() + "_deleted_" + tagId);
            tag.setDeleteFlag(CommonConstant.DELETE_FLG.DELETE);
            tag.setUpdatedAt(new Date());
            tagRepository.save(tag);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, CommonConstant.COMMON_MESSAGE.TAG_DELETED);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to delete tag: " + e.getMessage());
        }
    }

    public ResponseAPI<List<TagResponse>> searchTags(String keyword) {
        try {
            List<TagEntity> tags = tagRepository.searchTags(keyword, CommonConstant.DELETE_FLG.NON_DELETE);
            List<TagResponse> tagResponseList = tags.stream().map(tag -> {
                TagResponse response = new TagResponse();
                response.setId(tag.getId());
                response.setName(tag.getName());
                response.setCreatedAt(tag.getCreatedAt());
                response.setUpdatedAt(tag.getUpdatedAt());
                response.setDeleteFlag(tag.getDeleteFlag());
                return response;
            }).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, tagResponseList);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to search tags: " + e.getMessage());
        }
    }

    public ResponseAPI<List<TagResponse>> filterTags(TagFilterRequest filterRequest) {
        try {
            List<TagEntity> tags = tagRepository.filterTags(
                    filterRequest.getName(),
                    CommonConstant.DELETE_FLG.NON_DELETE
            );
            List<TagResponse> tagResponseList = tags.stream().map(tag -> {
                TagResponse response = new TagResponse();
                response.setId(tag.getId());
                response.setName(tag.getName());
                response.setCreatedAt(tag.getCreatedAt());
                response.setUpdatedAt(tag.getUpdatedAt());
                response.setDeleteFlag(tag.getDeleteFlag());
                return response;
            }).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, tagResponseList);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to filter tags: " + e.getMessage());
        }
    }
}