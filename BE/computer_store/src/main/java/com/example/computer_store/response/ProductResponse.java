package com.example.computer_store.response;

import com.example.computer_store.common.NumberUtils;
import com.example.computer_store.response.ConfigurationResponse;
import com.example.computer_store.response.ContentResponse;
import com.example.computer_store.response.ProductImageResponse;
import com.example.computer_store.response.SpecificationResponse;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class ProductResponse {
    private long id;
    private Long categoryId;
    private Long brandId;
    private Long tagId;
    private String code;
    private String name;
    private long price;
    private Long discountPrice;
    private int inStock;
    private String videoUrl;
    private Date createdAt;
    private Date updatedAt;
    private String deleteFlag;
    private List<ConfigurationResponse> configurations;
    private List<SpecificationResponse> specifications;
    private List<ContentResponse> contents;
    private List<ProductImageResponse> images;

    public String getPriceFormatted() {
        return NumberUtils.formatNumber(price);
    }
    public String getDiscountPriceFormatted() {
        return discountPrice != null ? NumberUtils.formatNumber(discountPrice) : null;
    }
}
