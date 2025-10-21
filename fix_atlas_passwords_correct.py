#!/usr/bin/env python3
"""
Fix passwords in MongoDB ATLAS using backend's production config
"""

import sys
import os
from pymongo import MongoClient
import bcrypt

def fix_atlas_passwords():
    """Fix passwords in MongoDB Atlas"""
    
    print("=" * 80)
    print("☁️  FIXING PASSWORDS IN MONGODB ATLAS (PRODUCTION)")
    print("=" * 80)
    print()
    
    try:
        # Read backend's .env.production file
        env_file = 'backend/.env.production'
        
        if not os.path.exists(env_file):
            print(f"❌ File not found: {env_file}")
            return False
        
        # Parse .env file
        config = {}
        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    config[key] = value
        
        MONGO_URI = config.get('MONGO_URI')
        DB_NAME = config.get('DB_NAME', 'TalentMatchDB')
        
        if not MONGO_URI:
            print("❌ MONGO_URI not found in backend/.env.production")
            return False
        
        print(f"🔌 URI: {MONGO_URI[:50]}...")
        print(f"📚 Database: {DB_NAME}")
        print()
        
        # Connect to Atlas
        client = MongoClient(MONGO_URI, socketTimeoutMS=60000, connectTimeoutMS=60000)
        db = client[DB_NAME]
        
        # Test connection
        db.command('ping')
        print("✅ Connected to MongoDB Atlas!")
        print()
        
        # Generate password hash
        password = "Test@123"
        fresh_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=12))
        hash_str = fresh_hash.decode('utf-8')
        
        print(f"🔑 Password: {password}")
        print(f"   Hash: {hash_str[:50]}...")
        print()
        
        # Count users
        total = db.users.count_documents({})
        print(f"👥 Users in Atlas: {total}")
        print()
        
        # Update ALL users
        print("🔄 Updating ALL users...")
        result = db.users.update_many(
            {},
            {"$set": {"password": hash_str}}
        )
        
        print(f"✅ Updated: {result.modified_count}")
        print()
        
        # Verify
        print("=" * 80)
        print("🧪 VERIFICATION")
        print("=" * 80)
        
        for email in ["test@example.com", "admin@example.com", "sarah.johnson@techcorp.com"]:
            user = db.users.find_one({"email": email})
            if user:
                pwd = user.get('password')
                is_str = isinstance(pwd, str)
                first_20 = pwd[:20] if is_str else str(pwd.decode('utf-8') if isinstance(pwd, bytes) else pwd)[:20]
                
                # Test
                test_ok = False
                try:
                    if is_str:
                        test_ok = bcrypt.checkpw(password.encode('utf-8'), pwd.encode('utf-8'))
                    elif isinstance(pwd, bytes):
                        test_ok = bcrypt.checkpw(password.encode('utf-8'), pwd)
                except:
                    pass
                
                print(f"{'✅' if test_ok else '❌'} {email}")
                print(f"   Type: {type(pwd).__name__}, First 20: {first_20}")
        
        print()
        print("=" * 80)
        print("✅ DONE!")
        print("=" * 80)
        print(f"All {total} users: password = {password}")
        print()
        print("Backend should pick this up immediately (within seconds)")
        print("Try logging in now!")
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

