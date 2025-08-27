#!/usr/bin/env python3
"""
Script to create an admin user for accessing the admin dashboard.
Run this script to create the first admin user.
"""

import bcrypt
from utils.db import get_db
from datetime import datetime

def create_admin_user():
    """Create an admin user in the database"""
    
    # Admin user details
    admin_data = {
        "userType": "admin",
        "role": "admin",  # This is the key field for admin access
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
        # Get database connection
        db = get_db()
        users_collection = db["users"]
        
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
