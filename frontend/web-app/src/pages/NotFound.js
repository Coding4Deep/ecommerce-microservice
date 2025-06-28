import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container">
      <div className="not-found">
        <div className="not-found-icon">🔍</div>
        <h1>404 - Page Not Found</h1>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <p>It might have been moved, deleted, or you entered the wrong URL.</p>
        
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            🏠 Go Home
          </Link>
          <Link to="/products" className="btn btn-outline">
            🛍️ Browse Products
          </Link>
        </div>
        
        <div className="helpful-links">
          <h3>Maybe you were looking for:</h3>
          <ul>
            <li><Link to="/products">📦 Products</Link></li>
            <li><Link to="/services">🔧 Services</Link></li>
            <li><Link to="/cart">🛒 Shopping Cart</Link></li>
            <li><Link to="/login">🔑 Login</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
