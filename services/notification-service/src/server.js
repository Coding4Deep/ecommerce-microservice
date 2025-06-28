const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
const logger = require('./utils/logger');
const notificationRoutes = require('./routes/notifications');
const emailService = require('./services/emailService');
const smsService = require('./services/smsService');
const pushService = require('./services/pushService');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 8005;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/ecommerce';
const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// MongoDB connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  logger.info('Connected to MongoDB');
})
.catch((error) => {
  logger.error('MongoDB connection error:', error);
  process.exit(1);
});

// Socket.IO for real-time notifications
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
    logger.info(`User ${userId} joined their notification room`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Make io available to routes
app.set('io', io);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'notification-service',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API routes
app.use('/api/notifications', notificationRoutes);

// Notification endpoints for other services
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, template, data } = req.body;
    const result = await emailService.sendEmail(to, subject, template, data);
    
    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId
    });
  } catch (error) {
    logger.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
});

app.post('/api/send-sms', async (req, res) => {
  try {
    const { to, message } = req.body;
    const result = await smsService.sendSMS(to, message);
    
    res.status(200).json({
      success: true,
      message: 'SMS sent successfully',
      sid: result.sid
    });
  } catch (error) {
    logger.error('SMS sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send SMS',
      error: error.message
    });
  }
});

app.post('/api/send-push', async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;
    const result = await pushService.sendPushNotification(userId, title, body, data);
    
    // Also emit real-time notification
    io.to(`user_${userId}`).emit('notification', {
      title,
      body,
      data,
      timestamp: new Date().toISOString()
    });
    
    res.status(200).json({
      success: true,
      message: 'Push notification sent successfully',
      result
    });
  } catch (error) {
    logger.error('Push notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send push notification',
      error: error.message
    });
  }
});

// Bulk notification endpoint
app.post('/api/send-bulk', async (req, res) => {
  try {
    const { notifications } = req.body;
    const results = [];
    
    for (const notification of notifications) {
      try {
        let result;
        
        switch (notification.type) {
          case 'email':
            result = await emailService.sendEmail(
              notification.to,
              notification.subject,
              notification.template,
              notification.data
            );
            break;
          case 'sms':
            result = await smsService.sendSMS(notification.to, notification.message);
            break;
          case 'push':
            result = await pushService.sendPushNotification(
              notification.userId,
              notification.title,
              notification.body,
              notification.data
            );
            // Real-time notification
            io.to(`user_${notification.userId}`).emit('notification', {
              title: notification.title,
              body: notification.body,
              data: notification.data,
              timestamp: new Date().toISOString()
            });
            break;
        }
        
        results.push({
          type: notification.type,
          status: 'success',
          result
        });
      } catch (error) {
        results.push({
          type: notification.type,
          status: 'error',
          error: error.message
        });
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Bulk notifications processed',
      results
    });
  } catch (error) {
    logger.error('Bulk notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process bulk notifications',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

server.listen(PORT, () => {
  logger.info(`Notification service running on port ${PORT}`);
});

module.exports = app;
