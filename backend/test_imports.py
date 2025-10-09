#!/usr/bin/env python3
"""
Test script to check if all required modules can be imported
"""

def test_imports():
    """Test importing all required modules"""
    print("🔍 Testing Module Imports")
    print("=" * 40)
    
    # Test 1: Basic imports
    try:
        from flask import Flask
        print("✅ Flask imported successfully")
    except Exception as e:
        print(f"❌ Flask import failed: {e}")
    
    try:
        from pymongo import MongoClient
        print("✅ PyMongo imported successfully")
    except Exception as e:
        print(f"❌ PyMongo import failed: {e}")
    
    # Test 2: Database utilities
    try:
        from utils.db import get_db
        print("✅ Database utilities imported successfully")
    except Exception as e:
        print(f"❌ Database utilities import failed: {e}")
    
    # Test 3: Match result utilities
    try:
        from utils.match_result import hybrid_score
        print("✅ Match result utilities imported successfully")
    except Exception as e:
        print(f"❌ Match result utilities import failed: {e}")
    
    # Test 4: Resume service
    try:
        from services.resume_service import ResumeService
        print("✅ Resume service imported successfully")
    except Exception as e:
        print(f"❌ Resume service import failed: {e}")
    
    # Test 5: Job routes
    try:
        from routes.job_routes import job_routes
        print("✅ Job routes imported successfully")
    except Exception as e:
        print(f"❌ Job routes import failed: {e}")
    
    # Test 6: User profile routes
    try:
        from routes.user_profile_routes import user_profile_routes
        print("✅ User profile routes imported successfully")
    except Exception as e:
        print(f"❌ User profile routes import failed: {e}")
    
    # Test 7: Resume routes
    try:
        from routes.resume_routes import resume_bp
        print("✅ Resume routes imported successfully")
    except Exception as e:
        print(f"❌ Resume routes import failed: {e}")
    
    print("\n✅ Import test completed!")

if __name__ == "__main__":
    test_imports()
