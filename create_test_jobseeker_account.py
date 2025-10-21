#!/usr/bin/env python3
"""
Create a fresh test jobseeker account for testing
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))

from pymongo import MongoClient
from dotenv import load_dotenv
import bcrypt
from datetime import datetime
from bson import ObjectId

# Load environment variables
load_dotenv('.env.production')
load_dotenv('.env.local')
load_dotenv('.env')

def create_test_jobseeker():
    """Create a brand new jobseeker account"""
    
    print("=" * 80)
    print("👤 CREATING NEW TEST JOBSEEKER ACCOUNT")
    print("=" * 80)
    print()
    
    try:
        MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
        DB_NAME = os.getenv("DB_NAME", "TalentMatchDB")
        
        # Connect to MongoDB
        client = MongoClient(MONGO_URI, socketTimeoutMS=60000, connectTimeoutMS=60000)
        db = client[DB_NAME]
        
        # Create unique test email
        timestamp = int(datetime.now().timestamp())
        test_email = f"jobseeker.test{timestamp}@example.com"
        test_password = "Test@123"
        
        # Check if user already exists
        existing = db.users.find_one({"email": test_email})
        if existing:
            print(f"❌ User already exists: {test_email}")
            return False
        
        # Hash password
        hashed_password = bcrypt.hashpw(test_password.encode('utf-8'), bcrypt.gensalt(rounds=12))
        
        # Create new user document
        new_user = {
            "_id": ObjectId(),
            "userType": "job_seeker",
            "firstName": "Test",
            "lastName": "JobSeeker",
            "email": test_email,
            "password": hashed_password.decode('utf-8'),
            "phoneNumber": "+1-555-TEST-001",
            "linkedInProfile": "https://linkedin.com/in/test-jobseeker",
            "companyName": "",
            "companyWebsite": "",
            "location": "Test City, Test State",
            "industry": "",
            "companySize": "",
            "foundedYear": "",
            "companyDescription": "",
            "profileImage": None,
            "companyLogo": None,
            "communities": [],
            "primary_community": "",
            "community_preferences": {},
            "community_verification_status": "pending",
            "community_verification_requested_at": datetime.utcnow(),
            "community_verification_verified_at": None,
            "community_verification_verified_by": None,
            "subscription": {
                "plan": "Basic",
                "status": "active",
                "startDate": None,
                "endDate": None,
                "features": []
            },
            "free_applications": 10,
            "akshar_coins": 0,
            "coin_transactions": [],
            "is_verified": True,
            "is_active": True,
            "created_at": datetime.utcnow(),
            "profileCompleted": False,
            "test_account": True
        }
        
        # Insert user
        result = db.users.insert_one(new_user)
        
        print("✅ NEW JOBSEEKER ACCOUNT CREATED!")
        print()
        print("=" * 80)
        print("📋 ACCOUNT DETAILS")
        print("=" * 80)
        print(f"User ID: {result.inserted_id}")
        print(f"Email: {test_email}")
        print(f"Password: {test_password}")
        print(f"First Name: Test")
        print(f"Last Name: JobSeeker")
        print(f"User Type: job_seeker")
        print(f"Phone: +1-555-TEST-001")
        print(f"Location: Test City, Test State")
        print()
        
        # Test the password
        print("🔐 Testing password hash...")
        stored = db.users.find_one({"email": test_email})
        if bcrypt.checkpw(test_password.encode('utf-8'), stored['password'].encode('utf-8')):
            print("✅ Password hash verified!")
        else:
            print("❌ Password hash verification FAILED!")
        print()
        
        print("=" * 80)
        print("🧪 TESTING LOGIN")
        print("=" * 80)
        print()
        
        # Test login via API
        import requests
        try:
            response = requests.post(
                "http://localhost:3002/api/auth/login",
                json={"email": test_email, "password": test_password},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                print("✅ API LOGIN SUCCESSFUL!")
                print(f"   Token: {data.get('token', 'N/A')[:50]}...")
                print(f"   Role: {data.get('role', 'N/A')}")
                print(f"   User ID: {data.get('userId', 'N/A')}")
                print()
            else:
                print(f"❌ API LOGIN FAILED! Status: {response.status_code}")
                print(f"   Response: {response.text}")
                print()
        except Exception as e:
            print(f"⚠️  Could not test API login: {e}")
            print()
        
        print("=" * 80)
        print("🎯 NEXT STEPS - COMPLETE REGISTRATION FLOW")
        print("=" * 80)
        print()
        print("1. Go to: http://localhost:3003/login")
        print(f"2. Login with:")
        print(f"   Email: {test_email}")
        print(f"   Password: {test_password}")
        print()
        print("3. You should be redirected to: /jobseeker-dashboard")
        print()
        print("4. Complete your profile:")
        print("   - Click 'Complete Profile' or 'Edit Profile'")
        print("   - Fill in all required fields")
        print("   - Add skills, education, experience")
        print("   - Upload resume (optional)")
        print()
        print("5. Save profile and verify data displays correctly")
        print()
        print("6. Check your profile page:")
        print("   - All fields should show your data")
        print("   - No hardcoded values")
        print("   - Profile picture (if uploaded)")
        print()
        
        print("=" * 80)
        print("📝 SAVE THESE CREDENTIALS")
        print("=" * 80)
        print()
        print(f"Email: {test_email}")
        print(f"Password: {test_password}")
        print()
        
        # Save to file
        credentials_file = "test_jobseeker_credentials.txt"
        with open(credentials_file, 'w') as f:
            f.write("=" * 80 + "\n")
            f.write("TEST JOBSEEKER ACCOUNT\n")
            f.write("=" * 80 + "\n\n")
            f.write(f"Email: {test_email}\n")
            f.write(f"Password: {test_password}\n")
            f.write(f"User Type: job_seeker\n")
            f.write(f"Created: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write("\n")
            f.write("Login URL: http://localhost:3003/login\n")
            f.write("Dashboard: http://localhost:3003/jobseeker-dashboard\n")
            f.write("\n")
            f.write("=" * 80 + "\n")
        
        print(f"💾 Credentials saved to: {credentials_file}")
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
    create_test_jobseeker()

