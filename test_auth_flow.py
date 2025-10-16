#!/usr/bin/env python3
"""
Test script for login and signup authentication flow
"""

import requests
import json
import sys
import os

# Add the backend directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Configuration
BASE_URL = "http://localhost:3002"
SIGNUP_ENDPOINT = f"{BASE_URL}/api/auth/signup"
LOGIN_ENDPOINT = f"{BASE_URL}/api/auth/login"

def test_signup():
    """Test user signup"""
    print("🔐 Testing Signup...")
    
    signup_data = {
        "userType": "jobSeeker",
        "firstName": "Test",
        "lastName": "User",
        "email": "testuser@example.com",
        "password": "TestPassword123!",
        "phoneNumber": "+1234567890",
        "location": "Test City"
    }
    
    try:
        response = requests.post(
            SIGNUP_ENDPOINT,
            json=signup_data,
            headers={
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            },
            timeout=10
        )
        
        print(f"📤 Signup Request: {signup_data}")
        print(f"📥 Signup Response Status: {response.status_code}")
        print(f"📥 Signup Response: {response.json()}")
        
        if response.status_code in [200, 201]:
            print("✅ Signup successful!")
            return True
        else:
            print("❌ Signup failed!")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server. Make sure it's running on port 3002")
        return False
    except Exception as e:
        print(f"❌ Signup error: {e}")
        return False

def test_login():
    """Test user login"""
    print("\n🔑 Testing Login...")
    
    login_data = {
        "email": "testuser@example.com",
        "password": "TestPassword123!"
    }
    
    try:
        response = requests.post(
            LOGIN_ENDPOINT,
            json=login_data,
            headers={
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            },
            timeout=10
        )
        
        print(f"📤 Login Request: {login_data}")
        print(f"📥 Login Response Status: {response.status_code}")
        print(f"📥 Login Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            return True
        else:
            print("❌ Login failed!")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server. Make sure it's running on port 3002")
        return False
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False

def test_backend_connection():
    """Test if backend is running"""
    print("🔍 Testing Backend Connection...")
    
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        print(f"📥 Backend Status: {response.status_code}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Backend server is not running on port 3002")
        return False
    except Exception as e:
        print(f"❌ Backend connection error: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 Starting Authentication Flow Test")
    print("=" * 50)
    
    # Test backend connection first
    if not test_backend_connection():
        print("\n❌ Backend server is not running. Please start it first:")
        print("   cd backend && python app.py")
        return
    
    print("\n✅ Backend server is running!")
    
    # Test signup
    signup_success = test_signup()
    
    # Test login
    login_success = test_login()
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"   Backend Connection: ✅")
    print(f"   Signup: {'✅' if signup_success else '❌'}")
    print(f"   Login: {'✅' if login_success else '❌'}")
    
    if signup_success and login_success:
        print("\n🎉 All authentication tests passed!")
    else:
        print("\n⚠️ Some tests failed. Check the logs above.")

if __name__ == "__main__":
    main()
