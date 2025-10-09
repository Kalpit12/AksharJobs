#!/usr/bin/env python3
"""Test login functionality"""

import requests
import json

def test_login():
    base_url = "http://localhost:3002"
    
    # Test recruiter login
    recruiter_credentials = {
        "email": "sarah.johnson@techcorp.com",
        "password": "password123"  # Common test password
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/auth/login",
            json=recruiter_credentials,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Login successful!")
            print(f"Token: {data.get('token', 'No token')[:50]}...")
            print(f"User ID: {data.get('userId', 'No user ID')}")
            print(f"Role: {data.get('role', 'No role')}")
            return data.get('token')
        else:
            print("Login failed")
            
    except Exception as e:
        print(f"Error: {e}")
    
    return None

if __name__ == "__main__":
    test_login()
