import requests
import json

# Test login and get token
login_data = {
    "email": "test@example.com",
    "password": "password123"
}

try:
    response = requests.post("http://localhost:3002/api/auth/login", json=login_data)
    if response.status_code == 200:
        data = response.json()
        token = data.get('token')
        user_id = data.get('userId')
        
        print(f"User ID: {user_id}")
        
        # Test getting applications first
        headers = {"Authorization": f"Bearer {token}"}
        app_response = requests.get("http://localhost:3002/api/application-tracker/tracker/job-seeker/applications", headers=headers)
        
        if app_response.status_code == 200:
            applications = app_response.json()
            print(f"Found {len(applications)} applications")
            
            if applications:
                first_app = applications[0]
                job_id = first_app['job_id']
                print(f"Job ID: {job_id}")
                
                # Test getting job data
                print("\n=== Testing Job Data ===")
                job_response = requests.get(f"http://localhost:3002/api/jobs/{job_id}", headers=headers)
                print(f"Job status: {job_response.status_code}")
                print(f"Job response: {job_response.text}")
                
                # Test getting all jobs
                print("\n=== Testing All Jobs ===")
                all_jobs_response = requests.get("http://localhost:3002/api/jobs", headers=headers)
                print(f"All jobs status: {all_jobs_response.status_code}")
                if all_jobs_response.status_code == 200:
                    all_jobs = all_jobs_response.json()
                    print(f"Found {len(all_jobs)} jobs")
                    if all_jobs:
                        print(f"First job: {all_jobs[0]}")
            
except Exception as e:
    print(f"Error: {e}")
