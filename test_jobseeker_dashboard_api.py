#!/usr/bin/env python3
"""
Test script for Job Seeker Dashboard API endpoints
Tests all backend APIs used by the new dashboard
"""

import requests
import json

# Configuration
BASE_URL = "http://localhost:3002/api"
TOKEN = None  # Will be set after login

def login_test_user():
    """Login and get token"""
    global TOKEN
    print("=" * 60)
    print("🔐 Testing Login...")
    print("=" * 60)
    
    # Try to login with test credentials
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json={
            "email": "test@test.com",  # Update with your test credentials
            "password": "test123"
        })
        
        if response.status_code == 200:
            data = response.json()
            TOKEN = data.get('token') or data.get('access_token')
            print(f"✅ Login successful! Token obtained.")
            return True
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False

def test_endpoint(name, method, url, expected_status=200):
    """Test a single endpoint"""
    try:
        headers = {
            'Authorization': f'Bearer {TOKEN}',
            'Content-Type': 'application/json'
        }
        
        if method == 'GET':
            response = requests.get(url, headers=headers)
        elif method == 'POST':
            response = requests.post(url, headers=headers, json={})
        else:
            response = requests.request(method, url, headers=headers)
        
        status = "✅" if response.status_code == expected_status else "❌"
        print(f"{status} {name}")
        print(f"   URL: {url}")
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                if isinstance(data, list):
                    print(f"   Data: {len(data)} items")
                elif isinstance(data, dict):
                    print(f"   Keys: {list(data.keys())}")
            except:
                print(f"   Response: {response.text[:100]}...")
        else:
            print(f"   Error: {response.text[:200]}")
        
        print()
        return response.status_code == expected_status
    except Exception as e:
        print(f"❌ {name}")
        print(f"   Error: {e}\n")
        return False

def test_all_endpoints():
    """Test all Job Seeker Dashboard endpoints"""
    print("\n" + "=" * 60)
    print("🧪 TESTING JOB SEEKER DASHBOARD API ENDPOINTS")
    print("=" * 60 + "\n")
    
    results = []
    
    # Profile Endpoints
    print("📋 PROFILE ENDPOINTS:")
    print("-" * 60)
    results.append(test_endpoint("Get Profile", "GET", f"{BASE_URL}/profile/profile"))
    results.append(test_endpoint("Get Profile Views", "GET", f"{BASE_URL}/dashboard/profile/views"))
    
    # Application Endpoints
    print("📄 APPLICATION ENDPOINTS:")
    print("-" * 60)
    results.append(test_endpoint("Get My Applications", "GET", f"{BASE_URL}/applications/my-applications"))
    
    # Job Endpoints
    print("💼 JOB ENDPOINTS:")
    print("-" * 60)
    results.append(test_endpoint("Get All Jobs", "GET", f"{BASE_URL}/jobs/get_jobs"))
    results.append(test_endpoint("Get Saved Jobs", "GET", f"{BASE_URL}/jobs/saved"))
    results.append(test_endpoint("Get Recommended Jobs", "GET", f"{BASE_URL}/jobs/recommended"))
    
    # Interview Endpoints
    print("📅 INTERVIEW ENDPOINTS:")
    print("-" * 60)
    results.append(test_endpoint("Get Interviews", "GET", f"{BASE_URL}/interviews"))
    
    # Dashboard Endpoints
    print("📊 DASHBOARD ENDPOINTS:")
    print("-" * 60)
    results.append(test_endpoint("Get Network Activity", "GET", f"{BASE_URL}/dashboard/network/activity"))
    results.append(test_endpoint("Get Portfolio Items", "GET", f"{BASE_URL}/dashboard/portfolio/items"))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    percentage = (passed / total * 100) if total > 0 else 0
    
    print(f"\nTotal Tests: {total}")
    print(f"Passed: {passed} ✅")
    print(f"Failed: {total - passed} ❌")
    print(f"Success Rate: {percentage:.1f}%")
    
    if percentage == 100:
        print("\n🎉 ALL TESTS PASSED!")
    elif percentage >= 70:
        print("\n⚠️  MOST TESTS PASSED - Some endpoints need fixes")
    else:
        print("\n🚨 MANY TESTS FAILED - Backend needs attention")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    print("""
╔══════════════════════════════════════════════════════════════╗
║  JOB SEEKER DASHBOARD API TEST SUITE                         ║
║  Tests all backend endpoints used by the dashboard           ║
╚══════════════════════════════════════════════════════════════╝
    """)
    
    # Login first
    if login_test_user():
        # Run tests
        test_all_endpoints()
    else:
        print("\n❌ Cannot proceed without valid authentication")
        print("\n📝 To run tests:")
        print("   1. Update test credentials in login_test_user()")
        print("   2. Ensure backend is running on port 3002")
        print("   3. Run: python test_jobseeker_dashboard_api.py")

