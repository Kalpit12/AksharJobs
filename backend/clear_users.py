"""
Script to clear all users from the database for fresh testing.
This will remove:
- All users
- All job seeker profiles
- All messages
- All applications
- All notifications
- All saved jobs

WARNING: This is irreversible! Use only for development/testing.
"""

import os
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

def clear_database():
    """Clear all user-related data from the database"""
    
    # Connect to MongoDB
    mongo_uri = os.getenv('MONGO_URI')
    
    if not mongo_uri:
        print("❌ Error: MONGO_URI not found in environment variables")
        return
    
    print("🔌 Connecting to MongoDB...")
    client = MongoClient(mongo_uri)
    db = client['AksharJobs']  # Your database name
    
    print("\n⚠️  WARNING: This will delete ALL user data from the database!")
    print("Collections to be cleared:")
    print("  - users")
    print("  - jobseekers")
    print("  - messages")
    print("  - applications")
    print("  - notifications")
    print("  - saved_jobs")
    print("  - application_tracking")
    
    confirmation = input("\n❓ Type 'YES DELETE ALL' to confirm: ")
    
    if confirmation != "YES DELETE ALL":
        print("❌ Operation cancelled. No data was deleted.")
        return
    
    print("\n🗑️  Starting cleanup...\n")
    
    try:
        # Count documents before deletion
        collections_to_clear = {
            'users': db.users,
            'jobseekers': db.jobseekers,
            'messages': db.messages,
            'applications': db.applications,
            'notifications': db.notifications,
            'saved_jobs': db.saved_jobs,
            'application_tracking': db.application_tracking
        }
        
        results = {}
        
        for collection_name, collection in collections_to_clear.items():
            count_before = collection.count_documents({})
            print(f"📊 {collection_name}: {count_before} documents found")
            
            if count_before > 0:
                result = collection.delete_many({})
                results[collection_name] = {
                    'before': count_before,
                    'deleted': result.deleted_count
                }
                print(f"   ✅ Deleted {result.deleted_count} documents")
            else:
                print(f"   ℹ️  Collection already empty")
        
        print("\n" + "="*60)
        print("✅ DATABASE CLEANUP COMPLETE!")
        print("="*60)
        
        print("\n📊 Summary:")
        total_deleted = 0
        for collection_name, stats in results.items():
            deleted = stats['deleted']
            total_deleted += deleted
            print(f"   {collection_name}: {deleted} deleted")
        
        print(f"\n🎯 Total documents deleted: {total_deleted}")
        print(f"⏰ Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        print("\n✨ Database is now clean and ready for fresh testing!")
        print("💡 You can now create new test users from scratch.")
        
    except Exception as e:
        print(f"\n❌ Error during cleanup: {e}")
        print("⚠️  Some data may have been partially deleted.")
    
    finally:
        client.close()
        print("\n🔌 Disconnected from MongoDB")

def clear_users_only():
    """Clear only users collection (keep everything else)"""
    
    mongo_uri = os.getenv('MONGO_URI')
    
    if not mongo_uri:
        print("❌ Error: MONGO_URI not found in environment variables")
        return
    
    print("🔌 Connecting to MongoDB...")
    client = MongoClient(mongo_uri)
    db = client['AksharJobs']
    
    print("\n⚠️  WARNING: This will delete ALL users!")
    print("Other data (jobs, etc.) will remain.")
    
    confirmation = input("\n❓ Type 'YES' to confirm: ")
    
    if confirmation != "YES":
        print("❌ Operation cancelled.")
        return
    
    try:
        count = db.users.count_documents({})
        print(f"\n📊 Found {count} users")
        
        if count > 0:
            result = db.users.delete_many({})
            print(f"✅ Deleted {result.deleted_count} users")
            
            # Also clear related jobseeker profiles
            profiles_count = db.jobseekers.count_documents({})
            if profiles_count > 0:
                profiles_result = db.jobseekers.delete_many({})
                print(f"✅ Deleted {profiles_result.deleted_count} jobseeker profiles")
        else:
            print("ℹ️  No users found to delete")
        
        print("\n✅ Users cleared successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    print("="*60)
    print("🗑️  DATABASE CLEANUP UTILITY")
    print("="*60)
    print("\nChoose an option:")
    print("1. Clear ALL user-related data (recommended for fresh start)")
    print("2. Clear ONLY users (keep messages, applications, etc.)")
    print("3. Cancel")
    
    choice = input("\nEnter choice (1-3): ").strip()
    
    if choice == "1":
        clear_database()
    elif choice == "2":
        clear_users_only()
    else:
        print("❌ Operation cancelled")

