#!/usr/bin/env python3
"""
Test the exact login call that the frontend is making
"""

import requests
import json

def test_exact_login():
    """Test login exactly as frontend does it"""
    
    print("=" * 80)
    print("🧪 TESTING EXACT LOGIN CALL")
    print("=" * 80)
    print()
    
    backend_url = "http://localhost:3002"
    
    # Test the exact payload format
    test_cases = [
        {
            "email": "test@example.com",
            "password": "Test@123",
            "description": "Job Seeker (test@example.com)"
        },
        {
            "email": "admin@example.com", 
            "password": "Test@123",
            "description": "Admin (admin@example.com)"
        },
        {
            "email": "sarah.johnson@techcorp.com",
            "password": "Test@123",
            "description": "Recruiter (sarah.johnson@techcorp.com)"
        }
    ]
    
    for test in test_cases:
        print(f"Testing: {test['description']}")
        print(f"Payload: {json.dumps({'email': test['email'], 'password': test['password']}, indent=2)}")
        
        try:
            response = requests.post(
                f"{backend_url}/api/auth/login",
                json={
                    "email": test["email"],
                    "password": test["password"]
                },
                headers={
                    "Content-Type": "application/json"
                },
                timeout=10
            )
            
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ SUCCESS!")
                print(f"   Role: {data.get('role')}")
                print(f"   User ID: {data.get('userId')}")
            else:
                print(f"❌ FAILED!")
                print(f"   Response: {response.text}")
            
        except Exception as e:
            print(f"❌ Error: {e}")
        
        print()
        print("-" * 80)
        print()

if __name__ == "__main__":
    print("Make sure backend is running on http://localhost:3002")
    print()
    test_exact_login()

