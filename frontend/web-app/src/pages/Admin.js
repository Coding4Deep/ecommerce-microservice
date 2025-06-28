import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalOrders: 3420,
    totalRevenue: 125000,
    totalProducts: 150
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="container">
        <div className="access-denied">
          <h2>🚫 Access Denied</h2>
          <p>You need administrator privileges to access this page.</p>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>⚙️ Admin Dashboard</h1>
        <p>Manage your e-commerce platform</p>
      </div>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <button 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
            <button 
              className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              📦 Products
            </button>
            <button 
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📋 Orders
            </button>
            <button 
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Users
            </button>
            <button 
              className={`nav-item ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              🔧 Services
            </button>
            <button 
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              📈 Analytics
            </button>
          </nav>
        </aside>

        <main className="admin-content">
          {activeTab === 'dashboard' && (
            <div className="admin-section">
              <h2>📊 Dashboard Overview</h2>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <div className="stat-number">{formatNumber(stats.totalUsers)}</div>
                    <div className="stat-label">Total Users</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📋</div>
                  <div className="stat-info">
                    <div className="stat-number">{formatNumber(stats.totalOrders)}</div>
                    <div className="stat-label">Total Orders</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <div className="stat-number">{formatPrice(stats.totalRevenue)}</div>
                    <div className="stat-label">Total Revenue</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <div className="stat-number">{formatNumber(stats.totalProducts)}</div>
                    <div className="stat-label">Total Products</div>
                  </div>
                </div>
              </div>

              <div className="admin-grid">
                <div className="admin-card">
                  <h3>🚀 System Status</h3>
                  <div className="status-list">
                    <div className="status-item">
                      <span className="status-indicator healthy">●</span>
                      API Gateway: Healthy
                    </div>
                    <div className="status-item">
                      <span className="status-indicator healthy">●</span>
                      Database: Connected
                    </div>
                    <div className="status-item">
                      <span className="status-indicator healthy">●</span>
                      Cache: Active
                    </div>
                    <div className="status-item">
                      <span className="status-indicator warning">●</span>
                      Queue: 5 pending jobs
                    </div>
                  </div>
                </div>

                <div className="admin-card">
                  <h3>📈 Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <span className="activity-time">2 min ago</span>
                      New order #ORD-2024-003
                    </div>
                    <div className="activity-item">
                      <span className="activity-time">5 min ago</span>
                      User registration: john@example.com
                    </div>
                    <div className="activity-item">
                      <span className="activity-time">10 min ago</span>
                      Product updated: iPhone 15 Pro
                    </div>
                    <div className="activity-item">
                      <span className="activity-time">15 min ago</span>
                      Payment processed: $999.00
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="admin-section">
              <h2>🔧 Microservices Management</h2>
              
              <div className="services-admin">
                <div className="service-card">
                  <div className="service-header">
                    <h3>🌐 API Gateway</h3>
                    <span className="status-badge healthy">✅ Running</span>
                  </div>
                  <p>Central routing and authentication service</p>
                  <div className="service-actions">
                    <button className="btn btn-sm btn-outline">📊 View Logs</button>
                    <button className="btn btn-sm btn-outline">🔄 Restart</button>
                  </div>
                </div>

                <div className="service-card">
                  <div className="service-header">
                    <h3>👤 User Service</h3>
                    <span className="status-badge planned">🔄 Planned</span>
                  </div>
                  <p>User management and authentication</p>
                  <div className="service-actions">
                    <button className="btn btn-sm btn-outline">🚀 Deploy</button>
                    <button className="btn btn-sm btn-outline">⚙️ Configure</button>
                  </div>
                </div>

                <div className="service-card">
                  <div className="service-header">
                    <h3>📦 Product Service</h3>
                    <span className="status-badge planned">🔄 Planned</span>
                  </div>
                  <p>Product catalog and inventory management</p>
                  <div className="service-actions">
                    <button className="btn btn-sm btn-outline">🚀 Deploy</button>
                    <button className="btn btn-sm btn-outline">⚙️ Configure</button>
                  </div>
                </div>

                <div className="service-card">
                  <div className="service-header">
                    <h3>🛒 Cart Service</h3>
                    <span className="status-badge planned">🔄 Planned</span>
                  </div>
                  <p>Shopping cart management</p>
                  <div className="service-actions">
                    <button className="btn btn-sm btn-outline">🚀 Deploy</button>
                    <button className="btn btn-sm btn-outline">⚙️ Configure</button>
                  </div>
                </div>
              </div>

              <div className="deployment-section">
                <h3>🚀 Quick Deploy</h3>
                <p>Deploy additional microservices to expand platform functionality</p>
                <div className="deploy-actions">
                  <button className="btn btn-primary">🚀 Deploy All Services</button>
                  <button className="btn btn-outline">📋 View Deployment Plan</button>
                  <Link to="/services" className="btn btn-outline">🔧 View Architecture</Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="admin-section">
              <h2>📦 Product Management</h2>
              <div className="section-actions">
                <button className="btn btn-primary">➕ Add Product</button>
                <button className="btn btn-outline">📤 Import Products</button>
              </div>
              
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>iPhone 15 Pro</td>
                      <td>$999.00</td>
                      <td>25</td>
                      <td><span className="status-badge healthy">Active</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline">✏️ Edit</button>
                        <button className="btn btn-sm btn-outline">🗑️ Delete</button>
                      </td>
                    </tr>
                    <tr>
                      <td>MacBook Pro 14-inch</td>
                      <td>$1,999.00</td>
                      <td>12</td>
                      <td><span className="status-badge healthy">Active</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline">✏️ Edit</button>
                        <button className="btn btn-sm btn-outline">🗑️ Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="admin-section">
              <h2>📋 Order Management</h2>
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>ORD-2024-001</td>
                      <td>john@example.com</td>
                      <td>2024-06-25</td>
                      <td>$999.00</td>
                      <td><span className="status-badge healthy">Delivered</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline">👁️ View</button>
                      </td>
                    </tr>
                    <tr>
                      <td>ORD-2024-002</td>
                      <td>jane@example.com</td>
                      <td>2024-06-24</td>
                      <td>$1,999.00</td>
                      <td><span className="status-badge warning">Shipped</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline">👁️ View</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="admin-section">
              <h2>👥 User Management</h2>
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Admin User</td>
                      <td>admin@ecommerce.com</td>
                      <td>Admin</td>
                      <td>2024-01-01</td>
                      <td><span className="status-badge healthy">Active</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline">✏️ Edit</button>
                      </td>
                    </tr>
                    <tr>
                      <td>John Doe</td>
                      <td>user@example.com</td>
                      <td>User</td>
                      <td>2024-06-20</td>
                      <td><span className="status-badge healthy">Active</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline">✏️ Edit</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="admin-section">
              <h2>📈 Analytics & Reports</h2>
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>Sales Overview</h3>
                  <div className="chart-placeholder">
                    📊 Sales chart will be displayed here
                  </div>
                </div>
                <div className="analytics-card">
                  <h3>User Growth</h3>
                  <div className="chart-placeholder">
                    📈 User growth chart will be displayed here
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Admin;
