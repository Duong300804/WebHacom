package com.example.computer_store.request.Specification;

import lombok.Data;
import org.springframework.util.StringUtils;

@Data
public class SpecificationRequest {
    private String name;
    private String description;

    private static final String NAME_REGEX = "^[\\p{L}0-9 .,()\\-+%]+$";

    public boolean isValid() {
        if (name != null) name = name.trim();
        if (!StringUtils.hasText(name)) return false;
//        if (!name.matches(NAME_REGEX)) return false;
        if (description != null) description = description.trim();
        if (description != null){
            if (!StringUtils.hasText(description)) return false;
        }
        return true;
    }
}
