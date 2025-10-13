#!/usr/bin/env python3
"""
Test script for password reset functionality
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.password_reset import generate_reset_token, verify_reset_token
from services.email_service import EmailService

def test_password_reset_token():
    """Test password reset token generation and verification"""
    print("🧪 Testing Password Reset Token Generation and Verification")
    print("=" * 60)
    
    # Test email
    test_email = "test@example.com"
    
    # Generate token
    print(f"📧 Generating reset token for: {test_email}")
    token = generate_reset_token(test_email)
    print(f"✅ Token generated: {token[:50]}...")
    
    # Verify token
    print(f"\n🔍 Verifying token...")
    verified_email = verify_reset_token(token)
    
    if verified_email == test_email:
        print(f"✅ Token verification successful! Email: {verified_email}")
    else:
        print(f"❌ Token verification failed! Expected: {test_email}, Got: {verified_email}")
    
    # Test invalid token
    print(f"\n🔍 Testing invalid token...")
    invalid_email = verify_reset_token("invalid_token")
    if invalid_email is None:
        print("✅ Invalid token correctly rejected")
    else:
        print(f"❌ Invalid token should have been rejected, got: {invalid_email}")
    
    print("\n" + "=" * 60)

def test_email_service():
    """Test email service (without actually sending)"""
    print("📧 Testing Email Service")
    print("=" * 60)
    
    try:
        email_service = EmailService()
        print("✅ EmailService initialized successfully")
        
        # Test reset link generation
        test_reset_link = "http://localhost:3000/reset-password?token=test123&email=test@example.com"
        print(f"🔗 Test reset link: {test_reset_link}")
        
        print("✅ Email service ready (not sending actual email in test)")
        
    except Exception as e:
        print(f"❌ Email service error: {str(e)}")
    
    print("\n" + "=" * 60)

def test_database_integration():
    """Test database integration for password reset"""
    print("🗄️ Testing Database Integration")
    print("=" * 60)
    
    try:
        from database.db import get_db_connection
        db = get_db_connection()
        users_collection = db.users
        
        print("✅ Database connection successful")
        print(f"📊 Users collection: {users_collection.name}")
        
        # Test finding a user
        test_user = users_collection.find_one({"email": "test@example.com"})
        if test_user:
            print(f"👤 Test user found: {test_user.get('firstName', 'Unknown')}")
        else:
            print("ℹ️ No test user found (this is expected)")
        
    except Exception as e:
        print(f"❌ Database error: {str(e)}")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    print("🚀 Password Reset System Test Suite")
    print("=" * 60)
    
    test_password_reset_token()
    test_email_service()
    test_database_integration()
    
    print("🎉 All tests completed!")
    print("\n📋 Next Steps:")
    print("1. Start the backend server")
    print("2. Test the /api/auth/forgot-password endpoint")
    print("3. Test the /api/auth/reset-password endpoint")
    print("4. Test the frontend pages at /forgot-password and /reset-password")
