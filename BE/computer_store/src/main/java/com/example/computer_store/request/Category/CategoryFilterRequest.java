package com.example.computer_store.request.Category;

import lombok.Data;

@Data
public class CategoryFilterRequest {
    private String name;
    private Long parentId;
}
