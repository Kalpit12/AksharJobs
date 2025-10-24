#!/usr/bin/env python3
"""
Check users with COMPLETE data in MongoDB Atlas
"""

from pymongo import MongoClient

# Force Atlas connection
ATLAS_URI = "mongodb+srv://akshar_admin:WDQW9zihOVlhkExy@cluster0.lkow2ar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "TalentMatchDB"

def check_complete_users():
    """Find users with complete registration data in Atlas"""
    
    print("="*100)
    print(" "*20 + "FINDING USERS WITH COMPLETE DATA IN ATLAS")
    print("="*100)
    
    client = MongoClient(ATLAS_URI)
    db = client[DB_NAME]
    
    print(f"\n✅ Connected to MongoDB Atlas: {DB_NAME}\n")
    
    # Find users with data in jobseeker_profiles
    profiles = list(db.jobseeker_profiles.find().sort("createdAt", -1).limit(10))
    
    print(f"{'='*100}")
    print(f"USERS WITH PROFILES IN JOBSEEKER_PROFILES COLLECTION")
    print(f"{'='*100}\n")
    
    print(f"Found {len(profiles)} profiles\n")
    
    for idx, profile in enumerate(profiles, 1):
        user_id = profile.get('userId')
        user = db.users.find_one({'_id': user_id})
        
        if not user:
            print(f"{idx}. ❌ Orphaned profile (no user)")
            continue
        
        # Check data in BOTH collections
        print(f"{idx}. {user.get('firstName', 'N/A')} {user.get('lastName', 'N/A')}")
        print(f"   Email: {user.get('email')}")
        print(f"   User ID: {user_id}")
        
        # Count fields in users collection
        users_fields = [
            user.get('dateOfBirth'), user.get('gender'), user.get('professionalTitle'),
            user.get('yearsExperience'), user.get('nationality'), user.get('currentCity'),
            user.get('coreSkills'), user.get('educationEntries'), user.get('experienceEntries')
        ]
        users_filled = sum(1 for f in users_fields if f and f != '' and f != [])
        
        # Count fields in profile
        profile_sections = [
            profile.get('personalInfo', {}),
            profile.get('professionalProfile', {}),
            profile.get('nationalityResidency', {}),
            profile.get('skillsInfo', {}),
        ]
        
        profile_filled = 0
        for section in profile_sections:
            if isinstance(section, dict):
                profile_filled += sum(1 for v in section.values() if v and v != '')
        
        # Count arrays
        arrays = ['educationEntries', 'experienceEntries', 'languages', 'certificationEntries']
        for arr_name in arrays:
            arr_value = profile.get(arr_name, [])
            if isinstance(arr_value, list) and len(arr_value) > 0:
                profile_filled += 1
        
        print(f"   📊 users collection: {users_filled}/9 key fields")
        print(f"   📊 jobseeker_profiles: {profile_filled} fields/arrays with data")
        
        total_score = users_filled + profile_filled
        
        if total_score >= 15:
            print(f"   ✅ COMPLETE ({total_score} data points)\n")
        elif total_score >= 8:
            print(f"   ⚠️  PARTIAL ({total_score} data points)\n")
        else:
            print(f"   ❌ INCOMPLETE ({total_score} data points)\n")
    
    # Find the BEST user for testing
    print(f"\n{'='*100}")
    print(f"RECOMMENDATION FOR TESTING")
    print(f"{'='*100}\n")
    
    best_profile = None
    best_score = 0
    best_user = None
    
    for profile in profiles:
        user_id = profile.get('userId')
        user = db.users.find_one({'_id': user_id})
        
        if not user:
            continue
        
        # Calculate score
        users_fields = [user.get('dateOfBirth'), user.get('gender'), user.get('professionalTitle'),
                       user.get('yearsExperience'), user.get('nationality'), user.get('currentCity'),
                       user.get('coreSkills'), user.get('educationEntries'), user.get('experienceEntries')]
        users_filled = sum(1 for f in users_fields if f and f != '' and f != [])
        
        profile_sections = [profile.get('personalInfo', {}), profile.get('professionalProfile', {}),
                           profile.get('nationalityResidency', {}), profile.get('skillsInfo', {})]
        profile_filled = sum(sum(1 for v in s.values() if v and v != '') for s in profile_sections if isinstance(s, dict))
        
        score = users_filled + profile_filled
        
        if score > best_score:
            best_score = score
            best_profile = profile
            best_user = user
    
    if best_user:
        print(f"✅ BEST USER FOR TESTING:")
        print(f"   Name: {best_user.get('firstName')} {best_user.get('lastName')}")
        print(f"   Email: {best_user.get('email')}")
        print(f"   Data completeness score: {best_score}")
        print(f"\n🎯 TO TEST MYPROFILE:")
        print(f"   1. Login with: {best_user.get('email')}")
        print(f"   2. Go to MyProfile page")
        print(f"   3. Check if data displays")
    
    print(f"\n{'='*100}\n")

if __name__ == "__main__":
    try:
        check_complete_users()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

