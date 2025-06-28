import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await adminLogin(formData.email, formData.password);
    
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="auth-container">
        <div className="auth-card admin-auth-card">
          <div className="auth-header">
            <h1>⚙️ Admin Login</h1>
            <p>Administrative access to the e-commerce platform</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Admin Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter admin email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Admin Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter admin password"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? '🔄 Signing In...' : '⚙️ Admin Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Need admin access? 
              <Link to="/admin/register" className="auth-link"> Register as Admin</Link>
            </p>
            <p>
              <Link to="/login" className="auth-link">← Back to User Login</Link>
            </p>
          </div>

          <div className="demo-credentials">
            <h4>🧪 Demo Admin Credentials</h4>
            <div className="demo-cred-item">
              <strong>Email:</strong> admin@ecommerce.com
            </div>
            <div className="demo-cred-item">
              <strong>Password:</strong> admin123
            </div>
          </div>

          <div className="admin-features">
            <h4>🔧 Admin Features</h4>
            <ul>
              <li>✅ User Management</li>
              <li>✅ Product Management</li>
              <li>✅ Order Management</li>
              <li>✅ System Analytics</li>
              <li>✅ Service Monitoring</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
