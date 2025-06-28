import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, getItemQuantity } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      // For now, we'll simulate fetching a single product
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const foundProduct = data.products.find(p => p.id === id);
      
      if (!foundProduct) {
        throw new Error('Product not found');
      }
      
      setProduct(foundProduct);
      setError(null);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(`Failed to load product: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
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
          <h2>Loading Product...</h2>
          <p>Fetching product details...</p>
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
          <Link to="/products" className="btn">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="not-found">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const currentQuantityInCart = getItemQuantity(product.id);

  return (
    <div className="container">
      <nav className="breadcrumb">
        <Link to="/">Home</Link> / 
        <Link to="/products">Products</Link> / 
        <span>{product.name}</span>
      </nav>

      <div className="product-detail">
        <div className="product-images">
          <div className="main-image">
            📱 {product.category}
          </div>
          <div className="image-thumbnails">
            <div className="thumbnail active">📱</div>
            <div className="thumbnail">📷</div>
            <div className="thumbnail">🔍</div>
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-brand">Brand: {product.brand}</p>
          
          <div className="product-rating">
            ⭐⭐⭐⭐⭐ (4.8/5) - 245 reviews
          </div>

          <div className="product-price">
            <span className="current-price">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="original-price">{formatPrice(product.comparePrice)}</span>
            )}
          </div>

          <div className="product-status">
            <span className={`status-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
              {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
            </span>
            {currentQuantityInCart > 0 && (
              <span className="cart-status">
                🛒 {currentQuantityInCart} in cart
              </span>
            )}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-features">
            <h3>Features</h3>
            <ul>
              <li>Premium build quality</li>
              <li>Latest technology</li>
              <li>1-year warranty</li>
              <li>Free shipping</li>
            </ul>
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="quantity-input"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                className="btn btn-primary btn-large"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                🛒 Add to Cart
              </button>
              <button className="btn btn-outline btn-large">
                ❤️ Add to Wishlist
              </button>
            </div>
          </div>

          <div className="product-guarantees">
            <div className="guarantee-item">
              <span className="guarantee-icon">🚚</span>
              <div>
                <strong>Free Shipping</strong>
                <p>On orders over $50</p>
              </div>
            </div>
            <div className="guarantee-item">
              <span className="guarantee-icon">↩️</span>
              <div>
                <strong>Easy Returns</strong>
                <p>30-day return policy</p>
              </div>
            </div>
            <div className="guarantee-item">
              <span className="guarantee-icon">🛡️</span>
              <div>
                <strong>Warranty</strong>
                <p>1-year manufacturer warranty</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="product-tabs">
        <div className="tab-headers">
          <button className="tab-header active">📋 Specifications</button>
          <button className="tab-header">⭐ Reviews</button>
          <button className="tab-header">❓ Q&A</button>
        </div>
        
        <div className="tab-content">
          <div className="specifications">
            <h3>Product Specifications</h3>
            <table className="specs-table">
              <tbody>
                <tr>
                  <td>Brand</td>
                  <td>{product.brand}</td>
                </tr>
                <tr>
                  <td>Category</td>
                  <td>{product.category}</td>
                </tr>
                <tr>
                  <td>SKU</td>
                  <td>{product.id}</td>
                </tr>
                <tr>
                  <td>Availability</td>
                  <td>{product.inStock ? 'In Stock' : 'Out of Stock'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
