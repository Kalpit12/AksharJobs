#!/usr/bin/env python3
"""
Simple test script to test resume upload endpoint directly
"""
import requests
import json

def test_resume_upload():
    """Test the resume upload endpoint directly"""
    print("🧪 Testing Resume Upload Endpoint Directly")
    
    # Test the endpoint without authentication first
    url = "http://localhost:3002/api/resumes/upload"
    
    print(f"📡 Testing URL: {url}")
    
    try:
        # Test with a simple POST request (no file, no auth)
        response = requests.post(url, timeout=10)
        print(f"📊 Response Status: {response.status_code}")
        print(f"📊 Response Headers: {dict(response.headers)}")
        
        if response.status_code == 401:
            print("✅ Expected: 401 Unauthorized (no JWT token)")
            print("🔐 This means the endpoint is working, just needs authentication")
        elif response.status_code == 400:
            print("✅ Expected: 400 Bad Request (no file provided)")
            print("📁 This means the endpoint is working, just needs a file")
        elif response.status_code == 500:
            print("❌ 500 Internal Server Error - Endpoint is crashing")
            print("📝 Response content:")
            try:
                print(json.dumps(response.json(), indent=2))
            except:
                print(response.text)
        else:
            print(f"❓ Unexpected status code: {response.status_code}")
            print(f"📝 Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error - Backend server not running")
    except requests.exceptions.Timeout:
        print("❌ Timeout Error - Request took too long")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

def test_resume_test_endpoint():
    """Test the test endpoint to make sure the route is working"""
    print("\n🧪 Testing Resume Test Endpoint")
    
    url = "http://localhost:3002/api/resumes/test"
    
    try:
        response = requests.get(url, timeout=10)
        print(f"📊 Test endpoint status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Test endpoint working")
            try:
                data = response.json()
                print(f"📝 Response: {json.dumps(data, indent=2)}")
            except:
                print(f"📝 Response: {response.text}")
        else:
            print(f"❌ Test endpoint failed: {response.status_code}")
            print(f"📝 Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Test endpoint error: {e}")

def main():
    """Run all tests"""
    print("🚀 Starting Resume Upload Endpoint Tests\n")
    
    test_resume_test_endpoint()
    test_resume_upload()
    
    print("\n📋 Summary:")
    print("- If you get 401: Endpoint works, needs JWT token")
    print("- If you get 400: Endpoint works, needs file")
    print("- If you get 500: Endpoint is crashing - check backend logs")
    print("- If you get connection error: Backend not running")

if __name__ == "__main__":
    main()
