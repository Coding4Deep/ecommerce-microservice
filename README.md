# 🛒 E-commerce Microservices Platform

A modern e-commerce platform built with microservices architecture, featuring a beautiful admin interface and real-time functionality.

## 🚀 Quick Start

```bash
# Clone and start all services
git clone <repository>
cd ecommerce-microservices
docker-compose up -d

# Access the application
# Website: http://localhost:3000
# Admin Panel: http://localhost:3000 → Click "⚙️ Admin Panel"
# API Gateway: http://localhost:8080
```

## 🎯 Features

### 🛍️ **Customer Features**
- Product browsing and search
- Shopping cart functionality
- User registration and authentication
- Order management
- Responsive design

### ⚙️ **Admin Features**
- **Modern UI**: Beautiful gradient design with glass effects
- **User Management**: Add, edit, delete users with real data
- **Product Management**: Complete product catalog management
- **Service Monitoring**: Real-time health checks and status
- **Dashboard Analytics**: Live statistics and metrics
- **Integrated Experience**: No separate admin port needed

## 🏗️ Architecture

### **Services**
- **API Gateway** (Port 8080): Routes requests and handles authentication
- **User Service** (Port 8001): User management and authentication
- **Product Service** (Port 8002): Product catalog and inventory
- **Cart Service** (Port 8003): Shopping cart functionality
- **Web Frontend** (Port 3000): React-based user interface with integrated admin

### **Infrastructure**
- **Redis**: Session storage and caching
- **Vault**: Secrets management
- **Docker**: Containerization
- **Nginx**: Web server for frontend

## 📊 Admin Panel

### **Access Methods**
1. **Homepage Button**: Go to http://localhost:3000 → Click "⚙️ Admin Panel"
2. **Direct URL**: http://localhost:3000/admin

### **Admin Features**
- **Dashboard**: Service status, live statistics, quick actions
- **Users**: View, add, edit, delete users with search and filtering
- **Products**: Visual product management with images and categories
- **Services**: Monitor health, restart services, view response times

## 🔧 Development

### **Prerequisites**
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### **Local Development**
```bash
# Start infrastructure services
docker-compose up -d redis vault

# Start individual services for development
cd services/api-gateway && npm run dev
cd services/user-service && npm run dev
cd services/product-service && ./gradlew bootRun
cd services/cart-service && npm run dev
cd frontend/web-app && npm start
```

### **Environment Variables**
- `NODE_ENV`: Environment (development/production)
- `JWT_SECRET`: JWT signing secret
- `REDIS_URL`: Redis connection URL
- `VAULT_URL`: Vault server URL

## 🧪 Testing

```bash
# Test all services
docker-compose exec api-gateway npm test
docker-compose exec user-service npm test
docker-compose exec cart-service npm test

# Test frontend
docker-compose exec web-frontend npm test
```

## 📝 API Documentation

### **Main Endpoints**
- `GET /api/products` - Get all products
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart

### **Admin Endpoints**
- `GET /api/admin/users` - Get all users
- `POST /api/admin/products` - Create product
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/services/status` - Service health status

## 🚀 Deployment

### **Production Build**
```bash
# Build all services
docker-compose build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### **Environment Setup**
1. Set production environment variables
2. Configure SSL certificates
3. Set up monitoring and logging
4. Configure backup strategies

## 🔒 Security

- JWT-based authentication
- Input validation and sanitization
- CORS protection
- Rate limiting
- Secrets management with Vault
- HTTPS in production

## 📈 Monitoring

- Service health checks
- Real-time status monitoring
- Performance metrics
- Error tracking and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**🎉 Your modern e-commerce platform is ready!**

Access the admin panel at: http://localhost:3000 → Click "⚙️ Admin Panel"
