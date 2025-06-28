import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

const AdminLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/admin-api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        // Store admin token and user info
        localStorage.setItem('adminToken', response.data.data.access_token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.data.admin));
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.adminKey) {
      setError('Admin registration key is required');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/admin/register', {
        email: formData.email,
        password: formData.password,
        adminKey: formData.adminKey
      });

      if (response.data.success) {
        // Store admin token
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Admin registration error:', error);
      setError(error.response?.data?.message || 'Registration failed. Please check your admin key.');
    } finally {
      setLoading(false);
    }
  };

  const fillDefaultCredentials = () => {
    setFormData({
      ...formData,
      email: 'deepak@admin.com',
      password: 'deepak123'
    });
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-header">
          <h1>🔐 Admin Access</h1>
          <p>Secure administrative portal</p>
        </div>

        <div className="login-tabs">
          <button 
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="login-form">
          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="admin@example.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="Confirm your password"
                />
              </div>

              <div className="form-group">
                <label>Admin Registration Key</label>
                <input
                  type="password"
                  name="adminKey"
                  value={formData.adminKey}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter admin registration key"
                />
                <small>Contact system administrator for registration key</small>
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span>
                <div className="spinner"></div>
                {isLogin ? 'Logging in...' : 'Registering...'}
              </span>
            ) : (
              isLogin ? '🔓 Login to Admin' : '📝 Register as Admin'
            )}
          </button>

          {isLogin && (
            <div className="admin-note">
              <p>🔐 <strong>Admin Access Required</strong></p>
              <small>
                Contact system administrator for admin credentials.<br/>
                Only authorized personnel can access admin functions.
              </small>
            </div>
          )}
        </form>

        <div className="login-footer">
          <button 
            onClick={() => navigate('/')}
            className="back-btn"
          >
            ← Back to Website
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
