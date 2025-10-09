#!/usr/bin/env python3
"""
Check users in database
"""

from utils.db import get_db

def check_users():
    """Check users in database"""
    try:
        print("🔍 Checking users in database...")
        
        # Get database connection
        db = get_db()
        if db is None:
            print("❌ Failed to connect to database")
            return
            
        users = db["users"]
        
        # Find users with email containing "kalpit"
        users_with_kalpit = list(users.find({"email": {"$regex": "kalpit", "$options": "i"}}))
        
        print(f"📊 Found {len(users_with_kalpit)} users with 'kalpit' in email:")
        
        for user in users_with_kalpit:
            print(f"  📧 Email: {user['email']}")
            print(f"  🆔 ID: {str(user['_id'])}")
            print(f"  👤 Name: {user.get('firstName', '')} {user.get('lastName', '')}")
            print(f"  🏷️ Type: {user.get('userType', 'Unknown')}")
            print(f"  📅 Created: {user.get('createdAt', 'Unknown')}")
            print("  ---")
            
        # Also check total user count
        total_users = users.count_documents({})
        print(f"\n📊 Total users in database: {total_users}")
        
        # Show recent users
        recent_users = list(users.find({}).sort("createdAt", -1).limit(5))
        print(f"\n📅 Recent 5 users:")
        
        for user in recent_users:
            print(f"  📧 {user['email']} - {user.get('firstName', '')} {user.get('lastName', '')}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_users()