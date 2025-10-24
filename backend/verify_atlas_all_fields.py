#!/usr/bin/env python3
"""
FORCE MongoDB Atlas connection and verify ALL 50+ registration form fields
"""

import sys
import os

# Force load from .env files before other imports
from dotenv import load_dotenv
load_dotenv('.env.production')
load_dotenv('.env.local')
load_dotenv('.env')
load_dotenv('.edn.local')  # In case it's named this

from pymongo import MongoClient

def get_atlas_db():
    """Force connection to Atlas using environment variables"""
    
    # Get MONGO_URI from environment
    mongo_uri = os.getenv("MONGO_URI")
    db_name = os.getenv("DB_NAME", "TalentMatchDB")
    
    print(f"🔍 Environment Check:")
    print(f"   MONGO_URI set: {'✅ YES' if mongo_uri else '❌ NO'}")
    
    if mongo_uri:
        if "mongodb+srv://" in mongo_uri:
            # Mask password
            parts = mongo_uri.split("@")
            if len(parts) > 1:
                masked = f"mongodb+srv://***:***@{parts[1][:50]}"
            else:
                masked = mongo_uri[:50]
            print(f"   Connection: {masked}")
            print(f"   Type: ☁️  MongoDB Atlas (Cloud)")
        else:
            print(f"   Connection: {mongo_uri}")
            print(f"   Type: 🖥️  Local MongoDB")
    else:
        print(f"   ⚠️  MONGO_URI not found in environment!")
        print(f"   Using default: mongodb://localhost:27017/")
        mongo_uri = "mongodb://localhost:27017/"
    
    print(f"   DB_NAME: {db_name}\n")
    
    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        db = client[db_name]
        
        # Test connection
        db.command('ping')
        
        print(f"✅ Connected successfully!")
        print(f"   Database: {db.name}\n")
        
        return db
        
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        return None

def verify_all_fields():
    """Check ALL 50+ registration form fields"""
    
    print("="*100)
    print(" "*15 + "COMPLETE REGISTRATION FORM FIELDS VERIFICATION")
    print("="*100)
    
    db = get_atlas_db()
    
    if db is None:
        return
    
    # Get most recent jobseeker
    recent_user = db.users.find_one(
        {"userType": "job_seeker"},
        sort=[("created_at", -1)]
    )
    
    if not recent_user:
        print("❌ No job seekers found")
        return
    
    print(f"{'='*100}")
    print(f"ANALYZING MOST RECENT JOBSEEKER")
    print(f"{'='*100}")
    print(f"Name: {recent_user.get('firstName')} {recent_user.get('lastName')}")
    print(f"Email: {recent_user.get('email')}")
    print(f"Created: {recent_user.get('created_at')}")
    print(f"\n")
    
    # Get corresponding profile
    profile = db.jobseeker_profiles.find_one({'userId': recent_user.get('_id')})
    
    # Define ALL 50+ registration form fields
    all_fields = {
        "PERSONAL INFORMATION (10 fields)": [
            ('firstName', recent_user.get('firstName')),
            ('middleName', recent_user.get('middleName')),
            ('lastName', recent_user.get('lastName')),
            ('email', recent_user.get('email')),
            ('phone', recent_user.get('phone')),
            ('altPhone', recent_user.get('altPhone')),
            ('dateOfBirth', recent_user.get('dateOfBirth')),
            ('gender', recent_user.get('gender')),
            ('bloodGroup', recent_user.get('bloodGroup')),
            ('community', recent_user.get('community')),
        ],
        "NATIONALITY & RESIDENCY (8 fields)": [
            ('nationality', recent_user.get('nationality')),
            ('residentCountry', recent_user.get('residentCountry')),
            ('currentCity', recent_user.get('currentCity')),
            ('postalCode', recent_user.get('postalCode')),
            ('address', recent_user.get('address')),
            ('latitude', recent_user.get('latitude')),
            ('longitude', recent_user.get('longitude')),
            ('workPermit', recent_user.get('workPermit')),
        ],
        "PREFERRED LOCATIONS (5 fields)": [
            ('preferredLocation1', recent_user.get('preferredLocation1')),
            ('preferredLocation2', recent_user.get('preferredLocation2')),
            ('preferredLocation3', recent_user.get('preferredLocation3')),
            ('willingToRelocate', recent_user.get('willingToRelocate')),
            ('workLocation', recent_user.get('workLocation')),
        ],
        "PROFESSIONAL PROFILE (5 fields)": [
            ('professionalTitle', recent_user.get('professionalTitle')),
            ('yearsExperience', recent_user.get('yearsExperience')),
            ('careerLevel', recent_user.get('careerLevel')),
            ('industry', recent_user.get('industry')),
            ('summary', recent_user.get('summary')),
        ],
        "SKILLS (2 fields)": [
            ('coreSkills', recent_user.get('coreSkills', [])),
            ('tools', recent_user.get('tools', [])),
        ],
        "ARRAYS - EDUCATION (1 field)": [
            ('educationEntries', recent_user.get('educationEntries', [])),
        ],
        "ARRAYS - EXPERIENCE (1 field)": [
            ('experienceEntries', recent_user.get('experienceEntries', [])),
        ],
        "ARRAYS - LANGUAGES (1 field)": [
            ('languages', recent_user.get('languages', [])),
        ],
        "ARRAYS - CERTIFICATIONS (1 field)": [
            ('certificationEntries', recent_user.get('certificationEntries', [])),
        ],
        "PROFESSIONAL MEMBERSHIPS (3 fields)": [
            ('membershipOrg', recent_user.get('membershipOrg')),
            ('membershipType', recent_user.get('membershipType')),
            ('membershipDate', recent_user.get('membershipDate')),
        ],
        "ARRAYS - REFERENCES (1 field)": [
            ('referenceEntries', recent_user.get('referenceEntries', [])),
        ],
        "ARRAYS - PROFESSIONAL LINKS (1 field)": [
            ('professionalLinks', recent_user.get('professionalLinks', [])),
        ],
        "JOB PREFERENCES (7 fields)": [
            ('preferredJobTitles', recent_user.get('preferredJobTitles')),
            ('jobType', recent_user.get('jobType')),
            ('noticePeriod', recent_user.get('noticePeriod')),
            ('currentSalary', recent_user.get('currentSalary')),
            ('expectedSalary', recent_user.get('expectedSalary')),
            ('currencyPreference', recent_user.get('currencyPreference')),
            ('travelAvailability', recent_user.get('travelAvailability')),
        ],
        "ADDITIONAL INFORMATION (6 fields)": [
            ('careerObjectives', recent_user.get('careerObjectives')),
            ('hobbies', recent_user.get('hobbies')),
            ('additionalComments', recent_user.get('additionalComments')),
            ('agreeTerms', recent_user.get('agreeTerms')),
            ('allowContact', recent_user.get('allowContact')),
            ('profilePhoto', recent_user.get('profilePhotoPath')),
        ],
    }
    
    # Count all fields
    total_fields = 0
    total_filled = 0
    total_empty = 0
    
    for section_name, fields in all_fields.items():
        print(f"{'='*100}")
        print(f"{section_name}")
        print(f"{'='*100}")
        
        section_filled = 0
        
        for field_name, field_value in fields:
            total_fields += 1
            
            if isinstance(field_value, list):
                if len(field_value) > 0:
                    total_filled += 1
                    section_filled += 1
                    print(f"  ✅ {field_name:30} : {len(field_value)} items")
                else:
                    total_empty += 1
                    print(f"  ❌ {field_name:30} : Empty array")
            elif field_value and field_value != '' and field_value != 'None':
                total_filled += 1
                section_filled += 1
                value_str = str(field_value)
                value_display = value_str if len(value_str) <= 60 else value_str[:60] + "..."
                print(f"  ✅ {field_name:30} : {value_display}")
            else:
                total_empty += 1
                print(f"  ❌ {field_name:30} : MISSING")
        
        section_total = len(fields)
        print(f"\n  Section: {section_filled}/{section_total} fields filled ({int(section_filled/section_total*100)}%)\n")
    
    # Summary
    print(f"{'='*100}")
    print("COMPLETE SUMMARY - ALL FIELDS")
    print(f"{'='*100}\n")
    
    print(f"📊 Total Registration Form Fields: {total_fields}")
    print(f"✅ Fields WITH Data: {total_filled} ({int(total_filled/total_fields*100)}%)")
    print(f"❌ Fields EMPTY: {total_empty}")
    
    print(f"\n{'='*100}")
    print("VERDICT")
    print(f"{'='*100}\n")
    
    if total_filled >= 40:
        print(f"✅✅✅ EXCELLENT! {total_filled}/{total_fields} fields are being saved!")
        print(f"✅ Registration form IS working correctly")
        print(f"✅ Data IS in MongoDB Atlas")
        print(f"✅ MyProfile SHOULD display all {total_filled} fields")
    elif total_filled >= 25:
        print(f"✅ GOOD! {total_filled}/{total_fields} fields are being saved")
        print(f"✅ Most registration data is captured")
        print(f"⚠️  Some fields may be optional and not filled by user")
    else:
        print(f"❌ PROBLEM! Only {total_filled}/{total_fields} fields are being saved")
        print(f"❌ Data is NOT being saved properly")
    
    # Check if profile exists in jobseeker_profiles
    print(f"\n{'='*100}")
    print("JOBSEEKER_PROFILES COLLECTION CHECK")
    print(f"{'='*100}\n")
    
    if profile:
        print(f"✅ Profile EXISTS in jobseeker_profiles collection")
        
        # Count nested fields
        nested_count = 0
        for key, value in profile.items():
            if key not in ['_id', 'userId', 'createdAt', 'updatedAt']:
                if isinstance(value, dict):
                    nested_count += sum(1 for v in value.values() if v and v != '')
                elif isinstance(value, list):
                    if len(value) > 0:
                        nested_count += 1
        
        print(f"📊 Nested data fields: {nested_count}")
    else:
        print(f"❌ NO profile in jobseeker_profiles collection")
        print(f"⚠️  Only users collection has data")
    
    print(f"\n{'='*100}")
    print(f"🎯 TO TEST IN BROWSER")
    print(f"{'='*100}\n")
    print(f"1. Login with: {recent_user.get('email')}")
    print(f"2. Go to MyProfile page")
    print(f"3. You should see {total_filled} fields displayed!")
    print(f"\n{'='*100}\n")

if __name__ == "__main__":
    try:
        verify_all_fields()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

