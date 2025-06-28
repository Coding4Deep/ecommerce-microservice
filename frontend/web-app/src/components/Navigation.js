import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    const userInfo = localStorage.getItem('user');
    if (token && userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (e) {
        console.error('Error parsing user info:', e);
      }
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🛒</span>
          <span className="logo-text">ECommerce</span>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {!isAdminRoute ? (
            // Main website navigation
            <>
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">🏠</span>
                Home
              </Link>
              <Link 
                to="/products" 
                className={`nav-link ${isActive('/products') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">📦</span>
                Products
              </Link>
              <Link 
                to="/services" 
                className={`nav-link ${isActive('/services') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">⚙️</span>
                Services
              </Link>
              <Link 
                to="/cart" 
                className={`nav-link ${isActive('/cart') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">🛒</span>
                Cart
              </Link>
            </>
          ) : (
            // Admin navigation
            <>
              <Link 
                to="/admin/dashboard" 
                className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">📊</span>
                Dashboard
              </Link>
              <Link 
                to="/admin/users" 
                className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">👥</span>
                Users
              </Link>
              <Link 
                to="/admin/products" 
                className={`nav-link ${isActive('/admin/products') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">📦</span>
                Products
              </Link>
            </>
          )}
        </div>

        <div className="nav-actions">
          {user ? (
            <div className="user-menu">
              <div className="user-info">
                <span className="user-avatar">
                  {user.first_name ? user.first_name[0].toUpperCase() : '👤'}
                </span>
                <span className="user-name">
                  {user.first_name || user.email}
                </span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <span className="nav-icon">🚪</span>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              {!isAdminRoute ? (
                <>
                  <Link to="/login" className="nav-link">
                    <span className="nav-icon">🔑</span>
                    Login
                  </Link>
                  <Link to="/register" className="nav-link">
                    <span className="nav-icon">📝</span>
                    Register
                  </Link>
                  <Link to="/admin/login" className="admin-link">
                    <span className="nav-icon">⚡</span>
                    Admin
                  </Link>
                </>
              ) : (
                <Link to="/" className="nav-link">
                  <span className="nav-icon">🏠</span>
                  Back to Site
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
