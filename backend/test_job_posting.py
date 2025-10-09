"""
Test Job Posting Functionality for Recruiters
Tests both old and new data formats
"""

import requests
import json
from datetime import datetime, timedelta

# Configuration
BASE_URL = "http://localhost:3002"
API_URL = f"{BASE_URL}/api"

# Test credentials (you'll need to create a recruiter account or use existing)
TEST_RECRUITER_EMAIL = "recruiter@test.com"
TEST_RECRUITER_PASSWORD = "Test123!@#"

def print_section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}\n")

def login_recruiter():
    """Login as recruiter and get JWT token"""
    print_section("🔐 LOGGING IN AS RECRUITER")
    
    login_url = f"{API_URL}/auth/login"
    login_data = {
        "email": TEST_RECRUITER_EMAIL,
        "password": TEST_RECRUITER_PASSWORD
    }
    
    print(f"📍 URL: {login_url}")
    print(f"📋 Credentials: {TEST_RECRUITER_EMAIL}")
    
    try:
        response = requests.post(login_url, json=login_data)
        print(f"✅ Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            user_id = data.get('userId')
            print(f"✅ Login successful!")
            print(f"👤 User ID: {user_id}")
            print(f"🎫 Token: {token[:20]}...")
            return token, user_id
        else:
            print(f"❌ Login failed: {response.text}")
            return None, None
    except Exception as e:
        print(f"❌ Error during login: {e}")
        return None, None

def test_job_posting_old_format(token, user_id):
    """Test job posting with old format (camelCase)"""
    print_section("📝 TEST 1: JOB POSTING - OLD FORMAT (camelCase)")
    
    job_url = f"{API_URL}/jobs/add_job"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    # Old format with camelCase
    job_data = {
        "recruiter_id": user_id,
        "jobTitle": "Senior Python Developer",
        "companyName": "TechCorp Solutions",
        "companyWebsite": "https://techcorp.com",
        "industry": "Technology",
        "location": "San Francisco, CA",
        "remoteOption": "Hybrid",
        "jobType": "Full-time",
        "salaryRange": "USD 120,000 - 150,000 yearly",
        "experience": "5+ years",
        "skills": "Python, Django, Flask, PostgreSQL, Docker",
        "responsibilities": "Lead backend development, mentor junior developers, design scalable systems",
        "education": "Bachelor's in Computer Science or equivalent",
        "deadline": (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d"),
        "description": "We are looking for an experienced Python developer to join our growing team."
    }
    
    print(f"📍 URL: {job_url}")
    print(f"📋 Job Data (Old Format):")
    print(json.dumps(job_data, indent=2))
    
    try:
        response = requests.post(job_url, json=job_data, headers=headers)
        print(f"\n✅ Status Code: {response.status_code}")
        print(f"📄 Response: {response.text}")
        
        if response.status_code == 201:
            data = response.json()
            print(f"\n🎉 Job posted successfully!")
            print(f"🆔 Job ID: {data.get('job_id')}")
            print(f"💳 Free posts remaining: {data.get('free_job_posts_remaining')}")
            return True, data.get('job_id')
        elif response.status_code == 402:
            print(f"\n⚠️ No free job posts remaining - need promo code or premium")
            return False, None
        else:
            print(f"\n❌ Job posting failed!")
            return False, None
    except Exception as e:
        print(f"❌ Error during job posting: {e}")
        return False, None

def test_job_posting_new_format(token, user_id):
    """Test job posting with new format (snake_case)"""
    print_section("📝 TEST 2: JOB POSTING - NEW FORMAT (snake_case)")
    
    job_url = f"{API_URL}/jobs/add_job"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    # New format with snake_case
    job_data = {
        "title": "Full Stack JavaScript Developer",
        "company": "WebDev Inc",
        "location": "New York, NY",
        "job_type": "Full-time",
        "work_mode": "Remote",
        "experience_level": "Mid-Level",
        "salary_min": "90000",
        "salary_max": "130000",
        "salary_currency": "USD",
        "salary_period": "yearly",
        "description": "Join our team to build modern web applications using React and Node.js.",
        "responsibilities": "Develop front-end and back-end features, participate in code reviews, work with product team",
        "requirements": "3+ years experience, strong JavaScript skills, experience with React and Node.js",
        "required_skills": ["JavaScript", "React", "Node.js", "MongoDB", "Git"],
        "benefits": "Health insurance, 401k matching, unlimited PTO, remote work",
        "application_deadline": (datetime.now() + timedelta(days=45)).strftime("%Y-%m-%d"),
        "industry": "Technology"
    }
    
    print(f"📍 URL: {job_url}")
    print(f"📋 Job Data (New Format):")
    print(json.dumps(job_data, indent=2))
    
    try:
        response = requests.post(job_url, json=job_data, headers=headers)
        print(f"\n✅ Status Code: {response.status_code}")
        print(f"📄 Response: {response.text}")
        
        if response.status_code == 201:
            data = response.json()
            print(f"\n🎉 Job posted successfully!")
            print(f"🆔 Job ID: {data.get('job_id')}")
            print(f"💳 Free posts remaining: {data.get('free_job_posts_remaining')}")
            return True, data.get('job_id')
        elif response.status_code == 402:
            print(f"\n⚠️ No free job posts remaining - need promo code or premium")
            return False, None
        else:
            print(f"\n❌ Job posting failed!")
            return False, None
    except Exception as e:
        print(f"❌ Error during job posting: {e}")
        return False, None

def get_job_details(job_id, token):
    """Fetch and display job details"""
    print_section(f"📄 FETCHING JOB DETAILS - ID: {job_id}")
    
    job_url = f"{API_URL}/jobs/{job_id}"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    print(f"📍 URL: {job_url}")
    
    try:
        response = requests.get(job_url, headers=headers)
        print(f"✅ Status Code: {response.status_code}")
        
        if response.status_code == 200:
            job = response.json()
            print(f"\n✅ Job Retrieved Successfully!")
            print(f"\n📋 Job Details:")
            print(f"   Title: {job.get('job_title')}")
            print(f"   Company: {job.get('company_name')}")
            print(f"   Location: {job.get('location')}")
            print(f"   Type: {job.get('job_type')}")
            print(f"   Work Mode: {job.get('work_mode')} / {job.get('remote_option')}")
            print(f"   Salary: {job.get('salary_range')}")
            print(f"   Experience: {job.get('experience_required')}")
            print(f"   Skills: {job.get('required_skills')}")
            return True
        else:
            print(f"❌ Failed to retrieve job: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error fetching job: {e}")
        return False

def main():
    """Main test runner"""
    print_section("🧪 JOB POSTING SYSTEM TEST")
    print(f"Testing job posting functionality for recruiters")
    print(f"Base URL: {BASE_URL}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Step 1: Login
    token, user_id = login_recruiter()
    if not token:
        print("\n❌ Cannot proceed without authentication")
        print("\n💡 SETUP INSTRUCTIONS:")
        print("   1. Make sure the backend is running on port 3002")
        print("   2. Create a recruiter account with:")
        print(f"      Email: {TEST_RECRUITER_EMAIL}")
        print(f"      Password: {TEST_RECRUITER_PASSWORD}")
        print("   3. Or update the credentials in this script")
        return
    
    # Step 2: Test old format
    success_old, job_id_old = test_job_posting_old_format(token, user_id)
    
    # Step 3: Test new format
    success_new, job_id_new = test_job_posting_new_format(token, user_id)
    
    # Step 4: Fetch job details if posted successfully
    if success_old and job_id_old:
        get_job_details(job_id_old, token)
    
    if success_new and job_id_new:
        get_job_details(job_id_new, token)
    
    # Summary
    print_section("📊 TEST SUMMARY")
    print(f"Old Format (camelCase): {'✅ PASSED' if success_old else '❌ FAILED'}")
    print(f"New Format (snake_case): {'✅ PASSED' if success_new else '❌ FAILED'}")
    
    if success_old or success_new:
        print(f"\n🎉 At least one format works! Job posting is functional.")
    else:
        print(f"\n❌ Both formats failed. Please check:")
        print(f"   • Backend is running")
        print(f"   • Recruiter has free job posts or is premium")
        print(f"   • Database connection is working")
        print(f"   • API endpoints are correct")

if __name__ == "__main__":
    main()

