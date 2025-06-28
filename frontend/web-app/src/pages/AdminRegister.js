import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRegister() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationKey, setRegistrationKey] = useState('');
  
  const { adminRegister } = useAuth();
  const navigate = useNavigate();

  // Fetch the registration key for display
  useEffect(() => {
    fetchRegistrationKey();
  }, []);

  const fetchRegistrationKey = async () => {
    try {
      const response = await fetch('/api/admin/registration-key');
      const data = await response.json();
      setRegistrationKey(data.key);
    } catch (error) {
      console.error('Failed to fetch registration key:', error);
    }
  };

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

    const result = await adminRegister(formData);
    
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const copyKeyToClipboard = () => {
    navigator.clipboard.writeText(registrationKey);
    alert('Registration key copied to clipboard!');
  };

  return (
    <div className="container">
      <div className="auth-container">
        <div className="auth-card admin-auth-card">
          <div className="auth-header">
            <h1>⚙️ Admin Registration</h1>
            <p>Create an administrative account</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="First name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Last name"
                />
              </div>
            </div>

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
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Create a password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Confirm your password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="adminKey">Admin Registration Key</label>
              <input
                type="password"
                id="adminKey"
                name="adminKey"
                value={formData.adminKey}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter admin registration key"
              />
              <small className="form-help">
                Contact system administrator for the registration key
              </small>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? '🔄 Creating Account...' : '⚙️ Create Admin Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have admin access? 
              <Link to="/admin/login" className="auth-link"> Sign in here</Link>
            </p>
            <p>
              <Link to="/register" className="auth-link">← Back to User Registration</Link>
            </p>
          </div>

          <div className="demo-credentials">
            <h4>🔑 Admin Registration Key</h4>
            <div className="key-display">
              <div className="key-value">
                <strong>Key:</strong> 
                <span className="registration-key">{registrationKey || 'Loading...'}</span>
                {registrationKey && (
                  <button 
                    type="button" 
                    className="copy-btn"
                    onClick={copyKeyToClipboard}
                    title="Copy to clipboard"
                  >
                    📋
                  </button>
                )}
              </div>
            </div>
            <p className="form-help">
              Use this key to create a new admin account. Keep it secure!
            </p>
          </div>

          <div className="existing-admins">
            <h4>👥 Existing Admin Accounts</h4>
            <div className="admin-list">
              <div className="admin-item">
                <strong>Demo Admin:</strong> admin@ecommerce.com / admin123
              </div>
              <div className="admin-item">
                <strong>Deepak Admin:</strong> deepak@ecommerce.com / deepak
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;
