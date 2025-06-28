import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Orders() {
  const { user } = useAuth();

  // Mock orders data
  const orders = [
    {
      id: 'ORD-2024-001',
      date: '2024-06-25',
      status: 'delivered',
      total: 999.00,
      items: [
        { name: 'iPhone 15 Pro', quantity: 1, price: 999.00 }
      ]
    },
    {
      id: 'ORD-2024-002',
      date: '2024-06-20',
      status: 'shipped',
      total: 150.00,
      items: [
        { name: 'Nike Air Max 270', quantity: 1, price: 150.00 }
      ]
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#4caf50';
      case 'shipped': return '#2196f3';
      case 'processing': return '#ff9800';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return '✅';
      case 'shipped': return '🚚';
      case 'processing': return '⏳';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  if (!user) {
    return (
      <div className="container">
        <div className="auth-required">
          <h2>🔑 Login Required</h2>
          <p>Please log in to view your orders.</p>
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
        <h1>📋 My Orders</h1>
        <p>Track and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon">📦</div>
          <h2>No orders yet</h2>
          <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
          <Link to="/products" className="btn btn-primary">
            🛍️ Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <p>Placed on {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="order-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusIcon(order.status)} {order.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image">📱</div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <strong>Total: {formatPrice(order.total)}</strong>
                </div>
                <div className="order-actions">
                  <button className="btn btn-outline btn-sm">
                    👁️ View Details
                  </button>
                  {order.status === 'delivered' && (
                    <button className="btn btn-outline btn-sm">
                      ⭐ Write Review
                    </button>
                  )}
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <button className="btn btn-outline btn-sm">
                      🚚 Track Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="order-help">
        <h3>Need Help?</h3>
        <p>If you have questions about your orders, please contact our support team.</p>
        <button className="btn btn-outline">
          📞 Contact Support
        </button>
      </div>
    </div>
  );
}

export default Orders;
