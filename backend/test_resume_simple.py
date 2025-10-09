#!/usr/bin/env python3
"""
Simple test script to isolate resume upload issues
"""
import os
import sys
import traceback

def test_imports():
    """Test if all required modules can be imported"""
    print("=== Testing Imports ===")
    
    try:
        from utils.db import get_db
        print("✅ Database utils imported successfully")
    except Exception as e:
        print(f"❌ Database utils import failed: {e}")
        return False
    
    try:
        from services.resume_service import ResumeService
        print("✅ ResumeService imported successfully")
    except Exception as e:
        print(f"❌ ResumeService import failed: {e}")
        return False
    
    try:
        from models.user_model import User
        print("✅ User model imported successfully")
    except Exception as e:
        print(f"❌ User model import failed: {e}")
        return False
    
    return True

def test_database_connection():
    """Test database connection"""
    print("\n=== Testing Database Connection ===")
    
    try:
        from utils.db import get_db
        db = get_db()
        
        if db is None:
            print("❌ Database connection failed - get_db() returned None")
            return False
        
        # Test ping
        try:
            db.command('ping')
            print("✅ Database ping successful")
        except Exception as e:
            print(f"❌ Database ping failed: {e}")
            return False
        
        print("✅ Database connection test passed")
        return True
        
    except Exception as e:
        print(f"❌ Database connection test failed: {e}")
        traceback.print_exc()
        return False

def test_resume_service():
    """Test ResumeService creation and basic functionality"""
    print("\n=== Testing ResumeService ===")
    
    try:
        from services.resume_service import ResumeService
        
        # Test creation without AI model
        resume_service = ResumeService(None)
        print("✅ ResumeService created successfully")
        
        # Test text extraction method exists
        if hasattr(resume_service, '_extract_text'):
            print("✅ _extract_text method exists")
        else:
            print("❌ _extract_text method missing")
            return False
        
        if hasattr(resume_service, '_fallback_extraction'):
            print("✅ _fallback_extraction method exists")
        else:
            print("❌ _fallback_extraction method missing")
            return False
        
        print("✅ ResumeService test passed")
        return True
        
    except Exception as e:
        print(f"❌ ResumeService test failed: {e}")
        traceback.print_exc()
        return False

def test_user_model():
    """Test User model functionality"""
    print("\n=== Testing User Model ===")
    
    try:
        from models.user_model import User
        from utils.db import get_db
        
        db = get_db()
        if db is None:
            print("❌ Cannot test User model - no database connection")
            return False
        
        # Test if users collection exists
        collections = db.list_collection_names()
        if 'users' in collections:
            print("✅ Users collection exists")
        else:
            print("❌ Users collection not found")
            return False
        
        print("✅ User model test passed")
        return True
        
    except Exception as e:
        print(f"❌ User model test failed: {e}")
        traceback.print_exc()
        return False

def main():
    """Run all tests"""
    print("🚀 Starting Resume Upload Component Tests\n")
    
    tests = [
        test_imports,
        test_database_connection,
        test_resume_service,
        test_user_model
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Test {test.__name__} crashed: {e}")
            traceback.print_exc()
    
    print(f"\n📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Resume upload should work.")
    else:
        print("⚠️  Some tests failed. Check the errors above.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
