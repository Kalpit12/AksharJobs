"""
Comprehensive Test for Job Seeker Registration Form Flow
Tests: Form submission, Data storage, Dashboard display
User: Dhruv Patel (dhruvpatel771@gmail.com)
"""

import requests
import json
from datetime import datetime
from pprint import pprint
from colorama import Fore, Style, init

# Initialize colorama for colored output
init(autoreset=True)

# Configuration
BASE_URL = "http://localhost:3002"
FRONTEND_URL = "http://localhost:3003"

# Test User Credentials
TEST_USER = {
    "email": "Dhruvpatel771@gmail.com",  # Note: Capital D (as stored in database)
    "password": "Dhruv@123",
    "firstName": "Dhruv",
    "lastName": "Patel"
}

# Comprehensive Form Data
FORM_DATA = {
    # Personal Information
    "firstName": "Dhruv",
    "middleName": "Kumar",
    "lastName": "Patel",
    "email": "Dhruvpatel771@gmail.com",
    "phone": "+91 9876543210",
    "altPhone": "+91 9876543211",
    "dateOfBirth": "1995-05-15",
    "gender": "male",
    "community": "Tech Community",
    "nationality": "India",
    "residentCountry": "India",
    "currentCity": "Mumbai",
    "postalCode": "400001",
    "address": "123 Main Street, Andheri West",
    "latitude": "19.1136",
    "longitude": "72.8697",
    "workPermit": "citizen",
    
    # Preferred Locations
    "preferredLocation1": "India",
    "preferredLocation2": "United States",
    "preferredLocation3": "United Kingdom",
    "willingToRelocate": "yes",
    "workLocation": "hybrid",
    
    # Professional Profile
    "professionalTitle": "Senior Full Stack Developer",
    "yearsExperience": "5-7",
    "careerLevel": "senior",
    "industry": "technology",
    "summary": "Experienced Full Stack Developer with 6 years of expertise in React, Node.js, and cloud technologies. Proven track record of delivering scalable web applications and leading development teams. Passionate about clean code and modern development practices.",
    
    # Skills
    "coreSkills": ["JavaScript", "React", "Node.js", "Python", "MongoDB", "PostgreSQL"],
    "tools": ["Git", "Docker", "AWS", "Jenkins", "Jira", "VS Code"],
    "languages": [
        {"language": "English", "proficiency": "fluent"},
        {"language": "Hindi", "proficiency": "native"},
        {"language": "Gujarati", "proficiency": "native"}
    ],
    
    # Work Experience
    "experienceEntries": [
        {
            "jobTitle": "Senior Full Stack Developer",
            "company": "TechCorp India",
            "companyLocation": "Mumbai, India",
            "employmentType": "full-time",
            "jobIndustry": "Technology",
            "startDate": "2021-03-01",
            "endDate": "",
            "currentJob": True,
            "jobDescription": "• Led a team of 5 developers in building scalable web applications\n• Implemented microservices architecture reducing system downtime by 40%\n• Mentored junior developers and conducted code reviews"
        },
        {
            "jobTitle": "Full Stack Developer",
            "company": "Innovation Labs",
            "companyLocation": "Pune, India",
            "employmentType": "full-time",
            "jobIndustry": "Technology",
            "startDate": "2019-06-01",
            "endDate": "2021-02-28",
            "currentJob": False,
            "jobDescription": "• Developed and maintained multiple web applications using React and Node.js\n• Collaborated with UX designers to improve user experience\n• Implemented automated testing reducing bugs by 30%"
        }
    ],
    
    # Education
    "educationEntries": [
        {
            "degreeType": "bachelors",
            "fieldOfStudy": "Computer Science",
            "institution": "Mumbai University",
            "institutionLocation": "Mumbai, India",
            "grade": "First Class (3.8/4.0)",
            "eduStartYear": "2013",
            "eduEndYear": "2017",
            "eduActivities": "President of Computer Science Society, Hackathon Winner 2016"
        }
    ],
    
    # Certifications
    "certificationEntries": [
        {
            "certificationName": "AWS Certified Solutions Architect",
            "certIssuer": "Amazon Web Services",
            "certIssueDate": "2021-06-15",
            "certExpiryDate": "2024-06-15",
            "credentialId": "AWS-SA-12345"
        },
        {
            "certificationName": "MongoDB Certified Developer",
            "certIssuer": "MongoDB University",
            "certIssueDate": "2020-08-20",
            "certExpiryDate": "",
            "credentialId": "MONGO-DEV-67890"
        }
    ],
    
    # Professional Memberships
    "membershipOrg": "IEEE Computer Society",
    "membershipType": "Professional Member",
    "membershipDate": "2018-01-01",
    
    # References
    "referenceEntries": [
        {
            "referenceName": "Rajesh Kumar",
            "referenceTitle": "Senior Engineering Manager",
            "referenceCompany": "TechCorp India",
            "referenceRelationship": "Direct Manager",
            "referenceEmail": "rajesh.kumar@techcorp.com",
            "referencePhone": "+91 9876543333"
        }
    ],
    
    # Professional Links
    "professionalLinks": [
        {"type": "linkedin", "url": "https://linkedin.com/in/dhruvpatel"},
        {"type": "github", "url": "https://github.com/dhruvpatel"},
        {"type": "portfolio", "url": "https://dhruvpatel.dev"}
    ],
    
    # Job Preferences
    "jobType": "full-time",
    "noticePeriod": "1-month",
    "currentSalary": "₹1,200,000 per year",
    "expectedSalary": "₹1,500,000 - ₹1,800,000 per year",
    "currencyPreference": "INR",
    "travelAvailability": "moderate",
    
    # Additional Information
    "askCommunity": "Looking for opportunities to work on cutting-edge technologies and lead development teams.",
    "hobbies": "Coding, Reading tech blogs, Playing cricket, Photography",
    "additionalComments": "Open to remote opportunities with flexible working hours.",
    "agreeTerms": True,
    "allowContact": True
}

class JobSeekerFormFlowTest:
    def __init__(self):
        self.session = requests.Session()
        self.token = None
        self.user_id = None
        self.test_results = {
            "login": False,
            "form_submission": False,
            "data_storage": False,
            "dashboard_fetch": False,
            "data_display": False
        }
    
    def print_header(self, text):
        """Print colored header"""
        print(f"\n{Fore.CYAN}{'='*80}")
        print(f"{Fore.CYAN}{text.center(80)}")
        print(f"{Fore.CYAN}{'='*80}\n")
    
    def print_success(self, text):
        """Print success message"""
        print(f"{Fore.GREEN}✅ {text}")
    
    def print_error(self, text):
        """Print error message"""
        print(f"{Fore.RED}❌ {text}")
    
    def print_info(self, text):
        """Print info message"""
        print(f"{Fore.YELLOW}ℹ️  {text}")
    
    def print_data(self, label, data):
        """Print data with label"""
        print(f"\n{Fore.MAGENTA}{label}:")
        pprint(data, indent=2, width=120)
    
    def test_1_login(self):
        """Test 1: Login with Dhruv Patel's credentials"""
        self.print_header("TEST 1: USER LOGIN")
        
        try:
            login_url = f"{BASE_URL}/api/auth/login"
            payload = {
                "email": TEST_USER["email"],
                "password": TEST_USER["password"]
            }
            
            self.print_info(f"Logging in as: {TEST_USER['email']}")
            response = self.session.post(login_url, json=payload)
            
            if response.status_code == 200:
                data = response.json()
                self.token = data.get('token') or data.get('access_token')
                self.user_id = data.get('userId') or data.get('user_id')
                
                self.print_success(f"Login successful!")
                self.print_data("Login Response", {
                    "token": self.token[:50] + "..." if self.token else "None",
                    "userId": self.user_id,
                    "role": data.get('role'),
                    "email": data.get('email')
                })
                
                self.test_results["login"] = True
                return True
            else:
                self.print_error(f"Login failed: {response.status_code}")
                self.print_data("Error Response", response.json())
                return False
                
        except Exception as e:
            self.print_error(f"Login exception: {str(e)}")
            return False
    
    def test_2_submit_form(self):
        """Test 2: Submit registration form data"""
        self.print_header("TEST 2: FORM SUBMISSION")
        
        if not self.token:
            self.print_error("Cannot submit form - not logged in")
            return False
        
        try:
            form_url = f"{BASE_URL}/api/jobseeker/complete-profile"
            headers = {
                "Authorization": f"Bearer {self.token}"
                # Note: Don't set Content-Type for multipart/form-data, requests will set it automatically
            }
            
            self.print_info(f"Submitting form data with {len(FORM_DATA)} fields...")
            self.print_info(f"Personal Info: {FORM_DATA['firstName']} {FORM_DATA['lastName']}")
            self.print_info(f"Professional: {FORM_DATA['professionalTitle']}")
            self.print_info(f"Experience Entries: {len(FORM_DATA['experienceEntries'])}")
            self.print_info(f"Education Entries: {len(FORM_DATA['educationEntries'])}")
            self.print_info(f"Skills: {len(FORM_DATA['coreSkills'])} core skills")
            
            # Convert to form data (multipart/form-data)
            form_data_to_send = {}
            for key, value in FORM_DATA.items():
                if isinstance(value, (list, dict)):
                    form_data_to_send[key] = json.dumps(value)
                elif isinstance(value, bool):
                    form_data_to_send[key] = str(value).lower()
                else:
                    form_data_to_send[key] = str(value) if value is not None else ''
            
            response = self.session.post(form_url, data=form_data_to_send, headers=headers)
            
            if response.status_code in [200, 201]:
                self.print_success("Form submitted successfully!")
                self.print_data("Submission Response", response.json())
                self.test_results["form_submission"] = True
                return True
            else:
                self.print_error(f"Form submission failed: {response.status_code}")
                try:
                    self.print_data("Error Response", response.json())
                except:
                    print(response.text)
                return False
                
        except Exception as e:
            self.print_error(f"Form submission exception: {str(e)}")
            return False
    
    def test_3_verify_storage(self):
        """Test 3: Verify data is stored in database"""
        self.print_header("TEST 3: DATA STORAGE VERIFICATION")
        
        if not self.token:
            self.print_error("Cannot verify storage - not logged in")
            return False
        
        try:
            profile_url = f"{BASE_URL}/api/jobseeker/profile"
            headers = {"Authorization": f"Bearer {self.token}"}
            
            self.print_info("Fetching stored profile data...")
            response = self.session.get(profile_url, headers=headers)
            
            if response.status_code == 200:
                stored_data = response.json()
                
                # Verify key fields
                checks = {
                    "First Name": stored_data.get('firstName') == FORM_DATA['firstName'],
                    "Last Name": stored_data.get('lastName') == FORM_DATA['lastName'],
                    "Email": stored_data.get('email') == FORM_DATA['email'],
                    "Phone": stored_data.get('phone') == FORM_DATA['phone'],
                    "Professional Title": stored_data.get('professionalTitle') == FORM_DATA['professionalTitle'],
                    "Years Experience": 'yearsExperience' in stored_data,
                    "Core Skills": len(stored_data.get('coreSkills', [])) > 0,
                    "Experience Entries": len(stored_data.get('experienceEntries', [])) > 0,
                    "Education Entries": len(stored_data.get('educationEntries', [])) > 0,
                    "Professional Links": len(stored_data.get('professionalLinks', [])) > 0
                }
                
                passed = sum(checks.values())
                total = len(checks)
                
                print(f"\n{Fore.CYAN}Storage Verification Results:")
                for field, status in checks.items():
                    if status:
                        self.print_success(f"{field}: Stored correctly")
                    else:
                        self.print_error(f"{field}: NOT stored or incorrect")
                
                self.print_info(f"\nPassed: {passed}/{total} checks")
                
                if passed >= total * 0.8:  # 80% pass rate
                    self.print_success("Data storage verification PASSED!")
                    self.test_results["data_storage"] = True
                    return True
                else:
                    self.print_error("Data storage verification FAILED!")
                    return False
                    
            else:
                self.print_error(f"Failed to fetch stored data: {response.status_code}")
                return False
                
        except Exception as e:
            self.print_error(f"Storage verification exception: {str(e)}")
            return False
    
    def test_4_dashboard_fetch(self):
        """Test 4: Fetch dashboard data"""
        self.print_header("TEST 4: DASHBOARD DATA FETCH")
        
        if not self.token:
            self.print_error("Cannot fetch dashboard - not logged in")
            return False
        
        try:
            dashboard_url = f"{BASE_URL}/api/data"
            headers = {"Authorization": f"Bearer {self.token}"}
            
            self.print_info("Fetching dashboard data...")
            response = self.session.get(dashboard_url, headers=headers)
            
            if response.status_code == 200:
                dashboard_data = response.json()
                
                self.print_success("Dashboard data fetched successfully!")
                self.print_data("Dashboard Stats", dashboard_data.get('stats', {}))
                self.print_data("User Data", {
                    "name": dashboard_data.get('user', {}).get('name'),
                    "email": dashboard_data.get('user', {}).get('email'),
                    "phone": dashboard_data.get('user', {}).get('phone'),
                    "location": dashboard_data.get('user', {}).get('location'),
                    "profileCompleted": dashboard_data.get('user', {}).get('profileCompleted')
                })
                
                self.test_results["dashboard_fetch"] = True
                return True
            else:
                self.print_error(f"Dashboard fetch failed: {response.status_code}")
                try:
                    self.print_data("Error Response", response.json())
                except:
                    print(response.text)
                return False
                
        except Exception as e:
            self.print_error(f"Dashboard fetch exception: {str(e)}")
            return False
    
    def test_5_my_profile_display(self):
        """Test 5: Verify My Profile page can display all fields"""
        self.print_header("TEST 5: MY PROFILE DISPLAY VERIFICATION")
        
        if not self.token:
            self.print_error("Cannot verify profile display - not logged in")
            return False
        
        try:
            profile_url = f"{BASE_URL}/api/jobseeker/profile"
            headers = {"Authorization": f"Bearer {self.token}"}
            
            self.print_info("Fetching profile for My Profile page...")
            response = self.session.get(profile_url, headers=headers)
            
            if response.status_code == 200:
                profile_data = response.json()
                
                # Check all 31 form fields
                expected_fields = [
                    'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender',
                    'nationality', 'residentCountry', 'currentCity', 'workPermit',
                    'preferredLocation1', 'preferredLocation2', 'willingToRelocate', 'workLocation',
                    'currentJobTitle', 'professionalTitle', 'yearsOfExperience', 'currentEmployer',
                    'expectedSalary', 'salaryCurrency', 'jobTypePreference', 'availability',
                    'professionalSummary', 'coreSkills', 'tools', 'languages',
                    'experienceEntries', 'educationEntries', 'certificationEntries',
                    'referenceEntries', 'professionalLinks'
                ]
                
                field_status = {}
                for field in expected_fields:
                    value = profile_data.get(field)
                    if value is not None and value != '' and value != []:
                        field_status[field] = True
                    else:
                        field_status[field] = False
                
                present = sum(field_status.values())
                total = len(expected_fields)
                
                print(f"\n{Fore.CYAN}My Profile Field Verification ({present}/{total} fields present):")
                
                # Group by category
                personal_fields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender', 
                                 'nationality', 'residentCountry', 'currentCity', 'workPermit',
                                 'preferredLocation1', 'preferredLocation2', 'willingToRelocate', 'workLocation']
                
                professional_fields = ['currentJobTitle', 'professionalTitle', 'yearsOfExperience', 'currentEmployer',
                                     'expectedSalary', 'salaryCurrency', 'jobTypePreference', 'availability']
                
                content_fields = ['professionalSummary', 'coreSkills', 'tools', 'languages',
                                'experienceEntries', 'educationEntries', 'certificationEntries',
                                'referenceEntries', 'professionalLinks']
                
                print(f"\n{Fore.YELLOW}Personal Information Fields:")
                for field in personal_fields:
                    if field_status.get(field):
                        self.print_success(f"{field}: ✓ Available")
                    else:
                        self.print_error(f"{field}: ✗ Missing")
                
                print(f"\n{Fore.YELLOW}Professional Details Fields:")
                for field in professional_fields:
                    if field_status.get(field):
                        self.print_success(f"{field}: ✓ Available")
                    else:
                        self.print_error(f"{field}: ✗ Missing")
                
                print(f"\n{Fore.YELLOW}Content & Arrays Fields:")
                for field in content_fields:
                    if field_status.get(field):
                        count = len(profile_data.get(field, [])) if isinstance(profile_data.get(field), list) else "yes"
                        self.print_success(f"{field}: ✓ Available ({count})")
                    else:
                        self.print_error(f"{field}: ✗ Missing")
                
                completion_rate = (present / total) * 100
                self.print_info(f"\nProfile Completion: {completion_rate:.1f}%")
                
                if completion_rate >= 70:
                    self.print_success("My Profile display verification PASSED!")
                    self.test_results["data_display"] = True
                    return True
                else:
                    self.print_error("My Profile display verification FAILED - too many missing fields!")
                    return False
                    
            else:
                self.print_error(f"Failed to fetch profile: {response.status_code}")
                return False
                
        except Exception as e:
            self.print_error(f"Profile display verification exception: {str(e)}")
            return False
    
    def test_6_frontend_check(self):
        """Test 6: Check if frontend is accessible"""
        self.print_header("TEST 6: FRONTEND ACCESSIBILITY CHECK")
        
        try:
            pages_to_check = [
                f"{FRONTEND_URL}/login",
                f"{FRONTEND_URL}/jobseeker-registration",
                f"{FRONTEND_URL}/jobseeker-dashboard"
            ]
            
            for page in pages_to_check:
                try:
                    response = requests.get(page, timeout=5)
                    if response.status_code == 200:
                        self.print_success(f"{page} - Accessible")
                    else:
                        self.print_error(f"{page} - Status {response.status_code}")
                except Exception as e:
                    self.print_error(f"{page} - Not accessible: {str(e)}")
            
            return True
            
        except Exception as e:
            self.print_error(f"Frontend check exception: {str(e)}")
            return False
    
    def generate_report(self):
        """Generate final test report"""
        self.print_header("FINAL TEST REPORT")
        
        total_tests = len(self.test_results)
        passed_tests = sum(self.test_results.values())
        
        print(f"\n{Fore.CYAN}Test Summary:")
        for test_name, result in self.test_results.items():
            status = f"{Fore.GREEN}PASSED ✅" if result else f"{Fore.RED}FAILED ❌"
            print(f"  {test_name.replace('_', ' ').title()}: {status}")
        
        print(f"\n{Fore.CYAN}Overall Result:")
        print(f"  Total Tests: {total_tests}")
        print(f"  Passed: {Fore.GREEN}{passed_tests}")
        print(f"  Failed: {Fore.RED}{total_tests - passed_tests}")
        
        pass_rate = (passed_tests / total_tests) * 100
        print(f"  Pass Rate: {Fore.YELLOW}{pass_rate:.1f}%")
        
        if pass_rate == 100:
            self.print_success("\n🎉 ALL TESTS PASSED! Complete flow is working perfectly!")
        elif pass_rate >= 80:
            self.print_info("\n⚠️  Most tests passed. Some minor issues need attention.")
        else:
            self.print_error("\n❌ Several tests failed. Please review the errors above.")
        
        print(f"\n{Fore.CYAN}Next Steps:")
        if not self.test_results["login"]:
            print(f"  • Fix login - ensure user exists and credentials are correct")
        if not self.test_results["form_submission"]:
            print(f"  • Fix form submission endpoint - check API route")
        if not self.test_results["data_storage"]:
            print(f"  • Fix data storage - check database connection")
        if not self.test_results["dashboard_fetch"]:
            print(f"  • Fix dashboard endpoint - check /api/data route")
        if not self.test_results["data_display"]:
            print(f"  • Fix profile display - ensure all fields are mapped")
        
        if pass_rate == 100:
            print(f"\n{Fore.GREEN}✅ Ready for production testing with Dhruv Patel!")
            print(f"{Fore.CYAN}Test the complete flow in browser:")
            print(f"  1. Login: {FRONTEND_URL}/login")
            print(f"  2. Fill form: {FRONTEND_URL}/jobseeker-registration")
            print(f"  3. View profile: {FRONTEND_URL}/jobseeker-dashboard")
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        self.print_header("DHRUV PATEL - COMPLETE FORM FLOW TEST")
        print(f"{Fore.YELLOW}Testing User: {TEST_USER['email']}")
        print(f"{Fore.YELLOW}Backend URL: {BASE_URL}")
        print(f"{Fore.YELLOW}Frontend URL: {FRONTEND_URL}")
        print(f"{Fore.YELLOW}Test Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Run tests in sequence
        if self.test_1_login():
            self.test_2_submit_form()
            self.test_3_verify_storage()
            self.test_4_dashboard_fetch()
            self.test_5_my_profile_display()
        
        self.test_6_frontend_check()
        
        # Generate final report
        self.generate_report()


if __name__ == "__main__":
    print(f"{Fore.CYAN}╔══════════════════════════════════════════════════════════════════════════════╗")
    print(f"{Fore.CYAN}║        JOB SEEKER REGISTRATION FORM - COMPLETE FLOW TEST                     ║")
    print(f"{Fore.CYAN}║        User: Dhruv Patel (dhruvpatel771@gmail.com)                           ║")
    print(f"{Fore.CYAN}╚══════════════════════════════════════════════════════════════════════════════╝")
    
    tester = JobSeekerFormFlowTest()
    tester.run_all_tests()

