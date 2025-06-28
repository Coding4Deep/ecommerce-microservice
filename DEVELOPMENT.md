# Development Guide

This guide will help you set up and develop the E-commerce Microservices Platform.

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:

- **Docker** (20.10+) and **Docker Compose** (2.0+)
- **Node.js** (18+) and **npm** (8+)
- **Python** (3.9+) and **pip**
- **Java** (17+) and **Maven** (3.8+)
- **Go** (1.19+)

### One-Command Startup

```bash
# Start the entire platform
./start.sh start

# Check status
./start.sh status

# View logs
./start.sh logs

# Stop everything
./start.sh stop
```

## 🏗️ Architecture Overview

### Microservices

| Service | Language | Port | Description |
|---------|----------|------|-------------|
| API Gateway | Node.js | 8080 | Central entry point, routing, auth |
| User Service | Python | 8001 | User management, authentication |
| Product Service | Java | 8002 | Product catalog, search |
| Cart Service | Node.js | 8003 | Shopping cart management |
| Order Service | Go | 8004 | Order processing |
| Payment Service | Python | 8005 | Payment processing |
| Inventory Service | Java | 8006 | Stock management |
| Review Service | Python | 8007 | Product reviews |
| Notification Service | Node.js | 8008 | Email/SMS notifications |
| Admin Service | Node.js | 8009 | Admin operations |

### Frontend Applications

| Application | Framework | Port | Description |
|-------------|-----------|------|-------------|
| Web App | React | 3000 | Customer-facing website |
| Admin Panel | React | 3001 | Admin dashboard |

### Infrastructure

| Service | Port | Description |
|---------|------|-------------|
| MongoDB | 27017 | Primary database |
| Redis | 6379 | Caching, sessions |
| PostgreSQL | 5432 | Financial data |
| Kafka | 9092 | Event streaming |
| Vault | 8200 | Secrets management |

## 🛠️ Development Setup

### 1. Clone and Setup

```bash
git clone <repository-url>
cd ecommerce-microservices
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### 3. Start Development Environment

```bash
# Start infrastructure only
docker-compose up -d mongodb redis postgresql kafka vault

# Start specific service for development
cd services/user-service
pip install -r requirements.txt
python src/main.py
```

### 4. Frontend Development

```bash
# Web App
cd frontend/web-app
npm install
npm start

# Admin Panel
cd frontend/admin-panel
npm install
npm start
```

## 🧪 Testing

### Unit Tests

Each service has its own test suite:

```bash
# Node.js services
npm test

# Python services
pytest

# Java services
mvn test

# Go services
go test ./...
```

### Integration Tests

```bash
# Run all integration tests
./scripts/run-integration-tests.sh
```

### API Testing

Use the provided Postman collection or curl commands:

```bash
# Health check
curl http://localhost:8080/health

# Register user
curl -X POST http://localhost:8080/api/users/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","first_name":"Test","last_name":"User"}'

# Get products
curl http://localhost:8080/api/products
```

## 📊 Monitoring and Debugging

### Logs

```bash
# View all logs
./start.sh logs

# View specific service logs
./start.sh logs user-service

# Follow logs in real-time
docker-compose logs -f api-gateway
```

### Health Checks

```bash
# Run health checks
./start.sh health

# Individual service health
curl http://localhost:8080/health
curl http://localhost:8001/health
curl http://localhost:8002/products/health
```

### Database Access

```bash
# MongoDB
docker exec -it ecommerce-mongodb mongo -u admin -p password123

# Redis
docker exec -it ecommerce-redis redis-cli -a redis123

# PostgreSQL
docker exec -it ecommerce-postgres psql -U postgres -d payments
```

## 🔧 Service Development

### Adding a New Service

1. Create service directory:
```bash
mkdir services/new-service
cd services/new-service
```

2. Add to docker-compose.yml:
```yaml
new-service:
  build:
    context: ./services/new-service
  ports:
    - "8010:8000"
  environment:
    - NODE_ENV=development
  depends_on:
    - mongodb
    - vault
```

3. Update API Gateway routing in `services/api-gateway/src/server.js`

4. Add Kubernetes manifests in `k8s/new-service.yaml`

### Service Communication

Services communicate via:

1. **HTTP REST APIs** - External communication
2. **Kafka Events** - Async communication
3. **Direct HTTP** - Internal service calls

Example event publishing:
```javascript
// Node.js
await kafka.producer.send({
  topic: 'order-events',
  messages: [{
    key: orderId,
    value: JSON.stringify({ type: 'ORDER_CREATED', orderId, userId })
  }]
});
```

### Database Patterns

Each service follows these patterns:

1. **Repository Pattern** - Data access abstraction
2. **ODM/ORM** - Object mapping (Mongoose, Spring Data, etc.)
3. **Migrations** - Database schema versioning
4. **Seeding** - Sample data for development

## 🔐 Security

### Authentication Flow

1. User registers/logs in via User Service
2. JWT token issued with user claims
3. API Gateway validates tokens
4. User context forwarded to services

### Secrets Management

All secrets are stored in HashiCorp Vault:

```bash
# Access Vault UI
open http://localhost:8200

# CLI access
export VAULT_ADDR=http://localhost:8200
export VAULT_TOKEN=myroot
vault kv get secret/jwt-secret
```

### Environment Variables

Never commit secrets to code. Use environment variables:

```bash
# .env file
DATABASE_URL=mongodb://admin:password123@localhost:27017/ecommerce
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
```

## 🚀 Deployment

### Local Development

```bash
./start.sh start
```

### Docker Compose (Staging)

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes (Production)

```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n ecommerce

# View logs
kubectl logs -f deployment/api-gateway -n ecommerce
```

## 📈 Performance Optimization

### Caching Strategy

1. **Redis** - Session data, cart data, frequently accessed data
2. **Application-level** - Service-specific caching
3. **CDN** - Static assets, images

### Database Optimization

1. **Indexes** - Proper indexing for queries
2. **Connection Pooling** - Efficient database connections
3. **Read Replicas** - Scale read operations

### Monitoring

1. **Health Checks** - Service availability
2. **Metrics** - Performance metrics (Prometheus)
3. **Tracing** - Request tracing (Jaeger)
4. **Logging** - Structured logging (ELK stack)

## 🐛 Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check what's using a port
   lsof -i :8080
   
   # Kill process
   kill -9 <PID>
   ```

2. **Database Connection Issues**
   ```bash
   # Check if MongoDB is running
   docker ps | grep mongodb
   
   # Check logs
   docker logs ecommerce-mongodb
   ```

3. **Service Not Starting**
   ```bash
   # Check service logs
   docker-compose logs service-name
   
   # Restart specific service
   docker-compose restart service-name
   ```

4. **Memory Issues**
   ```bash
   # Check Docker memory usage
   docker stats
   
   # Increase Docker memory limit
   # Docker Desktop -> Settings -> Resources -> Memory
   ```

### Debug Mode

Enable debug mode for detailed logging:

```bash
# Node.js services
DEBUG=* npm start

# Python services
LOG_LEVEL=DEBUG python src/main.py

# Java services
mvn spring-boot:run -Dspring-boot.run.arguments="--logging.level.root=DEBUG"
```

## 📚 API Documentation

### Swagger/OpenAPI

Each service provides API documentation:

- API Gateway: http://localhost:8080/api-docs
- User Service: http://localhost:8001/docs
- Product Service: http://localhost:8002/swagger-ui.html

### Postman Collection

Import the provided Postman collection for easy API testing:

```bash
# Collection file
postman/E-commerce-API.postman_collection.json
```

## 🤝 Contributing

### Code Style

1. **JavaScript/Node.js** - ESLint + Prettier
2. **Python** - Black + Flake8
3. **Java** - Google Java Style
4. **Go** - gofmt + golint

### Git Workflow

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit: `git commit -m "Add new feature"`
3. Push branch: `git push origin feature/new-feature`
4. Create Pull Request

### Testing Requirements

- Unit tests for all new code
- Integration tests for API endpoints
- End-to-end tests for critical user flows

## 📞 Support

### Getting Help

1. Check this documentation
2. Review service logs
3. Check GitHub issues
4. Contact the development team

### Useful Commands

```bash
# Quick status check
./start.sh status

# Health check all services
./start.sh health

# View specific service logs
docker-compose logs -f user-service

# Restart specific service
docker-compose restart product-service

# Clean up everything
docker-compose down -v
docker system prune -a
```
