#!/usr/bin/env python3
"""
Email Service
Handles sending emails including welcome emails with credentials
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

class EmailService:
    
    def __init__(self):
        # Email configuration
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.sender_email = "kalpitpatel751@gmail.com"
        self.sender_password = "vsbk klxf erwf rwuo"  # Gmail App Password
        
    def send_welcome_email(self, to_email, user_name, temp_password, user_data=None):
        """
        Send welcome email with login credentials
        
        Args:
            to_email: Recipient email address
            user_name: User's full name
            temp_password: Temporary password generated during import
            user_data: Additional user information (optional)
        """
        try:
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = "Welcome to AksharJobs - Your Account is Ready! 🎉"
            message["From"] = f"AksharJobs Team <{self.sender_email}>"
            message["To"] = to_email
            
            # Create beautiful HTML email
            html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }}
        .header {{
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }}
        .header h1 {{
            margin: 0;
            font-size: 28px;
        }}
        .content {{
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e2e8f0;
        }}
        .credentials-box {{
            background: #f8fafc;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }}
        .credentials-box h3 {{
            margin-top: 0;
            color: #1e293b;
        }}
        .credential-item {{
            margin: 10px 0;
            font-size: 16px;
        }}
        .credential-item strong {{
            color: #1e293b;
            display: inline-block;
            width: 120px;
        }}
        .credential-value {{
            background: #ffffff;
            padding: 8px 12px;
            border-radius: 6px;
            border: 2px solid #e2e8f0;
            font-family: 'Courier New', monospace;
            color: #3b82f6;
            font-weight: bold;
        }}
        .button {{
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 14px 30px;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }}
        .features {{
            background: #f0fdf4;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }}
        .features h3 {{
            color: #059669;
            margin-top: 0;
        }}
        .features ul {{
            margin: 10px 0;
            padding-left: 20px;
        }}
        .features li {{
            margin: 8px 0;
            color: #1e293b;
        }}
        .footer {{
            background: #f8fafc;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 10px 10px;
            color: #64748b;
            font-size: 14px;
        }}
        .important-note {{
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 6px;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Welcome to AksharJobs!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Your AI-Powered Career Platform</p>
    </div>
    
    <div class="content">
        <p>Dear <strong>{user_name}</strong>,</p>
        
        <p>Great news! Your account has been successfully created on <strong>AksharJobs</strong> - Kenya's premier AI-powered job matching platform.</p>
        
        <div class="credentials-box">
            <h3>🔐 Your Login Credentials</h3>
            <div class="credential-item">
                <strong>Email:</strong><br>
                <span class="credential-value">{to_email}</span>
            </div>
            <div class="credential-item">
                <strong>Password:</strong><br>
                <span class="credential-value">{temp_password}</span>
            </div>
        </div>
        
        <div class="important-note">
            <strong>⚠️ Important:</strong> Please change your password after your first login for security.
        </div>
        
        <div style="text-align: center;">
            <a href="http://localhost:3003/login" class="button">
                Login to Your Account →
            </a>
        </div>
        
        <div class="features">
            <h3>✨ What You Can Do on AksharJobs:</h3>
            <ul>
                <li>🤖 <strong>AI-Powered Matching</strong> - Get job recommendations tailored to your skills</li>
                <li>📄 <strong>Smart Resume Builder</strong> - Create professional resumes with AI assistance</li>
                <li>💼 <strong>Easy Job Applications</strong> - Apply to multiple jobs with one click</li>
                <li>📊 <strong>Application Tracking</strong> - Monitor all your applications in one place</li>
                <li>🪙 <strong>Earn Akshar Coins</strong> - Get rewarded for platform activity</li>
                <li>🎯 <strong>Career Insights</strong> - Receive personalized career recommendations</li>
            </ul>
        </div>
        
        <h3>🚀 Getting Started:</h3>
        <ol>
            <li>Click the login button above or visit <a href="http://localhost:3003/login">http://localhost:3003/login</a></li>
            <li>Enter your email and temporary password</li>
            <li>Change your password to something secure</li>
            <li>Complete your profile to get better job matches</li>
            <li>Start applying to your dream jobs!</li>
        </ol>
        
        <p style="margin-top: 30px;">If you have any questions or need assistance, feel free to reply to this email. Our support team is here to help!</p>
        
        <p>Best regards,<br>
        <strong>The AksharJobs Team</strong><br>
        <em>Connecting Talent with Opportunity</em></p>
    </div>
    
    <div class="footer">
        <p>© 2025 AksharJobs. All rights reserved.</p>
        <p>This email was sent to {to_email} because an account was created for you.</p>
        <p style="margin-top: 10px; font-size: 12px;">
            <a href="#" style="color: #3b82f6; text-decoration: none;">Privacy Policy</a> | 
            <a href="#" style="color: #3b82f6; text-decoration: none;">Terms of Service</a> | 
            <a href="#" style="color: #3b82f6; text-decoration: none;">Support</a>
        </p>
    </div>
</body>
</html>
            """
            
            # Create plain text version
            text_content = f"""
Welcome to AksharJobs!

Dear {user_name},

Your account has been successfully created on AksharJobs - Kenya's premier AI-powered job matching platform.

YOUR LOGIN CREDENTIALS:
Email: {to_email}
Password: {temp_password}

IMPORTANT: Please change your password after your first login for security.

Login here: http://localhost:3003/login

What You Can Do on AksharJobs:
- AI-Powered job matching tailored to your skills
- Smart resume builder with AI assistance
- Easy job applications
- Application tracking
- Earn Akshar Coins for platform activity
- Receive personalized career recommendations

Getting Started:
1. Visit http://localhost:3003/login
2. Enter your email and temporary password
3. Change your password
4. Complete your profile
5. Start applying to jobs!

If you have any questions, reply to this email.

Best regards,
The AksharJobs Team
Connecting Talent with Opportunity

© 2025 AksharJobs. All rights reserved.
            """
            
            # Attach both versions
            part1 = MIMEText(text_content, "plain")
            part2 = MIMEText(html_content, "html")
            message.attach(part1)
            message.attach(part2)
            
            # Send email via Gmail SMTP
            print(f"\n{'='*80}")
            print(f"📧 SENDING EMAIL:")
            print(f"From: {self.sender_email}")
            print(f"To: {to_email}")
            print(f"Subject: {message['Subject']}")
            print(f"Password: {temp_password}")
            print(f"{'='*80}\n")
            
            # Send the email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password.replace(" ", ""))  # Remove spaces from app password
                server.send_message(message)
            
            print(f"✅ Email sent successfully to {to_email}!")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send email to {to_email}: {str(e)}")
            return False
    
    def send_bulk_welcome_emails(self, users_list):
        """
        Send welcome emails to multiple users
        
        Args:
            users_list: List of dictionaries with user info (email, name, password)
            
        Returns:
            Number of emails sent successfully
        """
        sent_count = 0
        
        for user in users_list:
            success = self.send_welcome_email(
                user.get('email'),
                user.get('name'),
                user.get('temp_password'),
                user
            )
            if success:
                sent_count += 1
        
        return sent_count

    def send_password_reset_email(self, to_email, reset_link, user_name=""):
        """
        Send password reset email with reset link
        
        Args:
            to_email: Recipient email address
            reset_link: Password reset link
            user_name: User's first name (optional)
        """
        try:
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = "Reset Your AksharJobs Password 🔐"
            message["From"] = f"AksharJobs Security <{self.sender_email}>"
            message["To"] = to_email
            
            # Create beautiful HTML email
            html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }}
        .container {{
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
        }}
        .header {{
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f1f5f9;
        }}
        .logo {{
            font-size: 28px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }}
        .title {{
            font-size: 24px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 10px;
        }}
        .subtitle {{
            color: #64748b;
            font-size: 16px;
        }}
        .content {{
            margin: 30px 0;
        }}
        .greeting {{
            font-size: 18px;
            color: #374151;
            margin-bottom: 20px;
        }}
        .message {{
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 30px;
            line-height: 1.7;
        }}
        .reset-button {{
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
        }}
        .reset-button:hover {{
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }}
        .security-info {{
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
        }}
        .security-title {{
            font-weight: 600;
            color: #0369a1;
            margin-bottom: 10px;
            font-size: 16px;
        }}
        .security-list {{
            margin: 0;
            padding-left: 20px;
            color: #0c4a6e;
        }}
        .security-list li {{
            margin-bottom: 8px;
            font-size: 14px;
        }}
        .expiry-warning {{
            background: #fef3c7;
            border: 1px solid #fcd34d;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            color: #92400e;
            font-size: 14px;
        }}
        .footer {{
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }}
        .contact-info {{
            margin-top: 15px;
            font-size: 13px;
        }}
        .link {{
            color: #667eea;
            text-decoration: none;
        }}
        .link:hover {{
            text-decoration: underline;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🚀 AksharJobs</div>
            <div class="title">Password Reset Request</div>
            <div class="subtitle">Secure your account with a new password</div>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello{f' {user_name}' if user_name else ''}! 👋
            </div>
            
            <div class="message">
                We received a request to reset your password for your AksharJobs account. 
                If you made this request, click the button below to set a new password.
            </div>
            
            <div style="text-align: center;">
                <a href="{reset_link}" class="reset-button">
                    🔐 Reset My Password
                </a>
            </div>
            
            <div class="expiry-warning">
                ⏰ <strong>Important:</strong> This link will expire in 1 hour for security reasons.
            </div>
            
            <div class="security-info">
                <div class="security-title">🛡️ Security Tips:</div>
                <ul class="security-list">
                    <li>Use a strong, unique password</li>
                    <li>Include uppercase, lowercase, numbers, and symbols</li>
                    <li>Don't share your password with anyone</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                </ul>
            </div>
            
            <div class="message">
                <strong>Can't click the button?</strong><br>
                Copy and paste this link into your browser:<br>
                <a href="{reset_link}" class="link">{reset_link}</a>
            </div>
        </div>
        
        <div class="footer">
            <p>This email was sent by AksharJobs Security Team</p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
            
            <div class="contact-info">
                <p>Need help? Contact us at <a href="mailto:support@aksharjobs.com" class="link">support@aksharjobs.com</a></p>
                <p>© {datetime.now().year} AksharJobs. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
            """
            
            # Create plain text version
            text_content = f"""
AksharJobs - Password Reset Request

Hello{f' {user_name}' if user_name else ''}!

We received a request to reset your password for your AksharJobs account.

To reset your password, click the link below:
{reset_link}

IMPORTANT: This link will expire in 1 hour for security reasons.

If you didn't request this password reset, you can safely ignore this email.

Security Tips:
- Use a strong, unique password
- Include uppercase, lowercase, numbers, and symbols  
- Don't share your password with anyone

Need help? Contact us at support@aksharjobs.com

© {datetime.now().year} AksharJobs. All rights reserved.
            """
            
            # Attach parts
            text_part = MIMEText(text_content, "plain")
            html_part = MIMEText(html_content, "html")
            
            message.attach(text_part)
            message.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(message)
            
            print(f"✅ Password reset email sent successfully to {to_email}!")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send password reset email to {to_email}: {str(e)}")
            return False