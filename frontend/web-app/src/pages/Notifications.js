import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Notifications.css';

const Notifications = () => {
  const { user, getAuthToken } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    push: true,
    orderUpdates: true,
    promotions: true,
    reviews: true
  });

  useEffect(() => {
    if (user) {
      fetchNotifications();
      loadNotificationSettings();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      // Mock notifications for demo - in real app, fetch from notification service
      const mockNotifications = [
        {
          id: '1',
          type: 'order',
          title: 'Order Confirmed',
          message: 'Your order #12345 has been confirmed and is being processed.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: false,
          icon: '📦',
          actionUrl: '/orders/12345'
        },
        {
          id: '2',
          type: 'shipping',
          title: 'Order Shipped',
          message: 'Your order #12344 has been shipped and is on its way!',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          read: true,
          icon: '🚚',
          actionUrl: '/orders/12344'
        },
        {
          id: '3',
          type: 'promotion',
          title: 'Special Offer',
          message: '20% off on all electronics! Limited time offer.',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          read: false,
          icon: '🎉',
          actionUrl: '/products?category=Electronics'
        },
        {
          id: '4',
          type: 'review',
          title: 'Review Request',
          message: 'How was your recent purchase? Leave a review and help other customers.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          read: true,
          icon: '⭐',
          actionUrl: '/reviews'
        },
        {
          id: '5',
          type: 'account',
          title: 'Profile Updated',
          message: 'Your profile information has been successfully updated.',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          read: true,
          icon: '👤',
          actionUrl: '/profile'
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationSettings = async () => {
    try {
      const token = getAuthToken();
      // Mock settings - in real app, fetch from user service
      // const response = await axios.get('/api/users/notification-settings', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // setNotificationSettings(response.data.settings);
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = getAuthToken();
      // In real app, call notification service
      // await axios.put(`/api/notifications/${notificationId}/read`, {}, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = getAuthToken();
      // In real app, call notification service
      // await axios.put('/api/notifications/mark-all-read', {}, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });

      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = getAuthToken();
      // In real app, call notification service
      // await axios.delete(`/api/notifications/${notificationId}`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });

      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const updateNotificationSettings = async (newSettings) => {
    try {
      const token = getAuthToken();
      // In real app, call user service
      // await axios.put('/api/users/notification-settings', newSettings, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });

      setNotificationSettings(newSettings);
      alert('Notification settings updated successfully!');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      alert('Failed to update notification settings.');
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!user) {
    return (
      <div className="notifications-container">
        <div className="login-required">
          <h2>Login Required</h2>
          <p>Please login to view your notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div className="header-content">
          <h1>Notifications</h1>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount} unread</span>
          )}
        </div>
        
        <div className="header-actions">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </button>
            <button 
              className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </button>
            <button 
              className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
              onClick={() => setFilter('read')}
            >
              Read ({notifications.length - unreadCount})
            </button>
          </div>
          
          {unreadCount > 0 && (
            <button className="mark-all-read-btn" onClick={markAllAsRead}>
              Mark All Read
            </button>
          )}
        </div>
      </div>

      <div className="notifications-content">
        <div className="notifications-list">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔔</div>
              <h3>No notifications</h3>
              <p>
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications."
                  : filter === 'read'
                  ? "No read notifications found."
                  : "You don't have any notifications yet."
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id}
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
              >
                <div className="notification-icon">
                  {notification.icon}
                </div>
                
                <div className="notification-content">
                  <div className="notification-header">
                    <h4 className="notification-title">{notification.title}</h4>
                    <span className="notification-time">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>
                  
                  <p className="notification-message">{notification.message}</p>
                  
                  {notification.actionUrl && (
                    <button className="notification-action">
                      View Details
                    </button>
                  )}
                </div>
                
                <div className="notification-actions">
                  {!notification.read && (
                    <button 
                      className="mark-read-btn"
                      onClick={() => markAsRead(notification.id)}
                      title="Mark as read"
                    >
                      ✓
                    </button>
                  )}
                  <button 
                    className="delete-btn"
                    onClick={() => deleteNotification(notification.id)}
                    title="Delete notification"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="notification-settings">
          <h3>Notification Settings</h3>
          <div className="settings-form">
            <div className="setting-group">
              <h4>Delivery Methods</h4>
              <label className="setting-item">
                <input
                  type="checkbox"
                  checked={notificationSettings.email}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    email: e.target.checked
                  })}
                />
                <span>Email Notifications</span>
              </label>
              <label className="setting-item">
                <input
                  type="checkbox"
                  checked={notificationSettings.sms}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    sms: e.target.checked
                  })}
                />
                <span>SMS Notifications</span>
              </label>
              <label className="setting-item">
                <input
                  type="checkbox"
                  checked={notificationSettings.push}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    push: e.target.checked
                  })}
                />
                <span>Push Notifications</span>
              </label>
            </div>

            <div className="setting-group">
              <h4>Notification Types</h4>
              <label className="setting-item">
                <input
                  type="checkbox"
                  checked={notificationSettings.orderUpdates}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    orderUpdates: e.target.checked
                  })}
                />
                <span>Order Updates</span>
              </label>
              <label className="setting-item">
                <input
                  type="checkbox"
                  checked={notificationSettings.promotions}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    promotions: e.target.checked
                  })}
                />
                <span>Promotions & Offers</span>
              </label>
              <label className="setting-item">
                <input
                  type="checkbox"
                  checked={notificationSettings.reviews}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    reviews: e.target.checked
                  })}
                />
                <span>Review Requests</span>
              </label>
            </div>

            <button 
              className="save-settings-btn"
              onClick={() => updateNotificationSettings(notificationSettings)}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
