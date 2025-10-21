#!/usr/bin/env python3
"""
FINAL fix for Atlas passwords
"""

from pymongo import MongoClient
import bcrypt

# Direct connection to Atlas (from backend logs)
ATLAS_URI = "mongodb+srv://akshar_admin:WDQW9zihOVlhkExy@cluster0.lkow2ar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "TalentMatchDB"

print("=" * 80)
print("☁️  FIXING ATLAS PASSWORDS - FINAL ATTEMPT")
print("=" * 80)
print()

try:
    print(f"🔌 Connecting to Atlas...")
    print(f"📚 Database: {DB_NAME}")
    print()
    
    # Connect
    client = MongoClient(ATLAS_URI, socketTimeoutMS=60000, connectTimeoutMS=60000)
    db = client[DB_NAME]
    
    # Test
    db.command('ping')
    print("✅ Connected!")
    print()
    
    # Password
    password = "Test@123"
    fresh_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=12))
    hash_str = fresh_hash.decode('utf-8')
    
    print(f"🔑 Password: {password}")
    print(f"   Hash: {hash_str[:50]}...")
    print()
    
    # Update
    total = db.users.count_documents({})
    print(f"👥 Updating {total} users...")
    
    result = db.users.update_many({}, {"$set": {"password": hash_str}})
    print(f"✅ Updated: {result.modified_count}")
    print()
    
    # Verify
    print("🧪 Verification:")
    for email in ["test@example.com", "admin@example.com"]:
        user = db.users.find_one({"email": email})
        if user:
            pwd = user.get('password')
            test_ok = bcrypt.checkpw(password.encode('utf-8'), pwd.encode('utf-8') if isinstance(pwd, str) else pwd)
            print(f"{'✅' if test_ok else '❌'} {email} - Type: {type(pwd).__name__}")
    
    print()
    print("=" * 80)
    print("✅ DONE! Try login now!")
    print("=" * 80)
    
    client.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

