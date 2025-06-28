# 👥 User Service

FastAPI-based microservice for user authentication, profile management, and user-related operations.

## 🚀 Features

- **User Registration & Authentication**
- **JWT Token Management** (Access & Refresh tokens)
- **Password Hashing** with bcrypt
- **Profile Management**
- **Email Verification**
- **Password Reset**
- **Role-based Access Control**

## 🛠️ Technology Stack

- **Python 3.9+**
- **FastAPI** - Modern, fast web framework
- **MongoDB** - Document database
- **Redis** - Session storage and caching
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **Pydantic** - Data validation

## 📁 Project Structure

```
user-service/
├── src/
│   ├── main.py              # FastAPI application entry point
│   ├── models/              # Pydantic models
│   ├── routes/              # API route handlers
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   └── config.py            # Configuration settings
├── requirements.txt         # Python dependencies
├── Dockerfile              # Container configuration
└── README.md               # This file
```

## 🔧 Environment Variables

```bash
# Database
DATABASE_URL=mongodb://admin:password123@mongodb:27017/ecommerce?authSource=admin

# Redis
REDIS_URL=redis://:redis123@redis:6379/0

# JWT
JWT_SECRET=your-jwt-secret-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Vault
VAULT_ADDR=http://vault:8200
VAULT_TOKEN=myroot
```

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn src.main:app --reload --port 8001
```

### Docker
```bash
# Build image
docker build -t user-service .

# Run container
docker run -p 8001:8000 user-service
```

## 📚 API Endpoints

### Authentication
```http
POST /auth/register          # User registration
POST /auth/login            # User login
POST /auth/refresh          # Refresh access token
POST /auth/logout           # User logout
POST /auth/forgot-password  # Request password reset
POST /auth/reset-password   # Reset password
```

### User Management
```http
GET    /users/me            # Get current user profile
PUT    /users/me            # Update user profile
DELETE /users/me            # Delete user account
GET    /users/{user_id}     # Get user by ID (admin only)
GET    /users               # List all users (admin only)
```

### Health & Status
```http
GET /health                 # Service health check
GET /metrics                # Service metrics
```

## 🔒 Authentication Flow

1. **Registration**: User provides email, password, and profile info
2. **Email Verification**: Optional email verification step
3. **Login**: User provides credentials, receives JWT tokens
4. **Token Usage**: Include `Authorization: Bearer <token>` in requests
5. **Token Refresh**: Use refresh token to get new access token
6. **Logout**: Invalidate tokens

## 📊 Data Models

### User Model
```python
{
    "id": "string",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "role": "user",  # user, admin
    "is_active": true,
    "is_verified": false,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
}
```

### Token Response
```python
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "bearer",
    "expires_in": 1800,
    "user": {
        "id": "string",
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "role": "user"
    }
}
```

## 🧪 Testing

### Manual Testing
```bash
# Register new user
curl -X POST http://localhost:8001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "first_name": "Test",
    "last_name": "User"
  }'

# Login
curl -X POST http://localhost:8001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get profile (with token)
curl -X GET http://localhost:8001/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Health Check
```bash
curl http://localhost:8001/health
```

## 🔧 Configuration

### Database Connection
The service connects to MongoDB using the connection string from `DATABASE_URL`. Ensure MongoDB is running and accessible.

### Redis Configuration
Redis is used for:
- Session storage
- Token blacklisting
- Rate limiting
- Caching user data

### Security Settings
- JWT tokens are signed with `JWT_SECRET`
- Passwords are hashed using bcrypt
- Rate limiting prevents brute force attacks
- Input validation prevents injection attacks

## 📈 Monitoring

### Health Endpoint
```json
{
    "status": "healthy",
    "service": "user-service",
    "version": "1.0.0",
    "timestamp": "2024-01-01T00:00:00Z",
    "database": "connected",
    "redis": "connected"
}
```

### Metrics
- Request count and latency
- Authentication success/failure rates
- Database connection status
- Memory and CPU usage

## 🚨 Error Handling

### Common Error Responses
```json
{
    "detail": "User already exists",
    "error_code": "USER_EXISTS",
    "status_code": 400
}
```

### Error Codes
- `USER_EXISTS` - Email already registered
- `INVALID_CREDENTIALS` - Wrong email/password
- `TOKEN_EXPIRED` - JWT token expired
- `INSUFFICIENT_PERMISSIONS` - Access denied
- `VALIDATION_ERROR` - Invalid input data

## 🔄 Development

### Adding New Endpoints
1. Create route handler in `src/routes/`
2. Add business logic in `src/services/`
3. Update models in `src/models/`
4. Add tests
5. Update documentation

### Database Migrations
- Use MongoDB's flexible schema
- Handle schema changes in application code
- Maintain backward compatibility

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection**: Check MongoDB URL and credentials
2. **Redis Connection**: Verify Redis is running and accessible
3. **JWT Errors**: Check secret key and token expiration
4. **Permission Errors**: Verify user roles and permissions

### Debugging
```bash
# Enable debug logging
export LOG_LEVEL=DEBUG

# Check service logs
docker logs user-service

# Test database connection
python -c "from src.database import test_connection; test_connection()"
```

## 📝 License

This service is part of the E-Commerce Microservices Platform and is licensed under the MIT License.
