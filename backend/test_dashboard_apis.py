#!/usr/bin/env python3
"""Test recruiter dashboard API endpoints"""

import requests
import json

def test_dashboard_apis():
    base_url = "http://localhost:3002"
    
    # Login first
    login_data = {
        "email": "sarah.johnson@techcorp.com",
        "password": "password123"
    }
    
    try:
        # Login
        login_response = requests.post(
            f"{base_url}/api/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        if login_response.status_code != 200:
            print("Login failed")
            return
            
        login_result = login_response.json()
        token = login_result.get('token')
        user_id = login_result.get('userId')
        
        print(f"✅ Login successful for user: {user_id}")
        
        # Test headers
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
        
        # Test 1: Get user details
        print("\n🔍 Testing: Get user details")
        user_response = requests.get(
            f"{base_url}/api/auth/get_user?userId={user_id}",
            headers=headers
        )
        print(f"Status: {user_response.status_code}")
        if user_response.status_code == 200:
            user_data = user_response.json()
            print(f"✅ User details: {user_data.get('firstName')} {user_data.get('lastName')} - {user_data.get('companyName')}")
        else:
            print(f"❌ User details failed: {user_response.text}")
        
        # Test 2: Get jobs by user
        print("\n🔍 Testing: Get jobs by user")
        jobs_response = requests.get(
            f"{base_url}/api/jobs/jobs_by_user/{user_id}",
            headers=headers
        )
        print(f"Status: {jobs_response.status_code}")
        if jobs_response.status_code == 200:
            jobs_data = jobs_response.json()
            print(f"✅ Found {len(jobs_data)} jobs for user")
            for i, job in enumerate(jobs_data[:2]):
                print(f"  Job {i+1}: {job.get('job_title', 'No title')} - {job.get('company', 'No company')}")
        else:
            print(f"❌ Jobs fetch failed: {jobs_response.text}")
        
        # Test 3: Get applications for jobs
        if jobs_response.status_code == 200:
            jobs_data = jobs_response.json()
            if jobs_data:
                job_id = jobs_data[0].get('_id')
                print(f"\n🔍 Testing: Get applications for job {job_id}")
                apps_response = requests.get(
                    f"{base_url}/api/applications/get_applications?jobId={job_id}",
                    headers=headers
                )
                print(f"Status: {apps_response.status_code}")
                if apps_response.status_code == 200:
                    apps_data = apps_response.json()
                    print(f"✅ Found {len(apps_data.get('applications', []))} applications for job")
                else:
                    print(f"❌ Applications fetch failed: {apps_response.text}")
        
        # Test 4: Get all candidates
        print("\n🔍 Testing: Get all candidates")
        candidates_response = requests.get(
            f"{base_url}/api/applications/tracker/recruiter/candidates",
            headers=headers
        )
        print(f"Status: {candidates_response.status_code}")
        if candidates_response.status_code == 200:
            candidates_data = candidates_response.json()
            print(f"✅ Found {len(candidates_data)} candidates")
        else:
            print(f"❌ Candidates fetch failed: {candidates_response.text}")
        
        # Test 5: Analytics dashboard
        print("\n🔍 Testing: Analytics dashboard")
        analytics_response = requests.get(
            f"{base_url}/api/analytics/dashboard-summary",
            headers=headers
        )
        print(f"Status: {analytics_response.status_code}")
        if analytics_response.status_code == 200:
            analytics_data = analytics_response.json()
            print(f"✅ Analytics data received")
        else:
            print(f"❌ Analytics fetch failed: {analytics_response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_dashboard_apis()
