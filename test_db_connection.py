#!/usr/bin/env python3
"""
Test database connection and user lookup
"""

import sys
import os
sys.path.append('backend')

from utils.db import get_db
from bson import ObjectId

try:
    print("Testing database connection...")
    
    # Test database connection
    db = get_db()
    if db is None:
        print("[ERROR] Database connection failed")
        exit(1)
    
    print("[OK] Database connected successfully")
    
    # Test user lookup
    print("Testing user lookup...")
    user = db.users.find_one({"email": "test@example.com"})
    
    if user:
        print(f"[OK] User found: {user.get('firstName', '')} {user.get('lastName', '')}")
        print(f"User ID: {user['_id']}")
        print(f"Email: {user['email']}")
        print(f"Role: {user.get('userType', 'N/A')}")
    else:
        print("[ERROR] User not found")
        
        # List all users
        all_users = list(db.users.find({}, {"email": 1, "firstName": 1, "lastName": 1}).limit(5))
        print(f"Found {len(all_users)} users in database:")
        for u in all_users:
            print(f"  - {u.get('email', 'No email')} ({u.get('firstName', '')} {u.get('lastName', '')})")
    
    # Test applications lookup
    print("Testing applications lookup...")
    applications = list(db.applications.find({}).limit(3))
    print(f"Found {len(applications)} applications")
    
    if applications:
        first_app = applications[0]
        print(f"First application: {first_app.get('job_title', 'No title')} at {first_app.get('company_name', 'No company')}")
    
except Exception as e:
    print(f"[ERROR] Database test failed: {e}")
    import traceback
    traceback.print_exc()
