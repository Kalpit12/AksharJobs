#!/usr/bin/env python3
"""
Force update passwords with a fresh hash
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))

from pymongo import MongoClient
from dotenv import load_dotenv
import bcrypt
from datetime import datetime

# Load environment variables
load_dotenv('.env.production')
load_dotenv('.env.local')
load_dotenv('.env')

def force_update_passwords():
    """Force update with fresh password hash"""
    
    print("=" * 80)
    print("🔄 FORCE UPDATING PASSWORDS WITH FRESH HASH")
    print("=" * 80)
    print()
    
    try:
        # Get MongoDB URI and DB name from environment
        MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
        DB_NAME = os.getenv("DB_NAME", "TalentMatchDB")
        
        # Connect to MongoDB
        client = MongoClient(MONGO_URI, socketTimeoutMS=60000, connectTimeoutMS=60000)
        db = client[DB_NAME]
        
        users_collection = db['users']
        
        # Generate a FRESH bcrypt hash (will be different each time due to salt)
        password = "Test@123"
        fresh_salt = bcrypt.gensalt(rounds=12)
        fresh_hash = bcrypt.hashpw(password.encode('utf-8'), fresh_salt)
        fresh_hash_str = fresh_hash.decode('utf-8')
        
        print(f"Password: {password}")
        print(f"Fresh Hash: {fresh_hash_str[:50]}...")
        print()
        
        # Verify the fresh hash works
        print("Verifying fresh hash...")
        if bcrypt.checkpw(password.encode('utf-8'), fresh_hash):
            print("✅ Fresh hash verified!")
        else:
            print("❌ Fresh hash FAILED verification!")
            return False
        print()
        
        # Update ALL users with this fresh hash
        result = users_collection.update_many(
            {},  # Update ALL users
            {
                '$set': {
                    'password': fresh_hash_str,
                    'password_updated_at': datetime.utcnow(),
                    'password_force_updated': True
                }
            }
        )
        
        print(f"✅ Updated {result.modified_count} users")
        print()
        
        # Verify specific users
        print("Verifying specific users:")
        print()
        
        test_emails = ["test@example.com", "admin@example.com", "sarah.johnson@techcorp.com"]
        
        for email in test_emails:
            user = users_collection.find_one({"email": email})
            if user:
                stored_pwd = user.get('password')
                test_result = bcrypt.checkpw(password.encode('utf-8'), stored_pwd.encode('utf-8'))
                print(f"{'✅' if test_result else '❌'} {email} - {user.get('userType')}")
        
        print()
        print("=" * 80)
        print("✅ PASSWORDS FORCE UPDATED!")
        print("=" * 80)
        print()
        print("NOW RESTART THE BACKEND:")
        print("1. Find the backend terminal/window")
        print("2. Press Ctrl+C to stop it")
        print("3. Run: python app.py")
        print()
        print("Then try logging in with:")
        print(f"   Email: test@example.com")
        print(f"   Password: {password}")
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
    force_update_passwords()

