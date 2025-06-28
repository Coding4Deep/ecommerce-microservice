# E-Commerce Microservices Platform

A production-grade, polyglot microservice-based e-commerce platform similar to Amazon/Flipkart.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Web     │    │   Mobile Apps    │    │   Admin Panel   │
│   Frontend      │    │   (Future)       │    │   Dashboard     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────────┐
                    │   API Gateway       │
                    │   (Node.js/Express) │
                    └─────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
┌───────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ User Service  │    │ Product Catalog  │    │  Cart Service   │
│ (Python/      │    │ Service (Java/   │    │ (Node.js/       │
│ FastAPI)      │    │ Spring Boot)     │    │ Express)        │
└───────────────┘    └──────────────────┘    └─────────────────┘
        │                       │                        │
┌───────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Order Service │    │ Payment Service  │    │Inventory Service│
│ (Go/Gin)      │    │ (Python/FastAPI) │    │ (Java/Spring)   │
└───────────────┘    └──────────────────┘    └─────────────────┘
        │                       │                        │
┌───────────────┐    ┌──────────────────┐    ┌─────────────────┐
│Review Service │    │Notification Svc  │    │  Admin Service  │
│(Python/FastAPI│    │ (Node.js/Kafka)  │    │ (Node.js/Express│
└───────────────┘    └──────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

### Services & Languages
- **API Gateway**: Node.js (Express) with rate limiting & authentication
- **User Service**: Python (FastAPI) - JWT auth, user profiles
- **Product Catalog**: Java (Spring Boot) - product management, search
- **Cart Service**: Node.js (Express) - session-based cart management
- **Order Service**: Go (Gin) - order processing, workflow
- **Payment Service**: Python (FastAPI) - payment processing simulation
- **Inventory Service**: Java (Spring Boot) - stock management
- **Review Service**: Python (FastAPI) - ratings and reviews
- **Notification Service**: Node.js - email/SMS via Kafka consumers
- **Admin Service**: Node.js (Express) - admin panel backend

### Databases & Infrastructure
- **MongoDB**: Primary database (products, users, orders)
- **Redis**: Caching, sessions, cart storage
- **PostgreSQL**: Financial data (payments, transactions)
- **Apache Kafka**: Event streaming and async communication
- **HashiCorp Vault**: Secrets management
- **Docker & Kubernetes**: Containerization and orchestration

### Frontend
- **React**: Modern SPA with Redux/Context API
- **Material-UI**: Component library
- **React Router**: Client-side routing

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Python 3.9+
- Java 17+
- Go 1.19+

### Local Development
```bash
# Clone and setup
git clone <repository-url>
cd ecommerce-microservices

# Start all services
docker-compose up -d

# Access services
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Admin Panel: http://localhost:3001
```

### Production Deployment
```bash
# Deploy to Kubernetes
kubectl apply -f k8s/
```

## 📁 Project Structure

```
ecommerce-microservices/
├── services/
│   ├── api-gateway/          # Node.js API Gateway
│   ├── user-service/         # Python FastAPI
│   ├── product-service/      # Java Spring Boot
│   ├── cart-service/         # Node.js Express
│   ├── order-service/        # Go Gin
│   ├── payment-service/      # Python FastAPI
│   ├── inventory-service/    # Java Spring Boot
│   ├── review-service/       # Python FastAPI
│   ├── notification-service/ # Node.js Kafka
│   └── admin-service/        # Node.js Express
├── frontend/
│   ├── web-app/             # React frontend
│   └── admin-panel/         # React admin dashboard
├── infrastructure/
│   ├── docker-compose.yml   # Local development
│   ├── k8s/                 # Kubernetes manifests
│   └── vault/               # Vault configuration
├── data/
│   └── seed/                # Sample data and images
└── docs/                    # API documentation
```

## 🔐 Security Features

- JWT-based authentication with refresh tokens
- Rate limiting on API Gateway
- Input validation and sanitization
- CORS configuration
- Secrets management with Vault
- HTTPS/TLS in production

## 📊 Monitoring & Observability

- Health check endpoints (`/health`)
- Prometheus metrics
- Structured logging
- Distributed tracing (Jaeger)
- API documentation (Swagger/OpenAPI)

## 🧪 Testing

Each service includes:
- Unit tests
- Integration tests
- API contract tests
- Load testing scripts

## 📈 Scalability Features

- Horizontal pod autoscaling
- Database connection pooling
- Redis caching strategies
- Kafka event-driven architecture
- CDN-ready static assets

## 🔄 CI/CD Pipeline

- GitHub Actions workflows
- Automated testing
- Docker image building
- Kubernetes deployment
- Security scanning

## 📚 Documentation

- [API Documentation](./docs/api/)
- [Deployment Guide](./docs/deployment/)
- [Development Setup](./docs/development/)
- [Architecture Decisions](./docs/architecture/)

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and development process.

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.
