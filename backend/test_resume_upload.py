#!/usr/bin/env python3
"""
Test script to verify resume upload functionality
"""

import requests
import json
import os

def test_resume_upload():
    """Test resume upload functionality"""
    base_url = "http://localhost:3002"
    
    print("🔍 Testing Resume Upload Functionality")
    print("=" * 50)
    
    # Test 1: Check if server is running
    try:
        response = requests.get(f"{base_url}/api/modern-resumes/health")
        print(f"✅ Server health check: {response.status_code}")
        if response.status_code == 200:
            health_data = response.json()
            print(f"   📊 Database: {health_data.get('database', 'unknown')}")
            print(f"   🤖 Gemini AI: {health_data.get('gemini_ai', 'unknown')}")
    except Exception as e:
        print(f"❌ Server health check failed: {e}")
        return
    
    # Test 2: Try to login and get a valid token
    print("\n👤 Testing Authentication:")
    try:
        login_data = {
            "email": "kalpit.patel@example.com",
            "password": "password123"
        }
        
        response = requests.post(f"{base_url}/api/auth/login", json=login_data)
        if response.status_code == 200:
            login_response = response.json()
            token = login_response.get('token')
            if token:
                print("   ✅ Login successful, got valid token")
                print(f"   🔑 Token length: {len(token)}")
                
                # Test 3: Test resume upload with valid token
                print("\n📄 Testing Resume Upload:")
                test_resume_upload_with_token(base_url, token)
                
            else:
                print("   ❌ Login successful but no token received")
        else:
            print(f"   ❌ Login failed: {response.status_code}")
            print(f"   📝 Response: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Authentication test failed: {e}")

def test_resume_upload_with_token(base_url, token):
    """Test resume upload with a valid token"""
    try:
        # Create a simple test file
        test_content = "This is a test resume content for testing purposes.\n\nName: Test User\nEmail: test@example.com\nSkills: Python, JavaScript, React\nExperience: 3 years in software development"
        
        # Create test file
        test_file_path = "test_resume.txt"
        with open(test_file_path, "w") as f:
            f.write(test_content)
        
        print("   📝 Created test resume file")
        
        # Prepare the upload request
        headers = {
            "Authorization": f"Bearer {token}"
        }
        
        with open(test_file_path, "rb") as f:
            files = {"resume": ("test_resume.txt", f, "text/plain")}
            
            print("   📤 Sending upload request...")
            response = requests.post(
                f"{base_url}/api/modern-resumes/upload",
                headers=headers,
                files=files
            )
        
        # Clean up test file
        try:
            os.remove(test_file_path)
            print("   🧹 Cleaned up test file")
        except:
            pass
        
        if response.status_code == 200:
            result = response.json()
            print("   ✅ Resume upload successful!")
            print(f"   📊 Processing method: {result.get('processing_method', 'unknown')}")
            print(f"   🤖 AI processed: {result.get('ai_processed', 'unknown')}")
            print(f"   📁 File info: {result.get('file_info', {})}")
        else:
            print(f"   ❌ Resume upload failed: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   📝 Error details: {error_data.get('error', 'Unknown error')}")
                if 'details' in error_data:
                    print(f"   🔍 Technical details: {error_data['details']}")
            except:
                print(f"   📝 Response text: {response.text}")
                
    except Exception as e:
        print(f"   ❌ Resume upload test failed: {e}")

if __name__ == "__main__":
    test_resume_upload()
