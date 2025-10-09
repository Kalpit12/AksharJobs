#!/usr/bin/env python3
"""
Check user creation and authentication flow
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId

def check_user_creation():
    """Check user creation process"""
    
    db = get_db()
    if db is None:
        print("❌ Database connection failed")
        return False
    
    # Check all collections
    collections = db.list_collection_names()
    print(f"📚 Available collections: {collections}")
    
    # Check if user exists in any collection
    user_id = "68a848daa73a6ba4409a8bf4"
    
    print(f"\n🔍 Searching for user ID: {user_id}")
    
    for collection_name in collections:
        collection = db[collection_name]
        try:
            # Try to find the user in this collection
            user = collection.find_one({'_id': ObjectId(user_id)})
            if user:
                print(f"✅ Found user in collection '{collection_name}':")
                print(f"   Data: {user}")
                break
        except Exception as e:
            # Skip collections where ObjectId conversion fails
            continue
    else:
        print(f"❌ User not found in any collection")
    
    # Check if there are any users with similar email
    print(f"\n🔍 Checking for users with email 'john.doe@example.com'...")
    users_with_email = list(db.users.find({'email': 'john.doe@example.com'}))
    
    if users_with_email:
        print(f"✅ Found {len(users_with_email)} user(s) with this email:")
        for user in users_with_email:
            print(f"   ID: {user['_id']}")
            print(f"   Name: {user.get('firstName', '')} {user.get('lastName', '')}")
            print(f"   Role: {user.get('role', 'N/A')}")
    else:
        print(f"❌ No users found with this email")
    
    return True

if __name__ == "__main__":
    check_user_creation()




