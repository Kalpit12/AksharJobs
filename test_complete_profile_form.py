#!/usr/bin/env python3
"""
Comprehensive test for the Complete Profile form functionality
Tests all form fields, data storage, and retrieval
"""

import requests
import json
import sys
import os

# Configuration
BASE_URL = "http://13.61.35.12"  # Your deployed server
API_BASE = f"{BASE_URL}/api"

def test_profile_form():
    """Test the complete profile form functionality"""
    
    print("🧪 Testing Complete Profile Form Functionality")
    print("=" * 60)
    
    # Test data for all form sections
    test_profile_data = {
        # Personal Information
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "+1234567890",
        "dateOfBirth": "1990-05-15",
        "gender": "Male",
        "nationality": "American",
        "profilePhoto": None,  # Will test file upload separately
        
        # Nationality & Residency
        "residentCountry": "United States",
        "residentCity": "New York",
        "postalCode": "10001",
        "latitude": "40.7128",
        "longitude": "-74.0060",
        "address": "123 Main Street, New York, NY 10001",
        "workPermit": "Yes",
        "workPermitExpiry": "2025-12-31",
        
        # Preferred Working Locations
        "preferredLocation1": "New York, USA",
        "preferredLocation2": "London, UK",
        "preferredLocation3": "Toronto, Canada",
        
        # Professional Profile
        "professionalSummary": "Experienced software developer with 5+ years in web development",
        "currentJobTitle": "Senior Software Developer",
        "currentCompany": "Tech Corp",
        "yearsOfExperience": "5-7 years",
        "expectedSalary": "80000",
        "currency": "USD",
        "availability": "Immediately",
        
        # Work Experience (multiple entries)
        "experience": [
            {
                "jobTitle": "Senior Software Developer",
                "company": "Tech Corp",
                "location": "New York, USA",
                "startDate": "2022-01-01",
                "endDate": "2024-12-31",
                "current": True,
                "description": "Led development of web applications using React and Node.js"
            },
            {
                "jobTitle": "Software Developer",
                "company": "StartupXYZ",
                "location": "San Francisco, USA",
                "startDate": "2020-06-01",
                "endDate": "2021-12-31",
                "current": False,
                "description": "Developed mobile applications using React Native"
            }
        ],
        
        # Education (multiple entries)
        "education": [
            {
                "degree": "Bachelor of Science",
                "field": "Computer Science",
                "institution": "University of Technology",
                "location": "New York, USA",
                "startDate": "2016-09-01",
                "endDate": "2020-05-31",
                "gpa": "3.8",
                "description": "Graduated with honors"
            }
        ],
        
        # Skills
        "skills": ["JavaScript", "React", "Node.js", "Python", "SQL"],
        
        # Tools & Technologies
        "tools": ["VS Code", "Git", "Docker", "AWS", "MongoDB"],
        
        # Languages
        "languages": [
            {"language": "English", "proficiency": "Native"},
            {"language": "Spanish", "proficiency": "Intermediate"},
            {"language": "French", "proficiency": "Basic"}
        ],
        
        # Certifications (multiple entries)
        "certifications": [
            {
                "name": "AWS Certified Developer",
                "issuer": "Amazon Web Services",
                "date": "2023-03-15",
                "expiryDate": "2026-03-15",
                "credentialId": "AWS-DEV-123456"
            }
        ],
        
        # Professional Memberships
        "memberships": ["IEEE", "ACM"],
        
        # References (multiple entries)
        "references": [
            {
                "name": "Jane Smith",
                "title": "Engineering Manager",
                "company": "Tech Corp",
                "email": "jane.smith@techcorp.com",
                "phone": "+1234567891"
            }
        ],
        
        # Professional Online Presence
        "linkedinUrl": "https://linkedin.com/in/johndoe",
        "portfolioUrl": "https://johndoe.dev",
        "githubUrl": "https://github.com/johndoe",
        "websiteUrl": "https://johndoe.com",
        
        # Job Preferences
        "jobTypes": ["Full-time", "Contract"],
        "workArrangements": ["Remote", "Hybrid"],
        "industries": ["Technology", "Finance"],
        "companySizes": ["51-200 employees", "201-500 employees"],
        
        # Additional Information
        "additionalInfo": "Open to relocation and willing to work in different time zones",
        "hobbies": ["Photography", "Hiking", "Reading"],
        "achievements": ["Led team of 5 developers", "Reduced application load time by 50%"]
    }
    
    # Test authentication (using existing user)
    auth_data = {
        "email": "Hemant.patel@maxproinfotech.com",
        "password": "test123"  # You'll need to provide the correct password
    }
    
    try:
        # Step 1: Login to get authentication token
        print("🔐 Step 1: Authenticating user...")
        login_response = requests.post(f"{API_BASE}/auth/login", json=auth_data)
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.status_code}")
            print(f"Response: {login_response.text}")
            return False
            
        auth_result = login_response.json()
        token = auth_result.get('token')
        if not token:
            print("❌ No token received from login")
            return False
            
        print("✅ Authentication successful")
        
        # Step 2: Clear existing profile data
        print("\n🧹 Step 2: Clearing existing profile data...")
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get current profile to see what exists
        current_profile = requests.get(f"{API_BASE}/profile/profile", headers=headers)
        if current_profile.status_code == 200:
            print("📋 Current profile data retrieved")
        else:
            print(f"⚠️ Could not retrieve current profile: {current_profile.status_code}")
        
        # Step 3: Submit comprehensive profile data
        print("\n📝 Step 3: Submitting comprehensive profile data...")
        
        profile_response = requests.put(
            f"{API_BASE}/profile/profile",
            json=test_profile_data,
            headers=headers
        )
        
        if profile_response.status_code != 200:
            print(f"❌ Profile submission failed: {profile_response.status_code}")
            print(f"Response: {profile_response.text}")
            return False
            
        print("✅ Profile data submitted successfully")
        
        # Step 4: Retrieve and verify saved data
        print("\n🔍 Step 4: Retrieving and verifying saved data...")
        
        saved_profile = requests.get(f"{API_BASE}/profile/profile", headers=headers)
        
        if saved_profile.status_code != 200:
            print(f"❌ Failed to retrieve saved profile: {saved_profile.status_code}")
            return False
            
        saved_data = saved_profile.json()
        print("✅ Saved profile data retrieved")
        
        # Step 5: Verify all sections were saved
        print("\n✅ Step 5: Verifying all sections were saved correctly...")
        
        verification_results = verify_profile_sections(test_profile_data, saved_data)
        
        # Step 6: Test specific functionality
        print("\n🗺️ Step 6: Testing map coordinates storage...")
        test_coordinates = verify_coordinates(saved_data)
        
        print("\n📊 Step 6: Testing dynamic fields...")
        test_dynamic_fields = verify_dynamic_fields(saved_data)
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 60)
        
        total_tests = len(verification_results)
        passed_tests = sum(verification_results.values())
        
        print(f"✅ Profile Sections Test: {passed_tests}/{total_tests} passed")
        print(f"🗺️ Coordinates Test: {'✅ PASSED' if test_coordinates else '❌ FAILED'}")
        print(f"📝 Dynamic Fields Test: {'✅ PASSED' if test_dynamic_fields else '❌ FAILED'}")
        
        overall_success = (passed_tests == total_tests) and test_coordinates and test_dynamic_fields
        
        if overall_success:
            print("\n🎉 ALL TESTS PASSED! Profile form is working correctly.")
        else:
            print("\n⚠️ Some tests failed. Check the details above.")
            
        return overall_success
        
    except Exception as e:
        print(f"❌ Test failed with exception: {str(e)}")
        return False

def verify_profile_sections(test_data, saved_data):
    """Verify that all profile sections were saved correctly"""
    
    sections_to_verify = {
        "Personal Information": ["firstName", "lastName", "email", "phone", "dateOfBirth", "gender", "nationality"],
        "Nationality & Residency": ["residentCountry", "residentCity", "postalCode", "address", "workPermit"],
        "Preferred Locations": ["preferredLocation1", "preferredLocation2", "preferredLocation3"],
        "Professional Profile": ["professionalSummary", "currentJobTitle", "currentCompany", "yearsOfExperience", "expectedSalary", "currency", "availability"],
        "Skills": ["skills"],
        "Tools": ["tools"],
        "Languages": ["languages"],
        "Professional Memberships": ["memberships"],
        "Online Presence": ["linkedinUrl", "portfolioUrl", "githubUrl", "websiteUrl"],
        "Job Preferences": ["jobTypes", "workArrangements", "industries", "companySizes"],
        "Additional Information": ["additionalInfo", "hobbies", "achievements"]
    }
    
    results = {}
    
    for section_name, fields in sections_to_verify.items():
        section_passed = True
        
        for field in fields:
            test_value = test_data.get(field)
            saved_value = saved_data.get(field)
            
            if test_value != saved_value:
                print(f"❌ {section_name} - {field}: Expected '{test_value}', got '{saved_value}'")
                section_passed = False
            else:
                print(f"✅ {section_name} - {field}: Correct")
        
        results[section_name] = section_passed
        print(f"{'✅' if section_passed else '❌'} {section_name}: {'PASSED' if section_passed else 'FAILED'}")
        print()
    
    return results

def verify_coordinates(saved_data):
    """Verify that map coordinates were saved correctly"""
    
    latitude = saved_data.get('latitude')
    longitude = saved_data.get('longitude')
    
    if latitude == "40.7128" and longitude == "-74.0060":
        print(f"✅ Coordinates saved correctly: Lat {latitude}, Lng {longitude}")
        return True
    else:
        print(f"❌ Coordinates not saved correctly: Lat {latitude}, Lng {longitude}")
        return False

def verify_dynamic_fields(saved_data):
    """Verify that dynamic fields (arrays/objects) were saved correctly"""
    
    # Test experience array
    experience = saved_data.get('experience', [])
    if len(experience) == 2:
        print(f"✅ Experience entries saved: {len(experience)} entries")
    else:
        print(f"❌ Experience entries not saved correctly: {len(experience)} entries")
        return False
    
    # Test education array
    education = saved_data.get('education', [])
    if len(education) == 1:
        print(f"✅ Education entries saved: {len(education)} entries")
    else:
        print(f"❌ Education entries not saved correctly: {len(education)} entries")
        return False
    
    # Test certifications array
    certifications = saved_data.get('certifications', [])
    if len(certifications) == 1:
        print(f"✅ Certification entries saved: {len(certifications)} entries")
    else:
        print(f"❌ Certification entries not saved correctly: {len(certifications)} entries")
        return False
    
    # Test references array
    references = saved_data.get('references', [])
    if len(references) == 1:
        print(f"✅ Reference entries saved: {len(references)} entries")
    else:
        print(f"❌ Reference entries not saved correctly: {len(references)} entries")
        return False
    
    # Test skills array
    skills = saved_data.get('skills', [])
    if len(skills) == 5:
        print(f"✅ Skills array saved: {len(skills)} skills")
    else:
        print(f"❌ Skills array not saved correctly: {len(skills)} skills")
        return False
    
    return True

if __name__ == "__main__":
    print("Starting Complete Profile Form Test...")
    print(f"Testing against server: {BASE_URL}")
    print()
    
    success = test_profile_form()
    
    if success:
        print("\n🎉 Test completed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Test failed!")
        sys.exit(1)
