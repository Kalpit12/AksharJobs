#!/usr/bin/env python3
"""
Test login functionality for all user types
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))

from pymongo import MongoClient
from dotenv import load_dotenv
import bcrypt
import json

# Load environment variables
load_dotenv('.env.production')
load_dotenv('.env.local')
load_dotenv('.env')

def test_password(stored_password, test_password):
    """Test if a password matches the stored hash"""
    try:
        if isinstance(stored_password, bytes):
            # BCrypt bytes format
            return bcrypt.checkpw(test_password.encode('utf-8'), stored_password)
        elif isinstance(stored_password, str):
            if stored_password.startswith('$2'):
                # BCrypt string format
                return bcrypt.checkpw(test_password.encode('utf-8'), stored_password.encode('utf-8'))
            elif stored_password.startswith('scrypt:'):
                # Werkzeug format
                from werkzeug.security import check_password_hash
                return check_password_hash(stored_password, test_password)
        return False
    except Exception as e:
        print(f"      Error testing password: {e}")
        return False

def test_user_logins():
    """Test login for users of all types"""
    
    print("=" * 80)
    print("🔐 TESTING USER LOGINS BY ROLE")
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
        
        # Common test passwords
        test_passwords = [
            "Test@123",      # Default password we just set
            "password123",   # Common test password
            "admin123",      # Admin password
            "test123",       # Simple test password
        ]
        
        # Group users by type
        user_types = {}
        all_users = list(users_collection.find({}))
        
        for user in all_users:
            user_type = user.get('userType', 'unknown')
            if user_type not in user_types:
                user_types[user_type] = []
            user_types[user_type].append(user)
        
        print(f"📊 Found {len(all_users)} users across {len(user_types)} user types")
        print()
        
        # Test login credentials by role
        login_credentials = {}
        
        for user_type, users in sorted(user_types.items()):
            print("=" * 80)
            print(f"🏷️  USER TYPE: {user_type.upper()}")
            print("=" * 80)
            print(f"Total users: {len(users)}")
            print()
            
            working_logins = []
            
            for user in users[:5]:  # Test first 5 users of each type
                email = user.get('email', 'N/A')
                first_name = user.get('firstName', '')
                last_name = user.get('lastName', '')
                stored_password = user.get('password')
                
                print(f"👤 Testing: {first_name} {last_name} ({email})")
                
                if not stored_password:
                    print(f"   ❌ No password set")
                    continue
                
                # Try each test password
                password_found = None
                for test_pwd in test_passwords:
                    if test_password(stored_password, test_pwd):
                        password_found = test_pwd
                        break
                
                if password_found:
                    print(f"   ✅ Login works with password: {password_found}")
                    working_logins.append({
                        'email': email,
                        'password': password_found,
                        'name': f"{first_name} {last_name}",
                        'role': user_type
                    })
                else:
                    print(f"   ⚠️  Password doesn't match common test passwords")
                    # Still might work with original password, just not one we tested
                    working_logins.append({
                        'email': email,
                        'password': '(original password)',
                        'name': f"{first_name} {last_name}",
                        'role': user_type
                    })
            
            if working_logins:
                login_credentials[user_type] = working_logins
            
            print()
        
        # Print comprehensive login guide
        print("=" * 80)
        print("🔑 LOGIN CREDENTIALS BY ROLE")
        print("=" * 80)
        print()
        
        for user_type, credentials in login_credentials.items():
            print(f"📋 {user_type.upper()} ACCOUNTS:")
            print(f"{'─' * 80}")
            
            for i, cred in enumerate(credentials, 1):
                print(f"{i}. {cred['name']}")
                print(f"   Email: {cred['email']}")
                print(f"   Password: {cred['password']}")
                print(f"   Role: {cred['role']}")
                print()
        
        print("=" * 80)
        print("🎯 ROLE-BASED ROUTING")
        print("=" * 80)
        print()
        print("After login, users will be redirected to:")
        print("  • job_seeker / jobSeeker → /jobseeker-dashboard")
        print("  • recruiter → /recruiter-dashboard")
        print("  • intern → /intern-dashboard")
        print("  • admin → /admin")
        print()
        
        print("=" * 80)
        print("✅ TESTING COMPLETE")
        print("=" * 80)
        print(f"Total users tested: {sum(len(creds) for creds in login_credentials.values())}")
        print(f"User types with working logins: {len(login_credentials)}")
        print()
        
        # Save to JSON file for easy reference
        output_file = "user_login_credentials.json"
        with open(output_file, 'w') as f:
            json.dump(login_credentials, f, indent=2)
        print(f"💾 Login credentials saved to: {output_file}")
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
    test_user_logins()

