#!/usr/bin/env python3
"""
Debug script to check users in database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId

def check_users():
    """Check users in database"""
    
    db = get_db()
    if db is None:
        print("❌ Database connection failed")
        return False
    
    # Get some users
    users = list(db.users.find({}, {'_id': 1, 'firstName': 1, 'lastName': 1, 'email': 1, 'role': 1}).limit(5))
    
    if not users:
        print("❌ No users found in database")
        return False
    
    print("✅ Found users in database:")
    for user in users:
        print(f"  ID: {user['_id']}")
        print(f"  Name: {user.get('firstName', '')} {user.get('lastName', '')}")
        print(f"  Email: {user.get('email', 'N/A')}")
        print(f"  Role: {user.get('role', 'N/A')}")
        print("  ---")
    
    return True

if __name__ == "__main__":
    check_users()




