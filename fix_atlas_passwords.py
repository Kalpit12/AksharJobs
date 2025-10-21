#!/usr/bin/env python3
"""
Fix passwords in MongoDB ATLAS (the actual database the backend uses!)
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))

from pymongo import MongoClient
from dotenv import load_dotenv
import bcrypt

# Load environment variables
load_dotenv('.env.production')
load_dotenv('.env.local')
load_dotenv('.env')

def fix_atlas_passwords():
    """Fix passwords in MongoDB Atlas (cloud database)"""
    
    print("=" * 80)
    print("☁️  FIXING PASSWORDS IN MONGODB ATLAS (CLOUD)")
    print("=" * 80)
    print()
    
    try:
        # Get the SAME connection string the backend uses
        MONGO_URI = os.getenv("MONGO_URI")
        DB_NAME = os.getenv("DB_NAME", "TalentMatchDB")
        
        if not MONGO_URI:
            print("❌ ERROR: MONGO_URI not found in environment variables!")
            print("The backend is using Atlas but we don't have the connection string.")
            return False
        
        print(f"🔌 Connecting to: {MONGO_URI[:50]}...")
        print(f"📚 Database: {DB_NAME}")
        print()
        
        # Connect to MongoDB Atlas
        client = MongoClient(MONGO_URI, socketTimeoutMS=60000, connectTimeoutMS=60000)
        db = client[DB_NAME]
        
        # Test connection
        db.command('ping')
        print("✅ Connected to MongoDB Atlas!")
        print()
        
        # Generate password hash
        password = "Test@123"
        fresh_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=12))
        hash_str = fresh_hash.decode('utf-8')  # STRING format
        
        print(f"🔑 New password: {password}")
        print(f"   Hash: {hash_str[:50]}...")
        print()
        
        # Verify hash works
        if bcrypt.checkpw(password.encode('utf-8'), fresh_hash):
            print("✅ Hash verification: PASSED")
        else:
            print("❌ Hash verification: FAILED")
            return False
        
        print()
        
        # Get user count
        total_users = db.users.count_documents({})
        print(f"👥 Found {total_users} users in Atlas")
        print()
        
        # Update ALL users
        print("🔄 Updating ALL users in Atlas...")
        result = db.users.update_many(
            {},  # All documents
            {
                "$set": {
                    "password": hash_str  # STRING format
                }
            }
        )
        
        print(f"✅ Updated {result.modified_count} users")
        print()
        
        # Verify specific users
        print("=" * 80)
        print("🧪 VERIFICATION")
        print("=" * 80)
        print()
        
        test_emails = [
            "test@example.com",
            "admin@example.com",
            "sarah.johnson@techcorp.com",
            "jobseeker.test1761031385@example.com"
        ]
        
        for email in test_emails:
            user = db.users.find_one({"email": email})
            if user:
                pwd = user.get('password')
                pwd_type = type(pwd).__name__
                
                if isinstance(pwd, bytes):
                    pwd_str = pwd.decode('utf-8')
                    first_20 = pwd_str[:20]
                elif isinstance(pwd, str):
                    first_20 = pwd[:20]
                else:
                    first_20 = "ERROR"
                
                print(f"{'✅' if pwd_type == 'str' else '⚠️ '} {email}")
                print(f"   Type: {pwd_type}")
                print(f"   First 20: {first_20}")
                
                # Test password
                try:
                    if isinstance(pwd, str):
                        test_result = bcrypt.checkpw(password.encode('utf-8'), pwd.encode('utf-8'))
                    elif isinstance(pwd, bytes):
                        test_result = bcrypt.checkpw(password.encode('utf-8'), pwd)
                    else:
                        test_result = False
                    
                    print(f"   Password test: {'✅ PASS' if test_result else '❌ FAIL'}")
                except Exception as e:
                    print(f"   Error: {e}")
                print()
        
        print("=" * 80)
        print("✅ ATLAS PASSWORDS UPDATED!")
        print("=" * 80)
        print()
        print(f"All {total_users} users in ATLAS now have password: {password}")
        print()
        print("🔄 RESTART BACKEND:")
        print("   The backend should pick up these changes immediately")
        print("   (or within a few seconds)")
        print()
        print("🧪 TEST LOGIN:")
        print("   Email: test@example.com")
        print("   Password: Test@123")
        print("   Should work now! 🎉")
        print()
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    fix_atlas_passwords()

