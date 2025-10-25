#!/usr/bin/env python3
"""
Verify that frontend and backend data formats match for intern profiles
"""

from pymongo import MongoClient
from bson import ObjectId
import json

def verify_data_formats():
    """Compare expected vs actual data formats"""
    
    client = MongoClient('mongodb://localhost:27017/')
    db = client['TalentMatchDB']
    
    print("INTERN PROFILE DATA FORMAT VERIFICATION")
    print("=" * 70)
    
    # Expected structure from frontend
    expected_structure = {
        'simple_fields': [
            'firstName', 'middleName', 'lastName', 'email', 'phone', 'altPhone',
            'dateOfBirth', 'gender', 'nationality', 'residentCountry', 'currentCity',
            'postalCode', 'address', 'validDocs', 'preferredLocation1', 'preferredLocation2',
            'preferredLocation3', 'willingToRelocate', 'internshipMode', 'academicLevel',
            'objective', 'industryInterest', 'preferredRole', 'internshipDuration',
            'availability', 'internshipTiming', 'expectedStipend', 'currencyPreference',
            'unpaidWilling', 'academicCredit', 'hobbies', 'whyInternship', 'additionalComments'
        ],
        'array_fields': [
            'educationEntries', 'experienceEntries', 'projectEntries', 'activityEntries',
            'certificationEntries', 'referenceEntries', 'technicalSkills', 'softSkills',
            'languages', 'careerInterests', 'professionalLinks'
        ],
        'boolean_fields': [
            'agreeTerms', 'allowContact', 'accurateInfo', 'profileCompleted', 'isDraft'
        ]
    }
    
    print("\n1. Expected Field Categories:")
    print(f"   Simple Fields: {len(expected_structure['simple_fields'])}")
    print(f"   Array Fields: {len(expected_structure['array_fields'])}")
    print(f"   Boolean Fields: {len(expected_structure['boolean_fields'])}")
    print(f"   TOTAL: {len(expected_structure['simple_fields']) + len(expected_structure['array_fields']) + len(expected_structure['boolean_fields'])} fields")
    
    # Check database for actual structure
    intern = db.users.find_one({'userType': 'intern', 'comprehensiveInternProfile': {'$exists': True}})
    
    if intern:
        print("\n2. Actual Profile Structure Found:")
        comp_profile = intern.get('comprehensiveInternProfile', {})
        
        actual_simple = [f for f in expected_structure['simple_fields'] if f in comp_profile]
        actual_arrays = [f for f in expected_structure['array_fields'] if f in comp_profile]
        actual_bools = [f for f in expected_structure['boolean_fields'] if f in comp_profile]
        
        print(f"   Simple Fields Present: {len(actual_simple)}/{len(expected_structure['simple_fields'])}")
        print(f"   Array Fields Present: {len(actual_arrays)}/{len(expected_structure['array_fields'])}")
        print(f"   Boolean Fields Present: {len(actual_bools)}/{len(expected_structure['boolean_fields'])}")
        
        # Check array field types
        print("\n3. Array Field Type Verification:")
        for field in expected_structure['array_fields']:
            if field in comp_profile:
                value = comp_profile[field]
                is_array = isinstance(value, list)
                print(f"   {field}: {'Array' if is_array else 'NOT ARRAY - ' + str(type(value))}")
    else:
        print("\n2. No comprehensive profiles found yet - Cannot verify actual structure")
        print("   This is normal if no one has filled the new registration form yet.")
    
    print("\n4. Frontend -> Backend Data Flow:")
    print("   Registration Form sends:")
    print("   - Content-Type: multipart/form-data (includes profilePhoto file)")
    print("   - Arrays: JSON.stringify() before sending")
    print("   - Simple fields: Direct string values")
    print("   - Dates: YYYY-MM-DD format")
    
    print("\n5. Backend -> Frontend Data Flow:")
    print("   My Profile page expects:")
    print("   - Content-Type: application/json")
    print("   - Arrays: Already parsed as JavaScript arrays")
    print("   - Simple fields: String values")
    print("   - Dates: YYYY-MM-DD format")
    
    print("\n6. Backend Processing:")
    print("   - Receives FormData, parses JSON strings to arrays")
    print("   - Stores in comprehensiveInternProfile object")
    print("   - Returns parsed data (arrays, not strings)")
    
    print("\n" + "=" * 70)
    print("FORMAT VERIFICATION COMPLETE")
    print("=" * 70)
    
    print("\nRECOMMENDATION:")
    print("To fully test the data flow:")
    print("1. Fill out the intern registration form as an intern user")
    print("2. Submit or save as draft")
    print("3. Navigate to /intern-profile")
    print("4. Verify all data displays correctly")
    print("5. Run this script again to see actual data structure")

if __name__ == "__main__":
    verify_data_formats()

