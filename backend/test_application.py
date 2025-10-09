#!/usr/bin/env python3
"""
Test script to debug application endpoint
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId
import requests
import json

def test_application_endpoint():
    """Test the application endpoint"""
    
    # Test data
    job_id = "68b5508d79f0d1a0d21d345b"  # Product Manager job
    user_id = "68a6cf09e194213600f60fee"  # John Doe user
    
    # Test data payload
    payload = {
        "job_id": job_id,
        "cover_letter": "I am interested in this position and would like to be considered for the role."
    }
    
    print(f"🧪 Testing application endpoint...")
    print(f"📋 Job ID: {job_id}")
    print(f"👤 User ID: {user_id}")
    print(f"📝 Payload: {json.dumps(payload, indent=2)}")
    
    # Test ObjectId conversion
    try:
        job_object_id = ObjectId(job_id)
        user_object_id = ObjectId(user_id)
        print(f"✅ ObjectId conversion successful")
        print(f"   Job ObjectId: {job_object_id}")
        print(f"   User ObjectId: {user_object_id}")
    except Exception as e:
        print(f"❌ ObjectId conversion failed: {e}")
        return False
    
    # Test database queries
    db = get_db()
    if db is None:
        print("❌ Database connection failed")
        return False
    
    # Check if job exists
    job = db.jobs.find_one({'_id': job_object_id})
    if job:
        print(f"✅ Job found: {job.get('job_title', 'N/A')} at {job.get('company_name', 'N/A')}")
    else:
        print(f"❌ Job not found with ID: {job_id}")
        return False
    
    # Check if user exists
    user = db.users.find_one({'_id': user_object_id})
    if user:
        print(f"✅ User found: {user.get('firstName', '')} {user.get('lastName', '')} ({user.get('email', 'N/A')})")
    else:
        print(f"❌ User not found with ID: {user_id}")
        return False
    
    # Check if user already applied
    existing_application = db.applications.find_one({
        'job_id': job_object_id,
        'applicant_id': user_object_id
    })
    
    if existing_application:
        print(f"⚠️  User has already applied for this job")
        print(f"   Application ID: {existing_application['_id']}")
        print(f"   Status: {existing_application.get('status', 'N/A')}")
    else:
        print(f"✅ No existing application found - user can apply")
    
    return True

if __name__ == "__main__":
    test_application_endpoint()




