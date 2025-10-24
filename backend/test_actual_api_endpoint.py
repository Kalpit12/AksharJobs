#!/usr/bin/env python3
"""
Test the actual API endpoint to see what it returns
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId
import json

# Import the actual GET endpoint logic
from routes.jobseeker_registration_routes import get_comprehensive_profile

def test_api_response():
    """Test what the API endpoint actually returns"""
    
    print("="*100)
    print(" "*30 + "API ENDPOINT TEST")
    print("="*100)
    
    db = get_db()
    
    # Get a user who has data in jobseeker_profiles
    print("\n🔍 Finding users with profiles in jobseeker_profiles...")
    
    profiles = list(db.jobseeker_profiles.find().limit(5))
    
    print(f"✅ Found {len(profiles)} profiles in jobseeker_profiles collection\n")
    
    for idx, profile in enumerate(profiles, 1):
        user_id = profile.get('userId')
        
        print(f"\n{'='*100}")
        print(f"PROFILE {idx}")
        print(f"{'='*100}")
        
        # Get user from users collection
        user_data = db.users.find_one({'_id': user_id})
        
        if not user_data:
            print(f"❌ No corresponding user in users collection")
            continue
        
        print(f"👤 User: {user_data.get('firstName', 'N/A')} {user_data.get('lastName', 'N/A')}")
        print(f"📧 Email: {user_data.get('email', 'N/A')}")
        print(f"🆔 User ID: {user_id}")
        
        # Check what's in users collection (flat)
        print(f"\n📊 DATA IN USERS COLLECTION (Flat):")
        print("-"*100)
        print(f"  firstName: {user_data.get('firstName', 'MISSING')}")
        print(f"  lastName: {user_data.get('lastName', 'MISSING')}")
        print(f"  dateOfBirth: {user_data.get('dateOfBirth', 'MISSING')}")
        print(f"  gender: {user_data.get('gender', 'MISSING')}")
        print(f"  professionalTitle: {user_data.get('professionalTitle', 'MISSING')}")
        print(f"  coreSkills: {user_data.get('coreSkills', 'MISSING')}")
        print(f"  experienceEntries: {len(user_data.get('experienceEntries', [])) if isinstance(user_data.get('experienceEntries'), list) else 'MISSING'}")
        
        # Check what's in jobseeker_profiles (nested)
        print(f"\n📊 DATA IN JOBSEEKER_PROFILES (Nested):")
        print("-"*100)
        personal_info = profile.get('personalInfo', {})
        professional = profile.get('professionalProfile', {})
        skills_info = profile.get('skillsInfo', {})
        
        print(f"  personalInfo.firstName: {personal_info.get('firstName', 'MISSING')}")
        print(f"  personalInfo.lastName: {personal_info.get('lastName', 'MISSING')}")
        print(f"  personalInfo.dateOfBirth: {personal_info.get('dateOfBirth', 'MISSING')}")
        print(f"  personalInfo.gender: {personal_info.get('gender', 'MISSING')}")
        print(f"  professionalProfile.professionalTitle: {professional.get('professionalTitle', 'MISSING')}")
        print(f"  skillsInfo.coreSkills: {len(skills_info.get('coreSkills', [])) if isinstance(skills_info.get('coreSkills'), list) else 'MISSING'} items")
        print(f"  experienceEntries: {len(profile.get('experienceEntries', [])) if isinstance(profile.get('experienceEntries'), list) else 'MISSING'} items")
        
        # Simulate the GET endpoint flattening
        print(f"\n🔄 SIMULATING GET ENDPOINT FLATTENING:")
        print("-"*100)
        
        # Priority: user_data (users collection) > profile nested > profile direct
        flattened = {
            'firstName': (user_data.get('firstName') if user_data.get('firstName') else None) or personal_info.get('firstName') or '',
            'lastName': (user_data.get('lastName') if user_data.get('lastName') else None) or personal_info.get('lastName') or '',
            'dateOfBirth': (user_data.get('dateOfBirth') if user_data.get('dateOfBirth') else None) or personal_info.get('dateOfBirth') or '',
            'gender': (user_data.get('gender') if user_data.get('gender') else None) or personal_info.get('gender') or '',
            'professionalTitle': (user_data.get('professionalTitle') if user_data.get('professionalTitle') else None) or professional.get('professionalTitle') or '',
            'coreSkills': (user_data.get('coreSkills', []) if user_data.get('coreSkills') else []) or skills_info.get('coreSkills', []) or [],
            'experienceEntries': (user_data.get('experienceEntries', []) if user_data.get('experienceEntries') else []) or profile.get('experienceEntries', []) or [],
        }
        
        print(f"  firstName: {flattened['firstName']}")
        print(f"  lastName: {flattened['lastName']}")
        print(f"  dateOfBirth: {flattened['dateOfBirth']}")
        print(f"  gender: {flattened['gender']}")
        print(f"  professionalTitle: {flattened['professionalTitle']}")
        print(f"  coreSkills: {len(flattened['coreSkills'])} items")
        print(f"  experienceEntries: {len(flattened['experienceEntries'])} items")
        
        # Check if data will be available
        print(f"\n✅ DIAGNOSIS:")
        print("-"*100)
        
        has_data = any([
            flattened['dateOfBirth'],
            flattened['gender'],
            flattened['professionalTitle'],
            len(flattened['coreSkills']) > 0,
            len(flattened['experienceEntries']) > 0
        ])
        
        if has_data:
            print(f"  ✅ GOOD: Flattening logic will return data to frontend")
            print(f"  ✅ MyProfile should display this user's data")
        else:
            print(f"  ❌ PROBLEM: No data will be returned")
            print(f"  ❌ Check if users collection needs to be updated")
            print(f"  ❌ Or if jobseeker_profiles has empty nested objects")

if __name__ == "__main__":
    try:
        test_api_response()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

