#!/usr/bin/env python3
"""
Test script to check what fields are actually supported by the backend
"""

import requests
import json

# Configuration
BASE_URL = "http://13.61.35.12"
API_BASE = f"{BASE_URL}/api"

def test_backend_field_support():
    """Test what fields the backend actually supports"""
    
    print("🔍 Testing Backend Field Support")
    print("=" * 50)
    
    # Test authentication
    auth_data = {
        "email": "Hemant.patel@maxproinfotech.com",
        "password": "test123"
    }
    
    try:
        # Login
        login_response = requests.post(f"{API_BASE}/auth/login", json=auth_data)
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.status_code}")
            return
            
        token = login_response.json().get('token')
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test a single field that should work
        test_data = {
            "nationality": "Test Nationality"
        }
        
        print(f"📤 Testing single field: {test_data}")
        
        # Submit data
        response = requests.put(
            f"{API_BASE}/profile/profile",
            json=test_data,
            headers=headers
        )
        
        print(f"📥 Response status: {response.status_code}")
        print(f"📥 Response data: {response.json()}")
        
        # Retrieve data
        get_response = requests.get(f"{API_BASE}/profile/profile", headers=headers)
        if get_response.status_code == 200:
            saved_data = get_response.json()
            nationality_value = saved_data.get('nationality', "NOT_FOUND")
            print(f"📋 Retrieved nationality: '{nationality_value}'")
            
            # Check if the field was saved
            if nationality_value == "Test Nationality":
                print("✅ Field support is working!")
                return True
            else:
                print("❌ Field support is NOT working")
                return False
        else:
            print(f"❌ Failed to retrieve data: {get_response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def check_backend_version():
    """Check what version of the backend is running"""
    
    print("\n🔍 Checking Backend Version")
    print("=" * 50)
    
    try:
        # Try to access a simple endpoint
        response = requests.get(f"{BASE_URL}/api/health", timeout=5)
        print(f"Health check status: {response.status_code}")
        
        # Check if we can access the profile endpoint without auth
        response = requests.get(f"{BASE_URL}/api/profile/profile")
        print(f"Profile endpoint status (no auth): {response.status_code}")
        
        # Check server info
        response = requests.get(f"{BASE_URL}/")
        print(f"Root endpoint status: {response.status_code}")
        
    except Exception as e:
        print(f"❌ Error checking backend: {e}")

if __name__ == "__main__":
    check_backend_version()
    field_support = test_backend_field_support()
    
    if field_support:
        print("\n✅ Backend field support is working!")
        print("The issue might be with the test data or field mapping.")
    else:
        print("\n❌ Backend field support is NOT working!")
        print("The backend server is not running the updated code.")
