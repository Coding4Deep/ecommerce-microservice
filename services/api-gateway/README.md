# API Gateway Service

Central entry point for all API requests with routing, authentication, and admin functionality.

## Features
- Request routing to microservices
- JWT authentication
- Rate limiting and security
- Admin API endpoints
- Health monitoring

## Endpoints
- `GET /health` - Service health check
- `POST /auth/*` - Authentication routes
- `GET /api/products` - Product routes
- `GET /api/cart` - Cart routes
- `GET /api/admin/*` - Admin routes

## Environment Variables
```env
PORT=8080
JWT_SECRET=your-secret
USER_SERVICE_URL=http://user-service:8000
PRODUCT_SERVICE_URL=http://product-service:8080
CART_SERVICE_URL=http://cart-service:8000
```

## Development
```bash
npm install
npm run dev
```

## Testing
```bash
npm test
```
