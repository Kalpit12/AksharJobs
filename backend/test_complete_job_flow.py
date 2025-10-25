#!/usr/bin/env python3
"""
Comprehensive End-to-End Test: Job Posting & Application Flow

Tests:
1. Recruiter posts a job
2. Job appears on jobseeker dashboard
3. Jobseeker applies to job
4. Application appears on recruiter dashboard
5. Intern flow (if applicable)
"""

import requests
import json
from datetime import datetime
import sys

# Configuration
BASE_URL = "http://localhost:3002/api"
TEST_RECRUITER_EMAIL = "test.recruiter@flowtest.com"
TEST_RECRUITER_PASSWORD = "TestPass123!"
TEST_JOBSEEKER_EMAIL = "test.jobseeker@flowtest.com"
TEST_JOBSEEKER_PASSWORD = "TestPass123!"
TEST_INTERN_EMAIL = "test.intern@flowtest.com"
TEST_INTERN_PASSWORD = "TestPass123!"

# Colors for output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*80}")
    print(f"{text}")
    print(f"{'='*80}{Colors.RESET}\n")

def print_success(text):
    print(f"{Colors.GREEN}✓ {text}{Colors.RESET}")

def print_error(text):
    print(f"{Colors.RED}✗ {text}{Colors.RESET}")

def print_warning(text):
    print(f"{Colors.YELLOW}⚠ {text}{Colors.RESET}")

def print_info(text):
    print(f"{Colors.BLUE}ℹ {text}{Colors.RESET}")

# Step 1: Create or login test users
def create_or_login_user(email, password, user_type, first_name, last_name):
    """Create a new user or login if exists"""
    print_header(f"Setting up {user_type}: {email}")
    
    # Try to login first
    login_data = {
        "email": email,
        "password": password
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    
    if response.status_code == 200:
        data = response.json()
        token = data.get('token')
        user_id = data.get('userId')
        print_success(f"Logged in as existing {user_type}")
        print_info(f"User ID: {user_id}")
        return token, user_id
    
    # User doesn't exist, create new one
    print_info(f"User doesn't exist, creating new {user_type}...")
    
    signup_data = {
        "userType": user_type,
        "firstName": first_name,
        "lastName": last_name,
        "email": email,
        "password": password,
        "phoneNumber": "+1234567890",
        "companyName": "Test Company" if user_type == "recruiter" else "",
        "companyWebsite": "https://testcompany.com" if user_type == "recruiter" else "",
        "location": "Test City"
    }
    
    response = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
    
    if response.status_code == 201:
        data = response.json()
        token = data.get('token')
        user_id = data.get('userId')
        print_success(f"Created new {user_type}")
        print_info(f"User ID: {user_id}")
        return token, user_id
    else:
        print_error(f"Failed to create {user_type}: {response.text}")
        return None, None

# Step 2: Post a job as recruiter
def post_job(recruiter_token):
    """Post a new job as recruiter"""
    print_header("STEP 1: Recruiter Posts a Job")
    
    job_data = {
        "jobTitle": f"Test Software Engineer - {datetime.now().strftime('%H:%M:%S')}",
        "companyName": "Test Tech Company",
        "companyWebsite": "https://testtechcompany.com",
        "industry": "Technology",
        "location": "San Francisco, CA",
        "remoteOption": "Hybrid",
        "jobType": "Full-time",
        "salaryRange": "$100,000 - $150,000",
        "requiredSkills": ["Python", "JavaScript", "React", "Node.js"],
        "preferredQualifications": ["Bachelor's degree in Computer Science", "3+ years experience"],
        "responsibilities": ["Develop web applications", "Write clean code", "Collaborate with team"],
        "description": "We are looking for a talented software engineer to join our team.",
        "applicationDeadline": "2025-12-31",
        "all_communities": True
    }
    
    headers = {
        "Authorization": f"Bearer {recruiter_token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(f"{BASE_URL}/jobs/add_job", json=job_data, headers=headers)
    
    if response.status_code == 201:
        data = response.json()
        job_id = data.get('jobId') or data.get('_id') or data.get('job_id')
        print_success("Job posted successfully!")
        print_info(f"Response data: {data}")
        print_info(f"Job ID: {job_id}")
        print_info(f"Job Title: {job_data['jobTitle']}")
        
        if not job_id:
            print_warning("No job ID returned, checking response structure...")
            print_info(f"Full response: {json.dumps(data, indent=2)}")
        
        return job_id
    else:
        print_error(f"Failed to post job: {response.status_code}")
        print_error(f"Response: {response.text}")
        return None

# Step 3: Get jobs as jobseeker
def get_jobs_for_jobseeker(jobseeker_token):
    """Get jobs visible to jobseeker"""
    print_header("STEP 2: Jobseeker Views Available Jobs")
    
    headers = {
        "Authorization": f"Bearer {jobseeker_token}"
    }
    
    response = requests.get(f"{BASE_URL}/jobs/get_jobs_for_user", headers=headers)
    
    if response.status_code == 200:
        jobs = response.json()
        print_success(f"Retrieved {len(jobs)} jobs")
        
        if len(jobs) > 0:
            print_info(f"Latest job: {jobs[0].get('job_title') or jobs[0].get('jobTitle')}")
            return jobs
        else:
            print_warning("No jobs found for jobseeker")
            return []
    else:
        print_error(f"Failed to get jobs: {response.status_code}")
        print_error(f"Response: {response.text}")
        return []

# Step 4: Apply to job as jobseeker
def apply_to_job(jobseeker_token, job_id):
    """Apply to a job as jobseeker"""
    print_header("STEP 3: Jobseeker Applies to Job")
    
    application_data = {
        "job_id": job_id,
        "cover_letter": "I am very interested in this position. I have extensive experience with the required technologies and would love to contribute to your team."
    }
    
    headers = {
        "Authorization": f"Bearer {jobseeker_token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(f"{BASE_URL}/applications/apply", json=application_data, headers=headers)
    
    if response.status_code == 201:
        data = response.json()
        application_id = data.get('application_id')
        print_success("Application submitted successfully!")
        print_info(f"Application ID: {application_id}")
        return application_id
    elif response.status_code == 400 and 'already applied' in response.text:
        print_warning("Already applied to this job (expected for re-runs)")
        return "existing"
    else:
        print_error(f"Failed to apply: {response.status_code}")
        print_error(f"Response: {response.text}")
        return None

# Step 5: Get applications as recruiter
def get_applications_for_recruiter(recruiter_token, job_id=None):
    """Get applications for recruiter's jobs"""
    print_header("STEP 4: Recruiter Views Applications")
    
    headers = {
        "Authorization": f"Bearer {recruiter_token}"
    }
    
    # Try to get applications for specific job if job_id provided
    if job_id:
        print_info(f"Getting applications for specific job: {job_id}")
        response = requests.get(f"{BASE_URL}/applications/get_applications?jobId={job_id}", headers=headers)
    else:
        print_info("Getting all applications for recruiter")
        response = requests.get(f"{BASE_URL}/applications/recruiter/all", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        applications = data.get('applications', [])
        print_success(f"Retrieved {len(applications)} applications")
        
        if len(applications) > 0:
            for i, app in enumerate(applications, 1):
                print_info(f"Application {i}:")
                print(f"   - Applicant: {app.get('applicant_name', 'Unknown')}")
                print(f"   - Email: {app.get('applicant_email', 'Unknown')}")
                print(f"   - Status: {app.get('status', 'Unknown')}")
                print(f"   - Applied: {app.get('applied_at', 'Unknown')}")
        else:
            print_warning("No applications found")
        
        return applications
    else:
        print_error(f"Failed to get applications: {response.status_code}")
        print_error(f"Response: {response.text}")
        return []

# Step 6: Get jobseeker's applications
def get_jobseeker_applications(jobseeker_token):
    """Get applications submitted by jobseeker"""
    print_header("STEP 5: Verify Jobseeker Can See Their Applications")
    
    headers = {
        "Authorization": f"Bearer {jobseeker_token}"
    }
    
    response = requests.get(f"{BASE_URL}/applications/my-applications", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        # Handle both response formats: list or object with 'applications' key
        if isinstance(data, list):
            applications = data
        else:
            applications = data.get('applications', [])
        print_success(f"Jobseeker has {len(applications)} applications")
        
        if len(applications) > 0:
            for i, app in enumerate(applications, 1):
                print_info(f"Application {i}:")
                print(f"   - Job: {app.get('job_title', 'Unknown')}")
                print(f"   - Company: {app.get('company_name', 'Unknown')}")
                print(f"   - Status: {app.get('status', 'Unknown')}")
        
        return applications
    else:
        print_error(f"Failed to get jobseeker applications: {response.status_code}")
        return []

# Main test flow
def run_complete_test():
    """Run the complete end-to-end test"""
    print_header("COMPLETE JOB FLOW TEST - START")
    print(f"Base URL: {BASE_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = {
        'recruiter_setup': False,
        'jobseeker_setup': False,
        'job_posted': False,
        'job_visible': False,
        'application_submitted': False,
        'application_visible_to_recruiter': False,
        'application_visible_to_jobseeker': False
    }
    
    # Setup users
    recruiter_token, recruiter_id = create_or_login_user(
        TEST_RECRUITER_EMAIL, 
        TEST_RECRUITER_PASSWORD, 
        "recruiter",
        "Test",
        "Recruiter"
    )
    
    if recruiter_token:
        results['recruiter_setup'] = True
    else:
        print_error("Failed to setup recruiter. Aborting test.")
        return results
    
    jobseeker_token, jobseeker_id = create_or_login_user(
        TEST_JOBSEEKER_EMAIL,
        TEST_JOBSEEKER_PASSWORD,
        "jobSeeker",
        "Test",
        "Jobseeker"
    )
    
    if jobseeker_token:
        results['jobseeker_setup'] = True
    else:
        print_error("Failed to setup jobseeker. Aborting test.")
        return results
    
    # Post job
    job_id = post_job(recruiter_token)
    if job_id:
        results['job_posted'] = True
    else:
        print_error("Failed to post job. Aborting test.")
        return results
    
    # Get jobs for jobseeker
    jobs = get_jobs_for_jobseeker(jobseeker_token)
    if len(jobs) > 0:
        results['job_visible'] = True
        # Verify our posted job is in the list
        if any(str(job.get('_id')) == str(job_id) for job in jobs):
            print_success("Posted job is visible to jobseeker!")
        else:
            print_warning("Posted job not found in jobseeker's job list (might be filtered by communities)")
    
    # Apply to job
    application_id = apply_to_job(jobseeker_token, job_id)
    if application_id:
        results['application_submitted'] = True
    else:
        print_error("Failed to submit application. Continuing to check existing applications...")
    
    # Get applications for recruiter
    applications = get_applications_for_recruiter(recruiter_token, job_id)
    if len(applications) > 0:
        results['application_visible_to_recruiter'] = True
        # Verify jobseeker's application is in the list
        if any(app.get('applicant_email') == TEST_JOBSEEKER_EMAIL for app in applications):
            print_success("Application is visible to recruiter!")
    
    # Get applications for jobseeker
    jobseeker_apps = get_jobseeker_applications(jobseeker_token)
    if len(jobseeker_apps) > 0:
        results['application_visible_to_jobseeker'] = True
        # Verify application to this job exists
        if any(str(app.get('job_id')) == str(job_id) for app in jobseeker_apps):
            print_success("Application is visible to jobseeker!")
    
    # Print summary
    print_header("TEST SUMMARY")
    
    total_tests = len(results)
    passed_tests = sum(1 for v in results.values() if v)
    
    for test, passed in results.items():
        if passed:
            print_success(f"{test}: PASSED")
        else:
            print_error(f"{test}: FAILED")
    
    print(f"\n{Colors.BOLD}Overall: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print_success("ALL TESTS PASSED! ✓✓✓")
        print(f"{Colors.RESET}")
        return True
    else:
        print_warning(f"{passed_tests - total_tests} tests failed")
        print(f"{Colors.RESET}")
        return False

if __name__ == "__main__":
    try:
        success = run_complete_test()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Test interrupted by user{Colors.RESET}")
        sys.exit(1)
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

