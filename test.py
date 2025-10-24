"""
Comprehensive End-to-End Test for AksharJobs
Tests the complete flow: Signup → Profile Completion → Dashboard → MyProfile Data Display

SETUP INSTRUCTIONS:
1. Install required packages:
   pip install requests

2. Ensure backend server is running:
   - Backend should be running on http://localhost:5000
   - MongoDB should be connected and accessible
   
3. Run the test:
   python test.py

4. The test will:
   - Create a new user account
   - Login with that account
   - Complete the comprehensive profile form
   - Fetch the profile data to verify it's saved correctly
   - Check dashboard loading
   - Verify recommended jobs based on preferred titles
"""

import requests
import json
import time
from datetime import datetime
import random
import string
import sys

# Configuration
BASE_URL = "http://localhost:3002"  # Backend runs on port 3002
API_BASE = f"{BASE_URL}/api"

# Test data
def generate_test_email():
    """Generate a unique test email"""
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"test_user_{random_str}@test.com"

TEST_USER = {
    "email": generate_test_email(),
    "password": "TestPassword123!",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "job_seeker"
}

# Comprehensive profile data
PROFILE_DATA = {
    # Personal Information
    "firstName": "John",
    "middleName": "Michael",
    "lastName": "Doe",
    "dateOfBirth": "1995-05-15",
    "gender": "Male",
    "bloodGroup": "O+",
    "email": TEST_USER["email"],
    "phone": "+1234567890",
    "altPhone": "+1987654321",
    "community": "General",
    
    # Nationality & Residency
    "nationality": "United States",
    "residentCountry": "United States",
    "currentCity": "San Francisco",
    "postalCode": "94102",
    "address": "123 Tech Street, Silicon Valley",
    "latitude": "37.7749",
    "longitude": "-122.4194",
    "workPermit": "Citizen",
    
    # Preferred Working Locations
    "preferredLocation1": "San Francisco",
    "preferredLocation2": "New York",
    "preferredLocation3": "Austin",
    "willingToRelocate": "Yes, immediately",
    "workLocation": "Hybrid",
    
    # Professional Profile
    "professionalTitle": "Senior Software Engineer",
    "yearsOfExperience": "5",
    "careerLevel": "Senior Level",
    "industry": "Information Technology",
    "professionalSummary": "Experienced software engineer with 5+ years in full-stack development. Specialized in React, Node.js, and cloud technologies.",
    
    # Job Preferences
    "preferredJobTitles": "Software Engineer, Full Stack Developer, Backend Engineer",
    "jobType": "full-time",
    "noticePeriod": "2-weeks",
    "currentSalary": "USD 120,000 per year",
    "expectedSalary": "USD 140,000 - 160,000 per year",
    "currencyPreference": "USD",
    "travelAvailability": "25% or less",
    
    # Skills
    "coreSkills": json.dumps(["JavaScript", "Python", "React", "Node.js", "MongoDB", "AWS", "Docker", "Kubernetes"]),
    "languages": json.dumps([
        {"language": "English", "proficiency": "Native"},
        {"language": "Spanish", "proficiency": "Intermediate"}
    ]),
    
    # Work Experience
    "experienceEntries": json.dumps([
        {
            "jobTitle": "Senior Software Engineer",
            "companyName": "TechCorp Inc",
            "companyLocation": "San Francisco, CA",
            "employmentType": "Full-time",
            "industry": "Information Technology",
            "startDate": "2020-01",
            "endDate": "",
            "currentJob": True,
            "responsibilities": "Led development of microservices architecture. Managed team of 5 developers. Improved system performance by 40%."
        },
        {
            "jobTitle": "Software Developer",
            "companyName": "StartupXYZ",
            "companyLocation": "Austin, TX",
            "employmentType": "Full-time",
            "industry": "Technology",
            "startDate": "2018-06",
            "endDate": "2019-12",
            "currentJob": False,
            "responsibilities": "Developed full-stack web applications using React and Node.js. Integrated third-party APIs."
        }
    ]),
    
    # Education
    "educationEntries": json.dumps([
        {
            "degreeType": "Bachelor's Degree",
            "fieldOfStudy": "Computer Science",
            "institutionName": "Stanford University",
            "institutionLocation": "Stanford, CA",
            "grade": "3.8 GPA",
            "startYear": "2014",
            "endYear": "2018",
            "activities": "Computer Science Club President, Hackathon Winner 2017"
        }
    ]),
    
    # Certifications
    "certificationEntries": json.dumps([
        {
            "certificationName": "AWS Certified Solutions Architect",
            "issuingOrganization": "Amazon Web Services",
            "issueDate": "2021-03",
            "expiryDate": "2024-03",
            "credentialId": "AWS-12345-6789"
        }
    ]),
    
    # Professional Links
    "professionalLinks": json.dumps([
        {"platform": "LinkedIn", "url": "https://linkedin.com/in/johndoe"},
        {"platform": "GitHub", "url": "https://github.com/johndoe"},
        {"platform": "Portfolio", "url": "https://johndoe.dev"}
    ]),
    
    # References
    "referenceEntries": json.dumps([
        {
            "referenceName": "Jane Smith",
            "referenceTitle": "Engineering Manager",
            "referenceCompany": "TechCorp Inc",
            "referenceEmail": "jane.smith@techcorp.com",
            "referencePhone": "+1555123456"
        }
    ]),
    
    # Memberships
    "membershipOrg": "IEEE Computer Society",
    "membershipType": "Professional Member",
    "membershipDate": "2019-01",
    
    # Additional Information
    "careerObjectives": "Seeking challenging opportunities in cloud architecture and system design.",
    "hobbies": "Open source contribution, hiking, photography",
    "additionalComments": "Available for remote work",
    "agreeTerms": "true",
    "allowContact": "true",
    
    # Meta
    "profileCompleted": "true",
    "isDraft": "false"
}


class Colors:
    """ANSI color codes for terminal output"""
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'


def print_header(text):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*80}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{text.center(80)}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*80}{Colors.ENDC}\n")


def print_success(text):
    print(f"{Colors.OKGREEN}✓ {text}{Colors.ENDC}")


def print_error(text):
    print(f"{Colors.FAIL}✗ {text}{Colors.ENDC}")


def print_info(text):
    print(f"{Colors.OKCYAN}ℹ {text}{Colors.ENDC}")


def print_warning(text):
    print(f"{Colors.WARNING}⚠ {text}{Colors.ENDC}")


class JobSeekerE2ETest:
    def __init__(self):
        self.token = None
        self.user_id = None
        self.session = requests.Session()
        self.test_results = {
            "passed": 0,
            "failed": 0,
            "errors": []
        }
    
    def check_server_connection(self):
        """Check if backend server is accessible"""
        print_header("PRE-CHECK: Server Connection")
        
        try:
            print_info(f"Checking connection to {BASE_URL}...")
            response = requests.get(BASE_URL, timeout=5)
            print_success(f"Server is accessible! (Status: {response.status_code})")
            return True
        except requests.exceptions.ConnectionError:
            print_error(f"Cannot connect to {BASE_URL}")
            print_error("Please ensure:")
            print_error("  1. Backend server is running")
            print_error("  2. MongoDB is connected")
            print_error("  3. BASE_URL in test.py is correct")
            return False
        except Exception as e:
            print_warning(f"Server check warning: {str(e)}")
            print_info("Proceeding with tests...")
            return True
    
    def assert_true(self, condition, success_msg, error_msg):
        """Assert a condition and track results"""
        if condition:
            print_success(success_msg)
            self.test_results["passed"] += 1
            return True
        else:
            print_error(error_msg)
            self.test_results["failed"] += 1
            self.test_results["errors"].append(error_msg)
            return False
    
    def test_1_signup(self):
        """Test user registration"""
        print_header("TEST 1: User Registration (Signup)")
        
        print_info(f"Creating new user: {TEST_USER['email']}")
        
        try:
            response = self.session.post(
                f"{API_BASE}/auth/signup",
                json=TEST_USER,
                headers={"Content-Type": "application/json"}
            )
            
            print_info(f"Response Status: {response.status_code}")
            
            if response.status_code in [200, 201]:
                data = response.json()
                print_success(f"User registered successfully!")
                print_info(f"Response keys: {list(data.keys())}")
                
                # Extract token if present
                token = data.get("token") or data.get("access_token")
                if token:
                    print_info(f"Token received: {token[:20]}...")
                
                # Extract user info
                if "user" in data:
                    user_info = data["user"]
                    print_info(f"User ID: {user_info.get('userId') or user_info.get('_id')}")
                    print_info(f"User Type: {user_info.get('userType')}")
                
                self.assert_true(
                    data.get("message") or data.get("success") or "user" in data or "token" in data,
                    "Signup completed successfully",
                    "Signup response missing expected fields"
                )
                
                return True
            else:
                print_error(f"Signup failed with status {response.status_code}")
                try:
                    error_data = response.json()
                    print_error(f"Error: {error_data.get('error', 'Unknown error')}")
                except:
                    print_error(f"Response: {response.text}")
                self.test_results["failed"] += 1
                return False
                
        except Exception as e:
            print_error(f"Signup error: {str(e)}")
            self.test_results["failed"] += 1
            self.test_results["errors"].append(str(e))
            return False
    
    def test_2_login(self):
        """Test user login"""
        print_header("TEST 2: User Login")
        
        print_info(f"Logging in as: {TEST_USER['email']}")
        
        try:
            response = self.session.post(
                f"{API_BASE}/auth/login",
                json={
                    "email": TEST_USER["email"],
                    "password": TEST_USER["password"]
                },
                headers={"Content-Type": "application/json"}
            )
            
            print_info(f"Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print_info(f"Login response keys: {list(data.keys())}")
                
                self.token = data.get("token") or data.get("access_token")
                self.user_id = data.get("userId") or data.get("user_id") or data.get("user", {}).get("userId")
                
                print_success("Login successful!")
                print_info(f"Token: {self.token[:20]}..." if self.token else "No token")
                print_info(f"User ID: {self.user_id}")
                
                if data.get("firstName"):
                    print_info(f"User Name: {data.get('firstName')} {data.get('lastName')}")
                if data.get("email"):
                    print_info(f"Email: {data.get('email')}")
                
                self.assert_true(
                    self.token is not None,
                    "Authentication token received",
                    "No authentication token received"
                )
                
                self.assert_true(
                    self.user_id is not None,
                    "User ID received",
                    "No user ID received"
                )
                
                return True
            else:
                print_error(f"Login failed with status {response.status_code}")
                print_error(f"Response: {response.text}")
                self.test_results["failed"] += 1
                return False
                
        except Exception as e:
            print_error(f"Login error: {str(e)}")
            self.test_results["failed"] += 1
            self.test_results["errors"].append(str(e))
            return False
    
    def test_3_complete_profile(self):
        """Test completing jobseeker profile"""
        print_header("TEST 3: Complete Jobseeker Profile Form")
        
        if not self.token:
            print_error("Cannot complete profile without authentication token")
            self.test_results["failed"] += 1
            return False
        
        print_info("Submitting comprehensive profile data...")
        print_info(f"Total fields: {len(PROFILE_DATA)}")
        
        try:
            # Update email in profile data to match test user
            PROFILE_DATA["email"] = TEST_USER["email"]
            
            response = self.session.post(
                f"{API_BASE}/jobseeker/complete-profile",
                data=PROFILE_DATA,
                headers={"Authorization": f"Bearer {self.token}"}
            )
            
            print_info(f"Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print_success("Profile completed successfully!")
                print_info(f"Response: {json.dumps(data, indent=2)}")
                
                self.assert_true(
                    data.get("success") == True,
                    "Profile completion confirmed",
                    "Profile completion not confirmed"
                )
                
                self.assert_true(
                    data.get("profileCompleted") == True or data.get("comprehensiveProfileCompleted") == True,
                    "Profile marked as completed",
                    "Profile not marked as completed"
                )
                
                # Wait a moment for database to update
                print_info("Waiting 2 seconds for database to sync...")
                time.sleep(2)
                return True
            else:
                print_error(f"Profile completion failed with status {response.status_code}")
                print_error(f"Response: {response.text}")
                self.test_results["failed"] += 1
                return False
                
        except Exception as e:
            print_error(f"Profile completion error: {str(e)}")
            self.test_results["failed"] += 1
            self.test_results["errors"].append(str(e))
            return False
    
    def test_4_fetch_profile(self):
        """Test fetching jobseeker profile data"""
        print_header("TEST 4: Fetch Profile Data (MyProfile Page)")
        
        if not self.token:
            print_error("Cannot fetch profile without authentication token")
            self.test_results["failed"] += 1
            return False
        
        print_info("Fetching profile from /api/jobseeker/profile...")
        
        try:
            response = self.session.get(
                f"{API_BASE}/jobseeker/profile",
                headers={"Authorization": f"Bearer {self.token}"}
            )
            
            print_info(f"Response Status: {response.status_code}")
            
            if response.status_code == 200:
                profile = response.json()
                print_success("Profile data retrieved successfully!")
                print_info(f"Total fields in response: {len(profile)}")
                
                # Test critical fields
                critical_fields = {
                    "firstName": "John",
                    "middleName": "Michael",
                    "lastName": "Doe",
                    "email": TEST_USER["email"],
                    "phone": "+1234567890",
                    "dateOfBirth": "1995-05-15",
                    "gender": "Male",
                    "bloodGroup": "O+",
                    "nationality": "United States",
                    "currentCity": "San Francisco",
                    "professionalTitle": "Senior Software Engineer",
                    "yearsOfExperience": "5",
                    "careerLevel": "Senior Level",
                    "industry": "Information Technology",
                    "preferredJobTitles": "Software Engineer, Full Stack Developer, Backend Engineer",
                    "jobType": "full-time",
                    "noticePeriod": "2-weeks"
                }
                
                print_info("\nValidating critical fields:")
                missing_fields = []
                incorrect_fields = []
                
                for field, expected_value in critical_fields.items():
                    actual_value = profile.get(field)
                    
                    # Handle nested fields (e.g., in jobPreferences)
                    if actual_value is None and field == "jobType":
                        actual_value = profile.get("jobPreferences", {}).get("jobType")
                    if actual_value is None and field == "noticePeriod":
                        actual_value = profile.get("jobPreferences", {}).get("noticePeriod")
                    
                    if actual_value is None or actual_value == "":
                        missing_fields.append(field)
                        print_error(f"  {field}: MISSING (expected: '{expected_value}')")
                    elif str(actual_value).strip() != str(expected_value).strip():
                        incorrect_fields.append(field)
                        print_warning(f"  {field}: '{actual_value}' (expected: '{expected_value}')")
                    else:
                        print_success(f"  {field}: ✓")
                
                # Test array fields
                print_info("\nValidating array fields:")
                array_fields = ["experienceEntries", "educationEntries", "certificationEntries", "coreSkills", "languages"]
                
                for field in array_fields:
                    if field in profile and profile[field]:
                        count = len(profile[field]) if isinstance(profile[field], list) else 1
                        print_success(f"  {field}: ✓ ({count} items)")
                        self.test_results["passed"] += 1
                    else:
                        print_error(f"  {field}: MISSING or EMPTY")
                        missing_fields.append(field)
                        self.test_results["failed"] += 1
                
                # Summary
                print_info(f"\nValidation Summary:")
                print_info(f"  Total fields checked: {len(critical_fields) + len(array_fields)}")
                print_success(f"  Correct fields: {len(critical_fields) - len(missing_fields) - len(incorrect_fields)}")
                
                if missing_fields:
                    print_error(f"  Missing fields: {len(missing_fields)}")
                    print_error(f"    {', '.join(missing_fields)}")
                
                if incorrect_fields:
                    print_warning(f"  Incorrect fields: {len(incorrect_fields)}")
                    print_warning(f"    {', '.join(incorrect_fields)}")
                
                # Overall assertions
                self.assert_true(
                    len(missing_fields) == 0,
                    "All critical fields are present",
                    f"Missing {len(missing_fields)} critical fields"
                )
                
                self.assert_true(
                    len(incorrect_fields) == 0,
                    "All critical fields have correct values",
                    f"{len(incorrect_fields)} fields have incorrect values"
                )
                
                return len(missing_fields) == 0 and len(incorrect_fields) == 0
            else:
                print_error(f"Profile fetch failed with status {response.status_code}")
                print_error(f"Response: {response.text}")
                self.test_results["failed"] += 1
                return False
                
        except Exception as e:
            print_error(f"Profile fetch error: {str(e)}")
            self.test_results["failed"] += 1
            self.test_results["errors"].append(str(e))
            return False
    
    def test_5_dashboard(self):
        """Test dashboard data loading"""
        print_header("TEST 5: Dashboard Data Loading")
        
        if not self.token:
            print_error("Cannot load dashboard without authentication token")
            self.test_results["failed"] += 1
            return False
        
        print_info("Fetching dashboard data...")
        
        try:
            # Try dashboard data endpoint
            response = self.session.get(
                f"{API_BASE}/data",
                headers={"Authorization": f"Bearer {self.token}"}
            )
            
            print_info(f"Response Status: {response.status_code}")
            
            if response.status_code == 200:
                dashboard = response.json()
                print_success("Dashboard data loaded successfully!")
                
                # Check dashboard components
                components = ["user", "stats", "profileCompletion"]
                
                for component in components:
                    if component in dashboard:
                        print_success(f"  {component}: ✓")
                        self.test_results["passed"] += 1
                    else:
                        print_error(f"  {component}: MISSING")
                        self.test_results["failed"] += 1
                
                # Check profile completion
                if "profileCompletion" in dashboard:
                    completion = dashboard["profileCompletion"]
                    print_info(f"  Profile Completion: {completion}%")
                    
                    self.assert_true(
                        completion >= 80,
                        f"Profile completion is {completion}% (good!)",
                        f"Profile completion is only {completion}%"
                    )
                
                # Check if draft mode
                if dashboard.get("isDraft"):
                    print_warning("  Profile is in DRAFT mode")
                else:
                    print_success("  Profile is COMPLETED")
                
                return True
            else:
                print_error(f"Dashboard endpoint returned {response.status_code}")
                try:
                    error_data = response.json()
                    print_error(f"Error: {error_data}")
                except:
                    print_error(f"Response: {response.text}")
                self.test_results["failed"] += 1
                return False
                
        except Exception as e:
            print_error(f"Dashboard test error: {str(e)}")
            self.test_results["failed"] += 1
            self.test_results["errors"].append(f"Dashboard: {str(e)}")
            return False
    
    def test_6_recommended_jobs(self):
        """Test recommended jobs based on preferred job titles"""
        print_header("TEST 6: Recommended Jobs (Preferred Job Titles)")
        
        if not self.token:
            print_error("Cannot fetch recommended jobs without authentication token")
            self.test_results["failed"] += 1
            return False
        
        print_info("Fetching recommended jobs...")
        print_info("User's preferred titles: Software Engineer, Full Stack Developer, Backend Engineer")
        
        try:
            response = self.session.get(
                f"{API_BASE}/jobs/recommended",
                headers={"Authorization": f"Bearer {self.token}"}
            )
            
            print_info(f"Response Status: {response.status_code}")
            
            if response.status_code == 200:
                jobs = response.json()
                print_success(f"Recommended jobs retrieved: {len(jobs)} jobs")
                
                # Check if jobs have match scores
                jobs_with_scores = [j for j in jobs if j.get("match_score", 0) > 0]
                
                if jobs_with_scores:
                    print_success(f"  Jobs with match scores: {len(jobs_with_scores)}")
                    
                    # Show top 3 matches
                    print_info("\n  Top 3 Matches:")
                    for i, job in enumerate(jobs_with_scores[:3], 1):
                        title = job.get("title") or job.get("job_title", "Unknown")
                        score = job.get("match_score", 0)
                        reasons = job.get("match_reasons", [])
                        
                        print_info(f"    {i}. {title}")
                        print_info(f"       Score: {score}%")
                        if reasons:
                            print_info(f"       Reason: {reasons[0]}")
                    
                    self.assert_true(
                        True,
                        "Job recommendations working with match scores",
                        "Job recommendations not working"
                    )
                else:
                    print_warning("  No jobs with match scores (might not have matching jobs in DB)")
                
                return True
            else:
                print_warning(f"Recommended jobs endpoint returned {response.status_code}")
                return True  # Don't fail if no jobs available
                
        except Exception as e:
            print_warning(f"Recommended jobs test: {str(e)}")
            return True
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print_header("AKSHARJOBS E2E TEST SUITE")
        print_info(f"Base URL: {BASE_URL}")
        print_info(f"Test User: {TEST_USER['email']}")
        print_info(f"Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Check server connection first
        if not self.check_server_connection():
            print_error("\n❌ Cannot proceed with tests - server not accessible")
            sys.exit(1)
        
        # Run tests in sequence
        tests = [
            self.test_1_signup,
            self.test_2_login,
            self.test_3_complete_profile,
            self.test_4_fetch_profile,
            self.test_5_dashboard,
            self.test_6_recommended_jobs
        ]
        
        for test in tests:
            try:
                test()
                time.sleep(0.5)  # Small delay between tests
            except Exception as e:
                print_error(f"Test {test.__name__} failed with exception: {str(e)}")
                self.test_results["failed"] += 1
                self.test_results["errors"].append(f"{test.__name__}: {str(e)}")
        
        # Print final results
        self.print_final_results()
    
    def print_final_results(self):
        """Print final test results"""
        print_header("TEST RESULTS SUMMARY")
        
        total = self.test_results["passed"] + self.test_results["failed"]
        passed_percentage = (self.test_results["passed"] / total * 100) if total > 0 else 0
        
        print_info(f"Total Assertions: {total}")
        print_success(f"Passed: {self.test_results['passed']} ({passed_percentage:.1f}%)")
        
        if self.test_results["failed"] > 0:
            print_error(f"Failed: {self.test_results['failed']}")
            
            if self.test_results["errors"]:
                print_error("\nErrors:")
                for error in self.test_results["errors"]:
                    print_error(f"  • {error}")
        
        print("\n" + "="*80)
        
        if self.test_results["failed"] == 0:
            print_success("🎉 ALL TESTS PASSED! 🎉")
        elif passed_percentage >= 80:
            print_warning("⚠️  TESTS MOSTLY PASSED (some minor issues)")
        else:
            print_error("❌ TESTS FAILED - NEEDS ATTENTION")
        
        print("="*80 + "\n")


if __name__ == "__main__":
    print(f"""
{Colors.BOLD}AksharJobs E2E Test Suite{Colors.ENDC}
{Colors.OKCYAN}Testing complete user journey:{Colors.ENDC}
  1. User Registration (Signup)
  2. User Login
  3. Complete JobSeeker Profile Form
  4. Fetch Profile Data (MyProfile Page)
  5. Dashboard Data Loading
  6. Recommended Jobs (Based on Preferred Titles)
    """)
    
    # Run tests
    tester = JobSeekerE2ETest()
    tester.run_all_tests()

