import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from utils.logger import logger

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "localhost")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@ecommerce.com")

    async def send_verification_email(self, to_email: str, first_name: str, verification_token: str):
        """Send email verification email"""
        try:
            subject = "Verify Your Email Address"
            
            # Create verification URL
            verification_url = f"http://localhost:3000/verify-email?token={verification_token}"
            
            # HTML email content
            html_content = f"""
            <html>
                <body>
                    <h2>Welcome to E-commerce Platform!</h2>
                    <p>Hi {first_name},</p>
                    <p>Thank you for registering with us. Please click the link below to verify your email address:</p>
                    <p><a href="{verification_url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p>{verification_url}</p>
                    <p>This link will expire in 24 hours.</p>
                    <p>Best regards,<br>E-commerce Platform Team</p>
                </body>
            </html>
            """
            
            # For development, just log the email instead of sending
            logger.info(f"Email verification sent to {to_email}")
            logger.info(f"Verification URL: {verification_url}")
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to send verification email: {e}")
            return False

    async def send_password_reset_email(self, to_email: str, first_name: str, reset_token: str):
        """Send password reset email"""
        try:
            subject = "Reset Your Password"
            
            # Create reset URL
            reset_url = f"http://localhost:3000/reset-password?token={reset_token}"
            
            # HTML email content
            html_content = f"""
            <html>
                <body>
                    <h2>Password Reset Request</h2>
                    <p>Hi {first_name},</p>
                    <p>You requested to reset your password. Click the link below to set a new password:</p>
                    <p><a href="{reset_url}" style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p>{reset_url}</p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <p>Best regards,<br>E-commerce Platform Team</p>
                </body>
            </html>
            """
            
            # For development, just log the email instead of sending
            logger.info(f"Password reset email sent to {to_email}")
            logger.info(f"Reset URL: {reset_url}")
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to send password reset email: {e}")
            return False
