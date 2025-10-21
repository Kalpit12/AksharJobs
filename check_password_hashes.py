#!/usr/bin/env python3
"""
Check password hash formats in the database
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

def check_password_hashes():
    """Check the format of password hashes"""
    
    print("=" * 80)
    print("🔍 CHECKING PASSWORD HASH FORMATS")
    print("=" * 80)
    
    try:
        # Get MongoDB URI and DB name from environment
        MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
        DB_NAME = os.getenv("DB_NAME", "TalentMatchDB")
        
        print(f"🔌 Connecting to: {MONGO_URI.split('@')[-1] if '@' in MONGO_URI else MONGO_URI}")
        print(f"📚 Database: {DB_NAME}")
        print()
        
        # Connect to MongoDB
        client = MongoClient(MONGO_URI, socketTimeoutMS=60000, connectTimeoutMS=60000)
        db = client[DB_NAME]
        
        # Test connection
        db.command('ping')
        print("✅ Connected to MongoDB successfully!")
        print()
        
        # Get users collection
        users_collection = db['users']
        
        # Test specific users
        test_emails = [
            "admin@example.com",
            "test@example.com", 
            "sarah.johnson@techcorp.com",
            "intern@test.com",
            "john.doe@example.com"
        ]
        
        test_password = "Test@123"
        
        print("Testing password verification for specific users:")
        print()
        
        for email in test_emails:
            user = users_collection.find_one({"email": email})
            
            if not user:
                print(f"❌ {email} - User not found")
                continue
            
            stored_password = user.get('password')
            user_type = user.get('userType', 'unknown')
            
            print(f"📧 {email} ({user_type})")
            print(f"   Password type: {type(stored_password).__name__}")
            
            if stored_password:
                if isinstance(stored_password, bytes):
                    print(f"   Format: bytes (length: {len(stored_password)})")
                    print(f"   First 50 chars: {stored_password[:50]}")
                    
                    # Test password
                    try:
                        if bcrypt.checkpw(test_password.encode('utf-8'), stored_password):
                            print(f"   ✅ Password 'Test@123' WORKS!")
                        else:
                            print(f"   ❌ Password 'Test@123' FAILS!")
                    except Exception as e:
                        print(f"   ❌ Error checking password: {e}")
                        
                elif isinstance(stored_password, str):
                    print(f"   Format: string (length: {len(stored_password)})")
                    print(f"   First 50 chars: {stored_password[:50]}")
                    
                    # Check format
                    if stored_password.startswith('$2'):
                        print(f"   Type: bcrypt (string)")
                        try:
                            if bcrypt.checkpw(test_password.encode('utf-8'), stored_password.encode('utf-8')):
                                print(f"   ✅ Password 'Test@123' WORKS!")
                            else:
                                print(f"   ❌ Password 'Test@123' FAILS!")
                        except Exception as e:
                            print(f"   ❌ Error checking password: {e}")
                    elif stored_password.startswith('scrypt:'):
                        print(f"   Type: werkzeug scrypt")
                        try:
                            from werkzeug.security import check_password_hash
                            if check_password_hash(stored_password, test_password):
                                print(f"   ✅ Password 'Test@123' WORKS!")
                            else:
                                print(f"   ❌ Password 'Test@123' FAILS!")
                        except Exception as e:
                            print(f"   ❌ Error checking password: {e}")
                    else:
                        print(f"   Type: unknown")
                else:
                    print(f"   Format: {type(stored_password)}")
            else:
                print(f"   ❌ No password set!")
            
            print()
        
        print("=" * 80)
        print("🔍 DIAGNOSIS")
        print("=" * 80)
        print()
        print("If some users can login and others can't, the issue is likely:")
        print("1. Password hashes are in different formats (bytes vs string)")
        print("2. The auth service may not handle all formats correctly")
        print("3. Some passwords weren't updated properly")
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
    check_password_hashes()

