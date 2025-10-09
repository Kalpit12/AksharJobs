#!/usr/bin/env python3
"""
Test promo code endpoint with valid token
"""

import requests
import jwt
from datetime import datetime, timedelta
import os

def generate_test_token():
    """Generate a test token for the user"""
    try:
        secret_key = os.getenv('SECRET_KEY', '6f2b5c8e9d3a4f1b7e0c2d8a5f6e7b3c')
        
        payload = {
            'sub': '68b012a441ec82ed03ba21e7',  # User ID
            'user_id': '68b012a441ec82ed03ba21e7',
            'email': 'kalpitpatel751@gmail.com',
            'role': 'jobSeeker',
            'exp': datetime.utcnow() + timedelta(hours=24)
        }
        
        token = jwt.encode(payload, secret_key, algorithm='HS256')
        return token
        
    except Exception as e:
        print(f"❌ Error generating token: {e}")
        return None

def test_promo_endpoint():
    """Test the promo code endpoint"""
    try:
        print("🔑 Generating test token...")
        token = generate_test_token()
        
        if not token:
            print("❌ Failed to generate token")
            return
            
        print(f"✅ Token generated: {token[:50]}...")
        
        print("\n🧪 Testing promo code endpoint...")
        
        # Test the endpoint
        response = requests.get(
            "http://localhost:3002/api/promo/get_my_promo_code",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )
        
        print(f"📊 Response status: {response.status_code}")
        print(f"📄 Response data: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("✅ Promo code endpoint working!")
                print(f"🎫 Promo code: {data.get('promo_code', {})}")
            else:
                print(f"❌ Promo code endpoint failed: {data.get('error', 'Unknown error')}")
        else:
            print(f"❌ Endpoint failed with status {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error testing endpoint: {e}")
        import traceback
        traceback.print_exc()

def test_health():
    """Test health endpoint"""
    try:
        print("🏥 Testing health endpoint...")
        response = requests.get("http://localhost:3002/health")
        
        print(f"📊 Health status: {response.status_code}")
        print(f"📄 Health data: {response.json()}")
        
        return response.status_code == 200
        
    except Exception as e:
        print(f"❌ Error testing health: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 Testing Promo Code Endpoint")
    print("=" * 40)
    
    # Test 1: Health check
    if not test_health():
        print("❌ Backend is not running. Please start the backend server first.")
        return
    
    print("\n" + "=" * 40)
    
    # Test 2: Promo code endpoint
    test_promo_endpoint()
    
    print("\n" + "=" * 40)
    print("🏁 Test completed!")

if __name__ == "__main__":
    main()
