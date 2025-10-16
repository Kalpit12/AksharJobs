"""Check current Dhruv's profile with correct user ID"""
from utils.db import get_db
from bson import ObjectId
from pprint import pprint

db = get_db()

# Current user ID from the test
current_user_id = "68f141d9f1dbebc76316e2c9"
user_object_id = ObjectId(current_user_id)

print("="*80)
print("CHECKING CURRENT DHRUV PATEL'S PROFILE")
print("="*80)
print(f"User ID: {current_user_id}")

# Check users collection
users_collection = db.users
user = users_collection.find_one({'_id': user_object_id})

if user:
    print("\n✅ User found in 'users' collection:")
    print(f"  Email: {user.get('email')}")
    print(f"  Name: {user.get('firstName')} {user.get('middleName', '')} {user.get('lastName')}")
    print(f"  Phone: {user.get('phone')}")
    print(f"  User Type: {user.get('userType')}")
    print(f"  Profile Completed: {user.get('profileCompleted')}")
else:
    print("\n❌ User NOT found in 'users' collection")

# Check jobseeker_profiles collection
jobseeker_profiles = db.jobseeker_profiles
profile = jobseeker_profiles.find_one({'userId': user_object_id})

print("\n" + "="*80)
if profile:
    print("✅ Profile found in 'jobseeker_profiles' collection!")
    print("="*80)
    
    # Show key fields
    print("\n📋 Key Profile Data:")
    print(f"  First Name: {profile.get('personalInfo', {}).get('firstName')}")
    print(f"  Last Name: {profile.get('personalInfo', {}).get('lastName')}")
    print(f"  Email: {profile.get('personalInfo', {}).get('email')}")
    print(f"  Phone: {profile.get('personalInfo', {}).get('phone')}")
    print(f"  Professional Title: {profile.get('professionalProfile', {}).get('professionalTitle')}")
    print(f"  Years Experience: {profile.get('professionalProfile', {}).get('yearsExperience')}")
    print(f"  Core Skills: {profile.get('skillsInfo', {}).get('coreSkills', [])}")
    print(f"  Experience Entries: {len(profile.get('experienceEntries', []))}")
    print(f"  Education Entries: {len(profile.get('educationEntries', []))}")
    
    # Count non-empty fields
    non_empty = 0
    total_fields = 0
    
    # Check personal info
    personal_info = profile.get('personalInfo', {})
    for key, value in personal_info.items():
        total_fields += 1
        if value not in [None, '', []]:
            non_empty += 1
            print(f"  ✓ {key}: {value}")
        else:
            print(f"  ✗ {key}: {value}")
    
    print(f"\n📊 Personal Info: {non_empty}/{total_fields} fields filled")
    
else:
    print("❌ Profile NOT found in 'jobseeker_profiles' collection")
    print("="*80)
    
    # Check how many profiles exist for this user
    total_profiles = jobseeker_profiles.count_documents({'userId': user_object_id})
    print(f"\nTotal profiles for this user: {total_profiles}")
    
    # Show all profiles for this user
    all_profiles = list(jobseeker_profiles.find({'userId': user_object_id}))
    for i, p in enumerate(all_profiles):
        print(f"\nProfile {i+1}:")
        print(f"  Created: {p.get('createdAt')}")
        print(f"  First Name: {p.get('personalInfo', {}).get('firstName')}")
        print(f"  Last Name: {p.get('personalInfo', {}).get('lastName')}")
