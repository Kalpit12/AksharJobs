#!/usr/bin/env python3
"""
Fix passwords that are stored as bytes instead of strings
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

def fix_bytes_passwords():
    """Convert bytes passwords to proper string format"""
    
    print("=" * 80)
    print("🔧 FIXING BYTES FORMAT PASSWORDS")
    print("=" * 80)
    print()
    
    try:
        MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
        DB_NAME = os.getenv("DB_NAME", "TalentMatchDB")
        
        client = MongoClient(MONGO_URI, socketTimeoutMS=60000, connectTimeoutMS=60000)
        db = client[DB_NAME]
        
        # Get all users
        all_users = list(db.users.find({}))
        
        print(f"Found {len(all_users)} users")
        print()
        
        # Generate ONE fresh password hash for ALL users
        password = "Test@123"
        fresh_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=12))
        fresh_hash_str = fresh_hash.decode('utf-8')  # Convert to STRING
        
        print(f"New password: {password}")
        print(f"New hash (string): {fresh_hash_str[:50]}...")
        print()
        
        # Verify the hash works
        if bcrypt.checkpw(password.encode('utf-8'), fresh_hash_str.encode('utf-8')):
            print("✅ Hash verification: PASSED")
        else:
            print("❌ Hash verification: FAILED")
            return False
        
        print()
        print("Updating all users...")
        print()
        
        bytes_count = 0
        string_count = 0
        updated = 0
        
        for user in all_users:
            email = user.get('email')
            user_id = user.get('_id')
            stored_pwd = user.get('password')
            
            if stored_pwd is None:
                print(f"⚠️  {email} - No password")
                continue
            
            pwd_type = type(stored_pwd).__name__
            
            if isinstance(stored_pwd, bytes):
                bytes_count += 1
                print(f"🔄 {email} - Converting from BYTES to STRING")
            elif isinstance(stored_pwd, str):
                string_count += 1
                print(f"🔄 {email} - Updating STRING")
            
            # Update with STRING format password
            result = db.users.update_one(
                {'_id': user_id},
                {
                    '$set': {
                        'password': fresh_hash_str,  # STRING, not bytes!
                        'password_format': 'bcrypt_string',
                        'password_updated_at': datetime.utcnow()
                    }
                }
            )
            
            if result.modified_count > 0:
                updated += 1
        
        print()
        print("=" * 80)
        print("✅ PASSWORD FIX COMPLETE!")
        print("=" * 80)
        print(f"Users with BYTES passwords: {bytes_count}")
        print(f"Users with STRING passwords: {string_count}")
        print(f"Total updated: {updated}")
        print()
        print(f"All passwords now: {password}")
        print(f"All passwords are now STRINGS (not bytes)")
        print()
        
        # Verify specific users
        print("=" * 80)
        print("🧪 VERIFICATION")
        print("=" * 80)
        
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
                
                # Test the password
                try:
                    if isinstance(pwd, str):
                        test_result = bcrypt.checkpw(password.encode('utf-8'), pwd.encode('utf-8'))
                    elif isinstance(pwd, bytes):
                        test_result = bcrypt.checkpw(password.encode('utf-8'), pwd)
                    else:
                        test_result = False
                    
                    status = "✅ PASS" if test_result else "❌ FAIL"
                    print(f"{status} {email} - Type: {pwd_type}")
                except Exception as e:
                    print(f"❌ ERROR {email} - {e}")
        
        print()
        print("=" * 80)
        print("🔄 RESTART BACKEND NOW!")
        print("=" * 80)
        print("1. Stop backend (Ctrl+C)")
        print("2. Start: cd backend && python app.py")
        print("3. Test login with ANY user / Test@123")
        print()
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    fix_bytes_passwords()

