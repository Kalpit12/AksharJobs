#!/usr/bin/env python3
"""
Verify specific users that are failing
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

def verify_specific_users():
    """Verify the exact users that are failing"""
    
    print("=" * 80)
    print("🔍 VERIFYING SPECIFIC FAILING USERS")
    print("=" * 80)
    print()
    
    try:
        # Get MongoDB URI and DB name from environment
        MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
        DB_NAME = os.getenv("DB_NAME", "TalentMatchDB")
        
        # Connect to MongoDB
        client = MongoClient(MONGO_URI, socketTimeoutMS=60000, connectTimeoutMS=60000)
        db = client[DB_NAME]
        
        # Users to check
        test_users = [
            "test@example.com",  # FAILING
            "admin@example.com",  # FAILING
            "sarah.johnson@techcorp.com",  # WORKING
        ]
        
        test_password = "Test@123"
        
        print("Checking these specific users:")
        print()
        
        for email in test_users:
            print(f"📧 {email}")
            print("-" * 80)
            
            user = db.users.find_one({"email": email})
            
            if not user:
                print("❌ User NOT found in database!")
                print()
                continue
            
            stored_password = user.get('password')
            
            print(f"User Type: {user.get('userType')}")
            print(f"Password Type: {type(stored_password).__name__}")
            print(f"Password Length: {len(stored_password) if stored_password else 0}")
            
            if isinstance(stored_password, str):
                print(f"Password First 20 chars: {stored_password[:20]}")
                print(f"Password Last 20 chars: {stored_password[-20:]}")
                
                # Test the password
                try:
                    if stored_password.startswith('$2'):
                        result = bcrypt.checkpw(test_password.encode('utf-8'), stored_password.encode('utf-8'))
                        print(f"BCrypt Test Result: {'✅ PASS' if result else '❌ FAIL'}")
                    else:
                        print(f"⚠️ Not a bcrypt hash!")
                except Exception as e:
                    print(f"❌ Error testing: {e}")
            elif isinstance(stored_password, bytes):
                print(f"Password First 20 bytes: {stored_password[:20]}")
                try:
                    result = bcrypt.checkpw(test_password.encode('utf-8'), stored_password)
                    print(f"BCrypt Test Result: {'✅ PASS' if result else '❌ FAIL'}")
                except Exception as e:
                    print(f"❌ Error testing: {e}")
            
            # Check if there's a password_reset_at field
            if 'password_reset_at' in user:
                print(f"Password was reset at: {user['password_reset_at']}")
            
            print()
        
        # Close connection
        client.close()
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    verify_specific_users()

