#!/usr/bin/env python3
"""
Script to check and manage jobs in the database
"""

from pymongo import MongoClient
from bson import ObjectId

def check_jobs():
    """Check all jobs in the database"""
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb://localhost:27017/')
        db = client['TalentMatchDB']
        
        print("🔍 Checking jobs in database...")
        print("=" * 50)
        
        # Get all jobs
        jobs = list(db.jobs.find({}))
        
        if not jobs:
            print("❌ No jobs found in database")
            return
        
        print(f"✅ Found {len(jobs)} jobs:")
        print()
        
        for i, job in enumerate(jobs, 1):
            job_id = str(job['_id'])
            job_title = job.get('job_title', 'N/A')
            company_name = job.get('company_name', 'N/A')
            recruiter_id = job.get('recruiter_id', 'N/A')
            
            print(f"{i}. Job ID: {job_id}")
            print(f"   Title: {job_title}")
            print(f"   Company: {company_name}")
            print(f"   Recruiter ID: {recruiter_id}")
            print()
        
        # Check if we can find Sarah Johnson's job
        print("🔍 Looking for Sarah Johnson's job...")
        sarah_jobs = list(db.jobs.find({'company_name': {'$regex': 'Sarah', '$options': 'i'}}))
        
        if sarah_jobs:
            print(f"✅ Found {len(sarah_jobs)} job(s) from Sarah Johnson:")
            for job in sarah_jobs:
                print(f"   - {job.get('job_title', 'N/A')} at {job.get('company_name', 'N/A')}")
        else:
            print("❌ No jobs found from Sarah Johnson")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_jobs()
