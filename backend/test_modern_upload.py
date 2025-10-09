#!/usr/bin/env python3
"""
Test Modern Resume Upload - End to End Testing
Tests the complete flow from upload to AI extraction
"""

import requests
import json
import os
from pathlib import Path

# Configuration
BASE_URL = "http://localhost:3002"
TEST_RESUME_PATH = "test_resume.pdf"  # We'll create this

def create_test_resume():
    """Create a simple test PDF resume for testing"""
    try:
        # Create a simple text file first
        test_content = """
        JOHN DOE
        Software Engineer
        john.doe@email.com | +1-555-0123 | linkedin.com/in/johndoe
        
        SUMMARY
        Experienced software engineer with 5+ years in full-stack development,
        specializing in React, Node.js, and Python. Passionate about creating
        scalable web applications and mentoring junior developers.
        
        EXPERIENCE
        Senior Software Engineer | TechCorp Inc. | 2021-Present
        - Led development of microservices architecture serving 1M+ users
        - Mentored 3 junior developers and conducted code reviews
        - Implemented CI/CD pipeline reducing deployment time by 60%
        
        Software Engineer | StartupXYZ | 2019-2021
        - Built responsive web applications using React and Node.js
        - Collaborated with cross-functional teams in agile environment
        - Optimized database queries improving performance by 40%
        
        EDUCATION
        Bachelor of Science in Computer Science | University of Technology | 2019
        GPA: 3.8/4.0
        
        SKILLS
        Frontend: React, JavaScript, HTML5, CSS3, TypeScript
        Backend: Node.js, Python, Express, Django
        Database: MongoDB, PostgreSQL, Redis
        DevOps: Docker, AWS, Git, Jenkins
        
        PROJECTS
        E-commerce Platform | React, Node.js, MongoDB
        - Built full-stack e-commerce solution with payment integration
        - Implemented real-time inventory management system
        
        Task Management App | React, Firebase
        - Created collaborative task management application
        - Features include real-time updates and team collaboration
        """
        
        # Write to a text file first
        with open("test_resume.txt", "w", encoding="utf-8") as f:
            f.write(test_content)
        
        print("✅ Test resume content created")
        return "test_resume.txt"
        
    except Exception as e:
        print(f"❌ Error creating test resume: {e}")
        return None

def test_modern_upload():
    """Test the complete modern resume upload flow"""
    
    print("🚀 Testing Modern Resume Upload Flow")
    print("=" * 50)
    
    # 1. Create test resume
    print("\n1️⃣ Creating test resume...")
    resume_path = create_test_resume()
    if not resume_path:
        return False
    
    # 2. Test upload endpoint
    print("\n2️⃣ Testing upload endpoint...")
    
    # For now, we'll test with a text file since PDF creation is complex
    try:
        with open(resume_path, "rb") as f:
            files = {"resume": f}
            
            # Test without authentication first
            response = requests.post(
                f"{BASE_URL}/api/modern-resumes/upload",
                files=files
            )
            
            print(f"📤 Upload Response Status: {response.status_code}")
            print(f"📤 Upload Response: {response.text[:500]}...")
            
            if response.status_code == 401:
                print("✅ Expected: 401 Unauthorized (no token)")
            elif response.status_code == 200:
                print("✅ Upload successful!")
                result = response.json()
                print(f"📊 Resume Data: {json.dumps(result, indent=2)}")
            else:
                print(f"❌ Unexpected status: {response.status_code}")
                
    except Exception as e:
        print(f"❌ Upload test failed: {e}")
        return False
    
    # 3. Test profile endpoint
    print("\n3️⃣ Testing profile endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/modern-resumes/profile")
        print(f"📋 Profile Response Status: {response.status_code}")
        print(f"📋 Profile Response: {response.text[:300]}...")
    except Exception as e:
        print(f"❌ Profile test failed: {e}")
    
    # 4. Test health endpoint
    print("\n4️⃣ Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/modern-resumes/health")
        print(f"💚 Health Response Status: {response.status_code}")
        print(f"💚 Health Response: {response.text[:300]}...")
    except Exception as e:
        print(f"❌ Health test failed: {e}")
    
    # Cleanup
    if os.path.exists(resume_path):
        os.remove(resume_path)
        print(f"\n🧹 Cleaned up test file: {resume_path}")
    
    print("\n" + "=" * 50)
    print("🎯 Modern Resume Upload Test Complete!")
    return True

def test_with_sample_pdf():
    """Test with an actual PDF if available"""
    print("\n🔍 Looking for sample PDF resumes...")
    
    # Check if there are any PDF files in the current directory
    pdf_files = list(Path(".").glob("*.pdf"))
    
    if pdf_files:
        print(f"📄 Found PDF files: {[f.name for f in pdf_files]}")
        
        # Test with the first PDF found
        test_pdf = pdf_files[0]
        print(f"\n🧪 Testing with: {test_pdf.name}")
        
        try:
            with open(test_pdf, "rb") as f:
                files = {"resume": f}
                
                response = requests.post(
                    f"{BASE_URL}/api/modern-resumes/upload",
                    files=files
                )
                
                print(f"📤 PDF Upload Response Status: {response.status_code}")
                if response.status_code == 200:
                    result = response.json()
                    print("✅ PDF Upload Successful!")
                    print(f"📊 Resume Data Keys: {list(result.keys())}")
                    
                    # Show extracted data
                    if 'resume_data' in result:
                        resume_data = result['resume_data']
                        print(f"👤 Personal Info: {resume_data.get('personal_info', 'N/A')}")
                        print(f"💼 Experience: {len(resume_data.get('experience', []))} entries")
                        print(f"🎓 Education: {len(resume_data.get('education', []))} entries")
                        print(f"🛠️ Skills: {len(resume_data.get('skills', []))} skills")
                    
                    if 'ai_recommendations' in result:
                        ai_recs = result['ai_recommendations']
                        print(f"🤖 AI Recommendations: {len(ai_recs.get('career_recommendations', []))} suggestions")
                        
                else:
                    print(f"❌ PDF Upload Failed: {response.text}")
                    
        except Exception as e:
            print(f"❌ PDF test failed: {e}")
    else:
        print("📄 No PDF files found in current directory")
        print("💡 You can place a sample PDF resume here for testing")

if __name__ == "__main__":
    print("🧪 Modern Resume Upload Test Suite")
    print("=" * 50)
    
    # Test basic functionality
    test_modern_upload()
    
    # Test with actual PDF if available
    test_with_sample_pdf()
    
    print("\n🎉 All tests completed!")
