import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

function Profile() {
  const { user, updateProfile } = useAuth();
  const { clearCart } = useCart();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      setEditing(false);
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile: ' + result.error);
    }
  };

  const handleClearCartData = () => {
    if (window.confirm('Are you sure you want to clear all your cart data? This action cannot be undone.')) {
      clearCart();
      // Also clear any residual cart data from localStorage
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('ecommerce-cart')) {
          localStorage.removeItem(key);
        }
      });
      alert('Cart data cleared successfully!');
    }
  };

  if (!user) {
    return (
      <div className="container">
        <div className="auth-required">
          <h2>🔑 Login Required</h2>
          <p>Please log in to view your profile.</p>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>👤 My Profile</h1>
        <p>Manage your account information</p>
      </div>

      <div className="profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <h3>{user.firstName} {user.lastName}</h3>
            <p>{user.email}</p>
            <span className="user-role">{user.role}</span>
          </div>

          <nav className="profile-nav">
            <button className="nav-item active">
              👤 Personal Info
            </button>
            <Link to="/orders" className="nav-item">
              📋 Order History
            </Link>
            <button className="nav-item">
              📍 Addresses
            </button>
            <button className="nav-item">
              💳 Payment Methods
            </button>
            <button className="nav-item">
              🔔 Notifications
            </button>
            <button className="nav-item">
              🔒 Security
            </button>
          </nav>
        </aside>

        <main className="profile-content">
          <div className="profile-section">
            <div className="section-header">
              <h2>Personal Information</h2>
              <button 
                className="btn btn-outline"
                onClick={() => setEditing(!editing)}
              >
                {editing ? '❌ Cancel' : '✏️ Edit'}
              </button>
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="form-input"
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
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-input"
                    rows="3"
                    placeholder="Enter your address"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    💾 Save Changes
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-row">
                  <label>First Name:</label>
                  <span>{user.firstName}</span>
                </div>
                <div className="info-row">
                  <label>Last Name:</label>
                  <span>{user.lastName}</span>
                </div>
                <div className="info-row">
                  <label>Email:</label>
                  <span>{user.email}</span>
                </div>
                <div className="info-row">
                  <label>Role:</label>
                  <span className="user-role">{user.role}</span>
                </div>
                <div className="info-row">
                  <label>Phone:</label>
                  <span>{formData.phone || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <label>Address:</label>
                  <span>{formData.address || 'Not provided'}</span>
                </div>
              </div>
            )}
          </div>

          <div className="profile-section">
            <h2>Account Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">5</div>
                <div className="stat-label">Total Orders</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">$2,148</div>
                <div className="stat-label">Total Spent</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">3</div>
                <div className="stat-label">Wishlist Items</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">12</div>
                <div className="stat-label">Reviews Written</div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <Link to="/orders" className="action-card">
                <div className="action-icon">📋</div>
                <div className="action-text">
                  <h3>View Orders</h3>
                  <p>Track your recent purchases</p>
                </div>
              </Link>
              <Link to="/cart" className="action-card">
                <div className="action-icon">🛒</div>
                <div className="action-text">
                  <h3>Shopping Cart</h3>
                  <p>Complete your purchase</p>
                </div>
              </Link>
              <button className="action-card" onClick={handleClearCartData}>
                <div className="action-icon">🗑️</div>
                <div className="action-text">
                  <h3>Clear Cart Data</h3>
                  <p>Remove all cart items</p>
                </div>
              </button>
              <button className="action-card">
                <div className="action-icon">❤️</div>
                <div className="action-text">
                  <h3>Wishlist</h3>
                  <p>View saved items</p>
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;
