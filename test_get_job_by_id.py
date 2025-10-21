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
                print(f"Job ID type: {type(job_id)}")
                
                # Test the get_job_by_id function by creating a test endpoint
                print("\n=== Testing get_job_by_id function ===")
                # Let's test if we can find the job in the all jobs response
                all_jobs_response = requests.get("http://localhost:3002/api/jobs/get_jobs", headers=headers)
                if all_jobs_response.status_code == 200:
                    all_jobs = all_jobs_response.json()
                    target_job = None
                    for job in all_jobs:
                        if str(job.get('_id')) == job_id:
                            target_job = job
                            break
                    if target_job:
                        print(f"Job found in all jobs: {target_job['job_title']}")
                        print(f"Job description: {target_job.get('description', 'No description')[:100]}...")
                    else:
                        print(f"Job {job_id} not found in all jobs")
            
except Exception as e:
    print(f"Error: {e}")
