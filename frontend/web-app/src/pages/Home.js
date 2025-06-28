import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch featured products
      const productsResponse = await fetch('/api/products');
      if (!productsResponse.ok) {
        throw new Error(`HTTP error! status: ${productsResponse.status}`);
      }
      const productsData = await productsResponse.json();
      
      // Fetch categories
      const categoriesResponse = await fetch('/api/categories');
      if (!categoriesResponse.ok) {
        throw new Error(`HTTP error! status: ${categoriesResponse.status}`);
      }
      const categoriesData = await categoriesResponse.json();
      
      setProducts(productsData.products || []);
      setCategories(categoriesData.categories || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`Added ${product.name} to cart!`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <h2>Loading...</h2>
          <p>Fetching featured products and categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button className="btn" onClick={fetchData}>
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>🎉 Welcome to Our E-commerce Platform</h1>
          <p>Discover amazing products powered by microservices architecture</p>
          <p><strong>✅ Platform Status: LIVE & RUNNING!</strong></p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">
              🛍️ Shop Now
            </Link>
            <Link to="/services" className="btn btn-secondary">
              🔧 View Services
            </Link>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Categories Section */}
        <section className="section">
          <div className="section-header">
            <h2>🏷️ Shop by Category</h2>
            <Link to="/products" className="view-all-link">View All Products →</Link>
          </div>
          <div className="categories">
            {categories.map(category => (
              <Link 
                key={category.id} 
                to={`/products?category=${category.slug}`} 
                className="category-card"
              >
                <h3>{category.name}</h3>
                <p>Browse {category.name.toLowerCase()}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="section">
          <div className="section-header">
            <h2>⭐ Featured Products</h2>
            <Link to="/products" className="view-all-link">View All Products →</Link>
          </div>
          <div className="product-grid">
            {products.slice(0, 6).map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  📱 {product.category}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-brand">Brand: {product.brand}</p>
                  <p className="product-price">{formatPrice(product.price)}</p>
                  <p className="product-description">{product.description}</p>
                  <div className="product-status">
                    <span className={`status-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                      {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                    </span>
                  </div>
                  <div className="product-actions">
                    <Link to={`/products/${product.id}`} className="btn btn-secondary">
                      👁️ View Details
                    </Link>
                    <button 
                      className="btn btn-primary" 
                      disabled={!product.inStock}
                      onClick={() => handleAddToCart(product)}
                    >
                      🛒 Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="section">
          <h2>🚀 Platform Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🔧 Microservices Architecture</h3>
              <p>Built with multiple independent services for scalability and reliability</p>
              <Link to="/services" className="btn btn-outline">View Services</Link>
            </div>
            <div className="feature-card">
              <h3>🛒 Shopping Cart</h3>
              <p>Persistent cart that saves your items across sessions</p>
              <Link to="/cart" className="btn btn-outline">View Cart</Link>
            </div>
            <div className="feature-card">
              <h3>👤 User Accounts</h3>
              <p>Create an account to track orders and manage your profile</p>
              <Link to="/register" className="btn btn-outline">Sign Up</Link>
            </div>
            <div className="feature-card">
              <h3>📊 Real-time Data</h3>
              <p>Live product information and inventory updates</p>
              <Link to="/products" className="btn btn-outline">Browse Products</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
