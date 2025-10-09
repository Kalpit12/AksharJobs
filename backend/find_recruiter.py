#!/usr/bin/env python3
"""Find recruiter users for testing"""

from database.db import get_mongo_client, get_db

def main():
    try:
        client = get_mongo_client()
        if not client:
            print("Failed to connect to MongoDB")
            return
            
        db = get_db(client)
        
        # Find recruiters
        recruiters = list(db.users.find({'userType': 'recruiter'}))
        print(f"Found {len(recruiters)} recruiters:")
        
        for i, recruiter in enumerate(recruiters):
            print(f"\nRecruiter {i+1}:")
            print(f"  Email: {recruiter.get('email', 'No email')}")
            print(f"  Name: {recruiter.get('firstName', 'No first name')} {recruiter.get('lastName', 'No last name')}")
            print(f"  ID: {recruiter.get('_id', 'No ID')}")
            print(f"  Company: {recruiter.get('company', 'No company')}")
            
        # Find jobs by recruiters
        if recruiters:
            recruiter_id = str(recruiters[0]['_id'])
            jobs = list(db.jobs.find({'recruiter_id': recruiter_id}))
            print(f"\nJobs by first recruiter ({recruiter_id}): {len(jobs)}")
            
            for i, job in enumerate(jobs[:3]):
                print(f"  Job {i+1}: {job.get('job_title', 'No title')} - {job.get('company', 'No company')}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
