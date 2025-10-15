#!/usr/bin/env python3
"""
Debug script to check what data is being sent and received
"""

import requests
import json

# Configuration
BASE_URL = "http://13.61.35.12"
API_BASE = f"{BASE_URL}/api"

def debug_profile_submission():
    """Debug the profile submission process"""
    
    print("🔍 Debugging Profile Submission Process")
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
        
        # Test simple data submission
        simple_test_data = {
            "firstName": "Test",
            "lastName": "User",
            "nationality": "American",
            "residentCountry": "United States",
            "professionalSummary": "Test summary",
            "tools": ["VS Code", "Git"],
            "memberships": ["IEEE"]
        }
        
        print(f"📤 Sending test data: {simple_test_data}")
        
        # Submit data
        response = requests.put(
            f"{API_BASE}/profile/profile",
            json=simple_test_data,
            headers=headers
        )
        
        print(f"📥 Response status: {response.status_code}")
        print(f"📥 Response data: {response.json()}")
        
        # Retrieve data
        get_response = requests.get(f"{API_BASE}/profile/profile", headers=headers)
        if get_response.status_code == 200:
            saved_data = get_response.json()
            print(f"📋 Retrieved data:")
            for key, value in simple_test_data.items():
                saved_value = saved_data.get(key, "NOT_FOUND")
                print(f"  {key}: Expected '{value}', Got '{saved_value}'")
        else:
            print(f"❌ Failed to retrieve data: {get_response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    debug_profile_submission()
