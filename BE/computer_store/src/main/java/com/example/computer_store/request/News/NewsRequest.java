package com.example.computer_store.request.News;

import lombok.Data;
import org.springframework.util.StringUtils;

@Data
public class NewsRequest {
    private String title;
    private String summary;
    private String content;
    private String thumbnailUrl;
    private Boolean isHighlight;
    private Boolean isActive;

    private static final String TITLE_REGEX = "^.+$";
    private static final String SUMMARY_REGEX = "^.+$";

    public boolean isValid() {
        if (title != null) title = title.trim();
        if (summary != null) summary = summary.trim();
        if (content != null) content = content.trim();
        if (!StringUtils.hasText(title) || !StringUtils.hasText(summary) || !StringUtils.hasText(content)) {
            return false;
        }
        if (!title.matches(TITLE_REGEX)) return false;
        if (!summary.matches(SUMMARY_REGEX)) return false;
        return true;
    }

    public boolean isValidUpdate() {
        if (title != null) title = title.trim();
        if (summary != null) summary = summary.trim();
        if (content != null) content = content.trim();
        if (title != null && !StringUtils.hasText(title)) return false;
        if (summary != null && !StringUtils.hasText(summary)) return false;
        if (content != null && !StringUtils.hasText(content)) return false;
        if (title != null && !title.matches(TITLE_REGEX)) return false;
        if (summary != null && !summary.matches(SUMMARY_REGEX)) return false;
        return true;
    }
}