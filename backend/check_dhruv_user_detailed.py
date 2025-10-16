#!/usr/bin/env python3
"""Check Dhruv Patel's user data in detail"""

import sys
sys.path.append('.')
from backend.config.database import get_db
from bson import ObjectId
from pprint import pprint

def check_user():
    db = get_db()
    
    if db is None:
        print("❌ Failed to connect to database")
        return
    
    print("[OK] MongoDB connected successfully!")
    print("=" * 80)
    print("CHECKING DHRUV PATEL'S USER DATA IN DETAIL")
    print("=" * 80)
    
    # Check users collection
    users_collection = db.users
    user = users_collection.find_one({'_id': ObjectId('68ed5e58ce67fe5e28e1b2cf')})
    
    if user:
        print("\n✅ User found in 'users' collection:")
        print("\nFull user document:")
        # Remove password for security
        if 'password' in user:
            user['password'] = '***HIDDEN***'
        pprint(user, width=120)
    else:
        print("\n❌ User not found!")

if __name__ == "__main__":
    check_user()

