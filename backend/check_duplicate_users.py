#!/usr/bin/env python3
"""
Check for duplicate users
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId

def check_duplicate_users():
    """Check for duplicate users"""
    
    db = get_db()
    if db is None:
        print("❌ Database connection failed")
        return False
    
    email = "john.doe@example.com"
    
    print(f"🔍 Checking for users with email: {email}")
    
    # Find all users with this email
    users = list(db.users.find({'email': email}))
    
    print(f"📊 Found {len(users)} user(s) with this email:")
    
    for i, user in enumerate(users, 1):
        print(f"\n👤 User {i}:")
        print(f"   ID: {user['_id']}")
        print(f"   Name: {user.get('firstName', '')} {user.get('lastName', '')}")
        print(f"   Email: {user.get('email', 'N/A')}")
        print(f"   Role: {user.get('userType', 'N/A')}")
        print(f"   Created: {user.get('created_at', 'N/A')}")
        print(f"   Password hash: {user.get('password', 'N/A')[:50]}...")
    
    # Check if the user ID from the JWT token exists
    jwt_user_id = "68a848daa73a6ba4409a8bf4"
    print(f"\n🔍 Checking if JWT user ID exists: {jwt_user_id}")
    
    jwt_user = db.users.find_one({'_id': ObjectId(jwt_user_id)})
    if jwt_user:
        print(f"✅ JWT user exists:")
        print(f"   ID: {jwt_user['_id']}")
        print(f"   Name: {jwt_user.get('firstName', '')} {jwt_user.get('lastName', '')}")
        print(f"   Email: {jwt_user.get('email', 'N/A')}")
        print(f"   Role: {jwt_user.get('userType', 'N/A')}")
    else:
        print(f"❌ JWT user does not exist!")
    
    return True

if __name__ == "__main__":
    check_duplicate_users()
