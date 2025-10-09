#!/usr/bin/env python3
"""
Simple test of the application endpoint
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import requests
import json

def test_simple_application():
    """Simple test of the application endpoint"""
    
    # Test data
    job_id = "68b5508d79f0d1a0d21d345b"
    email = "john.doe@example.com"
    password = "password123"
    
    print(f"🧪 Simple Application Test")
    print(f"📋 Job ID: {job_id}")
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
            
            # Step 2: Test application endpoint
            print(f"\n2️⃣ Testing application endpoint...")
            application_payload = {
                "job_id": job_id,
                "cover_letter": "I am interested in this position and would like to be considered for the role."
            }
            
            print(f"📝 Payload: {json.dumps(application_payload, indent=2)}")
            print(f"🔗 URL: http://192.168.1.145:3002/api/applications/apply")
            print(f"🎫 Token: {token[:50]}...")
            
            app_response = requests.post(
                "http://192.168.1.145:3002/api/applications/apply",
                json=application_payload,
                headers={
                    'Content-Type': 'application/json',
                    'Authorization': f'Bearer {token}'
                }
            )
            
            print(f"📊 Application response status: {app_response.status_code}")
            print(f"📄 Application response: {app_response.text}")
            
            if app_response.status_code == 201:
                print(f"✅ Application successful!")
                return True
            else:
                print(f"❌ Application failed")
                return False
                
        else:
            print(f"❌ Login failed: {login_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_simple_application()




