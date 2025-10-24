#!/usr/bin/env python3
"""
Verify ALL 52+ fields for TestFlow User (the complete registration)
"""

from pymongo import MongoClient
import json

# Force Atlas connection
ATLAS_URI = "mongodb+srv://akshar_admin:WDQW9zihOVlhkExy@cluster0.lkow2ar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "TalentMatchDB"

def verify_testflow_complete():
    """Check TestFlow User who has complete registration"""
    
    print("="*100)
    print(" "*10 + "COMPLETE 52-FIELD VERIFICATION - TestFlow User")
    print("="*100)
    
    client = MongoClient(ATLAS_URI)
    db = client[DB_NAME]
    
    # Get TestFlow user
    user = db.users.find_one({'email': 'testflow.1761305656@example.com'})
    
    if not user:
        print("❌ TestFlow user not found")
        return
    
    profile = db.jobseeker_profiles.find_one({'userId': user.get('_id')})
    
    print(f"\n👤 User: TestFlow User")
    print(f"📧 Email: testflow.1761305656@example.com")
    print(f"🆔 User ID: {user.get('_id')}")
    print(f"✅ Profile Completed: {user.get('profileCompleted')}")
    print(f"📝 Is Draft: {user.get('isDraft', False)}")
    print(f"\n")
    
    # ALL 52+ REGISTRATION FORM FIELDS
    all_fields = {
        "SECTION 1: PERSONAL INFORMATION (10)": [
            ('firstName', user.get('firstName'), 'users'),
            ('middleName', user.get('middleName'), 'users'),
            ('lastName', user.get('lastName'), 'users'),
            ('email', user.get('email'), 'users'),
            ('phone', user.get('phone'), 'users'),
            ('altPhone', user.get('altPhone'), 'users'),
            ('dateOfBirth', user.get('dateOfBirth'), 'users'),
            ('gender', user.get('gender'), 'users'),
            ('bloodGroup', user.get('bloodGroup'), 'users'),
            ('community', user.get('community'), 'users'),
        ],
        "SECTION 2: NATIONALITY & RESIDENCY (8)": [
            ('nationality', user.get('nationality'), 'users'),
            ('residentCountry', user.get('residentCountry'), 'users'),
            ('currentCity', user.get('currentCity'), 'users'),
            ('postalCode', user.get('postalCode'), 'users'),
            ('address', user.get('address'), 'users'),
            ('latitude', user.get('latitude'), 'users'),
            ('longitude', user.get('longitude'), 'users'),
            ('workPermit', user.get('workPermit'), 'users'),
        ],
        "SECTION 3: PREFERRED LOCATIONS (5)": [
            ('preferredLocation1', user.get('preferredLocation1'), 'users'),
            ('preferredLocation2', user.get('preferredLocation2'), 'users'),
            ('preferredLocation3', user.get('preferredLocation3'), 'users'),
            ('willingToRelocate', user.get('willingToRelocate'), 'users'),
            ('workLocation', user.get('workLocation'), 'users'),
        ],
        "SECTION 4: PROFESSIONAL PROFILE (5)": [
            ('professionalTitle', user.get('professionalTitle'), 'users'),
            ('yearsExperience', user.get('yearsExperience'), 'users'),
            ('careerLevel', user.get('careerLevel'), 'users'),
            ('industry', user.get('industry'), 'users'),
            ('summary', user.get('summary'), 'users'),
        ],
        "SECTION 5: SKILLS & TOOLS (2)": [
            ('coreSkills', user.get('coreSkills', []), 'users'),
            ('tools', user.get('tools', []), 'users'),
        ],
        "SECTION 6: EDUCATION (1)": [
            ('educationEntries', user.get('educationEntries', []), 'users'),
        ],
        "SECTION 7: WORK EXPERIENCE (1)": [
            ('experienceEntries', user.get('experienceEntries', []), 'users'),
        ],
        "SECTION 8: LANGUAGES (1)": [
            ('languages', user.get('languages', []), 'users'),
        ],
        "SECTION 9: CERTIFICATIONS (1)": [
            ('certificationEntries', user.get('certificationEntries', []), 'users'),
        ],
        "SECTION 10: MEMBERSHIPS (3)": [
            ('membershipOrg', user.get('membershipOrg'), 'users'),
            ('membershipType', user.get('membershipType'), 'users'),
            ('membershipDate', user.get('membershipDate'), 'users'),
        ],
        "SECTION 11: REFERENCES (1)": [
            ('referenceEntries', user.get('referenceEntries', []), 'users'),
        ],
        "SECTION 12: PROFESSIONAL LINKS (1)": [
            ('professionalLinks', user.get('professionalLinks', []), 'users'),
        ],
        "SECTION 13: JOB PREFERENCES (7)": [
            ('preferredJobTitles', user.get('preferredJobTitles'), 'users'),
            ('jobType', user.get('jobType'), 'users'),
            ('noticePeriod', user.get('noticePeriod'), 'users'),
            ('currentSalary', user.get('currentSalary'), 'users'),
            ('expectedSalary', user.get('expectedSalary'), 'users'),
            ('currencyPreference', user.get('currencyPreference'), 'users'),
            ('travelAvailability', user.get('travelAvailability'), 'users'),
        ],
        "SECTION 14: ADDITIONAL INFO (6)": [
            ('careerObjectives', user.get('careerObjectives'), 'users'),
            ('hobbies', user.get('hobbies'), 'users'),
            ('additionalComments', user.get('additionalComments'), 'users'),
            ('agreeTerms', user.get('agreeTerms'), 'users'),
            ('allowContact', user.get('allowContact'), 'users'),
            ('profilePhotoPath', user.get('profilePhotoPath'), 'users'),
        ],
    }
    
    total_count = 0
    filled_count = 0
    
    for section_name, fields in all_fields.items():
        print(f"{section_name}")
        print("-"*100)
        
        section_filled = 0
        
        for field_name, field_value, source in fields:
            total_count += 1
            
            if isinstance(field_value, list):
                if len(field_value) > 0:
                    filled_count += 1
                    section_filled += 1
                    print(f"  ✅ {field_name:35} : {len(field_value)} items (from {source})")
                else:
                    print(f"  ❌ {field_name:35} : Empty")
            elif field_value and field_value != '' and str(field_value) != 'None':
                filled_count += 1
                section_filled += 1
                val_str = str(field_value)
                display = val_str if len(val_str) <= 55 else val_str[:55] + "..."
                print(f"  ✅ {field_name:35} : {display}")
            else:
                print(f"  ❌ {field_name:35} : MISSING")
        
        print(f"  → {section_filled}/{len(fields)} fields\n")
    
    # SUMMARY
    print(f"{'='*100}")
    print("🎉 FINAL VERIFICATION - ALL 52+ FIELDS")
    print(f"{'='*100}\n")
    
    percentage = int((filled_count / total_count) * 100)
    
    print(f"📊 TOTAL REGISTRATION FIELDS: {total_count}")
    print(f"✅ FIELDS WITH DATA: {filled_count}")
    print(f"❌ FIELDS EMPTY/MISSING: {total_count - filled_count}")
    print(f"📈 COMPLETION PERCENTAGE: {percentage}%")
    
    print(f"\n{'='*100}")
    print("✅ DATA STORAGE VERIFICATION")
    print(f"{'='*100}\n")
    
    print(f"Storage Location 1 - users collection:")
    print(f"   ✅ Has {filled_count} fields saved (flat format)")
    print(f"   ✅ Direct access for MyProfile page")
    
    print(f"\nStorage Location 2 - jobseeker_profiles collection:")
    if profile:
        print(f"   ✅ Has structured nested data")
        print(f"   ✅ Backup/alternative data source")
    else:
        print(f"   ⚠️  No profile (all data in users collection)")
    
    print(f"\n{'='*100}")
    print("🎯 MYPROFILE DISPLAY PREDICTION")
    print(f"{'='*100}\n")
    
    if percentage >= 90:
        print(f"✅✅✅ PERFECT! MyProfile will show {filled_count} fields!")
        print(f"✅ All sections will be populated")
        print(f"✅ Progress bar will show ~{percentage}%")
    elif percentage >= 75:
        print(f"✅✅ EXCELLENT! MyProfile will show {filled_count} fields!")
        print(f"✅ Most sections will be populated")
    elif percentage >= 50:
        print(f"✅ GOOD! MyProfile will show {filled_count} fields")
        print(f"⚠️  Some sections may be incomplete")
    else:
        print(f"⚠️  Only {filled_count} fields will display")
        print(f"❌ Many sections will be empty")
    
    print(f"\n📧 LOGIN CREDENTIALS:")
    print(f"   Email: testflow.1761305656@example.com")
    print(f"   Password: TestPassword123!")
    
    print(f"\n🎯 TESTING STEPS:")
    print(f"   1. Go to: http://localhost:3003")
    print(f"   2. Login with credentials above")
    print(f"   3. Navigate to MyProfile page")
    print(f"   4. You should see {filled_count}/{total_count} fields displayed!")
    print(f"   5. Progress bar should show ~{percentage}%")
    
    print(f"\n{'='*100}\n")

if __name__ == "__main__":
    try:
        verify_testflow_complete()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

