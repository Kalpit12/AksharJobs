"""
Community Verification Email Service
Handles sending verification emails to community leaders
"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from datetime import datetime
from utils.db import get_db
from bson import ObjectId

# Community leader emails mapping
COMMUNITY_LEADER_EMAILS = {
    "All Communities": "hemant.patel@maxproinfotech.com",
    "Kenya Marketing (KM)": "hemant.patel@maxproinfotech.com",
    "UAB (United African Business)": "hemant.patel@maxproinfotech.com",
    "Hindu Council Members": "hemant.patel@maxproinfotech.com",
    "Kenyan Sikh Community": "hemant.patel@maxproinfotech.com",
    "Kenya IT Professionals": "hemant.patel@maxproinfotech.com",
    "Kenya Healthcare Workers": "hemant.patel@maxproinfotech.com",
    "Kenya Education Network": "hemant.patel@maxproinfotech.com",
    "Kenya Banking & Finance": "hemant.patel@maxproinfotech.com",
    "Kenya Real Estate": "hemant.patel@maxproinfotech.com",
    "Kenya Hospitality & Tourism": "hemant.patel@maxproinfotech.com",
    "Kenya Agriculture & Farming": "hemant.patel@maxproinfotech.com"
}

def get_community_name(community_id):
    """Get community name by ID"""
    try:
        db = get_db()
        community = db.communities.find_one({"_id": ObjectId(community_id)})
        return community["name"] if community else "Unknown Community"
    except Exception as e:
        print(f"Error getting community name: {e}")
        return "Unknown Community"

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

def send_community_verification_email(user_data, community_ids):
    """Send verification email to community leaders"""
    try:
        # Load Gmail credentials from .edn.local file
        env_vars = load_env_variables()
        sender_email = env_vars.get('GMAIL_EMAIL', "hemant.patel@maxproinfotech.com")
        sender_password = env_vars.get('GMAIL_APP_PASSWORD', "your-app-password")
        
        # Email configuration
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        
        # Get community names
        community_names = []
        for community_id in community_ids:
            community_name = get_community_name(community_id)
            community_names.append(community_name)
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['Subject'] = f"🚀 AksharJobs - Community Verification Request - {user_data['firstName']} {user_data['lastName']}"
        
        # Email body with premium AksharJobs branding
        body = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AksharJobs Community Verification</title>
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
                            <span style="color: #ffffff; font-weight: 600; font-size: 16px;">Community Verification System</span>
                        </div>
                    </div>
                </div>
                
                <!-- Content Section -->
                <div style="padding: 40px 30px;">
                    <!-- Greeting -->
                    <div style="text-align: center; margin-bottom: 35px;">
                        <h2 style="margin: 0; font-size: 28px; font-weight: 600; color: #1f2937; margin-bottom: 10px;">
                            🔐 New Verification Request
                        </h2>
                        <p style="margin: 0; font-size: 16px; color: #6b7280; line-height: 1.6;">
                            A professional has requested access to your exclusive community
                        </p>
                    </div>
                    
                    <!-- User Information Card -->
                    <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px; padding: 30px; margin: 30px 0; border-left: 5px solid #667eea; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                        <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #1f2937; display: flex; align-items: center; gap: 10px;">
                            <span style="background: #667eea; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">👤</span>
                            Professional Details
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
                            <div style="font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">Requested Communities</div>
                            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                                {''.join([f'<span style="background: #667eea; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500;">{name}</span>' for name in community_names])}
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
                            Action Required - Community Leader Approval
                        </h3>
                        <p style="margin: 0; font-size: 16px; color: #92400e; line-height: 1.6;">
                            Please review this professional's credentials and verify their membership to the requested communities. 
                            Your approval ensures the integrity of our exclusive community network.
                        </p>
                    </div>
                    
                    <!-- Verification Buttons -->
                    <div style="text-align: center; margin: 40px 0;">
                        <div style="display: inline-block; margin: 0 15px;">
                            <a href="{os.getenv('FRONTEND_URL', 'http://localhost:3003')}/verify-user?action=approve&userId={user_data['_id']}&token={generate_verification_token(user_data['_id'], 'approve')}" 
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
                                ✅ Approve Professional
                            </a>
                        </div>
                        <div style="display: inline-block; margin: 0 15px;">
                            <a href="{os.getenv('FRONTEND_URL', 'http://localhost:3003')}/verify-user?action=reject&userId={user_data['_id']}&token={generate_verification_token(user_data['_id'], 'reject')}" 
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
                                ❌ Reject Request
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
                                <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #0277bd;">✅ Approval Process</h4>
                                <ul style="margin: 0; padding-left: 20px; color: #0277bd;">
                                    <li>Verify professional credentials</li>
                                    <li>Confirm community membership</li>
                                    <li>Click "Approve Professional"</li>
                                    <li>User gains exclusive access</li>
                                </ul>
                            </div>
                            <div>
                                <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #0277bd;">❌ Rejection Process</h4>
                                <ul style="margin: 0; padding-left: 20px; color: #0277bd;">
                                    <li>Unable to verify membership</li>
                                    <li>Click "Reject Request"</li>
                                    <li>User notified via email</li>
                                    <li>Can reapply later</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Security Notice -->
                    <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center; border: 2px solid #e5e7eb;">
                        <div style="font-size: 24px; margin-bottom: 10px;">🔒</div>
                        <h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 600; color: #374151;">Secure Verification</h3>
                        <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                            This verification link is secure and expires after 24 hours. 
                            If you didn't request this verification, please ignore this email.
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
                            This is an automated message from AksharJobs Community Verification System.
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
        
        # Send to all relevant community leaders
        sent_to = []
        for community_name in community_names:
            leader_email = COMMUNITY_LEADER_EMAILS.get(community_name, "hemant.patel@maxproinfotech.com")
            if leader_email not in sent_to:
                msg['To'] = leader_email
                
                # Send email
                server = smtplib.SMTP(smtp_server, smtp_port)
                server.starttls()
                server.login(sender_email, sender_password)
                text = msg.as_string()
                server.sendmail(sender_email, leader_email, text)
                server.quit()
                
                sent_to.append(leader_email)
                print(f"✅ Community verification email sent to {leader_email} for {community_name}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error sending community verification email: {e}")
        return False

def generate_verification_token(user_id, action):
    """Generate a simple verification token"""
    import hashlib
    import secrets
    
    # Create a simple token using user_id, action, and timestamp
    timestamp = str(int(datetime.now().timestamp()))
    token_data = f"{user_id}_{action}_{timestamp}_{secrets.token_hex(8)}"
    token = hashlib.sha256(token_data.encode()).hexdigest()
    
    # Store token in database for validation
    try:
        db = get_db()
        db.verification_tokens.insert_one({
            "token": token,
            "user_id": user_id,
            "action": action,
            "created_at": datetime.utcnow(),
            "expires_at": datetime.utcnow().replace(hour=23, minute=59, second=59)  # Expires at end of day
        })
        return token
    except Exception as e:
        print(f"Error storing verification token: {e}")
        return token

def verify_token(token):
    """Verify and get token data"""
    try:
        db = get_db()
        token_data = db.verification_tokens.find_one({
            "token": token,
            "expires_at": {"$gt": datetime.utcnow()}
        })
        return token_data
    except Exception as e:
        print(f"Error verifying token: {e}")
        return None

def update_user_verification_status(user_id, status, verified_by=None):
    """Update user's community verification status"""
    try:
        db = get_db()
        update_data = {
            "community_verification_status": "verified" if status == "approve" else "rejected",
            "community_verification_verified_at": datetime.utcnow() if status == "approve" else None,
            "community_verification_verified_by": verified_by if status == "approve" else None
        }
        
        result = db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        return result.modified_count > 0
        
    except Exception as e:
        print(f"Error updating verification status: {e}")
        return False
