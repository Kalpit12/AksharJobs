#!/usr/bin/env python3
"""
Simple script to create an admin user for accessing the admin dashboard.
"""

import bcrypt
from pymongo import MongoClient
from datetime import datetime

def create_admin_user():
    """Create an admin user in the database"""
    
    # Connect to MongoDB
    try:
        client = MongoClient('mongodb://localhost:27017/')
        db = client['resume_matcher']  # Use your actual database name
        users_collection = db['users']
        
        print("✅ Connected to MongoDB successfully!")
        
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {str(e)}")
        return False
    
    # Admin user details
    admin_data = {
        "userType": "admin",
        "role": "admin",
        "firstName": "Admin",
        "lastName": "User",
        "email": "admin@rocketmatch.com",
        "password": bcrypt.hashpw("Admin@123".encode("utf-8"), bcrypt.gensalt()),
        "phoneNumber": "1234567890",
        "linkedInProfile": "",
        "companyName": "RocketMatch",
        "companyWebsite": "https://rocketmatch.com",
        "profileImage": None,
        "companyLogo": None,
        "subscription": {
            "plan": "Enterprise",
            "status": "active",
            "startDate": datetime.now(),
            "endDate": None,
            "features": ["unlimited_access", "admin_panel", "analytics"]
        },
        "created_at": datetime.now(),
        "is_verified": True,
        "is_active": True
    }
    
    try:
        # Check if admin already exists
        existing_admin = users_collection.find_one({"email": admin_data["email"]})
        if existing_admin:
            print("❌ Admin user already exists!")
            print(f"📧 Email: {admin_data['email']}")
            return False
        
        # Insert admin user
        result = users_collection.insert_one(admin_data)
        
        if result.inserted_id:
            print("✅ Admin user created successfully!")
            print("📧 Email: admin@rocketmatch.com")
            print("🔒 Password: Admin@123")
            print("🌐 Access: http://localhost:3002/admin")
            print("\n🚀 You can now login and access the admin dashboard!")
            return True
        else:
            print("❌ Failed to create admin user")
            return False
            
    except Exception as e:
        print(f"❌ Error creating admin user: {str(e)}")
        return False

if __name__ == "__main__":
    print("🔧 Creating Admin User for RocketMatch...")
    print("=" * 50)
    create_admin_user()
