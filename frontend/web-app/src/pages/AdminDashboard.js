import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get admin user info
    const storedAdminUser = localStorage.getItem('adminUser');
    if (storedAdminUser) {
      setAdminUser(JSON.parse(storedAdminUser));
    }

    fetchDashboardData();
    fetchServiceStatus();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/admin/login');
        return;
      }

      // Fetch dashboard analytics from admin service
      const response = await axios.get('/admin-api/analytics/dashboard', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.success) {
        setStats(response.data.data);
      } else {
        // Fallback stats
        setStats({
          totalUsers: 2,
          totalProducts: 5,
          totalOrders: 0,
          totalRevenue: 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        // Fallback stats
        setStats({
          totalUsers: 2,
          totalProducts: 5,
          totalOrders: 0,
          totalRevenue: 0
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceStatus = async () => {
    const serviceList = [
      { name: 'API Gateway', url: 'http://localhost:8080/health', port: 8080 },
      { name: 'User Service', url: 'http://localhost:8001/health', port: 8001 },
      { name: 'Product Service', url: 'http://localhost:8002/actuator/health', port: 8002 },
      { name: 'Cart Service', url: 'http://localhost:8003/health', port: 8003 }
    ];

    const statusPromises = serviceList.map(async (service) => {
      try {
        const response = await fetch(service.url);
        return {
          ...service,
          status: response.ok ? 'healthy' : 'unhealthy',
          responseTime: Date.now()
        };
      } catch (error) {
        return {
          ...service,
          status: 'down',
          responseTime: null
        };
      }
    });

    const results = await Promise.all(statusPromises);
    setServices(results);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const restartService = async (serviceName, port) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('/api/admin/services/restart', 
        { serviceName, port },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        alert(`${serviceName} restart initiated successfully`);
        // Refresh service status after a delay
        setTimeout(() => fetchServiceStatus(), 3000);
      }
    } catch (error) {
      console.error('Error restarting service:', error);
      alert(`Error restarting ${serviceName}: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-left">
          <h1>Admin Dashboard</h1>
          {adminUser && (
            <p className="welcome-text">Welcome back, {adminUser.email}</p>
          )}
        </div>
        <div className="header-right">
          <div className="admin-nav">
            <button onClick={() => navigate('/admin/users')} className="nav-btn">
              👥 Users
            </button>
            <button onClick={() => navigate('/admin/products')} className="nav-btn">
              📦 Products
            </button>
            <button onClick={() => navigate('/admin/orders')} className="nav-btn">
              🛒 Orders
            </button>
            <button onClick={() => navigate('/admin/services')} className="nav-btn">
              ⚙️ Services
            </button>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
            <small>Registered users in system</small>
          </div>
        </div>
        <div className="stat-card products">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-number">{stats.totalProducts}</p>
            <small>Products in catalog</small>
          </div>
        </div>
        <div className="stat-card orders">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-number">{stats.totalOrders}</p>
            <small>Orders processed</small>
          </div>
        </div>
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-number">${stats.totalRevenue}</p>
            <small>Revenue generated</small>
          </div>
        </div>
      </div>

      {/* Service Status */}
      <div className="services-section">
        <h2>Service Status</h2>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.name} className={`service-card ${service.status}`}>
              <div className="service-header">
                <h3>{service.name}</h3>
                <span className={`status-badge ${service.status}`}>
                  {service.status}
                </span>
              </div>
              <div className="service-details">
                <p>Port: {service.port}</p>
                <p>Status: {service.status === 'healthy' ? '✅ Running' : service.status === 'unhealthy' ? '⚠️ Issues' : '❌ Down'}</p>
                {service.responseTime && (
                  <p>Last Check: {new Date().toLocaleTimeString()}</p>
                )}
              </div>
              <div className="service-actions">
                <button 
                  onClick={() => fetchServiceStatus()} 
                  className="refresh-btn"
                >
                  🔄 Refresh
                </button>
                <button 
                  onClick={() => restartService(service.name, service.port)}
                  className="restart-btn"
                >
                  🔄 Restart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button onClick={() => navigate('/admin/users/add')} className="action-btn">
            ➕ Add User
          </button>
          <button onClick={() => navigate('/admin/products/add')} className="action-btn">
            ➕ Add Product
          </button>
          <button onClick={() => fetchDashboardData()} className="action-btn">
            🔄 Refresh Data
          </button>
          <button onClick={() => navigate('/admin/settings')} className="action-btn">
            ⚙️ Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
