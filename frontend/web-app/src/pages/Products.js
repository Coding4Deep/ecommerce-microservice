import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, sortBy, priceRange]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Try multiple endpoints to ensure we get all products
      let productsData = [];
      
      try {
        // First try admin service with high limit
        const adminResponse = await axios.get('http://localhost:8009/api/v1/products?limit=200&page=1');
        if (adminResponse.data && adminResponse.data.success) {
          productsData = adminResponse.data.data?.products || adminResponse.data.data || [];
          console.log('Fetched from admin service:', productsData.length, 'products');
        }
      } catch (adminError) {
        console.log('Admin service failed, trying API gateway...');
        
        try {
          // Fallback to API Gateway
          const gatewayResponse = await axios.get('http://localhost:8080/api/products?limit=200');
          if (gatewayResponse.data) {
            productsData = Array.isArray(gatewayResponse.data) ? gatewayResponse.data : 
                          gatewayResponse.data.products || gatewayResponse.data.data || [];
            console.log('Fetched from API gateway:', productsData.length, 'products');
          }
        } catch (gatewayError) {
          console.log('API gateway failed, trying product service directly...');
          
          try {
            // Direct product service call
            const directResponse = await axios.get('http://localhost:8002/products?size=200');
            if (directResponse.data) {
              productsData = directResponse.data.content || directResponse.data || [];
              console.log('Fetched from product service:', productsData.length, 'products');
            }
          } catch (directError) {
            console.error('All product endpoints failed:', directError);
            setError('Failed to load products. Please try again later.');
          }
        }
      }

      if (productsData.length > 0) {
        // Ensure all products have required fields
        const validProducts = productsData.map(product => ({
          id: product.id || product._id,
          name: product.name || 'Unnamed Product',
          description: product.description || 'No description available',
          price: parseFloat(product.price) || 0,
          image: product.image || product.imageUrl || '/placeholder-image.jpg',
          category: product.category || product.categoryId || 'Uncategorized',
          brand: product.brand || 'Unknown Brand',
          rating: product.rating || 4.0,
          stock: product.stock || product.quantity || 0,
          inStock: (product.stock || product.quantity || 0) > 0
        }));

        setProducts(validProducts);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(validProducts.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories);
        
        console.log('Final products set:', validProducts.length);
        console.log('Categories found:', uniqueCategories);
      } else {
        setError('No products found');
      }
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleAddToCart = async (product) => {
    try {
      // Add to cart logic here
      console.log('Adding to cart:', product.name);
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error">
        <div className="error-icon">⚠️</div>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={fetchProducts} className="retry-btn">
          🔄 Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="products-container">
      {/* Header Section */}
      <div className="products-header">
        <div className="header-content">
          <h1 className="products-title">
            <span className="title-icon">🛍️</span>
            Our Products
          </h1>
          <p className="products-subtitle">
            Discover amazing products from our collection of {products.length} items
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-container">
          {/* Search Bar */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="rating">Rating (High to Low)</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-group price-range">
            <label className="filter-label">Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                className="price-input"
              />
              <span className="price-separator">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                className="price-input"
              />
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSortBy('name');
              setPriceRange({ min: 0, max: 10000 });
            }}
            className="clear-filters-btn"
          >
            🗑️ Clear Filters
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <p className="results-text">
          Showing {currentProducts.length} of {filteredProducts.length} products
          {selectedCategory && ` in "${selectedCategory}"`}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Products Grid */}
      {currentProducts.length === 0 ? (
        <div className="no-products">
          <div className="no-products-icon">📦</div>
          <h3>No products found</h3>
          <p>Try adjusting your filters or search terms</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setPriceRange({ min: 0, max: 10000 });
            }}
            className="reset-filters-btn"
          >
            🔄 Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {currentProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                  {!product.inStock && (
                    <div className="out-of-stock-overlay">
                      <span>Out of Stock</span>
                    </div>
                  )}
                  <div className="product-overlay">
                    <Link to={`/products/${product.id}`} className="quick-view-btn">
                      👁️ Quick View
                    </Link>
                  </div>
                </div>

                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">
                    {product.description.length > 100
                      ? `${product.description.substring(0, 100)}...`
                      : product.description
                    }
                  </p>
                  
                  <div className="product-rating">
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          className={`star ${star <= product.rating ? 'filled' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="rating-text">({product.rating})</span>
                  </div>

                  <div className="product-footer">
                    <div className="product-price">
                      <span className="price">${product.price.toFixed(2)}</span>
                      <span className="brand">{product.brand}</span>
                    </div>
                    
                    <div className="product-actions">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''}`}
                      >
                        {product.inStock ? '🛒 Add to Cart' : '❌ Out of Stock'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn prev-btn"
              >
                ← Previous
              </button>
              
              <div className="pagination-numbers">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 3 ||
                    pageNumber === currentPage + 3
                  ) {
                    return <span key={pageNumber} className="pagination-ellipsis">...</span>;
                  }
                  return null;
                })}
              </div>
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn next-btn"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Load More Button (Alternative to pagination) */}
      <div className="load-more-section">
        <button onClick={fetchProducts} className="refresh-btn">
          🔄 Refresh Products
        </button>
      </div>
    </div>
  );
};

export default Products;
