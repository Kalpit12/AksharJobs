#!/usr/bin/env python3
"""
Test script to verify JWT authentication
"""

import requests
import json

def test_jwt_auth():
    """Test JWT authentication flow"""
    base_url = "http://localhost:3002"
    
    print("🔍 Testing JWT Authentication Flow")
    print("=" * 40)
    
    # Test 1: Check if server is running
    try:
        response = requests.get(f"{base_url}/api/modern-resumes/health")
        print(f"✅ Server test endpoint: {response.status_code}")
    except Exception as e:
        print(f"❌ Server not accessible: {e}")
        return
    
    # Test 2: Try to access protected endpoint without token
    try:
        response = requests.get(f"{base_url}/api/modern-resumes/profile")
        print(f"✅ Protected endpoint without token: {response.status_code} (should be 401)")
        if response.status_code == 401:
            print("   ✅ Correctly rejected unauthorized request")
        else:
            print("   ❌ Should have rejected unauthorized request")
    except Exception as e:
        print(f"❌ Protected endpoint test failed: {e}")
    
    # Test 3: Try to access protected endpoint with invalid token
    try:
        headers = {"Authorization": "Bearer invalid_token_here"}
        response = requests.get(f"{base_url}/api/modern-resumes/profile", headers=headers)
        print(f"✅ Protected endpoint with invalid token: {response.status_code} (should be 401)")
        if response.status_code == 401:
            print("   ✅ Correctly rejected invalid token")
        else:
            print("   ❌ Should have rejected invalid token")
    except Exception as e:
        print(f"❌ Invalid token test failed: {e}")
    
    print("\n✅ JWT Authentication test completed!")
    print("\n📝 Next steps:")
    print("1. Make sure you're logged in on the frontend")
    print("2. Check browser console for any errors")
    print("3. Try uploading a resume again")
    print("4. Check if the data appears on the dashboard")

if __name__ == "__main__":
    test_jwt_auth()
