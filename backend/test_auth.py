#!/usr/bin/env python3
"""
Test script for RocketJobs Authentication Endpoints
This script tests the login and signup functionality.
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:5000"
API_BASE = f"{BASE_URL}/api/auth"

def test_server_health():
    """Test if the server is running"""
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ Server is running")
            return True
        else:
            print(f"❌ Server returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Is it running?")
        return False

def test_signup():
    """Test user signup"""
    print("\n🧪 Testing User Signup...")
    
    signup_data = {
        "userType": "jobSeeker",
        "firstName": "Test",
        "lastName": "User",
        "email": f"testuser{int(time.time())}@example.com",  # Unique email
        "password": "TestPassword123!",
        "phoneNumber": "+254700000000",
        "companyName": ""
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/signup",
            json=signup_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            print("✅ Signup successful")
            return signup_data["email"], signup_data["password"]
        else:
            print("❌ Signup failed")
            return None, None
            
    except Exception as e:
        print(f"❌ Signup error: {e}")
        return None, None

def test_login(email, password):
    """Test user login"""
    print("\n🧪 Testing User Login...")
    
    login_data = {
        "email": email,
        "password": password
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful")
            print(f"   User ID: {data.get('userId')}")
            print(f"   Role: {data.get('role')}")
            print(f"   Token: {data.get('token')[:20]}...")
            return data.get('token')
        else:
            print("❌ Login failed")
            return None
            
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_protected_endpoint(token):
    """Test accessing a protected endpoint with JWT token"""
    print("\n🧪 Testing Protected Endpoint...")
    
    if not token:
        print("❌ No token available")
        return
    
    try:
        response = requests.get(
            f"{API_BASE}/get_user",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Protected endpoint access successful")
        else:
            print("❌ Protected endpoint access failed")
            
    except Exception as e:
        print(f"❌ Protected endpoint error: {e}")

def test_duplicate_signup(email, password):
    """Test duplicate signup (should fail)"""
    print("\n🧪 Testing Duplicate Signup (should fail)...")
    
    signup_data = {
        "userType": "jobSeeker",
        "firstName": "Test",
        "lastName": "User",
        "email": email,  # Same email
        "password": password,
        "phoneNumber": "+254700000000",
        "companyName": ""
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/signup",
            json=signup_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 400:
            print("✅ Duplicate signup correctly rejected")
        else:
            print("❌ Duplicate signup should have been rejected")
            
    except Exception as e:
        print(f"❌ Duplicate signup test error: {e}")

def main():
    """Run all tests"""
    print("🚀 RocketJobs Authentication Test Suite")
    print("=" * 50)
    
    # Test 1: Server health
    if not test_server_health():
        print("\n❌ Server is not running. Please start the backend first.")
        return
    
    # Test 2: User signup
    email, password = test_signup()
    if not email:
        print("\n❌ Signup failed. Cannot continue with other tests.")
        return
    
    # Test 3: User login
    token = test_login(email, password)
    if not token:
        print("\n❌ Login failed. Cannot continue with other tests.")
        return
    
    # Test 4: Protected endpoint
    test_protected_endpoint(token)
    
    # Test 5: Duplicate signup
    test_duplicate_signup(email, password)
    
    print("\n🎉 All tests completed!")

if __name__ == "__main__":
    main()
