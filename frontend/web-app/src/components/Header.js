import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Header() {
  const location = useLocation();
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            🛒 E-commerce Platform
          </Link>
          
          <nav className="nav">
            <Link to="/" className={isActive('/')}>
              🏠 Home
            </Link>
            <Link to="/products" className={isActive('/products')}>
              📦 Products
            </Link>
            <Link to="/services" className={isActive('/services')}>
              🔧 Services
            </Link>
          </nav>

          <div className="header-actions">
            {user ? (
              <div className="user-menu">
                <div 
                  className="user-info"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="welcome-text">
                    Welcome, {user.firstName}! 
                    {user.role === 'admin' && <span className="admin-badge">ADMIN</span>}
                  </span>
                  <span className="dropdown-arrow">▼</span>
                </div>
                
                {showUserMenu && (
                  <div className="user-dropdown">
                    <Link 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      👤 Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      📋 Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="dropdown-item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        ⚙️ Admin Panel
                      </Link>
                    )}
                    <button 
                      className="dropdown-item logout-btn" 
                      onClick={handleLogout}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline btn-sm">
                  🔑 Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  📝 Register
                </Link>
                <Link to="/admin/login" className="btn btn-admin btn-sm">
                  ⚙️ Admin
                </Link>
              </div>
            )}
            
            <Link to="/cart" className="cart-info">
              🛒 Cart ({getTotalItems()})
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
