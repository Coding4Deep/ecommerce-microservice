const logger = require('../utils/logger');

class SMSService {
  async sendSMS(to, message) {
    // Demo SMS service - logs instead of sending
    logger.info(`📱 SMS would be sent to: ${to}`);
    logger.info(`📱 Message: ${message}`);
    
    return {
      sid: `demo_sms_${Date.now()}`,
      status: 'sent'
    };
  }
}

module.exports = new SMSService();
