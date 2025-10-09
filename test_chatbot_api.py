#!/usr/bin/env python3
"""
Simple test script for Gemini Chatbot API
Run this to test the backend API endpoint
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://192.168.0.31:3002"
API_ENDPOINT = f"{BASE_URL}/api/chat/gemini"

# Test data
test_cases = [
    {
        "name": "Job Seeker - Resume Help",
        "data": {
            "message": "How do I optimize my resume for software engineering roles?",
            "userType": "jobSeeker",
            "userId": "test_user_123"
        }
    },
    {
        "name": "Recruiter - Interview Questions",
        "data": {
            "message": "What are good interview questions for a senior developer position?",
            "userType": "recruiter",
            "userId": "test_recruiter_456"
        }
    },
    {
        "name": "Job Seeker - Career Advice",
        "data": {
            "message": "I'm considering a career change from marketing to tech. What should I do?",
            "userType": "jobSeeker",
            "userId": "test_user_123"
        }
    },
    {
        "name": "Recruiter - Job Description",
        "data": {
            "message": "Help me write a job description for a data scientist role",
            "userType": "recruiter",
            "userId": "test_recruiter_456"
        }
    }
]

def test_api_endpoint():
    """Test the chatbot API endpoint"""
    print("🤖 Testing Gemini Chatbot API")
    print("=" * 50)
    
    # Test if server is running
    try:
        health_response = requests.get(f"{BASE_URL}/health", timeout=5)
        if health_response.status_code == 200:
            print("✅ Backend server is running")
        else:
            print("❌ Backend server health check failed")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to backend server: {e}")
        print("Make sure the backend is running on port 3002")
        return False
    
    # Test each case
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n🧪 Test {i}: {test_case['name']}")
        print("-" * 30)
        
        try:
            # Make API request
            start_time = time.time()
            response = requests.post(
                API_ENDPOINT,
                json=test_case['data'],
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            end_time = time.time()
            
            response_time = round((end_time - start_time) * 1000, 2)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Status: {response.status_code}")
                print(f"⏱️  Response time: {response_time}ms")
                print(f"🤖 AI Response: {data.get('response', 'No response')[:100]}...")
                print(f"📅 Timestamp: {data.get('timestamp', 'N/A')}")
                
                if 'error' in data:
                    print(f"⚠️  Warning: {data['error']}")
                    
            else:
                print(f"❌ Status: {response.status_code}")
                print(f"❌ Error: {response.text}")
                
        except requests.exceptions.Timeout:
            print("❌ Request timed out (>30s)")
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")
        except json.JSONDecodeError:
            print("❌ Invalid JSON response")
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
    
    print("\n" + "=" * 50)
    print("🏁 Testing complete!")
    print("\nNext steps:")
    print("1. Check if all tests passed")
    print("2. If any failed, check backend logs")
    print("3. Verify Gemini API key is set")
    print("4. Test the frontend chatbot interface")

def test_without_auth():
    """Test API without authentication (should fail gracefully)"""
    print("\n🔒 Testing without authentication...")
    
    try:
        response = requests.post(
            API_ENDPOINT,
            json={"message": "Hello", "userType": "jobSeeker"},
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 401:
            print("✅ Correctly requires authentication")
        else:
            print(f"⚠️  Unexpected status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🚀 Gemini Chatbot API Tester")
    print("Make sure your backend is running on port 3002")
    print("Make sure you have GEMINI_API_KEY set in your .env file")
    print()
    
    # Test with authentication
    test_api_endpoint()
    
    # Test without authentication
    test_without_auth()
    
    print("\n💡 To test the frontend:")
    print("1. Start the frontend: npm start")
    print("2. Open http://localhost:3003")
    print("3. Click the AI Assistant button")
    print("4. Try asking questions!")
