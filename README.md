# 🛍️ Enterprise E-Commerce Microservices Platform

A comprehensive, production-ready e-commerce platform built with modern microservices architecture, featuring real-time notifications, advanced user management, product reviews, inventory tracking, and responsive web interfaces.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  Web App (React)     │  Admin Panel (React)                    │
│  Port: 3000          │  Port: 3001                             │
│  - User Interface    │  - Admin Dashboard                      │
│  - Product Catalog   │  - User Management                      │
│  - Shopping Cart     │  - Analytics                            │
│  - User Dashboard    │  - System Monitoring                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (Nginx)                       │
│                         Port: 8080                             │
│  - Load Balancing    - Rate Limiting    - Health Checks       │
│  - Request Routing   - SSL Termination  - CORS Handling       │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MICROSERVICES LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│ User Service     │ Product Service  │ Cart Service             │
│ (Python/FastAPI) │ (Java/Spring)    │ (Node.js/Express)        │
│ Port: 8001       │ Port: 8002       │ Port: 8003               │
│ - Authentication │ - Product CRUD   │ - Shopping Cart          │
│ - User Profiles  │ - Categories     │ - Session Management     │
│ - JWT Tokens     │ - Search/Filter  │ - Cart Persistence       │
├─────────────────────────────────────────────────────────────────┤
│ Notification     │ Review Service   │ Inventory Service        │
│ Service          │ (Node.js)        │ (Node.js)                │
│ (Node.js)        │ Port: 8006       │ Port: 8007               │
│ Port: 8005       │ - Product Reviews│ - Stock Management       │
│ - Email/SMS/Push │ - Rating System  │ - Stock Reservations     │
│ - Real-time      │ - Review Moderation│ - Low Stock Alerts     │
├─────────────────────────────────────────────────────────────────┤
│ Admin Service    │                                             │
│ (Go/Gin)         │                                             │
│ Port: 8009       │                                             │
│ - Admin Panel API│                                             │
│ - User Management│                                             │
│ - System Analytics│                                            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│ MongoDB          │ Redis Cache      │ HashiCorp Vault          │
│ Port: 27017      │ Port: 6379       │ Port: 8200               │
│ - Primary DB     │ - Session Store  │ - Secrets Management     │
│ - Document Store │ - Cache Layer    │ - API Keys               │
│ - Replica Sets   │ - Pub/Sub        │ - Certificates           │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Features

### 🛒 **E-Commerce Core**
- **Product Management**: 32+ sample products across 5 categories
- **Shopping Cart**: Persistent cart with session management
- **User Authentication**: JWT-based auth with refresh tokens
- **Order Processing**: Complete order lifecycle management
- **Payment Integration**: Ready for Stripe/PayPal integration

### 👥 **User Experience**
- **Responsive Design**: Mobile-first, works on all devices
- **User Dashboard**: Personal stats, order history, profile management
- **Product Reviews**: 5-star rating system with image uploads
- **Real-time Notifications**: Email, SMS, and push notifications
- **Advanced Search**: Filter by category, price, brand, ratings

### 🔧 **Admin Features**
- **Admin Dashboard**: Real-time analytics and system monitoring
- **User Management**: CRUD operations on user accounts
- **Product Management**: Add, edit, delete products and categories
- **Order Management**: Track and update order statuses
- **System Health**: Monitor all microservices health

### 📊 **Enterprise Features**
- **Microservices Architecture**: Scalable, maintainable, fault-tolerant
- **Real-time Updates**: WebSocket connections for live data
- **Inventory Management**: Stock tracking with automatic reservations
- **Notification System**: Multi-channel communication
- **Security**: JWT tokens, rate limiting, input validation
- **Monitoring**: Health checks, logging, error tracking

## 🛠️ Technology Stack

### **Frontend**
- **React 18**: Modern UI library with hooks
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **CSS3**: Custom responsive styling
- **Socket.IO Client**: Real-time communication

### **Backend Services**
- **Python/FastAPI**: User service with async support
- **Java/Spring Boot**: Product service with JPA
- **Node.js/Express**: Cart, notification, review, inventory services
- **Go/Gin**: Admin service for high performance
- **Nginx**: API Gateway and load balancer

### **Databases & Storage**
- **MongoDB**: Primary database for all services
- **Redis**: Caching and session storage
- **HashiCorp Vault**: Secrets management

### **DevOps & Infrastructure**
- **Docker**: Containerization for all services
- **Docker Compose**: Local development orchestration
- **Kubernetes**: Production deployment (configs included)
- **Health Checks**: Built-in monitoring for all services

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for development)
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd ecommerce-microservices
```

### 2. Start All Services
```bash
docker-compose up -d
```

### 3. Initialize Sample Data
```bash
node create-sample-products.js
```

### 4. Access Applications
- **Web App**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **API Gateway**: http://localhost:8080

### 5. Default Credentials
**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`

**Demo User:**
- Email: `demo@example.com`
- Password: `demo12345`

## 📁 Project Structure

```
ecommerce-microservices/
├── frontend/
│   ├── web-app/                 # React customer app
│   └── admin-app/               # React admin panel
├── services/
│   ├── user-service/            # Python/FastAPI
│   ├── product-service/         # Java/Spring Boot
│   ├── cart-service/            # Node.js/Express
│   ├── notification-service/    # Node.js/Express
│   ├── review-service/          # Node.js/Express
│   ├── inventory-service/       # Node.js/Express
│   ├── admin-service/           # Go/Gin
│   └── api-gateway/             # Nginx
├── k8s/                         # Kubernetes manifests
├── data/                        # Database initialization
├── docker-compose.yml           # Development setup
└── README.md                    # This file
```

## 🔧 Development

### Running Individual Services
```bash
# User Service
cd services/user-service
python -m uvicorn src.main:app --reload --port 8001

# Product Service
cd services/product-service
./mvnw spring-boot:run

# Cart Service
cd services/cart-service
npm install && npm run dev
```

### Environment Variables
Each service uses environment variables for configuration. See individual service README files for details.

### Database Setup
MongoDB is automatically initialized with sample data. To reset:
```bash
docker-compose down -v
docker-compose up -d
node create-sample-products.js
```

## 🧪 Testing

### Manual Testing
1. **User Flow**: Register → Login → Browse Products → Add to Cart → Checkout
2. **Admin Flow**: Login → Dashboard → Manage Users → Manage Products
3. **API Testing**: Use Postman collection (included in `/docs`)

### Health Checks
```bash
# Check all services
curl http://localhost:8080/health

# Individual services
curl http://localhost:8001/health  # User Service
curl http://localhost:8002/products/health  # Product Service
curl http://localhost:8003/health  # Cart Service
```

## 🚀 Production Deployment

### Kubernetes
```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n ecommerce
```

### Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml ecommerce
```

### Environment Configuration
- Set production environment variables
- Configure external databases
- Set up SSL certificates
- Configure monitoring and logging

## 📊 Monitoring & Observability

### Health Endpoints
- All services expose `/health` endpoints
- API Gateway aggregates health status
- Built-in service discovery

### Logging
- Structured JSON logging
- Centralized log aggregation ready
- Error tracking and alerting

### Metrics
- Performance metrics collection
- Business metrics tracking
- Real-time dashboards ready

## 🔒 Security

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Secure password hashing
- Session management

### API Security
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- SQL injection prevention

### Infrastructure Security
- Secrets management with Vault
- Network isolation
- Container security scanning
- Regular security updates

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow service-specific coding standards
- Write comprehensive tests
- Update documentation
- Ensure backward compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Troubleshooting](docs/troubleshooting.md)

### Getting Help
- Create an issue for bugs
- Use discussions for questions
- Check existing documentation first

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core e-commerce functionality
- ✅ Microservices architecture
- ✅ Admin panel
- ✅ Real-time notifications

### Phase 2 (Planned)
- [ ] Payment gateway integration
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations

### Phase 3 (Future)
- [ ] Multi-tenant support
- [ ] Advanced reporting
- [ ] Third-party integrations
- [ ] Machine learning features

---

**Built with ❤️ for modern e-commerce needs**

*This platform demonstrates enterprise-grade microservices architecture with real-world features and production-ready code.*
