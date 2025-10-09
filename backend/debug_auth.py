#!/usr/bin/env python3
"""
Debug script to check authentication and user data
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId
import jwt
from config import Config

def debug_auth():
    """Debug authentication"""
    
    db = get_db()
    if db is None:
        print("❌ Database connection failed")
        return False
    
    # Check all users
    users = list(db.users.find({}, {'_id': 1, 'firstName': 1, 'lastName': 1, 'email': 1, 'role': 1}))
    
    print("👥 All users in database:")
    for user in users:
        print(f"  ID: {user['_id']}")
        print(f"  Name: {user.get('firstName', '')} {user.get('lastName', '')}")
        print(f"  Email: {user.get('email', 'N/A')}")
        print(f"  Role: {user.get('role', 'N/A')}")
        print("  ---")
    
    # Check all jobs
    jobs = list(db.jobs.find({}, {'_id': 1, 'job_title': 1, 'company_name': 1}))
    
    print("\n💼 All jobs in database:")
    for job in jobs:
        print(f"  ID: {job['_id']}")
        print(f"  Title: {job.get('job_title', 'N/A')}")
        print(f"  Company: {job.get('company_name', 'N/A')}")
        print("  ---")
    
    # Decode the JWT token
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OGE4NDhkYWE3M2E2YmE0NDA5YThiZjQiLCJleHAiOjE3NTY4MDAxODN9.HQfoZVUD3iEI6bRW9n8wUfFKTRMGWCQG-nfJf1dnAkw"
    
    try:
        decoded = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=["HS256"])
        print(f"\n🔓 JWT Token decoded:")
        print(f"  Subject (user_id): {decoded.get('sub')}")
        print(f"  Expires: {decoded.get('exp')}")
        
        # Check if this user exists
        user_id = decoded.get('sub')
        user = db.users.find_one({'_id': ObjectId(user_id)})
        if user:
            print(f"✅ User from JWT exists in database:")
            print(f"  Name: {user.get('firstName', '')} {user.get('lastName', '')}")
            print(f"  Email: {user.get('email', 'N/A')}")
            print(f"  Role: {user.get('role', 'N/A')}")
        else:
            print(f"❌ User from JWT not found in database")
            
    except Exception as e:
        print(f"❌ JWT decode error: {e}")
    
    return True

if __name__ == "__main__":
    debug_auth()




