package com.example.computer_store.request.Content;

import lombok.Data;
import org.springframework.util.StringUtils;

@Data
public class ContentRequest {
    private String title;
    private String description;
    private String imageUrl;

    private static final String TITLE_REGEX = "^[\\p{L}0-9 .,()\\-+%]+$";

    public boolean isValid() {
        if (title != null) title = title.trim();
        if (!StringUtils.hasText(title)) return false;
//        if (!title.matches(TITLE_REGEX)) return false;
        if (description != null) description = description.trim();
        if (description != null){
            if (!StringUtils.hasText(description)) return false;
        }
        if (imageUrl != null) imageUrl = imageUrl.trim();
        return true;
    }
}
