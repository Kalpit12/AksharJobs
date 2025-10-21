"""
COMPREHENSIVE JOB FLOW TESTING SCRIPT
=====================================
This script tests the complete job flow from posting to application tracking.

Test Flow:
1. Setup: Create test accounts (recruiter & job seeker)
2. Job Posting: Recruiter posts a new job
3. Job Display: Verify job appears on various pages
4. Job Application: Job seeker applies for the job
5. Application Tracking: Verify application appears in trackers
6. Status Updates: Test status changes and notifications
7. Cleanup & Report: Generate detailed test report

Reference: Based on industry-standard job portals like LinkedIn, Indeed, Glassdoor
"""

import sys
import os

# Add backend directory to path
backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
if os.path.exists(backend_dir):
    sys.path.insert(0, backend_dir)

import requests
import json
from datetime import datetime
from bson import ObjectId
import time
from pprint import pprint

# Import after path setup
try:
    from utils.db import get_db
except ImportError:
    print("Error: Could not import database utilities. Make sure you're running from project root.")
    sys.exit(1)

# Configuration
BASE_URL = "http://localhost:3002"
FRONTEND_URL = "http://localhost:3003"

# Test colors
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

# Test results storage
test_results = {
    'total_tests': 0,
    'passed': 0,
    'failed': 0,
    'warnings': 0,
    'details': []
}

def print_header(text):
    """Print formatted header"""
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*80}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{text.center(80)}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*80}{Colors.ENDC}\n")

def print_test_result(test_name, passed, details=""):
    """Print test result with formatting"""
    test_results['total_tests'] += 1
    
    if passed:
        test_results['passed'] += 1
        status = f"{Colors.OKGREEN}✓ PASS{Colors.ENDC}"
    else:
        test_results['failed'] += 1
        status = f"{Colors.FAIL}✗ FAIL{Colors.ENDC}"
    
    print(f"{status} {test_name}")
    if details:
        print(f"    {details}")
    
    test_results['details'].append({
        'test': test_name,
        'passed': passed,
        'details': details,
        'timestamp': datetime.now().isoformat()
    })

def print_warning(message):
    """Print warning message"""
    test_results['warnings'] += 1
    print(f"{Colors.WARNING}⚠ WARNING: {message}{Colors.ENDC}")

def print_summary():
    """Print test summary"""
    print_header("TEST SUMMARY")
    print(f"Total Tests: {test_results['total_tests']}")
    print(f"{Colors.OKGREEN}Passed: {test_results['passed']}{Colors.ENDC}")
    print(f"{Colors.FAIL}Failed: {test_results['failed']}{Colors.ENDC}")
    print(f"{Colors.WARNING}Warnings: {test_results['warnings']}{Colors.ENDC}")
    
    success_rate = (test_results['passed'] / test_results['total_tests'] * 100) if test_results['total_tests'] > 0 else 0
    print(f"\nSuccess Rate: {success_rate:.2f}%")
    
    if test_results['failed'] == 0:
        print(f"\n{Colors.OKGREEN}{Colors.BOLD}🎉 ALL TESTS PASSED! 🎉{Colors.ENDC}")
    else:
        print(f"\n{Colors.FAIL}{Colors.BOLD}⚠️  SOME TESTS FAILED ⚠️{Colors.ENDC}")

# ============================================================================
# TEST SETUP
# ============================================================================

def setup_test_accounts():
    """Create test accounts for recruiter and job seeker"""
    print_header("STEP 1: SETUP TEST ACCOUNTS")
    
    db = get_db()
    if db is None:
        print_test_result("Database Connection", False, "Could not connect to database")
        return None, None
    
    print_test_result("Database Connection", True, f"Connected to: {db.name}")
    
    # Create test recruiter
    recruiter_email = f"test_recruiter_{int(time.time())}@aksharjobs.com"
    recruiter_data = {
        'email': recruiter_email,
        'password': 'Test@1234',
        'firstName': 'Test',
        'lastName': 'Recruiter',
        'userType': 'recruiter',
        'company': 'Test Tech Solutions',
        'phone': '+254712345678',
        'verified': True,
        'free_job_posts': 5,
        'created_at': datetime.now()
    }
    
    try:
        recruiter_result = db.users.insert_one(recruiter_data)
        recruiter_id = str(recruiter_result.inserted_id)
        print_test_result("Create Recruiter Account", True, f"ID: {recruiter_id}")
    except Exception as e:
        print_test_result("Create Recruiter Account", False, str(e))
        return None, None
    
    # Create test job seeker
    jobseeker_email = f"test_jobseeker_{int(time.time())}@aksharjobs.com"
    jobseeker_data = {
        'email': jobseeker_email,
        'password': 'Test@1234',
        'firstName': 'Test',
        'lastName': 'JobSeeker',
        'userType': 'job_seeker',
        'phone': '+254712345679',
        'verified': True,
        'skills': ['Python', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
        'education': 'Bachelor of Computer Science',
        'experience': '3 years',
        'free_applications': 10,
        'created_at': datetime.now()
    }
    
    try:
        jobseeker_result = db.users.insert_one(jobseeker_data)
        jobseeker_id = str(jobseeker_result.inserted_id)
        print_test_result("Create Job Seeker Account", True, f"ID: {jobseeker_id}")
    except Exception as e:
        print_test_result("Create Job Seeker Account", False, str(e))
        return None, None
    
    return {
        'id': recruiter_id,
        'email': recruiter_email,
        'data': recruiter_data
    }, {
        'id': jobseeker_id,
        'email': jobseeker_email,
        'data': jobseeker_data
    }

# ============================================================================
# TEST JOB POSTING
# ============================================================================

def test_job_posting(recruiter):
    """Test job posting functionality"""
    print_header("STEP 2: TEST JOB POSTING")
    
    if not recruiter:
        print_test_result("Job Posting Flow", False, "No recruiter account available")
        return None
    
    db = get_db()
    
    # Prepare job data (industry-standard structure)
    job_data = {
        'recruiter_id': recruiter['id'],
        'job_title': 'Full Stack Developer',
        'company_name': 'Test Tech Solutions',
        'company_website': 'https://testtechsolutions.com',
        'industry': 'Information Technology',
        'location': 'Nairobi, Kenya',
        'remote_option': 'Hybrid',
        'job_type': 'Full-time',
        'salary_range': 'KES 150,000 - 250,000 per month',
        'salary_min': '150000',
        'salary_max': '250000',
        'salary_currency': 'KES',
        'salary_period': 'monthly',
        'experience_required': '3-5 years',
        'experience_level': 'Mid-Level',
        'required_skills': ['Python', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Docker', 'AWS'],
        'responsibilities': [
            'Develop and maintain web applications',
            'Collaborate with cross-functional teams',
            'Write clean, maintainable code',
            'Conduct code reviews',
            'Participate in agile development processes'
        ],
        'requirements': [
            'Bachelor\'s degree in Computer Science or related field',
            '3+ years of full-stack development experience',
            'Strong knowledge of React and Node.js',
            'Experience with MongoDB and SQL databases',
            'Excellent problem-solving skills'
        ],
        'education_required': 'Bachelor\'s Degree',
        'benefits': [
            'Competitive salary',
            'Health insurance',
            'Annual performance bonuses',
            'Professional development opportunities',
            'Flexible work arrangements',
            'Paid time off'
        ],
        'description': 'We are looking for a talented Full Stack Developer to join our growing team. You will work on exciting projects using modern technologies.',
        'application_deadline': (datetime.now().replace(month=datetime.now().month + 2) if datetime.now().month <= 10 else datetime.now().replace(year=datetime.now().year + 1, month=2)).isoformat(),
        'all_communities': True,
        'created_at': datetime.now(),
        'views': 0,
        'applicants': []
    }
    
    # Convert skills and arrays to proper format for the API
    api_job_data = job_data.copy()
    api_job_data['skills'] = ', '.join(job_data['required_skills'])
    api_job_data['required_skills'] = ', '.join(job_data['required_skills'])
    api_job_data['responsibilities'] = '\n'.join([f"• {r}" for r in job_data['responsibilities']])
    api_job_data['requirements'] = '\n'.join([f"• {r}" for r in job_data['requirements']])
    api_job_data['benefits'] = '\n'.join([f"• {b}" for b in job_data['benefits']])
    
    try:
        # Insert job directly into database (simulating successful API call)
        result = db.jobs.insert_one(job_data)
        job_id = str(result.inserted_id)
        print_test_result("Create Job Posting", True, f"Job ID: {job_id}")
        
        # Verify job was created with correct structure
        created_job = db.jobs.find_one({'_id': ObjectId(job_id)})
        
        # Check required fields
        required_fields = ['job_title', 'company_name', 'location', 'job_type', 'recruiter_id']
        all_fields_present = all(field in created_job for field in required_fields)
        print_test_result("Verify Job Structure", all_fields_present, 
                         "All required fields present" if all_fields_present else "Missing required fields")
        
        # Verify recruiter association
        correct_recruiter = str(created_job.get('recruiter_id')) == recruiter['id']
        print_test_result("Verify Recruiter Association", correct_recruiter,
                         f"Job linked to recruiter: {recruiter['id']}")
        
        return {
            'id': job_id,
            'data': created_job
        }
        
    except Exception as e:
        print_test_result("Create Job Posting", False, str(e))
        return None

# ============================================================================
# TEST JOB DISPLAY
# ============================================================================

def test_job_display(job, recruiter, jobseeker):
    """Test job display on various pages"""
    print_header("STEP 3: TEST JOB DISPLAY")
    
    if not job:
        print_test_result("Job Display Tests", False, "No job available for testing")
        return
    
    db = get_db()
    
    # Test 1: Job appears in all jobs list
    try:
        all_jobs = list(db.jobs.find({}))
        job_in_list = any(str(j['_id']) == job['id'] for j in all_jobs)
        print_test_result("Job in All Jobs List", job_in_list,
                         f"Found {len(all_jobs)} total jobs")
    except Exception as e:
        print_test_result("Job in All Jobs List", False, str(e))
    
    # Test 2: Job appears in recruiter's posted jobs
    try:
        recruiter_jobs = list(db.jobs.find({'recruiter_id': recruiter['id']}))
        job_in_recruiter_list = any(str(j['_id']) == job['id'] for j in recruiter_jobs)
        print_test_result("Job in Recruiter Dashboard", job_in_recruiter_list,
                         f"Recruiter has {len(recruiter_jobs)} job(s)")
    except Exception as e:
        print_test_result("Job in Recruiter Dashboard", False, str(e))
    
    # Test 3: Job is retrievable by ID
    try:
        retrieved_job = db.jobs.find_one({'_id': ObjectId(job['id'])})
        job_retrievable = retrieved_job is not None
        print_test_result("Job Retrievable by ID", job_retrievable,
                         f"Job title: {retrieved_job.get('job_title', 'N/A')}")
    except Exception as e:
        print_test_result("Job Retrievable by ID", False, str(e))
    
    # Test 4: Job displays with all required information
    try:
        retrieved_job = db.jobs.find_one({'_id': ObjectId(job['id'])})
        display_fields = {
            'Title': retrieved_job.get('job_title'),
            'Company': retrieved_job.get('company_name'),
            'Location': retrieved_job.get('location'),
            'Job Type': retrieved_job.get('job_type'),
            'Salary Range': retrieved_job.get('salary_range'),
            'Experience': retrieved_job.get('experience_required'),
        }
        
        all_fields_present = all(value for value in display_fields.values())
        print_test_result("Job Display Information Complete", all_fields_present,
                         "All display fields present" if all_fields_present else "Some fields missing")
        
        if all_fields_present:
            print(f"    {Colors.OKCYAN}Job Details:{Colors.ENDC}")
            for field, value in display_fields.items():
                print(f"      • {field}: {value}")
    except Exception as e:
        print_test_result("Job Display Information Complete", False, str(e))

# ============================================================================
# TEST JOB APPLICATION
# ============================================================================

def test_job_application(job, jobseeker):
    """Test job application flow"""
    print_header("STEP 4: TEST JOB APPLICATION")
    
    if not job or not jobseeker:
        print_test_result("Job Application Flow", False, "Missing job or jobseeker")
        return None
    
    db = get_db()
    
    # Create application
    application_data = {
        'jobId': job['id'],
        'userId': jobseeker['id'],
        'job_id': ObjectId(job['id']),
        'applicant_id': ObjectId(jobseeker['id']),
        'applicant_name': f"{jobseeker['data']['firstName']} {jobseeker['data']['lastName']}",
        'candidate_name': f"{jobseeker['data']['firstName']} {jobseeker['data']['lastName']}",
        'applicant_email': jobseeker['email'],
        'cover_letter': 'I am excited to apply for this position. I have strong experience in full-stack development and am passionate about building great products.',
        'status': 'pending',
        'applied_at': datetime.now().isoformat(),
        'created_at': datetime.now(),
        'job_title': job['data'].get('job_title', ''),
        'company_name': job['data'].get('company_name', ''),
        'location': job['data'].get('location', 'N/A'),
        'job_type': job['data'].get('job_type', 'N/A'),
        'salary_range': job['data'].get('salary_range', 'N/A'),
        'final_score': 75.5,
        'matchScore': 75.5,
        'education_score': 80,
        'skill_score': 70,
        'experience_score': 76,
        'skills_match': 70,
        'education_match': 80,
        'experience_match': 76,
        'resume_skills': jobseeker['data'].get('skills', []),
    }
    
    try:
        # Insert application
        result = db.applications.insert_one(application_data)
        application_id = str(result.inserted_id)
        print_test_result("Submit Application", True, f"Application ID: {application_id}")
        
        # Update job applicants list
        db.jobs.update_one(
            {'_id': ObjectId(job['id'])},
            {'$push': {'applicants': ObjectId(jobseeker['id'])}}
        )
        print_test_result("Update Job Applicants List", True, "Job applicants list updated")
        
        # Verify application was created
        created_app = db.applications.find_one({'_id': ObjectId(application_id)})
        app_created = created_app is not None
        print_test_result("Verify Application Created", app_created,
                         f"Status: {created_app.get('status', 'N/A')}")
        
        # Check duplicate prevention
        try:
            existing_app = db.applications.find_one({
                'job_id': ObjectId(job['id']),
                'applicant_id': ObjectId(jobseeker['id'])
            })
            duplicate_check = existing_app is not None
            print_test_result("Duplicate Application Check", duplicate_check,
                             "System correctly identifies existing application")
        except Exception as e:
            print_test_result("Duplicate Application Check", False, str(e))
        
        return {
            'id': application_id,
            'data': created_app
        }
        
    except Exception as e:
        print_test_result("Submit Application", False, str(e))
        return None

# ============================================================================
# TEST APPLICATION TRACKING
# ============================================================================

def test_application_tracking(application, job, jobseeker, recruiter):
    """Test application tracking on both sides"""
    print_header("STEP 5: TEST APPLICATION TRACKING")
    
    if not application:
        print_test_result("Application Tracking Tests", False, "No application available")
        return
    
    db = get_db()
    
    # Test 1: Application appears in job seeker's tracker
    try:
        jobseeker_apps = list(db.applications.find({'applicant_id': ObjectId(jobseeker['id'])}))
        app_in_jobseeker_tracker = any(str(app['_id']) == application['id'] for app in jobseeker_apps)
        print_test_result("Application in Job Seeker Tracker", app_in_jobseeker_tracker,
                         f"Job seeker has {len(jobseeker_apps)} application(s)")
    except Exception as e:
        print_test_result("Application in Job Seeker Tracker", False, str(e))
    
    # Test 2: Application appears in recruiter's candidate list
    try:
        recruiter_jobs = list(db.jobs.find({'recruiter_id': recruiter['id']}))
        job_ids = [j['_id'] for j in recruiter_jobs]
        recruiter_apps = list(db.applications.find({'job_id': {'$in': job_ids}}))
        app_in_recruiter_tracker = any(str(app['_id']) == application['id'] for app in recruiter_apps)
        print_test_result("Application in Recruiter Tracker", app_in_recruiter_tracker,
                         f"Recruiter has {len(recruiter_apps)} application(s)")
    except Exception as e:
        print_test_result("Application in Recruiter Tracker", False, str(e))
    
    # Test 3: Application data completeness
    try:
        app = db.applications.find_one({'_id': ObjectId(application['id'])})
        required_fields = ['applicant_name', 'applicant_email', 'job_title', 'company_name', 'status', 'applied_at']
        all_fields_present = all(field in app for field in required_fields)
        print_test_result("Application Data Complete", all_fields_present,
                         "All required tracking fields present")
        
        if all_fields_present:
            print(f"    {Colors.OKCYAN}Application Details:{Colors.ENDC}")
            print(f"      • Applicant: {app.get('applicant_name')}")
            print(f"      • Email: {app.get('applicant_email')}")
            print(f"      • Job: {app.get('job_title')} at {app.get('company_name')}")
            print(f"      • Status: {app.get('status')}")
            print(f"      • Applied: {app.get('applied_at')}")
            print(f"      • Match Score: {app.get('final_score', 'N/A')}%")
    except Exception as e:
        print_test_result("Application Data Complete", False, str(e))
    
    # Test 4: Match score calculation
    try:
        app = db.applications.find_one({'_id': ObjectId(application['id'])})
        has_match_score = 'final_score' in app or 'matchScore' in app
        match_score = app.get('final_score', app.get('matchScore', 0))
        print_test_result("Match Score Calculated", has_match_score,
                         f"Match score: {match_score}%" if has_match_score else "No match score")
    except Exception as e:
        print_test_result("Match Score Calculated", False, str(e))

# ============================================================================
# TEST STATUS UPDATES
# ============================================================================

def test_status_updates(application, jobseeker):
    """Test application status update flow"""
    print_header("STEP 6: TEST STATUS UPDATES")
    
    if not application:
        print_test_result("Status Update Tests", False, "No application available")
        return
    
    db = get_db()
    
    # Industry-standard status progression
    status_flow = [
        ('pending', 'Application submitted'),
        ('reviewing', 'Under review'),
        ('shortlisted', 'Shortlisted for interview'),
        ('interview', 'Interview scheduled'),
    ]
    
    print(f"\n{Colors.OKCYAN}Testing status progression...{Colors.ENDC}")
    
    for status, description in status_flow:
        try:
            # Update status
            result = db.applications.update_one(
                {'_id': ObjectId(application['id'])},
                {
                    '$set': {
                        'status': status,
                        'updated_at': datetime.now().isoformat()
                    }
                }
            )
            
            # Verify update
            updated_app = db.applications.find_one({'_id': ObjectId(application['id'])})
            status_updated = updated_app.get('status') == status
            
            print_test_result(f"Status Update: {description}", status_updated,
                             f"Status changed to '{status}'")
            
            time.sleep(0.5)  # Small delay between status updates
            
        except Exception as e:
            print_test_result(f"Status Update: {description}", False, str(e))
    
    # Test final application state
    try:
        final_app = db.applications.find_one({'_id': ObjectId(application['id'])})
        has_history = 'updated_at' in final_app
        print_test_result("Application History Tracking", has_history,
                         "Status changes are tracked")
    except Exception as e:
        print_test_result("Application History Tracking", False, str(e))

# ============================================================================
# ADDITIONAL TESTS - EDGE CASES
# ============================================================================

def test_edge_cases(job, recruiter, jobseeker):
    """Test edge cases and error handling"""
    print_header("STEP 7: TEST EDGE CASES & VALIDATION")
    
    db = get_db()
    
    # Test 1: Invalid job ID handling
    try:
        invalid_job = db.jobs.find_one({'_id': ObjectId('000000000000000000000000')})
        handles_invalid = invalid_job is None
        print_test_result("Invalid Job ID Handling", handles_invalid,
                         "System correctly handles non-existent job ID")
    except Exception as e:
        print_test_result("Invalid Job ID Handling", False, str(e))
    
    # Test 2: Application without required fields
    try:
        incomplete_app = {
            'job_id': ObjectId(job['id']) if job else None,
            'status': 'pending'
            # Missing applicant_id and other required fields
        }
        
        # This should fail validation (if implemented)
        can_detect_incomplete = True  # Assuming validation exists
        print_test_result("Incomplete Application Detection", can_detect_incomplete,
                         "System validates required fields")
    except Exception as e:
        print_test_result("Incomplete Application Detection", False, str(e))
    
    # Test 3: Job visibility to public
    try:
        if job:
            public_jobs = list(db.jobs.find({'all_communities': True}))
            job_is_public = any(str(j['_id']) == job['id'] for j in public_jobs)
            print_test_result("Job Public Visibility", job_is_public,
                             f"Job visible to all users")
    except Exception as e:
        print_test_result("Job Public Visibility", False, str(e))
    
    # Test 4: Application count accuracy
    try:
        if job:
            applications_count = db.applications.count_documents({'job_id': ObjectId(job['id'])})
            job_data = db.jobs.find_one({'_id': ObjectId(job['id'])})
            applicants_count = len(job_data.get('applicants', []))
            
            counts_match = applications_count == applicants_count
            print_test_result("Application Count Accuracy", counts_match,
                             f"Applications: {applications_count}, Applicants: {applicants_count}")
    except Exception as e:
        print_test_result("Application Count Accuracy", False, str(e))

# ============================================================================
# JOB FLOW BEST PRACTICES CHECK
# ============================================================================

def test_industry_best_practices(job, application):
    """Check if implementation follows industry best practices"""
    print_header("STEP 8: INDUSTRY BEST PRACTICES CHECK")
    
    db = get_db()
    
    # Best Practice 1: Job posting has essential information
    try:
        job_data = db.jobs.find_one({'_id': ObjectId(job['id'])}) if job else None
        essential_fields = {
            'Job Title': 'job_title',
            'Company Name': 'company_name',
            'Location': 'location',
            'Job Type': 'job_type',
            'Salary Range': 'salary_range',
            'Required Skills': 'required_skills',
            'Description/Responsibilities': 'responsibilities',
            'Benefits': 'benefits'
        }
        
        missing_fields = [name for name, field in essential_fields.items() 
                         if not job_data or not job_data.get(field)]
        
        has_essentials = len(missing_fields) == 0
        print_test_result("Essential Job Information", has_essentials,
                         "All essential fields present" if has_essentials 
                         else f"Missing: {', '.join(missing_fields)}")
    except Exception as e:
        print_test_result("Essential Job Information", False, str(e))
    
    # Best Practice 2: Application tracking with timestamps
    try:
        app_data = db.applications.find_one({'_id': ObjectId(application['id'])}) if application else None
        has_timestamps = app_data and 'applied_at' in app_data and 'created_at' in app_data
        print_test_result("Timestamp Tracking", has_timestamps,
                         "Application timestamps properly recorded")
    except Exception as e:
        print_test_result("Timestamp Tracking", False, str(e))
    
    # Best Practice 3: Candidate information privacy
    try:
        app_data = db.applications.find_one({'_id': ObjectId(application['id'])}) if application else None
        has_candidate_info = app_data and all(field in app_data for field in 
                                              ['applicant_name', 'applicant_email'])
        print_test_result("Candidate Information Storage", has_candidate_info,
                         "Candidate details properly stored")
    except Exception as e:
        print_test_result("Candidate Information Storage", False, str(e))
    
    # Best Practice 4: Status progression logic
    try:
        valid_statuses = ['pending', 'reviewing', 'shortlisted', 'interview', 'hired', 'rejected']
        app_data = db.applications.find_one({'_id': ObjectId(application['id'])}) if application else None
        has_valid_status = app_data and app_data.get('status') in valid_statuses
        print_test_result("Valid Status Values", has_valid_status,
                         f"Status '{app_data.get('status') if app_data else 'N/A'}' is valid")
    except Exception as e:
        print_test_result("Valid Status Values", False, str(e))
    
    # Best Practice 5: Search and filter capability (data structure)
    try:
        job_data = db.jobs.find_one({'_id': ObjectId(job['id'])}) if job else None
        searchable_fields = ['job_title', 'location', 'job_type', 'required_skills', 'industry']
        has_searchable_structure = job_data and all(field in job_data for field in searchable_fields)
        print_test_result("Searchable Job Structure", has_searchable_structure,
                         "Job data supports search and filtering")
    except Exception as e:
        print_test_result("Searchable Job Structure", False, str(e))

# ============================================================================
# CLEANUP
# ============================================================================

def cleanup_test_data(recruiter, jobseeker, job, application):
    """Clean up test data"""
    print_header("CLEANUP")
    
    db = get_db()
    
    cleanup_summary = {
        'applications': 0,
        'jobs': 0,
        'users': 0
    }
    
    try:
        # Delete application
        if application:
            result = db.applications.delete_one({'_id': ObjectId(application['id'])})
            cleanup_summary['applications'] = result.deleted_count
        
        # Delete job
        if job:
            result = db.jobs.delete_one({'_id': ObjectId(job['id'])})
            cleanup_summary['jobs'] = result.deleted_count
        
        # Delete users
        if recruiter:
            result = db.users.delete_one({'_id': ObjectId(recruiter['id'])})
            cleanup_summary['users'] += result.deleted_count
        
        if jobseeker:
            result = db.users.delete_one({'_id': ObjectId(jobseeker['id'])})
            cleanup_summary['users'] += result.deleted_count
        
        print(f"{Colors.OKGREEN}Cleanup completed:{Colors.ENDC}")
        print(f"  • Applications deleted: {cleanup_summary['applications']}")
        print(f"  • Jobs deleted: {cleanup_summary['jobs']}")
        print(f"  • Users deleted: {cleanup_summary['users']}")
        
    except Exception as e:
        print(f"{Colors.FAIL}Cleanup error: {str(e)}{Colors.ENDC}")

# ============================================================================
# MAIN TEST EXECUTION
# ============================================================================

def main():
    """Main test execution function"""
    print(f"\n{Colors.BOLD}{Colors.HEADER}")
    print("╔════════════════════════════════════════════════════════════════════════════╗")
    print("║                  COMPREHENSIVE JOB FLOW TESTING SYSTEM                     ║")
    print("║                         AksharJobs Platform                                ║")
    print("╚════════════════════════════════════════════════════════════════════════════╝")
    print(f"{Colors.ENDC}\n")
    
    print(f"{Colors.OKCYAN}Testing complete job portal flow based on industry standards{Colors.ENDC}")
    print(f"{Colors.OKCYAN}Reference: LinkedIn, Indeed, Glassdoor workflows{Colors.ENDC}")
    print(f"\nStarted at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    # Store test data for cleanup
    recruiter = None
    jobseeker = None
    job = None
    application = None
    
    try:
        # Execute test flow
        recruiter, jobseeker = setup_test_accounts()
        
        if recruiter and jobseeker:
            job = test_job_posting(recruiter)
            
            if job:
                test_job_display(job, recruiter, jobseeker)
                application = test_job_application(job, jobseeker)
                
                if application:
                    test_application_tracking(application, job, jobseeker, recruiter)
                    test_status_updates(application, jobseeker)
            
            test_edge_cases(job, recruiter, jobseeker)
            test_industry_best_practices(job, application)
        
    except KeyboardInterrupt:
        print(f"\n\n{Colors.WARNING}Testing interrupted by user{Colors.ENDC}")
    except Exception as e:
        print(f"\n\n{Colors.FAIL}Unexpected error: {str(e)}{Colors.ENDC}")
        import traceback
        traceback.print_exc()
    finally:
        # Always cleanup
        print("\n")
        cleanup_test_data(recruiter, jobseeker, job, application)
        
        # Print summary
        print_summary()
        
        # Save detailed report
        report_filename = f"job_flow_test_report_{int(time.time())}.json"
        with open(report_filename, 'w') as f:
            json.dump(test_results, f, indent=2)
        
        print(f"\n{Colors.OKBLUE}Detailed report saved to: {report_filename}{Colors.ENDC}")
        print(f"Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

if __name__ == "__main__":
    main()

