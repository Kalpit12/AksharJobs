#!/usr/bin/env python3
"""
Test script to verify network access and CORS functionality
Run this from another device or use curl to test
"""

import requests
import json

# Your PC's IP address
BACKEND_URL = "http://192.168.1.145:5000"
FRONTEND_URL = "http://192.168.1.145:3002"

def test_backend_health():
    """Test if backend is accessible"""
    try:
        response = requests.get(f"{BACKEND_URL}/")
        print(f"✅ Backend Health Check: {response.status_code}")
        print(f"Response: {response.text}")
        return True
    except Exception as e:
        print(f"❌ Backend Health Check Failed: {e}")
        return False

def test_cors():
    """Test CORS functionality"""
    try:
        # Test preflight request
        headers = {
            'Origin': 'http://192.168.1.145:3002',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        }
        
        response = requests.options(f"{BACKEND_URL}/api/auth/signup", headers=headers)
        print(f"✅ CORS Preflight Test: {response.status_code}")
        print(f"CORS Headers: {dict(response.headers)}")
        return True
    except Exception as e:
        print(f"❌ CORS Test Failed: {e}")
        return False

def test_signup_endpoint():
    """Test signup endpoint"""
    try:
        # Test data
        test_data = {
            "userType": "jobSeeker",
            "firstName": "Test",
            "lastName": "User",
            "email": "test@example.com",
            "password": "testpassword123",
            "phoneNumber": "1234567890"
        }
        
        headers = {
            'Content-Type': 'application/json',
            'Origin': 'http://192.168.1.145:3002'
        }
        
        response = requests.post(f"{BACKEND_URL}/api/auth/signup", 
                               json=test_data, 
                               headers=headers)
        
        print(f"✅ Signup Test: {response.status_code}")
        print(f"Response: {response.text}")
        return True
    except Exception as e:
        print(f"❌ Signup Test Failed: {e}")
        return False

def main():
    print("🌐 Testing Network Access and CORS...")
    print("=" * 50)
    
    # Test backend health
    if not test_backend_health():
        print("\n❌ Backend is not accessible. Make sure it's running!")
        return
    
    print("\n" + "=" * 50)
    
    # Test CORS
    if not test_cors():
        print("\n❌ CORS is not working properly!")
        return
    
    print("\n" + "=" * 50)
    
    # Test signup endpoint
    test_signup_endpoint()
    
    print("\n" + "=" * 50)
    print("🎯 Test completed! Check the results above.")

if __name__ == "__main__":
    main()
