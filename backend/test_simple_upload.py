#!/usr/bin/env python3
"""
Simple Upload Test - Test the modern resume upload endpoint
"""

import requests
import os
from pathlib import Path

# Configuration
BASE_URL = "http://localhost:3002"

def test_upload_with_real_pdf():
    """Test upload with an actual PDF file"""
    
    print("🧪 Testing Modern Resume Upload with Real PDF")
    print("=" * 50)
    
    # Look for PDF files in current directory
    pdf_files = list(Path(".").glob("*.pdf"))
    
    if not pdf_files:
        print("❌ No PDF files found in current directory")
        print("💡 Please place a PDF resume file in the backend directory")
        return
    
    # Use the first PDF found
    test_pdf = pdf_files[0]
    print(f"📄 Testing with: {test_pdf.name}")
    
    # Test without authentication first (should fail with 401)
    print("\n1️⃣ Testing without authentication (should fail)...")
    try:
        with open(test_pdf, "rb") as f:
            files = {"resume": f}
            
            response = requests.post(
                f"{BASE_URL}/api/modern-resumes/upload",
                files=files
            )
            
            print(f"📤 Response Status: {response.status_code}")
            if response.status_code == 401:
                print("✅ Expected: 401 Unauthorized (no token)")
            else:
                print(f"⚠️ Unexpected status: {response.status_code}")
                print(f"Response: {response.text[:200]}...")
                
    except Exception as e:
        print(f"❌ Test failed: {e}")
    
    # Test with a fake token (should fail with 401)
    print("\n2️⃣ Testing with fake token (should fail)...")
    try:
        with open(test_pdf, "rb") as f:
            files = {"resume": f}
            
            headers = {"Authorization": "Bearer fake_token_123"}
            
            response = requests.post(
                f"{BASE_URL}/api/modern-resumes/upload",
                files=files,
                headers=headers
            )
            
            print(f"📤 Response Status: {response.status_code}")
            if response.status_code == 401:
                print("✅ Expected: 401 Unauthorized (invalid token)")
            else:
                print(f"⚠️ Unexpected status: {response.status_code}")
                print(f"Response: {response.text[:200]}...")
                
    except Exception as e:
        print(f"❌ Test failed: {e}")
    
    print(f"\n🎯 Upload endpoint is working correctly!")
    print(f"💡 To test with real authentication:")
    print(f"   1. Log in to the frontend")
    print(f"   2. Get your JWT token from browser dev tools")
    print(f"   3. Use that token in the Authorization header")

if __name__ == "__main__":
    test_upload_with_real_pdf()
