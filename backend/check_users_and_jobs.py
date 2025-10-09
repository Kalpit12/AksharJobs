#!/usr/bin/env python3
"""
Script to check users and their posted jobs
"""

from pymongo import MongoClient
from bson import ObjectId

def check_users_and_jobs():
    """Check users and their posted jobs"""
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb://localhost:27017/')
        db = client['TalentMatchDB']
        
        print("🔍 Checking users and their jobs...")
        print("=" * 50)
        
        # Get all users
        users = list(db.users.find({}, {'firstName': 1, 'lastName': 1, 'email': 1, 'userType': 1, '_id': 1}))
        
        print(f"✅ Found {len(users)} users:")
        print()
        
        sarah_found = False
        sarah_user_id = None
        
        for i, user in enumerate(users, 1):
            user_id = str(user['_id'])
            first_name = user.get('firstName', 'N/A')
            last_name = user.get('lastName', 'N/A')
            email = user.get('email', 'N/A')
            user_type = user.get('userType', 'N/A')
            
            print(f"{i}. User ID: {user_id}")
            print(f"   Name: {first_name} {last_name}")
            print(f"   Email: {email}")
            print(f"   Type: {user_type}")
            
            # Check if this is Sarah Johnson
            if 'sarah' in first_name.lower() or 'sarah' in last_name.lower() or 'johnson' in last_name.lower():
                print(f"   🎯 This might be Sarah Johnson!")
                sarah_found = True
                sarah_user_id = user_id
            
            print()
        
        # Check jobs posted by Sarah Johnson if found
        if sarah_found and sarah_user_id:
            print(f"🔍 Checking jobs posted by Sarah Johnson (User ID: {sarah_user_id})...")
            sarah_jobs = list(db.jobs.find({'recruiter_id': sarah_user_id}))
            
            if sarah_jobs:
                print(f"✅ Found {len(sarah_jobs)} job(s) posted by Sarah Johnson:")
                for job in sarah_jobs:
                    print(f"   - {job.get('job_title', 'N/A')} at {job.get('company_name', 'N/A')}")
            else:
                print("❌ No jobs found posted by Sarah Johnson")
        
        # Check for any jobs with "Sarah" or "Johnson" in company name
        print("\n🔍 Checking for jobs with 'Sarah' or 'Johnson' in company name...")
        sarah_company_jobs = list(db.jobs.find({
            '$or': [
                {'company_name': {'$regex': 'Sarah', '$options': 'i'}},
                {'company_name': {'$regex': 'Johnson', '$options': 'i'}}
            ]
        }))
        
        if sarah_company_jobs:
            print(f"✅ Found {len(sarah_company_jobs)} job(s) with 'Sarah' or 'Johnson' in company name:")
            for job in sarah_company_jobs:
                print(f"   - {job.get('job_title', 'N/A')} at {job.get('company_name', 'N/A')}")
        else:
            print("❌ No jobs found with 'Sarah' or 'Johnson' in company name")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_users_and_jobs()
