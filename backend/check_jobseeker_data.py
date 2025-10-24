#!/usr/bin/env python3
"""
Script to check jobseeker data in both users and jobseeker_profiles collections
"""

import sys
import os
from datetime import datetime
import json

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId

def check_jobseeker_data():
    """Check jobseeker data in both collections"""
    
    print("🔍 Connecting to database...")
    db = get_db()
    
    if db is None:
        print("❌ Failed to connect to database!")
        return
    
    print(f"✅ Connected to database: {db.name}\n")
    
    users_collection = db.users
    jobseeker_profiles_collection = db.jobseeker_profiles
    
    # Get all job seekers from users collection
    print("="*100)
    print("CHECKING USERS COLLECTION")
    print("="*100)
    
    query = {"userType": "job_seeker"}
    job_seekers = list(users_collection.find(query))
    
    print(f"\n✅ Found {len(job_seekers)} job seeker(s) in users collection\n")
    
    for idx, js in enumerate(job_seekers, 1):
        print(f"\n{'-'*100}")
        print(f"USER {idx}: {js.get('firstName', '')} {js.get('lastName', '')} - {js.get('email', 'N/A')}")
        print(f"{'-'*100}")
        print(f"User ID: {js.get('_id')}")
        print(f"Profile Completed: {js.get('profileCompleted', False)}")
        print(f"Created At: {js.get('created_at', 'N/A')}")
        
        # Count how many fields are filled
        filled_fields = []
        for key, value in js.items():
            if key not in ['_id', 'password', 'created_at', 'updated_at', 'userType']:
                if value and value != '' and value != [] and value != {}:
                    filled_fields.append(key)
        
        print(f"\nFilled Fields ({len(filled_fields)}): {', '.join(filled_fields)}")
        
        # Show important registration fields
        print(f"\n📋 REGISTRATION DATA:")
        print(f"  First Name: {js.get('firstName', 'MISSING')}")
        print(f"  Last Name: {js.get('lastName', 'MISSING')}")
        print(f"  Email: {js.get('email', 'MISSING')}")
        print(f"  Phone: {js.get('phone', 'MISSING')}")
        print(f"  Date of Birth: {js.get('dateOfBirth', 'MISSING')}")
        print(f"  Gender: {js.get('gender', 'MISSING')}")
        print(f"  Blood Group: {js.get('bloodGroup', 'MISSING')}")
        print(f"  Nationality: {js.get('nationality', 'MISSING')}")
        print(f"  Current City: {js.get('currentCity', 'MISSING')}")
        print(f"  Professional Title: {js.get('professionalTitle', 'MISSING')}")
        print(f"  Years Experience: {js.get('yearsExperience', 'MISSING')}")
        print(f"  Core Skills: {js.get('coreSkills', 'MISSING')}")
        print(f"  Languages: {js.get('languages', 'MISSING')}")
        print(f"  Education Entries: {len(js.get('educationEntries', [])) if isinstance(js.get('educationEntries'), list) else 'MISSING'}")
        print(f"  Experience Entries: {len(js.get('experienceEntries', [])) if isinstance(js.get('experienceEntries'), list) else 'MISSING'}")
        
        # Check if profile exists in jobseeker_profiles collection
        print(f"\n🔍 Checking jobseeker_profiles collection...")
        profile = jobseeker_profiles_collection.find_one({'userId': js.get('_id')})
        
        if profile:
            print(f"✅ FOUND profile in jobseeker_profiles collection!")
            print(f"Profile ID: {profile.get('_id')}")
            print(f"Created At: {profile.get('createdAt', 'N/A')}")
            print(f"Updated At: {profile.get('updatedAt', 'N/A')}")
            
            # Count fields in profile
            profile_filled = []
            for key, value in profile.items():
                if key not in ['_id', 'userId', 'createdAt', 'updatedAt']:
                    if value and value != '' and value != [] and value != {}:
                        profile_filled.append(key)
            
            print(f"Profile has {len(profile_filled)} filled fields: {', '.join(profile_filled)}")
        else:
            print(f"❌ NO profile found in jobseeker_profiles collection!")
            print(f"⚠️  This means the registration data was NOT saved to jobseeker_profiles collection")
    
    # Summary
    print(f"\n{'='*100}")
    print("SUMMARY")
    print(f"{'='*100}")
    print(f"Total job seekers in users collection: {len(job_seekers)}")
    
    profiles_count = jobseeker_profiles_collection.count_documents({})
    print(f"Total profiles in jobseeker_profiles collection: {profiles_count}")
    
    if len(job_seekers) > profiles_count:
        print(f"\n⚠️  WARNING: {len(job_seekers) - profiles_count} job seeker(s) have no profile in jobseeker_profiles collection!")
        print(f"⚠️  This indicates the registration data is not being saved properly.")
    
    print(f"\n{'='*100}")
    print("DATABASE CONNECTION INFO")
    print(f"{'='*100}")
    print(f"Database Name: {db.name}")
    print(f"Collections: {', '.join(db.list_collection_names())}")

if __name__ == "__main__":
    try:
        check_jobseeker_data()
    except KeyboardInterrupt:
        print("\n\n⚠️  Operation cancelled by user")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

