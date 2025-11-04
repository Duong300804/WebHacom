package com.example.computer_store.request.Banner;

import lombok.Data;
import org.springframework.util.StringUtils;

@Data
public class BannerRequest {
    private String imageUrl;
    private String title;
    private String link;
    private String position;
    private Boolean isActive;

    private static final String TITLE_REGEX = "^[\\p{L}0-9 .,()\\-+%]+$";
    private static final String POSITION_REGEX = "^[A-Z0-9_]+$";

    public boolean isValid() {
        if (imageUrl != null) imageUrl = imageUrl.trim();
        if (title != null) title = title.trim();
        if (position != null) position = position.trim();
        if (!StringUtils.hasText(imageUrl) || !StringUtils.hasText(title) || !StringUtils.hasText(position)) {
            return false;
        }
        if (!title.matches(TITLE_REGEX)) return false;
        if (!position.matches(POSITION_REGEX)) return false;
        return true;
    }

    public boolean isValidUpdate() {
        if (imageUrl != null) imageUrl = imageUrl.trim();
        if (title != null) title = title.trim();
        if (position != null) position = position.trim();
        if (imageUrl != null && !StringUtils.hasText(imageUrl)) return false;
        if (title != null && !StringUtils.hasText(title)) return false;
        if (position != null && !StringUtils.hasText(position)) return false;
        if (title != null && !title.matches(TITLE_REGEX)) return false;
        if (position != null && !position.matches(POSITION_REGEX)) return false;
        return true;
    }
}
