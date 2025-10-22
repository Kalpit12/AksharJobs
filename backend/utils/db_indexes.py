"""
Database Indexes for Performance Optimization

This module creates indexes on frequently queried fields to speed up database operations.
"""

from utils.db import get_db
from pymongo import ASCENDING, DESCENDING

def create_indexes():
    """Create indexes on collections for better performance"""
    try:
        db = get_db()
        if db is None:
            print("❌ Cannot create indexes - database connection failed")
            return False
        
        print("🔧 Creating database indexes for performance...")
        
        # Users collection indexes
        users = db.users
        try:
            users.create_index([("email", ASCENDING)], unique=True)
        except Exception as e:
            print(f"⚠️ Warning: Could not create unique email index: {e}")
            print("This is likely due to users with empty email fields. Continuing...")
        users.create_index([("_id", ASCENDING)])
        users.create_index([("userType", ASCENDING)])
        users.create_index([("createdAt", DESCENDING)])
        print("✅ Users collection indexes created")
        
        # Jobseeker profiles collection indexes
        jobseeker_profiles = db.jobseeker_profiles
        jobseeker_profiles.create_index([("userId", ASCENDING)], unique=True)
        jobseeker_profiles.create_index([("personalInfo.email", ASCENDING)])
        jobseeker_profiles.create_index([("createdAt", DESCENDING)])
        jobseeker_profiles.create_index([("updatedAt", DESCENDING)])
        print("✅ Jobseeker profiles collection indexes created")
        
        # Notifications collection indexes
        notifications = db.notifications
        notifications.create_index([("user_id", ASCENDING)])
        notifications.create_index([("is_read", ASCENDING)])
        notifications.create_index([("created_at", DESCENDING)])
        notifications.create_index([("user_id", ASCENDING), ("is_read", ASCENDING)])
        print("✅ Notifications collection indexes created")
        
        # Messages collection indexes
        messages = db.messages
        messages.create_index([("recipient_id", ASCENDING)])
        messages.create_index([("sender_id", ASCENDING)])
        messages.create_index([("is_read", ASCENDING)])
        messages.create_index([("created_at", DESCENDING)])
        messages.create_index([("recipient_id", ASCENDING), ("is_read", ASCENDING)])
        print("✅ Messages collection indexes created")
        
        # Jobs collection indexes
        jobs = db.jobs
        jobs.create_index([("createdAt", DESCENDING)])
        jobs.create_index([("status", ASCENDING)])
        jobs.create_index([("recruiterId", ASCENDING)])
        jobs.create_index([("title", ASCENDING)])
        print("✅ Jobs collection indexes created")
        
        # Applications collection indexes
        applications = db.applications
        applications.create_index([("jobId", ASCENDING)])
        applications.create_index([("jobseekerId", ASCENDING)])
        applications.create_index([("status", ASCENDING)])
        applications.create_index([("appliedAt", DESCENDING)])
        applications.create_index([("jobseekerId", ASCENDING), ("jobId", ASCENDING)], unique=True)
        print("✅ Applications collection indexes created")
        
        print("🎉 All database indexes created successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error creating indexes: {e}")
        import traceback
        traceback.print_exc()
        return False

def list_indexes():
    """List all indexes on collections"""
    try:
        db = get_db()
        if db is None:
            print("❌ Cannot list indexes - database connection failed")
            return
        
        collections = ['users', 'jobseeker_profiles', 'notifications', 'messages', 'jobs', 'applications']
        
        print("\n📋 Current Database Indexes:")
        print("=" * 60)
        
        for collection_name in collections:
            collection = db[collection_name]
            indexes = collection.index_information()
            
            print(f"\n📁 {collection_name}:")
            for index_name, index_info in indexes.items():
                keys = index_info.get('key', [])
                unique = index_info.get('unique', False)
                print(f"  ├─ {index_name}: {keys} {'(UNIQUE)' if unique else ''}")
        
        print("\n" + "=" * 60)
        
    except Exception as e:
        print(f"❌ Error listing indexes: {e}")

if __name__ == "__main__":
    print("🚀 Database Index Management")
    print("=" * 60)
    
    # Create indexes
    create_indexes()
    
    # List all indexes
    list_indexes()

