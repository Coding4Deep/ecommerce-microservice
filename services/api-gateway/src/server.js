const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://admin.yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'API Gateway',
    version: '1.0.0'
  });
});

// Service URLs
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:8000';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:8080';
const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://cart-service:8000';

// Products endpoint
app.get('/api/products', async (req, res) => {
  try {
    const products = [
      {
        id: '1',
        name: 'iPhone 15 Pro Max',
        description: 'Latest iPhone with advanced features',
        price: 1199.99,
        category: 'Electronics',
        image: 'https://via.placeholder.com/300x300?text=iPhone+15+Pro+Max',
        stock: 50,
        brand: 'Apple'
      },
      {
        id: '2',
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Android smartphone',
        price: 1099.99,
        category: 'Electronics',
        image: 'https://via.placeholder.com/300x300?text=Galaxy+S24+Ultra',
        stock: 30,
        brand: 'Samsung'
      },
      {
        id: '3',
        name: 'MacBook Pro 16"',
        description: 'Professional laptop for developers',
        price: 2499.99,
        category: 'Electronics',
        image: 'https://via.placeholder.com/300x300?text=MacBook+Pro+16',
        stock: 15,
        brand: 'Apple'
      },
      {
        id: '4',
        name: 'Sony WH-1000XM5',
        description: 'Noise-canceling wireless headphones',
        price: 399.99,
        category: 'Electronics',
        image: 'https://via.placeholder.com/300x300?text=Sony+WH-1000XM5',
        stock: 25,
        brand: 'Sony'
      },
      {
        id: '5',
        name: 'Nike Air Max 270',
        description: 'Comfortable running shoes',
        price: 149.99,
        category: 'Footwear',
        image: 'https://via.placeholder.com/300x300?text=Nike+Air+Max+270',
        stock: 40,
        brand: 'Nike'
      }
    ];
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Categories endpoint
app.get('/api/categories', (req, res) => {
  const categories = [
    { id: '1', name: 'Electronics', slug: 'electronics' },
    { id: '2', name: 'Footwear', slug: 'footwear' },
    { id: '3', name: 'Clothing', slug: 'clothing' },
    { id: '4', name: 'Books', slug: 'books' },
    { id: '5', name: 'Home & Garden', slug: 'home-garden' }
  ];
  
  res.json(categories);
});

// Proxy auth requests to User Service
app.use('/auth', async (req, res) => {
  console.log("Auth proxy hit:", req.method, req.path, "-> URL:", `${USER_SERVICE_URL}/auth${req.path}`);
  try {
    const fetch = require('node-fetch');
    
    const response = await fetch(`${USER_SERVICE_URL}/auth${req.path}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || ''
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    
    res.json(data);
  } catch (error) {
    console.error('User Service proxy error:', error);
    res.status(500).json({ error: 'User Service unavailable' });
  }
});

// Proxy user profile requests to User Service
app.use('/users', async (req, res) => {
  try {
    const fetch = require('node-fetch');
    
    const response = await fetch(`${USER_SERVICE_URL}/users${req.path}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || ''
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    
    res.json(data);
  } catch (error) {
    console.error('User Service proxy error:', error);
    res.status(500).json({ error: 'User Service unavailable' });
  }
});

// Proxy cart requests to Cart Service
app.use('/api/cart', async (req, res) => {
  console.log("Cart proxy hit:", req.method, req.path, "-> URL:", `${CART_SERVICE_URL}/api/cart${req.path}`);
  try {
    const fetch = require('node-fetch');
    
    const response = await fetch(`${CART_SERVICE_URL}/api/cart${req.path}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || ''
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    
    res.json(data);
  } catch (error) {
    console.error('Cart Service proxy error:', error);
    res.status(500).json({ error: 'Cart Service unavailable' });
  }
});

// Admin routes (REAL authentication)
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Admin endpoints: http://localhost:${PORT}/api/admin/*`);
});

module.exports = app;
