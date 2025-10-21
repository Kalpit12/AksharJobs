#!/usr/bin/env python3
"""
Show all users in the database
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

def show_all_users():
    """Display all users in the database"""
    
    print("=" * 80)
    print("📊 DISPLAYING ALL USERS IN DATABASE")
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
        
        # Count total users
        total_users = users_collection.count_documents({})
        print(f"👥 Total Users: {total_users}")
        print()
        
        if total_users == 0:
            print("❌ No users found in the database")
            return
        
        # Get all users
        users = list(users_collection.find({}))
        
        # Count by user type
        user_types = {}
        for user in users:
            user_type = user.get('userType', 'unknown')
            user_types[user_type] = user_types.get(user_type, 0) + 1
        
        print("📊 User Types Distribution:")
        for user_type, count in user_types.items():
            print(f"   • {user_type}: {count}")
        print()
        
        # Display each user
        print("=" * 80)
        print("👤 USER DETAILS")
        print("=" * 80)
        
        for idx, user in enumerate(users, 1):
            print(f"\n{'─' * 80}")
            print(f"User #{idx}")
            print(f"{'─' * 80}")
            
            # Basic Information
            print(f"🆔 User ID: {user.get('_id')}")
            print(f"👤 Name: {user.get('firstName', '')} {user.get('lastName', '')}")
            print(f"📧 Email: {user.get('email', 'N/A')}")
            print(f"📱 Phone: {user.get('phoneNumber', 'N/A')}")
            print(f"🏷️  User Type: {user.get('userType', 'N/A')}")
            
            # LinkedIn & Company Info
            if user.get('linkedInProfile'):
                print(f"🔗 LinkedIn: {user.get('linkedInProfile')}")
            if user.get('companyName'):
                print(f"🏢 Company: {user.get('companyName')}")
            if user.get('companyWebsite'):
                print(f"🌐 Website: {user.get('companyWebsite')}")
            if user.get('location'):
                print(f"📍 Location: {user.get('location')}")
            
            # Community Information
            if user.get('communities'):
                print(f"👥 Communities: {', '.join(user.get('communities', []))}")
            if user.get('primary_community'):
                print(f"⭐ Primary Community: {user.get('primary_community')}")
            
            # Subscription & Coins
            subscription = user.get('subscription', {})
            if subscription:
                print(f"💳 Subscription: {subscription.get('plan', 'N/A')} ({subscription.get('status', 'N/A')})")
            
            if 'akshar_coins' in user:
                print(f"🪙 Akshar Coins: {user.get('akshar_coins', 0)}")
            
            # Profile Status
            if 'is_verified' in user:
                print(f"✓ Verified: {user.get('is_verified', False)}")
            if 'is_active' in user:
                print(f"✓ Active: {user.get('is_active', False)}")
            
            # Profile Images
            if user.get('profileImage'):
                print(f"🖼️  Profile Image: ✓ Present")
            if user.get('companyLogo'):
                print(f"🏢 Company Logo: ✓ Present")
            
            # Timestamps
            if user.get('created_at'):
                created_at = user.get('created_at')
                if isinstance(created_at, datetime):
                    print(f"📅 Created: {created_at.strftime('%Y-%m-%d %H:%M:%S')}")
                else:
                    print(f"📅 Created: {created_at}")
            
            if user.get('profileCompletedAt'):
                completed_at = user.get('profileCompletedAt')
                if isinstance(completed_at, datetime):
                    print(f"✅ Profile Completed: {completed_at.strftime('%Y-%m-%d %H:%M:%S')}")
                else:
                    print(f"✅ Profile Completed: {completed_at}")
            
            # Recruiter-specific information
            if user.get('userType') == 'recruiter':
                if user.get('recruiterFullName'):
                    print(f"👔 Recruiter Name: {user.get('recruiterFullName')}")
                if user.get('designation'):
                    print(f"💼 Designation: {user.get('designation')}")
                if user.get('officialEmail'):
                    print(f"📧 Official Email: {user.get('officialEmail')}")
                if user.get('industries'):
                    print(f"🏭 Industries: {', '.join(user.get('industries', []))}")
        
        print(f"\n{'=' * 80}")
        print(f"✅ Displayed {total_users} users successfully!")
        print(f"{'=' * 80}")
        
        # Close connection
        client.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    show_all_users()

