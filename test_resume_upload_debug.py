#!/usr/bin/env python3
"""
Debug script to test resume upload functionality
"""
import requests
import json
from pathlib import Path

def test_resume_upload_with_auth():
    # Create a test PDF file
    test_file_path = Path("test_resume.txt")
    
    # Create a simple test resume content
    test_resume_content = """
    JOHN DOE
    Software Engineer
    john.doe@email.com
    +1234567890
    
    SUMMARY
    Experienced software engineer with 5 years in full-stack development.
    
    SKILLS
    - JavaScript, Python, React, Node.js
    - MongoDB, PostgreSQL, AWS
    - Git, Docker, Kubernetes
    
    EXPERIENCE
    Senior Developer at TechCorp (2020-2023)
    - Developed web applications using React and Node.js
    - Led team of 5 developers
    - Implemented CI/CD pipelines
    
    EDUCATION
    Bachelor of Science in Computer Science
    University of Technology (2015-2019)
    """
    
    # Write test resume to file
    with open(test_file_path, "w", encoding="utf-8") as f:
        f.write(test_resume_content)
    
    try:
        print("=== Resume Upload Debug Test ===")
        
        # Test the health endpoint first
        print("1. Testing health endpoint...")
        health_response = requests.get("http://localhost:3002/health")
        print(f"   Health status: {health_response.status_code}")
        
        # Test resume upload without authentication (should fail)
        print("\n2. Testing resume upload without auth...")
        with open(test_file_path, "rb") as f:
            files = {"resume": ("test_resume.txt", f, "text/plain")}
            response = requests.post("http://localhost:3002/api/resumes/upload", files=files)
        
        print(f"   Upload status: {response.status_code}")
        print(f"   Response: {response.text[:200]}")
        
        # Test with a simple auth token (should fail but not 500)
        print("\n3. Testing resume upload with invalid auth...")
        with open(test_file_path, "rb") as f:
            files = {"resume": ("test_resume.txt", f, "text/plain")}
            headers = {"Authorization": "Bearer invalid-token"}
            response = requests.post("http://localhost:3002/api/resumes/upload", files=files, headers=headers)
        
        print(f"   Upload status: {response.status_code}")
        print(f"   Response: {response.text[:200]}")
        
        # Test with CORS headers
        print("\n4. Testing with CORS headers...")
        with open(test_file_path, "rb") as f:
            files = {"resume": ("test_resume.txt", f, "text/plain")}
            headers = {
                "Origin": "http://localhost:3003",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type, Authorization"
            }
            response = requests.post("http://localhost:3002/api/resumes/upload", files=files, headers=headers)
        
        print(f"   Upload with CORS status: {response.status_code}")
        print(f"   Response: {response.text[:200]}")
        
        print("\n=== Debug Test Completed ===")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        # Clean up test file
        if test_file_path.exists():
            test_file_path.unlink()

if __name__ == "__main__":
    test_resume_upload_with_auth()
