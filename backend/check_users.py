#!/usr/bin/env python3
"""
Script to check users in the database and verify collections.
"""

from pymongo import MongoClient

def check_users():
    """Check users in the database"""
    
    try:
        client = MongoClient('mongodb://localhost:27017/')
        db = client['resume_matcher']
        
        print("✅ Connected to MongoDB successfully!")
        print(f"📊 Database: {db.name}")
        
        # List all collections
        collections = db.list_collection_names()
        print(f"\n📁 Collections found: {collections}")
        
        # Check users collection
        if 'users' in collections:
            users_collection = db['users']
            user_count = users_collection.count_documents({})
            print(f"\n👥 Users collection has {user_count} users")
            
            # Show all users
            users = list(users_collection.find({}, {
                'email': 1, 'firstName': 1, 'lastName': 1, 'userType': 1, 'is_verified': 1, 'is_active': 1, '_id': 0
            }))
            
            if users:
                print("\n📋 Users found:")
                for user in users:
                    print(f"  - {user.get('firstName', 'N/A')} {user.get('lastName', 'N/A')} ({user.get('email', 'N/A')}) - {user.get('userType', 'N/A')}")
            else:
                print("❌ No users found in users collection")
        else:
            print("❌ No 'users' collection found")
            
        # Check if there are other user-related collections
        user_collections = [col for col in collections if 'user' in col.lower()]
        if user_collections:
            print(f"\n🔍 Other user-related collections: {user_collections}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    print("🔍 Checking Database Users...")
    print("=" * 50)
    check_users()
