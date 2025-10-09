#!/usr/bin/env python3
"""
Script to remove demo jobs from the database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId

def cleanup_demo_jobs():
    """Remove all demo jobs from the database"""
    try:
        db = get_db()
        if db is None:
            print("❌ Database connection failed")
            return False
        
        # Find all demo jobs
        demo_jobs = db.jobs.find({"recruiter_id": {"$regex": "^demo_"}})
        demo_jobs_list = list(demo_jobs)
        
        print(f"🔍 Found {len(demo_jobs_list)} demo jobs to remove:")
        
        for job in demo_jobs_list:
            print(f"  - {job.get('job_title', 'Unknown')} at {job.get('company_name', 'Unknown')} (ID: {job['_id']})")
        
        if len(demo_jobs_list) == 0:
            print("✅ No demo jobs found to remove")
            return True
        
        # Remove demo jobs
        result = db.jobs.delete_many({"recruiter_id": {"$regex": "^demo_"}})
        
        print(f"✅ Successfully removed {result.deleted_count} demo jobs")
        
        # Also remove any applications for these demo jobs
        demo_job_ids = [job['_id'] for job in demo_jobs_list]
        if demo_job_ids:
            app_result = db.applications.delete_many({"job_id": {"$in": demo_job_ids}})
            print(f"✅ Also removed {app_result.deleted_count} applications for demo jobs")
        
        return True
        
    except Exception as e:
        print(f"❌ Error cleaning up demo jobs: {e}")
        return False

if __name__ == "__main__":
    print("🧹 Starting demo jobs cleanup...")
    success = cleanup_demo_jobs()
    if success:
        print("🎉 Demo jobs cleanup completed successfully!")
    else:
        print("💥 Demo jobs cleanup failed!")
        sys.exit(1)