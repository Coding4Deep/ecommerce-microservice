# User Service

Handles user authentication, registration, and profile management.

## Features
- User registration and login
- JWT token generation
- Password hashing with bcrypt
- Profile management
- Session handling

## Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update profile
- `GET /health` - Health check

## Environment Variables
```env
PORT=8001
JWT_SECRET=your-secret
BCRYPT_ROUNDS=10
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
