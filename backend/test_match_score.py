#!/usr/bin/env python3
"""
Test script to debug match score functionality
"""

import requests
import json

# Test configuration
BASE_URL = "http://127.0.0.1:5000/api"
TEST_USER_ID = "test_user_123"  # Replace with actual user ID
TEST_JOB_ID = "test_job_456"    # Replace with actual job ID

def test_apply_for_job():
    """Test applying for a job and getting match score"""
    print("🔍 Testing job application and match score...")
    
    # Test 1: Apply for a job
    print("\n1️⃣ Testing job application...")
    apply_data = {
        "userId": TEST_USER_ID,
        "jobId": TEST_JOB_ID,
        "status": ""
    }
    
    try:
        response = requests.post(f"{BASE_URL}/applications/apply", json=apply_data)
        print(f"✅ Apply response status: {response.status_code}")
        print(f"✅ Apply response data: {response.json()}")
    except Exception as e:
        print(f"❌ Error applying for job: {e}")
        return False
    
    # Test 2: Get applications
    print("\n2️⃣ Testing get applications...")
    try:
        response = requests.get(f"{BASE_URL}/applications/get_applications", 
                              params={"userId": TEST_USER_ID, "jobId": TEST_JOB_ID})
        print(f"✅ Get applications status: {response.status_code}")
        print(f"✅ Get applications data: {response.json()}")
    except Exception as e:
        print(f"❌ Error getting applications: {e}")
        return False
    
    # Test 3: Check if data exists in database
    print("\n3️⃣ Checking database data...")
    try:
        response = requests.get(f"{BASE_URL}/applications/get_applications", 
                              params={"userId": TEST_USER_ID})
        print(f"✅ All user applications status: {response.status_code}")
        print(f"✅ All user applications data: {response.json()}")
    except Exception as e:
        print(f"❌ Error getting all user applications: {e}")
        return False
    
    return True

def test_sbert_model():
    """Test if SBERT model is working"""
    print("\n🔍 Testing SBERT model...")
    
    try:
        # Import and test SBERT
        from utils.sbert_match import compute_similarity
        
        test_text1 = "Python developer with machine learning experience"
        test_text2 = "Software engineer skilled in Python and AI"
        
        similarity = compute_similarity(test_text1, test_text2)
        print(f"✅ SBERT similarity test: {similarity}")
        return True
    except Exception as e:
        print(f"❌ SBERT model error: {e}")
        return False

def test_database_connection():
    """Test database connection"""
    print("\n🔍 Testing database connection...")
    
    try:
        from models.application_model import ApplicationModel
        
        # Try to get applications
        applications = ApplicationModel.get_applications({})
        print(f"✅ Database connection successful. Found {len(applications)} applications")
        return True
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting Match Score Debug Tests...")
    print("=" * 50)
    
    # Test database connection
    db_ok = test_database_connection()
    
    # Test SBERT model
    sbert_ok = test_sbert_model()
    
    # Test application flow
    app_ok = test_apply_for_job()
    
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print(f"Database Connection: {'✅ PASS' if db_ok else '❌ FAIL'}")
    print(f"SBERT Model: {'✅ PASS' if sbert_ok else '❌ FAIL'}")
    print(f"Application Flow: {'✅ PASS' if app_ok else '❌ FAIL'}")
    
    if all([db_ok, sbert_ok, app_ok]):
        print("\n🎉 All tests passed! Match score should work.")
    else:
        print("\n⚠️ Some tests failed. Check the errors above.")
