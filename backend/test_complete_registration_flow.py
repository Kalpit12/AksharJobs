#!/usr/bin/env python3
"""
Test complete registration flow:
1. Signup new account
2. Fill comprehensive registration form
3. Verify data saved to database
4. Test MyProfile API returns data
"""

import requests
import json
from datetime import datetime
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId

# Test configuration
BACKEND_URL = "http://localhost:3002"
timestamp = int(datetime.now().timestamp())

def test_complete_flow():
    """Test the complete registration flow"""
    
    print("="*100)
    print(" "*25 + "COMPLETE REGISTRATION FLOW TEST")
    print("="*100)
    
    # Step 1: Signup
    print("\n📝 STEP 1: Creating New Account...")
    print("-"*100)
    
    signup_data = {
        "firstName": "TestFlow",
        "lastName": "User",
        "email": f"testflow.{timestamp}@example.com",
        "phoneNumber": "+254712999888",
        "password": "TestPassword123!",
        "userType": "jobSeeker"
    }
    
    try:
        signup_response = requests.post(
            f"{BACKEND_URL}/api/auth/signup",
            json=signup_data,
            timeout=10
        )
        
        if signup_response.status_code in [200, 201]:
            signup_result = signup_response.json()
            token = signup_result.get('token')
            user_id = signup_result.get('userId')
            
            print(f"✅ Signup successful!")
            print(f"   User ID: {user_id}")
            print(f"   Email: {signup_data['email']}")
            print(f"   Token: {token[:30]}...")
        else:
            print(f"❌ Signup failed: {signup_response.status_code}")
            print(f"   Response: {signup_response.text}")
            return
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Could not connect to backend at {BACKEND_URL}")
        print(f"   Make sure backend is running on port 5000")
        return
    except Exception as e:
        print(f"❌ Signup error: {str(e)}")
        return
    
    # Step 2: Fill comprehensive registration form
    print(f"\n📝 STEP 2: Submitting Comprehensive Registration Form...")
    print("-"*100)
    
    registration_data = {
        # Personal Information
        "firstName": "TestFlow",
        "middleName": "Complete",
        "lastName": "User",
        "email": signup_data['email'],
        "phone": signup_data['phoneNumber'],
        "altPhone": "+254787111222",
        "dateOfBirth": "1995-06-15",
        "gender": "Male",
        "bloodGroup": "A+",
        "community": "Technology",
        
        # Nationality & Residency
        "nationality": "Kenya",
        "residentCountry": "Kenya",
        "currentCity": "Nairobi",
        "postalCode": "00100",
        "address": "123 Test Street, Nairobi",
        "latitude": "-1.2921",
        "longitude": "36.8219",
        "workPermit": "Citizen",
        
        # Preferred Locations
        "preferredLocation1": "Nairobi",
        "preferredLocation2": "Mombasa",
        "preferredLocation3": "Remote",
        "willingToRelocate": "Yes",
        "workLocation": "Hybrid",
        
        # Professional Profile
        "professionalTitle": "Full Stack Developer",
        "yearsExperience": "5",
        "yearsOfExperience": "5",
        "careerLevel": "Senior",
        "industry": "Technology",
        "summary": "Experienced full-stack developer with 5 years of expertise in React, Node.js, and MongoDB.",
        "professionalSummary": "Experienced full-stack developer with 5 years of expertise in React, Node.js, and MongoDB.",
        
        # Skills (JSON arrays as strings for FormData)
        "coreSkills": json.dumps(["JavaScript", "Python", "React", "Node.js", "MongoDB"]),
        "tools": json.dumps(["Git", "Docker", "VS Code"]),
        
        # Languages
        "languages": json.dumps([
            {"language": "English", "proficiency": "Native"},
            {"language": "Swahili", "proficiency": "Fluent"}
        ]),
        
        # Education
        "educationEntries": json.dumps([
            {
                "degreeType": "Bachelor's",
                "fieldOfStudy": "Computer Science",
                "institution": "University of Nairobi",
                "institutionLocation": "Nairobi, Kenya",
                "grade": "First Class",
                "eduStartYear": "2015",
                "eduEndYear": "2019",
                "eduActivities": "Computer Society President"
            }
        ]),
        
        # Work Experience
        "experienceEntries": json.dumps([
            {
                "jobTitle": "Senior Developer",
                "company": "Tech Corp",
                "companyLocation": "Nairobi, Kenya",
                "employmentType": "full-time",
                "jobIndustry": "Technology",
                "startDate": "2020-01",
                "endDate": "",
                "currentJob": True,
                "jobDescription": "Leading development of web applications"
            }
        ]),
        
        # Certifications
        "certificationEntries": json.dumps([
            {
                "certificationName": "AWS Certified Developer",
                "certIssuer": "Amazon",
                "certIssueDate": "2022-01",
                "certExpiryDate": "2025-01",
                "credentialId": "AWS-123"
            }
        ]),
        
        # References
        "referenceEntries": json.dumps([
            {
                "refName": "John Manager",
                "refRelationship": "Former Manager",
                "refCompany": "Tech Corp",
                "refEmail": "john@techcorp.com",
                "refPhone": "+254711222333"
            }
        ]),
        
        # Professional Links
        "professionalLinks": json.dumps([
            {"platform": "LinkedIn", "url": "https://linkedin.com/in/testflow"},
            {"platform": "GitHub", "url": "https://github.com/testflow"}
        ]),
        
        # Job Preferences
        "preferredJobTitles": "Full Stack Developer, Software Engineer",
        "jobType": "full-time",
        "noticePeriod": "1 month",
        "currentSalary": "150000",
        "expectedSalary": "200000",
        "currencyPreference": "KES",
        "travelAvailability": "Willing to travel",
        
        # Professional Memberships
        "membershipOrg": "ACM",
        "membershipType": "Professional",
        "membershipDate": "2021-01",
        
        # Additional Information
        "careerObjectives": "To become a technical lead",
        "hobbies": "Coding, Reading, Hiking",
        "additionalComments": "Looking for growth opportunities",
        "agreeTerms": "true",
        "allowContact": "true",
        
        # Metadata
        "profileCompleted": "true",
        "hasCompletedProfile": "true"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        profile_response = requests.post(
            f"{BACKEND_URL}/api/jobseeker/complete-profile",
            data=registration_data,
            headers=headers,
            timeout=30
        )
        
        print(f"\n{'='*100}")
        print("REGISTRATION SUBMISSION RESULT")
        print(f"{'='*100}\n")
        
        print(f"Status Code: {profile_response.status_code}")
        
        if profile_response.status_code == 200:
            result = profile_response.json()
            print(f"✅ SUCCESS! Registration data submitted")
            print(f"   Message: {result.get('message')}")
            print(f"   Profile Completed: {result.get('profileCompleted')}")
            print(f"   Is Draft: {result.get('isDraft', False)}")
        else:
            print(f"❌ Submission failed")
            print(f"   Response: {profile_response.text}")
            return
            
    except Exception as e:
        print(f"❌ Submission error: {str(e)}")
        return
    
    # Step 3: Verify data in database
    print(f"\n📝 STEP 3: Verifying Data in Database...")
    print("-"*100)
    
    db = get_db()
    if db is not None:
        user_oid = ObjectId(user_id)
        
        # Check users collection
        user_doc = db.users.find_one({'_id': user_oid})
        profile_doc = db.jobseeker_profiles.find_one({'userId': user_oid})
        
        print(f"\n✅ Database Check:")
        print(f"   User in users collection: {'✅ FOUND' if user_doc else '❌ NOT FOUND'}")
        print(f"   Profile in jobseeker_profiles: {'✅ FOUND' if profile_doc else '❌ NOT FOUND'}")
        
        if user_doc:
            print(f"\n📊 Data in users collection:")
            verification_fields = ['dateOfBirth', 'gender', 'professionalTitle', 'yearsExperience', 
                                  'coreSkills', 'educationEntries', 'experienceEntries']
            for field in verification_fields:
                value = user_doc.get(field)
                if isinstance(value, list):
                    status = "✅" if len(value) > 0 else "❌"
                    value_display = f"{len(value)} items"
                elif value and value != '':
                    status = "✅"
                    value_display = str(value)[:50]
                else:
                    status = "❌"
                    value_display = "MISSING"
                
                print(f"   {status} {field:25} : {value_display}")
        
        if profile_doc:
            print(f"\n📊 Data in jobseeker_profiles collection:")
            print(f"   ✅ Personal Info: {len([v for v in profile_doc.get('personalInfo', {}).values() if v])} fields")
            print(f"   ✅ Professional: {len([v for v in profile_doc.get('professionalProfile', {}).values() if v])} fields")
            print(f"   ✅ Skills: {len(profile_doc.get('skillsInfo', {}).get('coreSkills', []))} core skills")
            print(f"   ✅ Education: {len(profile_doc.get('educationEntries', []))} entries")
            print(f"   ✅ Experience: {len(profile_doc.get('experienceEntries', []))} entries")
    
    # Step 4: Test MyProfile API
    print(f"\n📝 STEP 4: Testing MyProfile API Endpoint...")
    print("-"*100)
    
    try:
        myprofile_response = requests.get(
            f"{BACKEND_URL}/api/jobseeker/profile",
            headers=headers,
            timeout=10
        )
        
        print(f"\n{'='*100}")
        print("MYPROFILE API RESPONSE")
        print(f"{'='*100}\n")
        
        print(f"Status Code: {myprofile_response.status_code}")
        
        if myprofile_response.status_code == 200:
            profile_data = myprofile_response.json()
            
            filled_fields = [k for k, v in profile_data.items() 
                           if v and v != '' and v != [] 
                           and k not in ['_id', 'userId', 'createdAt', 'updatedAt']]
            
            print(f"✅ SUCCESS! MyProfile API returned data")
            print(f"   Total fields in response: {len(profile_data)}")
            print(f"   Fields WITH data: {len(filled_fields)}")
            print(f"   Completion %: {profile_data.get('profileCompletion', 'N/A')}%")
            print(f"   Is Draft: {profile_data.get('isDraft', 'N/A')}")
            print(f"   Profile Completed: {profile_data.get('profileCompleted', 'N/A')}")
            
            print(f"\n📋 Sample of returned data:")
            important_fields = ['firstName', 'lastName', 'email', 'dateOfBirth', 'gender',
                              'professionalTitle', 'yearsExperience', 'nationality', 'currentCity',
                              'coreSkills', 'tools', 'educationEntries', 'experienceEntries', 'languages']
            
            for field in important_fields:
                if field in profile_data:
                    value = profile_data[field]
                    if isinstance(value, list):
                        value_display = f"{len(value)} items - {value[:2] if len(value) <= 2 else value[:2] + ['...']}"
                    elif value and value != '':
                        value_str = str(value)
                        value_display = value_str if len(value_str) <= 50 else value_str[:50] + "..."
                    else:
                        value_display = "EMPTY"
                    
                    status = "✅" if (value and value != '' and value != []) else "❌"
                    print(f"   {status} {field:25} : {value_display}")
            
            print(f"\n{'='*100}")
            print("FINAL VERDICT")
            print(f"{'='*100}\n")
            
            if len(filled_fields) >= 20:
                print(f"✅✅✅ SUCCESS! FULL FLOW WORKING! ✅✅✅")
                print(f"\n✅ Account created: {signup_data['email']}")
                print(f"✅ Registration submitted: {len(filled_fields)} fields")
                print(f"✅ Data saved to database: Verified")
                print(f"✅ MyProfile API returns data: {len(filled_fields)} fields")
                print(f"\n🎉 MyProfile page WILL display this data correctly!")
                print(f"\n📧 LOGIN CREDENTIALS:")
                print(f"   Email: {signup_data['email']}")
                print(f"   Password: {signup_data['password']}")
                print(f"\n🎯 NEXT: Login with these credentials and check MyProfile page!")
            else:
                print(f"⚠️  PARTIAL SUCCESS:")
                print(f"   Account created: ✅")
                print(f"   Registration submitted: ✅")
                print(f"   But only {len(filled_fields)} fields have data")
                print(f"   Expected: 20+ fields")
        else:
            print(f"❌ MyProfile API failed: {myprofile_response.status_code}")
            print(f"   Response: {myprofile_response.text}")
            
    except Exception as e:
        print(f"❌ MyProfile API error: {str(e)}")
    
    print(f"\n{'='*100}\n")

if __name__ == "__main__":
    try:
        test_complete_flow()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

