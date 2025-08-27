#!/usr/bin/env python3
"""
Debug script to test database operations for resume data persistence
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId

def test_database_operations():
    """Test database operations to debug resume data persistence"""
    
    db = get_db()
    users_collection = db.users
    
    # Test user ID (replace with your actual user ID)
    user_id = "68ac6369976403086e5ec21b"
    
    print("🔍 Testing Database Operations...")
    print(f"User ID: {user_id}")
    
    # 1. Check if user exists
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    if not user:
        print("❌ User not found in database")
        return
    
    print(f"✅ User found: {user.get('firstName', 'Unknown')} {user.get('lastName', 'Unknown')}")
    print(f"📋 User profile keys: {list(user.keys())}")
    
    # 2. Check if resume_data exists
    if 'resume_data' in user:
        resume_data = user['resume_data']
        print("✅ resume_data found in user profile")
        print(f"📋 resume_data keys: {list(resume_data.keys())}")
        
        if 'skills' in resume_data:
            skills = resume_data['skills']
            print("✅ skills found in resume_data")
            print(f"📋 skills structure: {skills}")
            
            if isinstance(skills, dict):
                print(f"🔧 Technical skills: {skills.get('technical_skills', [])}")
                print(f"🔧 Soft skills: {skills.get('soft_skills', [])}")
                print(f"🔧 Languages: {skills.get('languages', [])}")
        else:
            print("❌ No skills field in resume_data")
    else:
        print("❌ No resume_data found in user profile")
    
    # 3. Check for other resume-related fields
    resume_fields = [key for key in user.keys() if 'resume' in key.lower()]
    print(f"📋 Resume-related fields: {resume_fields}")
    
    # 4. Test updating resume_data
    test_skills = {
        "technical_skills": ["Python", "Java", "C++", "SQL", "HTML", "CSS", "MongoDB", "Go"],
        "soft_skills": ["Communication", "Teamwork", "Problem Solving"],
        "languages": ["English"]
    }
    
    print("\n🧪 Testing resume_data update...")
    
    update_result = users_collection.update_one(
        {'_id': ObjectId(user_id)},
        {'$set': {'resume_data': {'skills': test_skills, 'test': True}}}
    )
    
    print(f"📝 Update result - matched: {update_result.matched_count}, modified: {update_result.modified_count}")
    
    # 5. Verify the update
    updated_user = users_collection.find_one({'_id': ObjectId(user_id)})
    if 'resume_data' in updated_user:
        print("✅ resume_data updated successfully")
        print(f"📋 Updated skills: {updated_user['resume_data'].get('skills')}")
    else:
        print("❌ resume_data update failed")

if __name__ == "__main__":
    test_database_operations()
