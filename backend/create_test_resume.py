#!/usr/bin/env python3
"""
Script to create a test resume for a user
"""

from services.resume_service import process_resume
from utils.db import get_db
import os

def create_test_resume(user_id):
    """Create a test resume for a user"""
    print(f"🔧 Creating test resume for user: {user_id}")
    
    # Create a simple test resume data
    test_resume = {
        "name": "Test User",
        "email": "test@example.com",
        "phone": "+254700000000",
        "profile_summary": "Experienced software developer with expertise in Python, JavaScript, and web development.",
        "skills": ["Python", "JavaScript", "React", "Node.js", "MongoDB", "Git"],
        "experience": [
            {
                "title": "Software Developer",
                "company": "Tech Company",
                "start_date": "2022-01",
                "end_date": "Present",
                "description": "Developed web applications using React and Node.js",
                "location": "Nairobi, Kenya"
            }
        ],
        "education": [
            {
                "degree": "Bachelor of Computer Science",
                "university": "University of Nairobi",
                "year": "2021",
                "grade": "First Class"
            }
        ],
        "projects": [
            {
                "name": "Job Portal",
                "description": "Built a job matching platform using AI and ML",
                "technologies": ["Python", "React", "MongoDB"],
                "url": "https://github.com/testuser/job-portal"
            }
        ],
        "certificates": [
            {
                "name": "Python Developer",
                "issuer": "Coursera",
                "date": "2022-06"
            }
        ]
    }
    
    # Get database connection
    db = get_db()
    resume_collection = db["resume_data"]
    
    # Check if user already has a resume
    existing = resume_collection.find_one({"userId": user_id})
    if existing:
        print(f"⚠️ User {user_id} already has a resume")
        print("Current resume data:")
        print(f"  Name: {existing.get('name', 'N/A')}")
        print(f"  Skills: {existing.get('skills', 'N/A')}")
        return False
    
    # Insert test resume
    test_resume["userId"] = user_id
    result = resume_collection.insert_one(test_resume)
    
    if result.inserted_id:
        print(f"✅ Test resume created successfully!")
        print(f"  Resume ID: {result.inserted_id}")
        print(f"  User ID: {user_id}")
        print(f"  Name: {test_resume['name']}")
        print(f"  Skills: {test_resume['skills']}")
        return True
    else:
        print("❌ Failed to create test resume")
        return False

def list_all_users():
    """List all users in the database"""
    print("👥 All users in the database:")
    
    db = get_db()
    users_collection = db["users"]
    
    users = list(users_collection.find({}, {"_id": 1, "email": 1, "name": 1}))
    
    if users:
        for i, user in enumerate(users):
            print(f"  User {i+1}:")
            print(f"    ID: {user['_id']}")
            print(f"    Email: {user.get('email', 'N/A')}")
            print(f"    Name: {user.get('name', 'N/A')}")
            print()
    else:
        print("  No users found")
    
    return users

if __name__ == "__main__":
    import sys
    
    print("🚀 Resume Creation Tool")
    print("=" * 50)
    
    # Check if user ID is provided as argument
    if len(sys.argv) > 1:
        user_id = sys.argv[1]
        print(f"🔧 Creating resume for user: {user_id}")
        create_test_resume(user_id)
    else:
        # List all users
        users = list_all_users()
        
        if users:
            print("🔧 To create a test resume, run:")
            print("python create_test_resume.py <user_id>")
            print("\nExample:")
            print("python create_test_resume.py 689f11827a2ddc8f1dc5d00f")
        else:
            print("❌ No users found in database")
