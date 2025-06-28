import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './UserDashboard.css';

const UserDashboard = () => {
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    recentOrders: [],
    favoriteProducts: []
  });
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserData();
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ecommerce-token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      // For now, we'll use mock data since order service might not be fully implemented
      // In a real app, you'd fetch from /api/orders/user/{userId} and /api/users/profile
      
      setUserStats({
        totalOrders: 3,
        totalSpent: 299.97,
        recentOrders: [
          {
            id: '1',
            date: '2025-06-28',
            total: 99.99,
            status: 'Delivered',
            items: ['MacBook Pro Case', 'Wireless Mouse']
          },
          {
            id: '2', 
            date: '2025-06-25',
            total: 149.99,
            status: 'Shipped',
            items: ['Nike Air Force 1']
          },
          {
            id: '3',
            date: '2025-06-20',
            total: 49.99,
            status: 'Processing',
            items: ['Coffee Mug']
          }
        ],
        favoriteProducts: []
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1 className="dashboard-title">
            <span className="title-icon">👋</span>
            Welcome back, {user?.firstName || user?.first_name}!
          </h1>
          <p className="dashboard-subtitle">
            Here's what's happening with your account
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/profile')} className="profile-btn">
            👤 Edit Profile
          </button>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card orders">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-number">{userStats.totalOrders}</p>
            <span className="stat-label">All time</span>
          </div>
        </div>

        <div className="stat-card spent">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Spent</h3>
            <p className="stat-number">${userStats.totalSpent.toFixed(2)}</p>
            <span className="stat-label">All time</span>
          </div>
        </div>

        <div className="stat-card status">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Account Status</h3>
            <p className="stat-number">Active</p>
            <span className="stat-label">Verified user</span>
          </div>
        </div>

        <div className="stat-card rewards">
          <div className="stat-icon">🎁</div>
          <div className="stat-content">
            <h3>Reward Points</h3>
            <p className="stat-number">{Math.floor(userStats.totalSpent * 10)}</p>
            <span className="stat-label">Available points</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button onClick={() => navigate('/products')} className="action-btn shop-btn">
            <span className="action-icon">🛍️</span>
            <span className="action-text">Continue Shopping</span>
          </button>
          
          <button onClick={() => navigate('/orders')} className="action-btn orders-btn">
            <span className="action-icon">📋</span>
            <span className="action-text">View Orders</span>
          </button>
          
          <button onClick={() => navigate('/cart')} className="action-btn cart-btn">
            <span className="action-icon">🛒</span>
            <span className="action-text">View Cart</span>
          </button>
          
          <button onClick={() => navigate('/profile')} className="action-btn profile-btn">
            <span className="action-icon">👤</span>
            <span className="action-text">Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <button onClick={() => navigate('/orders')} className="view-all-btn">
            View All Orders
          </button>
        </div>
        
        {userStats.recentOrders.length > 0 ? (
          <div className="orders-list">
            {userStats.recentOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-id">Order #{order.id}</h3>
                    <p className="order-date">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="order-details">
                  <div className="order-items">
                    <p><strong>Items:</strong> {order.items.join(', ')}</p>
                  </div>
                  <div className="order-total">
                    <p><strong>Total:</strong> ${order.total}</p>
                  </div>
                </div>
                
                <div className="order-actions">
                  <button className="track-btn">📍 Track Order</button>
                  <button className="reorder-btn">🔄 Reorder</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h3>No Orders Yet</h3>
            <p>Start shopping to see your orders here!</p>
            <button onClick={() => navigate('/products')} className="shop-now-btn">
              🛍️ Shop Now
            </button>
          </div>
        )}
      </div>

      {/* Account Info */}
      <div className="account-info">
        <h2>Account Information</h2>
        <div className="info-grid">
          <div className="info-card">
            <h3>Personal Details</h3>
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone:</span>
              <span className="info-value">{user?.phone || 'Not provided'}</span>
            </div>
          </div>
          
          <div className="info-card">
            <h3>Account Settings</h3>
            <div className="info-item">
              <span className="info-label">Member Since:</span>
              <span className="info-value">June 2025</span>
            </div>
            <div className="info-item">
              <span className="info-label">Account Type:</span>
              <span className="info-value">Regular Customer</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className="info-value status-active">✅ Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
