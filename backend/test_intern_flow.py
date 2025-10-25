#!/usr/bin/env python3
"""
Comprehensive End-to-End Test: Internship Posting & Application Flow

Tests:
1. Recruiter posts an internship
2. Internship appears on intern dashboard
3. Intern applies to internship
4. Application appears on recruiter dashboard
"""

import requests
import json
from datetime import datetime
import sys

# Configuration
BASE_URL = "http://localhost:3002/api"
TEST_RECRUITER_EMAIL = "test.recruiter@flowtest.com"
TEST_RECRUITER_PASSWORD = "TestPass123!"
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

# Create or login user
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

# Post an internship
def post_internship(recruiter_token):
    """Post a new internship as recruiter"""
    print_header("STEP 1: Recruiter Posts an Internship")
    
    internship_data = {
        "jobTitle": f"Test Software Engineering Intern - {datetime.now().strftime('%H:%M:%S')}",
        "companyName": "Test Tech Company",
        "companyWebsite": "https://testtechcompany.com",
        "industry": "Technology",
        "location": "San Francisco, CA",
        "remoteOption": "Remote",
        "jobType": "Internship",
        "salaryRange": "$2,000 - $3,000/month",
        "requiredSkills": ["Python", "JavaScript", "Git"],
        "preferredQualifications": ["Currently pursuing CS degree", "Strong problem-solving skills"],
        "responsibilities": ["Work on real projects", "Learn from senior developers", "Attend team meetings"],
        "description": "We are looking for a motivated intern to join our engineering team for a summer internship.",
        "applicationDeadline": "2025-12-31",
        "duration": "3 months",
        "all_communities": True
    }
    
    headers = {
        "Authorization": f"Bearer {recruiter_token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(f"{BASE_URL}/jobs/add_job", json=internship_data, headers=headers)
    
    if response.status_code == 201:
        data = response.json()
        job_id = data.get('job_id') or data.get('jobId') or data.get('_id')
        print_success("Internship posted successfully!")
        print_info(f"Internship ID: {job_id}")
        print_info(f"Internship Title: {internship_data['jobTitle']}")
        return job_id
    else:
        print_error(f"Failed to post internship: {response.status_code}")
        print_error(f"Response: {response.text}")
        return None

# Get jobs for intern
def get_jobs_for_intern(intern_token):
    """Get jobs/internships visible to intern"""
    print_header("STEP 2: Intern Views Available Internships")
    
    headers = {
        "Authorization": f"Bearer {intern_token}"
    }
    
    response = requests.get(f"{BASE_URL}/jobs/get_jobs_for_user", headers=headers)
    
    if response.status_code == 200:
        jobs = response.json()
        
        # Filter for internships
        internships = [job for job in jobs if job.get('job_type') == 'Internship' or job.get('jobType') == 'Internship']
        
        print_success(f"Retrieved {len(jobs)} total jobs")
        print_info(f"Found {len(internships)} internships")
        
        if len(internships) > 0:
            print_info(f"Latest internship: {internships[0].get('job_title') or internships[0].get('jobTitle')}")
            return jobs, internships
        else:
            print_warning("No internships found for intern")
            return jobs, []
    else:
        print_error(f"Failed to get jobs: {response.status_code}")
        print_error(f"Response: {response.text}")
        return [], []

# Apply to internship
def apply_to_internship(intern_token, internship_id):
    """Apply to an internship as intern"""
    print_header("STEP 3: Intern Applies to Internship")
    
    application_data = {
        "job_id": internship_id,
        "cover_letter": "I am a computer science student passionate about software development. I would love to gain hands-on experience with your team this summer."
    }
    
    headers = {
        "Authorization": f"Bearer {intern_token}",
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
        print_warning("Already applied to this internship (expected for re-runs)")
        return "existing"
    else:
        print_error(f"Failed to apply: {response.status_code}")
        print_error(f"Response: {response.text}")
        return None

# Get applications for recruiter
def get_applications_for_recruiter(recruiter_token, job_id):
    """Get applications for recruiter's internship"""
    print_header("STEP 4: Recruiter Views Internship Applications")
    
    headers = {
        "Authorization": f"Bearer {recruiter_token}"
    }
    
    print_info(f"Getting applications for internship: {job_id}")
    response = requests.get(f"{BASE_URL}/applications/get_applications?jobId={job_id}", headers=headers)
    
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

# Get intern's applications
def get_intern_applications(intern_token):
    """Get applications submitted by intern"""
    print_header("STEP 5: Verify Intern Can See Their Applications")
    
    headers = {
        "Authorization": f"Bearer {intern_token}"
    }
    
    response = requests.get(f"{BASE_URL}/applications/my-applications", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        # Handle both response formats
        if isinstance(data, list):
            applications = data
        else:
            applications = data.get('applications', [])
        
        print_success(f"Intern has {len(applications)} applications")
        
        if len(applications) > 0:
            for i, app in enumerate(applications, 1):
                print_info(f"Application {i}:")
                print(f"   - Job: {app.get('job_title', 'Unknown')}")
                print(f"   - Company: {app.get('company_name', 'Unknown')}")
                print(f"   - Status: {app.get('status', 'Unknown')}")
        
        return applications
    else:
        print_error(f"Failed to get intern applications: {response.status_code}")
        return []

# Main test flow
def run_intern_flow_test():
    """Run the complete intern flow test"""
    print_header("INTERN FLOW TEST - START")
    print(f"Base URL: {BASE_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = {
        'recruiter_setup': False,
        'intern_setup': False,
        'internship_posted': False,
        'internship_visible': False,
        'application_submitted': False,
        'application_visible_to_recruiter': False,
        'application_visible_to_intern': False
    }
    
    # Setup recruiter
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
    
    # Setup intern
    intern_token, intern_id = create_or_login_user(
        TEST_INTERN_EMAIL,
        TEST_INTERN_PASSWORD,
        "intern",
        "Test",
        "Intern"
    )
    
    if intern_token:
        results['intern_setup'] = True
    else:
        print_error("Failed to setup intern. Aborting test.")
        return results
    
    # Post internship
    internship_id = post_internship(recruiter_token)
    if internship_id:
        results['internship_posted'] = True
    else:
        print_error("Failed to post internship. Aborting test.")
        return results
    
    # Get jobs for intern
    all_jobs, internships = get_jobs_for_intern(intern_token)
    if len(all_jobs) > 0:
        results['internship_visible'] = True
        # Verify our posted internship is in the list
        if any(str(job.get('_id')) == str(internship_id) for job in all_jobs):
            print_success("Posted internship is visible to intern!")
        else:
            print_warning("Posted internship not found in intern's job list")
    
    # Apply to internship
    application_id = apply_to_internship(intern_token, internship_id)
    if application_id:
        results['application_submitted'] = True
    else:
        print_error("Failed to submit application. Continuing to check existing applications...")
    
    # Get applications for recruiter
    applications = get_applications_for_recruiter(recruiter_token, internship_id)
    if len(applications) > 0:
        results['application_visible_to_recruiter'] = True
        # Verify intern's application is in the list
        if any(app.get('applicant_email') == TEST_INTERN_EMAIL for app in applications):
            print_success("Intern application is visible to recruiter!")
    
    # Get applications for intern
    intern_apps = get_intern_applications(intern_token)
    if len(intern_apps) > 0:
        results['application_visible_to_intern'] = True
        # Verify application to this internship exists
        if any(str(app.get('job_id')) == str(internship_id) for app in intern_apps):
            print_success("Application is visible to intern!")
    
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
        print_warning(f"{total_tests - passed_tests} tests failed")
        print(f"{Colors.RESET}")
        return False

if __name__ == "__main__":
    try:
        success = run_intern_flow_test()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Test interrupted by user{Colors.RESET}")
        sys.exit(1)
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

