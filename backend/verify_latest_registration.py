#!/usr/bin/env python3
"""
Verify the data from the latest registration that was just created
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from datetime import datetime, timedelta

def verify_latest():
    """Check the most recently created user"""
    
    print("="*100)
    print(" "*20 + "VERIFYING LATEST REGISTRATION DATA")
    print("="*100)
    
    db = get_db()
    
    if db is None:
        print("❌ Could not connect to database")
        return
    
    # Find users created in last 5 minutes
    five_mins_ago = datetime.utcnow() - timedelta(minutes=5)
    
    recent_users = list(db.users.find({
        "userType": "job_seeker",
        "created_at": {"$gte": five_mins_ago}
    }).sort("created_at", -1))
    
    print(f"\n✅ Found {len(recent_users)} job seeker(s) created in last 5 minutes\n")
    
    if len(recent_users) == 0:
        print("ℹ️  No recent registrations found")
        print("   Looking at most recent user instead...\n")
        
        recent_users = list(db.users.find({
            "userType": "job_seeker"
        }).sort("created_at", -1).limit(3))
    
    for idx, user in enumerate(recent_users[:3], 1):
        print(f"{'='*100}")
        print(f"USER {idx}: {user.get('firstName', 'N/A')} {user.get('lastName', 'N/A')}")
        print(f"{'='*100}")
        
        print(f"📧 Email: {user.get('email')}")
        print(f"🆔 User ID: {user.get('_id')}")
        print(f"📅 Created: {user.get('created_at')}")
        print(f"✅ Profile Completed: {user.get('profileCompleted', False)}")
        print(f"📝 Is Draft: {user.get('isDraft', False)}")
        
        # Check what fields are in users collection
        print(f"\n📊 DATA IN USERS COLLECTION (Flat):")
        print("-"*100)
        
        key_fields = [
            'firstName', 'middleName', 'lastName', 'email', 'phone', 'altPhone',
            'dateOfBirth', 'gender', 'bloodGroup', 'community',
            'nationality', 'residentCountry', 'currentCity', 'postalCode', 'address',
            'workPermit', 'preferredLocation1', 'preferredLocation2', 'preferredLocation3',
            'willingToRelocate', 'workLocation',
            'professionalTitle', 'yearsExperience', 'careerLevel', 'industry', 'summary',
            'coreSkills', 'tools', 'languages',
            'educationEntries', 'experienceEntries', 'certificationEntries',
            'preferredJobTitles', 'jobType', 'noticePeriod', 'currentSalary', 'expectedSalary',
            'membershipOrg', 'careerObjectives', 'hobbies'
        ]
        
        filled_count = 0
        for field in key_fields:
            value = user.get(field)
            
            if isinstance(value, list):
                if len(value) > 0:
                    filled_count += 1
                    print(f"  ✅ {field:30} : {len(value)} items")
                else:
                    print(f"  ❌ {field:30} : Empty array")
            elif value and value != '':
                filled_count += 1
                value_str = str(value)
                value_display = value_str if len(value_str) <= 50 else value_str[:50] + "..."
                print(f"  ✅ {field:30} : {value_display}")
            else:
                print(f"  ❌ {field:30} : MISSING")
        
        print(f"\n  📊 Filled: {filled_count}/{len(key_fields)} fields ({int(filled_count/len(key_fields)*100)}%)")
        
        # Check jobseeker_profiles collection
        profile = db.jobseeker_profiles.find_one({'userId': user.get('_id')})
        
        print(f"\n📊 DATA IN JOBSEEKER_PROFILES COLLECTION (Nested):")
        print("-"*100)
        
        if profile:
            print(f"  ✅ FOUND profile in jobseeker_profiles")
            
            sections = {
                'personalInfo': profile.get('personalInfo', {}),
                'nationalityResidency': profile.get('nationalityResidency', {}),
                'preferredLocations': profile.get('preferredLocations', {}),
                'professionalProfile': profile.get('professionalProfile', {}),
                'skillsInfo': profile.get('skillsInfo', {}),
                'jobPreferences': profile.get('jobPreferences', {}),
                'memberships': profile.get('memberships', {}),
                'additionalInfo': profile.get('additionalInfo', {})
            }
            
            total_nested_fields = 0
            for section_name, section_data in sections.items():
                if isinstance(section_data, dict):
                    filled_in_section = sum(1 for v in section_data.values() if v and v != '')
                    total_in_section = len(section_data)
                    total_nested_fields += filled_in_section
                    print(f"  ✅ {section_name:25} : {filled_in_section}/{total_in_section} fields")
            
            # Arrays
            arrays = {
                'educationEntries': profile.get('educationEntries', []),
                'experienceEntries': profile.get('experienceEntries', []),
                'languages': profile.get('languages', []),
                'certificationEntries': profile.get('certificationEntries', []),
                'professionalLinks': profile.get('professionalLinks', []),
                'referenceEntries': profile.get('referenceEntries', [])
            }
            
            for array_name, array_value in arrays.items():
                if isinstance(array_value, list) and len(array_value) > 0:
                    total_nested_fields += 1
                    print(f"  ✅ {array_name:25} : {len(array_value)} items")
                else:
                    print(f"  ❌ {array_name:25} : Empty")
            
            print(f"\n  📊 Total nested fields with data: {total_nested_fields}")
        else:
            print(f"  ❌ NO profile found in jobseeker_profiles")
        
        print(f"\n{'='*100}")
        print(f"VERDICT FOR THIS USER")
        print(f"{'='*100}\n")
        
        if filled_count >= 25:
            print(f"✅✅✅ EXCELLENT! {filled_count} fields saved in users collection!")
            print(f"✅ MyProfile WILL display this data")
        elif filled_count >= 15:
            print(f"✅ GOOD! {filled_count} fields saved")
            print(f"✅ Most data available for MyProfile")
        elif filled_count >= 5:
            print(f"⚠️  PARTIAL: {filled_count} fields saved")
            print(f"⚠️  Some data missing")
        else:
            print(f"❌ PROBLEM: Only {filled_count} fields saved")
            print(f"❌ Data not being saved properly")
        
        print(f"\n")
    
    print(f"{'='*100}")
    print("SUMMARY")
    print(f"{'='*100}\n")
    
    if recent_users:
        latest = recent_users[0]
        print(f"Latest User: {latest.get('firstName')} {latest.get('lastName')}")
        print(f"Email: {latest.get('email')}")
        print(f"\n🎯 TO TEST MYPROFILE:")
        print(f"   1. Login with: {latest.get('email')}")
        print(f"   2. Password: (the password you just used)")
        print(f"   3. Go to MyProfile page")
        print(f"   4. Check if all {filled_count} fields display!")
    
    print(f"\n{'='*100}\n")

if __name__ == "__main__":
    try:
        verify_latest()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

