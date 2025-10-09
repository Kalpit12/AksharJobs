#!/usr/bin/env python3
"""
Debug script to check jobs in database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId

def check_jobs():
    """Check jobs in database"""
    
    db = get_db()
    if db is None:
        print("❌ Database connection failed")
        return False
    
    # Get some jobs
    jobs = list(db.jobs.find({}, {'_id': 1, 'job_title': 1, 'company_name': 1}).limit(5))
    
    if not jobs:
        print("❌ No jobs found in database")
        return False
    
    print("✅ Found jobs in database:")
    for job in jobs:
        print(f"  ID: {job['_id']}")
        print(f"  Title: {job.get('job_title', 'N/A')}")
        print(f"  Company: {job.get('company_name', 'N/A')}")
        print("  ---")
    
    return True

if __name__ == "__main__":
    check_jobs()




