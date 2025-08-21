from flask import Blueprint, request, jsonify
import random
import string
import time
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from mock_email_service import get_mock_email_service

email_verification_bp = Blueprint('email_verification', __name__)

# In-memory storage for verification codes (in production, use Redis or database)
email_verification_codes = {}

# Email Configuration
SMTP_SERVER = "smtp.gmail.com"  # You can change this to your email provider
SMTP_PORT = 587
EMAIL_USERNAME = os.getenv('EMAIL_USERNAME', 'your-email@gmail.com')  # Set this in environment
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD', 'your-app-password')     # Set this in environment
FROM_EMAIL = os.getenv('FROM_EMAIL', 'noreply@rocketmatch.ai')

def generate_email_verification_code():
    """Generate a 6-digit verification code"""
    return ''.join(random.choices(string.digits, k=6))

def send_verification_email(email, verification_code):
    """Send verification email using SMTP"""
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = FROM_EMAIL
        msg['To'] = email
        msg['Subject'] = "Verify Your RocketMatch Account"
        
        # Email body
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your RocketMatch Account</title>
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f4f4f4;
                }}
                .container {{
                    background-color: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }}
                .header {{
                    text-align: center;
                    margin-bottom: 30px;
                }}
                .logo {{
                    font-size: 28px;
                    font-weight: bold;
                    color: #2a5a5a;
                    margin-bottom: 10px;
                }}
                .verification-code {{
                    background: linear-gradient(135deg, #2a5a5a 0%, #90ee90 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 3px;
                    margin: 20px 0;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }}
                .instructions {{
                    background-color: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    border-left: 4px solid #2a5a5a;
                    margin: 20px 0;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    color: #666;
                    font-size: 14px;
                }}
                .warning {{
                    background-color: #fff3cd;
                    border: 1px solid #ffeaa7;
                    color: #856404;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🚀 RocketJobs</div>
                    <p>Verify Your Email Address</p>
                </div>
                
                <p>Hello!</p>
                <p>Thank you for signing up with RocketMatch! To complete your registration, please verify your email address using the verification code below:</p>
                
                <div class="verification-code">
                    {verification_code}
                </div>
                
                <div class="instructions">
                    <strong>How to verify:</strong>
                    <ol>
                        <li>Copy the verification code above</li>
                        <li>Return to the RocketMatch website</li>
                        <li>Enter the code in the verification field</li>
                        <li>Click "Verify Email" to complete your registration</li>
                    </ol>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Security Notice:</strong> This verification code is valid for 10 minutes only. Never share this code with anyone.
                </div>
                
                <p>If you didn't create a RocketMatch account, you can safely ignore this email.</p>
                
                <div class="footer">
                    <p>Best regards,<br>The RocketMatch Team</p>
                    <p>Need help? Contact us at <a href="mailto:support@rocketmatch.ai">support@rocketmatch.ai</a></p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_body = f"""
        Verify Your RocketMatch Account
        
        Hello!
        
        Thank you for signing up with RocketMatch! To complete your registration, please verify your email address using the verification code below:
        
        Verification Code: {verification_code}
        
        How to verify:
        1. Copy the verification code above
        2. Return to the RocketMatch website
        3. Enter the code in the verification field
        4. Click "Verify Email" to complete your registration
        
        ⚠️ Security Notice: This verification code is valid for 10 minutes only. Never share this code with anyone.
        
        If you didn't create a RocketMatch account, you can safely ignore this email.
        
        Best regards,
        The RocketMatch Team
        
        Need help? Contact us at support@rocketmatch.ai
        """
        
        msg.attach(MIMEText(html_body, 'html'))
        msg.attach(MIMEText(text_body, 'plain'))
        
        # Try to send via SMTP
        try:
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
            server.send_message(msg)
            server.quit()
            print(f"✅ Email sent successfully to {email}")
            return True, {"status": "success", "message": "Verification email sent"}
            
        except Exception as smtp_error:
            print(f"❌ SMTP error: {str(smtp_error)}")
            # Fallback to mock email service
            print("🔄 Trying mock email service as fallback...")
            mock_service = get_mock_email_service()
            success, result = mock_service.send_email(email, verification_code)
            
            if success:
                print("✅ Mock email service succeeded")
                return True, result
            else:
                print("❌ Mock email service also failed")
                return False, {"status": "error", "message": "All email services failed"}
                
    except Exception as e:
        print(f"General email error: {str(e)}")
        # Try mock email service as last resort
        try:
            print("🔄 Trying mock email service as fallback...")
            mock_service = get_mock_email_service()
            success, result = mock_service.send_email(email, verification_code)
            
            if success:
                print("✅ Mock email service succeeded")
                return True, result
        except Exception as mock_error:
            print(f"Mock email service also failed: {str(mock_error)}")
        
        return False, {"status": "error", "message": str(e)}

@email_verification_bp.route('/send-email-verification', methods=['POST'])
def send_email_verification():
    """Send verification email to email address"""
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({"error": "Email address is required"}), 400
        
        # Basic email validation
        if '@' not in email or '.' not in email:
            return jsonify({"error": "Invalid email format"}), 400
        
        # Generate verification code
        verification_code = generate_email_verification_code()
        
        # Store verification code with expiration (10 minutes)
        expiration_time = datetime.now() + timedelta(minutes=10)
        email_verification_codes[email] = {
            'code': verification_code,
            'expires_at': expiration_time,
            'attempts': 0
        }
        
        # Send verification email
        success, result = send_verification_email(email, verification_code)
        
        if success:
            return jsonify({
                "message": "Verification email sent successfully",
                "email": email,
                "expiresIn": "10 minutes"
            }), 200
        else:
            # Remove stored code if email failed
            if email in email_verification_codes:
                del email_verification_codes[email]
            
            return jsonify({
                "error": "Failed to send verification email",
                "details": result.get('message', 'Unknown error')
            }), 500
            
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@email_verification_bp.route('/verify-email', methods=['POST'])
def verify_email():
    """Verify the email verification code"""
    try:
        data = request.get_json()
        email = data.get('email')
        verification_code = data.get('verificationCode')
        
        if not email or not verification_code:
            return jsonify({"error": "Email and verification code are required"}), 400
        
        # Check if verification code exists and is valid
        if email not in email_verification_codes:
            return jsonify({"error": "No verification code found for this email"}), 400
        
        stored_data = email_verification_codes[email]
        
        # Check if code has expired
        if datetime.now() > stored_data['expires_at']:
            del email_verification_codes[email]
            return jsonify({"error": "Verification code has expired"}), 400
        
        # Check if too many attempts
        if stored_data['attempts'] >= 3:
            del email_verification_codes[email]
            return jsonify({"error": "Too many failed attempts. Please request a new code"}), 400
        
        # Verify the code
        if stored_data['code'] == verification_code:
            # Success - remove the code and return success
            del email_verification_codes[email]
            return jsonify({
                "message": "Email verified successfully",
                "email": email,
                "verified": True
            }), 200
        else:
            # Increment attempts
            stored_data['attempts'] += 1
            remaining_attempts = 3 - stored_data['attempts']
            
            if remaining_attempts > 0:
                return jsonify({
                    "error": f"Invalid verification code. {remaining_attempts} attempts remaining"
                }), 400
            else:
                # Remove code after 3 failed attempts
                del email_verification_codes[email]
                return jsonify({
                    "error": "Too many failed attempts. Please request a new code"
                }), 400
                
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@email_verification_bp.route('/resend-email-code', methods=['POST'])
def resend_email_code():
    """Resend verification email"""
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({"error": "Email address is required"}), 400
        
        # Remove existing code if it exists
        if email in email_verification_codes:
            del email_verification_codes[email]
        
        # Generate new verification code
        verification_code = generate_email_verification_code()
        
        # Store new verification code
        expiration_time = datetime.now() + timedelta(minutes=10)
        email_verification_codes[email] = {
            'code': verification_code,
            'expires_at': expiration_time,
            'attempts': 0
        }
        
        # Send verification email
        success, result = send_verification_email(email, verification_code)
        
        if success:
            return jsonify({
                "message": "New verification email sent successfully",
                "email": email,
                "expiresIn": "10 minutes"
            }), 200
        else:
            # Remove stored code if email failed
            if email in email_verification_codes:
                del email_verification_codes[email]
            
            return jsonify({
                "error": "Failed to send verification email",
                "details": result.get('message', 'Unknown error')
            }), 500
            
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@email_verification_bp.route('/email-status/<email>', methods=['GET'])
def email_verification_status(email):
    """Check verification status for an email"""
    try:
        if email in email_verification_codes:
            stored_data = email_verification_codes[email]
            is_expired = datetime.now() > stored_data['expires_at']
            
            return jsonify({
                "email": email,
                "hasCode": True,
                "isExpired": is_expired,
                "attempts": stored_data['attempts'],
                "expiresAt": stored_data['expires_at'].isoformat()
            }), 200
        else:
            return jsonify({
                "email": email,
                "hasCode": False,
                "isExpired": False,
                "attempts": 0
            }), 200
            
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@email_verification_bp.route('/mock-email-history', methods=['GET'])
def mock_email_history():
    """Get mock email history for debugging"""
    try:
        mock_service = get_mock_email_service()
        history = mock_service.get_email_history()
        return jsonify(history), 200
    except Exception as e:
        return jsonify({"error": "Failed to get email history", "details": str(e)}), 500

@email_verification_bp.route('/clear-mock-email', methods=['POST'])
def clear_mock_email():
    """Clear mock email history"""
    try:
        mock_service = get_mock_email_service()
        result = mock_service.clear_history()
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": "Failed to clear email history", "details": str(e)}), 500
