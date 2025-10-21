#!/usr/bin/env python3
"""
Debug a specific login attempt
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))

from pymongo import MongoClient
from dotenv import load_dotenv
import bcrypt
from bson import ObjectId

# Load environment variables
load_dotenv('.env.production')
load_dotenv('.env.local')
load_dotenv('.env')

def debug_login(email, password):
    """Debug a specific login attempt step by step"""
    
    print("=" * 80)
    print(f"🔍 DEBUGGING LOGIN FOR: {email}")
    print("=" * 80)
    print()
    
    try:
        # Get MongoDB URI and DB name from environment
        MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
        DB_NAME = os.getenv("DB_NAME", "TalentMatchDB")
        
        print(f"📚 Database: {DB_NAME}")
        print()
        
        # Connect to MongoDB
        client = MongoClient(MONGO_URI, socketTimeoutMS=60000, connectTimeoutMS=60000)
        db = client[DB_NAME]
        
        # Step 1: Find user
        print("Step 1: Finding user by email...")
        user = db.users.find_one({"email": email})
        
        if not user:
            print(f"❌ User not found with email: {email}")
            print()
            print("Checking for similar emails (case-insensitive):")
            similar = db.users.find({"email": {"$regex": f"^{email}$", "$options": "i"}})
            for u in similar:
                print(f"   Found: {u.get('email')}")
            return False
        
        print(f"✅ User found!")
        print(f"   ID: {user['_id']}")
        print(f"   Name: {user.get('firstName', '')} {user.get('lastName', '')}")
        print(f"   Type: {user.get('userType', 'N/A')}")
        print()
        
        # Step 2: Check password
        print("Step 2: Checking password...")
        stored_password = user.get('password')
        
        if not stored_password:
            print(f"❌ No password set for this user!")
            return False
        
        print(f"   Password type: {type(stored_password).__name__}")
        
        if isinstance(stored_password, str):
            print(f"   Password length: {len(stored_password)}")
            print(f"   First 10 chars: {stored_password[:10]}")
            
            if stored_password.startswith('$2'):
                print(f"   Format: bcrypt")
                try:
                    if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
                        print(f"   ✅ Password matches!")
                    else:
                        print(f"   ❌ Password does NOT match!")
                        return False
                except Exception as e:
                    print(f"   ❌ Error checking password: {e}")
                    return False
            elif stored_password.startswith('scrypt:'):
                print(f"   Format: werkzeug scrypt")
                from werkzeug.security import check_password_hash
                if check_password_hash(stored_password, password):
                    print(f"   ✅ Password matches!")
                else:
                    print(f"   ❌ Password does NOT match!")
                    return False
            else:
                print(f"   ❌ Unknown password format: {stored_password[:50]}")
                return False
        elif isinstance(stored_password, bytes):
            print(f"   Format: bytes (bcrypt)")
            try:
                if bcrypt.checkpw(password.encode('utf-8'), stored_password):
                    print(f"   ✅ Password matches!")
                else:
                    print(f"   ❌ Password does NOT match!")
                    return False
            except Exception as e:
                print(f"   ❌ Error checking password: {e}")
                return False
        else:
            print(f"   ❌ Invalid password type: {type(stored_password)}")
            return False
        
        print()
        
        # Step 3: Generate token (simulate)
        print("Step 3: Would generate JWT token")
        print(f"   User ID for token: {str(user['_id'])}")
        print()
        
        # Step 4: Role mapping
        print("Step 4: Role mapping")
        user_type = user.get('userType', 'unknown')
        role_mapping = {
            "job_seeker": "jobSeeker",
            "recruiter": "recruiter",
            "intern": "intern",
            "admin": "admin",
            "jobSeeker": "jobSeeker"  # Already in correct format
        }
        mapped_role = role_mapping.get(user_type, user_type)
        print(f"   DB userType: {user_type}")
        print(f"   Mapped role: {mapped_role}")
        print()
        
        print("=" * 80)
        print("✅ LOGIN WOULD SUCCEED!")
        print("=" * 80)
        print()
        print("Response would include:")
        print(f"   - token: <JWT_TOKEN>")
        print(f"   - role: {mapped_role}")
        print(f"   - userId: {str(user['_id'])}")
        print(f"   - firstName: {user.get('firstName', '')}")
        print(f"   - lastName: {user.get('lastName', '')}")
        print(f"   - email: {user.get('email', '')}")
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
    # Test with known credentials
    test_cases = [
        ("admin@example.com", "Test@123"),
        ("test@example.com", "Test@123"),
        ("sarah.johnson@techcorp.com", "Test@123"),
    ]
    
    for email, password in test_cases:
        debug_login(email, password)
        print("\n")

