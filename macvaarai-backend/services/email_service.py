import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv
import asyncio
from datetime import datetime

load_dotenv()

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", 587))
        self.sender_email = os.getenv("GMAIL_ADDRESS")
        self.sender_password = os.getenv("GMAIL_PASSWORD")
        self.sender_name = os.getenv("EMAIL_FROM_NAME", "Vijay Care AI")

    def send_email(self, recipient_email: str, subject: str, html_body: str, text_body: str = None):
        """
        Send email via Gmail SMTP
        """
        if not self.sender_email or not self.sender_password:
            print("[WARNING] Gmail credentials not configured in .env")
            return False

        try:
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{self.sender_name} <{self.sender_email}>"
            message["To"] = recipient_email

            # Attach plain text and HTML versions
            if text_body:
                message.attach(MIMEText(text_body, "plain"))
            message.attach(MIMEText(html_body, "html"))

            # Send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.sender_email, self.sender_password)
            server.sendmail(self.sender_email, recipient_email, message.as_string())
            server.quit()

            print(f"[OK] Email sent to {recipient_email}")
            return True

        except Exception as e:
            print(f"[ERROR] Failed to send email to {recipient_email}: {str(e)}")
            return False

    def send_welcome_email(self, user_name: str, user_email: str, organization_name: str = "Vijay Care"):
        """Send welcome email to new user"""
        subject = "Welcome to Vijay Care AI!"

        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                <div style="background-color: white; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px;">
                    <h2 style="color: #1f6feb; margin-bottom: 20px;">Welcome to Vijay Care AI! 🎉</h2>

                    <p>Hello <strong>{user_name}</strong>,</p>

                    <p>Thank you for joining <strong>{organization_name}</strong>. We're excited to have you on board!</p>

                    <p>You now have access to our AI diagnostic platform with cutting-edge medical AI models:</p>
                    <ul>
                        <li>Eye Disease Detection AI</li>
                        <li>COVID-19 Detection AI</li>
                        <li>Pneumonia Detection AI</li>
                        <li>And many more...</li>
                    </ul>

                    <p><strong>Next Steps:</strong></p>
                    <ol>
                        <li>Log in to your dashboard at <a href="{os.getenv('FRONTEND_URL')}" style="color: #1f6feb;">Vijay Care Portal</a></li>
                        <li>Explore available AI models</li>
                        <li>Contact support if you have any questions</li>
                    </ol>

                    <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
                        This is an automated message. Please do not reply to this email.
                        <br>
                        <strong>Vijay Care AI</strong> | Medical AI Diagnostic Platform
                    </p>
                </div>
            </body>
        </html>
        """

        text_body = f"""
        Welcome to Vijay Care AI!

        Hello {user_name},

        Thank you for joining {organization_name}. You now have access to our AI diagnostic platform.

        Next Steps:
        1. Log in to your dashboard
        2. Explore available AI models
        3. Contact support if you have questions

        Visit: {os.getenv('FRONTEND_URL')}
        """

        if os.getenv("SEND_WELCOME_EMAIL") == "true":
            return self.send_email(user_email, subject, html_body, text_body)
        return False

    def send_password_reset_email(self, user_email: str, user_name: str, reset_link: str):
        """Send password reset email"""
        subject = "Reset Your Vijay Care Password"

        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                <div style="background-color: white; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px;">
                    <h2 style="color: #d1453b; margin-bottom: 20px;">Password Reset Request</h2>

                    <p>Hello {user_name},</p>

                    <p>We received a request to reset your password. Click the button below to set a new password:</p>

                    <p style="text-align: center; margin: 30px 0;">
                        <a href="{reset_link}" style="background-color: #1f6feb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </p>

                    <p style="color: #666; font-size: 12px;">
                        This link expires in 24 hours. If you didn't request a password reset, please ignore this email.
                    </p>

                    <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
                        This is an automated message. Please do not reply to this email.
                        <br>
                        <strong>Vijay Care AI</strong>
                    </p>
                </div>
            </body>
        </html>
        """

        if os.getenv("SEND_PASSWORD_RESET_EMAIL") == "true":
            return self.send_email(user_email, subject, html_body)
        return False

    def send_ticket_update_email(self, user_email: str, ticket_id: int, status: str, update_message: str = ""):
        """Send support ticket update email"""
        subject = f"Support Ticket #{ticket_id} Update - Status: {status.upper()}"

        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                <div style="background-color: white; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px;">
                    <h2 style="color: #1f6feb; margin-bottom: 20px;">Support Ticket Update</h2>

                    <p>Your support ticket <strong>#{ticket_id}</strong> has been updated.</p>

                    <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #1f6feb; margin: 20px 0;">
                        <p><strong>New Status:</strong> <span style="color: #28a745; font-weight: bold;">{status.upper()}</span></p>
                        {f'<p><strong>Update:</strong> {update_message}</p>' if update_message else ''}
                    </div>

                    <p>
                        <a href="{os.getenv('FRONTEND_URL')}/support/tickets/{ticket_id}" style="color: #1f6feb;">
                            View Your Ticket →
                        </a>
                    </p>

                    <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
                        This is an automated message. Please do not reply to this email.
                        <br>
                        <strong>Vijay Care Support</strong>
                    </p>
                </div>
            </body>
        </html>
        """

        if os.getenv("SEND_TICKET_UPDATE_EMAIL") == "true":
            return self.send_email(user_email, subject, html_body)
        return False

    def send_organization_created_email(self, org_email: str, org_name: str, login_url: str = None):
        """Send email when organization is created"""
        subject = f"Your Vijay Care Account Created - {org_name}"

        login_url = login_url or os.getenv("FRONTEND_URL")

        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                <div style="background-color: white; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px;">
                    <h2 style="color: #1f6feb; margin-bottom: 20px;">Welcome {org_name}! 🎉</h2>

                    <p>Your organization account has been successfully created on Vijay Care AI.</p>

                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Organization Name:</strong> {org_name}</p>
                        <p><strong>Email:</strong> {org_email}</p>
                        <p><strong>Login URL:</strong> <a href="{login_url}" style="color: #1f6feb;">{login_url}</a></p>
                    </div>

                    <p><strong>Getting Started:</strong></p>
                    <ol>
                        <li>Log in with your credentials</li>
                        <li>Explore available AI models</li>
                        <li>Allocate models to your team</li>
                        <li>Start using AI diagnostic tools</li>
                    </ol>

                    <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
                        For support, contact: support@vijaycare.com
                        <br>
                        <strong>Vijay Care AI</strong>
                    </p>
                </div>
            </body>
        </html>
        """

        if os.getenv("SEND_ORGANIZATION_CREATED_EMAIL") == "true":
            return self.send_email(org_email, subject, html_body)
        return False


# Global instance
email_service = EmailService()
