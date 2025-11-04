package com.example.computer_store.request.Product;

import lombok.Data;

@Data
public class ProductFilterRequest {
    private String code;
    private String name;
    private Long categoryId;
    private Long brandId;
    private Long tagId;
    private Long minPrice;
    private Long maxPrice;
    private Integer inStock;
    private Boolean includeSubCategories;
    private String sortType;
}
