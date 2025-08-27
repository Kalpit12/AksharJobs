#!/usr/bin/env python3
"""
Script to create a test user for login testing
"""

import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.services.auth_service import AuthService
from backend.utils.db import get_db
from backend.models.user_model import users_collection
import bcrypt

def create_test_user():
    """Create a test user for login testing"""
    
    # Test user data
    test_user = {
        "userType": "jobSeeker",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "password": "password123",
        "phoneNumber": "1234567890",
        "linkedInProfile": "",
        "companyName": "",
        "companyWebsite": "",
        "profileImage": None,
        "companyLogo": None
    }
    
    try:
        # Check if user already exists
        existing_user = users_collection.find_one({"email": test_user["email"]})
        if existing_user:
            print(f"✅ User {test_user['email']} already exists!")
            return True
        
        # Hash the password
        hashed_password = bcrypt.hashpw(test_user["password"].encode("utf-8"), bcrypt.gensalt())
        
        # Create user data for database
        user_data = {
            "userType": test_user["userType"],
            "firstName": test_user["firstName"],
            "lastName": test_user["lastName"],
            "email": test_user["email"],
            "password": hashed_password,
            "phoneNumber": test_user["phoneNumber"],
            "linkedInProfile": test_user["linkedInProfile"],
            "companyName": test_user["companyName"],
            "companyWebsite": test_user["companyWebsite"],
            "profileImage": test_user["profileImage"],
            "companyLogo": test_user["companyLogo"]
        }
        
        # Insert user into database
        result = users_collection.insert_one(user_data)
        
        if result.inserted_id:
            print(f"✅ Test user created successfully!")
            print(f"   Email: {test_user['email']}")
            print(f"   Password: {test_user['password']}")
            print(f"   User ID: {result.inserted_id}")
            return True
        else:
            print("❌ Failed to create test user")
            return False
            
    except Exception as e:
        print(f"❌ Error creating test user: {e}")
        return False

def test_login():
    """Test login with the created user"""
    
    test_credentials = {
        "email": "john.doe@example.com",
        "password": "password123"
    }
    
    try:
        response, status = AuthService.login(test_credentials)
        
        if status == 200:
            print(f"✅ Login test successful!")
            print(f"   Response: {response}")
            return True
        else:
            print(f"❌ Login test failed: {response}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing login: {e}")
        return False

def main():
    print("🔧 Creating Test User...")
    print("=" * 50)
    
    # Create test user
    if create_test_user():
        print("\n" + "=" * 50)
        
        # Test login
        print("🧪 Testing Login...")
        test_login()
    
    print("\n" + "=" * 50)
    print("🎯 Test user setup completed!")

if __name__ == "__main__":
    main()
