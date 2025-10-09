#!/usr/bin/env python3
"""
Final Unified Server Test for AksharJobs
Tests that static files are now being served correctly
"""

import requests
import json
from datetime import datetime

# Configuration
UNIFIED_URL = "http://192.168.1.145:3002"

def test_endpoint(method, endpoint, data=None, headers=None, description=""):
    """Test a single endpoint and return results"""
    url = f"{UNIFIED_URL}{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers=headers)
        else:
            return {"status": "error", "message": f"Unsupported method: {method}"}
        
        return {
            "status": "success" if response.status_code < 400 else "error",
            "status_code": response.status_code,
            "response_size": len(response.content),
            "description": description
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "description": description
        }

def main():
    """Run final unified server tests"""
    print("🎯 AksharJobs - Final Unified Server Testing")
    print("=" * 60)
    print(f"🌐 Unified URL: {UNIFIED_URL}")
    print(f"⏰ Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    results = []
    
    # 1. Test Main Page
    print("1️⃣ Testing Main Page...")
    results.append(test_endpoint("GET", "/", description="Main Frontend Page"))
    
    # 2. Test Static CSS Files
    print("2️⃣ Testing Static CSS Files...")
    results.append(test_endpoint("GET", "/static/css/main.0f7a31da.css", description="Main CSS File"))
    
    # 3. Test Static JavaScript Files
    print("3️⃣ Testing Static JavaScript Files...")
    results.append(test_endpoint("GET", "/static/js/main.255377ec.js", description="Main JavaScript File"))
    
    # 4. Test Root Files
    print("4️⃣ Testing Root Files...")
    results.append(test_endpoint("GET", "/RocketJobs_Logo.jpg", description="Logo Image"))
    results.append(test_endpoint("GET", "/manifest.json", description="Web App Manifest"))
    
    # 5. Test React Router Routes
    print("5️⃣ Testing React Router Routes...")
    results.append(test_endpoint("GET", "/login", description="Login Page Route"))
    results.append(test_endpoint("GET", "/dashboard", description="Dashboard Page Route"))
    
    # 6. Test Backend Health
    print("6️⃣ Testing Backend Health...")
    results.append(test_endpoint("GET", "/health", description="Backend Health Check"))
    
    # 7. Test Debug Endpoints
    print("7️⃣ Testing Debug Endpoints...")
    results.append(test_endpoint("GET", "/debug-static", description="Static Files Debug"))
    
    # Print Results
    print("\n📊 Test Results Summary")
    print("=" * 60)
    
    success_count = 0
    error_count = 0
    
    for i, result in enumerate(results, 1):
        status_icon = "✅" if result["status"] == "success" else "❌"
        status_text = result["status"].upper()
        
        print(f"{i:2d}. {status_icon} {status_text:8} - {result['description']}")
        
        if result["status"] == "success":
            success_count += 1
            if "status_code" in result:
                print(f"    📡 Status: {result['status_code']}")
            if "response_size" in result:
                print(f"    📏 Size: {result['response_size']} bytes")
        else:
            error_count += 1
            if "message" in result:
                print(f"    💥 Error: {result['message']}")
    
    # Summary
    print("\n" + "=" * 60)
    print(f"📈 SUMMARY:")
    print(f"   ✅ Successful: {success_count}")
    print(f"   ❌ Errors: {error_count}")
    print(f"   📊 Total: {len(results)}")
    
    if error_count == 0:
        print("\n🎉 All tests passed! Your unified server is fully functional!")
        print("\n🌐 Your website should now work perfectly at:")
        print(f"   {UNIFIED_URL}")
        print("\n✨ Features working:")
        print("   • ✅ Frontend pages (/, /login, /dashboard)")
        print("   • ✅ Static CSS files")
        print("   • ✅ Static JavaScript files")
        print("   • ✅ Images and assets")
        print("   • ✅ Backend API endpoints")
        print("   • ✅ Client-side routing")
    else:
        print(f"\n⚠️ {error_count} test(s) failed. Please check the errors above.")
    
    print(f"\n💡 Benefits of Unified Server:")
    print(f"   • Single URL for everything")
    print(f"   • No more 404 errors for static files")
    print(f"   • Perfect for production deployment")
    print(f"   • Easier for other devices to access")

if __name__ == "__main__":
    main()
