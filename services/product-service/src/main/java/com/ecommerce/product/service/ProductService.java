package com.ecommerce.product.service;

import com.ecommerce.product.dto.*;
import com.ecommerce.product.model.Product;
import com.ecommerce.product.model.Dimensions;
import com.ecommerce.product.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    // Get all products with pagination
    @Cacheable(value = "products", key = "#page + '_' + #size + '_' + #sortBy + '_' + #sortDirection")
    public PagedResponse<ProductResponse> getAllProducts(int page, int size, String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Product> productPage = productRepository.findByIsActiveTrue(pageable);
        
        List<ProductResponse> productResponses = productPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return PagedResponse.of(productResponses, page, size, productPage.getTotalElements());
    }
    
    // Get product by ID
    @Cacheable(value = "product", key = "#id")
    public ProductResponse getProductById(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return convertToResponse(product);
    }
    
    // Get product by SKU
    @Cacheable(value = "product", key = "#sku")
    public ProductResponse getProductBySku(String sku) {
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Product not found with SKU: " + sku));
        return convertToResponse(product);
    }
    
    // Create new product
    @CacheEvict(value = {"products", "categories", "brands"}, allEntries = true)
    public ProductResponse createProduct(ProductRequest request) {
        Product product = convertToEntity(request);
        product.setId(UUID.randomUUID().toString());
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        product.setIsActive(true);
        
        // Generate SKU if not provided
        if (product.getSku() == null || product.getSku().isEmpty()) {
            product.setSku(generateSku(product));
        }
        
        Product savedProduct = productRepository.save(product);
        return convertToResponse(savedProduct);
    }
    
    // Update product
    @CacheEvict(value = {"products", "product", "categories", "brands"}, allEntries = true)
    public ProductResponse updateProduct(String id, ProductRequest request) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        updateProductFromRequest(existingProduct, request);
        existingProduct.setUpdatedAt(LocalDateTime.now());
        
        Product savedProduct = productRepository.save(existingProduct);
        return convertToResponse(savedProduct);
    }
    
    // Delete product (soft delete)
    @CacheEvict(value = {"products", "product", "categories", "brands"}, allEntries = true)
    public void deleteProduct(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        product.setIsActive(false);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
    }
    
    // Search products
    public PagedResponse<ProductResponse> searchProducts(ProductSearchRequest searchRequest) {
        Sort sort = Sort.by(Sort.Direction.fromString(searchRequest.getSortDirection()), 
                           searchRequest.getSortBy());
        Pageable pageable = PageRequest.of(searchRequest.getPage(), searchRequest.getSize(), sort);
        
        Page<Product> productPage = productRepository.searchProducts(
                searchRequest.getKeyword(),
                searchRequest.getCategory(), // This will be mapped to categoryId in the query
                searchRequest.getBrand(),
                searchRequest.getMinPrice(),
                searchRequest.getMaxPrice(),
                searchRequest.getInStock(),
                pageable
        );
        
        List<ProductResponse> productResponses = productPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return PagedResponse.of(productResponses, searchRequest.getPage(), 
                               searchRequest.getSize(), productPage.getTotalElements());
    }
    
    // Get products by category
    @Cacheable(value = "products", key = "'category_' + #categoryId + '_' + #page + '_' + #size")
    public PagedResponse<ProductResponse> getProductsByCategory(String categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage = productRepository.findByCategoryId(categoryId, pageable);
        
        List<ProductResponse> productResponses = productPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return PagedResponse.of(productResponses, page, size, productPage.getTotalElements());
    }
    
    // Get products by brand
    @Cacheable(value = "products", key = "'brand_' + #brand + '_' + #page + '_' + #size")
    public PagedResponse<ProductResponse> getProductsByBrand(String brand, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage = productRepository.findByBrand(brand, pageable);
        
        List<ProductResponse> productResponses = productPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return PagedResponse.of(productResponses, page, size, productPage.getTotalElements());
    }
    
    // Get featured products
    @Cacheable(value = "featured-products", key = "#page + '_' + #size")
    public PagedResponse<ProductResponse> getFeaturedProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage = productRepository.findByIsFeaturedTrue(pageable);
        
        List<ProductResponse> productResponses = productPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return PagedResponse.of(productResponses, page, size, productPage.getTotalElements());
    }
    
    // Get recent products
    public PagedResponse<ProductResponse> getRecentProducts(int page, int size, int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Product> productPage = productRepository.findRecentProducts(since, pageable);
        
        List<ProductResponse> productResponses = productPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return PagedResponse.of(productResponses, page, size, productPage.getTotalElements());
    }
    
    // Get low stock products
    public List<ProductResponse> getLowStockProducts(int threshold) {
        List<Product> products = productRepository.findByStockQuantityLessThanAndIsActiveTrue(threshold);
        return products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get all categories
    @Cacheable(value = "categories")
    public List<String> getAllCategories() {
        return productRepository.findDistinctCategoryIds();
    }
    
    // Get all brands
    @Cacheable(value = "brands")
    public List<String> getAllBrands() {
        return productRepository.findDistinctBrands();
    }
    
    // Update stock quantity
    @CacheEvict(value = {"products", "product"}, allEntries = true)
    public ProductResponse updateStock(String id, int quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        product.setStockQuantity(quantity);
        product.setUpdatedAt(LocalDateTime.now());
        
        Product savedProduct = productRepository.save(product);
        return convertToResponse(savedProduct);
    }
    
    // Search products by text (simple text search)
    public PagedResponse<ProductResponse> searchProductsByText(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage = productRepository.findByNameContainingIgnoreCase(query, pageable);
        
        List<ProductResponse> productResponses = productPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return PagedResponse.of(productResponses, page, size, productPage.getTotalElements());
    }
    
    // Toggle product active status
    @CacheEvict(value = {"products", "product"}, allEntries = true)
    public ProductResponse toggleProductStatus(String id, Boolean active) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        product.setIsActive(active);
        product.setUpdatedAt(LocalDateTime.now());
        
        Product savedProduct = productRepository.save(product);
        return convertToResponse(savedProduct);
    }
    
    // Toggle featured status
    @CacheEvict(value = {"products", "product", "featured-products"}, allEntries = true)
    public ProductResponse toggleFeaturedStatus(String id, Boolean featured) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        product.setIsFeatured(featured);
        product.setUpdatedAt(LocalDateTime.now());
        
        Product savedProduct = productRepository.save(product);
        return convertToResponse(savedProduct);
    }
    
    // Get out of stock products
    public List<ProductResponse> getOutOfStockProducts() {
        List<Product> products = productRepository.findByStockQuantityLessThanAndIsActiveTrue(1);
        return products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Helper methods
    private ProductResponse convertToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setCategory(product.getCategoryId()); // Map categoryId to category
        response.setBrand(product.getBrand());
        response.setStockQuantity(product.getStockQuantity());
        // Map first image from images list to imageUrl
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            response.setImageUrl(product.getImages().get(0));
        }
        response.setTags(product.getTags());
        response.setSku(product.getSku());
        response.setWeight(product.getWeight());
        // Convert Dimensions object to String representation
        if (product.getDimensions() != null) {
            Dimensions dim = product.getDimensions();
            response.setDimensions(dim.getLength() + "x" + dim.getWidth() + "x" + dim.getHeight() + " " + dim.getUnit());
        }
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        response.setActive(product.getIsActive());
        // Convert BigDecimal to Double for averageRating
        if (product.getAverageRating() != null) {
            response.setAverageRating(product.getAverageRating().doubleValue());
        }
        response.setReviewCount(product.getReviewCount());
        return response;
    }
    
    private Product convertToEntity(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategoryId(request.getCategory()); // Map category to categoryId
        product.setBrand(request.getBrand());
        product.setStockQuantity(request.getStockQuantity());
        // Convert single imageUrl to images list
        if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            product.setImages(List.of(request.getImageUrl()));
        }
        product.setTags(request.getTags());
        product.setSku(request.getSku());
        product.setWeight(request.getWeight());
        // Convert dimensions string to Dimensions object if needed
        if (request.getDimensions() != null && !request.getDimensions().isEmpty()) {
            // For now, we'll store it as a simple string representation
            // You can enhance this to parse the string and create a proper Dimensions object
            product.setDimensions(new Dimensions()); // Create empty dimensions for now
        }
        return product;
    }
    
    private void updateProductFromRequest(Product product, ProductRequest request) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategoryId(request.getCategory()); // Map category to categoryId
        product.setBrand(request.getBrand());
        product.setStockQuantity(request.getStockQuantity());
        // Convert single imageUrl to images list
        if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            product.setImages(List.of(request.getImageUrl()));
        }
        product.setTags(request.getTags());
        if (request.getSku() != null && !request.getSku().isEmpty()) {
            product.setSku(request.getSku());
        }
        product.setWeight(request.getWeight());
        // Convert dimensions string to Dimensions object if needed
        if (request.getDimensions() != null && !request.getDimensions().isEmpty()) {
            // For now, we'll store it as a simple string representation
            // You can enhance this to parse the string and create a proper Dimensions object
            product.setDimensions(new Dimensions()); // Create empty dimensions for now
        }
    }
    
    private String generateSku(Product product) {
        String categoryPrefix = product.getCategoryId().substring(0, Math.min(3, product.getCategoryId().length())).toUpperCase();
        String brandPrefix = product.getBrand().substring(0, Math.min(3, product.getBrand().length())).toUpperCase();
        String timestamp = String.valueOf(System.currentTimeMillis()).substring(8);
        return categoryPrefix + "-" + brandPrefix + "-" + timestamp;
    }
}
