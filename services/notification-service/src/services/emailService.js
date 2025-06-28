const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'demo@example.com',
        pass: process.env.SMTP_PASS || 'demo_password'
      }
    });
  }

  async sendEmail(to, subject, template, data = {}) {
    try {
      const htmlContent = this.generateEmailTemplate(template, data);
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@ecommerce.com',
        to,
        subject,
        html: htmlContent
      };

      // For demo purposes, we'll log instead of actually sending
      logger.info(`📧 Email would be sent to: ${to}`);
      logger.info(`📧 Subject: ${subject}`);
      logger.info(`📧 Template: ${template}`);
      
      // Simulate email sending
      return {
        messageId: `demo_${Date.now()}`,
        accepted: [to],
        rejected: []
      };

      // Uncomment below for actual email sending
      // const result = await this.transporter.sendMail(mailOptions);
      // logger.info(`Email sent successfully to ${to}:`, result.messageId);
      // return result;
    } catch (error) {
      logger.error('Email sending error:', error);
      throw error;
    }
  }

  generateEmailTemplate(template, data) {
    const templates = {
      welcome: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #667eea;">Welcome to Our E-commerce Store!</h1>
          <p>Hi ${data.name || 'Customer'},</p>
          <p>Thank you for joining our community! We're excited to have you on board.</p>
          <p>Start exploring our amazing products and enjoy exclusive deals.</p>
          <a href="${data.loginUrl || '#'}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
            Start Shopping
          </a>
          <p>Best regards,<br>The E-commerce Team</p>
        </div>
      `,
      order_confirmation: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #28a745;">Order Confirmed!</h1>
          <p>Hi ${data.name || 'Customer'},</p>
          <p>Your order #${data.orderId || 'N/A'} has been confirmed and is being processed.</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${data.orderId || 'N/A'}</p>
            <p><strong>Total:</strong> $${data.total || '0.00'}</p>
            <p><strong>Estimated Delivery:</strong> ${data.deliveryDate || '3-5 business days'}</p>
          </div>
          <a href="${data.trackingUrl || '#'}" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
            Track Your Order
          </a>
          <p>Thank you for your purchase!</p>
        </div>
      `,
      password_reset: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc3545;">Password Reset Request</h1>
          <p>Hi ${data.name || 'Customer'},</p>
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          <a href="${data.resetUrl || '#'}" style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
            Reset Password
          </a>
          <p>This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The E-commerce Team</p>
        </div>
      `,
      shipping_update: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #17a2b8;">Shipping Update</h1>
          <p>Hi ${data.name || 'Customer'},</p>
          <p>Your order #${data.orderId || 'N/A'} has been shipped!</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Shipping Details:</h3>
            <p><strong>Tracking Number:</strong> ${data.trackingNumber || 'N/A'}</p>
            <p><strong>Carrier:</strong> ${data.carrier || 'Standard Shipping'}</p>
            <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery || '2-3 business days'}</p>
          </div>
          <a href="${data.trackingUrl || '#'}" style="background: #17a2b8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
            Track Package
          </a>
          <p>Thank you for your patience!</p>
        </div>
      `
    };

    return templates[template] || `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Notification</h1>
        <p>${data.message || 'You have a new notification.'}</p>
      </div>
    `;
  }
}

module.exports = new EmailService();
