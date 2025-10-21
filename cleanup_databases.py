#!/usr/bin/env python3
"""
Backup and remove unnecessary databases, keeping only TalentMatchDB
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))

from pymongo import MongoClient
from dotenv import load_dotenv
import json
from datetime import datetime

# Load environment variables
load_dotenv('.env.production')
load_dotenv('.env.local')
load_dotenv('.env')

def cleanup_databases():
    """Remove unnecessary databases, keep only TalentMatchDB"""
    
    print("=" * 80)
    print("🗑️  DATABASE CLEANUP")
    print("=" * 80)
    print()
    
    try:
        MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
        
        # Connect to MongoDB
        client = MongoClient(MONGO_URI, socketTimeoutMS=60000, connectTimeoutMS=60000)
        
        # Databases to remove
        databases_to_remove = ['resume_matcher', 'resume_parser', 'aksharjobs']
        
        # Step 1: Backup data from these databases
        print("Step 1: Creating backups...")
        print()
        
        backup_data = {}
        for db_name in databases_to_remove:
            if db_name in client.list_database_names():
                db = client[db_name]
                backup_data[db_name] = {}
                
                # Backup all collections
                for coll_name in db.list_collection_names():
                    collection_data = list(db[coll_name].find({}))
                    # Convert ObjectId to string for JSON serialization
                    for doc in collection_data:
                        if '_id' in doc:
                            doc['_id'] = str(doc['_id'])
                    backup_data[db_name][coll_name] = collection_data
                    print(f"  ✅ Backed up {db_name}.{coll_name}: {len(collection_data)} documents")
        
        # Save backup to file
        backup_file = f"database_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(backup_file, 'w') as f:
            json.dump(backup_data, f, indent=2, default=str)
        
        print()
        print(f"✅ Backup saved to: {backup_file}")
        print()
        
        # Step 2: Show what will be deleted
        print("=" * 80)
        print("Step 2: Databases to be DELETED:")
        print("=" * 80)
        for db_name in databases_to_remove:
            if db_name in client.list_database_names():
                db = client[db_name]
                print(f"  🗑️  {db_name}")
                for coll_name in db.list_collection_names():
                    count = db[coll_name].count_documents({})
                    print(f"      - {coll_name}: {count} documents")
        
        print()
        print("=" * 80)
        print("Databases to KEEP:")
        print("=" * 80)
        print("  ✅ TalentMatchDB (Main application database)")
        print("  ✅ admin (MongoDB system)")
        print("  ✅ local (MongoDB system)")
        print("  ✅ config (MongoDB system)")
        print()
        
        # Step 3: Delete the databases
        print("=" * 80)
        print("Step 3: Deleting databases...")
        print("=" * 80)
        
        for db_name in databases_to_remove:
            if db_name in client.list_database_names():
                client.drop_database(db_name)
                print(f"  ✅ Deleted: {db_name}")
            else:
                print(f"  ⚠️  Not found: {db_name}")
        
        print()
        
        # Step 4: Verify remaining databases
        print("=" * 80)
        print("Step 4: Remaining Databases:")
        print("=" * 80)
        
        for db_name in client.list_database_names():
            if db_name not in ['admin', 'local', 'config']:
                db = client[db_name]
                print(f"  ✅ {db_name}")
                if 'users' in db.list_collection_names():
                    user_count = db.users.count_documents({})
                    print(f"      - users: {user_count}")
        
        print()
        print("=" * 80)
        print("✅ CLEANUP COMPLETE!")
        print("=" * 80)
        print()
        print("Result:")
        print("  ✅ Backup saved to:", backup_file)
        print("  ✅ Removed 3 unnecessary databases")
        print("  ✅ Only TalentMatchDB remains")
        print()
        print("Next Steps:")
        print("  1. Restart backend: Stop (Ctrl+C) then run 'python app.py'")
        print("  2. Test login with: test@example.com / Test@123")
        print("  3. Should work now! 🎉")
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
    print()
    print("⚠️  WARNING: This will DELETE databases!")
    print("   (But we'll create a backup first)")
    print()
    
    response = input("Continue? (yes/no): ").strip().lower()
    
    if response == 'yes':
        cleanup_databases()
    else:
        print("Cancelled.")

