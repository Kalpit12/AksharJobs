#!/usr/bin/env python3
"""
Test script to debug login issues
"""

import requests
import json

def test_login():
    url = "http://localhost:3002/api/auth/login"
    data = {
        "email": "sarah.johnson@techcorp.com",
        "password": "recruiter123"
    }
    
    try:
        print("🔧 Testing login with recruiter credentials...")
        print(f"📧 Email: {data['email']}")
        print(f"🔒 Password: {data['password']}")
        print("=" * 50)
        
        response = requests.post(url, json=data)
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📋 Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            print(f"📄 Response: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"❌ Login failed with status {response.status_code}")
            print(f"📄 Error Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - make sure backend is running on port 3002")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

if __name__ == "__main__":
    test_login()
