"""
Test What Frontend Will Actually See
=====================================
This simulates exactly what the My Profile page will display
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.db import get_db
from services.intern_service import InternService
import json

def test_frontend_display():
    print("\n" + "="*70)
    print("TESTING WHAT FRONTEND MY PROFILE PAGE WILL DISPLAY")
    print("="*70 + "\n")
    
    # Get the test user
    db = get_db()
    users_collection = db.users
    test_user = users_collection.find_one({'email': 'test.intern@aksharvault.com'})
    
    if not test_user:
        print("[ERROR] Test user not found!")
        return
    
    user_id = str(test_user['_id'])
    print(f"Testing user: {test_user.get('email')}")
    print(f"User ID: {user_id}\n")
    
    # Get data exactly as frontend would receive it
    intern_service = InternService()
    profile_data = intern_service.get_intern_profile(user_id)
    
    print("="*70)
    print("SECTION 1: PERSONAL INFORMATION")
    print("="*70)
    print(f"First Name: {profile_data.get('firstName') or '[BLANK]'}")
    print(f"Middle Name: {profile_data.get('middleName') or '[BLANK]'}")
    print(f"Last Name: {profile_data.get('lastName') or '[BLANK]'}")
    print(f"Email: {profile_data.get('email') or '[BLANK]'}")
    print(f"Phone: {profile_data.get('phone') or '[BLANK]'}")
    print(f"Alt Phone: {profile_data.get('altPhone') or '[BLANK]'}")
    print(f"Date of Birth: {profile_data.get('dateOfBirth') or '[BLANK]'}")
    print(f"Gender: {profile_data.get('gender') or '[BLANK]'}")
    
    print("\n" + "="*70)
    print("SECTION 2: NATIONALITY & RESIDENCY")
    print("="*70)
    print(f"Nationality: {profile_data.get('nationality') or '[BLANK]'}")
    print(f"Resident Country: {profile_data.get('residentCountry') or '[BLANK]'}")
    print(f"Current City: {profile_data.get('currentCity') or '[BLANK]'}")
    print(f"Postal Code: {profile_data.get('postalCode') or '[BLANK]'}")
    print(f"Address: {profile_data.get('address') or '[BLANK]'}")
    print(f"Valid Documents: {profile_data.get('validDocs') or '[BLANK]'}")
    
    print("\n" + "="*70)
    print("SECTION 3: PREFERRED LOCATIONS")
    print("="*70)
    print(f"Location 1: {profile_data.get('preferredLocation1') or '[BLANK]'}")
    print(f"Location 2: {profile_data.get('preferredLocation2') or '[BLANK]'}")
    print(f"Location 3: {profile_data.get('preferredLocation3') or '[BLANK]'}")
    print(f"Willing to Relocate: {profile_data.get('willingToRelocate') or '[BLANK]'}")
    print(f"Internship Mode: {profile_data.get('internshipMode') or '[BLANK]'}")
    
    print("\n" + "="*70)
    print("SECTION 4: EDUCATION")
    print("="*70)
    edu_entries = profile_data.get('educationEntries', [])
    if isinstance(edu_entries, list) and len(edu_entries) > 0:
        for i, entry in enumerate(edu_entries, 1):
            print(f"\nEducation Entry {i}:")
            print(f"  Institution: {entry.get('institution', '[BLANK]')}")
            print(f"  Degree: {entry.get('degree', '[BLANK]')}")
            print(f"  Field of Study: {entry.get('fieldOfStudy', '[BLANK]')}")
            print(f"  Start Date: {entry.get('startDate', '[BLANK]')}")
            print(f"  End Date: {entry.get('endDate', '[BLANK]')}")
            print(f"  GPA: {entry.get('gpa', '[BLANK]')}")
            print(f"  Currently Studying: {entry.get('currentlyStudying', '[BLANK]')}")
            print(f"  Coursework: {entry.get('relevantCoursework', '[BLANK]')[:50]}...")
    else:
        print("[NO ENTRIES]")
    
    print("\n" + "="*70)
    print("SECTION 5: INTERNSHIP OBJECTIVE")
    print("="*70)
    print(f"Academic Level: {profile_data.get('academicLevel') or '[BLANK]'}")
    print(f"Objective: {(profile_data.get('objective') or '[BLANK]')[:100]}...")
    print(f"Industry Interest: {profile_data.get('industryInterest') or '[BLANK]'}")
    print(f"Preferred Role: {profile_data.get('preferredRole') or '[BLANK]'}")
    
    print("\n" + "="*70)
    print("SECTION 6: EXPERIENCE")
    print("="*70)
    exp_entries = profile_data.get('experienceEntries', [])
    if isinstance(exp_entries, list) and len(exp_entries) > 0:
        for i, entry in enumerate(exp_entries, 1):
            print(f"\nExperience Entry {i}:")
            print(f"  Company: {entry.get('company', '[BLANK]')}")
            print(f"  Title: {entry.get('title', '[BLANK]')}")
            print(f"  Location: {entry.get('location', '[BLANK]')}")
            print(f"  Start Date: {entry.get('startDate', '[BLANK]')}")
            print(f"  End Date: {entry.get('endDate', '[BLANK]')}")
            print(f"  Description: {entry.get('description', '[BLANK]')[:80]}...")
    else:
        print("[NO ENTRIES]")
    
    print("\n" + "="*70)
    print("SECTION 7: SKILLS")
    print("="*70)
    tech_skills = profile_data.get('technicalSkills', [])
    soft_skills = profile_data.get('softSkills', [])
    
    if isinstance(tech_skills, list) and len(tech_skills) > 0:
        print(f"Technical Skills ({len(tech_skills)} items):")
        print(f"  {', '.join(tech_skills)}")
    else:
        print("Technical Skills: [NO SKILLS]")
    
    if isinstance(soft_skills, list) and len(soft_skills) > 0:
        print(f"\nSoft Skills ({len(soft_skills)} items):")
        print(f"  {', '.join(soft_skills)}")
    else:
        print("\nSoft Skills: [NO SKILLS]")
    
    print("\n" + "="*70)
    print("SECTION 8: LANGUAGES")
    print("="*70)
    languages = profile_data.get('languages', [])
    if isinstance(languages, list) and len(languages) > 0:
        for lang in languages:
            print(f"  - {lang.get('language', '[BLANK]')}: {lang.get('proficiency', '[BLANK]')}")
    else:
        print("[NO LANGUAGES]")
    
    print("\n" + "="*70)
    print("SECTION 9: PROJECTS")
    print("="*70)
    projects = profile_data.get('projectEntries', [])
    if isinstance(projects, list) and len(projects) > 0:
        for i, proj in enumerate(projects, 1):
            print(f"\nProject {i}:")
            print(f"  Title: {proj.get('title', '[BLANK]')}")
            print(f"  Technologies: {proj.get('technologies', '[BLANK]')}")
            print(f"  Role: {proj.get('role', '[BLANK]')}")
            print(f"  URL: {proj.get('url', '[BLANK]')}")
    else:
        print("[NO PROJECTS]")
    
    print("\n" + "="*70)
    print("SECTION 10: ACTIVITIES")
    print("="*70)
    activities = profile_data.get('activityEntries', [])
    if isinstance(activities, list) and len(activities) > 0:
        for i, activity in enumerate(activities, 1):
            print(f"\nActivity {i}:")
            print(f"  Name: {activity.get('name', '[BLANK]')}")
            print(f"  Role: {activity.get('role', '[BLANK]')}")
            print(f"  Organization: {activity.get('organization', '[BLANK]')}")
    else:
        print("[NO ACTIVITIES]")
    
    print("\n" + "="*70)
    print("SECTION 11: CERTIFICATIONS")
    print("="*70)
    certs = profile_data.get('certificationEntries', [])
    if isinstance(certs, list) and len(certs) > 0:
        for i, cert in enumerate(certs, 1):
            print(f"\nCertification {i}:")
            print(f"  Name: {cert.get('name', '[BLANK]')}")
            print(f"  Issuer: {cert.get('issuer', '[BLANK]')}")
            print(f"  Issue Date: {cert.get('issueDate', '[BLANK]')}")
    else:
        print("[NO CERTIFICATIONS]")
    
    print("\n" + "="*70)
    print("SECTION 12: REFERENCES")
    print("="*70)
    refs = profile_data.get('referenceEntries', [])
    if isinstance(refs, list) and len(refs) > 0:
        for i, ref in enumerate(refs, 1):
            print(f"\nReference {i}:")
            print(f"  Name: {ref.get('name', '[BLANK]')}")
            print(f"  Relationship: {ref.get('relationship', '[BLANK]')}")
            print(f"  Organization: {ref.get('organization', '[BLANK]')}")
            print(f"  Email: {ref.get('email', '[BLANK]')}")
    else:
        print("[NO REFERENCES]")
    
    print("\n" + "="*70)
    print("SECTION 13: ONLINE PRESENCE")
    print("="*70)
    links = profile_data.get('professionalLinks', [])
    if isinstance(links, list) and len(links) > 0:
        for link in links:
            print(f"  - {link.get('platform', '[BLANK]')}: {link.get('url', '[BLANK]')}")
    else:
        print("[NO LINKS]")
    
    print("\n" + "="*70)
    print("SECTION 14: INTERNSHIP PREFERENCES")
    print("="*70)
    print(f"Duration: {profile_data.get('internshipDuration') or '[BLANK]'}")
    print(f"Availability: {profile_data.get('availability') or '[BLANK]'}")
    print(f"Timing: {profile_data.get('internshipTiming') or '[BLANK]'}")
    print(f"Expected Stipend: ${profile_data.get('expectedStipend') or '[BLANK]'} {profile_data.get('currencyPreference', 'USD')}")
    print(f"Unpaid Willing: {profile_data.get('unpaidWilling') or '[BLANK]'}")
    print(f"Academic Credit: {profile_data.get('academicCredit') or '[BLANK]'}")
    
    print("\n" + "="*70)
    print("SECTION 15: ADDITIONAL INFORMATION")
    print("="*70)
    print(f"Hobbies: {(profile_data.get('hobbies') or '[BLANK]')[:80]}...")
    print(f"Why Internship: {(profile_data.get('whyInternship') or '[BLANK]')[:80]}...")
    print(f"Additional Comments: {(profile_data.get('additionalComments') or '[BLANK]')[:80]}...")
    
    print("\n" + "="*70)
    print("SUMMARY")
    print("="*70)
    
    # Count blank fields
    simple_fields = [
        'firstName', 'lastName', 'middleName', 'email', 'phone', 'altPhone',
        'dateOfBirth', 'gender', 'nationality', 'residentCountry', 'currentCity',
        'postalCode', 'address', 'validDocs', 'preferredLocation1', 'preferredLocation2',
        'preferredLocation3', 'willingToRelocate', 'internshipMode', 'academicLevel',
        'objective', 'industryInterest', 'preferredRole', 'internshipDuration',
        'availability', 'internshipTiming', 'expectedStipend', 'currencyPreference',
        'unpaidWilling', 'academicCredit', 'hobbies', 'whyInternship', 'additionalComments'
    ]
    
    blank_fields = [f for f in simple_fields if not profile_data.get(f)]
    filled_fields = len(simple_fields) - len(blank_fields)
    
    print(f"\nSimple Fields: {filled_fields}/{len(simple_fields)} filled")
    if blank_fields:
        print(f"Blank fields: {', '.join(blank_fields)}")
    
    # Count array fields
    array_fields = {
        'educationEntries': profile_data.get('educationEntries', []),
        'experienceEntries': profile_data.get('experienceEntries', []),
        'projectEntries': profile_data.get('projectEntries', []),
        'activityEntries': profile_data.get('activityEntries', []),
        'certificationEntries': profile_data.get('certificationEntries', []),
        'referenceEntries': profile_data.get('referenceEntries', []),
        'technicalSkills': profile_data.get('technicalSkills', []),
        'softSkills': profile_data.get('softSkills', []),
        'languages': profile_data.get('languages', []),
        'professionalLinks': profile_data.get('professionalLinks', [])
    }
    
    print(f"\nArray Fields:")
    for field, value in array_fields.items():
        count = len(value) if isinstance(value, list) else 0
        status = "OK" if count > 0 else "EMPTY"
        print(f"  [{status}] {field}: {count} items")
    
    print("\n" + "="*70)
    print("\nIf you're seeing blank fields on the My Profile page,")
    print("please tell me which specific fields are blank and I'll investigate!")
    print("\n" + "="*70 + "\n")

if __name__ == '__main__':
    test_frontend_display()

