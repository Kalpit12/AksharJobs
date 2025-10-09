#!/usr/bin/env python3
"""
Create the correct user for testing
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId
from datetime import datetime
import bcrypt

def create_correct_user():
    """Create the user that the login is expecting"""
    
    db = get_db()
    if db is None:
        print("❌ Database connection failed")
        return False
    
    # The user ID that the login is returning
    user_id = ObjectId("68a848daa73a6ba4409a8bf4")
    
    # Check if user already exists
    existing_user = db.users.find_one({'_id': user_id})
    if existing_user:
        print(f"✅ User already exists:")
        print(f"   ID: {existing_user['_id']}")
        print(f"   Name: {existing_user.get('firstName', '')} {existing_user.get('lastName', '')}")
        print(f"   Email: {existing_user.get('email', 'N/A')}")
        return True
    
    # Create the user
    password = "password123"
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    user_data = {
        "_id": user_id,
        "userType": "job_seeker",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "password": hashed_password,
        "phoneNumber": "",
        "linkedInProfile": "",
        "companyName": "",
        "companyWebsite": "",
        "location": "",
        "industry": "",
        "companySize": "",
        "foundedYear": "",
        "companyDescription": "",
        "profileImage": None,
        "companyLogo": None,
        "subscription": {
            "plan": "Basic",
            "status": "active",
            "startDate": None,
            "endDate": None,
            "features": []
        },
        "is_verified": True,
        "is_active": True,
        "created_at": datetime.now()
    }
    
    try:
        result = db.users.insert_one(user_data)
        if result.inserted_id:
            print(f"✅ User created successfully:")
            print(f"   ID: {result.inserted_id}")
            print(f"   Name: {user_data['firstName']} {user_data['lastName']}")
            print(f"   Email: {user_data['email']}")
            return True
        else:
            print(f"❌ Failed to create user")
            return False
    except Exception as e:
        print(f"❌ Error creating user: {e}")
        return False

if __name__ == "__main__":
    create_correct_user()




