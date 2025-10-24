#!/usr/bin/env python3
"""
Test the actual GET endpoint with a real user to see the response
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId
import json

def test_get_endpoint():
    """Test what the GET endpoint actually returns"""
    
    print("="*100)
    print(" "*25 + "TESTING GET ENDPOINT RESPONSE")
    print("="*100)
    
    db = get_db()
    
    # Get a user with complete profile
    profile = db.jobseeker_profiles.find_one()
    
    if not profile:
        print("❌ No profiles found")
        return
    
    user_id = profile.get('userId')
    user_data = db.users.find_one({'_id': user_id})
    
    print(f"\n👤 Testing with user: {user_data.get('email')}")
    print(f"🆔 User ID: {user_id}\n")
    
    # SIMULATE THE GET ENDPOINT LOGIC (from jobseeker_registration_routes.py lines 716-876)
    
    print(f"{'='*100}")
    print("STEP 1: GET DATA FROM BOTH COLLECTIONS")
    print(f"{'='*100}\n")
    
    print(f"✅ Found in users collection: {user_data is not None}")
    print(f"✅ Found in jobseeker_profiles: {profile is not None}")
    
    # Extract nested data
    personal_info = profile.get('personalInfo', {})
    professional_profile = profile.get('professionalProfile', {})
    nationality_residency = profile.get('nationalityResidency', {})
    preferred_locations = profile.get('preferredLocations', {})
    skills_info = profile.get('skillsInfo', {})
    job_preferences = profile.get('jobPreferences', {})
    memberships = profile.get('memberships', {})
    additional_info = profile.get('additionalInfo', {})
    
    print(f"\n{'='*100}")
    print("STEP 2: FLATTEN NESTED DATA (What GET Endpoint Does)")
    print(f"{'='*100}\n")
    
    # This mirrors the actual flattening logic in the GET endpoint
    flattened = {
        # Personal Information - Priority: user_data > profile nested
        'firstName': (user_data.get('firstName') if user_data and user_data.get('firstName') else None) or personal_info.get('firstName') or '',
        'middleName': (user_data.get('middleName') if user_data and user_data.get('middleName') else None) or personal_info.get('middleName') or '',
        'lastName': (user_data.get('lastName') if user_data and user_data.get('lastName') else None) or personal_info.get('lastName') or '',
        'email': (user_data.get('email') if user_data and user_data.get('email') else None) or personal_info.get('email') or '',
        'phone': (user_data.get('phone') if user_data and user_data.get('phone') else None) or personal_info.get('phone') or '',
        'altPhone': (user_data.get('altPhone') if user_data and user_data.get('altPhone') else None) or personal_info.get('altPhone') or '',
        'dateOfBirth': (user_data.get('dateOfBirth') if user_data and user_data.get('dateOfBirth') else None) or personal_info.get('dateOfBirth') or '',
        'gender': (user_data.get('gender') if user_data and user_data.get('gender') else None) or personal_info.get('gender') or '',
        'bloodGroup': (user_data.get('bloodGroup') if user_data and user_data.get('bloodGroup') else None) or additional_info.get('bloodGroup') or personal_info.get('bloodGroup') or '',
        'community': (user_data.get('community') if user_data and user_data.get('community') else None) or personal_info.get('community') or '',
        
        # Nationality & Residency
        'nationality': (user_data.get('nationality') if user_data and user_data.get('nationality') else None) or nationality_residency.get('nationality') or '',
        'residentCountry': (user_data.get('residentCountry') if user_data and user_data.get('residentCountry') else None) or nationality_residency.get('residentCountry') or '',
        'currentCity': (user_data.get('currentCity') if user_data and user_data.get('currentCity') else None) or nationality_residency.get('currentCity') or '',
        'postalCode': (user_data.get('postalCode') if user_data and user_data.get('postalCode') else None) or nationality_residency.get('postalCode') or '',
        'address': (user_data.get('address') if user_data and user_data.get('address') else None) or nationality_residency.get('address') or '',
        'workPermit': (user_data.get('workPermit') if user_data and user_data.get('workPermit') else None) or nationality_residency.get('workPermit') or '',
        
        # Professional Profile
        'professionalTitle': (user_data.get('professionalTitle') if user_data and user_data.get('professionalTitle') else None) or professional_profile.get('professionalTitle') or '',
        'yearsExperience': (user_data.get('yearsExperience') if user_data and user_data.get('yearsExperience') else None) or professional_profile.get('yearsExperience') or '',
        'careerLevel': (user_data.get('careerLevel') if user_data and user_data.get('careerLevel') else None) or professional_profile.get('careerLevel') or '',
        'industry': (user_data.get('industry') if user_data and user_data.get('industry') else None) or professional_profile.get('industry') or '',
        'summary': (user_data.get('summary') if user_data and user_data.get('summary') else None) or professional_profile.get('summary') or '',
        
        # Skills
        'coreSkills': (user_data.get('coreSkills', []) if user_data and user_data.get('coreSkills') else []) or skills_info.get('coreSkills', []) or [],
        'tools': (user_data.get('tools', []) if user_data and user_data.get('tools') else []) or skills_info.get('tools', []) or [],
        
        # Arrays
        'educationEntries': (user_data.get('educationEntries', []) if user_data and user_data.get('educationEntries') else []) or profile.get('educationEntries', []) or [],
        'experienceEntries': (user_data.get('experienceEntries', []) if user_data and user_data.get('experienceEntries') else []) or profile.get('experienceEntries', []) or [],
        'languages': (user_data.get('languages', []) if user_data and user_data.get('languages') else []) or profile.get('languages', []) or [],
        'certificationEntries': (user_data.get('certificationEntries', []) if user_data and user_data.get('certificationEntries') else []) or profile.get('certificationEntries', []) or [],
        
        # Job Preferences
        'jobType': (user_data.get('jobType') if user_data and user_data.get('jobType') else None) or job_preferences.get('jobType') or '',
        'noticePeriod': (user_data.get('noticePeriod') if user_data and user_data.get('noticePeriod') else None) or job_preferences.get('noticePeriod') or '',
        
        # Memberships
        'membershipOrg': (user_data.get('membershipOrg') if user_data and user_data.get('membershipOrg') else None) or memberships.get('membershipOrg') or '',
    }
    
    print(f"FLATTENED DATA (What API Should Return):")
    print("-"*100)
    
    for field, value in flattened.items():
        if isinstance(value, list):
            value_display = f"{len(value)} items" if len(value) > 0 else "Empty array"
        elif value and value != '':
            value_str = str(value)
            value_display = value_str if len(value_str) <= 50 else value_str[:50] + "..."
        else:
            value_display = "EMPTY"
        
        status = "✅" if (value and value != '' and value != []) else "❌"
        print(f"  {status} {field:30} : {value_display}")
    
    # Count filled fields
    filled_count = sum(1 for v in flattened.values() if v and v != '' and v != [])
    
    print(f"\n{'='*100}")
    print("API RESPONSE PREDICTION")
    print(f"{'='*100}\n")
    
    print(f"📊 Fields that will be returned: {filled_count}/{len(flattened)}")
    print(f"📊 Percentage: {int((filled_count/len(flattened))*100)}%")
    
    print(f"\n✅ DIAGNOSIS:")
    print(f"   The GET endpoint SHOULD return these flattened fields")
    print(f"   Frontend should receive {filled_count} populated fields")
    print(f"   MyProfile should be able to display this data")
    
    print(f"\n💡 IF MYPROFILE IS STILL BLANK:")
    print(f"   1. Check backend is RESTARTED (to apply all fixes)")
    print(f"   2. Check backend connects to Atlas (mongodb+srv://...)")
    print(f"   3. Check browser console for API call response")
    print(f"   4. Check Network tab (F12) for /api/jobseeker/profile response")
    
    print(f"\n{'='*100}\n")

if __name__ == "__main__":
    try:
        test_get_endpoint()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

