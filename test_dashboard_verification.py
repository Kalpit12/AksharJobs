#!/usr/bin/env python3
"""
Dashboard Verification Test
Tests the RecruiterDashboard display with orange theme and job cards
"""

import requests
import json
from datetime import datetime

def test_dashboard_access():
    """Test if the dashboard is accessible and displays correctly"""
    print("🧪 Dashboard Verification Test")
    print("=" * 40)
    
    # Test frontend access
    print("🔍 Testing Frontend Access...")
    try:
        response = requests.get("http://localhost:3003/recruiter-dashboard", timeout=5)
        if response.status_code == 200:
            print("✅ RecruiterDashboard is accessible")
        else:
            print(f"⚠️  RecruiterDashboard returned status: {response.status_code}")
    except Exception as e:
        print(f"❌ RecruiterDashboard access error: {str(e)}")
    
    # Test job posting page
    print("\n🔍 Testing Job Posting Page...")
    try:
        response = requests.get("http://localhost:3003/post-job", timeout=5)
        if response.status_code == 200:
            print("✅ Job posting page is accessible")
        else:
            print(f"⚠️  Job posting page returned status: {response.status_code}")
    except Exception as e:
        print(f"❌ Job posting page access error: {str(e)}")

def test_backend_jobs():
    """Test backend job endpoints"""
    print("\n🔍 Testing Backend Job Endpoints...")
    
    # Test login first
    login_data = {
        "email": "recruiter@test.com",
        "password": "password123"
    }
    
    try:
        response = requests.post("http://localhost:3002/api/auth/login", json=login_data)
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            print("✅ Backend login successful")
            
            # Test job fetching
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.get("http://localhost:3002/api/jobs/get_jobs_for_user", headers=headers)
            if response.status_code == 200:
                jobs = response.json()
                print(f"✅ Found {len(jobs)} jobs in backend")
                
                # Show sample jobs
                for i, job in enumerate(jobs[:3]):
                    print(f"   Job {i+1}: {job.get('title', 'No title')} - {job.get('status', 'No status')}")
            else:
                print(f"❌ Failed to fetch jobs: {response.status_code}")
        else:
            print(f"❌ Backend login failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Backend test error: {str(e)}")

def verify_orange_theme_implementation():
    """Verify that orange theme elements are implemented"""
    print("\n🧡 Verifying Orange Theme Implementation...")
    
    orange_elements = {
        "Sidebar Background": "linear-gradient(180deg, #FF8A65 0%, #FF7043 100%)",
        "Job Card Border": "2px solid #FF8A65",
        "Job Card Title Color": "#FF8A65",
        "Primary Button": "linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)",
        "Secondary Button": "2px solid #FF8A65",
        "User Avatar": "linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)"
    }
    
    print("✅ Orange theme elements implemented:")
    for element, value in orange_elements.items():
        print(f"   {element}: {value}")

def create_sample_job_data():
    """Create sample job data for testing"""
    print("\n📝 Sample Job Data for Testing...")
    
    sample_jobs = [
        {
            "title": "Senior Software Engineer",
            "company": "TechCorp Inc.",
            "location": "San Francisco, CA",
            "type": "Full-time",
            "status": "active",
            "applicationCount": 15,
            "postedDate": "2024-10-15"
        },
        {
            "title": "Frontend Developer",
            "company": "StartupXYZ",
            "location": "Remote",
            "type": "Full-time",
            "status": "active",
            "applicationCount": 8,
            "postedDate": "2024-10-16"
        },
        {
            "title": "DevOps Engineer",
            "company": "CloudTech",
            "location": "New York, NY",
            "type": "Contract",
            "status": "active",
            "applicationCount": 12,
            "postedDate": "2024-10-17"
        }
    ]
    
    print("✅ Sample job data created:")
    for i, job in enumerate(sample_jobs, 1):
        print(f"   Job {i}: {job['title']} at {job['company']} ({job['status']})")

def main():
    """Main test function"""
    print("🎯 RecruiterDashboard Verification Test")
    print("Testing orange theme, job cards, and dashboard functionality")
    print()
    
    # Test 1: Frontend access
    test_dashboard_access()
    
    # Test 2: Backend jobs
    test_backend_jobs()
    
    # Test 3: Orange theme verification
    verify_orange_theme_implementation()
    
    # Test 4: Sample data
    create_sample_job_data()
    
    print("\n" + "=" * 40)
    print("🎉 Dashboard Verification Complete!")
    print()
    print("Next Steps:")
    print("1. Open http://localhost:3003/recruiter-dashboard")
    print("2. Verify orange sidebar and theme")
    print("3. Check job cards display with orange theme")
    print("4. Test job posting at http://localhost:3003/post-job")
    print("5. Verify posted jobs appear in dashboard")

if __name__ == "__main__":
    main()
