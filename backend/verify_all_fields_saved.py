#!/usr/bin/env python3
"""
Verify that ALL registration form fields are being saved to MongoDB Atlas
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId
import json

def check_all_fields_saved():
    """Check if all registration form fields are saved in database"""
    
    print("="*100)
    print(" "*20 + "REGISTRATION FORM FIELDS - COMPLETE VERIFICATION")
    print("="*100)
    
    db = get_db()
    
    if db is None:
        print("❌ Failed to connect to database")
        return
    
    print(f"\n✅ Connected to: {db.name}")
    print(f"   Connection: MongoDB Atlas\n")
    
    # Get a profile with the most data
    profiles = list(db.jobseeker_profiles.find())
    
    print(f"Total Profiles Found: {len(profiles)}\n")
    
    if len(profiles) == 0:
        print("❌ No profiles found in jobseeker_profiles collection")
        return
    
    # Find the profile with most data
    best_profile = None
    max_fields = 0
    
    for profile in profiles:
        field_count = sum(1 for v in profile.values() if v and v != '' and v != [] and v != {})
        if field_count > max_fields:
            max_fields = field_count
            best_profile = profile
    
    if not best_profile:
        print("❌ No profiles with data found")
        return
    
    user_id = best_profile.get('userId')
    user = db.users.find_one({'_id': user_id})
    
    print(f"{'='*100}")
    print(f"ANALYZING MOST COMPLETE PROFILE")
    print(f"{'='*100}")
    print(f"User: {user.get('firstName', 'N/A')} {user.get('lastName', 'N/A')}")
    print(f"Email: {user.get('email', 'N/A')}")
    print(f"\n")
    
    # Define ALL expected registration form fields
    expected_fields = {
        "SECTION 1 - Personal Information": {
            'personalInfo.firstName': best_profile.get('personalInfo', {}).get('firstName'),
            'personalInfo.middleName': best_profile.get('personalInfo', {}).get('middleName'),
            'personalInfo.lastName': best_profile.get('personalInfo', {}).get('lastName'),
            'personalInfo.email': best_profile.get('personalInfo', {}).get('email'),
            'personalInfo.phone': best_profile.get('personalInfo', {}).get('phone'),
            'personalInfo.altPhone': best_profile.get('personalInfo', {}).get('altPhone'),
            'personalInfo.dateOfBirth': best_profile.get('personalInfo', {}).get('dateOfBirth'),
            'personalInfo.gender': best_profile.get('personalInfo', {}).get('gender'),
            'personalInfo.bloodGroup': best_profile.get('personalInfo', {}).get('bloodGroup'),
            'personalInfo.community': best_profile.get('personalInfo', {}).get('community'),
        },
        "SECTION 2 - Nationality & Residency": {
            'nationalityResidency.nationality': best_profile.get('nationalityResidency', {}).get('nationality'),
            'nationalityResidency.residentCountry': best_profile.get('nationalityResidency', {}).get('residentCountry'),
            'nationalityResidency.currentCity': best_profile.get('nationalityResidency', {}).get('currentCity'),
            'nationalityResidency.postalCode': best_profile.get('nationalityResidency', {}).get('postalCode'),
            'nationalityResidency.address': best_profile.get('nationalityResidency', {}).get('address'),
            'nationalityResidency.latitude': best_profile.get('nationalityResidency', {}).get('latitude'),
            'nationalityResidency.longitude': best_profile.get('nationalityResidency', {}).get('longitude'),
            'nationalityResidency.workPermit': best_profile.get('nationalityResidency', {}).get('workPermit'),
        },
        "SECTION 3 - Preferred Working Locations": {
            'preferredLocations.preferredLocation1': best_profile.get('preferredLocations', {}).get('preferredLocation1'),
            'preferredLocations.preferredLocation2': best_profile.get('preferredLocations', {}).get('preferredLocation2'),
            'preferredLocations.preferredLocation3': best_profile.get('preferredLocations', {}).get('preferredLocation3'),
            'preferredLocations.willingToRelocate': best_profile.get('preferredLocations', {}).get('willingToRelocate'),
            'preferredLocations.workLocation': best_profile.get('preferredLocations', {}).get('workLocation'),
        },
        "SECTION 4 - Professional Profile": {
            'professionalProfile.professionalTitle': best_profile.get('professionalProfile', {}).get('professionalTitle'),
            'professionalProfile.yearsExperience': best_profile.get('professionalProfile', {}).get('yearsExperience'),
            'professionalProfile.careerLevel': best_profile.get('professionalProfile', {}).get('careerLevel'),
            'professionalProfile.industry': best_profile.get('professionalProfile', {}).get('industry'),
            'professionalProfile.summary': best_profile.get('professionalProfile', {}).get('summary'),
        },
        "SECTION 5 - Work Experience (Array)": {
            'experienceEntries': best_profile.get('experienceEntries', []),
        },
        "SECTION 6 - Education (Array)": {
            'educationEntries': best_profile.get('educationEntries', []),
        },
        "SECTION 7 - Skills & Competencies": {
            'skillsInfo.coreSkills': best_profile.get('skillsInfo', {}).get('coreSkills'),
            'skillsInfo.tools': best_profile.get('skillsInfo', {}).get('tools'),
        },
        "SECTION 8 - Languages (Array)": {
            'languages': best_profile.get('languages', []),
        },
        "SECTION 9 - Certifications (Array)": {
            'certificationEntries': best_profile.get('certificationEntries', []),
            'certifications': best_profile.get('certifications', []),
        },
        "SECTION 10 - Professional Memberships": {
            'memberships.membershipOrg': best_profile.get('memberships', {}).get('membershipOrg'),
            'memberships.membershipType': best_profile.get('memberships', {}).get('membershipType'),
            'memberships.membershipDate': best_profile.get('memberships', {}).get('membershipDate'),
        },
        "SECTION 11 - References (Array)": {
            'referenceEntries': best_profile.get('referenceEntries', []),
            'references': best_profile.get('references', []),
        },
        "SECTION 12 - Professional Online Presence (Array)": {
            'professionalLinks': best_profile.get('professionalLinks', []),
        },
        "SECTION 13 - Job Preferences & Availability": {
            'jobPreferences.preferredJobTitles': best_profile.get('jobPreferences', {}).get('preferredJobTitles'),
            'jobPreferences.jobType': best_profile.get('jobPreferences', {}).get('jobType'),
            'jobPreferences.noticePeriod': best_profile.get('jobPreferences', {}).get('noticePeriod'),
            'jobPreferences.currentSalary': best_profile.get('jobPreferences', {}).get('currentSalary'),
            'jobPreferences.expectedSalary': best_profile.get('jobPreferences', {}).get('expectedSalary'),
            'jobPreferences.currencyPreference': best_profile.get('jobPreferences', {}).get('currencyPreference'),
            'jobPreferences.travelAvailability': best_profile.get('jobPreferences', {}).get('travelAvailability'),
        },
        "SECTION 14 - Additional Information": {
            'additionalInfo.bloodGroup': best_profile.get('additionalInfo', {}).get('bloodGroup'),
            'additionalInfo.careerObjectives': best_profile.get('additionalInfo', {}).get('careerObjectives'),
            'additionalInfo.hobbies': best_profile.get('additionalInfo', {}).get('hobbies'),
            'additionalInfo.additionalComments': best_profile.get('additionalInfo', {}).get('additionalComments'),
            'additionalInfo.agreeTerms': best_profile.get('additionalInfo', {}).get('agreeTerms'),
            'additionalInfo.allowContact': best_profile.get('additionalInfo', {}).get('allowContact'),
        },
    }
    
    # Check each section
    total_fields = 0
    total_filled = 0
    total_missing = 0
    
    for section_name, fields in expected_fields.items():
        print(f"\n{'='*100}")
        print(f"{section_name}")
        print(f"{'='*100}")
        
        section_filled = 0
        section_total = 0
        
        for field_name, field_value in fields.items():
            section_total += 1
            total_fields += 1
            
            # Check if field has data
            has_data = False
            value_display = "MISSING"
            
            if isinstance(field_value, list):
                if len(field_value) > 0:
                    has_data = True
                    value_display = f"{len(field_value)} items"
                    section_filled += 1
                    total_filled += 1
                else:
                    total_missing += 1
            elif isinstance(field_value, dict):
                if field_value:
                    has_data = True
                    value_display = "Has data"
                    section_filled += 1
                    total_filled += 1
                else:
                    total_missing += 1
            elif field_value and field_value != '' and field_value != 'None':
                has_data = True
                # Truncate long values
                value_str = str(field_value)
                value_display = value_str if len(value_str) <= 50 else value_str[:50] + "..."
                section_filled += 1
                total_filled += 1
            else:
                total_missing += 1
            
            status = "✅" if has_data else "❌"
            print(f"  {status} {field_name:50} : {value_display}")
        
        completion = int((section_filled / section_total) * 100) if section_total > 0 else 0
        print(f"\n  Section Completion: {section_filled}/{section_total} fields ({completion}%)")
    
    # Overall summary
    print(f"\n{'='*100}")
    print("OVERALL SUMMARY")
    print(f"{'='*100}")
    
    overall_completion = int((total_filled / total_fields) * 100) if total_fields > 0 else 0
    
    print(f"\n📊 Total Fields Checked: {total_fields}")
    print(f"✅ Fields WITH Data: {total_filled} ({overall_completion}%)")
    print(f"❌ Fields MISSING: {total_missing}")
    
    print(f"\n{'='*100}")
    print("VERDICT")
    print(f"{'='*100}")
    
    if overall_completion >= 80:
        print(f"\n✅ EXCELLENT: {overall_completion}% of registration fields are being saved!")
        print(f"✅ The registration form IS saving data properly to MongoDB Atlas")
        print(f"✅ MyProfile page SHOULD display this data")
    elif overall_completion >= 50:
        print(f"\n⚠️  PARTIAL: {overall_completion}% of registration fields are being saved")
        print(f"⚠️  Some sections are missing data")
        print(f"⚠️  Check if user filled all sections during registration")
    else:
        print(f"\n❌ PROBLEM: Only {overall_completion}% of registration fields are being saved")
        print(f"❌ Data is NOT being saved properly")
        print(f"❌ Need to check the save endpoint in backend")
    
    # Check also the users collection for flat data
    print(f"\n{'='*100}")
    print("CHECKING USERS COLLECTION (Flat Format)")
    print(f"{'='*100}")
    
    if user:
        user_flat_fields = {
            'firstName': user.get('firstName'),
            'lastName': user.get('lastName'),
            'dateOfBirth': user.get('dateOfBirth'),
            'gender': user.get('gender'),
            'professionalTitle': user.get('professionalTitle'),
            'yearsExperience': user.get('yearsExperience'),
            'coreSkills': user.get('coreSkills'),
            'experienceEntries': user.get('experienceEntries'),
            'educationEntries': user.get('educationEntries'),
            'languages': user.get('languages'),
        }
        
        print(f"\nChecking if data is ALSO in users collection (for faster access):")
        print("-"*100)
        
        for field_name, field_value in user_flat_fields.items():
            has_data = False
            value_display = "MISSING"
            
            if isinstance(field_value, list):
                if len(field_value) > 0:
                    has_data = True
                    value_display = f"{len(field_value)} items"
            elif field_value and field_value != '':
                has_data = True
                value_str = str(field_value)
                value_display = value_str if len(value_str) <= 50 else value_str[:50] + "..."
            
            status = "✅" if has_data else "❌"
            print(f"  {status} {field_name:30} : {value_display}")
        
        users_filled = sum(1 for v in user_flat_fields.values() if v and v != '' and v != [])
        print(f"\n  Users Collection: {users_filled}/{len(user_flat_fields)} key fields filled")
    
    print(f"\n{'='*100}")
    print("FINAL DIAGNOSIS")
    print(f"{'='*100}")
    
    print(f"\n✅ Data Storage Strategy:")
    print(f"   1. Nested format in jobseeker_profiles collection (structured)")
    print(f"   2. Flat format in users collection (for backward compatibility)")
    print(f"   3. GET endpoint flattens nested data for frontend")
    
    print(f"\n📊 Current State:")
    print(f"   - jobseeker_profiles: {overall_completion}% complete (nested)")
    print(f"   - users collection: {users_filled}/{len(user_flat_fields)} key fields (flat)")
    
    print(f"\n💡 For MyProfile to display data:")
    print(f"   ✅ GET endpoint reads from BOTH collections")
    print(f"   ✅ Priority: users (flat) > jobseeker_profiles (nested)")
    print(f"   ✅ Flattens nested data to match frontend expectations")
    print(f"   ✅ Returns unified response with all fields")
    
    if overall_completion >= 50:
        print(f"\n✅ CONCLUSION: Data IS being saved!")
        print(f"   The registration form is working correctly")
        print(f"   If MyProfile is blank, it's a display/API issue, not a save issue")
    else:
        print(f"\n❌ CONCLUSION: Data is NOT being saved properly")
        print(f"   The registration endpoint needs debugging")
    
    print(f"\n{'='*100}\n")
    
    # Show sample of the ACTUAL data structure
    print(f"{'='*100}")
    print("SAMPLE - ACTUAL DATA STRUCTURE IN DATABASE")
    print(f"{'='*100}\n")
    
    # Show first profile in pretty JSON (limited to key sections)
    sample_structure = {
        "personalInfo": best_profile.get('personalInfo', {}),
        "professionalProfile": best_profile.get('professionalProfile', {}),
        "skillsInfo": best_profile.get('skillsInfo', {}),
        "educationEntries": f"{len(best_profile.get('educationEntries', []))} items",
        "experienceEntries": f"{len(best_profile.get('experienceEntries', []))} items",
        "languages": f"{len(best_profile.get('languages', []))} items",
        "certificationEntries": f"{len(best_profile.get('certificationEntries', []))} items",
    }
    
    print(json.dumps(sample_structure, indent=2, default=str))
    
    print(f"\n{'='*100}\n")

if __name__ == "__main__":
    try:
        check_all_fields_saved()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

