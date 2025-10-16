"""Check Dhruv Patel's profile in jobseeker_profiles collection"""
from utils.db import get_db
from bson import ObjectId
from pprint import pprint

db = get_db()

# Dhruv's user ID from test
user_id = "68ed5e58ce67fe5e28e1b2cf"
user_object_id = ObjectId(user_id)

print("="*80)
print("CHECKING DHRUV PATEL'S PROFILE")
print("="*80)

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
    
    # Show all fields
    print("\n📋 Profile Fields:")
    pprint(dict(profile), width=120)
    
    # Count non-empty fields
    non_empty = sum(1 for k, v in profile.items() if v not in [None, '', [], {}] and k != '_id')
    total_fields = len(profile) - 1  # Exclude _id
    
    print(f"\n📊 Field Statistics:")
    print(f"  Total fields: {len(profile)}")
    print(f"  Non-empty fields: {non_empty}")
    print(f"  Empty fields: {total_fields - non_empty}")
    print(f"  Completion: {(non_empty / total_fields * 100) if total_fields > 0 else 0:.1f}%")
    
else:
    print("❌ Profile NOT found in 'jobseeker_profiles' collection")
    print("="*80)
    
    # Check how many profiles exist
    total_profiles = jobseeker_profiles.count_documents({})
    print(f"\nTotal profiles in collection: {total_profiles}")
    
    if total_profiles > 0:
        print("\nShowing first 3 profiles:")
        for p in jobseeker_profiles.find().limit(3):
            print(f"  - UserId: {p.get('userId')}, Email: {p.get('email', 'N/A')}")

