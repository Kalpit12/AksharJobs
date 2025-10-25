"""
Debug Field Mapping - Check if data exists but not displaying
================================================================
This script compares what's in the database vs what the frontend expects
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.db import get_db
from bson import ObjectId
import json

def debug_field_mapping():
    print("\n" + "="*70)
    print("DEBUGGING FIELD MAPPING - TEST USER")
    print("="*70 + "\n")
    
    db = get_db()
    users_collection = db.users
    
    # Find test user
    test_user = users_collection.find_one({'email': 'test.intern@aksharvault.com'})
    
    if not test_user:
        print("Test user not found!")
        return
    
    print(f"Found user: {test_user.get('email')}")
    print(f"User ID: {test_user.get('_id')}\n")
    
    comp_profile = test_user.get('comprehensiveInternProfile', {})
    
    if not comp_profile:
        print("No comprehensive profile data!")
        return
    
    print("="*70)
    print("ALL FIELDS IN DATABASE (comprehensiveInternProfile)")
    print("="*70 + "\n")
    
    # Print all fields and their values
    for key in sorted(comp_profile.keys()):
        value = comp_profile[key]
        
        if isinstance(value, list):
            if len(value) > 0 and isinstance(value[0], dict):
                print(f"{key}: (array of {len(value)} objects)")
                for i, item in enumerate(value, 1):
                    print(f"  [{i}] {list(item.keys())}")
            else:
                print(f"{key}: (array) {value[:3]}{'...' if len(value) > 3 else ''}")
        elif isinstance(value, dict):
            print(f"{key}: (dict) {list(value.keys())}")
        else:
            val_str = str(value)[:60]
            print(f"{key}: {val_str}{'...' if len(str(value)) > 60 else ''}")
    
    print(f"\n" + "="*70)
    print("CHECKING WHAT FRONTEND EXPECTS (from InternMyProfile.jsx)")
    print("="*70 + "\n")
    
    # Fields that frontend expects (from loadProfileData)
    expected_fields = {
        'firstName': comp_profile.get('firstName'),
        'lastName': comp_profile.get('lastName'),
        'middleName': comp_profile.get('middleName'),
        'email': comp_profile.get('email'),
        'phone': comp_profile.get('phone'),
        'altPhone': comp_profile.get('altPhone'),
        'dateOfBirth': comp_profile.get('dateOfBirth'),
        'gender': comp_profile.get('gender'),
        'nationality': comp_profile.get('nationality'),
        'residentCountry': comp_profile.get('residentCountry'),
        'currentCity': comp_profile.get('currentCity'),
        'postalCode': comp_profile.get('postalCode'),
        'address': comp_profile.get('address'),
        'latitude': comp_profile.get('latitude'),
        'longitude': comp_profile.get('longitude'),
        'validDocs': comp_profile.get('validDocs'),
        'preferredLocation1': comp_profile.get('preferredLocation1'),
        'preferredLocation2': comp_profile.get('preferredLocation2'),
        'preferredLocation3': comp_profile.get('preferredLocation3'),
        'willingToRelocate': comp_profile.get('willingToRelocate'),
        'internshipMode': comp_profile.get('internshipMode'),
        'academicLevel': comp_profile.get('academicLevel'),
        'objective': comp_profile.get('objective'),
        'industryInterest': comp_profile.get('industryInterest'),
        'preferredRole': comp_profile.get('preferredRole'),
        'internshipDuration': comp_profile.get('internshipDuration'),
        'availability': comp_profile.get('availability'),
        'internshipTiming': comp_profile.get('internshipTiming'),
        'expectedStipend': comp_profile.get('expectedStipend'),
        'currencyPreference': comp_profile.get('currencyPreference'),
        'unpaidWilling': comp_profile.get('unpaidWilling'),
        'academicCredit': comp_profile.get('academicCredit'),
        'hobbies': comp_profile.get('hobbies'),
        'whyInternship': comp_profile.get('whyInternship'),
        'additionalComments': comp_profile.get('additionalComments'),
    }
    
    # Check array fields
    array_fields = {
        'educationEntries': comp_profile.get('educationEntries', []),
        'experienceEntries': comp_profile.get('experienceEntries', []),
        'projectEntries': comp_profile.get('projectEntries', []),
        'activityEntries': comp_profile.get('activityEntries', []),
        'certificationEntries': comp_profile.get('certificationEntries', []),
        'referenceEntries': comp_profile.get('referenceEntries', []),
        'technicalSkills': comp_profile.get('technicalSkills', []),
        'softSkills': comp_profile.get('softSkills', []),
        'languages': comp_profile.get('languages', []),
        'careerInterests': comp_profile.get('careerInterests', []),
        'professionalLinks': comp_profile.get('professionalLinks', [])
    }
    
    print("SIMPLE FIELDS:")
    missing_simple = []
    blank_simple = []
    
    for field, value in expected_fields.items():
        if value is None:
            missing_simple.append(field)
            print(f"  [MISSING] {field}")
        elif value == '' or value == ' ':
            blank_simple.append(field)
            print(f"  [BLANK] {field}")
        else:
            val_str = str(value)[:40]
            print(f"  [OK] {field}: {val_str}{'...' if len(str(value)) > 40 else ''}")
    
    print(f"\nARRAY FIELDS:")
    missing_arrays = []
    empty_arrays = []
    
    for field, value in array_fields.items():
        if value is None:
            missing_arrays.append(field)
            print(f"  [MISSING] {field}")
        elif len(value) == 0:
            empty_arrays.append(field)
            print(f"  [EMPTY] {field}")
        else:
            print(f"  [OK] {field}: {len(value)} items")
    
    print(f"\n" + "="*70)
    print("POTENTIAL ISSUES")
    print("="*70 + "\n")
    
    if missing_simple:
        print(f"[WARNING] {len(missing_simple)} fields are MISSING from database:")
        for f in missing_simple:
            print(f"  - {f}")
    
    if blank_simple:
        print(f"\n[WARNING] {len(blank_simple)} fields are BLANK in database:")
        for f in blank_simple:
            print(f"  - {f}")
    
    if missing_arrays:
        print(f"\n[WARNING] {len(missing_arrays)} arrays are MISSING:")
        for f in missing_arrays:
            print(f"  - {f}")
    
    if empty_arrays:
        print(f"\n[WARNING] {len(empty_arrays)} arrays are EMPTY:")
        for f in empty_arrays:
            print(f"  - {f}")
    
    if not (missing_simple or blank_simple or missing_arrays or empty_arrays):
        print("[SUCCESS] All expected fields have data!")
    
    # Check what InternService.get_intern_profile returns
    print(f"\n" + "="*70)
    print("SIMULATING BACKEND GET /api/intern/profile RESPONSE")
    print("="*70 + "\n")
    
    from services.intern_service import InternService
    intern_service = InternService()
    
    profile_data = intern_service.get_intern_profile(str(test_user['_id']))
    
    print(f"Backend returns {len(profile_data)} fields\n")
    
    # Compare what backend returns vs what's in database
    print("CHECKING IF BACKEND RETURNS ALL FIELDS:\n")
    
    missing_in_response = []
    for field in expected_fields.keys():
        if field not in profile_data:
            missing_in_response.append(field)
            print(f"  [MISSING IN RESPONSE] {field}")
    
    for field in array_fields.keys():
        if field not in profile_data:
            missing_in_response.append(field)
            print(f"  [MISSING IN RESPONSE] {field}")
    
    if not missing_in_response:
        print("  [OK] Backend returns all expected fields")
    else:
        print(f"\n[ERROR] {len(missing_in_response)} fields missing in backend response!")
        print("This means frontend won't receive them!\n")
    
    # Check field name mismatches
    print(f"\n" + "="*70)
    print("CHECKING FOR FIELD NAME MISMATCHES")
    print("="*70 + "\n")
    
    # Fields in database but not expected by frontend
    db_fields = set(comp_profile.keys())
    expected_field_names = set(list(expected_fields.keys()) + list(array_fields.keys()))
    
    extra_in_db = db_fields - expected_field_names
    if extra_in_db:
        print("[INFO] Fields in database but NOT read by frontend:")
        for f in extra_in_db:
            print(f"  - {f}")
    else:
        print("[OK] No extra fields in database")
    
    missing_in_db = expected_field_names - db_fields
    if missing_in_db:
        print(f"\n[WARNING] Fields frontend expects but NOT in database:")
        for f in missing_in_db:
            print(f"  - {f}")
    else:
        print("\n[OK] All expected fields exist in database")
    
    print("\n" + "="*70 + "\n")

if __name__ == '__main__':
    debug_field_mapping()

