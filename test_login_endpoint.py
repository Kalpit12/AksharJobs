#!/usr/bin/env python3
"""
Test the login endpoint directly
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))

import requests
import json

def test_login_endpoint():
    """Test login with known credentials"""
    
    print("=" * 80)
    print("🔐 TESTING LOGIN ENDPOINT")
    print("=" * 80)
    print()
    
    # Test credentials
    test_users = [
        {"email": "admin@example.com", "password": "Test@123", "type": "Admin"},
        {"email": "test@example.com", "password": "Test@123", "type": "Job Seeker"},
        {"email": "sarah.johnson@techcorp.com", "password": "Test@123", "type": "Recruiter"},
        {"email": "intern@test.com", "password": "Test@123", "type": "Intern"},
    ]
    
    backend_url = "http://localhost:3002"
    
    print(f"🔌 Testing backend at: {backend_url}")
    print()
    
    # First, check if backend is running
    try:
        health_response = requests.get(f"{backend_url}/api/health", timeout=5)
        print(f"✅ Backend is running! Status: {health_response.status_code}")
        print()
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Backend is NOT running!")
        print()
        print("Please start the backend first:")
        print("   cd backend")
        print("   python app.py")
        print()
        return False
    except Exception as e:
        print(f"❌ Error checking backend: {e}")
        return False
    
    # Test login for each user type
    for user in test_users:
        print("─" * 80)
        print(f"Testing: {user['type']} ({user['email']})")
        print("─" * 80)
        
        try:
            response = requests.post(
                f"{backend_url}/api/auth/login",
                json={
                    "email": user["email"],
                    "password": user["password"]
                },
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print("✅ LOGIN SUCCESSFUL!")
                print(f"   Token: {data.get('token', 'N/A')[:50]}...")
                print(f"   Role: {data.get('role', 'N/A')}")
                print(f"   User ID: {data.get('userId', 'N/A')}")
                print(f"   Name: {data.get('firstName', '')} {data.get('lastName', '')}")
            else:
                print(f"❌ LOGIN FAILED!")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Response: {response.text}")
            
            print()
            
        except requests.exceptions.Timeout:
            print("❌ Request timed out!")
            print("   Backend might be slow or hanging")
            print()
        except Exception as e:
            print(f"❌ Error: {e}")
            print()
    
    print("=" * 80)
    print("🔍 DEBUGGING TIPS")
    print("=" * 80)
    print()
    print("If logins are failing:")
    print("1. Check backend terminal for error messages")
    print("2. Verify MongoDB is running")
    print("3. Check if passwords were properly set")
    print("4. Review backend/services/auth_service.py")
    print()
    
    return True

if __name__ == "__main__":
    test_login_endpoint()

