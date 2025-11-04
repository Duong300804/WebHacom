package com.example.computer_store.service;

import com.example.computer_store.common.CommonConstant;
import com.example.computer_store.model.entity.*;
import com.example.computer_store.repository.*;
import com.example.computer_store.request.Product.ProductFilterRequest;
import com.example.computer_store.request.Product.ProductRequest;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.response.ProductResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private TagRepository tagRepository;
    @Autowired
    private ConfigurationRepository configurationRepository;
    @Autowired
    private SpecificationRepository specificationRepository;
    @Autowired
    private ContentRepository contentRepository;
    @Autowired
    private ProductImageRepository productImageRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    public ResponseAPI<List<ProductResponse>> getAllProducts() {
        try {
            List<ProductEntity> products = productRepository.findAll().stream()
                    .filter(p -> CommonConstant.DELETE_FLG.NON_DELETE.equals(p.getDeleteFlag()))
                    .collect(Collectors.toList());
            List<ProductResponse> responses = products.stream().map(this::mapToResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, responses);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to get list products: " + e.getMessage());
        }
    }

    public ResponseAPI<ProductResponse> getProductById(Long id) {
        try {
            ProductEntity product = productRepository.findById(id).orElse(null);
            if (product == null || CommonConstant.DELETE_FLG.DELETE.equals(product.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_PRODUCT);
            }
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, mapToResponse(product));
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to get product: " + e.getMessage());
        }
    }

    public ResponseAPI<List<ProductResponse>> getProductsByCategory(Long categoryId) {
        try {
            // Kiểm tra xem danh mục có tồn tại không
            CategoryEntity category = categoryRepository.findById(categoryId).orElse(null);
            if (category == null || CommonConstant.DELETE_FLG.DELETE.equals(category.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_CATEGORY);
            }
            // Lấy tất cả danh mục con
            List<Long> categoryIds = categoryRepository.findAll().stream()
                    .filter(c -> CommonConstant.DELETE_FLG.NON_DELETE.equals(c.getDeleteFlag()))
                    .filter(c -> categoryId.equals(c.getId()) || (c.getParent() != null && categoryId.equals(c.getParent().getId())))
                    .map(CategoryEntity::getId)
                    .collect(Collectors.toList());
            // Lấy sản phẩm theo cả danh mục và danh mục con
            List<ProductEntity> products = productRepository.findByCategoryIds(categoryIds, CommonConstant.DELETE_FLG.NON_DELETE);
            List<ProductResponse> responses = products.stream().map(this::mapToResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, responses);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to get products by category: " + e.getMessage());
        }
    }

    @Transactional
    public ResponseAPI<ProductResponse> createProduct(ProductRequest request) {
        try {
            if (!request.isValid()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
            }
            ProductEntity existing = productRepository.findByCodeAndDeleteFlag(request.getCode(), CommonConstant.DELETE_FLG.NON_DELETE);
            if (existing != null) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.EXIST_PRODUCT_CODE);
            }
            CategoryEntity category = categoryRepository.findById(request.getCategoryId()).orElse(null);
            if (category == null || CommonConstant.DELETE_FLG.DELETE.equals(category.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_CATEGORY);
            }
            BrandEntity brand = brandRepository.findById(request.getBrandId()).orElse(null);
            if (brand == null || CommonConstant.DELETE_FLG.DELETE.equals(brand.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_BRAND);
            }
            TagEntity tag = null;
            if (request.getTagId() != null) {
                tag = tagRepository.findById(request.getTagId()).orElse(null);
                if (tag == null || CommonConstant.DELETE_FLG.DELETE.equals(tag.getDeleteFlag())) {
                    return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_TAG);
                }
            }
            ProductEntity product = new ProductEntity();
            product.setCategory(category);
            product.setBrand(brand);
            product.setTag(tag);
            product.setCode(request.getCode());
            product.setName(request.getName());
            product.setPrice(request.getPrice());
            product.setDiscountPrice(request.getDiscountPrice());
            product.setInStock(request.getInStock());
            product.setVideoUrl(request.getVideoUrl());
            product.setCreatedAt(new Date());
            product.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);

            // Save product first
            productRepository.save(product);

            // Add and save children
            addConfigurations(product, request.getConfigurations());
            addSpecifications(product, request.getSpecifications());
            addContents(product, request.getContents());
            addImages(product, request.getImages());

            // Kiểm tra tồn kho và tạo thông báo nếu hết hàng
            if (product.getInStock() == 0) {
                List<UserEntity> admins = userRepository.findByRoleAndDeleteFlag("ADMIN", CommonConstant.DELETE_FLG.NON_DELETE);
                for (UserEntity admin : admins) {
                    NotificationEntity notification = new NotificationEntity();
                    notification.setUser(admin);
                    notification.setType("PRODUCT_OUT_OF_STOCK");
                    notification.setMessage("Sản phẩm " + product.getName() + " đã hết hàng");
                    notification.setRead(false);
                    notification.setCreatedAt(new Date());
                    notification.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
                    notificationRepository.save(notification);
                }
            }

            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CREATED, CommonConstant.COMMON_MESSAGE.OK, mapToResponse(product));
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to create product: " + e.getMessage());
        }
    }

    @Transactional
    public ResponseAPI<ProductResponse> updateProduct(Long id, ProductRequest request) {
        try {
            ProductEntity product = productRepository.findById(id).orElse(null);
            if (product == null || CommonConstant.DELETE_FLG.DELETE.equals(product.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_PRODUCT);
            }
            if (!request.isValidUpdate()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
            }
            if (request.getCode() != null) {
                ProductEntity existing = productRepository.findByCodeAndDeleteFlag(request.getCode(), CommonConstant.DELETE_FLG.NON_DELETE);
                if (existing != null && existing.getId() != product.getId()) {
                    return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.EXIST_PRODUCT_CODE);
                }
                product.setCode(request.getCode());
            }
            if (request.getCategoryId() != null) {
                CategoryEntity category = categoryRepository.findById(request.getCategoryId()).orElse(null);
                if (category == null || CommonConstant.DELETE_FLG.DELETE.equals(category.getDeleteFlag())) {
                    return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_CATEGORY);
                }
                product.setCategory(category);
            }
            if (request.getBrandId() != null) {
                BrandEntity brand = brandRepository.findById(request.getBrandId()).orElse(null);
                if (brand == null || CommonConstant.DELETE_FLG.DELETE.equals(brand.getDeleteFlag())) {
                    return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_BRAND);
                }
                product.setBrand(brand);
            }
            if (request.getTagId() != null) {
                TagEntity tag = tagRepository.findById(request.getTagId()).orElse(null);
                if (tag == null || CommonConstant.DELETE_FLG.DELETE.equals(tag.getDeleteFlag())) {
                    return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_TAG);
                }
                product.setTag(tag);
            }
            boolean wasOutOfStock = product.getInStock() == 0;
            product.setName(request.getName());
            product.setPrice(request.getPrice());
            product.setDiscountPrice(request.getDiscountPrice());
            product.setInStock(request.getInStock());
            if (request.getVideoUrl() != null) {
                product.setVideoUrl(request.getVideoUrl());
            }
            product.setUpdatedAt(new Date());

            // Update children: clear old and add new
            product.getConfigurations().clear();
            addConfigurations(product, request.getConfigurations());
            product.getSpecifications().clear();
            addSpecifications(product, request.getSpecifications());
            product.getContents().clear();
            addContents(product, request.getContents());
            product.getImages().clear();
            addImages(product, request.getImages());

            // Kiểm tra tồn kho và tạo thông báo nếu hết hàng
            if (!wasOutOfStock && product.getInStock() == 0) {
                List<UserEntity> admins = userRepository.findByRoleAndDeleteFlag("ADMIN", CommonConstant.DELETE_FLG.NON_DELETE);
                for (UserEntity admin : admins) {
                    NotificationEntity notification = new NotificationEntity();
                    notification.setUser(admin);
                    notification.setType("PRODUCT_OUT_OF_STOCK");
                    notification.setMessage("Sản phẩm " + product.getName() + " đã hết hàng");
                    notification.setRead(false);
                    notification.setCreatedAt(new Date());
                    notification.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
                    notificationRepository.save(notification);
                }
            }

            productRepository.save(product);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, mapToResponse(product));
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to update product: " + e.getMessage());
        }
    }

    @Transactional
    public ResponseAPI<String> deleteProduct(Long id) {
        try {
            ProductEntity product = productRepository.findById(id).orElse(null);
            if (product == null || CommonConstant.DELETE_FLG.DELETE.equals(product.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_PRODUCT);
            }
            String productId = String.valueOf(product.getId());
            product.setCode(product.getCode() + "_deleted_" + productId);
            product.setDeleteFlag(CommonConstant.DELETE_FLG.DELETE);
            product.setUpdatedAt(new Date());
            // Soft delete children
            product.getConfigurations().forEach(c -> c.setDeleteFlag(CommonConstant.DELETE_FLG.DELETE));
            product.getSpecifications().forEach(s -> s.setDeleteFlag(CommonConstant.DELETE_FLG.DELETE));
            product.getContents().forEach(c -> c.setDeleteFlag(CommonConstant.DELETE_FLG.DELETE));
            // Images no delete_flag, but can remove or keep
            productRepository.save(product);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, CommonConstant.COMMON_MESSAGE.PRODUCT_DELETED);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to delete product: " + e.getMessage());
        }
    }

    public ResponseAPI<List<ProductResponse>> searchProducts(String keyword) {
        try {
            List<ProductEntity> products = productRepository.searchProducts(keyword, CommonConstant.DELETE_FLG.NON_DELETE);
            List<ProductResponse> responses = products.stream().map(this::mapToResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, responses);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to search products: " + e.getMessage());
        }
    }

    public ResponseAPI<List<ProductResponse>> getProductsSortedByPriceAsc() {
        try {
            List<ProductEntity> products = productRepository.findAllByOrderByPriceAsc(CommonConstant.DELETE_FLG.NON_DELETE);
            List<ProductResponse> responses = products.stream().map(this::mapToResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, responses);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to sort price asc: " + e.getMessage());
        }
    }

    public ResponseAPI<List<ProductResponse>> getProductsSortedByPriceDesc() {
        try {
            List<ProductEntity> products = productRepository.findAllByOrderByPriceDesc(CommonConstant.DELETE_FLG.NON_DELETE);
            List<ProductResponse> responses = products.stream().map(this::mapToResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, responses);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to sort price des: " + e.getMessage());
        }
    }

    public ResponseAPI<List<ProductResponse>> getProductsSortedByNewest() {
        try {
            List<ProductEntity> products = productRepository.findAllByOrderByCreatedAtDesc(CommonConstant.DELETE_FLG.NON_DELETE);
            List<ProductResponse> responses = products.stream().map(this::mapToResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, responses);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to sort product newest: " + e.getMessage());
        }
    }

    public ResponseAPI<List<ProductResponse>> filterProducts(ProductFilterRequest filterRequest) {
        try {
            List<ProductEntity> products;
            if (filterRequest.getCategoryId() != null && Boolean.TRUE.equals(filterRequest.getIncludeSubCategories())) {
                CategoryEntity category = categoryRepository.findById(filterRequest.getCategoryId()).orElse(null);
                if (category == null || CommonConstant.DELETE_FLG.DELETE.equals(category.getDeleteFlag())) {
                    return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_CATEGORY);
                }
                List<Long> categoryIds = categoryRepository.findAll().stream()
                        .filter(c -> CommonConstant.DELETE_FLG.NON_DELETE.equals(c.getDeleteFlag()))
                        .filter(c -> filterRequest.getCategoryId().equals(c.getId()) ||
                                (c.getParent() != null && filterRequest.getCategoryId().equals(c.getParent().getId())))
                        .map(CategoryEntity::getId)
                        .collect(Collectors.toList());
                products = productRepository.filterProducts(
                                filterRequest.getCode(),
                                filterRequest.getName(),
                                null,
                                filterRequest.getBrandId(),
                                filterRequest.getTagId(),
                                filterRequest.getMinPrice(),
                                filterRequest.getMaxPrice(),
                                filterRequest.getInStock(),
                                CommonConstant.DELETE_FLG.NON_DELETE
                        ).stream()
                        .filter(p -> categoryIds.contains(p.getCategory().getId()))
                        .collect(Collectors.toList());
            } else {
                products = productRepository.filterProducts(
                        filterRequest.getCode(),
                        filterRequest.getName(),
                        filterRequest.getCategoryId(),
                        filterRequest.getBrandId(),
                        filterRequest.getTagId(),
                        filterRequest.getMinPrice(),
                        filterRequest.getMaxPrice(),
                        filterRequest.getInStock(),
                        CommonConstant.DELETE_FLG.NON_DELETE
                );
            }
            String sortType = filterRequest.getSortType();
            if (sortType != null) {
                switch (sortType) {
                    case "newest":
                        products = products.stream()
                                .sorted(Comparator.comparing(ProductEntity::getCreatedAt).reversed())  // Mới nhất
                                .collect(Collectors.toList());
                        break;
                    case "price_asc":
                        products = products.stream()
                                .sorted(Comparator.comparing(ProductEntity::getDiscountPrice))  // Giá giảm dần tăng
                                .collect(Collectors.toList());
                        break;
                    case "price_desc":
                        products = products.stream()
                                .sorted(Comparator.comparing(ProductEntity::getDiscountPrice).reversed())  // Giá giảm dần giảm
                                .collect(Collectors.toList());
                        break;
                    default:
                        break;
                }
            }
            List<ProductResponse> responses = products.stream().map(this::mapToResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, responses);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to filter products: " + e.getMessage());
        }
    }

    public ResponseAPI<Long> countProductsByFilter(ProductFilterRequest filterRequest) {
        try {
            long count;
            if (filterRequest.getCategoryId() != null && Boolean.TRUE.equals(filterRequest.getIncludeSubCategories())) {
                CategoryEntity category = categoryRepository.findById(filterRequest.getCategoryId()).orElse(null);
                if (category == null || CommonConstant.DELETE_FLG.DELETE.equals(category.getDeleteFlag())) {
                    return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_CATEGORY);
                }
                List<Long> categoryIds = categoryRepository.findAll().stream()
                        .filter(c -> CommonConstant.DELETE_FLG.NON_DELETE.equals(c.getDeleteFlag()))
                        .filter(c -> filterRequest.getCategoryId().equals(c.getId()) ||
                                (c.getParent() != null && filterRequest.getCategoryId().equals(c.getParent().getId())))
                        .map(CategoryEntity::getId)
                        .collect(Collectors.toList());
                // Lấy tất cả sản phẩm thỏa mãn filter rồi lọc theo categoryIds và đếm
                List<ProductEntity> products = productRepository.filterProducts(
                                filterRequest.getCode(),
                                filterRequest.getName(),
                                null, // Không cần categoryId vì lọc sau
                                filterRequest.getBrandId(),
                                filterRequest.getTagId(),
                                filterRequest.getMinPrice(),
                                filterRequest.getMaxPrice(),
                                filterRequest.getInStock(),
                                CommonConstant.DELETE_FLG.NON_DELETE
                        ).stream()
                        .filter(p -> categoryIds.contains(p.getCategory().getId()))
                        .collect(Collectors.toList());
                count = products.size(); // Đếm từ list (hoặc tối ưu bằng query riêng nếu cần)
            } else {
                count = productRepository.countFilterProducts(
                        filterRequest.getCode(),
                        filterRequest.getName(),
                        filterRequest.getCategoryId(),
                        filterRequest.getBrandId(),
                        filterRequest.getTagId(),
                        filterRequest.getMinPrice(),
                        filterRequest.getMaxPrice(),
                        filterRequest.getInStock(),
                        CommonConstant.DELETE_FLG.NON_DELETE
                );
            }
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, count);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to count products by filter: " + e.getMessage());
        }
    }

    private void addConfigurations(ProductEntity product, List<com.example.computer_store.request.Configuration.ConfigurationRequest> requests) {
        if (requests != null) {
            requests.forEach(req -> {
                ConfigurationEntity entity = new ConfigurationEntity();
                entity.setProduct(product);
                entity.setName(req.getName());
                entity.setDescription(req.getDescription());
                entity.setCreatedAt(new Date());
                entity.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
                product.getConfigurations().add(entity);
            });
        }
    }

    private void addSpecifications(ProductEntity product, List<com.example.computer_store.request.Specification.SpecificationRequest> requests) {
        if (requests != null) {
            requests.forEach(req -> {
                SpecificationEntity entity = new SpecificationEntity();
                entity.setProduct(product);
                entity.setName(req.getName());
                entity.setDescription(req.getDescription());
                entity.setCreatedAt(new Date());
                entity.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
                product.getSpecifications().add(entity);
            });
        }
    }

    private void addContents(ProductEntity product, List<com.example.computer_store.request.Content.ContentRequest> requests) {
        if (requests != null) {
            requests.forEach(req -> {
                ContentEntity entity = new ContentEntity();
                entity.setProduct(product);
                entity.setTitle(req.getTitle());
                entity.setDescription(req.getDescription());
                entity.setImageUrl(req.getImageUrl());
                entity.setCreatedAt(new Date());
                entity.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
                product.getContents().add(entity);
            });
        }
    }

    private void addImages(ProductEntity product, List<com.example.computer_store.request.ProductImage.ProductImageRequest> requests) {
        if (requests != null) {
            requests.forEach(req -> {
                ProductImageEntity entity = new ProductImageEntity();
                entity.setProduct(product);
                entity.setImageUrl(req.getImageUrl());
                entity.setMain(req.isMain());
                product.getImages().add(entity);
            });
        }
    }

    private ProductResponse mapToResponse(ProductEntity product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setCategoryId(product.getCategory().getId());
        response.setBrandId(product.getBrand().getId());
        response.setTagId(product.getTag() != null ? product.getTag().getId() : null);
        response.setCode(product.getCode());
        response.setName(product.getName());
        response.setPrice(product.getPrice());
        response.setDiscountPrice(product.getDiscountPrice());
        response.setInStock(product.getInStock());
        response.setVideoUrl(product.getVideoUrl());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        response.setDeleteFlag(product.getDeleteFlag());
        // Map children, filter non-deleted
        response.setConfigurations(product.getConfigurations().stream()
                .filter(c -> CommonConstant.DELETE_FLG.NON_DELETE.equals(c.getDeleteFlag()))
                .map(c -> {
                    com.example.computer_store.response.ConfigurationResponse r = new com.example.computer_store.response.ConfigurationResponse();
                    r.setId(c.getId());
                    r.setName(c.getName());
                    r.setDescription(c.getDescription());
                    r.setCreatedAt(c.getCreatedAt());
                    r.setUpdatedAt(c.getUpdatedAt());
                    r.setDeleteFlag(c.getDeleteFlag());
                    return r;
                }).collect(Collectors.toList()));
        // Tương tự cho specifications, contents, images (images no delete_flag)
        response.setSpecifications(product.getSpecifications().stream()
                .filter(s -> CommonConstant.DELETE_FLG.NON_DELETE.equals(s.getDeleteFlag()))
                .map(s -> {
                    com.example.computer_store.response.SpecificationResponse r = new com.example.computer_store.response.SpecificationResponse();
                    r.setId(s.getId());
                    r.setName(s.getName());
                    r.setDescription(s.getDescription());
                    r.setCreatedAt(s.getCreatedAt());
                    r.setUpdatedAt(s.getUpdatedAt());
                    r.setDeleteFlag(s.getDeleteFlag());
                    return r;
                }).collect(Collectors.toList()));
        response.setContents(product.getContents().stream()
                .filter(c -> CommonConstant.DELETE_FLG.NON_DELETE.equals(c.getDeleteFlag()))
                .map(c -> {
                    com.example.computer_store.response.ContentResponse r = new com.example.computer_store.response.ContentResponse();
                    r.setId(c.getId());
                    r.setTitle(c.getTitle());
                    r.setDescription(c.getDescription());
                    r.setImageUrl(c.getImageUrl());
                    r.setCreatedAt(c.getCreatedAt());
                    r.setUpdatedAt(c.getUpdatedAt());
                    r.setDeleteFlag(c.getDeleteFlag());
                    return r;
                }).collect(Collectors.toList()));
        response.setImages(product.getImages().stream()
                .map(i -> {
                    com.example.computer_store.response.ProductImageResponse r = new com.example.computer_store.response.ProductImageResponse();
                    r.setId(i.getId());
                    r.setImageUrl(i.getImageUrl());
                    r.setMain(i.isMain());
                    return r;
                }).collect(Collectors.toList()));
        return response;
    }
}
