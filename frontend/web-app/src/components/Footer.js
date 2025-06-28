import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🛒 E-commerce Platform</h3>
            <p>Your one-stop shop for everything!</p>
            <p>🚀 Status: <span style={{ color: '#4caf50' }}>Live & Running</span></p>
          </div>
          
          <div className="footer-section">
            <h4>🔗 Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/cart">Cart</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>🔧 Microservices</h4>
            <ul>
              <li><a href="http://localhost:8080/health" target="_blank" rel="noopener noreferrer">API Gateway</a></li>
              <li><a href="/api/products" target="_blank" rel="noopener noreferrer">Product Service</a></li>
              <li><a href="/api/categories" target="_blank" rel="noopener noreferrer">Category Service</a></li>
              <li><Link to="/services">All Services</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>📊 System Status</h4>
            <ul>
              <li>✅ API Gateway: Online</li>
              <li>✅ Database: Connected</li>
              <li>✅ Cache: Active</li>
              <li>✅ Frontend: Running</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 E-commerce Microservices Platform. Built with React, Node.js, Python, Java, Go.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
