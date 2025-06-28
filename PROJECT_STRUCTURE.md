# Project Structure

This document provides a comprehensive overview of the E-commerce Microservices Platform project structure.

## 📁 Root Directory Structure

```
ecommerce-microservices/
├── 📄 README.md                    # Main project documentation
├── 📄 DEVELOPMENT.md               # Development guide
├── 📄 PROJECT_STRUCTURE.md         # This file
├── 📄 docker-compose.yml           # Local development setup
├── 🚀 start.sh                     # One-command startup script
├── 📁 services/                    # Microservices directory
├── 📁 frontend/                    # Frontend applications
├── 📁 k8s/                         # Kubernetes manifests
├── 📁 data/                        # Sample data and seeds
├── 📁 infrastructure/              # Infrastructure configuration
├── 📁 docs/                        # Additional documentation
├── 📁 scripts/                     # Utility scripts
└── 📁 tests/                       # End-to-end tests
```

## 🔧 Services Directory

### API Gateway (Node.js/Express)
```
services/api-gateway/
├── 📄 package.json                 # Dependencies and scripts
├── 📄 Dockerfile                   # Container configuration
├── 📄 README.md                    # Service documentation
├── 📁 src/
│   ├── 📄 server.js                # Main application entry
│   ├── 📁 middleware/
│   │   ├── 📄 auth.js              # Authentication middleware
│   │   └── 📄 errorHandler.js      # Error handling
│   ├── 📁 services/
│   │   └── 📄 vaultService.js      # Vault integration
│   ├── 📁 utils/
│   │   └── 📄 logger.js            # Logging utility
│   └── 📁 docs/
│       └── 📄 api.yaml             # OpenAPI specification
├── 📁 tests/
│   ├── 📄 auth.test.js             # Authentication tests
│   └── 📄 routes.test.js           # Route tests
└── 📁 logs/                        # Application logs
```

### User Service (Python/FastAPI)
```
services/user-service/
├── 📄 requirements.txt             # Python dependencies
├── 📄 Dockerfile                   # Container configuration
├── 📄 README.md                    # Service documentation
├── 📁 src/
│   ├── 📄 main.py                  # FastAPI application
│   ├── 📄 database.py              # Database connection
│   ├── 📁 models/
│   │   ├── 📄 user.py              # User data models
│   │   └── 📄 __init__.py
│   ├── 📁 routers/
│   │   ├── 📄 auth.py              # Authentication routes
│   │   ├── 📄 users.py             # User management routes
│   │   ├── 📄 profile.py           # Profile routes
│   │   └── 📄 __init__.py
│   ├── 📁 services/
│   │   ├── 📄 vault_service.py     # Vault integration
│   │   ├── 📄 email_service.py     # Email service
│   │   └── 📄 __init__.py
│   └── 📁 utils/
│       ├── 📄 logger.py            # Logging configuration
│       └── 📄 __init__.py
├── 📁 tests/
│   ├── 📄 test_auth.py             # Authentication tests
│   ├── 📄 test_users.py            # User tests
│   └── 📄 conftest.py              # Test configuration
└── 📄 .env.example                 # Environment template
```

### Product Service (Java/Spring Boot)
```
services/product-service/
├── 📄 pom.xml                      # Maven configuration
├── 📄 Dockerfile                   # Container configuration
├── 📄 README.md                    # Service documentation
├── 📁 src/
│   ├── 📁 main/
│   │   ├── 📁 java/com/ecommerce/product/
│   │   │   ├── 📄 ProductServiceApplication.java
│   │   │   ├── 📁 controller/
│   │   │   │   ├── 📄 ProductController.java
│   │   │   │   └── 📄 CategoryController.java
│   │   │   ├── 📁 service/
│   │   │   │   ├── 📄 ProductService.java
│   │   │   │   └── 📄 CategoryService.java
│   │   │   ├── 📁 repository/
│   │   │   │   ├── 📄 ProductRepository.java
│   │   │   │   └── 📄 CategoryRepository.java
│   │   │   ├── 📁 model/
│   │   │   │   ├── 📄 Product.java
│   │   │   │   └── 📄 Category.java
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 ProductRequest.java
│   │   │   │   ├── 📄 ProductResponse.java
│   │   │   │   └── 📄 PagedResponse.java
│   │   │   └── 📁 config/
│   │   │       ├── 📄 MongoConfig.java
│   │   │       ├── 📄 RedisConfig.java
│   │   │       └── 📄 VaultConfig.java
│   │   └── 📁 resources/
│   │       ├── 📄 application.yml
│   │       └── 📄 application-prod.yml
│   └── 📁 test/
│       └── 📁 java/com/ecommerce/product/
│           ├── 📄 ProductServiceTest.java
│           └── 📄 ProductControllerTest.java
└── 📄 .env.example
```

### Cart Service (Node.js/Express)
```
services/cart-service/
├── 📄 package.json
├── 📄 Dockerfile
├── 📄 README.md
├── 📁 src/
│   ├── 📄 server.js
│   ├── 📁 controllers/
│   │   └── 📄 cartController.js
│   ├── 📁 services/
│   │   ├── 📄 cartService.js
│   │   └── 📄 redisService.js
│   ├── 📁 models/
│   │   └── 📄 cart.js
│   ├── 📁 middleware/
│   │   └── 📄 validation.js
│   └── 📁 routes/
│       └── 📄 cart.js
├── 📁 tests/
└── 📄 .env.example
```

### Order Service (Go/Gin)
```
services/order-service/
├── 📄 go.mod
├── 📄 go.sum
├── 📄 Dockerfile
├── 📄 README.md
├── 📄 main.go
├── 📁 internal/
│   ├── 📁 handlers/
│   │   └── 📄 order_handler.go
│   ├── 📁 services/
│   │   └── 📄 order_service.go
│   ├── 📁 models/
│   │   └── 📄 order.go
│   ├── 📁 repository/
│   │   └── 📄 order_repository.go
│   └── 📁 config/
│       └── 📄 config.go
├── 📁 pkg/
│   ├── 📁 database/
│   │   └── 📄 mongodb.go
│   ├── 📁 kafka/
│   │   └── 📄 producer.go
│   └── 📁 vault/
│       └── 📄 client.go
├── 📁 tests/
└── 📄 .env.example
```

### Payment Service (Python/FastAPI)
```
services/payment-service/
├── 📄 requirements.txt
├── 📄 Dockerfile
├── 📄 README.md
├── 📁 src/
│   ├── 📄 main.py
│   ├── 📄 database.py
│   ├── 📁 models/
│   │   └── 📄 payment.py
│   ├── 📁 routers/
│   │   └── 📄 payments.py
│   ├── 📁 services/
│   │   ├── 📄 payment_service.py
│   │   ├── 📄 stripe_service.py
│   │   └── 📄 kafka_service.py
│   └── 📁 utils/
│       └── 📄 logger.py
├── 📁 tests/
└── 📄 .env.example
```

### Additional Services
```
services/inventory-service/         # Java/Spring Boot - Stock management
services/review-service/            # Python/FastAPI - Reviews and ratings
services/notification-service/      # Node.js - Email/SMS notifications
services/admin-service/             # Node.js/Express - Admin operations
```

## 🌐 Frontend Directory

### Web Application (React)
```
frontend/web-app/
├── 📄 package.json
├── 📄 Dockerfile
├── 📄 nginx.conf                   # Nginx configuration
├── 📄 README.md
├── 📁 public/
│   ├── 📄 index.html
│   ├── 📄 manifest.json
│   └── 📁 images/
├── 📁 src/
│   ├── 📄 App.js                   # Main application component
│   ├── 📄 index.js                 # Application entry point
│   ├── 📁 components/
│   │   ├── 📁 Layout/
│   │   │   ├── 📄 Layout.js
│   │   │   ├── 📄 Header.js
│   │   │   └── 📄 Footer.js
│   │   ├── 📁 ProductCard/
│   │   │   └── 📄 ProductCard.js
│   │   ├── 📁 Cart/
│   │   │   └── 📄 CartItem.js
│   │   └── 📁 ProtectedRoute/
│   │       └── 📄 ProtectedRoute.js
│   ├── 📁 pages/
│   │   ├── 📁 Home/
│   │   │   └── 📄 Home.js
│   │   ├── 📁 Products/
│   │   │   ├── 📄 Products.js
│   │   │   └── 📄 ProductDetail.js
│   │   ├── 📁 Cart/
│   │   │   └── 📄 Cart.js
│   │   ├── 📁 Auth/
│   │   │   ├── 📄 Login.js
│   │   │   └── 📄 Register.js
│   │   └── 📁 Profile/
│   │       └── 📄 Profile.js
│   ├── 📁 store/
│   │   ├── 📄 store.js             # Redux store configuration
│   │   └── 📁 slices/
│   │       ├── 📄 authSlice.js
│   │       ├── 📄 productSlice.js
│   │       ├── 📄 cartSlice.js
│   │       └── 📄 orderSlice.js
│   ├── 📁 services/
│   │   ├── 📄 api.js               # API client
│   │   ├── 📄 authService.js
│   │   ├── 📄 productService.js
│   │   └── 📄 cartService.js
│   ├── 📁 utils/
│   │   ├── 📄 constants.js
│   │   └── 📄 helpers.js
│   └── 📁 styles/
│       ├── 📄 index.css
│       └── 📄 theme.js
├── 📁 tests/
│   ├── 📄 App.test.js
│   └── 📁 components/
└── 📄 .env.example
```

### Admin Panel (React)
```
frontend/admin-panel/
├── 📄 package.json
├── 📄 Dockerfile
├── 📄 README.md
├── 📁 src/
│   ├── 📄 App.js
│   ├── 📁 components/
│   │   ├── 📁 Dashboard/
│   │   ├── 📁 Products/
│   │   ├── 📁 Orders/
│   │   ├── 📁 Users/
│   │   └── 📁 Analytics/
│   ├── 📁 pages/
│   │   ├── 📄 Dashboard.js
│   │   ├── 📄 ProductManagement.js
│   │   ├── 📄 OrderManagement.js
│   │   └── 📄 UserManagement.js
│   └── 📁 store/
├── 📁 tests/
└── 📄 .env.example
```

## ☸️ Kubernetes Directory

```
k8s/
├── 📄 namespace.yaml               # Kubernetes namespace
├── 📄 mongodb.yaml                 # MongoDB deployment
├── 📄 redis.yaml                   # Redis deployment
├── 📄 postgresql.yaml              # PostgreSQL deployment
├── 📄 kafka.yaml                   # Kafka deployment
├── 📄 vault.yaml                   # Vault deployment
├── 📄 api-gateway.yaml             # API Gateway deployment
├── 📄 user-service.yaml            # User service deployment
├── 📄 product-service.yaml         # Product service deployment
├── 📄 cart-service.yaml            # Cart service deployment
├── 📄 order-service.yaml           # Order service deployment
├── 📄 payment-service.yaml         # Payment service deployment
├── 📄 inventory-service.yaml       # Inventory service deployment
├── 📄 review-service.yaml          # Review service deployment
├── 📄 notification-service.yaml    # Notification service deployment
├── 📄 admin-service.yaml           # Admin service deployment
├── 📄 web-frontend.yaml            # Web frontend deployment
├── 📄 admin-frontend.yaml          # Admin frontend deployment
├── 📄 ingress.yaml                 # Ingress configuration
├── 📄 secrets.yaml                 # Kubernetes secrets
├── 📄 configmaps.yaml              # Configuration maps
└── 📄 monitoring.yaml              # Monitoring stack
```

## 📊 Data Directory

```
data/
├── 📁 seed/
│   ├── 📄 mongo-init.js            # MongoDB initialization
│   ├── 📄 postgres-init.sql        # PostgreSQL initialization
│   └── 📄 sample-data.json         # Sample application data
├── 📁 images/
│   ├── 📁 products/                # Product images
│   │   ├── 📄 iphone-15-pro-1.jpg
│   │   ├── 📄 macbook-pro-14-1.jpg
│   │   └── ...
│   ├── 📁 categories/              # Category images
│   └── 📁 users/                   # User avatars
└── 📁 backups/                     # Database backups
```

## 🏗️ Infrastructure Directory

```
infrastructure/
├── 📁 vault/
│   ├── 📄 policies/
│   │   ├── 📄 admin-policy.hcl
│   │   └── 📄 service-policy.hcl
│   └── 📄 config.hcl
├── 📁 monitoring/
│   ├── 📄 prometheus.yml
│   ├── 📄 grafana-dashboard.json
│   └── 📄 alertmanager.yml
├── 📁 logging/
│   ├── 📄 elasticsearch.yml
│   ├── 📄 logstash.conf
│   └── 📄 kibana.yml
└── 📁 nginx/
    ├── 📄 nginx.conf
    └── 📄 ssl/
```

## 📚 Documentation Directory

```
docs/
├── 📄 api/
│   ├── 📄 user-service.md
│   ├── 📄 product-service.md
│   └── 📄 ...
├── 📄 deployment/
│   ├── 📄 local-setup.md
│   ├── 📄 kubernetes.md
│   └── 📄 production.md
├── 📄 architecture/
│   ├── 📄 system-design.md
│   ├── 📄 database-schema.md
│   └── 📄 security.md
└── 📄 guides/
    ├── 📄 contributing.md
    ├── 📄 testing.md
    └── 📄 troubleshooting.md
```

## 🧪 Tests Directory

```
tests/
├── 📁 e2e/                         # End-to-end tests
│   ├── 📄 user-journey.test.js
│   ├── 📄 checkout-flow.test.js
│   └── 📄 admin-operations.test.js
├── 📁 integration/                 # Integration tests
│   ├── 📄 api-gateway.test.js
│   └── 📄 service-communication.test.js
├── 📁 load/                        # Load tests
│   ├── 📄 product-catalog.js
│   └── 📄 checkout-process.js
└── 📁 fixtures/                    # Test data
    ├── 📄 users.json
    ├── 📄 products.json
    └── 📄 orders.json
```

## 🔧 Scripts Directory

```
scripts/
├── 📄 setup-dev.sh                 # Development environment setup
├── 📄 build-all.sh                 # Build all services
├── 📄 deploy-k8s.sh                # Kubernetes deployment
├── 📄 backup-db.sh                 # Database backup
├── 📄 restore-db.sh                # Database restore
├── 📄 run-tests.sh                 # Run all tests
├── 📄 generate-certs.sh            # SSL certificate generation
└── 📄 cleanup.sh                   # Environment cleanup
```

## 📋 Configuration Files

### Root Level Configuration
```
├── 📄 .env.example                 # Environment variables template
├── 📄 .gitignore                   # Git ignore rules
├── 📄 .dockerignore                # Docker ignore rules
├── 📄 docker-compose.yml           # Local development
├── 📄 docker-compose.prod.yml      # Production setup
├── 📄 Makefile                     # Build automation
└── 📄 LICENSE                      # Project license
```

## 🔍 Key Features by Directory

### Services
- **Polyglot Architecture**: Different languages for different services
- **Independent Deployment**: Each service can be deployed separately
- **Health Checks**: All services have health check endpoints
- **Logging**: Structured logging across all services
- **Testing**: Unit and integration tests for each service

### Frontend
- **Modern React**: Latest React with hooks and functional components
- **State Management**: Redux Toolkit for state management
- **Material-UI**: Consistent UI components
- **Responsive Design**: Mobile-first responsive design
- **PWA Ready**: Progressive Web App capabilities

### Infrastructure
- **Container Ready**: Docker containers for all services
- **Kubernetes Native**: Production-ready Kubernetes manifests
- **Secrets Management**: HashiCorp Vault integration
- **Monitoring**: Prometheus and Grafana setup
- **Logging**: ELK stack for centralized logging

### Data Management
- **Multi-Database**: MongoDB, PostgreSQL, Redis
- **Data Seeding**: Automatic sample data loading
- **Migrations**: Database schema versioning
- **Backups**: Automated backup scripts

This structure provides a solid foundation for a production-grade microservices platform with clear separation of concerns, scalability, and maintainability.
