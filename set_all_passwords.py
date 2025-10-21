#!/usr/bin/env python3
"""
Set ALL user passwords to a known password for testing
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

def set_all_passwords():
    """Set all user passwords to a known password"""
    
    print("=" * 80)
    print("🔒 SETTING ALL USER PASSWORDS TO KNOWN PASSWORD")
    print("=" * 80)
    
    try:
        # Get MongoDB URI and DB name from environment
        MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
        DB_NAME = os.getenv("DB_NAME", "TalentMatchDB")
        
        print(f"🔌 Connecting to: {MONGO_URI.split('@')[-1] if '@' in MONGO_URI else MONGO_URI}")
        print(f"📚 Database: {DB_NAME}")
        print()
        
        # Connect to MongoDB
        client = MongoClient(MONGO_URI, socketTimeoutMS=60000, connectTimeoutMS=60000)
        db = client[DB_NAME]
        
        # Test connection
        db.command('ping')
        print("✅ Connected to MongoDB successfully!")
        print()
        
        # Get users collection
        users_collection = db['users']
        
        # Default password that will work for ALL users
        default_password = "Test@123"
        
        print("⚠️  WARNING: This will set ALL user passwords to the same password!")
        print(f"🔑 New password for ALL users: {default_password}")
        print()
        print("This allows you to login with ANY user account using this password.")
        print()
        
        # Hash the default password using bcrypt
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(default_password.encode('utf-8'), salt)
        
        # Get all users
        users = list(users_collection.find({}))
        
        print(f"👥 Found {len(users)} users")
        print()
        print("Updating passwords...")
        print()
        
        # Update ALL users with the same password
        updated_count = 0
        
        for user in users:
            user_id = user.get('_id')
            email = user.get('email', 'N/A')
            user_type = user.get('userType', 'unknown')
            name = f"{user.get('firstName', '')} {user.get('lastName', '')}"
            
            # Update password for this user
            result = users_collection.update_one(
                {'_id': user_id},
                {
                    '$set': {
                        'password': hashed_password.decode('utf-8'),
                        'password_reset_at': datetime.utcnow(),
                        'password_is_test': True  # Mark as test password
                    }
                }
            )
            
            if result.modified_count > 0:
                print(f"✅ Updated: {name} ({email}) - {user_type}")
                updated_count += 1
            else:
                print(f"⚠️  Already set: {name} ({email}) - {user_type}")
        
        print()
        print("=" * 80)
        print("✅ PASSWORD UPDATE COMPLETE!")
        print("=" * 80)
        print(f"Total users: {len(users)}")
        print(f"Passwords updated: {updated_count}")
        print()
        print("=" * 80)
        print("🔑 LOGIN WITH ANY USER")
        print("=" * 80)
        print(f"Password: {default_password}")
        print()
        print("You can now login with ANY of the following emails:")
        print()
        
        # Group by user type and show sample logins
        user_types = {}
        for user in users:
            user_type = user.get('userType', 'unknown')
            if user_type not in user_types:
                user_types[user_type] = []
            user_types[user_type].append(user)
        
        for user_type, type_users in sorted(user_types.items()):
            print(f"📋 {user_type.upper()} ACCOUNTS ({len(type_users)} total):")
            for user in type_users[:3]:  # Show first 3 of each type
                email = user.get('email', 'N/A')
                name = f"{user.get('firstName', '')} {user.get('lastName', '')}"
                print(f"   • {name} - {email}")
            if len(type_users) > 3:
                print(f"   ... and {len(type_users) - 3} more")
            print()
        
        print("=" * 80)
        print("🎯 TESTING INSTRUCTIONS")
        print("=" * 80)
        print()
        print("1. Go to: http://localhost:3003/login")
        print(f"2. Enter ANY email from the list above")
        print(f"3. Enter password: {default_password}")
        print("4. You'll be redirected based on your role:")
        print()
        print("   • Admin → /admin")
        print("   • Recruiter → /recruiter-dashboard")
        print("   • Job Seeker → /jobseeker-dashboard")
        print("   • Intern → /intern-dashboard")
        print()
        print("=" * 80)
        
        # Close connection
        client.close()
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    set_all_passwords()

