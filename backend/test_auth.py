#!/usr/bin/env python3
"""
Test script to debug authentication
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId
import requests
import json

def test_auth():
    """Test authentication"""
    
    # Test login first
    login_payload = {
        "email": "john.doe@example.com",
        "password": "password123"  # Assuming default password
    }
    
    print(f"🔐 Testing authentication...")
    print(f"📧 Email: {login_payload['email']}")
    
    try:
        # Try to login
        response = requests.post(
            "http://localhost:3002/api/auth/login",
            json=login_payload,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"📊 Login response status: {response.status_code}")
        print(f"📄 Login response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            user_id = data.get('user_id')
            
            if token:
                print(f"✅ Login successful")
                print(f"🎫 Token: {token[:50]}...")
                print(f"👤 User ID: {user_id}")
                
                # Now test application with valid token
                job_id = "68b5508d79f0d1a0d21d345b"
                application_payload = {
                    "job_id": job_id,
                    "cover_letter": "I am interested in this position and would like to be considered for the role."
                }
                
                print(f"\n🧪 Testing application with valid token...")
                print(f"📋 Job ID: {job_id}")
                
                app_response = requests.post(
                    "http://localhost:3002/api/applications/apply",
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
                else:
                    print(f"❌ Application failed")
                    
            else:
                print(f"❌ No token in response")
        else:
            print(f"❌ Login failed")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_auth()