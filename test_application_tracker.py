#!/usr/bin/env python3
"""
Comprehensive test script for the Application Tracker System
Tests all endpoints and functionality for both job seekers and recruiters
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:3002"

def print_section(title):
    """Print a formatted section header"""
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)

def print_result(test_name, passed, details=""):
    """Print test result"""
    status = "[PASS]" if passed else "[FAIL]"
    print(f"{status} - {test_name}")
    if details:
        print(f"     {details}")

def test_login(email, password):
    """Test login and return token"""
    print_section("Testing Login")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": email, "password": password},
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            user_data = {
                'token': token,
                'userId': data.get('userId'),
                'role': data.get('role'),
                'email': data.get('email')
            }
            print_result("Login", True, f"Logged in as {email}")
            return user_data
        else:
            print_result("Login", False, f"Status: {response.status_code}, Response: {response.text}")
            return None
    except Exception as e:
        print_result("Login", False, f"Exception: {str(e)}")
        return None

def test_get_applications(token):
    """Test getting job seeker applications"""
    print_section("Testing Get Job Seeker Applications")
    
    try:
        response = requests.get(
            f"{BASE_URL}/api/application-tracker/tracker/job-seeker/applications",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )
        
        if response.status_code == 200:
            applications = response.json()
            print_result("Get Applications", True, f"Found {len(applications)} applications")
            
            # Print application details
            for i, app in enumerate(applications[:3], 1):  # Show first 3
                print(f"\n     Application {i}:")
                print(f"       - Job: {app.get('job_title', 'N/A')}")
                print(f"       - Company: {app.get('company_name', 'N/A')}")
                print(f"       - Status: {app.get('status', 'N/A')}")
                print(f"       - Progress: {app.get('progress_percentage', 0)}%")
                print(f"       - History: {len(app.get('tracking_history', []))} updates")
            
            return True, applications
        else:
            print_result("Get Applications", False, f"Status: {response.status_code}")
            print(f"     Response: {response.text[:200]}")
            return False, []
    except Exception as e:
        print_result("Get Applications", False, f"Exception: {str(e)}")
        return False, []

def test_get_statistics(token):
    """Test getting application statistics"""
    print_section("Testing Get Application Statistics")
    
    try:
        response = requests.get(
            f"{BASE_URL}/api/application-tracker/tracker/statistics",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )
        
        if response.status_code == 200:
            stats = response.json()
            print_result("Get Statistics", True, "Statistics retrieved successfully")
            
            print("\n     Statistics:")
            print(f"       - Total Applications: {stats.get('total_applications', 0)}")
            print(f"       - Pending: {stats.get('pending', 0)}")
            print(f"       - AI Screening: {stats.get('ai_screening', 0)}")
            print(f"       - Reviewing: {stats.get('reviewing', 0)}")
            print(f"       - Shortlisted: {stats.get('shortlisted', 0)}")
            print(f"       - Interview: {stats.get('interview', 0)}")
            print(f"       - Hired: {stats.get('hired', 0)}")
            print(f"       - Rejected: {stats.get('rejected', 0)}")
            print(f"       - Avg Match Score: {stats.get('average_match_score', 0)}%")
            
            return True, stats
        else:
            print_result("Get Statistics", False, f"Status: {response.status_code}")
            return False, {}
    except Exception as e:
        print_result("Get Statistics", False, f"Exception: {str(e)}")
        return False, {}

def test_update_status(token, user_id, job_id, new_status):
    """Test updating application status (for recruiters)"""
    print_section("Testing Update Application Status")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/application-tracker/tracker/update-status",
            json={
                "user_id": user_id,
                "job_id": job_id,
                "status": new_status,
                "notes": "Test status update from automated script"
            },
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            print_result("Update Status", True, f"Updated to '{new_status}'")
            print(f"     Message: {result.get('message')}")
            return True
        else:
            print_result("Update Status", False, f"Status: {response.status_code}")
            print(f"     Response: {response.text[:200]}")
            return False
    except Exception as e:
        print_result("Update Status", False, f"Exception: {str(e)}")
        return False

def test_get_status_options():
    """Test getting available status options"""
    print_section("Testing Get Status Options")
    
    try:
        response = requests.get(
            f"{BASE_URL}/api/application-tracker/tracker/status-options",
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            options = response.json()
            print_result("Get Status Options", True, f"Found {len(options)} status options")
            
            print("\n     Available Statuses:")
            for option in options:
                print(f"       - {option.get('label')}: {option.get('description')}")
            
            return True, options
        else:
            print_result("Get Status Options", False, f"Status: {response.status_code}")
            return False, []
    except Exception as e:
        print_result("Get Status Options", False, f"Exception: {str(e)}")
        return False, []

def test_tracking_history(token, user_id, job_id):
    """Test getting tracking history for a specific application"""
    print_section("Testing Get Tracking History")
    
    try:
        response = requests.get(
            f"{BASE_URL}/api/application-tracker/tracker/history/{user_id}/{job_id}",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )
        
        if response.status_code == 200:
            history = response.json()
            print_result("Get Tracking History", True, f"Found {len(history)} history records")
            
            for i, record in enumerate(history[:5], 1):  # Show first 5
                print(f"\n     Record {i}:")
                print(f"       - Status: {record.get('status_display', 'N/A')}")
                print(f"       - Date: {record.get('timestamp', 'N/A')}")
                if record.get('notes'):
                    print(f"       - Notes: {record.get('notes')}")
            
            return True
        else:
            print_result("Get Tracking History", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_result("Get Tracking History", False, f"Exception: {str(e)}")
        return False

def run_all_tests():
    """Run all application tracker tests"""
    print("\n" + "=" * 60)
    print("  APPLICATION TRACKER COMPREHENSIVE TEST SUITE")
    print("=" * 60)
    print(f"\n[TIME] Test Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"[URL] Base URL: {BASE_URL}")
    
    # Test configuration
    jobseeker_email = "jobseeker@test.com"  # Update with actual test user
    jobseeker_password = "password123"       # Update with actual password
    
    print("\n[NOTE] Make sure you have test users and applications in the database")
    print("   You can create test data using the create_demo_applications.py script")
    
    # Test 1: Login as job seeker
    jobseeker_data = test_login(jobseeker_email, jobseeker_password)
    
    if not jobseeker_data:
        print("\n[ERROR] Cannot proceed without successful login")
        print("\n[TIP] Make sure:")
        print("   1. Backend server is running on port 3002")
        print("   2. Test user exists with correct credentials")
        print("   3. Database is accessible")
        return
    
    token = jobseeker_data['token']
    user_id = jobseeker_data['userId']
    
    # Test 2: Get status options (no auth required)
    test_get_status_options()
    
    # Test 3: Get job seeker applications
    success, applications = test_get_applications(token)
    
    # Test 4: Get application statistics
    test_get_statistics(token)
    
    # Test 5: Get tracking history (if we have applications)
    if success and applications:
        first_app = applications[0]
        app_user_id = first_app.get('applicant_id')
        app_job_id = first_app.get('job_id')
        
        if app_user_id and app_job_id:
            test_tracking_history(token, app_user_id, app_job_id)
    
    # Summary
    print_section("Test Summary")
    print("\n[SUCCESS] Core functionality tests completed")
    print("\n[NEXT] Next Steps:")
    print("   1. Test the frontend at http://localhost:3003/application-tracker")
    print("   2. Verify real-time updates (30-second polling)")
    print("   3. Test filtering and search functionality")
    print("   4. Test status progression and email notifications")
    print("   5. Test with multiple applications and different statuses")
    
    print("\n[CHECKLIST] Manual Testing:")
    print("   [ ] Navigate to /application-tracker as job seeker")
    print("   [ ] Verify all applications are displayed")
    print("   [ ] Check statistics cards show correct numbers")
    print("   [ ] Test search functionality")
    print("   [ ] Test status filter dropdown")
    print("   [ ] Click 'View Timeline' button on an application")
    print("   [ ] Verify modal shows tracking history")
    print("   [ ] Check progress bars animate correctly")
    print("   [ ] Verify responsive design on mobile")
    print("   [ ] Test refresh button")
    print("   [ ] Wait 30 seconds and verify auto-refresh")
    
    print(f"\n[TIME] Test Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60 + "\n")

if __name__ == "__main__":
    run_all_tests()

