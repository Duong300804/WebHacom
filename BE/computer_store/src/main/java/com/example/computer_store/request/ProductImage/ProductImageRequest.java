package com.example.computer_store.request.ProductImage;

import lombok.Data;
import org.springframework.util.StringUtils;

@Data
public class ProductImageRequest {
    private String imageUrl;
    private boolean isMain;

    public boolean isValid() {
        if (imageUrl != null) imageUrl = imageUrl.trim();
        if (!StringUtils.hasText(imageUrl)) return false;
        return true;
    }
}
