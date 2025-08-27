#!/usr/bin/env python3
"""
Script to create a test recruiter user for testing the frontend functionality and features.
"""

import sys
import os
from datetime import datetime, timedelta

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from pymongo import MongoClient
from werkzeug.security import generate_password_hash
from config import MONGO_URI, DB_NAME

def create_test_recruiter():
    """Create a test recruiter user in the database"""
    
    # Connect to MongoDB
    try:
        if MONGO_URI:
            client = MongoClient(MONGO_URI)
        else:
            # Fallback to local MongoDB
            client = MongoClient('mongodb://localhost:27017/')
        
        db = client[DB_NAME] if DB_NAME else client['TalentMatchDB']
        users_collection = db['users']
        
        print("✅ Connected to MongoDB successfully!")
        print(f"📊 Database: {db.name}")
        
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {str(e)}")
        print("💡 Make sure MongoDB is running and connection details are correct")
        return False
    
    # Test recruiter user details
    recruiter_data = {
        "userType": "recruiter",
        "firstName": "Sarah",
        "lastName": "Johnson",
        "email": "sarah.johnson@techcorp.com",
        "password": generate_password_hash("recruiter123"),
        "phoneNumber": "+1 (555) 987-6543",
        "linkedInProfile": "https://linkedin.com/in/sarahjohnson",
        "companyName": "TechCorp Solutions",
        "companyWebsite": "https://techcorp-solutions.com",
        "companyLogo": None,  # Can be added later for testing
        "subscription": {
            "plan": "Premium",
            "status": "active",
            "startDate": datetime.now(),
            "endDate": datetime.now() + timedelta(days=365),  # 1 year subscription
            "features": [
                "unlimited_job_postings",
                "advanced_analytics",
                "candidate_search",
                "priority_support",
                "custom_branding"
            ]
        },
        "companyDetails": {
            "industry": "Technology",
            "companySize": "100-500 employees",
            "location": "San Francisco, CA",
            "description": "Leading technology solutions provider specializing in AI and cloud computing",
            "founded": 2018,
            "website": "https://techcorp-solutions.com"
        },
        "recruiterProfile": {
            "title": "Senior Talent Acquisition Manager",
            "department": "Human Resources",
            "experience": "8+ years",
            "specializations": ["Tech Hiring", "Executive Search", "Campus Recruitment"],
            "certifications": ["SHRM-CP", "LinkedIn Recruiter Certified"]
        },
        "preferences": {
            "jobCategories": ["Software Engineering", "Data Science", "Product Management", "DevOps"],
            "experienceLevels": ["Entry", "Mid", "Senior", "Executive"],
            "locations": ["San Francisco", "New York", "Remote", "Austin"],
            "salaryRanges": ["$80k-120k", "$120k-180k", "$180k+"]
        },
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "is_verified": True,
        "is_active": True,
        "email_verified": True,
        "phone_verified": True,
        "last_login": None,
        "login_count": 0,
        "profile_completion": 85
    }
    
    try:
        # Check if user already exists
        existing_user = users_collection.find_one({"email": recruiter_data["email"]})
        if existing_user:
            print("⚠️  User already exists!")
            print(f"📧 Email: {recruiter_data['email']}")
            print("🔒 Password: recruiter123")
            print("👤 Name: Sarah Johnson")
            print("🏢 Company: TechCorp Solutions")
            print("👔 User Type: Recruiter")
            print("\n🔄 You can use these credentials to login and test!")
            return False
        
        # Insert user
        result = users_collection.insert_one(recruiter_data)
        
        if result.inserted_id:
            print("✅ Test recruiter user created successfully!")
            print("=" * 60)
            print("👤 USER DETAILS:")
            print(f"📧 Email: {recruiter_data['email']}")
            print(f"🔒 Password: recruiter123")
            print(f"👤 Name: {recruiter_data['firstName']} {recruiter_data['lastName']}")
            print(f"🏢 Company: {recruiter_data['companyName']}")
            print(f"👔 User Type: {recruiter_data['userType']}")
            print(f"📱 Phone: {recruiter_data['phoneNumber']}")
            print(f"🔗 LinkedIn: {recruiter_data['linkedInProfile']}")
            print(f"🌐 Website: {recruiter_data['companyWebsite']}")
            print("\n💼 COMPANY DETAILS:")
            print(f"🏭 Industry: {recruiter_data['companyDetails']['industry']}")
            print(f"👥 Size: {recruiter_data['companyDetails']['companySize']}")
            print(f"📍 Location: {recruiter_data['companyDetails']['location']}")
            print(f"📅 Founded: {recruiter_data['companyDetails']['founded']}")
            print("\n👔 RECRUITER PROFILE:")
            print(f"💼 Title: {recruiter_data['recruiterProfile']['title']}")
            print(f"🏢 Department: {recruiter_data['recruiterProfile']['department']}")
            print(f"⏰ Experience: {recruiter_data['recruiterProfile']['experience']}")
            print(f"🎯 Specializations: {', '.join(recruiter_data['recruiterProfile']['specializations'])}")
            print("\n📊 SUBSCRIPTION:")
            print(f"📦 Plan: {recruiter_data['subscription']['plan']}")
            print(f"✅ Status: {recruiter_data['subscription']['status']}")
            print(f"🚀 Features: {', '.join(recruiter_data['subscription']['features'])}")
            print("\n🎯 PREFERENCES:")
            print(f"📋 Job Categories: {', '.join(recruiter_data['preferences']['jobCategories'])}")
            print(f"📈 Experience Levels: {', '.join(recruiter_data['preferences']['experienceLevels'])}")
            print(f"📍 Locations: {', '.join(recruiter_data['preferences']['locations'])}")
            print("\n🚀 You can now login and test all recruiter features!")
            print("=" * 60)
            return True
        else:
            print("❌ Failed to create user")
            return False
            
    except Exception as e:
        print(f"❌ Error creating user: {str(e)}")
        print(f"🔍 Error details: {type(e).__name__}")
        return False

def create_simple_recruiter():
    """Create a simple test recruiter with minimal fields"""
    
    try:
        if MONGO_URI:
            client = MongoClient(MONGO_URI)
        else:
            client = MongoClient('mongodb://localhost:27017/')
        
        db = client[DB_NAME] if DB_NAME else client['TalentMatchDB']
        users_collection = db['users']
        
        # Simple recruiter data
        simple_recruiter = {
            "userType": "recruiter",
            "firstName": "John",
            "lastName": "Smith",
            "email": "john.smith@testcompany.com",
            "password": generate_password_hash("test123"),
            "phoneNumber": "+1 (555) 111-2222",
            "companyName": "Test Company Inc",
            "companyWebsite": "https://testcompany.com",
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
        
        # Check if exists
        existing = users_collection.find_one({"email": simple_recruiter["email"]})
        if existing:
            print("⚠️  Simple recruiter already exists!")
            print(f"📧 Email: {simple_recruiter['email']}")
            print("🔒 Password: test123")
            return False
        
        # Insert
        result = users_collection.insert_one(simple_recruiter)
        if result.inserted_id:
            print("✅ Simple test recruiter created!")
            print(f"📧 Email: {simple_recruiter['email']}")
            print("🔒 Password: test123")
            print("👤 Name: John Smith")
            print("🏢 Company: Test Company Inc")
            return True
        else:
            print("❌ Failed to create simple recruiter")
            return False
            
    except Exception as e:
        print(f"❌ Error creating simple recruiter: {str(e)}")
        return False

if __name__ == "__main__":
    print("🔧 Creating Test Recruiter User...")
    print("=" * 60)
    
    print("\n1️⃣ Creating comprehensive test recruiter...")
    success = create_test_recruiter()
    
    if not success:
        print("\n2️⃣ Trying simple test recruiter...")
        create_simple_recruiter()
    
    print("\n🎯 Test recruiter creation completed!")
    print("💡 Use the credentials above to login and test recruiter features")
