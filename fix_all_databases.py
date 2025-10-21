#!/usr/bin/env python3
"""
Update passwords in ALL databases that have users
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

def fix_all_databases():
    """Update passwords in ALL databases"""
    
    print("=" * 80)
    print("🔄 FIXING PASSWORDS IN ALL DATABASES")
    print("=" * 80)
    print()
    
    try:
        MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
        
        # Connect to MongoDB
        client = MongoClient(MONGO_URI, socketTimeoutMS=60000, connectTimeoutMS=60000)
        
        # Generate fresh password hash
        password = "Test@123"
        fresh_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=12))
        fresh_hash_str = fresh_hash.decode('utf-8')
        
        print(f"Password: {password}")
        print(f"Hash: {fresh_hash_str[:50]}...")
        print()
        
        # Find all databases with 'users' collections
        databases_with_users = []
        for db_name in client.list_database_names():
            if db_name not in ['admin', 'local', 'config']:
                db = client[db_name]
                if 'users' in db.list_collection_names():
                    user_count = db.users.count_documents({})
                    databases_with_users.append((db_name, user_count))
        
        print(f"Found {len(databases_with_users)} databases with users:")
        for db_name, count in databases_with_users:
            print(f"  - {db_name}: {count} users")
        print()
        
        # Update passwords in ALL these databases
        for db_name, count in databases_with_users:
            print(f"Updating {db_name}...")
            db = client[db_name]
            
            result = db.users.update_many(
                {},
                {
                    '$set': {
                        'password': fresh_hash_str,
                        'password_updated_at': datetime.utcnow(),
                        'all_db_fix': True
                    }
                }
            )
            
            print(f"  ✅ Updated {result.modified_count} users in {db_name}")
        
        print()
        print("=" * 80)
        print("✅ ALL DATABASES UPDATED!")
        print("=" * 80)
        print()
        print(f"Password for ALL users in ALL databases: {password}")
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
    fix_all_databases()

