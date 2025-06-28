import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    alert('Checkout functionality will be implemented with the Order Service!');
  };

  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="page-header">
          <h1>🛒 Shopping Cart</h1>
        </div>
        
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <Link to="/products" className="btn btn-primary">
            🛍️ Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>🛒 Shopping Cart</h1>
        <p>{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="cart-layout">
        <main className="cart-items">
          <div className="cart-header">
            <h2>Items in Cart</h2>
            <button className="btn btn-outline btn-sm" onClick={clearCart}>
              🗑️ Clear Cart
            </button>
          </div>

          <div className="cart-list">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  📱 {item.category}
                </div>
                
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-brand">Brand: {item.brand}</p>
                  <p className="cart-item-price">{formatPrice(item.price)} each</p>
                  <p className="cart-item-description">{item.description}</p>
                </div>
                
                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <label>Quantity:</label>
                    <div className="quantity-input">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                        className="quantity-field"
                      />
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="cart-item-total">
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </div>
                  
                  <button 
                    className="btn btn-outline btn-sm remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        <aside className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            
            <div className="summary-line">
              <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
            
            <div className="summary-line">
              <span>Shipping:</span>
              <span>FREE</span>
            </div>
            
            <div className="summary-line">
              <span>Tax:</span>
              <span>{formatPrice(getTotalPrice() * 0.08)}</span>
            </div>
            
            <hr />
            
            <div className="summary-line total">
              <span><strong>Total:</strong></span>
              <span><strong>{formatPrice(getTotalPrice() * 1.08)}</strong></span>
            </div>
            
            <button className="btn btn-primary btn-full" onClick={handleCheckout}>
              💳 Proceed to Checkout
            </button>
            
            <Link to="/products" className="btn btn-outline btn-full">
              🛍️ Continue Shopping
            </Link>
          </div>
          
          <div className="cart-features">
            <h4>🛡️ Secure Checkout</h4>
            <ul>
              <li>✅ SSL Encrypted</li>
              <li>✅ Multiple Payment Options</li>
              <li>✅ Free Returns</li>
              <li>✅ 24/7 Support</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
