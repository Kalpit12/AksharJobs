#!/usr/bin/env python3
"""
Script to create a test job seeker user for testing the frontend.
"""

import bcrypt
from pymongo import MongoClient
from datetime import datetime

def create_test_jobseeker():
    """Create a test job seeker user in the database"""
    
    # Connect to MongoDB
    try:
        client = MongoClient('mongodb://localhost:27017/')
        db = client['TalentMatchDB']
        users_collection = db['users']
        
        print("✅ Connected to MongoDB successfully!")
        
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {str(e)}")
        return False
    
    # Test job seeker user details
    jobseeker_data = {
        "userType": "job_seeker",
        "firstName": "Kalpit",
        "lastName": "Patel",
        "email": "kalpit.patel@example.com",
        "password": bcrypt.hashpw("password123".encode("utf-8"), bcrypt.gensalt()),
        "phoneNumber": "+1 (555) 123-4567",
        "linkedInProfile": "https://linkedin.com/in/kalpitpatel",
        "profileImage": None,
        "subscription": {
            "plan": "Basic",
            "status": "active",
            "startDate": datetime.now(),
            "endDate": None,
            "features": ["basic_access"]
        },
        "created_at": datetime.now(),
        "is_verified": True,
        "is_active": True
    }
    
    try:
        # Check if user already exists
        existing_user = users_collection.find_one({"email": jobseeker_data["email"]})
        if existing_user:
            print("❌ User already exists!")
            print(f"📧 Email: {jobseeker_data['email']}")
            print("🔒 Password: password123")
            print("👤 Name: Kalpit Patel")
            return False
        
        # Insert user
        result = users_collection.insert_one(jobseeker_data)
        
        if result.inserted_id:
            print("✅ Test job seeker user created successfully!")
            print("📧 Email: kalpit.patel@example.com")
            print("🔒 Password: password123")
            print("👤 User Type: Job Seeker")
            print("👤 Name: Kalpit Patel")
            print("\n🚀 You can now login and test the frontend!")
            return True
        else:
            print("❌ Failed to create user")
            return False
            
    except Exception as e:
        print(f"❌ Error creating user: {str(e)}")
        return False

if __name__ == "__main__":
    print("🔧 Creating Test Job Seeker User...")
    print("=" * 50)
    create_test_jobseeker()
