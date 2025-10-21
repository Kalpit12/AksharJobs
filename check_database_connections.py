#!/usr/bin/env python3
"""
Check if there are multiple databases or collections
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))

from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.production')
load_dotenv('.env.local')
load_dotenv('.env')

def check_databases():
    """Check all databases and collections"""
    
    print("=" * 80)
    print("🔍 CHECKING DATABASE CONNECTIONS")
    print("=" * 80)
    print()
    
    try:
        # Get MongoDB URI
        MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
        DB_NAME = os.getenv("DB_NAME", "TalentMatchDB")
        
        print(f"Environment Variables:")
        print(f"  MONGO_URI: {MONGO_URI}")
        print(f"  DB_NAME: {DB_NAME}")
        print()
        
        # Connect to MongoDB
        client = MongoClient(MONGO_URI, socketTimeoutMS=60000, connectTimeoutMS=60000)
        
        # List all databases
        print("All Databases:")
        for db_name in client.list_database_names():
            print(f"  - {db_name}")
        print()
        
        # Check the main database
        db = client[DB_NAME]
        print(f"Collections in '{DB_NAME}':")
        for coll_name in db.list_collection_names():
            count = db[coll_name].count_documents({})
            print(f"  - {coll_name}: {count} documents")
        print()
        
        # Check if there's a 'users' collection in other databases
        print("Checking for 'users' collections in other databases:")
        for db_name in client.list_database_names():
            if db_name not in ['admin', 'local', 'config']:
                other_db = client[db_name]
                if 'users' in other_db.list_collection_names():
                    user_count = other_db.users.count_documents({})
                    print(f"  - {db_name}.users: {user_count} users")
                    
                    # Check for our test users
                    test_user = other_db.users.find_one({"email": "test@example.com"})
                    if test_user:
                        print(f"    ⚠️ Found test@example.com in {db_name}!")
        print()
        
        # Check the specific users in TalentMatchDB
        print(f"Users in {DB_NAME}.users:")
        for email in ["test@example.com", "admin@example.com", "sarah.johnson@techcorp.com"]:
            user = db.users.find_one({"email": email})
            if user:
                pwd = user.get('password', '')
                print(f"  ✅ {email}")
                print(f"     Type: {user.get('userType')}")
                print(f"     Password: {pwd[:30]}...")
            else:
                print(f"  ❌ {email} NOT FOUND")
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
    check_databases()

