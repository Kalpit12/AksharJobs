#!/usr/bin/env python3
"""
Copy the exact working password hash from recruiter to other users
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))

from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.production')
load_dotenv('.env.local')
load_dotenv('.env')

def copy_working_password():
    """Copy working password from recruiter to other users"""
    
    print("=" * 80)
    print("🔄 COPYING WORKING PASSWORD HASH")
    print("=" * 80)
    print()
    
    try:
        MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
        DB_NAME = os.getenv("DB_NAME", "TalentMatchDB")
        
        client = MongoClient(MONGO_URI, socketTimeoutMS=60000, connectTimeoutMS=60000)
        db = client[DB_NAME]
        
        # Get the EXACT password from the working recruiter
        recruiter = db.users.find_one({"email": "sarah.johnson@techcorp.com"})
        
        if not recruiter:
            print("❌ Recruiter not found!")
            return False
        
        working_password = recruiter.get('password')
        print(f"Found working password from recruiter")
        print(f"Password type: {type(working_password)}")
        print(f"Password value: {working_password[:50]}...")
        print()
        
        # Copy this EXACT password to failing users
        failing_users = [
            "test@example.com",
            "admin@example.com",
            "john.doe@example.com",
            "kalpit.patel@example.com"
        ]
        
        print("Copying to failing users:")
        for email in failing_users:
            result = db.users.update_one(
                {"email": email},
                {"$set": {"password": working_password}}
            )
            
            if result.modified_count > 0:
                print(f"  ✅ {email}")
            else:
                user = db.users.find_one({"email": email})
                if user:
                    print(f"  ⚠️  {email} (already has this password)")
                else:
                    print(f"  ❌ {email} (not found)")
        
        print()
        print("=" * 80)
        print("✅ COPIED WORKING PASSWORD!")
        print("=" * 80)
        print()
        print("Now restart backend and test again")
        print()
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    copy_working_password()

