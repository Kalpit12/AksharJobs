#!/usr/bin/env python3
"""
Forcefully reset ALL passwords directly in MongoDB
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

def force_reset_passwords():
    """Forcefully reset ALL passwords"""
    
    print("=" * 80)
    print("🔨 FORCE RESETTING ALL PASSWORDS")
    print("=" * 80)
    print()
    
    try:
        MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
        DB_NAME = os.getenv("DB_NAME", "TalentMatchDB")
        
        # Create NEW MongoDB connection (not using cached one)
        client = MongoClient(MONGO_URI, socketTimeoutMS=60000, connectTimeoutMS=60000)
        db = client[DB_NAME]
        
        # Test connection
        db.command('ping')
        print("✅ Connected to MongoDB")
        print()
        
        # Generate ONE password hash for everyone
        password = "Test@123"
        fresh_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=12))
        
        # Store as STRING in MongoDB
        hash_str = fresh_hash.decode('utf-8')
        
        print(f"New password for ALL users: {password}")
        print(f"Hash (first 30 chars): {hash_str[:30]}...")
        print(f"Hash type: {type(hash_str)}")
        print()
        
        # Verify it works
        if bcrypt.checkpw(password.encode('utf-8'), fresh_hash):
            print("✅ Hash verification: PASSED")
        else:
            print("❌ Hash verification: FAILED")
            return False
        
        print()
        
        # Get current count
        total_users = db.users.count_documents({})
        print(f"Found {total_users} users in database")
        print()
        
        # Update ALL users - using update_many for efficiency
        print("Updating ALL users with new password...")
        result = db.users.update_many(
            {},  # Empty filter = all documents
            {
                "$set": {
                    "password": hash_str  # STRING format
                },
                "$unset": {
                    "password_updated_at": "",  # Remove old field
                    "password_format": "",  # Remove old field
                    "password_force_updated": ""  # Remove old field
                }
            }
        )
        
        print(f"✅ Updated {result.modified_count} users")
        print()
        
        # Verify the update worked
        print("=" * 80)
        print("🔍 VERIFICATION")
        print("=" * 80)
        
        test_emails = [
            "test@example.com",
            "admin@example.com",
            "sarah.johnson@techcorp.com",
            "jobseeker.test1761031385@example.com"
        ]
        
        for email in test_emails:
            user = db.users.find_one({"email": email}, {"_id": 1, "password": 1, "userType": 1})
            if user:
                pwd = user.get('password')
                pwd_type = type(pwd).__name__
                
                if isinstance(pwd, bytes):
                    pwd_decoded = pwd.decode('utf-8')
                    print(f"⚠️  {email} - Type: {pwd_type} (bytes!) - First 20: {pwd_decoded[:20]}")
                elif isinstance(pwd, str):
                    print(f"✅ {email} - Type: {pwd_type} (string) - First 20: {pwd[:20]}")
                    
                    # Test the password
                    try:
                        if bcrypt.checkpw(password.encode('utf-8'), pwd.encode('utf-8')):
                            print(f"   ✅ Password Test: PASS")
                        else:
                            print(f"   ❌ Password Test: FAIL")
                    except Exception as e:
                        print(f"   ❌ Error testing: {e}")
                else:
                    print(f"❌ {email} - Type: {pwd_type} (unknown!)")
                print()
        
        print("=" * 80)
        print("✅ PASSWORD RESET COMPLETE!")
        print("=" * 80)
        print()
        print(f"All {total_users} users now have password: {password}")
        print()
        print("🔄 RESTART BACKEND:")
        print("   1. Go to backend terminal")
        print("   2. Press Ctrl+C")
        print("   3. Run: python app.py")
        print("   4. Wait for 'MongoDB connected successfully'")
        print("   5. Test login!")
        print()
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    force_reset_passwords()

