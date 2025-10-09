#!/usr/bin/env python3
"""
Test JWT validation
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import requests
import json

def test_jwt_validation():
    """Test JWT validation"""
    
    # Test data
    email = "john.doe@example.com"
    password = "password123"
    
    print(f"🧪 JWT Validation Test")
    print(f"👤 Email: {email}")
    
    # Step 1: Login
    print(f"\n1️⃣ Logging in...")
    login_payload = {
        "email": email,
        "password": password
    }
    
    try:
        login_response = requests.post(
            "http://192.168.1.145:3002/api/auth/login",
            json=login_payload,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"📊 Login status: {login_response.status_code}")
        
        if login_response.status_code == 200:
            login_data = login_response.json()
            token = login_data.get('token')
            user_id = login_data.get('userId')
            
            print(f"✅ Login successful")
            print(f"🎫 Token: {token[:50]}...")
            print(f"👤 User ID: {user_id}")
            
            # Step 2: Test protected endpoint (get current user)
            print(f"\n2️⃣ Testing protected endpoint...")
            
            me_response = requests.get(
                "http://192.168.1.145:3002/api/auth/me",
                headers={
                    'Authorization': f'Bearer {token}'
                }
            )
            
            print(f"📊 Me response status: {me_response.status_code}")
            print(f"📄 Me response: {me_response.text}")
            
            if me_response.status_code == 200:
                print(f"✅ JWT validation successful!")
                return True
            else:
                print(f"❌ JWT validation failed")
                return False
                
        else:
            print(f"❌ Login failed: {login_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_jwt_validation()




