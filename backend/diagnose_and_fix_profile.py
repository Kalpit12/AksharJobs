#!/usr/bin/env python3
"""
COMPREHENSIVE DIAGNOSTIC AND FIX SCRIPT
This script will:
1. Check MongoDB connection
2. Diagnose the profile data issue  
3. Show what's in the database
4. Offer to create test data to verify the fix
"""

import sys
import os
from datetime import datetime

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId
import json

def print_header(title):
    print(f"\n{'='*100}")
    print(f"{title:^100}")
    print(f"{'='*100}\n")

def print_section(title):
    print(f"\n{'-'*100}")
    print(f"  {title}")
    print(f"{'-'*100}")

def check_mongodb_connection():
    """Check if MongoDB is connected"""
    print_header("STEP 1: CHECKING MONGODB CONNECTION")
    
    try:
        db = get_db()
        if db is None:
            print("❌ FAILED: Could not connect to MongoDB")
            print("\n📝 TROUBLESHOOTING:")
            print("  1. Check if MongoDB is running (if using local)")
            print("  2. Verify .env file exists in backend/ directory")
            print("  3. Check MONGO_URI in .env file")
            print("  4. If using MongoDB Atlas, verify credentials")
            return None
        
        # Test the connection
        db.command('ping')
        print(f"✅ SUCCESS: Connected to MongoDB")
        print(f"📊 Database Name: {db.name}")
        
        # List collections
        collections = db.list_collection_names()
        print(f"📁 Collections ({len(collections)}): {', '.join(collections)}")
        
        return db
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return None

def check_jobseeker_data(db):
    """Check job seeker data in both collections"""
    print_header("STEP 2: CHECKING JOBSEEKER DATA")
    
    users_collection = db.users
    jobseeker_profiles_collection = db.jobseeker_profiles
    
    # Check users collection
    print_section("Users Collection")
    job_seekers = list(users_collection.find({"userType": "job_seeker"}))
    print(f"Found {len(job_seekers)} job seeker(s)\n")
    
    for idx, js in enumerate(job_seekers, 1):
        print(f"\n👤 USER {idx}: {js.get('firstName', 'N/A')} {js.get('lastName', 'N/A')}")
        print(f"   Email: {js.get('email', 'N/A')}")
        print(f"   User ID: {js.get('_id')}")
        print(f"   Profile Completed: {js.get('profileCompleted', False)}")
        
        # Count filled fields
        filled_count = sum(1 for k, v in js.items() 
                          if k not in ['_id', 'password', 'created_at', 'updated_at', 'userType'] 
                          and v and v != '' and v != [] and v != {})
        
        print(f"   Filled Fields: {filled_count}/{len(js)} total fields")
        
        # Check key registration fields
        registration_fields = {
            'dateOfBirth': js.get('dateOfBirth'),
            'gender': js.get('gender'),
            'nationality': js.get('nationality'),
            'currentCity': js.get('currentCity'),
            'professionalTitle': js.get('professionalTitle'),
            'yearsExperience': js.get('yearsExperience'),
            'coreSkills': js.get('coreSkills'),
            'educationEntries': js.get('educationEntries'),
            'experienceEntries': js.get('experienceEntries'),
        }
        
        missing = [k for k, v in registration_fields.items() if not v or v == [] or v == '']
        
        if missing:
            print(f"\n   ❌ MISSING FIELDS ({len(missing)}): {', '.join(missing)}")
            print(f"   ⚠️  This user marked profile as complete but data is missing!")
        else:
            print(f"   ✅ All key registration fields present")
        
        # Check jobseeker_profiles collection
        profile = jobseeker_profiles_collection.find_one({'userId': js.get('_id')})
        
        if profile:
            print(f"   ✅ Found corresponding profile in jobseeker_profiles collection")
        else:
            print(f"   ❌ NO profile in jobseeker_profiles collection")
            print(f"   ⚠️  Registration data was not saved to separate profile collection")
    
    return job_seekers

def show_recommendations(job_seekers):
    """Show recommendations based on findings"""
    print_header("STEP 3: DIAGNOSIS & RECOMMENDATIONS")
    
    if not job_seekers:
        print("✅ No job seekers found. This is normal for a new installation.")
        print("\n📝 NEXT STEPS:")
        print("  1. Create a job seeker account through the signup page")
        print("  2. Complete the comprehensive registration form")
        print("  3. Re-run this script to verify data was saved")
        return
    
    # Check if any users have incomplete data
    has_incomplete = False
    for js in job_seekers:
        if js.get('profileCompleted') and not js.get('dateOfBirth'):
            has_incomplete = True
            break
    
    if has_incomplete:
        print("❌ PROBLEM DETECTED:")
        print("   Job seekers marked as 'profileCompleted' but missing registration data")
        print("\n🔧 POSSIBLE CAUSES:")
        print("   1. Frontend-Backend connection issue")
        print("   2. Data not being sent from frontend")
        print("   3. Backend not saving data to database")
        print("   4. Database write permissions issue")
        print("\n💡 SOLUTIONS:")
        print("   1. Check backend logs when submitting registration form")
        print("   2. Check browser console (F12) for frontend errors")
        print("   3. Verify MongoDB write permissions")
        print("   4. Test with a fresh registration")
        print("\n📝 TO TEST THE FIX:")
        print("   1. Delete the existing incomplete users")
        print("   2. Create a new account")
        print("   3. Fill out the complete registration form")
        print("   4. Watch backend logs for save confirmation")
        print("   5. Check MyProfile page to confirm data displays")
    else:
        print("✅ All job seekers have complete data!")
        print("\n📊 DATA IS PROPERLY SAVED AND SHOULD DISPLAY ON MYPROFILE PAGE")

def offer_test_data_creation():
    """Offer to create test data"""
    print_header("STEP 4: TEST DATA CREATION (OPTIONAL)")
    
    print("Would you like to create a test job seeker with COMPLETE data?")
    print("This will help verify that:")
    print("  1. Database connection works")
    print("  2. Data structure is correct")
    print("  3. MyProfile page can display the data")
    print("\nType 'yes' to create test data, or press Enter to skip:")
    
    response = input("> ").strip().lower()
    
    if response in ['yes', 'y']:
        create_test_jobseeker()
    else:
        print("Skipped test data creation")

def create_test_jobseeker():
    """Create a test job seeker with complete data"""
    print("\n🔧 Creating test job seeker...")
    
    try:
        db = get_db()
        if db is None:
            print("❌ Failed to connect to database")
            return
        
        users_collection = db.users
        
        import bcrypt
        
        test_data = {
            "_id": ObjectId(),
            "userType": "job_seeker",
            "firstName": "Test",
            "lastName": "User",
            "middleName": "Complete",
            "email": f"testuser_{datetime.now().strftime('%Y%m%d%H%M%S')}@example.com",
            "phone": "+1234567890",
            "password": bcrypt.hashpw("password123".encode("utf-8"), bcrypt.gensalt()),
            "phoneNumber": "+1234567890",
            "altPhone": "+0987654321",
            "dateOfBirth": "1995-05-15",
            "gender": "Male",
            "bloodGroup": "O+",
            "community": "Tech Community",
            "nationality": "Kenya",
            "residentCountry": "Kenya",
            "currentCity": "Nairobi",
            "postalCode": "00100",
            "address": "123 Test Street",
            "latitude": "-1.2921",
            "longitude": "36.8219",
            "workPermit": "Valid",
            "preferredLocation1": "Nairobi",
            "preferredLocation2": "Mombasa",
            "preferredLocation3": "Remote",
            "willingToRelocate": "Yes",
            "workLocation": "Hybrid",
            "professionalTitle": "Software Engineer",
            "yearsExperience": "5",
            "careerLevel": "Mid-Level",
            "industry": "Technology",
            "summary": "Experienced software engineer with expertise in full-stack development",
            "coreSkills": ["Python", "JavaScript", "React", "Node.js", "MongoDB"],
            "tools": ["Git", "Docker", "AWS", "VS Code"],
            "languages": [
                {"language": "English", "proficiency": "Native"},
                {"language": "Swahili", "proficiency": "Fluent"}
            ],
            "educationEntries": [
                {
                    "degreeType": "Bachelor's",
                    "fieldOfStudy": "Computer Science",
                    "institution": "University of Nairobi",
                    "institutionLocation": "Nairobi, Kenya",
                    "grade": "First Class Honors",
                    "eduStartYear": "2010",
                    "eduEndYear": "2014",
                    "eduActivities": "Programming Club, Hackathons"
                }
            ],
            "experienceEntries": [
                {
                    "jobTitle": "Senior Software Engineer",
                    "company": "Tech Solutions Ltd",
                    "companyLocation": "Nairobi, Kenya",
                    "employmentType": "Full-time",
                    "jobIndustry": "Technology",
                    "startDate": "2020-01",
                    "endDate": "",
                    "currentJob": True,
                    "jobDescription": "Leading development of web applications"
                }
            ],
            "certificationEntries": [
                {
                    "certificationName": "AWS Certified Developer",
                    "certIssuer": "Amazon Web Services",
                    "certIssueDate": "2022-06",
                    "certExpiryDate": "2025-06",
                    "credentialId": "AWS-123456"
                }
            ],
            "preferredJobTitles": "Software Engineer, Full Stack Developer",
            "jobType": "Full-time",
            "noticePeriod": "1 month",
            "currentSalary": "150000",
            "expectedSalary": "200000",
            "currencyPreference": "KES",
            "travelAvailability": "Willing to travel",
            "membershipOrg": "ACM",
            "membershipType": "Professional",
            "membershipDate": "2020-01",
            "careerObjectives": "To become a technical lead",
            "hobbies": "Reading, Coding, Hiking",
            "additionalComments": "Looking for challenging opportunities",
            "agreeTerms": True,
            "allowContact": True,
            "profileCompleted": True,
            "created_at": datetime.now(),
            "is_verified": True,
            "is_active": True
        }
        
        result = users_collection.insert_one(test_data)
        
        print(f"✅ Test job seeker created successfully!")
        print(f"📧 Email: {test_data['email']}")
        print(f"🔑 Password: password123")
        print(f"🆔 User ID: {result.inserted_id}")
        print("\n✅ You can now:")
        print(f"  1. Login with: {test_data['email']} / password123")
        print(f"  2. Navigate to MyProfile page")
        print(f"  3. Verify that ALL data displays correctly")
        
    except Exception as e:
        print(f"❌ Error creating test user: {str(e)}")
        import traceback
        traceback.print_exc()

def main():
    """Main diagnostic flow"""
    print_header("🔍 PROFILE DATA DIAGNOSTIC TOOL")
    print("This tool will help diagnose why MyProfile page is not displaying data")
    
    # Step 1: Check connection
    db = check_mongodb_connection()
    if db is None:
        print("\n❌ Cannot proceed without database connection")
        print("Please fix the connection issue and try again")
        return
    
    # Step 2: Check data
    job_seekers = check_jobseeker_data(db)
    
    # Step 3: Show recommendations
    show_recommendations(job_seekers)
    
    # Step 4: Offer test data
    offer_test_data_creation()
    
    print_header("✅ DIAGNOSTIC COMPLETE")
    print("If you're still having issues:")
    print("  1. Check PROFILE_DATA_DISPLAY_FIX.md for detailed steps")
    print("  2. Review backend logs when submitting registration")
    print("  3. Check browser console (F12) for frontend errors")
    print("\nFor immediate help, check the logs when:")
    print("  - Submitting the registration form")
    print("  - Loading the MyProfile page")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Operation cancelled by user")
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()

