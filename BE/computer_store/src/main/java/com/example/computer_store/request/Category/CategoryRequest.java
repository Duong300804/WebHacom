package com.example.computer_store.request.Category;

import lombok.Data;
import org.springframework.util.StringUtils;

@Data
public class CategoryRequest {
    private String name;
    private Long parentId;

    private static final String NAME_REGEX = "^[\\p{L}0-9 ,/\\\\-]+$";

    public boolean isValid() {
        if (name != null) name = name.trim();
        if (!StringUtils.hasText(name)) {
            return false;
        }
        if (!name.matches(NAME_REGEX)) {
            return false;
        }
        return true;
    }

    public boolean isValidUpdate() {
        return isValid();
    }
}
