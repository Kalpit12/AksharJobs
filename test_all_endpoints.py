#!/usr/bin/env python3
"""
Comprehensive Endpoint Testing for AksharJobs
Tests all critical functionality for user testing
"""

import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://192.168.1.145:3002"
TEST_EMAIL = "Mananpatelj12@gmail.com"
TEST_PASSWORD = "password123"

def test_endpoint(method, endpoint, data=None, headers=None, description=""):
    """Test a single endpoint and return results"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers=headers)
        elif method.upper() == "PUT":
            response = requests.put(url, json=data, headers=headers)
        else:
            return {"status": "error", "message": f"Unsupported method: {method}"}
        
        return {
            "status": "success" if response.status_code < 400 else "error",
            "status_code": response.status_code,
            "response": response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text[:200],
            "description": description
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "description": description
        }

def main():
    """Run comprehensive endpoint tests"""
    print("🚀 AksharJobs - Comprehensive Endpoint Testing")
    print("=" * 60)
    print(f"🌐 Base URL: {BASE_URL}")
    print(f"📧 Test Email: {TEST_EMAIL}")
    print(f"⏰ Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    results = []
    
    # 1. Health Check
    print("1️⃣ Testing Health Endpoints...")
    results.append(test_endpoint("GET", "/health", description="Backend Health Check"))
    results.append(test_endpoint("GET", "/api/modern-resumes/health", description="Resume Service Health"))
    
    # 2. Authentication
    print("2️⃣ Testing Authentication...")
    login_data = {"email": TEST_EMAIL, "password": TEST_PASSWORD}
    login_result = test_endpoint("POST", "/api/auth/login", data=login_data, description="User Login")
    results.append(login_result)
    
    # Extract token if login successful
    token = None
    if login_result["status"] == "success" and login_result["status_code"] == 200:
        try:
            response_data = login_result["response"]
            if isinstance(response_data, dict) and "token" in response_data:
                token = response_data["token"]
                print(f"✅ Login successful! Token obtained.")
            else:
                print(f"⚠️ Login response doesn't contain token: {response_data}")
        except Exception as e:
            print(f"❌ Error extracting token: {e}")
    
    # Set up headers for authenticated requests
    auth_headers = {"Authorization": f"Bearer {token}"} if token else {}
    
    # 3. Job Endpoints
    print("3️⃣ Testing Job Endpoints...")
    results.append(test_endpoint("GET", "/api/jobs/test", description="Jobs Service Test"))
    results.append(test_endpoint("GET", "/api/jobs/get_jobs", description="Get All Jobs"))
    
    # 4. Resume Endpoints
    print("4️⃣ Testing Resume Endpoints...")
    results.append(test_endpoint("GET", "/api/modern-resumes/test", description="Resume Service Test"))
    
    # 5. Application Endpoints (with auth)
    print("5️⃣ Testing Application Endpoints...")
    if token:
        results.append(test_endpoint("GET", "/api/applications/my-applications", headers=auth_headers, description="Get User Applications"))
    else:
        results.append({"status": "skipped", "description": "Get User Applications (no token)"})
    
    # 6. User Profile
    print("6️⃣ Testing User Profile...")
    if token:
        results.append(test_endpoint("GET", "/api/auth/me", headers=auth_headers, description="Get Current User Profile"))
    else:
        results.append({"status": "skipped", "description": "Get Current User Profile (no token)"})
    
    # 7. Test CORS
    print("7️⃣ Testing CORS...")
    results.append(test_endpoint("GET", "/test-cors", description="CORS Test"))
    
    # Print Results
    print("\n📊 Test Results Summary")
    print("=" * 60)
    
    success_count = 0
    error_count = 0
    skipped_count = 0
    
    for i, result in enumerate(results, 1):
        status_icon = "✅" if result["status"] == "success" else "❌" if result["status"] == "error" else "⏭️"
        status_text = result["status"].upper()
        
        print(f"{i:2d}. {status_icon} {status_text:8} - {result['description']}")
        
        if result["status"] == "success":
            success_count += 1
            if "status_code" in result:
                print(f"    📡 Status: {result['status_code']}")
        elif result["status"] == "error":
            error_count += 1
            if "message" in result:
                print(f"    💥 Error: {result['message']}")
        else:
            skipped_count += 1
    
    # Summary
    print("\n" + "=" * 60)
    print(f"📈 SUMMARY:")
    print(f"   ✅ Successful: {success_count}")
    print(f"   ❌ Errors: {error_count}")
    print(f"   ⏭️ Skipped: {skipped_count}")
    print(f"   📊 Total: {len(results)}")
    
    if error_count == 0:
        print("\n🎉 All tests passed! Your AksharJobs system is fully functional!")
    else:
        print(f"\n⚠️ {error_count} test(s) failed. Please check the errors above.")
    
    print(f"\n🌐 Your website is accessible at: http://192.168.1.145:3003")
    print(f"🔧 Backend API at: http://192.168.1.145:3002")
    print(f"📱 Test with: {TEST_EMAIL} / {TEST_PASSWORD}")

if __name__ == "__main__":
    main()
