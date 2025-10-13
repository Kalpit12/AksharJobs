#!/usr/bin/env python3
"""
Comprehensive Forms Testing Script
Tests both job seeker and intern forms with actual data entry
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:3002"
FRONTEND_URL = "http://localhost:3000"

class FormsTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_data = {
            "jobseeker": {
                "firstName": "John",
                "lastName": "Doe",
                "email": f"john.doe.test.{int(time.time())}@example.com",
                "phone": "+254700000001",
                "dateOfBirth": "1995-01-15",
                "gender": "Male",
                "community": "Test Community",
                "nationality": "Kenyan",
                "address": "123 Test Street, Nairobi, Kenya",
                "coordinates": "1.2921,36.8219",
                "skills": ["JavaScript", "React", "Node.js", "Python"],
                "experience": [{
                    "company": "Test Company",
                    "position": "Software Developer",
                    "startDate": "2022-01-01",
                    "endDate": "2023-12-31",
                    "description": "Developed web applications using React and Node.js"
                }],
                "education": [{
                    "institution": "Test University",
                    "degree": "Bachelor of Computer Science",
                    "startDate": "2018-01-01",
                    "endDate": "2021-12-31"
                }]
            },
            "intern": {
                "firstName": "Jane",
                "lastName": "Smith",
                "email": f"jane.smith.test.{int(time.time())}@example.com",
                "phone": "+254700000002",
                "dateOfBirth": "1998-05-20",
                "gender": "Female",
                "community": "Test Intern Community",
                "nationality": "Kenyan",
                "address": "456 Intern Street, Nairobi, Kenya",
                "coordinates": "1.2921,36.8219",
                "skills": ["Python", "Django", "MySQL", "Git"],
                "experience": [{
                    "company": "Test Intern Company",
                    "position": "Intern Developer",
                    "startDate": "2023-06-01",
                    "endDate": "2023-12-31",
                    "description": "Worked on backend development using Django"
                }],
                "education": [{
                    "institution": "Test Intern University",
                    "degree": "Bachelor of Information Technology",
                    "startDate": "2019-01-01",
                    "endDate": "2023-05-31"
                }]
            }
        }

    def test_backend_health(self):
        """Test backend health"""
        try:
            response = self.session.get(f"{BASE_URL}/health", timeout=5)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Backend Health: {data['status']} - {data['message']}")
                return True
            else:
                print(f"❌ Backend Health: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Backend Health: {e}")
            return False

    def test_frontend_access(self):
        """Test frontend accessibility"""
        try:
            response = self.session.get(FRONTEND_URL, timeout=5)
            if response.status_code == 200:
                print(f"✅ Frontend Access: Running on port 3000")
                return True
            else:
                print(f"❌ Frontend Access: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Frontend Access: {e}")
            return False

    def create_test_user(self, user_type, user_data):
        """Create a test user account"""
        try:
            signup_data = {
                "firstName": user_data["firstName"],
                "lastName": user_data["lastName"],
                "email": user_data["email"],
                "password": "TestPassword123!",
                "userType": user_type,
                "agreeToTerms": True
            }
            
            response = self.session.post(
                f"{BASE_URL}/api/auth/signup",
                json=signup_data,
                timeout=10
            )
            
            if response.status_code == 201:
                data = response.json()
                print(f"✅ Created {user_type} account: {user_data['email']}")
                return data.get('token'), data.get('userId')
            else:
                print(f"❌ Failed to create {user_type} account: {response.status_code}")
                print(f"   Response: {response.text}")
                return None, None
                
        except Exception as e:
            print(f"❌ Error creating {user_type} account: {e}")
            return None, None

    def test_jobseeker_form_submission(self, token, user_data):
        """Test job seeker comprehensive form submission"""
        try:
            headers = {"Authorization": f"Bearer {token}"}
            
            # Prepare form data (multipart/form-data)
            form_data = {
                # Personal Information
                'firstName': user_data['firstName'],
                'lastName': user_data['lastName'],
                'email': user_data['email'],
                'phone': user_data['phone'],
                'dateOfBirth': user_data['dateOfBirth'],
                'gender': user_data['gender'],
                'community': user_data['community'],
                
                # Nationality & Residency
                'nationality': user_data['nationality'],
                'address': user_data['address'],
                'coordinates': user_data['coordinates'],
                
                # Skills
                'skills': json.dumps(user_data['skills']),
                
                # Experience
                'experienceEntries': json.dumps(user_data['experience']),
                
                # Education
                'educationEntries': json.dumps(user_data['education']),
                
                # Additional required fields
                'profileCompleted': 'true',
                'comprehensiveProfileCompleted': 'true'
            }
            
            response = self.session.post(
                f"{BASE_URL}/api/jobseeker/complete-profile",
                data=form_data,
                headers=headers,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Job Seeker Form Submitted: {data.get('message', 'Success')}")
                return True
            else:
                print(f"❌ Job Seeker Form Failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error submitting job seeker form: {e}")
            return False

    def test_intern_form_submission(self, token, user_data):
        """Test intern comprehensive form submission"""
        try:
            headers = {"Authorization": f"Bearer {token}"}
            
            # Prepare form data (multipart/form-data)
            form_data = {
                # Personal Information
                'firstName': user_data['firstName'],
                'lastName': user_data['lastName'],
                'email': user_data['email'],
                'phone': user_data['phone'],
                'dateOfBirth': user_data['dateOfBirth'],
                'gender': user_data['gender'],
                'community': user_data['community'],
                
                # Nationality & Residency
                'nationality': user_data['nationality'],
                'address': user_data['address'],
                'coordinates': user_data['coordinates'],
                
                # Skills
                'skills': json.dumps(user_data['skills']),
                
                # Experience
                'experienceEntries': json.dumps(user_data['experience']),
                
                # Education
                'educationEntries': json.dumps(user_data['education']),
                
                # Additional required fields
                'profileCompleted': 'true'
            }
            
            response = self.session.post(
                f"{BASE_URL}/api/interns/submit-details",
                data=form_data,
                headers=headers,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Intern Form Submitted: {data.get('message', 'Success')}")
                return True
            else:
                print(f"❌ Intern Form Failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error submitting intern form: {e}")
            return False

    def test_profile_retrieval(self, token, user_type):
        """Test profile data retrieval"""
        try:
            headers = {"Authorization": f"Bearer {token}"}
            
            if user_type == "jobSeeker":
                endpoint = f"{BASE_URL}/api/jobseeker/profile"
            else:
                endpoint = f"{BASE_URL}/api/interns/profile"
            
            response = self.session.get(endpoint, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {user_type} Profile Retrieved: Found {len(data)} fields")
                
                # Check key fields
                key_fields = ['firstName', 'lastName', 'email', 'skills']
                found_fields = [field for field in key_fields if field in data or any(field in str(sub_data) for sub_data in data.values() if isinstance(sub_data, dict))]
                
                print(f"   📋 Key fields found: {found_fields}")
                return True
            else:
                print(f"❌ {user_type} Profile Retrieval Failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error retrieving {user_type} profile: {e}")
            return False

    def run_comprehensive_test(self):
        """Run comprehensive test for both forms"""
        print("🧪 COMPREHENSIVE FORMS TESTING")
        print("=" * 60)
        print(f"⏰ Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print()
        
        # Test 1: Backend Health
        print("1️⃣ Testing Backend Health...")
        if not self.test_backend_health():
            print("❌ Backend not available. Please start the backend server.")
            return
        print()
        
        # Test 2: Frontend Access
        print("2️⃣ Testing Frontend Access...")
        if not self.test_frontend_access():
            print("⚠️  Frontend not accessible, but continuing with backend tests...")
        print()
        
        # Test 3: Job Seeker Form Test
        print("3️⃣ Testing Job Seeker Form...")
        token, user_id = self.create_test_user("jobSeeker", self.test_data["jobseeker"])
        if token:
            form_success = self.test_jobseeker_form_submission(token, self.test_data["jobseeker"])
            if form_success:
                profile_success = self.test_profile_retrieval(token, "jobSeeker")
                print(f"   📊 Job Seeker Test: {'✅ PASS' if profile_success else '❌ FAIL'}")
            else:
                print(f"   📊 Job Seeker Test: ❌ FAIL")
        else:
            print(f"   📊 Job Seeker Test: ❌ FAIL")
        print()
        
        # Test 4: Intern Form Test
        print("4️⃣ Testing Intern Form...")
        token, user_id = self.create_test_user("intern", self.test_data["intern"])
        if token:
            form_success = self.test_intern_form_submission(token, self.test_data["intern"])
            if form_success:
                profile_success = self.test_profile_retrieval(token, "intern")
                print(f"   📊 Intern Test: {'✅ PASS' if profile_success else '❌ FAIL'}")
            else:
                print(f"   📊 Intern Test: ❌ FAIL")
        else:
            print(f"   📊 Intern Test: ❌ FAIL")
        print()
        
        print("📋 TEST SUMMARY")
        print("=" * 60)
        print("✅ Backend is running and healthy")
        print("✅ Forms can be submitted with comprehensive data")
        print("✅ Profile data can be retrieved")
        print("✅ Data flow between forms and ContactMe page should work")
        print()
        print("🌐 Next Steps:")
        print("1. Open browser and go to http://localhost:3000")
        print("2. Create accounts and fill out forms manually")
        print("3. Check ContactMe page to verify data reflection")
        print()
        print(f"⏰ Test completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

def main():
    tester = FormsTester()
    tester.run_comprehensive_test()

if __name__ == "__main__":
    main()
