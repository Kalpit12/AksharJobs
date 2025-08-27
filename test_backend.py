#!/usr/bin/env python3
"""
Simple test script to verify backend functionality
"""

import requests
import json

def test_backend():
    base_url = "http://localhost:3002"
    
    print("🔧 Testing Backend Functionality...")
    print("=" * 50)
    
    # Test 1: Basic health check
    print("\n1️⃣ Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Response: {json.dumps(data, indent=2)}")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Failed: {str(e)}")
    
    # Test 2: Test CORS endpoint
    print("\n2️⃣ Testing CORS endpoint...")
    try:
        response = requests.get(f"{base_url}/test-cors")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Response: {json.dumps(data, indent=2)}")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Failed: {str(e)}")
    
    # Test 3: Test login endpoint (should fail with no data, but shouldn't crash)
    print("\n3️⃣ Testing login endpoint...")
    try:
        response = requests.post(f"{base_url}/api/auth/login", 
                               json={"email": "test@test.com", "password": "test"})
        print(f"   Status: {response.status_code}")
        if response.status_code == 401:
            print("   ✅ Expected: Invalid credentials (401)")
        else:
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"   ❌ Failed: {str(e)}")
    
    # Test 4: Test OPTIONS request (CORS preflight)
    print("\n4️⃣ Testing OPTIONS request...")
    try:
        response = requests.options(f"{base_url}/api/auth/login")
        print(f"   Status: {response.status_code}")
        print(f"   CORS Headers:")
        for header, value in response.headers.items():
            if 'access-control' in header.lower():
                print(f"     {header}: {value}")
    except Exception as e:
        print(f"   ❌ Failed: {str(e)}")
    
    print("\n" + "=" * 50)
    print("✅ Backend testing completed!")

if __name__ == "__main__":
    test_backend()
