package com.ecommerce.product.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductSearchRequest {
    
    private String keyword;
    private String category;
    private String brand;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private List<String> tags;
    private Boolean inStock;
    private String sortBy = "name"; // Default sort by name
    private String sortDirection = "asc"; // Default ascending
    private Integer page = 0; // Default first page
    private Integer size = 20; // Default page size
    
    // Constructors
    public ProductSearchRequest() {}
    
    public ProductSearchRequest(String keyword, String category, String brand) {
        this.keyword = keyword;
        this.category = category;
        this.brand = brand;
    }
    
    // Builder pattern methods for fluent API
    public static ProductSearchRequest builder() {
        return new ProductSearchRequest();
    }
    
    public ProductSearchRequest keyword(String keyword) {
        this.keyword = keyword;
        return this;
    }
    
    public ProductSearchRequest category(String category) {
        this.category = category;
        return this;
    }
    
    public ProductSearchRequest brand(String brand) {
        this.brand = brand;
        return this;
    }
    
    public ProductSearchRequest priceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        return this;
    }
    
    public ProductSearchRequest tags(List<String> tags) {
        this.tags = tags;
        return this;
    }
    
    public ProductSearchRequest inStock(Boolean inStock) {
        this.inStock = inStock;
        return this;
    }
    
    public ProductSearchRequest sortBy(String sortBy, String sortDirection) {
        this.sortBy = sortBy;
        this.sortDirection = sortDirection;
        return this;
    }
    
    public ProductSearchRequest page(Integer page, Integer size) {
        this.page = page;
        this.size = size;
        return this;
    }
    
    public ProductSearchRequest build() {
        return this;
    }
    
    // Getters and Setters
    public String getKeyword() {
        return keyword;
    }
    
    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getBrand() {
        return brand;
    }
    
    public void setBrand(String brand) {
        this.brand = brand;
    }
    
    public BigDecimal getMinPrice() {
        return minPrice;
    }
    
    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }
    
    public BigDecimal getMaxPrice() {
        return maxPrice;
    }
    
    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
    }
    
    public List<String> getTags() {
        return tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags;
    }
    
    public Boolean getInStock() {
        return inStock;
    }
    
    public void setInStock(Boolean inStock) {
        this.inStock = inStock;
    }
    
    public String getSortBy() {
        return sortBy;
    }
    
    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }
    
    public String getSortDirection() {
        return sortDirection;
    }
    
    public void setSortDirection(String sortDirection) {
        this.sortDirection = sortDirection;
    }
    
    public Integer getPage() {
        return page;
    }
    
    public void setPage(Integer page) {
        this.page = page;
    }
    
    public Integer getSize() {
        return size;
    }
    
    public void setSize(Integer size) {
        this.size = size;
    }
}
