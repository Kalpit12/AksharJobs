"""
Email Verification Service
Handles sending verification codes to users and verifying them
"""

import smtplib
import random
import string
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from utils.db import get_db
from bson import ObjectId

def load_env_variables():
    """Load environment variables from .edn.local file"""
    env_vars = {}
    try:
        with open('.edn.local', 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key] = value
        return env_vars
    except FileNotFoundError:
        return {}

def generate_verification_code():
    """Generate a 6-digit verification code"""
    return ''.join(random.choices(string.digits, k=6))

def send_verification_email(user_email, user_name, verification_code):
    """Send verification code email to user"""
    try:
        # Load Gmail credentials from .edn.local file
        env_vars = load_env_variables()
        sender_email = env_vars.get('GMAIL_EMAIL', "hemant.patel@maxproinfotech.com")
        sender_password = env_vars.get('GMAIL_APP_PASSWORD', "your-app-password")
        
        # Email configuration
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = user_email
        msg['Subject'] = f"🚀 AksharJobs - Verify Your Account - Code: {verification_code}"
        
        # Email body with premium AksharJobs branding
        body = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AksharJobs Email Verification</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <!-- Main Container -->
            <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);">
                
                <!-- Premium Header with Gradient -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
                    <!-- Decorative Elements -->
                    <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                    <div style="position: absolute; bottom: -30px; left: -30px; width: 100px; height: 100px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                    
                    <!-- Logo and Title -->
                    <div style="position: relative; z-index: 2;">
                        <h1 style="margin: 0; font-size: 36px; font-weight: 700; color: #ffffff; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); letter-spacing: -1px;">
                            🚀 AksharJobs
                        </h1>
                        <p style="margin: 10px 0 0 0; font-size: 18px; color: rgba(255, 255, 255, 0.9); font-weight: 300;">
                            Kenya's Premier Job Platform
                        </p>
                        <div style="margin-top: 20px; padding: 12px 24px; background: rgba(255, 255, 255, 0.2); border-radius: 25px; display: inline-block; backdrop-filter: blur(10px);">
                            <span style="color: #ffffff; font-weight: 600; font-size: 16px;">Email Verification</span>
                        </div>
                    </div>
                </div>
                
                <!-- Content Section -->
                <div style="padding: 40px 30px;">
                    <!-- Greeting -->
                    <div style="text-align: center; margin-bottom: 35px;">
                        <h2 style="margin: 0; font-size: 28px; font-weight: 600; color: #1f2937; margin-bottom: 10px;">
                            🔐 Verify Your Email Address
                        </h2>
                        <p style="margin: 0; font-size: 16px; color: #6b7280; line-height: 1.6;">
                            Hello {user_name}, welcome to AksharJobs! Please verify your email to complete your registration.
                        </p>
                    </div>
                    
                    <!-- Verification Code Card -->
                    <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px; padding: 40px; margin: 30px 0; border-left: 5px solid #667eea; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); text-align: center;">
                        <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #1f2937; display: flex; align-items: center; justify-content: center; gap: 10px;">
                            <span style="background: #667eea; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">🔑</span>
                            Your Verification Code
                        </h3>
                        
                        <div style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0; border: 2px solid #667eea;">
                            <div style="font-size: 14px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px;">Enter this code in the verification page</div>
                            <div style="font-size: 48px; font-weight: 700; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace; text-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);">{verification_code}</div>
                            <div style="font-size: 12px; color: #6b7280; margin-top: 10px;">This code expires in 15 minutes</div>
                        </div>
                        
                        <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                            <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #92400e;">⚠️ Important:</h4>
                            <ul style="margin: 0; padding-left: 20px; color: #92400e; text-align: left;">
                                <li>This code is valid for 15 minutes only</li>
                                <li>Do not share this code with anyone</li>
                                <li>AksharJobs will never ask for this code via phone or email</li>
                                <li>If you didn't create an account, please ignore this email</li>
                            </ul>
                        </div>
                    </div>
                    
                    <!-- Instructions -->
                    <div style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); border-radius: 16px; padding: 30px; margin: 30px 0;">
                        <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #0277bd; display: flex; align-items: center; gap: 10px;">
                            <span style="background: #0277bd; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">ℹ️</span>
                            How to Verify Your Account
                        </h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #0277bd;">1️⃣ Copy the Code</h4>
                                <p style="margin: 0; color: #0277bd; font-size: 14px;">Copy the 6-digit verification code above</p>
                            </div>
                            <div>
                                <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #0277bd;">2️⃣ Enter Code</h4>
                                <p style="margin: 0; color: #0277bd; font-size: 14px;">Go back to the verification page and enter the code</p>
                            </div>
                            <div>
                                <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #0277bd;">3️⃣ Get Verified</h4>
                                <p style="margin: 0; color: #0277bd; font-size: 14px;">Click verify to complete your registration</p>
                            </div>
                            <div>
                                <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #0277bd;">4️⃣ Access Platform</h4>
                                <p style="margin: 0; color: #0277bd; font-size: 14px;">Start exploring job opportunities!</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Security Notice -->
                    <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center; border: 2px solid #e5e7eb;">
                        <div style="font-size: 24px; margin-bottom: 10px;">🔒</div>
                        <h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 600; color: #374151;">Secure Verification</h3>
                        <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                            This verification code is secure and expires after 15 minutes. 
                            Keep your account safe by not sharing this code with anyone.
                        </p>
                    </div>
                </div>
                
                <!-- Premium Footer -->
                <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 40px 30px; text-align: center; color: white;">
                    <div style="margin-bottom: 25px;">
                        <h3 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">
                            🚀 AksharJobs
                        </h3>
                        <p style="margin: 10px 0 0 0; font-size: 16px; color: rgba(255, 255, 255, 0.8);">
                            Connecting Kenya's Top Talent with Premium Opportunities
                        </p>
                    </div>
                    
                    <div style="border-top: 1px solid rgba(255, 255, 255, 0.2); padding-top: 25px; margin-top: 25px;">
                        <p style="margin: 0 0 15px 0; font-size: 14px; color: rgba(255, 255, 255, 0.7);">
                            This is an automated message from AksharJobs Email Verification System.
                        </p>
                        <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap;">
                            <a href="#" style="color: #60a5fa; text-decoration: none; font-size: 14px; font-weight: 500;">Privacy Policy</a>
                            <a href="#" style="color: #60a5fa; text-decoration: none; font-size: 14px; font-weight: 500;">Terms of Service</a>
                            <a href="#" style="color: #60a5fa; text-decoration: none; font-size: 14px; font-weight: 500;">Contact Support</a>
                            <a href="#" style="color: #60a5fa; text-decoration: none; font-size: 14px; font-weight: 500;">Help Center</a>
                        </div>
                        <p style="margin: 20px 0 0 0; font-size: 12px; color: rgba(255, 255, 255, 0.5);">
                            © 2025 AksharJobs. All rights reserved. | Nairobi, Kenya
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        # Send email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        text = msg.as_string()
        server.sendmail(sender_email, user_email, text)
        server.quit()
        
        print(f"✅ Verification email sent to {user_email}")
        return True
        
    except Exception as e:
        print(f"❌ Error sending verification email: {e}")
        return False

def store_verification_code(user_id, email, verification_code):
    """Store verification code in database"""
    try:
        db = get_db()
        verification_collection = db["email_verifications"]
        
        # Store verification code with expiration
        verification_data = {
            "user_id": user_id,
            "email": email,
            "code": verification_code,
            "created_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(minutes=15),
            "verified": False,
            "verified_at": None
        }
        
        result = verification_collection.insert_one(verification_data)
        return str(result.inserted_id)
        
    except Exception as e:
        print(f"❌ Error storing verification code: {e}")
        return None

def verify_email_code(email, code):
    """Verify email verification code"""
    try:
        db = get_db()
        verification_collection = db["email_verifications"]
        
        # Find verification record
        verification = verification_collection.find_one({
            "email": email,
            "code": code,
            "expires_at": {"$gt": datetime.utcnow()},
            "verified": False
        })
        
        if verification:
            # Mark as verified
            verification_collection.update_one(
                {"_id": verification["_id"]},
                {
                    "$set": {
                        "verified": True,
                        "verified_at": datetime.utcnow()
                    }
                }
            )
            
            # Update user email verification status
            users_collection = db["users"]
            users_collection.update_one(
                {"_id": ObjectId(verification["user_id"])},
                {
                    "$set": {
                        "email_verified": True,
                        "email_verified_at": datetime.utcnow()
                    }
                }
            )
            
            return {
                "success": True,
                "user_id": verification["user_id"],
                "message": "Email verified successfully"
            }
        else:
            return {
                "success": False,
                "message": "Invalid or expired verification code"
            }
            
    except Exception as e:
        print(f"❌ Error verifying email code: {e}")
        return {
            "success": False,
            "message": "Error verifying email code"
        }
