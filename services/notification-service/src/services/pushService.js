const logger = require('../utils/logger');

class PushService {
  async sendPushNotification(userId, title, body, data = {}) {
    // Demo push service - logs instead of sending
    logger.info(`🔔 Push notification would be sent to user: ${userId}`);
    logger.info(`🔔 Title: ${title}`);
    logger.info(`🔔 Body: ${body}`);
    
    return {
      messageId: `demo_push_${Date.now()}`,
      status: 'sent'
    };
  }
}

module.exports = new PushService();
