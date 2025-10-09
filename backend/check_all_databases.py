#!/usr/bin/env python3
"""
Check all databases and collections
"""

from pymongo import MongoClient
import os

def check_all_databases():
    """Check all databases and collections"""
    try:
        print("🔍 Checking all databases...")
        
        # Connect to MongoDB
        client = MongoClient('mongodb://localhost:27017/')
        
        # List all databases
        db_list = client.list_database_names()
        print(f"📊 Found {len(db_list)} databases:")
        
        for db_name in db_list:
            print(f"  📁 {db_name}")
            
            # Skip system databases
            if db_name in ['admin', 'config', 'local']:
                continue
                
            db = client[db_name]
            collections = db.list_collection_names()
            
            print(f"    Collections: {collections}")
            
            # Check for users collection
            if 'users' in collections:
                users_count = db.users.count_documents({})
                print(f"    👥 Users: {users_count}")
                
                # Check for kalpit user
                kalpit_users = list(db.users.find({"email": {"$regex": "kalpit", "$options": "i"}}))
                if kalpit_users:
                    print(f"    🎯 Found Kalpit users:")
                    for user in kalpit_users:
                        print(f"      📧 {user['email']} - {user.get('firstName', '')} {user.get('lastName', '')}")
            
            print()
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_all_databases()
