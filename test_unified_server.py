#!/usr/bin/env python3
"""
Unified Server Testing for AksharJobs
Tests both frontend and backend from a single URL
"""

import requests
import json
from datetime import datetime

# Configuration
UNIFIED_URL = "http://192.168.1.145:3002"
TEST_EMAIL = "Mananpatelj12@gmail.com"
TEST_PASSWORD = "password123"

def test_endpoint(method, endpoint, data=None, headers=None, description=""):
    """Test a single endpoint and return results"""
    url = f"{UNIFIED_URL}{endpoint}"
    
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
            "response": response.text[:200] if response.status_code == 200 else response.text[:100],
            "description": description
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "description": description
        }

def main():
    """Run comprehensive unified server tests"""
    print("🚀 AksharJobs - Unified Server Testing")
    print("=" * 60)
    print(f"🌐 Unified URL: {UNIFIED_URL}")
    print(f"📧 Test Email: {TEST_EMAIL}")
    print(f"⏰ Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    results = []
    
    # 1. Frontend Routes
    print("1️⃣ Testing Frontend Routes...")
    results.append(test_endpoint("GET", "/", description="Main Frontend Page"))
    results.append(test_endpoint("GET", "/login", description="Login Page"))
    results.append(test_endpoint("GET", "/signup", description="Signup Page"))
    results.append(test_endpoint("GET", "/dashboard", description="Dashboard Page"))
    
    # 2. Backend Health
    print("2️⃣ Testing Backend Health...")
    results.append(test_endpoint("GET", "/health", description="Backend Health Check"))
    results.append(test_endpoint("GET", "/api/modern-resumes/health", description="Resume Service Health"))
    
    # 3. Authentication
    print("3️⃣ Testing Authentication...")
    login_data = {"email": TEST_EMAIL, "password": TEST_PASSWORD}
    login_result = test_endpoint("POST", "/api/auth/login", data=login_data, description="User Login")
    results.append(login_result)
    
    # Extract token if login successful
    token = None
    if login_result["status"] == "success" and login_result["status_code"] == 200:
        try:
            response_data = login_result["response"]
            if "token" in response_data:
                token = response_data["token"]
                print(f"✅ Login successful! Token obtained.")
            else:
                print(f"⚠️ Login response doesn't contain token: {response_data}")
        except Exception as e:
            print(f"❌ Error extracting token: {e}")
    
    # Set up headers for authenticated requests
    auth_headers = {"Authorization": f"Bearer {token}"} if token else {}
    
    # 4. Job Endpoints
    print("4️⃣ Testing Job Endpoints...")
    results.append(test_endpoint("GET", "/api/jobs/test", description="Jobs Service Test"))
    results.append(test_endpoint("GET", "/api/jobs/get_jobs", description="Get All Jobs"))
    
    # 5. Resume Endpoints
    print("5️⃣ Testing Resume Endpoints...")
    results.append(test_endpoint("GET", "/api/modern-resumes/test", description="Resume Service Test"))
    
    # 6. Application Endpoints (with auth)
    print("6️⃣ Testing Application Endpoints...")
    if token:
        results.append(test_endpoint("GET", "/api/applications/my-applications", headers=auth_headers, description="Get User Applications"))
    else:
        results.append({"status": "skipped", "description": "Get User Applications (no token)"})
    
    # 7. User Profile
    print("7️⃣ Testing User Profile...")
    if token:
        results.append(test_endpoint("GET", "/api/auth/me", headers=auth_headers, description="Get Current User Profile"))
    else:
        results.append({"status": "skipped", "description": "Get Current User Profile (no token)"})
    
    # 8. Test CORS
    print("8️⃣ Testing CORS...")
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
        print("\n🎉 All tests passed! Your unified server is fully functional!")
    else:
        print(f"\n⚠️ {error_count} test(s) failed. Please check the errors above.")
    
    print(f"\n🌐 Your unified website is accessible at: {UNIFIED_URL}")
    print(f"📱 Test with: {TEST_EMAIL} / {TEST_PASSWORD}")
    print(f"\n💡 Benefits of Unified Server:")
    print(f"   • Single URL for everything")
    print(f"   • No need to run frontend separately")
    print(f"   • Easier for other devices to access")
    print(f"   • Better for production deployment")

if __name__ == "__main__":
    main()
