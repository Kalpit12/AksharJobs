"""
Reference Verification Service
Handles reference verification requests and approvals
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

def generate_reference_token():
    """Generate a secure reference verification token"""
    import hashlib
    import secrets
    
    # Create a secure token
    timestamp = str(int(datetime.now().timestamp()))
    token_data = f"reference_{timestamp}_{secrets.token_hex(16)}"
    token = hashlib.sha256(token_data.encode()).hexdigest()
    
    return token

def send_reference_verification_email(reference_email, reference_name, user_data, reference_data):
    """Send reference verification email"""
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
        msg['To'] = reference_email
        msg['Subject'] = f"🚀 AksharJobs - Reference Verification Request - {user_data['firstName']} {user_data['lastName']}"
        
        # Generate verification token
        approve_token = generate_reference_token()
        reject_token = generate_reference_token()
        
        # Store tokens in database
        store_reference_tokens(reference_data['_id'], approve_token, reject_token)
        
        # Email body with premium AksharJobs branding
        body = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AksharJobs Reference Verification</title>
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
                            <span style="color: #ffffff; font-weight: 600; font-size: 16px;">Reference Verification</span>
                        </div>
                    </div>
                </div>
                
                <!-- Content Section -->
                <div style="padding: 40px 30px;">
                    <!-- Greeting -->
                    <div style="text-align: center; margin-bottom: 35px;">
                        <h2 style="margin: 0; font-size: 28px; font-weight: 600; color: #1f2937; margin-bottom: 10px;">
                            👥 Reference Verification Request
                        </h2>
                        <p style="margin: 0; font-size: 16px; color: #6b7280; line-height: 1.6;">
                            Hello {reference_name}, someone has listed you as a professional reference on AksharJobs.
                        </p>
                    </div>
                    
                    <!-- User Information Card -->
                    <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px; padding: 30px; margin: 30px 0; border-left: 5px solid #667eea; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                        <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #1f2937; display: flex; align-items: center; gap: 10px;">
                            <span style="background: #667eea; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">👤</span>
                            Candidate Details
                        </h3>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                                <div style="font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Full Name</div>
                                <div style="font-size: 16px; font-weight: 600; color: #1f2937;">{user_data['firstName']} {user_data['lastName']}</div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                                <div style="font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Email Address</div>
                                <div style="font-size: 16px; font-weight: 600; color: #1f2937;">{user_data['email']}</div>
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                                <div style="font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Phone Number</div>
                                <div style="font-size: 16px; font-weight: 600; color: #1f2937;">{user_data.get('phoneNumber', user_data.get('phone', 'Not provided'))}</div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                                <div style="font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">User Type</div>
                                <div style="font-size: 16px; font-weight: 600; color: #1f2937;">{user_data['userType'].title().replace('_', ' ')}</div>
                            </div>
                        </div>
                        
                        <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                            <div style="font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">Reference Details</div>
                            <div style="font-size: 14px; color: #374151; line-height: 1.6;">
                                <strong>Your Name:</strong> {reference_data['name']}<br>
                                <strong>Your Position:</strong> {reference_data['position']}<br>
                                <strong>Your Organization:</strong> {reference_data['organization']}<br>
                                <strong>Relationship:</strong> {reference_data['relationship']}
                            </div>
                        </div>
                        
                        <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); margin-top: 20px;">
                            <div style="font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Request Date</div>
                            <div style="font-size: 16px; font-weight: 600; color: #1f2937;">{datetime.now().strftime('%B %d, %Y at %I:%M %p')}</div>
                        </div>
                    </div>
                    
                    <!-- Action Required Alert -->
                    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; padding: 25px; margin: 30px 0; border-left: 5px solid #f59e0b; position: relative;">
                        <div style="position: absolute; top: 20px; right: 20px; font-size: 24px;">⚠️</div>
                        <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600; color: #92400e;">
                            Action Required - Reference Verification
                        </h3>
                        <p style="margin: 0; font-size: 16px; color: #92400e; line-height: 1.6;">
                            Please verify if you know this person and can vouch for their professional capabilities. 
                            Your reference will help them build credibility on our platform.
                        </p>
                    </div>
                    
                    <!-- Verification Buttons -->
                    <div style="text-align: center; margin: 40px 0;">
                        <div style="display: inline-block; margin: 0 15px;">
                            <a href="{os.getenv('FRONTEND_URL', 'http://localhost:3003')}/verify-reference?action=approve&referenceId={reference_data['_id']}&token={approve_token}" 
                               style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                                      color: white; 
                                      padding: 18px 40px; 
                                      text-decoration: none; 
                                      border-radius: 12px; 
                                      display: inline-block;
                                      font-weight: 700;
                                      font-size: 16px;
                                      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
                                      transition: all 0.3s ease;
                                      border: none;
                                      cursor: pointer;">
                                ✅ Verify Reference
                            </a>
                        </div>
                        <div style="display: inline-block; margin: 0 15px;">
                            <a href="{os.getenv('FRONTEND_URL', 'http://localhost:3003')}/verify-reference?action=reject&referenceId={reference_data['_id']}&token={reject_token}" 
                               style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
                                      color: white; 
                                      padding: 18px 40px; 
                                      text-decoration: none; 
                                      border-radius: 12px; 
                                      display: inline-block;
                                      font-weight: 700;
                                      font-size: 16px;
                                      box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
                                      transition: all 0.3s ease;
                                      border: none;
                                      cursor: pointer;">
                                ❌ Decline Reference
                            </a>
                        </div>
                    </div>
                    
                    <!-- Verification Process Info -->
                    <div style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); border-radius: 16px; padding: 30px; margin: 30px 0;">
                        <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #0277bd; display: flex; align-items: center; gap: 10px;">
                            <span style="background: #0277bd; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">ℹ️</span>
                            Verification Process
                        </h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #0277bd;">✅ Verification Process</h4>
                                <ul style="margin: 0; padding-left: 20px; color: #0277bd;">
                                    <li>Confirm you know this person</li>
                                    <li>Verify their professional background</li>
                                    <li>Click "Verify Reference"</li>
                                    <li>Help build their credibility</li>
                                </ul>
                            </div>
                            <div>
                                <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #0277bd;">❌ Decline Process</h4>
                                <ul style="margin: 0; padding-left: 20px; color: #0277bd;">
                                    <li>Don't recognize this person</li>
                                    <li>Cannot verify their background</li>
                                    <li>Click "Decline Reference"</li>
                                    <li>Reference will be removed</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Security Notice -->
                    <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center; border: 2px solid #e5e7eb;">
                        <div style="font-size: 24px; margin-bottom: 10px;">🔒</div>
                        <h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 600; color: #374151;">Secure Verification</h3>
                        <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                            This verification link is secure and expires after 7 days. 
                            If you didn't expect this request, please ignore this email.
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
                            This is an automated message from AksharJobs Reference Verification System.
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
        server.sendmail(sender_email, reference_email, text)
        server.quit()
        
        print(f"✅ Reference verification email sent to {reference_email}")
        return True
        
    except Exception as e:
        print(f"❌ Error sending reference verification email: {e}")
        return False

def store_reference_tokens(reference_id, approve_token, reject_token):
    """Store reference verification tokens"""
    try:
        db = get_db()
        db.reference_tokens.insert_one({
            "reference_id": reference_id,
            "approve_token": approve_token,
            "reject_token": reject_token,
            "created_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(days=7),
            "used": False
        })
        return True
    except Exception as e:
        print(f"❌ Error storing reference tokens: {e}")
        return False

def verify_reference_token(reference_id, action, token):
    """Verify reference token"""
    try:
        db = get_db()
        token_field = f"{action}_token"
        
        token_record = db.reference_tokens.find_one({
            "reference_id": reference_id,
            token_field: token,
            "expires_at": {"$gt": datetime.utcnow()},
            "used": False
        })
        
        return token_record is not None
    except Exception as e:
        print(f"❌ Error verifying reference token: {e}")
        return False

def update_reference_status(reference_id, status, verified_by=None):
    """Update reference verification status"""
    try:
        db = get_db()
        update_data = {
            "verification_status": "verified" if status == "approve" else "rejected",
            "verified_at": datetime.utcnow() if status == "approve" else None,
            "verified_by": verified_by if status == "approve" else None
        }
        
        result = db.references.update_one(
            {"_id": ObjectId(reference_id)},
            {"$set": update_data}
        )
        
        # Mark token as used
        db.reference_tokens.update_many(
            {"reference_id": reference_id},
            {"$set": {"used": True}}
        )
        
        return result.modified_count > 0
        
    except Exception as e:
        print(f"❌ Error updating reference status: {e}")
        return False
