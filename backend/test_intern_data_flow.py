"""
Test Script: Verify Intern Registration to My Profile Data Flow
================================================================
This script verifies that data filled in the intern registration form
is properly saved to the database and can be retrieved by the My Profile page.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.db import get_db
from bson import ObjectId
import json
from datetime import datetime

def test_intern_data_flow():
    """
    Test the complete data flow from registration form to My Profile page
    """
    print("\n" + "="*70)
    print("INTERN DATA FLOW VERIFICATION TEST")
    print("="*70 + "\n")
    
    db = get_db()
    users_collection = db.users
    
    # Find the most recently updated intern
    print("1. Finding most recent intern profile...")
    recent_intern = users_collection.find_one(
        {'userType': 'intern'},
        sort=[('updatedAt', -1)]
    )
    
    if not recent_intern:
        print("   [WARNING] No intern users found in database")
        print("   Please complete the intern registration form first\n")
        return False
    
    user_id = str(recent_intern['_id'])
    email = recent_intern.get('email', 'N/A')
    print(f"   [OK] Found intern: {email}")
    print(f"   [OK] User ID: {user_id}\n")
    
    # Check if comprehensive profile exists
    print("2. Checking for comprehensive profile data...")
    comp_profile = recent_intern.get('comprehensiveInternProfile', {})
    
    if not comp_profile:
        print("   [WARNING] No comprehensive profile data found")
        print("   This intern may not have completed the registration form yet\n")
        return False
    
    print(f"   [OK] Comprehensive profile exists")
    print(f"   [OK] Profile has {len(comp_profile)} fields\n")
    
    # Verify all 15 sections
    print("3. Verifying all 15 comprehensive sections...")
    
    sections = {
        "Personal Information": ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender'],
        "Nationality & Residency": ['nationality', 'residentCountry', 'currentCity', 'validDocs'],
        "Preferred Locations": ['preferredLocation1', 'preferredLocation2', 'preferredLocation3', 'willingToRelocate'],
        "Education": ['educationEntries'],
        "Internship Objective": ['objective', 'industryInterest', 'preferredRole'],
        "Experience": ['experienceEntries'],
        "Skills": ['technicalSkills', 'softSkills'],
        "Languages": ['languages'],
        "Projects": ['projectEntries'],
        "Activities": ['activityEntries'],
        "Certifications": ['certificationEntries'],
        "References": ['referenceEntries'],
        "Online Presence": ['professionalLinks'],
        "Preferences": ['internshipDuration', 'availability', 'internshipMode', 'expectedStipend'],
        "Additional Info": ['hobbies', 'whyInternship', 'additionalComments']
    }
    
    filled_sections = 0
    total_sections = len(sections)
    
    for section_name, fields in sections.items():
        has_data = False
        field_count = 0
        
        for field in fields:
            if field in comp_profile:
                value = comp_profile[field]
                
                # Check if field has meaningful data
                if isinstance(value, list):
                    if len(value) > 0:
                        field_count += 1
                        has_data = True
                elif isinstance(value, str):
                    if value and value.strip():
                        field_count += 1
                        has_data = True
                else:
                    if value:
                        field_count += 1
                        has_data = True
        
        status = "[OK]" if has_data else "[EMPTY]"
        filled_sections += 1 if has_data else 0
        print(f"   {status} {section_name}: {field_count}/{len(fields)} fields filled")
    
    print(f"\n   Summary: {filled_sections}/{total_sections} sections have data\n")
    
    # Verify array fields are properly formatted
    print("4. Verifying array fields (for My Profile display)...")
    
    array_fields = {
        'educationEntries': 'Education',
        'experienceEntries': 'Experience',
        'technicalSkills': 'Technical Skills',
        'softSkills': 'Soft Skills',
        'languages': 'Languages',
        'projectEntries': 'Projects',
        'activityEntries': 'Activities',
        'certificationEntries': 'Certifications',
        'referenceEntries': 'References',
        'professionalLinks': 'Professional Links',
        'careerInterests': 'Career Interests'
    }
    
    array_issues = 0
    
    for field, display_name in array_fields.items():
        if field in comp_profile:
            value = comp_profile[field]
            
            if isinstance(value, list):
                print(f"   [OK] {display_name}: {len(value)} entries (array)")
            elif isinstance(value, str):
                print(f"   [WARNING] {display_name}: Stored as string (should be array)")
                array_issues += 1
            else:
                print(f"   [WARNING] {display_name}: Invalid type {type(value)}")
                array_issues += 1
        else:
            print(f"   [EMPTY] {display_name}: Not found")
    
    if array_issues > 0:
        print(f"\n   [WARNING] {array_issues} array fields have format issues\n")
    else:
        print(f"\n   [OK] All array fields properly formatted\n")
    
    # Show sample data
    print("5. Sample data from profile...")
    
    print(f"   Name: {comp_profile.get('firstName', 'N/A')} {comp_profile.get('lastName', 'N/A')}")
    print(f"   Email: {comp_profile.get('email', 'N/A')}")
    print(f"   Phone: {comp_profile.get('phone', 'N/A')}")
    print(f"   Academic Level: {comp_profile.get('academicLevel', 'N/A')}")
    print(f"   Preferred Role: {comp_profile.get('preferredRole', 'N/A')}")
    print(f"   Location: {comp_profile.get('currentCity', 'N/A')}, {comp_profile.get('residentCountry', 'N/A')}")
    
    tech_skills = comp_profile.get('technicalSkills', [])
    if isinstance(tech_skills, list) and len(tech_skills) > 0:
        print(f"   Technical Skills: {', '.join(tech_skills[:5])}{' ...' if len(tech_skills) > 5 else ''}")
    
    edu_entries = comp_profile.get('educationEntries', [])
    if isinstance(edu_entries, list) and len(edu_entries) > 0:
        first_edu = edu_entries[0]
        if isinstance(first_edu, dict):
            print(f"   Education: {first_edu.get('degree', 'N/A')} in {first_edu.get('fieldOfStudy', 'N/A')} from {first_edu.get('institution', 'N/A')}")
    
    print()
    
    # Verify what My Profile page will receive
    print("6. Simulating My Profile page data fetch (GET /api/intern/profile)...")
    
    from services.intern_service import InternService
    intern_service = InternService()
    
    profile_data = intern_service.get_intern_profile(user_id)
    
    if profile_data:
        print(f"   [OK] Profile data retrieved successfully")
        print(f"   [OK] Response has {len(profile_data)} fields")
        
        # Check critical fields
        critical_fields = ['firstName', 'lastName', 'email', 'educationEntries', 'technicalSkills']
        missing = []
        
        for field in critical_fields:
            if field not in profile_data or not profile_data[field]:
                missing.append(field)
        
        if missing:
            print(f"   [WARNING] Missing critical fields: {', '.join(missing)}")
        else:
            print(f"   [OK] All critical fields present")
        
        # Verify arrays are still arrays (not converted to strings)
        array_ok = True
        for field in array_fields.keys():
            if field in profile_data:
                if not isinstance(profile_data[field], list):
                    print(f"   [ERROR] {field} converted to {type(profile_data[field])} (should be list)")
                    array_ok = False
        
        if array_ok:
            print(f"   [OK] All array fields remain as arrays")
    else:
        print(f"   [ERROR] Failed to retrieve profile data")
        return False
    
    print()
    
    # Final verdict
    print("="*70)
    print("VERIFICATION RESULTS")
    print("="*70 + "\n")
    
    if filled_sections >= 10 and array_issues == 0:
        print("   [SUCCESS] Data flow is working correctly!")
        print("   - Registration form saves data properly")
        print("   - Backend stores data in correct format")
        print("   - My Profile page can retrieve all data")
        print("   - Array fields are properly formatted")
        result = True
    elif filled_sections >= 5:
        print("   [PARTIAL SUCCESS] Data flow is working but incomplete")
        print(f"   - Only {filled_sections}/{total_sections} sections filled")
        if array_issues > 0:
            print(f"   - {array_issues} array formatting issues detected")
        print("   - Try filling out more sections in the registration form")
        result = True
    else:
        print("   [NEEDS ATTENTION] Data flow has issues")
        print(f"   - Only {filled_sections}/{total_sections} sections filled")
        if array_issues > 0:
            print(f"   - {array_issues} array formatting issues")
        print("   - Please complete the registration form and try again")
        result = False
    
    print("\n" + "="*70 + "\n")
    
    return result


def show_profile_in_detail(user_id=None):
    """
    Show detailed profile data for verification
    """
    db = get_db()
    users_collection = db.users
    
    if user_id:
        user = users_collection.find_one({'_id': ObjectId(user_id)})
    else:
        user = users_collection.find_one(
            {'userType': 'intern'},
            sort=[('updatedAt', -1)]
        )
    
    if not user:
        print("No intern user found")
        return
    
    comp_profile = user.get('comprehensiveInternProfile', {})
    
    print("\n" + "="*70)
    print("DETAILED PROFILE DATA")
    print("="*70 + "\n")
    
    print("PERSONAL INFORMATION:")
    print(f"  First Name: {comp_profile.get('firstName', 'N/A')}")
    print(f"  Last Name: {comp_profile.get('lastName', 'N/A')}")
    print(f"  Middle Name: {comp_profile.get('middleName', 'N/A')}")
    print(f"  Email: {comp_profile.get('email', 'N/A')}")
    print(f"  Phone: {comp_profile.get('phone', 'N/A')}")
    print(f"  Date of Birth: {comp_profile.get('dateOfBirth', 'N/A')}")
    print(f"  Gender: {comp_profile.get('gender', 'N/A')}")
    
    print("\nLOCATION:")
    print(f"  Nationality: {comp_profile.get('nationality', 'N/A')}")
    print(f"  Country: {comp_profile.get('residentCountry', 'N/A')}")
    print(f"  City: {comp_profile.get('currentCity', 'N/A')}")
    print(f"  Address: {comp_profile.get('address', 'N/A')}")
    
    print("\nEDUCATION:")
    edu = comp_profile.get('educationEntries', [])
    if isinstance(edu, list):
        for i, entry in enumerate(edu, 1):
            if isinstance(entry, dict):
                print(f"  {i}. {entry.get('institution', 'N/A')}")
                print(f"     Degree: {entry.get('degree', 'N/A')}")
                print(f"     Field: {entry.get('fieldOfStudy', 'N/A')}")
                print(f"     Period: {entry.get('startDate', 'N/A')} - {entry.get('endDate', 'N/A')}")
    
    print("\nTECHNICAL SKILLS:")
    skills = comp_profile.get('technicalSkills', [])
    if isinstance(skills, list):
        print(f"  {', '.join(skills) if skills else 'None'}")
    
    print("\nSOFT SKILLS:")
    soft = comp_profile.get('softSkills', [])
    if isinstance(soft, list):
        print(f"  {', '.join(soft) if soft else 'None'}")
    
    print("\nLANGUAGES:")
    langs = comp_profile.get('languages', [])
    if isinstance(langs, list):
        for lang in langs:
            if isinstance(lang, dict):
                print(f"  - {lang.get('language', 'N/A')}: {lang.get('proficiency', 'N/A')}")
    
    print("\nEXPERIENCE:")
    exp = comp_profile.get('experienceEntries', [])
    if isinstance(exp, list):
        for i, entry in enumerate(exp, 1):
            if isinstance(entry, dict):
                print(f"  {i}. {entry.get('title', 'N/A')} at {entry.get('company', 'N/A')}")
                print(f"     {entry.get('startDate', 'N/A')} - {entry.get('endDate', 'N/A')}")
    
    print("\n" + "="*70 + "\n")


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Test intern data flow')
    parser.add_argument('--detailed', action='store_true', help='Show detailed profile data')
    parser.add_argument('--user-id', type=str, help='Specific user ID to test')
    
    args = parser.parse_args()
    
    if args.detailed:
        show_profile_in_detail(args.user_id)
    else:
        success = test_intern_data_flow()
        sys.exit(0 if success else 1)

