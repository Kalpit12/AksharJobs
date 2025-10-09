#!/usr/bin/env python3
"""
Detailed test of the application endpoint
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId
import requests
import json

def test_application_detailed():
    """Test the application endpoint with detailed debugging"""
    
    # Test data
    job_id = "68b5508d79f0d1a0d21d345b"  # Product Manager job
    email = "john.doe@example.com"
    password = "password123"
    
    print(f"🧪 Detailed Application Endpoint Test")
    print(f"📋 Job ID: {job_id}")
    print(f"👤 Email: {email}")
    
    # Step 1: Login to get token
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
            
            # Step 2: Test job lookup directly
            print(f"\n2️⃣ Testing job lookup directly...")
            db = get_db()
            if db is not None:
                job_object_id = ObjectId(job_id)
                job = db.jobs.find_one({'_id': job_object_id})
                
                if job:
                    print(f"✅ Job found in database:")
                    print(f"   ID: {job['_id']}")
                    print(f"   Title: {job.get('job_title', 'N/A')}")
                    print(f"   Company: {job.get('company_name', 'N/A')}")
                else:
                    print(f"❌ Job not found in database!")
                    return False
            else:
                print(f"❌ Database connection failed")
                return False
            
            # Step 3: Test user lookup
            print(f"\n3️⃣ Testing user lookup...")
            user_object_id = ObjectId(user_id)
            user = db.users.find_one({'_id': user_object_id})
            
            if user:
                print(f"✅ User found in database:")
                print(f"   ID: {user['_id']}")
                print(f"   Name: {user.get('firstName', '')} {user.get('lastName', '')}")
                print(f"   Email: {user.get('email', 'N/A')}")
            else:
                print(f"❌ User not found in database!")
                return False
            
            # Step 4: Test application endpoint
            print(f"\n4️⃣ Testing application endpoint...")
            application_payload = {
                "job_id": job_id,
                "cover_letter": "I am interested in this position and would like to be considered for the role."
            }
            
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
    test_application_detailed()
