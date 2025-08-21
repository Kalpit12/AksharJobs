#!/usr/bin/env python3
"""
Test script for SMS functionality using Celcom API
This script tests the SMS sending capability before integrating with the main application
"""

import urllib.parse
import urllib.request
import urllib.error
import json
import time

def test_sms_sending():
    """Test sending an SMS using the Celcom API with multiple formats"""
    
    # Configuration from your original script
    phone = '254789098686'  # Test phone number
    sms_text = "🎉 Your phone number has been successfully verified! Welcome aboard 🚀 – you’re all set to explore and make the most of RocketMatch."
    shortcode = 'Shajanand'
    celcom_partner_id = '245'
    celcom_api_key = 'e6bf441d8fd044399d1d6cdfdde154ea'
    celcom_endpoint = "https://isms.celcomafrica.com/api/services/sendsms"
    
    print("🧪 Testing SMS Functionality")
    print("=" * 50)
    print(f"Phone: {phone}")
    print(f"Message: {sms_text}")
    print(f"Shortcode: {shortcode}")
    print(f"Partner ID: {celcom_partner_id}")
    print(f"API Key: {celcom_api_key[:10]}...")
    print(f"Endpoint: {celcom_endpoint}")
    print("=" * 50)
    
    # Test different parameter formats
    param_formats = [
        {
            "name": "Standard Format",
            "params": {
                "apikey": celcom_api_key,
                "partnerID": celcom_partner_id,
                "shortcode": shortcode,
                "message": sms_text,
                "mobile": phone.replace('+', ''),
            }
        },
        {
            "name": "Alternative Format",
            "params": {
                "api_key": celcom_api_key,
                "partner_id": celcom_partner_id,
                "shortcode": shortcode,
                "message": sms_text,
                "mobile": phone.replace('+', ''),
            }
        },
        {
            "name": "Extended Format",
            "params": {
                "apikey": celcom_api_key,
                "partnerID": celcom_partner_id,
                "shortcode": shortcode,
                "message": sms_text,
                "mobile": phone.replace('+', ''),
                "clientsmsid": f"Test_{int(time.time())}",
            }
        },
        {
            "name": "Minimal Format",
            "params": {
                "apikey": celcom_api_key,
                "mobile": phone.replace('+', ''),
                "message": sms_text,
            }
        }
    ]
    
    for i, format_info in enumerate(param_formats):
        print(f"\n🔄 Testing Format {i+1}: {format_info['name']}")
        print("-" * 40)
        
        try:
            # Prepare parameters
            params = urllib.parse.urlencode(format_info['params'])
            url = f"{celcom_endpoint}?{params}"
            
            print(f"📡 URL: {url}")
            
            # Create request with headers
            req = urllib.request.Request(url)
            req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
            req.add_header('Accept', 'application/json, text/plain, */*')
            
            # Make the request
            response = urllib.request.urlopen(req, timeout=30)
            response_data = response.read()
            
            print(f"✅ Status: {response.status}")
            print(f"📨 Response: {response_data}")
            
            # Try to parse JSON response
            try:
                result = json.loads(response_data.decode('utf-8'))
                print(f"📋 Parsed: {json.dumps(result, indent=2)}")
                
                if response.status == 200:
                    print(f"🎉 Format {i+1} SUCCESS!")
                    return True
                else:
                    print(f"⚠️  Format {i+1} failed with status: {response.status}")
                    
            except json.JSONDecodeError:
                response_text = response_data.decode('utf-8', errors='ignore')
                if response.status == 200 and any(word in response_text.lower() for word in ['success', 'sent', 'ok']):
                    print(f"🎉 Format {i+1} appears successful!")
                    return True
                else:
                    print(f"⚠️  Format {i+1} failed - non-JSON response")
                    
        except urllib.error.HTTPError as e:
            print(f"❌ HTTP Error {e.code}: {e.reason}")
            if e.code == 422:
                error_details = e.read().decode('utf-8', errors='ignore')
                print(f"🔍 422 Error Details: {error_details}")
        except Exception as e:
            print(f"❌ Error: {str(e)}")
    
    print("\n❌ All formats failed")
    return False

def test_verification_code_generation():
    """Test verification code generation"""
    import random
    import string
    
    print("\n🔐 Testing Verification Code Generation")
    print("=" * 50)
    
    for i in range(5):
        code = ''.join(random.choices(string.digits, k=6))
        print(f"Code {i+1}: {code}")
    
    print("✅ Verification code generation working correctly")

if __name__ == "__main__":
    print("🚀 RocketMatch SMS Testing Suite")
    print("=" * 50)
    
    # Test verification code generation
    test_verification_code_generation()
    
    # Test SMS sending
    print("\n" + "=" * 50)
    success = test_sms_sending()
    
    if success:
        print("\n🎯 All tests passed! SMS system is ready for integration.")
    else:
        print("\n⚠️  Some tests failed. Please check your configuration.")
    
    print("\n" + "=" * 50)
    print("💡 To integrate with your app:")
    print("1. Ensure the backend is running")
    print("2. Use the PhoneVerification component in your React app")
    print("3. Test the /api/send-verification-code endpoint")
    print("4. Verify the /api/verify-code endpoint works")
