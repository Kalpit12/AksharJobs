#!/usr/bin/env python3
"""
Check which MongoDB you're connected to and what data exists
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId
import json

def check_connection():
    """Check MongoDB connection and display info"""
    
    print("="*100)
    print(" "*35 + "MONGODB CONNECTION CHECK")
    print("="*100)
    
    # Check environment variables
    print("\n📋 ENVIRONMENT VARIABLES:")
    print("-"*100)
    
    from dotenv import load_dotenv
    load_dotenv('.env.production')
    load_dotenv('.env.local')
    load_dotenv('.env')
    
    mongo_uri = os.getenv("MONGO_URI", "NOT SET")
    db_name = os.getenv("DB_NAME", "NOT SET")
    
    # Mask sensitive parts of URI
    if mongo_uri and mongo_uri != "NOT SET":
        if "mongodb+srv://" in mongo_uri:
            # Atlas connection
            parts = mongo_uri.split("@")
            if len(parts) > 1:
                masked_uri = f"mongodb+srv://***:***@{parts[1][:50]}..."
            else:
                masked_uri = mongo_uri[:50] + "..."
            print(f"  MONGO_URI: {masked_uri}")
            print(f"  ⚠️  CONNECTION TYPE: MongoDB Atlas (Cloud)")
        elif "localhost" in mongo_uri or "127.0.0.1" in mongo_uri:
            print(f"  MONGO_URI: {mongo_uri}")
            print(f"  ⚠️  CONNECTION TYPE: Local MongoDB")
        else:
            print(f"  MONGO_URI: {mongo_uri[:50]}...")
    else:
        print(f"  MONGO_URI: {mongo_uri}")
        print(f"  ❌ NOT SET - Using default")
    
    print(f"  DB_NAME: {db_name}")
    
    # Connect to database
    print(f"\n🔌 CONNECTING...")
    print("-"*100)
    
    db = get_db()
    
    if db is None:
        print("❌ FAILED to connect to MongoDB!")
        return
    
    print(f"✅ Connected successfully!")
    print(f"   Database Name: {db.name}")
    
    # List collections
    collections = db.list_collection_names()
    print(f"   Collections: {len(collections)}")
    
    # Check users and jobseeker_profiles
    print(f"\n📊 DATABASE CONTENTS:")
    print("-"*100)
    
    users_count = db.users.count_documents({})
    job_seekers_count = db.users.count_documents({"userType": "job_seeker"})
    profiles_count = db.jobseeker_profiles.count_documents({})
    
    print(f"  Total Users: {users_count}")
    print(f"  Job Seekers: {job_seekers_count}")
    print(f"  Jobseeker Profiles: {profiles_count}")
    
    # Show sample job seekers
    print(f"\n👥 SAMPLE JOB SEEKERS:")
    print("-"*100)
    
    job_seekers = list(db.users.find({"userType": "job_seeker"}).limit(5))
    
    for idx, js in enumerate(job_seekers, 1):
        print(f"\n  {idx}. {js.get('firstName', 'N/A')} {js.get('lastName', 'N/A')}")
        print(f"     Email: {js.get('email', 'N/A')}")
        print(f"     User ID: {js.get('_id')}")
        print(f"     Has dateOfBirth in users: {'✅' if js.get('dateOfBirth') else '❌'}")
        print(f"     Profile Completed: {js.get('profileCompleted', False)}")
        
        # Check if profile exists
        profile = db.jobseeker_profiles.find_one({'userId': js.get('_id')})
        print(f"     Has profile in jobseeker_profiles: {'✅' if profile else '❌'}")
        
        if profile:
            # Check nested data
            personal = profile.get('personalInfo', {})
            print(f"     personalInfo.firstName: {personal.get('firstName', 'MISSING')}")
            print(f"     personalInfo.dateOfBirth: {personal.get('dateOfBirth', 'MISSING')}")
    
    # Check for the specific user from MongoDB data
    print(f"\n{'='*100}")
    print(f"🔍 LOOKING FOR SPECIFIC USER FROM PROVIDED DATA")
    print(f"{'='*100}")
    
    specific_user_id = "68fb3df04af9bd505d396e5e"
    specific_profile_id = "68fb3dfc86164518403f3fc2"
    
    print(f"\n  User ID: {specific_user_id}")
    print(f"  Profile ID: {specific_profile_id}")
    
    try:
        user_oid = ObjectId(specific_user_id)
        profile_oid = ObjectId(specific_profile_id)
        
        user = db.users.find_one({'_id': user_oid})
        profile_by_user_id = db.jobseeker_profiles.find_one({'userId': user_oid})
        profile_by_id = db.jobseeker_profiles.find_one({'_id': profile_oid})
        
        print(f"\n  In users collection: {'✅ FOUND' if user else '❌ NOT FOUND'}")
        print(f"  In jobseeker_profiles (by userId): {'✅ FOUND' if profile_by_user_id else '❌ NOT FOUND'}")
        print(f"  In jobseeker_profiles (by _id): {'✅ FOUND' if profile_by_id else '❌ NOT FOUND'}")
        
        if not user and not profile_by_user_id and not profile_by_id:
            print(f"\n  ⚠️  WARNING: This user/profile doesn't exist in your current database!")
            print(f"  ⚠️  This suggests you're looking at data from a different MongoDB instance")
            print(f"  ⚠️  (e.g., Atlas Cloud vs Local MongoDB)")
    except:
        print(f"  ❌ Invalid ID format")
    
    # Summary
    print(f"\n{'='*100}")
    print(f"📊 SUMMARY")
    print(f"{'='*100}")
    
    print(f"\n✅ Current Connection:")
    if "localhost" in mongo_uri or "127.0.0.1" in mongo_uri or mongo_uri == "NOT SET":
        print(f"   🖥️  LOCAL MongoDB (localhost:27017)")
        print(f"   📊 Database: {db.name}")
        print(f"   👥 Job Seekers: {job_seekers_count}")
    else:
        print(f"   ☁️  MongoDB Atlas (Cloud)")
        print(f"   📊 Database: {db.name}")
        print(f"   👥 Job Seekers: {job_seekers_count}")
    
    print(f"\n💡 RECOMMENDATION:")
    if job_seekers_count > 0 and profiles_count > 0:
        print(f"   ✅ You have data in this database")
        print(f"   ✅ Use this connection for your app")
    else:
        print(f"   ⚠️  This database has minimal data")
        print(f"   ⚠️  If you want to use the data you showed me,")
        print(f"   ⚠️  you need to connect to the correct MongoDB instance")
    
    print(f"\n")

if __name__ == "__main__":
    try:
        check_connection()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

