#!/usr/bin/env python3
"""
Simple test script to verify backend authentication
Uses only built-in modules
"""

import urllib.request
import urllib.parse
import json

def test_backend_health():
    """Test if backend is accessible"""
    try:
        response = urllib.request.urlopen("http://localhost:5000/")
        print(f"✅ Backend Health Check: {response.getcode()}")
        print(f"Response: {response.read().decode()}")
        return True
    except Exception as e:
        print(f"❌ Backend Health Check Failed: {e}")
        return False

def test_login_endpoint():
    """Test login endpoint with test credentials"""
    try:
        # Test credentials
        test_data = {
            "email": "john.doe@example.com",
            "password": "password123"
        }
        
        # Convert to JSON
        data = json.dumps(test_data).encode('utf-8')
        
        # Create request
        req = urllib.request.Request(
            "http://localhost:5000/api/auth/login",
            data=data,
            headers={'Content-Type': 'application/json'}
        )
        
        # Send request
        response = urllib.request.urlopen(req)
        
        print(f"✅ Login Test: {response.getcode()}")
        print(f"Response: {response.read().decode()}")
        return True
        
    except urllib.error.HTTPError as e:
        print(f"❌ Login Test Failed: HTTP {e.code}")
        print(f"Response: {e.read().decode()}")
        return False
    except Exception as e:
        print(f"❌ Login Test Failed: {e}")
        return False

def test_signup_endpoint():
    """Test signup endpoint"""
    try:
        # Test data
        test_data = {
            "userType": "jobSeeker",
            "firstName": "Test",
            "lastName": "User",
            "email": "test@example.com",
            "password": "testpassword123",
            "phoneNumber": "1234567890"
        }
        
        # Convert to JSON
        data = json.dumps(test_data).encode('utf-8')
        
        # Create request
        req = urllib.request.Request(
            "http://localhost:5000/api/auth/signup",
            data=data,
            headers={'Content-Type': 'application/json'}
        )
        
        # Send request
        response = urllib.request.urlopen(req)
        
        print(f"✅ Signup Test: {response.getcode()}")
        print(f"Response: {response.read().decode()}")
        return True
        
    except urllib.error.HTTPError as e:
        print(f"❌ Signup Test Failed: HTTP {e.code}")
        print(f"Response: {e.read().decode()}")
        return False
    except Exception as e:
        print(f"❌ Signup Test Failed: {e}")
        return False

def main():
    print("🧪 Testing Backend Authentication...")
    print("=" * 50)
    
    # Test backend health
    if not test_backend_health():
        print("\n❌ Backend is not accessible. Make sure it's running!")
        return
    
    print("\n" + "=" * 50)
    
    # Test signup
    test_signup_endpoint()
    
    print("\n" + "=" * 50)
    
    # Test login
    test_login_endpoint()
    
    print("\n" + "=" * 50)
    print("🎯 Test completed! Check the results above.")

if __name__ == "__main__":
    main()
