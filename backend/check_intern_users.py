#!/usr/bin/env python3
"""
Check Intern User Details
Displays the current state of bulk-imported intern accounts
"""

from utils.db import get_db
import json

def check_intern_users():
    """Check intern user details"""
    try:
        db = get_db()
        users_collection = db['users']
        
        # Find all intern users
        intern_users = list(users_collection.find({'userType': 'intern'}))
        
        print(f"📊 Found {len(intern_users)} intern users\n")
        print("="*80)
        
        for user in intern_users:
            print(f"\n👤 Email: {user.get('email', 'N/A')}")
            print(f"   User ID: {user.get('_id')}")
            print(f"   First Name: {user.get('firstName', 'N/A')}")
            print(f"   Last Name: {user.get('lastName', 'N/A')}")
            print(f"   userType: {user.get('userType', 'N/A')}")
            print(f"   role: {user.get('role', 'N/A')}")
            print(f"   bulk_imported: {user.get('bulk_imported', False)}")
            print(f"   profileCompleted: {user.get('profileCompleted', 'NOT SET')}")
            print(f"   has internDetails: {user.get('internDetails') is not None}")
            print(f"   universityName: {user.get('universityName', 'N/A')}")
            print(f"   studentId: {user.get('studentId', 'N/A')}")
            print(f"   temp_password: {user.get('temp_password', 'N/A')}")
        
        print("\n" + "="*80)
        print(f"\n✅ Check complete!")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    print("🔍 Checking Intern User Details...")
    print("="*80)
    check_intern_users()

