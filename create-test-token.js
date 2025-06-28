const jwt = require('jsonwebtoken');

// Create a test JWT token
const payload = {
  sub: 'test-user-123',
  email: 'test@example.com',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
};

const secret = 'your-jwt-secret-change-in-production-2024';
const token = jwt.sign(payload, secret);

console.log('Test JWT Token:');
console.log(token);
