import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, sortBy, priceRange]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Use admin service public endpoint with pagination to get all products
      const response = await axios.get('http://localhost:8009/api/v1/products?limit=100&page=1');
      
      if (response.data && response.data.success) {
        const productsData = response.data.data?.products || response.data.data || [];
        console.log('Fetched products:', productsData.length);
        setProducts(productsData);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(productsData.map(p => p.categoryId || p.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } else {
        console.log('No products data received');
        setProducts([]);
        setCategories([]);
      }
      
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to API Gateway if admin service fails
      try {
        const fallbackResponse = await axios.get('/api/products');
        if (fallbackResponse.data) {
          const fallbackData = Array.isArray(fallbackResponse.data) ? fallbackResponse.data : [];
          setProducts(fallbackData);
          const uniqueCategories = [...new Set(fallbackData.map(p => p.category).filter(Boolean))];
          setCategories(uniqueCategories);
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        setProducts([]);
        setCategories([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoryId === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return a.name?.localeCompare(b.name) || 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to add items to cart');
        return;
      }

      await axios.post('/api/cart/add', {
        productId: product._id,
        quantity: 1
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding product to cart');
    }
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="products-title">
          <span className="title-icon">🛍️</span>
          Our Products
        </h1>
        <p className="products-subtitle">
          Discover amazing products at great prices
        </p>
      </div>

      {/* Filters and Search */}
      <div className="products-filters">
        <div className="filter-row">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-filter"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        <div className="price-range">
          <label>Price Range: $0 - ${priceRange.max}</label>
          <div className="range-inputs">
            <input
              type="range"
              min="0"
              max="5000"
              value={priceRange.max}
              onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value)})}
              className="price-slider"
            />
          </div>
        </div>

        <div className="results-info">
          <span>{filteredProducts.length} products found</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">📦</div>
            <h3>No Products Found</h3>
            <p>Try adjusting your search criteria or browse all categories.</p>
            <button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setPriceRange({ min: 0, max: 10000 });
            }} className="reset-filters-btn">
              Reset Filters
            </button>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="placeholder-image">
                    <span className="placeholder-icon">📦</span>
                  </div>
                )}
                {product.isFeatured && (
                  <span className="featured-badge">⭐ Featured</span>
                )}
                {product.stockQuantity === 0 && (
                  <span className="out-of-stock-badge">Out of Stock</span>
                )}
              </div>

              <div className="product-info">
                <div className="product-category">{product.categoryId}</div>
                <h3 className="product-name">
                  <Link to={`/products/${product._id}`}>{product.name}</Link>
                </h3>
                <p className="product-description">
                  {product.description?.substring(0, 100)}...
                </p>
                
                <div className="product-details">
                  <div className="product-price">
                    <span className="price">${product.price}</span>
                    {product.brand && (
                      <span className="brand">by {product.brand}</span>
                    )}
                  </div>
                  
                  <div className="product-rating">
                    <span className="stars">
                      {'⭐'.repeat(Math.floor(product.rating || 4))}
                    </span>
                    <span className="rating-text">
                      ({product.reviewCount || 0} reviews)
                    </span>
                  </div>

                  <div className="product-stock">
                    {product.stockQuantity > 0 ? (
                      <span className="in-stock">✅ In Stock ({product.stockQuantity})</span>
                    ) : (
                      <span className="out-of-stock">❌ Out of Stock</span>
                    )}
                  </div>
                </div>

                <div className="product-actions">
                  <Link to={`/products/${product._id}`} className="view-btn">
                    👁️ View Details
                  </Link>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stockQuantity === 0}
                    className="add-to-cart-btn"
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button (if needed) */}
      {filteredProducts.length > 0 && (
        <div className="load-more">
          <button onClick={fetchProducts} className="load-more-btn">
            🔄 Refresh Products
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
