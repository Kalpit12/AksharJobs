#!/usr/bin/env python3
"""
Debug the application endpoint issue
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId
import requests
import json

def test_application_debug():
    """Debug the application endpoint issue"""
    
    # Test data
    job_id = "68b5508d79f0d1a0d21d345b"
    email = "john.doe@example.com"
    password = "password123"
    
    print(f"🧪 Application Debug Test")
    print(f"📋 Job ID: {job_id}")
    print(f"👤 Email: {email}")
    
    # Step 1: Test database connection and job lookup
    print(f"\n1️⃣ Testing database connection...")
    db = get_db()
    if db is not None:
        print(f"✅ Database connected: {db.name}")
        
        # Test ObjectId conversion
        try:
            job_object_id = ObjectId(job_id)
            print(f"✅ ObjectId conversion successful: {job_object_id}")
        except Exception as e:
            print(f"❌ ObjectId conversion failed: {e}")
            return False
        
        # Test job lookup
        job = db.jobs.find_one({'_id': job_object_id})
        if job:
            print(f"✅ Job found:")
            print(f"   ID: {job['_id']}")
            print(f"   Title: {job.get('job_title', 'N/A')}")
            print(f"   Company: {job.get('company_name', 'N/A')}")
        else:
            print(f"❌ Job not found!")
            return False
    else:
        print(f"❌ Database connection failed")
        return False
    
    # Step 2: Login to get token
    print(f"\n2️⃣ Logging in...")
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
        
        if login_response.status_code == 200:
            login_data = login_response.json()
            token = login_data.get('token')
            user_id = login_data.get('userId')
            
            print(f"✅ Login successful")
            print(f"👤 User ID: {user_id}")
            
            # Step 3: Test user lookup
            print(f"\n3️⃣ Testing user lookup...")
            user_object_id = ObjectId(user_id)
            user = db.users.find_one({'_id': user_object_id})
            if user:
                print(f"✅ User found:")
                print(f"   ID: {user['_id']}")
                print(f"   Name: {user.get('firstName', '')} {user.get('lastName', '')}")
                print(f"   Email: {user.get('email', 'N/A')}")
            else:
                print(f"❌ User not found!")
                return False
            
            # Step 4: Test application endpoint with detailed logging
            print(f"\n4️⃣ Testing application endpoint...")
            application_payload = {
                "job_id": job_id,
                "cover_letter": "I am interested in this position and would like to be considered for the role."
            }
            
            print(f"📝 Payload: {json.dumps(application_payload, indent=2)}")
            print(f"🔗 URL: http://192.168.1.145:3002/api/applications/apply")
            print(f"🎫 Token: {token[:50]}...")
            
            # Make the request with timeout
            app_response = requests.post(
                "http://192.168.1.145:3002/api/applications/apply",
                json=application_payload,
                headers={
                    'Content-Type': 'application/json',
                    'Authorization': f'Bearer {token}'
                },
                timeout=10
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
    test_application_debug()




