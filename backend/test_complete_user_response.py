#!/usr/bin/env python3
"""
Test GET endpoint with the most complete user (Max Pro - 81%)
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId
import json

def test_complete_user():
    """Test with Max Pro who has 81% complete data"""
    
    print("="*100)
    print(" "*15 + "TESTING GET ENDPOINT WITH MOST COMPLETE USER")
    print("="*100)
    
    db = get_db()
    
    # Find Max Pro
    user = db.users.find_one({'email': 'maxpro233@gmail.com'})
    
    if not user:
        print("❌ Max Pro user not found")
        return
    
    user_id = user.get('_id')
    profile = db.jobseeker_profiles.find_one({'userId': user_id})
    
    print(f"\n👤 User: Max Pro")
    print(f"📧 Email: maxpro233@gmail.com")
    print(f"🆔 User ID: {user_id}")
    
    if not profile:
        print(f"❌ No profile found in jobseeker_profiles")
        return
    
    print(f"\n{'='*100}")
    print("WHAT'S IN JOBSEEKER_PROFILES (Nested)")
    print(f"{'='*100}\n")
    
    # Show all sections
    sections = {
        'personalInfo': profile.get('personalInfo', {}),
        'nationalityResidency': profile.get('nationalityResidency', {}),
        'preferredLocations': profile.get('preferredLocations', {}),
        'professionalProfile': profile.get('professionalProfile', {}),
        'skillsInfo': profile.get('skillsInfo', {}),
        'jobPreferences': profile.get('jobPreferences', {}),
        'memberships': profile.get('memberships', {}),
        'additionalInfo': profile.get('additionalInfo', {}),
    }
    
    for section_name, section_data in sections.items():
        print(f"{section_name}:")
        if isinstance(section_data, dict):
            for key, value in section_data.items():
                value_str = str(value)
                value_display = value_str if len(value_str) <= 60 else value_str[:60] + "..."
                status = "✅" if value and value != '' else "❌"
                print(f"  {status} {key:30} : {value_display}")
        print()
    
    # Arrays
    print(f"ARRAYS:")
    print(f"  ✅ educationEntries: {len(profile.get('educationEntries', []))} items")
    print(f"  ✅ experienceEntries: {len(profile.get('experienceEntries', []))} items")
    print(f"  ✅ languages: {len(profile.get('languages', []))} items")
    print(f"  ✅ certificationEntries: {len(profile.get('certificationEntries', []))} items")
    print(f"  ✅ professionalLinks: {len(profile.get('professionalLinks', []))} items")
    print(f"  ✅ referenceEntries: {len(profile.get('referenceEntries', []))} items")
    
    print(f"\n{'='*100}")
    print("WHAT'S IN USERS COLLECTION (Flat)")
    print(f"{'='*100}\n")
    
    # Check users collection
    user_fields = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'professionalTitle', 
                   'yearsExperience', 'coreSkills', 'educationEntries', 'experienceEntries']
    
    for field in user_fields:
        value = user.get(field)
        if isinstance(value, list):
            value_display = f"{len(value)} items" if value else "Empty array"
        elif value and value != '':
            value_str = str(value)
            value_display = value_str if len(value_str) <= 60 else value_str[:60] + "..."
        else:
            value_display = "MISSING"
        
        status = "✅" if (value and value != '' and value != []) else "❌"
        print(f"  {status} {field:30} : {value_display}")
    
    print(f"\n{'='*100}")
    print("SIMULATED GET ENDPOINT RESPONSE")
    print(f"{'='*100}\n")
    
    # Simulate complete flattening
    response = {}
    
    # From personalInfo
    personal = profile.get('personalInfo', {})
    for key, value in personal.items():
        response[key] = (user.get(key) if user.get(key) else None) or value or ''
    
    # From professionalProfile
    prof = profile.get('professionalProfile', {})
    for key, value in prof.items():
        response[key] = (user.get(key) if user.get(key) else None) or value or ''
    
    # From nationalityResidency
    nat = profile.get('nationalityResidency', {})
    for key, value in nat.items():
        response[key] = (user.get(key) if user.get(key) else None) or value or ''
    
    # Skills
    skills = profile.get('skillsInfo', {})
    response['coreSkills'] = user.get('coreSkills', []) or skills.get('coreSkills', []) or []
    response['tools'] = user.get('tools', []) or skills.get('tools', []) or []
    
    # Arrays
    response['educationEntries'] = user.get('educationEntries', []) or profile.get('educationEntries', []) or []
    response['experienceEntries'] = user.get('experienceEntries', []) or profile.get('experienceEntries', []) or []
    response['languages'] = user.get('languages', []) or profile.get('languages', []) or []
    response['certificationEntries'] = user.get('certificationEntries', []) or profile.get('certificationEntries', []) or []
    
    # Count what will be returned
    filled_response = 0
    for key, value in response.items():
        if isinstance(value, list):
            if len(value) > 0:
                filled_response += 1
                status = "✅"
                value_display = f"{len(value)} items"
            else:
                status = "❌"
                value_display = "Empty array"
        elif value and value != '':
            filled_response += 1
            status = "✅"
            value_str = str(value)
            value_display = value_str if len(value_str) <= 60 else value_str[:60] + "..."
        else:
            status = "❌"
            value_display = "EMPTY"
        
        print(f"  {status} {key:30} : {value_display}")
    
    print(f"\n{'='*100}")
    print("FINAL VERDICT")
    print(f"{'='*100}\n")
    
    print(f"📊 Total fields in response: {len(response)}")
    print(f"✅ Fields WITH data: {filled_response}")
    print(f"❌ Empty fields: {len(response) - filled_response}")
    print(f"📈 Completeness: {int((filled_response/len(response))*100)}%")
    
    print(f"\n✅ CONCLUSION:")
    print(f"   The GET endpoint WILL return {filled_response} fields with data")
    print(f"   This user has {int((filled_response/len(response))*100)}% complete profile")
    print(f"   MyProfile should display all {filled_response} populated fields")
    
    print(f"\n🚀 ACTION REQUIRED:")
    print(f"   1. RESTART your backend to connect to Atlas")
    print(f"   2. Login with: maxpro233@gmail.com")
    print(f"   3. Go to MyProfile")
    print(f"   4. You should see {filled_response} fields populated!")
    
    print(f"\n{'='*100}\n")

if __name__ == "__main__":
    try:
        test_complete_user()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

