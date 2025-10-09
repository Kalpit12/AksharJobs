#!/usr/bin/env python3
"""
Test script to simulate Google OAuth flow and test promo code creation
"""

import requests
import json
from datetime import datetime

# Test configuration
BASE_URL = "http://localhost:3002"
TEST_EMAIL = "testuser123@gmail.com"
TEST_FIRST_NAME = "Kalpit"
TEST_LAST_NAME = "Patel"
TEST_USER_TYPE = "jobSeeker"

def test_oauth_signup():
    """Test OAuth signup with promo code creation"""
    print("🧪 Testing OAuth signup with promo code creation...")
    
    # Step 1: Test OAuth signup endpoint
    signup_data = {
        "email": TEST_EMAIL,
        "first_name": TEST_FIRST_NAME,
        "last_name": TEST_LAST_NAME,
        "profile_picture": "https://example.com/profile.jpg",
        "google_id": "test_google_id_123",
        "provider": "google",
        "userType": TEST_USER_TYPE
    }
    
    print(f"📝 Sending signup data: {signup_data}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/oauth/signup",
            json=signup_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"📊 Response status: {response.status_code}")
        print(f"📄 Response data: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("✅ OAuth signup successful!")
                print(f"🔑 Token: {data.get('token', 'No token')}")
                print(f"👤 User: {data.get('user', {})}")
                
                # Step 2: Test promo code creation
                user_id = data.get('user', {}).get('id')
                if user_id:
                    print(f"\n🎫 Testing promo code creation for user {user_id}...")
                    test_promo_code_creation(user_id, data.get('token'))
                else:
                    print("❌ No user ID found in response")
            else:
                print(f"❌ OAuth signup failed: {data.get('message', 'Unknown error')}")
        else:
            print(f"❌ OAuth signup failed with status {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error during OAuth signup test: {e}")

def test_promo_code_creation(user_id, token):
    """Test promo code creation for a user"""
    print(f"🎫 Testing promo code creation for user {user_id}...")
    
    try:
        # Test get_my_promo_code endpoint
        response = requests.get(
            f"{BASE_URL}/api/promo/get_my_promo_code",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )
        
        print(f"📊 Promo code response status: {response.status_code}")
        print(f"📄 Promo code response data: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("✅ Promo code found!")
                print(f"🎫 Promo code: {data.get('promo_code', {})}")
            else:
                print(f"ℹ️ No promo code found: {data.get('error', 'Unknown error')}")
                
                # Try to create a promo code
                print("🔨 Attempting to create promo code...")
                create_response = requests.post(
                    f"{BASE_URL}/api/promo/create_promo_code",
                    json={
                        "firstName": TEST_FIRST_NAME,
                        "lastName": TEST_LAST_NAME,
                        "userType": TEST_USER_TYPE
                    },
                    headers={
                        "Authorization": f"Bearer {token}",
                        "Content-Type": "application/json"
                    }
                )
                
                print(f"📊 Create promo code response status: {create_response.status_code}")
                print(f"📄 Create promo code response data: {create_response.json()}")
                
        else:
            print(f"❌ Promo code request failed with status {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error during promo code test: {e}")

def test_health():
    """Test backend health"""
    print("🏥 Testing backend health...")
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"📊 Health check status: {response.status_code}")
        print(f"📄 Health check data: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Backend is healthy!")
            return True
        else:
            print("❌ Backend is not healthy!")
            return False
            
    except Exception as e:
        print(f"❌ Error during health check: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 Starting OAuth and Promo Code Integration Test")
    print("=" * 60)
    
    # Test 1: Health check
    if not test_health():
        print("❌ Backend is not running. Please start the backend server first.")
        return
    
    print("\n" + "=" * 60)
    
    # Test 2: OAuth signup with promo code creation
    test_oauth_signup()
    
    print("\n" + "=" * 60)
    print("🏁 Test completed!")

if __name__ == "__main__":
    main()
