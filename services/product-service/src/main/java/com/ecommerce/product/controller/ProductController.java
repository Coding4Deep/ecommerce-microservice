package com.ecommerce.product.controller;

import com.ecommerce.product.model.Product;
import com.ecommerce.product.service.ProductService;
import com.ecommerce.product.dto.ProductRequest;
import com.ecommerce.product.dto.ProductResponse;
import com.ecommerce.product.dto.ProductSearchRequest;
import com.ecommerce.product.dto.PagedResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

import java.util.List;

@RestController
@RequestMapping("/products")
@Tag(name = "Products", description = "Product management operations")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/health")
    @Operation(summary = "Health check endpoint")
    public ResponseEntity<Object> healthCheck() {
        return ResponseEntity.ok().body(Map.of(
            "status", "healthy",
            "service", "product-service",
            "version", "1.0.0",
            "timestamp", LocalDateTime.now()
        ));
    }

    @GetMapping
    @Operation(summary = "Get all products with pagination and filtering")
    @Cacheable(value = "products", key = "#page + '-' + #size + '-' + #category + '-' + #brand")
    public ResponseEntity<PagedResponse<ProductResponse>> getAllProducts(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Category filter") @RequestParam(required = false) String category,
            @Parameter(description = "Brand filter") @RequestParam(required = false) String brand,
            @Parameter(description = "Minimum price") @RequestParam(required = false) BigDecimal minPrice,
            @Parameter(description = "Maximum price") @RequestParam(required = false) BigDecimal maxPrice,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDir) {
        
        ProductSearchRequest searchRequest = ProductSearchRequest.builder()
                .category(category)
                .brand(brand)
                .priceRange(minPrice, maxPrice)
                .sortBy(sortBy, sortDir)
                .page(page, size)
                .build();
        
        PagedResponse<ProductResponse> products = productService.searchProducts(searchRequest);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    @Cacheable(value = "product", key = "#id")
    public ResponseEntity<ProductResponse> getProductById(
            @Parameter(description = "Product ID") @PathVariable String id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/sku/{sku}")
    @Operation(summary = "Get product by SKU")
    @Cacheable(value = "product", key = "#sku")
    public ResponseEntity<ProductResponse> getProductBySku(
            @Parameter(description = "Product SKU") @PathVariable String sku) {
        ProductResponse product = productService.getProductBySku(sku);
        return ResponseEntity.ok(product);
    }

    @PostMapping
    @Operation(summary = "Create a new product")
    @CacheEvict(value = {"products", "categories"}, allEntries = true)
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest productRequest) {
        ProductResponse product = productService.createProduct(productRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing product")
    @CacheEvict(value = {"products", "product"}, allEntries = true)
    public ResponseEntity<ProductResponse> updateProduct(
            @Parameter(description = "Product ID") @PathVariable String id,
            @Valid @RequestBody ProductRequest productRequest) {
        ProductResponse product = productService.updateProduct(id, productRequest);
        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product")
    @CacheEvict(value = {"products", "product"}, allEntries = true)
    public ResponseEntity<Void> deleteProduct(
            @Parameter(description = "Product ID") @PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Search products by text")
    public ResponseEntity<PagedResponse<ProductResponse>> searchProducts(
            @Parameter(description = "Search query") @RequestParam String q,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        
        PagedResponse<ProductResponse> products = productService.searchProductsByText(q, page, size);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured products")
    @Cacheable(value = "featured-products")
    public ResponseEntity<PagedResponse<ProductResponse>> getFeaturedProducts(
            @Parameter(description = "Limit") @RequestParam(defaultValue = "10") int limit) {
        PagedResponse<ProductResponse> products = productService.getFeaturedProducts(0, limit);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/categories/{categoryId}")
    @Operation(summary = "Get products by category")
    @Cacheable(value = "category-products", key = "#categoryId + '-' + #page + '-' + #size")
    public ResponseEntity<PagedResponse<ProductResponse>> getProductsByCategory(
            @Parameter(description = "Category ID") @PathVariable String categoryId,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        
        PagedResponse<ProductResponse> products = productService.getProductsByCategory(categoryId, page, size);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/brands/{brand}")
    @Operation(summary = "Get products by brand")
    @Cacheable(value = "brand-products", key = "#brand + '-' + #page + '-' + #size")
    public ResponseEntity<PagedResponse<ProductResponse>> getProductsByBrand(
            @Parameter(description = "Brand name") @PathVariable String brand,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        
        PagedResponse<ProductResponse> products = productService.getProductsByBrand(brand, page, size);
        return ResponseEntity.ok(products);
    }

    @PatchMapping("/{id}/stock")
    @Operation(summary = "Update product stock")
    @CacheEvict(value = {"products", "product"}, key = "#id")
    public ResponseEntity<ProductResponse> updateStock(
            @Parameter(description = "Product ID") @PathVariable String id,
            @Parameter(description = "New stock quantity") @RequestParam Integer quantity) {
        ProductResponse product = productService.updateStock(id, quantity);
        return ResponseEntity.ok(product);
    }

    @PatchMapping("/{id}/activate")
    @Operation(summary = "Activate/deactivate product")
    @CacheEvict(value = {"products", "product"}, key = "#id")
    public ResponseEntity<ProductResponse> toggleProductStatus(
            @Parameter(description = "Product ID") @PathVariable String id,
            @Parameter(description = "Active status") @RequestParam Boolean active) {
        ProductResponse product = productService.toggleProductStatus(id, active);
        return ResponseEntity.ok(product);
    }

    @PatchMapping("/{id}/feature")
    @Operation(summary = "Feature/unfeature product")
    @CacheEvict(value = {"products", "product", "featured-products"}, allEntries = true)
    public ResponseEntity<ProductResponse> toggleFeaturedStatus(
            @Parameter(description = "Product ID") @PathVariable String id,
            @Parameter(description = "Featured status") @RequestParam Boolean featured) {
        ProductResponse product = productService.toggleFeaturedStatus(id, featured);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/low-stock")
    @Operation(summary = "Get products with low stock")
    public ResponseEntity<List<ProductResponse>> getLowStockProducts() {
        List<ProductResponse> products = productService.getLowStockProducts(5); // Default threshold of 5
        return ResponseEntity.ok(products);
    }

    @GetMapping("/out-of-stock")
    @Operation(summary = "Get out of stock products")
    public ResponseEntity<List<ProductResponse>> getOutOfStockProducts() {
        List<ProductResponse> products = productService.getOutOfStockProducts();
        return ResponseEntity.ok(products);
    }
}
