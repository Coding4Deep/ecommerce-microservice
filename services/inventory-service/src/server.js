const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const redis = require('redis');
const cron = require('node-cron');
const logger = require('./utils/logger');
const inventoryRoutes = require('./routes/inventory');

const app = express();
const PORT = process.env.PORT || 8007;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/ecommerce';
const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';

// Redis client
const redisClient = redis.createClient({ url: REDIS_URL });
redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.connect();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Higher limit for inventory operations
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

// Make Redis available to routes
app.set('redis', redisClient);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'inventory-service',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    redis: redisClient.isReady ? 'connected' : 'disconnected'
  });
});

// API routes
app.use('/api/inventory', inventoryRoutes);

// Stock check endpoint for other services
app.post('/api/check-stock', async (req, res) => {
  try {
    const { items } = req.body; // Array of { productId, quantity }
    const Inventory = require('./models/Inventory');
    
    const stockCheck = [];
    
    for (const item of items) {
      const inventory = await Inventory.findOne({ productId: item.productId });
      
      stockCheck.push({
        productId: item.productId,
        requestedQuantity: item.quantity,
        availableQuantity: inventory ? inventory.quantity : 0,
        inStock: inventory ? inventory.quantity >= item.quantity : false,
        reserved: inventory ? inventory.reserved : 0
      });
    }
    
    const allInStock = stockCheck.every(item => item.inStock);
    
    res.status(200).json({
      success: true,
      allInStock,
      items: stockCheck
    });
  } catch (error) {
    logger.error('Stock check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check stock',
      error: error.message
    });
  }
});

// Reserve stock endpoint
app.post('/api/reserve-stock', async (req, res) => {
  try {
    const { items, orderId } = req.body;
    const Inventory = require('./models/Inventory');
    const StockReservation = require('./models/StockReservation');
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const reservations = [];
      
      for (const item of items) {
        const inventory = await Inventory.findOne({ productId: item.productId }).session(session);
        
        if (!inventory || inventory.quantity < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }
        
        // Update inventory
        await Inventory.updateOne(
          { productId: item.productId },
          { 
            $inc: { 
              quantity: -item.quantity,
              reserved: item.quantity 
            }
          }
        ).session(session);
        
        // Create reservation record
        const reservation = new StockReservation({
          productId: item.productId,
          orderId,
          quantity: item.quantity,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
        });
        
        await reservation.save({ session });
        reservations.push(reservation);
      }
      
      await session.commitTransaction();
      
      res.status(200).json({
        success: true,
        message: 'Stock reserved successfully',
        reservations: reservations.map(r => r._id)
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    logger.error('Stock reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reserve stock',
      error: error.message
    });
  }
});

// Release stock endpoint
app.post('/api/release-stock', async (req, res) => {
  try {
    const { orderId } = req.body;
    const Inventory = require('./models/Inventory');
    const StockReservation = require('./models/StockReservation');
    
    const reservations = await StockReservation.find({ orderId });
    
    for (const reservation of reservations) {
      await Inventory.updateOne(
        { productId: reservation.productId },
        { 
          $inc: { 
            quantity: reservation.quantity,
            reserved: -reservation.quantity 
          }
        }
      );
      
      await StockReservation.deleteOne({ _id: reservation._id });
    }
    
    res.status(200).json({
      success: true,
      message: 'Stock released successfully'
    });
  } catch (error) {
    logger.error('Stock release error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to release stock',
      error: error.message
    });
  }
});

// Cron job to clean up expired reservations
cron.schedule('*/5 * * * *', async () => {
  try {
    const StockReservation = require('./models/StockReservation');
    const Inventory = require('./models/Inventory');
    
    const expiredReservations = await StockReservation.find({
      expiresAt: { $lt: new Date() }
    });
    
    for (const reservation of expiredReservations) {
      await Inventory.updateOne(
        { productId: reservation.productId },
        { 
          $inc: { 
            quantity: reservation.quantity,
            reserved: -reservation.quantity 
          }
        }
      );
      
      await StockReservation.deleteOne({ _id: reservation._id });
    }
    
    if (expiredReservations.length > 0) {
      logger.info(`Cleaned up ${expiredReservations.length} expired stock reservations`);
    }
  } catch (error) {
    logger.error('Error cleaning up expired reservations:', error);
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
  redisClient.quit();
  mongoose.connection.close();
  process.exit(0);
});

app.listen(PORT, () => {
  logger.info(`Inventory service running on port ${PORT}`);
});

module.exports = app;
