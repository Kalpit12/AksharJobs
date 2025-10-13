#!/usr/bin/env python3
"""
Debug script to check what's actually stored in the job seeker profile
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:3002"

def create_test_jobseeker():
    """Create a test job seeker account"""
    try:
        signup_data = {
            "firstName": "Debug",
            "lastName": "Test",
            "email": f"debug.test.{int(time.time())}@example.com",
            "password": "TestPassword123!",
            "userType": "jobSeeker",
            "agreeToTerms": True
        }
        
        response = requests.post(
            f"{BASE_URL}/api/auth/signup",
            json=signup_data,
            timeout=30
        )
        
        if response.status_code == 201:
            data = response.json()
            print(f"✅ Created test job seeker account: {signup_data['email']}")
            return data.get('token'), data.get('userId')
        else:
            print(f"❌ Failed to create account: {response.status_code}")
            print(f"   Response: {response.text}")
            return None, None
            
    except Exception as e:
        print(f"❌ Error creating account: {e}")
        return None, None

def submit_comprehensive_form(token):
    """Submit comprehensive job seeker form with detailed data"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        # Prepare comprehensive form data
        form_data = {
            # Personal Information
            'firstName': 'Debug',
            'lastName': 'Test',
            'email': f'debug.test.{int(time.time())}@example.com',
            'phone': '+254700000001',
            'dateOfBirth': '1995-01-15',
            'gender': 'Male',
            'community': 'Test Community',
            
            # Nationality & Residency
            'nationality': 'Kenyan',
            'residentCountry': 'Kenya',
            'currentCity': 'Nairobi',
            'address': '123 Test Street, Nairobi, Kenya',
            'postalCode': '00100',
            'latitude': '1.2921',
            'longitude': '36.8219',
            'workPermit': 'Yes',
            
            # Professional Profile
            'professionalTitle': 'Software Developer',
            'yearsExperience': '3-5 years',
            'careerLevel': 'Mid-level',
            'industry': 'Technology',
            'summary': 'Experienced software developer with expertise in web technologies.',
            
            # Skills
            'coreSkills': json.dumps(['JavaScript', 'React', 'Node.js', 'Python']),
            'tools': json.dumps(['VS Code', 'Git', 'Docker', 'AWS']),
            
            # Languages
            'languages': json.dumps([
                {'language': 'English', 'proficiency': 'Native'},
                {'language': 'Swahili', 'proficiency': 'Fluent'}
            ]),
            
            # Experience Entries
            'experienceEntries': json.dumps([{
                'jobTitle': 'Senior Software Developer',
                'company': 'Tech Company Ltd',
                'companyLocation': 'Nairobi, Kenya',
                'employmentType': 'full-time',
                'jobIndustry': 'Technology',
                'startDate': '2022-01-01',
                'endDate': '2023-12-31',
                'currentJob': False,
                'jobDescription': 'Developed web applications using React and Node.js'
            }]),
            
            # Education Entries
            'educationEntries': json.dumps([{
                'degreeType': 'Bachelor of Science',
                'fieldOfStudy': 'Computer Science',
                'institution': 'University of Nairobi',
                'institutionLocation': 'Nairobi, Kenya',
                'grade': 'First Class',
                'eduStartYear': '2018',
                'eduEndYear': '2021',
                'eduActivities': 'Programming Club President'
            }]),
            
            # Certification Entries
            'certificationEntries': json.dumps([{
                'certificationName': 'AWS Certified Developer',
                'certIssuer': 'Amazon Web Services',
                'certIssueDate': '2023-06-01',
                'certExpiryDate': '2026-06-01',
                'credentialId': 'AWS-DEV-123456'
            }]),
            
            # Reference Entries
            'referenceEntries': json.dumps([{
                'referenceName': 'John Smith',
                'referenceTitle': 'Senior Manager',
                'referenceCompany': 'Previous Company',
                'referenceEmail': 'john.smith@example.com',
                'referencePhone': '+254700000002',
                'relationship': 'Former Supervisor'
            }]),
            
            # Job Preferences
            'jobPreferences': json.dumps({
                'jobTypes': ['Full-time', 'Remote'],
                'preferredWorkMode': 'Hybrid',
                'preferredIndustries': ['Technology', 'Fintech'],
                'preferredJobRoles': 'Software Developer, Tech Lead'
            }),
            
            # Additional Info
            'additionalInfo': json.dumps({
                'hobbies': ['Reading', 'Coding', 'Traveling'],
                'achievements': ['Best Employee 2023', 'Innovation Award 2022']
            }),
            
            # Required fields
            'profileCompleted': 'true',
            'comprehensiveProfileCompleted': 'true'
        }
        
        response = requests.post(
            f"{BASE_URL}/api/jobseeker/complete-profile",
            data=form_data,
            headers=headers,
            timeout=15
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Comprehensive form submitted successfully")
            return True
        else:
            print(f"❌ Form submission failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error submitting form: {e}")
        return False

def retrieve_profile(token):
    """Retrieve and analyze the profile data"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(
            f"{BASE_URL}/api/jobseeker/profile",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n📊 Profile Data Analysis:")
            print(f"   Total fields: {len(data)}")
            print(f"   Field names: {list(data.keys())}")
            
            # Check specific comprehensive sections
            comprehensive_sections = [
                'personalInfo', 'nationalityResidency', 'professionalProfile',
                'experienceEntries', 'educationEntries', 'skillsInfo',
                'languages', 'certificationEntries', 'referenceEntries',
                'jobPreferences', 'additionalInfo'
            ]
            
            print(f"\n🔍 Comprehensive Sections Check:")
            for section in comprehensive_sections:
                if section in data:
                    section_data = data[section]
                    if isinstance(section_data, (list, dict)):
                        print(f"   ✅ {section}: {len(section_data)} items")
                        if section in ['experienceEntries', 'educationEntries', 'certificationEntries', 'referenceEntries']:
                            print(f"      Sample: {section_data[0] if section_data else 'Empty'}")
                    else:
                        print(f"   ✅ {section}: {section_data}")
                else:
                    print(f"   ❌ {section}: Missing")
            
            return data
        else:
            print(f"❌ Profile retrieval failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error retrieving profile: {e}")
        return None

def main():
    print("🔍 DEBUGGING JOB SEEKER PROFILE DATA")
    print("=" * 60)
    
    # Create test account
    token, user_id = create_test_jobseeker()
    if not token:
        print("❌ Failed to create test account")
        return
    
    print(f"\n👤 Test Account Created: {user_id}")
    
    # Submit comprehensive form
    print(f"\n📝 Submitting comprehensive form...")
    if not submit_comprehensive_form(token):
        print("❌ Failed to submit form")
        return
    
    # Retrieve and analyze profile
    print(f"\n📊 Retrieving profile data...")
    profile_data = retrieve_profile(token)
    
    if profile_data:
        print(f"\n✅ Profile analysis complete!")
        print(f"   The profile contains {len(profile_data)} fields")
        print(f"   All comprehensive sections should be present")
    else:
        print(f"\n❌ Failed to retrieve profile data")

if __name__ == "__main__":
    main()
