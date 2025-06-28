import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { user, updateUser, logout, getAuthToken } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: ''
  });
  
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Initialize profile data with user data
    setProfileData({
      first_name: user.firstName || '',
      last_name: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      country: ''
    });
  }, [user, navigate]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getAuthToken();
      const response = await axios.put('/api/users/profile', profileData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.success) {
        updateUser({
          firstName: profileData.first_name,
          lastName: profileData.last_name,
          phone: profileData.phone
        });
        showMessage('success', 'Profile updated successfully!');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      showMessage('error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.new_password !== passwords.confirm_password) {
      showMessage('error', 'New passwords do not match');
      return;
    }
    
    if (passwords.new_password.length < 8) {
      showMessage('error', 'Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const token = getAuthToken();
      const response = await axios.put('/api/users/password', {
        current_password: passwords.current_password,
        new_password: passwords.new_password
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.success) {
        setPasswords({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        showMessage('success', 'Password updated successfully!');
      }
    } catch (error) {
      console.error('Password update error:', error);
      showMessage('error', error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    if (!window.confirm('This will permanently delete all your data. Are you absolutely sure?')) {
      return;
    }

    setLoading(true);

    try {
      const token = getAuthToken();
      const response = await axios.delete('/api/users/account', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.success) {
        showMessage('success', 'Account deleted successfully');
        setTimeout(() => {
          logout();
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      showMessage('error', error.response?.data?.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </div>
        </div>
        <div className="profile-info">
          <h1>{user.fullName || `${user.firstName} ${user.lastName}`}</h1>
          <p className="profile-email">{user.email}</p>
          <p className="profile-status">
            <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
              {user.isActive ? '✅ Active' : '❌ Inactive'}
            </span>
            <span className={`status-badge ${user.isVerified ? 'verified' : 'unverified'}`}>
              {user.isVerified ? '✅ Verified' : '⚠️ Unverified'}
            </span>
          </p>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile Information
        </button>
        <button 
          className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          🔒 Change Password
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Account Settings
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="tab-content">
            <h2>Profile Information</h2>
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    value={profileData.first_name}
                    onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    value={profileData.last_name}
                    onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    required
                    disabled
                  />
                  <small>Email cannot be changed</small>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  placeholder="Street address"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    value={profileData.city}
                    onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    value={profileData.state}
                    onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="zip_code">ZIP Code</label>
                  <input
                    type="text"
                    id="zip_code"
                    value={profileData.zip_code}
                    onChange={(e) => setProfileData({...profileData, zip_code: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  value={profileData.country}
                  onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="IN">India</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="tab-content">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <div className="form-group">
                <label htmlFor="current_password">Current Password</label>
                <input
                  type="password"
                  id="current_password"
                  value={passwords.current_password}
                  onChange={(e) => setPasswords({...passwords, current_password: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new_password">New Password</label>
                <input
                  type="password"
                  id="new_password"
                  value={passwords.new_password}
                  onChange={(e) => setPasswords({...passwords, new_password: e.target.value})}
                  required
                  minLength="8"
                />
                <small>Password must be at least 8 characters long</small>
              </div>

              <div className="form-group">
                <label htmlFor="confirm_password">Confirm New Password</label>
                <input
                  type="password"
                  id="confirm_password"
                  value={passwords.confirm_password}
                  onChange={(e) => setPasswords({...passwords, confirm_password: e.target.value})}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="tab-content">
            <h2>Account Settings</h2>
            
            <div className="settings-section">
              <h3>Account Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Account ID:</span>
                  <span className="info-value">{user.id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Member Since:</span>
                  <span className="info-value">June 2025</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Account Type:</span>
                  <span className="info-value">{user.role || 'User'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className="info-value">
                    {user.isActive ? '✅ Active' : '❌ Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h3>Quick Actions</h3>
              <div className="actions-grid">
                <button onClick={() => navigate('/orders')} className="action-btn">
                  📋 View Orders
                </button>
                <button onClick={() => navigate('/cart')} className="action-btn">
                  🛒 View Cart
                </button>
                <button onClick={() => navigate('/dashboard')} className="action-btn">
                  📊 Dashboard
                </button>
                <button onClick={() => navigate('/products')} className="action-btn">
                  🛍️ Shop Now
                </button>
              </div>
            </div>

            <div className="settings-section danger-zone">
              <h3>Danger Zone</h3>
              <p>Once you delete your account, there is no going back. Please be certain.</p>
              <button 
                onClick={handleDeleteAccount} 
                className="btn-danger"
                disabled={loading}
              >
                {loading ? 'Deleting...' : '🗑️ Delete Account'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
