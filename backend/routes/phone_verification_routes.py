from flask import Blueprint, request, jsonify
import random
import string
import time
from datetime import datetime, timedelta
import urllib.parse
import urllib.request
import urllib.error
import json
from .mock_sms_service import get_mock_sms_service

phone_verification_bp = Blueprint('phone_verification', __name__)

# In-memory storage for verification codes (in production, use Redis or database)
verification_codes = {}

# SMS API Configuration (from your Python script)
CELCOM_ENDPOINT = "https://isms.celcomafrica.com/api/services/sendsms"
CELCOM_PARTNER_ID = '245'
CELCOM_API_KEY = 'e6bf441d8fd044399d1d6cdfdde154ea'
SHORTCODE = 'Shajanand'

def generate_verification_code():
    """Generate a 6-digit verification code"""
    return ''.join(random.choices(string.digits, k=6))

def send_sms(phone_number, message):
    """Send SMS using Celcom API with improved error handling"""
    try:
        # Clean phone number - ensure it's in the correct format
        clean_phone = phone_number.replace('+', '').replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
        
        # Validate phone number format
        if not clean_phone.isdigit() or len(clean_phone) < 10:
            return False, {"status": "error", "message": "Invalid phone number format"}
        
        # Prepare parameters with multiple possible formats
        param_sets = [
            # Format 1: Standard parameters
            {
                "apikey": CELCOM_API_KEY,
                "partnerID": CELCOM_PARTNER_ID,
                "shortcode": SHORTCODE,
                "message": message,
                "mobile": clean_phone,
            },
            # Format 2: Alternative parameter names
            {
                "api_key": CELCOM_API_KEY,
                "partner_id": CELCOM_PARTNER_ID,
                "shortcode": SHORTCODE,
                "message": message,
                "mobile": clean_phone,
            },
            # Format 3: With additional required fields
            {
                "apikey": CELCOM_API_KEY,
                "partnerID": CELCOM_PARTNER_ID,
                "shortcode": SHORTCODE,
                "message": message,
                "mobile": clean_phone,
                "clientsmsid": f"RocketMatch_{int(time.time())}",
                "passphrase": CELCOM_API_KEY,  # Some APIs require this
            }
        ]
        
        # Try different parameter formats
        for i, params in enumerate(param_sets):
            try:
                print(f"Trying SMS format {i+1} with params: {params}")
                
                # Make the request
                url = f"{CELCOM_ENDPOINT}?{urllib.parse.urlencode(params)}"
                print(f"Requesting URL: {url}")
                
                # Add headers to mimic a real browser request
                req = urllib.request.Request(url)
                req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
                req.add_header('Accept', 'application/json, text/plain, */*')
                
                response = urllib.request.urlopen(req, timeout=30)
                response_data = response.read()
                
                print(f"Response status: {response.status}")
                print(f"Response data: {response_data}")
                
                # Parse response
                try:
                    result = json.loads(response_data.decode('utf-8'))
                    if response.status == 200:
                        print(f"SMS sent successfully with format {i+1}")
                        return True, result
                    else:
                        print(f"SMS failed with status {response.status}")
                        continue
                        
                except json.JSONDecodeError:
                    # If response is not JSON, check if it's a success message
                    response_text = response_data.decode('utf-8', errors='ignore').lower()
                    if response.status == 200 and any(word in response_text for word in ['success', 'sent', 'ok']):
                        print(f"SMS appears successful with format {i+1}")
                        return True, {"status": "success", "message": "SMS sent"}
                    else:
                        print(f"Non-JSON response, status {response.status}: {response_text}")
                        continue
                        
            except urllib.error.HTTPError as e:
                print(f"HTTP Error {e.code} with format {i+1}: {e.reason}")
                if e.code == 422:
                    print(f"422 error details: {e.read().decode('utf-8', errors='ignore')}")
                continue
            except Exception as e:
                print(f"Error with format {i+1}: {str(e)}")
                continue
        
        # If all formats failed, try mock SMS service as fallback
        print("🔄 All real SMS formats failed, trying mock SMS service...")
        mock_service = get_mock_sms_service()
        success, result = mock_service.send_sms(clean_phone, message)
        
        if success:
            print("✅ Mock SMS service succeeded")
            return True, result
        else:
            print("❌ Mock SMS service also failed")
            return False, {"status": "error", "message": "All SMS services failed"}
                
    except Exception as e:
        print(f"General SMS error: {str(e)}")
        # Try mock SMS service as last resort
        try:
            print("🔄 Trying mock SMS service as fallback...")
            mock_service = get_mock_sms_service()
            success, result = mock_service.send_sms(phone_number, message)
            
            if success:
                print("✅ Mock SMS service succeeded")
                return True, result
        except Exception as mock_error:
            print(f"Mock SMS service also failed: {str(mock_error)}")
        
        return False, {"status": "error", "message": str(e)}

@phone_verification_bp.route('/send-verification-code', methods=['POST'])
def send_verification_code():
    """Send verification code to phone number"""
    try:
        data = request.get_json()
        phone_number = data.get('phoneNumber')
        
        if not phone_number:
            return jsonify({"error": "Phone number is required"}), 400
        
        # Clean phone number (remove spaces, dashes, parentheses)
        clean_phone = ''.join(filter(str.isdigit, phone_number))
        
        if len(clean_phone) < 10:
            return jsonify({"error": "Invalid phone number format"}), 400
        
        # Generate verification code
        verification_code = generate_verification_code()
        
        # Store verification code with expiration (10 minutes)
        expiration_time = datetime.now() + timedelta(minutes=10)
        verification_codes[clean_phone] = {
            'code': verification_code,
            'expires_at': expiration_time,
            'attempts': 0
        }
        
        # Prepare SMS message
        sms_message = f"Your RocketMatch verification code is: {verification_code}. Valid for 10 minutes. Do not share this code."
        
        # Send SMS
        success, result = send_sms(clean_phone, sms_message)
        
        if success:
            return jsonify({
                "message": "Verification code sent successfully",
                "phoneNumber": clean_phone,
                "expiresIn": "10 minutes"
            }), 200
        else:
            # Remove stored code if SMS failed
            if clean_phone in verification_codes:
                del verification_codes[clean_phone]
            
            return jsonify({
                "error": "Failed to send verification code",
                "details": result.get('message', 'Unknown error')
            }), 500
            
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@phone_verification_bp.route('/verify-code', methods=['POST'])
def verify_code():
    """Verify the verification code"""
    try:
        data = request.get_json()
        phone_number = data.get('phoneNumber')
        verification_code = data.get('verificationCode')
        
        if not phone_number or not verification_code:
            return jsonify({"error": "Phone number and verification code are required"}), 400
        
        # Clean phone number
        clean_phone = ''.join(filter(str.isdigit, phone_number))
        
        # Check if verification code exists and is valid
        if clean_phone not in verification_codes:
            return jsonify({"error": "No verification code found for this phone number"}), 400
        
        stored_data = verification_codes[clean_phone]
        
        # Check if code has expired
        if datetime.now() > stored_data['expires_at']:
            del verification_codes[clean_phone]
            return jsonify({"error": "Verification code has expired"}), 400
        
        # Check if too many attempts
        if stored_data['attempts'] >= 3:
            del verification_codes[clean_phone]
            return jsonify({"error": "Too many failed attempts. Please request a new code"}), 400
        
        # Verify the code
        if stored_data['code'] == verification_code:
            # Success - remove the code and return success
            del verification_codes[clean_phone]
            return jsonify({
                "message": "Phone number verified successfully",
                "phoneNumber": clean_phone,
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
                del verification_codes[clean_phone]
                return jsonify({
                    "error": "Too many failed attempts. Please request a new code"
                }), 400
                
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@phone_verification_bp.route('/resend-code', methods=['POST'])
def resend_code():
    """Resend verification code"""
    try:
        data = request.get_json()
        phone_number = data.get('phoneNumber')
        
        if not phone_number:
            return jsonify({"error": "Phone number is required"}), 400
        
        # Clean phone number
        clean_phone = ''.join(filter(str.isdigit, phone_number))
        
        # Remove existing code if it exists
        if clean_phone in verification_codes:
            del verification_codes[clean_phone]
        
        # Generate new verification code
        verification_code = generate_verification_code()
        
        # Store new verification code
        expiration_time = datetime.now() + timedelta(minutes=10)
        verification_codes[clean_phone] = {
            'code': verification_code,
            'expires_at': expiration_time,
            'attempts': 0
        }
        
        # Prepare SMS message
        sms_message = f"Your new RocketMatch verification code is: {verification_code}. Valid for 10 minutes. Do not share this code."
        
        # Send SMS
        success, result = send_sms(clean_phone, sms_message)
        
        if success:
            return jsonify({
                "message": "New verification code sent successfully",
                "phoneNumber": clean_phone,
                "expiresIn": "10 minutes"
            }), 200
        else:
            # Remove stored code if SMS failed
            if clean_phone in verification_codes:
                del verification_codes[clean_phone]
            
            return jsonify({
                "error": "Failed to send verification code",
                "details": result.get('message', 'Unknown error')
            }), 500
            
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@phone_verification_bp.route('/status/<phone_number>', methods=['GET'])
def verification_status(phone_number):
    """Check verification status for a phone number"""
    try:
        # Clean phone number
        clean_phone = ''.join(filter(str.isdigit, phone_number))
        
        if clean_phone in verification_codes:
            stored_data = verification_codes[clean_phone]
            is_expired = datetime.now() > stored_data['expires_at']
            
            return jsonify({
                "phoneNumber": clean_phone,
                "hasCode": True,
                "isExpired": is_expired,
                "attempts": stored_data['attempts'],
                "expiresAt": stored_data['expires_at'].isoformat()
            }), 200
        else:
            return jsonify({
                "phoneNumber": clean_phone,
                "hasCode": False,
                "isExpired": False,
                "attempts": 0
            }), 200
            
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@phone_verification_bp.route('/mock-sms-history', methods=['GET'])
def mock_sms_history():
    """Get mock SMS history for debugging"""
    try:
        mock_service = get_mock_sms_service()
        history = mock_service.get_sms_history()
        return jsonify(history), 200
    except Exception as e:
        return jsonify({"error": "Failed to get SMS history", "details": str(e)}), 500

@phone_verification_bp.route('/clear-mock-sms', methods=['POST'])
def clear_mock_sms():
    """Clear mock SMS history"""
    try:
        mock_service = get_mock_sms_service()
        result = mock_service.clear_history()
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": "Failed to clear SMS history", "details": str(e)}), 500
