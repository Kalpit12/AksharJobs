#!/usr/bin/env python3
"""
Test script to debug resume upload functionality
"""
import requests
import json
from pathlib import Path

def test_resume_upload():
    # Test with a simple text file
    test_file_path = Path("test_resume.txt")
    
    # Create a simple test resume
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
    with open(test_file_path, "w") as f:
        f.write(test_resume_content)
    
    try:
        # Test the health endpoint first
        print("Testing health endpoint...")
        health_response = requests.get("http://localhost:3002/health")
        print(f"Health status: {health_response.status_code}")
        
        # Test resume upload without authentication (should fail)
        print("\nTesting resume upload without auth...")
        with open(test_file_path, "rb") as f:
            files = {"resume": f}
            response = requests.post("http://localhost:3002/api/resumes/upload", files=files)
        
        print(f"Upload status: {response.status_code}")
        print(f"Response: {response.text[:200]}")
        
        # Test with CORS headers
        print("\nTesting with CORS headers...")
        with open(test_file_path, "rb") as f:
            files = {"resume": f}
            headers = {
                "Origin": "http://localhost:3003",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type, Authorization"
            }
            response = requests.post("http://localhost:3002/api/resumes/upload", files=files, headers=headers)
        
        print(f"Upload with CORS status: {response.status_code}")
        print(f"Response: {response.text[:200]}")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Clean up test file
        if test_file_path.exists():
            test_file_path.unlink()

if __name__ == "__main__":
    test_resume_upload()
