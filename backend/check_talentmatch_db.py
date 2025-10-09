#!/usr/bin/env python3
"""
Check TalentMatchDB database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from pymongo import MongoClient
from bson import ObjectId

def check_talentmatch_db():
    """Check TalentMatchDB database"""
    
    print("🔍 Checking TalentMatchDB database...")
    
    try:
        # Connect to TalentMatchDB
        client = MongoClient('mongodb://localhost:27017/')
        db = client['TalentMatchDB']
        
        print(f"✅ Connected to database: {db.name}")
        
        # Check collections
        collections = db.list_collection_names()
        print(f"📚 Collections: {collections}")
        
        # Check jobs
        jobs_count = db.jobs.count_documents({})
        print(f"💼 Jobs count: {jobs_count}")
        
        if jobs_count > 0:
            jobs = list(db.jobs.find({}, {'_id': 1, 'job_title': 1, 'company_name': 1}))
            print(f"📋 All jobs:")
            for job in jobs:
                print(f"   ID: {job['_id']}")
                print(f"   Title: {job.get('job_title', 'N/A')}")
                print(f"   Company: {job.get('company_name', 'N/A')}")
                print("   ---")
        else:
            print(f"❌ No jobs found in TalentMatchDB")
        
        # Check users
        users_count = db.users.count_documents({})
        print(f"👥 Users count: {users_count}")
        
        if users_count > 0:
            users = list(db.users.find({}, {'_id': 1, 'firstName': 1, 'lastName': 1, 'email': 1}))
            print(f"👤 All users:")
            for user in users:
                print(f"   ID: {user['_id']}")
                print(f"   Name: {user.get('firstName', '')} {user.get('lastName', '')}")
                print(f"   Email: {user.get('email', 'N/A')}")
                print("   ---")
        else:
            print(f"❌ No users found in TalentMatchDB")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    check_talentmatch_db()




