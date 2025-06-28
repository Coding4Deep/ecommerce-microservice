# 📧 Notification Service

Node.js-based microservice for multi-channel notifications including email, SMS, push notifications, and real-time updates.

## 🚀 Features

- **Email Notifications** with HTML templates
- **SMS Notifications** via Twilio
- **Push Notifications** via Firebase
- **Real-time Notifications** with Socket.IO
- **Bulk Notification Processing**
- **Template Management**
- **Delivery Tracking**
- **Retry Logic** for failed deliveries

## 🛠️ Technology Stack

- **Node.js 18+**
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **Nodemailer** - Email sending
- **Twilio** - SMS service
- **Firebase Admin** - Push notifications
- **MongoDB** - Notification storage
- **Redis** - Queue management
- **Bull** - Job queue processing

## 📁 Project Structure

```
notification-service/
├── src/
│   ├── server.js            # Express application entry point
│   ├── routes/              # API route handlers
│   ├── services/            # Notification services
│   │   ├── emailService.js  # Email handling
│   │   ├── smsService.js    # SMS handling
│   │   └── pushService.js   # Push notification handling
│   ├── models/              # Database models
│   ├── templates/           # Email templates
│   └── utils/               # Utility functions
├── package.json             # Node.js dependencies
├── Dockerfile              # Container configuration
└── README.md               # This file
```

## 🔧 Environment Variables

```bash
# Server
NODE_ENV=development
PORT=8005

# Database
MONGODB_URI=mongodb://admin:password123@mongodb:27017/ecommerce?authSource=admin

# Redis
REDIS_URL=redis://:redis123@redis:6379/3

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@ecommerce.com

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Push Notifications (Firebase)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
```

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Docker
```bash
# Build image
docker build -t notification-service .

# Run container
docker run -p 8005:8005 notification-service
```

## 📚 API Endpoints

### Email Notifications
```http
POST /api/send-email         # Send single email
POST /api/send-bulk-email    # Send bulk emails
```

### SMS Notifications
```http
POST /api/send-sms           # Send single SMS
POST /api/send-bulk-sms      # Send bulk SMS
```

### Push Notifications
```http
POST /api/send-push          # Send push notification
POST /api/send-bulk-push     # Send bulk push notifications
```

### Bulk Operations
```http
POST /api/send-bulk          # Send mixed notification types
```

### Management
```http
GET    /api/notifications           # List notifications
GET    /api/notifications/{id}      # Get notification details
PUT    /api/notifications/{id}      # Update notification
DELETE /api/notifications/{id}      # Delete notification
GET    /api/templates              # List email templates
POST   /api/templates              # Create email template
```

### Health & Status
```http
GET /health                  # Service health check
```

## 📧 Email Templates

### Available Templates
- **welcome** - Welcome new users
- **order_confirmation** - Order confirmation
- **shipping_update** - Shipping notifications
- **password_reset** - Password reset emails

### Template Usage
```javascript
// Send welcome email
{
  "to": "user@example.com",
  "subject": "Welcome to Our Store!",
  "template": "welcome",
  "data": {
    "name": "John Doe",
    "loginUrl": "https://yourstore.com/login"
  }
}
```

### Custom Templates
```javascript
// Create custom template
{
  "name": "custom_template",
  "subject": "Custom Subject",
  "html": "<h1>Hello {{name}}</h1><p>{{message}}</p>",
  "variables": ["name", "message"]
}
```

## 📱 Real-time Notifications

### Socket.IO Integration
```javascript
// Client-side connection
const socket = io('http://localhost:8005');

// Join user room for personal notifications
socket.emit('join_user_room', userId);

// Listen for notifications
socket.on('notification', (data) => {
  console.log('New notification:', data);
  // Display notification to user
});
```

### Server-side Broadcasting
```javascript
// Send real-time notification
io.to(`user_${userId}`).emit('notification', {
  title: 'Order Update',
  body: 'Your order has been shipped!',
  data: { orderId: '12345' },
  timestamp: new Date().toISOString()
});
```

## 🔄 Notification Queue

### Job Processing
```javascript
// Add email job to queue
await emailQueue.add('send-email', {
  to: 'user@example.com',
  subject: 'Test Email',
  template: 'welcome',
  data: { name: 'John' }
});

// Process jobs
emailQueue.process('send-email', async (job) => {
  const { to, subject, template, data } = job.data;
  await emailService.sendEmail(to, subject, template, data);
});
```

### Retry Logic
- Failed notifications are automatically retried
- Exponential backoff for retry delays
- Dead letter queue for permanently failed notifications
- Configurable retry attempts and delays

## 📊 Data Models

### Notification Model
```javascript
{
  "_id": "ObjectId",
  "userId": "string",
  "type": "email|sms|push",
  "channel": "email|sms|push|in-app",
  "title": "string",
  "message": "string",
  "template": "string",
  "data": {},
  "status": "pending|sent|failed|delivered",
  "sentAt": "Date",
  "deliveredAt": "Date",
  "failureReason": "string",
  "retryCount": "number",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Template Model
```javascript
{
  "_id": "ObjectId",
  "name": "string",
  "type": "email|sms|push",
  "subject": "string",
  "content": "string",
  "variables": ["string"],
  "isActive": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## 🧪 Testing

### Manual Testing
```bash
# Send test email
curl -X POST http://localhost:8005/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "template": "welcome",
    "data": {
      "name": "Test User",
      "loginUrl": "http://localhost:3000/login"
    }
  }'

# Send test SMS
curl -X POST http://localhost:8005/api/send-sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890",
    "message": "Test SMS from E-commerce Platform"
  }'

# Send test push notification
curl -X POST http://localhost:8005/api/send-push \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "title": "Test Notification",
    "body": "This is a test push notification",
    "data": {
      "action": "test"
    }
  }'
```

### Health Check
```bash
curl http://localhost:8005/health
```

## 🔧 Configuration

### Email Configuration
- Supports SMTP providers (Gmail, SendGrid, etc.)
- HTML and plain text emails
- Attachment support
- Template variables and personalization

### SMS Configuration
- Twilio integration for SMS delivery
- International number support
- Delivery status tracking
- Cost optimization features

### Push Notification Configuration
- Firebase Cloud Messaging (FCM)
- iOS and Android support
- Topic-based messaging
- Rich notifications with images and actions

## 📈 Monitoring

### Health Endpoint
```json
{
  "status": "healthy",
  "service": "notification-service",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00Z",
  "uptime": 3600,
  "mongodb": "connected",
  "redis": "connected"
}
```

### Metrics
- Notification delivery rates
- Template usage statistics
- Queue processing metrics
- Error rates by channel
- Response times

## 🚨 Error Handling

### Common Error Responses
```json
{
  "success": false,
  "message": "Failed to send email",
  "error": "SMTP connection failed",
  "code": "EMAIL_DELIVERY_FAILED"
}
```

### Error Codes
- `EMAIL_DELIVERY_FAILED` - Email sending failed
- `SMS_DELIVERY_FAILED` - SMS sending failed
- `PUSH_DELIVERY_FAILED` - Push notification failed
- `TEMPLATE_NOT_FOUND` - Email template not found
- `INVALID_RECIPIENT` - Invalid email/phone number
- `RATE_LIMIT_EXCEEDED` - Too many requests

## 🔄 Development

### Adding New Templates
1. Create HTML template file
2. Add template to database
3. Test template rendering
4. Update documentation

### Adding New Channels
1. Create service handler
2. Add API endpoints
3. Implement queue processing
4. Add error handling
5. Update tests

## 🐛 Troubleshooting

### Common Issues
1. **SMTP Errors**: Check email credentials and server settings
2. **SMS Failures**: Verify Twilio configuration and phone numbers
3. **Push Notification Issues**: Check Firebase configuration
4. **Queue Processing**: Monitor Redis connection and job processing

### Debugging
```bash
# Enable debug logging
export LOG_LEVEL=debug

# Check service logs
docker logs notification-service

# Monitor queue status
redis-cli -h localhost -p 6379 monitor
```

## 📝 License

This service is part of the E-Commerce Microservices Platform and is licensed under the MIT License.
