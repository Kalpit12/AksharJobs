#!/usr/bin/env python3
"""
Script to create missing applications for testing the application tracker
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId
from datetime import datetime

def create_missing_applications():
    """Create applications for product manager and data scientist jobs"""
    
    db = get_db()
    if db is None:
        print("❌ Database connection failed")
        return False
    
    # Get any user from the system (we'll use the first one we find)
    user = db.users.find_one()
    if not user:
        print("❌ No users found in the database. Please create a user first.")
        return False
    
    # If no jobSeeker role, let's check what roles exist
    if user.get('role') != 'jobSeeker':
        print(f"⚠️  Found user with role: {user.get('role', 'unknown')}")
        print("📝 Will create applications for this user anyway for testing")
    
    user_id = user['_id']
    print(f"✅ Found user: {user.get('firstName', '')} {user.get('lastName', '')} ({user_id})")
    
    # Get or create jobs for Product Manager and Data Scientist
    jobs_to_create = [
        {
            "job_title": "Product Manager",
            "company_name": "TechCorp Solutions",
            "location": "San Francisco, CA",
            "job_type": "Full-time",
            "description": "We are seeking a talented Product Manager to join our growing team at TechCorp Solutions. You will work on cutting-edge projects, develop product strategies, and collaborate with cross-functional teams.",
            "salary_range": "$120,000 - $150,000 per year",
            "recruiter_id": user_id,  # Using same user as recruiter for demo
            "posted_by": user_id,
            "created_at": datetime.now().isoformat()
        },
        {
            "job_title": "Data Scientist", 
            "company_name": "DataStudio Inc",
            "location": "New York, NY",
            "job_type": "Full-time",
            "description": "Join our dynamic team as a Data Scientist where you'll create stunning, responsive data solutions that deliver exceptional insights. Work with machine learning models and big data technologies.",
            "salary_range": "$100,000 - $140,000 per year",
            "recruiter_id": user_id,  # Using same user as recruiter for demo
            "posted_by": user_id,
            "created_at": datetime.now().isoformat()
        }
    ]
    
    created_jobs = []
    for job_data in jobs_to_create:
        # Check if job already exists
        existing_job = db.jobs.find_one({"job_title": job_data["job_title"]})
        if existing_job:
            print(f"✅ Job '{job_data['job_title']}' already exists")
            created_jobs.append(existing_job)
        else:
            # Create the job
            job_id = db.jobs.insert_one(job_data).inserted_id
            print(f"✅ Created job: {job_data['job_title']} at {job_data['company_name']}")
            job_data['_id'] = job_id
            created_jobs.append(job_data)
    
    # Create applications for these jobs
    applications_created = 0
    for job in created_jobs:
        # Check if application already exists
        existing_app = db.applications.find_one({
            "applicant_id": user_id,
            "job_id": job['_id']
        })
        
        if existing_app:
            print(f"✅ Application for '{job['job_title']}' already exists")
        else:
            # Create the application
            application_data = {
                'job_id': job['_id'],
                'applicant_id': user_id,
                'applicant_name': f"{user.get('firstName', '')} {user.get('lastName', '')}",
                'applicant_email': user.get('email', ''),
                'cover_letter': f"I am very interested in the {job['job_title']} position at {job['company_name']}. I believe my skills and experience make me a great fit for this role.",
                'status': 'pending',
                'applied_at': datetime.now().isoformat(),
                'job_title': job['job_title'],
                'company_name': job['company_name'],
                'final_score': 85.5,  # Demo match score
                'progress_percentage': 14  # 1/7 * 100
            }
            
            app_id = db.applications.insert_one(application_data).inserted_id
            print(f"✅ Created application for '{job['job_title']}' at {job['company_name']}")
            applications_created += 1
            
            # Create initial tracking record
            tracking_record = {
                "userId": str(user_id),
                "jobId": str(job['_id']),
                "status": "pending",
                "notes": "Application submitted successfully",
                "timestamp": datetime.now().isoformat(),
                "created_at": datetime.now()
            }
            db.application_tracking.insert_one(tracking_record)
            print(f"✅ Created tracking record for application")
    
    print(f"\n🎉 Successfully created {applications_created} new applications!")
    print("📊 Applications should now be visible in the application tracker")
    
    return True

if __name__ == "__main__":
    print("🚀 Creating missing applications for testing...")
    success = create_missing_applications()
    if success:
        print("✅ All done! Check the application tracker now.")
    else:
        print("❌ Failed to create applications. Check the logs above.")
