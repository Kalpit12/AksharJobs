#!/usr/bin/env python3
"""
Fix user passwords to ensure all users can login
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

def fix_user_passwords():
    """Ensure all users have valid passwords they can login with"""
    
    print("=" * 80)
    print("🔒 FIXING USER PASSWORDS")
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
        
        # Default password for test accounts
        default_password = "Test@123"
        
        print(f"🔑 Setting default password: {default_password}")
        print(f"   (Use this password to login to all test accounts)")
        print()
        
        # Hash the default password using bcrypt
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(default_password.encode('utf-8'), salt)
        
        # Get all users
        users = list(users_collection.find({}))
        
        print(f"👥 Processing {len(users)} users...")
        print()
        
        updated_count = 0
        already_valid_count = 0
        
        for user in users:
            user_id = user.get('_id')
            email = user.get('email', 'N/A')
            user_type = user.get('userType', 'unknown')
            stored_password = user.get('password')
            
            # Check if password exists and is valid
            needs_update = False
            
            if not stored_password:
                print(f"❌ {email} ({user_type}) - No password set")
                needs_update = True
            elif isinstance(stored_password, str):
                # Check if it's a bcrypt hash or werkzeug hash
                if stored_password.startswith('$2') or stored_password.startswith('scrypt:'):
                    print(f"✓ {email} ({user_type}) - Already has valid password")
                    already_valid_count += 1
                else:
                    print(f"⚠️  {email} ({user_type}) - Invalid password format")
                    needs_update = True
            elif isinstance(stored_password, bytes):
                print(f"✓ {email} ({user_type}) - Already has valid password (bytes)")
                already_valid_count += 1
            else:
                print(f"❌ {email} ({user_type}) - Invalid password type")
                needs_update = True
            
            # Update password if needed
            if needs_update:
                users_collection.update_one(
                    {'_id': user_id},
                    {
                        '$set': {
                            'password': hashed_password.decode('utf-8'),
                            'password_updated_at': datetime.utcnow()
                        }
                    }
                )
                print(f"   ✅ Password updated!")
                updated_count += 1
        
        print()
        print("=" * 80)
        print("📊 SUMMARY")
        print("=" * 80)
        print(f"✅ Users with valid passwords: {already_valid_count}")
        print(f"🔄 Passwords updated: {updated_count}")
        print(f"📝 Total users: {len(users)}")
        print()
        print("=" * 80)
        print("🔑 LOGIN CREDENTIALS")
        print("=" * 80)
        print(f"Password for ALL users: {default_password}")
        print()
        print("Note: Users who already had valid passwords will keep their original passwords.")
        print("Only users with invalid or missing passwords were updated.")
        print("=" * 80)
        
        # Close connection
        client.close()
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    fix_user_passwords()

