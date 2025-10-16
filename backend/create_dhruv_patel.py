"""Create Dhruv Patel user account for testing"""
from utils.db import get_db
from werkzeug.security import generate_password_hash
from datetime import datetime

db = get_db()
users_collection = db.users

# Check if user already exists
existing = users_collection.find_one({"email": "Dhruvpatel771@gmail.com"})

if existing:
    print("⚠️  User already exists!")
    print(f"Email: {existing.get('email')}")
    print(f"User ID: {existing.get('_id')}")
else:
    # Create new user
    user_data = {
        "email": "Dhruvpatel771@gmail.com",
        "password": generate_password_hash("Dhruv@123"),
        "firstName": "Dhruv",
        "lastName": "Patel",
        "phone": "+91 9876543210",
        "userType": "job_seeker",
        "role": "jobSeeker",
        "profileCompleted": False,
        "emailVerified": True,
        "phoneVerified": False,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
        "active": True
    }
    
    result = users_collection.insert_one(user_data)
    
    if result.inserted_id:
        print("✅ User created successfully!")
        print(f"Email: Dhruvpatel771@gmail.com")
        print(f"Password: Dhruv@123")
        print(f"User ID: {result.inserted_id}")
        print(f"Role: job_seeker / jobSeeker")
        print("\n🎉 Ready for testing!")
    else:
        print("❌ Failed to create user")

