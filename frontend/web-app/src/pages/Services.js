import React, { useState, useEffect } from 'react';

function Services() {
  const [serviceStatus, setServiceStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const services = [
    {
      id: 'api-gateway',
      name: '🌐 API Gateway',
      description: 'Central entry point for all API requests with routing, authentication, and rate limiting',
      port: '8080',
      technology: 'Node.js + Express',
      healthEndpoint: 'http://localhost:8080/health',
      features: ['Request Routing', 'Authentication', 'Rate Limiting', 'CORS Handling']
    },
    {
      id: 'user-service',
      name: '👤 User Service',
      description: 'User management, authentication, and profile handling',
      port: '8001',
      technology: 'Python + FastAPI',
      healthEndpoint: '/api/users/health',
      features: ['User Registration', 'JWT Authentication', 'Profile Management', 'Password Reset']
    },
    {
      id: 'product-service',
      name: '📦 Product Service',
      description: 'Product catalog management with search and categorization',
      port: '8002',
      technology: 'Java + Spring Boot',
      healthEndpoint: '/api/products/health',
      features: ['Product CRUD', 'Category Management', 'Search & Filtering', 'Inventory Tracking']
    },
    {
      id: 'cart-service',
      name: '🛒 Cart Service',
      description: 'Shopping cart management with session persistence',
      port: '8003',
      technology: 'Node.js + Express',
      healthEndpoint: '/api/cart/health',
      features: ['Add/Remove Items', 'Session Persistence', 'Cart Calculations', 'Multi-device Sync']
    },
    {
      id: 'order-service',
      name: '📋 Order Service',
      description: 'Order processing and workflow management',
      port: '8004',
      technology: 'Go + Gin',
      healthEndpoint: '/api/orders/health',
      features: ['Order Creation', 'Status Tracking', 'Order History', 'Workflow Management']
    },
    {
      id: 'payment-service',
      name: '💳 Payment Service',
      description: 'Payment processing and transaction management',
      port: '8005',
      technology: 'Python + FastAPI',
      healthEndpoint: '/api/payments/health',
      features: ['Payment Processing', 'Transaction History', 'Refund Management', 'Multiple Gateways']
    },
    {
      id: 'inventory-service',
      name: '📊 Inventory Service',
      description: 'Stock management and inventory tracking',
      port: '8006',
      technology: 'Java + Spring Boot',
      healthEndpoint: '/api/inventory/health',
      features: ['Stock Tracking', 'Low Stock Alerts', 'Inventory Updates', 'Reporting']
    },
    {
      id: 'review-service',
      name: '⭐ Review Service',
      description: 'Product reviews and ratings management',
      port: '8007',
      technology: 'Python + FastAPI',
      healthEndpoint: '/api/reviews/health',
      features: ['Review Submission', 'Rating Aggregation', 'Review Moderation', 'Analytics']
    },
    {
      id: 'notification-service',
      name: '📧 Notification Service',
      description: 'Email and SMS notification handling',
      port: '8008',
      technology: 'Node.js + Kafka',
      healthEndpoint: '/api/notifications/health',
      features: ['Email Notifications', 'SMS Alerts', 'Event Processing', 'Template Management']
    },
    {
      id: 'admin-service',
      name: '⚙️ Admin Service',
      description: 'Administrative operations and management',
      port: '8009',
      technology: 'Node.js + Express',
      healthEndpoint: '/api/admin/health',
      features: ['User Management', 'Product Management', 'Order Management', 'Analytics Dashboard']
    }
  ];

  const infrastructure = [
    {
      name: '🗄️ MongoDB',
      description: 'Primary database for products, users, and orders',
      port: '27017',
      status: 'running'
    },
    {
      name: '🔴 Redis',
      description: 'Caching and session storage',
      port: '6379',
      status: 'running'
    },
    {
      name: '🐘 PostgreSQL',
      description: 'Financial data and transactions',
      port: '5432',
      status: 'running'
    },
    {
      name: '📨 Apache Kafka',
      description: 'Event streaming and messaging',
      port: '9092',
      status: 'running'
    },
    {
      name: '🔐 HashiCorp Vault',
      description: 'Secrets management',
      port: '8200',
      status: 'running'
    }
  ];

  useEffect(() => {
    checkServiceHealth();
  }, []);

  const checkServiceHealth = async () => {
    setLoading(true);
    const status = {};
    
    // Check API Gateway health
    try {
      const response = await fetch('http://localhost:8080/health');
      status['api-gateway'] = response.ok ? 'healthy' : 'unhealthy';
    } catch (error) {
      status['api-gateway'] = 'offline';
    }

    // For other services, we'll simulate status since they're not all running yet
    services.forEach(service => {
      if (service.id !== 'api-gateway') {
        status[service.id] = 'planned'; // or 'offline' for now
      }
    });

    setServiceStatus(status);
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#4caf50';
      case 'unhealthy': return '#ff9800';
      case 'offline': return '#f44336';
      case 'planned': return '#2196f3';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'healthy': return '✅ Healthy';
      case 'unhealthy': return '⚠️ Unhealthy';
      case 'offline': return '❌ Offline';
      case 'planned': return '🔄 Planned';
      default: return '❓ Unknown';
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>🔧 Microservices Architecture</h1>
        <p>Our platform is built using a microservices architecture with multiple independent services</p>
        <button className="btn btn-primary" onClick={checkServiceHealth} disabled={loading}>
          {loading ? '🔄 Checking...' : '🔄 Refresh Status'}
        </button>
      </div>

      {/* Services Grid */}
      <section className="section">
        <h2>🚀 Application Services</h2>
        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-header">
                <h3>{service.name}</h3>
                <span 
                  className="status-indicator"
                  style={{ color: getStatusColor(serviceStatus[service.id]) }}
                >
                  {getStatusText(serviceStatus[service.id])}
                </span>
              </div>
              
              <p className="service-description">{service.description}</p>
              
              <div className="service-details">
                <div className="detail-item">
                  <strong>Technology:</strong> {service.technology}
                </div>
                <div className="detail-item">
                  <strong>Port:</strong> {service.port}
                </div>
                {service.healthEndpoint && (
                  <div className="detail-item">
                    <strong>Health Check:</strong> 
                    <a 
                      href={service.healthEndpoint} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="health-link"
                    >
                      Test Endpoint
                    </a>
                  </div>
                )}
              </div>
              
              <div className="service-features">
                <strong>Features:</strong>
                <ul>
                  {service.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Infrastructure */}
      <section className="section">
        <h2>🏗️ Infrastructure Services</h2>
        <div className="infrastructure-grid">
          {infrastructure.map((service, index) => (
            <div key={index} className="infrastructure-card">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="service-details">
                <div className="detail-item">
                  <strong>Port:</strong> {service.port}
                </div>
                <div className="detail-item">
                  <strong>Status:</strong> 
                  <span style={{ color: getStatusColor(service.status) }}>
                    {getStatusText(service.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="section">
        <h2>🏛️ Architecture Overview</h2>
        <div className="architecture-diagram">
          <div className="architecture-layer">
            <h3>Frontend Layer</h3>
            <div className="layer-items">
              <div className="arch-item">React Web App</div>
              <div className="arch-item">Admin Dashboard</div>
            </div>
          </div>
          
          <div className="architecture-layer">
            <h3>API Gateway</h3>
            <div className="layer-items">
              <div className="arch-item">Request Routing</div>
              <div className="arch-item">Authentication</div>
              <div className="arch-item">Rate Limiting</div>
            </div>
          </div>
          
          <div className="architecture-layer">
            <h3>Microservices</h3>
            <div className="layer-items">
              <div className="arch-item">User Service</div>
              <div className="arch-item">Product Service</div>
              <div className="arch-item">Cart Service</div>
              <div className="arch-item">Order Service</div>
              <div className="arch-item">Payment Service</div>
            </div>
          </div>
          
          <div className="architecture-layer">
            <h3>Data Layer</h3>
            <div className="layer-items">
              <div className="arch-item">MongoDB</div>
              <div className="arch-item">PostgreSQL</div>
              <div className="arch-item">Redis</div>
              <div className="arch-item">Kafka</div>
            </div>
          </div>
        </div>
      </section>

      {/* API Testing */}
      <section className="section">
        <h2>🧪 API Testing</h2>
        <div className="api-testing">
          <p>Test our APIs directly:</p>
          <div className="api-links">
            <a href="/api/products" target="_blank" rel="noopener noreferrer" className="api-link">
              📦 Products API
            </a>
            <a href="/api/categories" target="_blank" rel="noopener noreferrer" className="api-link">
              🏷️ Categories API
            </a>
            <a href="http://localhost:8080/health" target="_blank" rel="noopener noreferrer" className="api-link">
              ❤️ Health Check
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
