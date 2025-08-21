#!/usr/bin/env python3
"""
Test script to check resume data in the database
"""

from models.application_model import ApplicationModel
from services.resume_service import get_resumes_by_user
from services.job_service import get_job_by_id
from utils.db import get_db

def test_resume_data():
    """Test if resume data exists for a user"""
    print("🔍 Testing resume data availability...")
    
    # Get database connection
    db = get_db()
    resume_collection = db["resume_data"]
    
    # Check all resumes in the database
    all_resumes = list(resume_collection.find({}))
    print(f"📊 Total resumes in database: {len(all_resumes)}")
    
    if all_resumes:
        print("\n📄 Resume details:")
        for i, resume in enumerate(all_resumes):
            print(f"  Resume {i+1}:")
            print(f"    User ID: {resume.get('userId', 'N/A')}")
            print(f"    Name: {resume.get('name', 'N/A')}")
            print(f"    Skills: {resume.get('skills', 'N/A')}")
            print(f"    Experience: {resume.get('experience', 'N/A')}")
            print(f"    Education: {resume.get('education', 'N/A')}")
            print(f"    File ID: {resume.get('fileId', 'N/A')}")
            print()
    else:
        print("❌ No resumes found in database")
    
    # Check applications
    applications = ApplicationModel.get_applications({})
    print(f"📊 Total applications in database: {len(applications)}")
    
    if applications:
        print("\n💼 Application details:")
        for i, app in enumerate(applications[:3]):  # Show first 3
            print(f"  Application {i+1}:")
            print(f"    User ID: {app.get('userId', 'N/A')}")
            print(f"    Job ID: {app.get('jobId', 'N/A')}")
            print(f"    Match Score: {app.get('matchScore', 'N/A')}")
            print(f"    Final Score: {app.get('final_score', 'N/A')}")
            print()

def test_specific_user(user_id):
    """Test resume data for a specific user"""
    print(f"\n🔍 Testing resume data for user: {user_id}")
    
    try:
        resumes = get_resumes_by_user(user_id)
        print(f"📄 Resumes found: {len(resumes)}")
        
        if resumes:
            print("✅ Resume data found:")
            for i, resume in enumerate(resumes):
                print(f"  Resume {i+1}:")
                print(f"    Name: {resume.get('name', 'N/A')}")
                print(f"    Skills: {resume.get('skills', 'N/A')}")
                print(f"    Experience: {resume.get('experience', 'N/A')}")
                print(f"    Education: {resume.get('education', 'N/A')}")
        else:
            print("❌ No resume data found for this user")
            
    except Exception as e:
        print(f"❌ Error getting resume data: {e}")

if __name__ == "__main__":
    print("🚀 Starting Resume Data Test...")
    print("=" * 50)
    
    # Test general resume data
    test_resume_data()
    
    # Test with a specific user ID (replace with actual user ID)
    test_user_id = "689f11827a2ddc8f1dc5d00f"  # Actual user ID from database
    test_specific_user(test_user_id)
    
    print("=" * 50)
    print("✅ Resume data test completed!")
