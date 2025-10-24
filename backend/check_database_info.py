"""
Script to check MongoDB connection and list all databases and collections
"""

import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def check_databases():
    """List all databases and their collections"""
    
    mongo_uri = os.getenv('MONGO_URI')
    
    if not mongo_uri:
        print("❌ Error: MONGO_URI not found in environment variables")
        return
    
    print("🔌 Connecting to MongoDB Atlas...")
    print(f"📡 URI: {mongo_uri[:50]}...")
    
    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        
        # Test connection
        client.admin.command('ping')
        print("✅ Successfully connected to MongoDB Atlas!\n")
        
        # List all databases
        print("="*60)
        print("📊 DATABASES FOUND:")
        print("="*60)
        
        databases = client.list_database_names()
        
        for db_name in databases:
            if db_name in ['admin', 'local', 'config']:
                continue  # Skip system databases
            
            print(f"\n📁 Database: {db_name}")
            db = client[db_name]
            collections = db.list_collection_names()
            
            print(f"   Collections ({len(collections)}):")
            for collection_name in collections:
                count = db[collection_name].count_documents({})
                print(f"   - {collection_name}: {count} documents")
                
                # If it's users collection, show sample
                if collection_name == 'users' and count > 0:
                    sample_user = db[collection_name].find_one({}, {'email': 1, 'firstName': 1, 'lastName': 1, 'role': 1})
                    if sample_user:
                        print(f"     Sample: {sample_user.get('firstName', 'N/A')} {sample_user.get('lastName', 'N/A')} ({sample_user.get('email', 'N/A')})")
        
        print("\n" + "="*60)
        
        # Check what the app is using
        print("\n🔍 Checking app configuration...")
        
        # Try to extract database name from URI
        if 'mongodb+srv://' in mongo_uri or 'mongodb://' in mongo_uri:
            # Parse the database name from URI
            if '/' in mongo_uri.split('@')[-1]:
                db_from_uri = mongo_uri.split('@')[-1].split('/')[1].split('?')[0]
                print(f"📌 Database name from MONGO_URI: '{db_from_uri}'")
                
                # Check if this database exists
                if db_from_uri in databases:
                    print(f"✅ Database '{db_from_uri}' exists!")
                    db = client[db_from_uri]
                    
                    # Show user count
                    if 'users' in db.list_collection_names():
                        user_count = db.users.count_documents({})
                        print(f"👥 Users in '{db_from_uri}': {user_count}")
                    else:
                        print(f"⚠️  No 'users' collection found in '{db_from_uri}'")
                else:
                    print(f"⚠️  Database '{db_from_uri}' does NOT exist in Atlas!")
        
        print("\n💡 The clear_users.py script should use this database name!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()
        print("\n🔌 Disconnected from MongoDB")

if __name__ == "__main__":
    print("="*60)
    print("🔍 MONGODB DATABASE INSPECTOR")
    print("="*60)
    print()
    check_databases()

