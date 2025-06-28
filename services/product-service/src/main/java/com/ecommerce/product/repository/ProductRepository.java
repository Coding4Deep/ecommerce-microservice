package com.ecommerce.product.repository;

import com.ecommerce.product.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    
    // Find by categoryId
    Page<Product> findByCategoryId(String categoryId, Pageable pageable);
    
    // Find by brand
    Page<Product> findByBrand(String brand, Pageable pageable);
    
    // Find by categoryId and brand
    Page<Product> findByCategoryIdAndBrand(String categoryId, String brand, Pageable pageable);
    
    // Find by price range
    Page<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    
    // Find by name containing (case insensitive)
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    // Find by SKU
    Optional<Product> findBySku(String sku);
    
    // Find active products
    Page<Product> findByIsActiveTrue(Pageable pageable);
    
    // Find products in stock
    Page<Product> findByStockQuantityGreaterThan(Integer quantity, Pageable pageable);
    
    // Find by tags containing
    Page<Product> findByTagsContaining(String tag, Pageable pageable);
    
    // Complex search query
    @Query("{ $and: [ " +
           "{ $or: [ " +
           "  { 'name': { $regex: ?0, $options: 'i' } }, " +
           "  { 'description': { $regex: ?0, $options: 'i' } }, " +
           "  { 'tags': { $regex: ?0, $options: 'i' } } " +
           "] }, " +
           "{ $or: [ { 'categoryId': ?1 }, { ?1: null } ] }, " +
           "{ $or: [ { 'brand': ?2 }, { ?2: null } ] }, " +
           "{ $or: [ { 'price': { $gte: ?3 } }, { ?3: null } ] }, " +
           "{ $or: [ { 'price': { $lte: ?4 } }, { ?4: null } ] }, " +
           "{ $or: [ { 'stockQuantity': { $gt: 0 } }, { ?5: false } ] }, " +
           "{ 'isActive': true } " +
           "] }")
    Page<Product> searchProducts(String keyword, String categoryId, String brand, 
                                BigDecimal minPrice, BigDecimal maxPrice, 
                                Boolean inStock, Pageable pageable);
    
    // Find products by multiple categories
    Page<Product> findByCategoryIdIn(List<String> categoryIds, Pageable pageable);
    
    // Find products by multiple brands
    Page<Product> findByBrandIn(List<String> brands, Pageable pageable);
    
    // Count products by categoryId
    Long countByCategoryId(String categoryId);
    
    // Count products by brand
    Long countByBrand(String brand);
    
    // Find low stock products
    List<Product> findByStockQuantityLessThanAndIsActiveTrue(Integer threshold);
    
    // Find products created after a certain date
    @Query("{ 'createdAt': { $gte: ?0 }, 'isActive': true }")
    Page<Product> findRecentProducts(java.time.LocalDateTime since, Pageable pageable);
    
    // Find featured products
    Page<Product> findByIsFeaturedTrue(Pageable pageable);
    
    // Get distinct categoryIds
    @Query(value = "{}", fields = "{ 'categoryId': 1 }")
    List<String> findDistinctCategoryIds();
    
    // Get distinct brands
    @Query(value = "{}", fields = "{ 'brand': 1 }")
    List<String> findDistinctBrands();
}
