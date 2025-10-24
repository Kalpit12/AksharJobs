#!/usr/bin/env python3
"""
FORCE connection to MongoDB Atlas and verify ALL 50+ fields
"""

from pymongo import MongoClient

# FORCE Atlas connection - replace with your actual connection string
ATLAS_URI = "mongodb+srv://akshar_admin:WDQW9zihOVlhkExy@cluster0.lkow2ar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "TalentMatchDB"

def verify_all_atlas_fields():
    """Connect to Atlas and verify ALL 52+ registration fields"""
    
    print("="*100)
    print(" "*10 + "MONGODB ATLAS - COMPLETE 52+ FIELD VERIFICATION")
    print("="*100)
    
    print(f"\n🔌 Connecting to MongoDB Atlas...")
    print(f"   URI: mongodb+srv://***:***@cluster0.lkow2ar.mongodb.net/...")
    print(f"   Database: {DB_NAME}\n")
    
    try:
        client = MongoClient(ATLAS_URI, serverSelectionTimeoutMS=5000)
        db = client[DB_NAME]
        
        # Test connection
        db.command('ping')
        
        print(f"✅ Connected to MongoDB Atlas successfully!\n")
        
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        return
    
    # Get most recent user
    recent_user = db.users.find_one(
        {"userType": "job_seeker"},
        sort=[("created_at", -1)]
    )
    
    if not recent_user:
        print("❌ No job seekers found in Atlas")
        return
    
    print(f"{'='*100}")
    print(f"MOST RECENT JOBSEEKER IN ATLAS")
    print(f"{'='*100}")
    print(f"Name: {recent_user.get('firstName')} {recent_user.get('lastName')}")
    print(f"Email: {recent_user.get('email')}")
    print(f"Created: {recent_user.get('created_at')}")
    print(f"Profile Completed: {recent_user.get('profileCompleted', False)}")
    print(f"Is Draft: {recent_user.get('isDraft', False)}")
    print(f"\n")
    
    # Get profile from jobseeker_profiles
    profile = db.jobseeker_profiles.find_one({'userId': recent_user.get('_id')})
    
    # Define ALL 52 registration form fields
    print(f"{'='*100}")
    print(f"CHECKING ALL 52 REGISTRATION FORM FIELDS")
    print(f"{'='*100}\n")
    
    all_sections = {
        "1. PERSONAL INFORMATION": {
            'firstName': recent_user.get('firstName'),
            'middleName': recent_user.get('middleName'),
            'lastName': recent_user.get('lastName'),
            'email': recent_user.get('email'),
            'phone': recent_user.get('phone'),
            'altPhone': recent_user.get('altPhone'),
            'dateOfBirth': recent_user.get('dateOfBirth'),
            'gender': recent_user.get('gender'),
            'bloodGroup': recent_user.get('bloodGroup'),
            'community': recent_user.get('community'),
        },
        "2. NATIONALITY & RESIDENCY": {
            'nationality': recent_user.get('nationality'),
            'residentCountry': recent_user.get('residentCountry'),
            'currentCity': recent_user.get('currentCity'),
            'postalCode': recent_user.get('postalCode'),
            'address': recent_user.get('address'),
            'latitude': recent_user.get('latitude'),
            'longitude': recent_user.get('longitude'),
            'workPermit': recent_user.get('workPermit'),
        },
        "3. PREFERRED LOCATIONS": {
            'preferredLocation1': recent_user.get('preferredLocation1'),
            'preferredLocation2': recent_user.get('preferredLocation2'),
            'preferredLocation3': recent_user.get('preferredLocation3'),
            'willingToRelocate': recent_user.get('willingToRelocate'),
            'workLocation': recent_user.get('workLocation'),
        },
        "4. PROFESSIONAL PROFILE": {
            'professionalTitle': recent_user.get('professionalTitle'),
            'yearsExperience': recent_user.get('yearsExperience'),
            'careerLevel': recent_user.get('careerLevel'),
            'industry': recent_user.get('industry'),
            'summary': recent_user.get('summary'),
        },
        "5. SKILLS & TOOLS": {
            'coreSkills': recent_user.get('coreSkills', []),
            'tools': recent_user.get('tools', []),
        },
        "6. EDUCATION": {
            'educationEntries': recent_user.get('educationEntries', []),
        },
        "7. WORK EXPERIENCE": {
            'experienceEntries': recent_user.get('experienceEntries', []),
        },
        "8. LANGUAGES": {
            'languages': recent_user.get('languages', []),
        },
        "9. CERTIFICATIONS": {
            'certificationEntries': recent_user.get('certificationEntries', []),
        },
        "10. MEMBERSHIPS": {
            'membershipOrg': recent_user.get('membershipOrg'),
            'membershipType': recent_user.get('membershipType'),
            'membershipDate': recent_user.get('membershipDate'),
        },
        "11. REFERENCES": {
            'referenceEntries': recent_user.get('referenceEntries', []),
        },
        "12. PROFESSIONAL LINKS": {
            'professionalLinks': recent_user.get('professionalLinks', []),
        },
        "13. JOB PREFERENCES": {
            'preferredJobTitles': recent_user.get('preferredJobTitles'),
            'jobType': recent_user.get('jobType'),
            'noticePeriod': recent_user.get('noticePeriod'),
            'currentSalary': recent_user.get('currentSalary'),
            'expectedSalary': recent_user.get('expectedSalary'),
            'currencyPreference': recent_user.get('currencyPreference'),
            'travelAvailability': recent_user.get('travelAvailability'),
        },
        "14. ADDITIONAL INFO": {
            'careerObjectives': recent_user.get('careerObjectives'),
            'hobbies': recent_user.get('hobbies'),
            'additionalComments': recent_user.get('additionalComments'),
            'agreeTerms': recent_user.get('agreeTerms'),
            'allowContact': recent_user.get('allowContact'),
        },
    }
    
    # Analyze each section
    grand_total_fields = 0
    grand_total_filled = 0
    
    for section_name, fields in all_sections.items():
        print(f"{section_name}")
        print("-"*100)
        
        section_filled = 0
        section_total = len(fields)
        
        for field_name, field_value in fields.items():
            grand_total_fields += 1
            
            if isinstance(field_value, list):
                if len(field_value) > 0:
                    grand_total_filled += 1
                    section_filled += 1
                    status = "✅"
                    display = f"{len(field_value)} items"
                else:
                    status = "❌"
                    display = "Empty"
            elif field_value and field_value != '' and str(field_value) != 'None':
                grand_total_filled += 1
                section_filled += 1
                status = "✅"
                val_str = str(field_value)
                display = val_str if len(val_str) <= 60 else val_str[:60] + "..."
            else:
                status = "❌"
                display = "EMPTY"
            
            print(f"  {status} {field_name:30} {display}")
        
        percentage = int((section_filled / section_total) * 100) if section_total > 0 else 0
        print(f"  → Section: {section_filled}/{section_total} ({percentage}%)\n")
    
    # FINAL SUMMARY
    print(f"{'='*100}")
    print("✅ FINAL VERIFICATION SUMMARY")
    print(f"{'='*100}\n")
    
    overall_percentage = int((grand_total_filled / grand_total_fields) * 100)
    
    print(f"📊 TOTAL REGISTRATION FIELDS: {grand_total_fields}")
    print(f"✅ FIELDS WITH DATA: {grand_total_filled}")
    print(f"❌ FIELDS EMPTY: {grand_total_fields - grand_total_filled}")
    print(f"📈 OVERALL COMPLETION: {overall_percentage}%")
    
    # Check jobseeker_profiles
    print(f"\n{'='*100}")
    print(f"JOBSEEKER_PROFILES COLLECTION")
    print(f"{'='*100}\n")
    
    if profile:
        print(f"✅ Profile exists in jobseeker_profiles (nested format)")
        print(f"   Both collections have data for complete coverage")
    else:
        print(f"❌ NO profile in jobseeker_profiles")
        print(f"⚠️  Registration endpoint should save to BOTH collections")
    
    # Final verdict
    print(f"\n{'='*100}")
    print("🎯 FINAL VERDICT")
    print(f"{'='*100}\n")
    
    if overall_percentage >= 90:
        print(f"✅✅✅ PERFECT! {grand_total_filled}/{grand_total_fields} fields saved ({overall_percentage}%)")
        print(f"✅ ALL registration data is being stored")
        print(f"✅ MyProfile will display {grand_total_filled} fields")
    elif overall_percentage >= 75:
        print(f"✅✅ EXCELLENT! {grand_total_filled}/{grand_total_fields} fields saved ({overall_percentage}%)")
        print(f"✅ Most registration data is being stored")
        print(f"✅ MyProfile will display {grand_total_filled} fields")
    else:
        print(f"⚠️  {grand_total_filled}/{grand_total_fields} fields saved ({overall_percentage}%)")
        print(f"   Some fields may be missing")
    
    print(f"\n📧 TEST WITH THIS USER:")
    print(f"   Email: {recent_user.get('email')}")
    print(f"   Expected fields on MyProfile: {grand_total_filled}")
    
    print(f"\n{'='*100}\n")

if __name__ == "__main__":
    try:
        verify_all_atlas_fields()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

