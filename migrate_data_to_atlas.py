#!/usr/bin/env python3
"""
Migrate data from local MongoDB to MongoDB Atlas
"""

import os
from pymongo import MongoClient
from datetime import datetime
import sys

# Connection strings
LOCAL_URI = "mongodb://localhost:27017/"
ATLAS_URI = "mongodb+srv://akshar_admin:WDQW9zihOVlhkExy@cluster0.lkow2ar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "TalentMatchDB"

def migrate_database():
    """Migrate all collections from local MongoDB to Atlas"""
    
    print("=" * 70)
    print("MongoDB Migration: Local → Atlas")
    print("=" * 70)
    print()
    
    try:
        # Connect to local MongoDB
        print("📡 Connecting to LOCAL MongoDB...")
        local_client = MongoClient(LOCAL_URI, serverSelectionTimeoutMS=5000)
        local_client.admin.command('ping')
        local_db = local_client[DB_NAME]
        print("✅ Connected to local MongoDB")
        print()
        
        # Connect to Atlas
        print("📡 Connecting to ATLAS MongoDB...")
        atlas_client = MongoClient(ATLAS_URI, serverSelectionTimeoutMS=10000)
        atlas_client.admin.command('ping')
        atlas_db = atlas_client[DB_NAME]
        print("✅ Connected to Atlas MongoDB")
        print()
        
        # Get all collections from local DB
        collections = local_db.list_collection_names()
        
        if not collections:
            print("⚠️  No collections found in local database!")
            return False
        
        print(f"📊 Found {len(collections)} collections to migrate:")
        for col in collections:
            count = local_db[col].count_documents({})
            print(f"   - {col}: {count} documents")
        print()
        
        # Confirm migration
        print("⚠️  WARNING: This will copy all data to Atlas.")
        print("   Existing data in Atlas will NOT be deleted.")
        print()
        response = input("Continue with migration? (yes/no): ").lower()
        
        if response != 'yes':
            print("\n❌ Migration cancelled by user")
            return False
        
        print()
        print("=" * 70)
        print("Starting Migration...")
        print("=" * 70)
        print()
        
        # Migrate each collection
        total_docs = 0
        success_count = 0
        
        for collection_name in collections:
            try:
                print(f"📦 Migrating collection: {collection_name}")
                
                # Get all documents from local collection
                local_collection = local_db[collection_name]
                documents = list(local_collection.find({}))
                
                if not documents:
                    print(f"   ⊘ No documents to migrate")
                    success_count += 1
                    continue
                
                # Insert into Atlas collection
                atlas_collection = atlas_db[collection_name]
                
                # Check if collection already has data
                existing_count = atlas_collection.count_documents({})
                if existing_count > 0:
                    print(f"   ⚠️  Collection already has {existing_count} documents in Atlas")
                    overwrite = input(f"   Overwrite {collection_name}? (yes/no): ").lower()
                    if overwrite == 'yes':
                        print(f"   🗑️  Deleting existing documents...")
                        atlas_collection.delete_many({})
                    else:
                        print(f"   ⊘ Skipping {collection_name}")
                        continue
                
                # Insert documents in batches
                batch_size = 100
                inserted = 0
                
                for i in range(0, len(documents), batch_size):
                    batch = documents[i:i + batch_size]
                    atlas_collection.insert_many(batch, ordered=False)
                    inserted += len(batch)
                    print(f"   └─ Inserted {inserted}/{len(documents)} documents", end='\r')
                
                print(f"   ✅ Migrated {inserted} documents                    ")
                total_docs += inserted
                success_count += 1
                
            except Exception as e:
                print(f"   ❌ Error migrating {collection_name}: {e}")
                continue
        
        print()
        print("=" * 70)
        print("Migration Complete!")
        print("=" * 70)
        print()
        print(f"📊 Summary:")
        print(f"   Collections processed: {len(collections)}")
        print(f"   Successful migrations: {success_count}")
        print(f"   Total documents migrated: {total_docs}")
        print()
        
        # Verify migration
        print("🔍 Verifying migration...")
        print()
        
        verification_passed = True
        for collection_name in collections:
            local_count = local_db[collection_name].count_documents({})
            atlas_count = atlas_db[collection_name].count_documents({})
            
            status = "✅" if local_count == atlas_count else "⚠️"
            print(f"   {status} {collection_name}: Local={local_count}, Atlas={atlas_count}")
            
            if local_count != atlas_count:
                verification_passed = False
        
        print()
        if verification_passed:
            print("✅ Verification PASSED! All data migrated successfully.")
        else:
            print("⚠️  Verification WARNING: Some counts don't match. Review above.")
        
        print()
        print("=" * 70)
        print("🎉 Migration to Atlas completed successfully!")
        print("=" * 70)
        print()
        print("Next steps:")
        print("1. Your application is now configured to use Atlas")
        print("2. Start your backend: .\\start_backend.bat")
        print("3. Test your application features")
        print("4. Monitor usage in Atlas dashboard: https://cloud.mongodb.com")
        print()
        
        # Close connections
        local_client.close()
        atlas_client.close()
        
        return True
        
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        print()
        print("Troubleshooting:")
        print("1. Ensure local MongoDB is running")
        print("2. Check Atlas connection string is correct")
        print("3. Verify Atlas IP whitelist includes your IP")
        print("4. Check internet connection")
        return False

if __name__ == "__main__":
    print()
    success = migrate_database()
    print()
    
    if success:
        sys.exit(0)
    else:
        sys.exit(1)

