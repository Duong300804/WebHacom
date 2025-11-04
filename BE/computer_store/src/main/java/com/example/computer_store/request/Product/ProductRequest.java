package com.example.computer_store.request.Product;

import com.example.computer_store.request.Configuration.ConfigurationRequest;
import com.example.computer_store.request.Content.ContentRequest;
import com.example.computer_store.request.ProductImage.ProductImageRequest;
import com.example.computer_store.request.Specification.SpecificationRequest;
import lombok.Data;
import org.springframework.util.StringUtils;

import java.util.List;

@Data
public class ProductRequest {
    private Long categoryId;
    private Long brandId;
    private Long tagId;
    private String code;
    private String name;
    private long price;
    private Long discountPrice;
    private int inStock;
    private String videoUrl;
    private List<ConfigurationRequest> configurations;
    private List<SpecificationRequest> specifications;
    private List<ContentRequest> contents;
    private List<ProductImageRequest> images;

    private static final String CODE_REGEX = "^[A-Z0-9-]+$";
    private static final String NAME_REGEX = "^[\\p{L}0-9 .,()\\-+%/]+$";
    private static final String URL_REGEX = "^(https?://)?(www\\.)?(youtube\\.com|youtu\\.be)/.+$";

    public boolean isValid() {
        if (code != null) code = code.trim();
        if (name != null) name = name.trim();
        if (categoryId == null || brandId == null || !StringUtils.hasText(code) || !StringUtils.hasText(name) || price <= 0 || inStock < 0) {
            return false;
        }
        if (!code.matches(CODE_REGEX)) return false;
//        if (!name.matches(NAME_REGEX)) return false;
        if (discountPrice != null && discountPrice >= price) return false;
        if (videoUrl != null && !videoUrl.isEmpty() && !videoUrl.matches(URL_REGEX)) {
            return false;
        }
        // Validate lists if present
        if (configurations != null && configurations.stream().anyMatch(c -> !c.isValid())) return false;
        if (specifications != null && specifications.stream().anyMatch(s -> !s.isValid())) return false;
        if (contents != null && contents.stream().anyMatch(c -> !c.isValid())) return false;
        if (images != null && images.stream().anyMatch(i -> !i.isValid())) return false;
        return true;
    }

    public boolean isValidUpdate() {
        if (code != null) code = code.trim();
        if (name != null) name = name.trim();
        if (categoryId == null || brandId == null || price <= 0 || inStock < 0) {
            return false;
        }
        if (code != null && !code.matches(CODE_REGEX)) return false;
        if (name != null && !name.matches(NAME_REGEX)) return false;
        if (discountPrice != null && discountPrice >= price) return false;
        if (videoUrl != null && !videoUrl.isEmpty() && !videoUrl.matches(URL_REGEX)) {
            return false;
        }
        // Validate lists if present
        if (configurations != null && configurations.stream().anyMatch(c -> !c.isValid())) return false;
        if (specifications != null && specifications.stream().anyMatch(s -> !s.isValid())) return false;
        if (contents != null && contents.stream().anyMatch(c -> !c.isValid())) return false;
        if (images != null && images.stream().anyMatch(i -> !i.isValid())) return false;
        return true;
    }
}
