const jwt = require('jsonwebtoken');
const redis = require('redis');
const vaultService = require('../services/vaultService');
const logger = require('../utils/logger');

let redisClient;

// Initialize Redis client
async function initializeRedis() {
  if (!redisClient) {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });
    
    await redisClient.connect();
  }
  return redisClient;
}

async function authMiddleware(req, res, next) {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Access token is required'
      });
    }

    // Check if token is blacklisted
    await initializeRedis();
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token has been revoked'
      });
    }

    // Get JWT secret from Vault
    const jwtSecret = await vaultService.getSecret('jwt-secret');
    
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    
    // Check if user session exists in Redis
    const userSession = await redisClient.get(`session:${decoded.userId}`);
    if (!userSession) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Session has expired'
      });
    }

    // Attach user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      sessionId: decoded.sessionId
    };

    // Update session expiry
    await redisClient.expire(`session:${decoded.userId}`, 3600); // 1 hour

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token has expired'
      });
    }
    
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication service temporarily unavailable'
    });
  }
}

function extractToken(req) {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Also check for token in cookies (for web clients)
  if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken;
  }
  
  return null;
}

// Admin role middleware
async function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required'
    });
  }
  next();
}

// Optional auth middleware (for endpoints that work with or without auth)
async function optionalAuthMiddleware(req, res, next) {
  const token = extractToken(req);
  
  if (!token) {
    return next();
  }
  
  try {
    await initializeRedis();
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return next();
    }

    const jwtSecret = await vaultService.getSecret('jwt-secret');
    const decoded = jwt.verify(token, jwtSecret);
    
    const userSession = await redisClient.get(`session:${decoded.userId}`);
    if (userSession) {
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        sessionId: decoded.sessionId
      };
    }
  } catch (error) {
    logger.warn('Optional auth failed:', error.message);
  }
  
  next();
}

module.exports = {
  authMiddleware,
  adminMiddleware,
  optionalAuthMiddleware,
  initializeRedis
};
