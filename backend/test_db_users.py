#!/usr/bin/env python3
"""Test script to check database users"""

from database.db import get_mongo_client, get_db

def main():
    try:
        client = get_mongo_client()
        if not client:
            print("Failed to connect to MongoDB")
            return
            
        db = get_db(client)
        users = list(db.users.find({}))
        print(f"Found {len(users)} users in database")
        
        for i, user in enumerate(users[:5]):
            print(f"User {i+1}:")
            print(f"  Email: {user.get('email', 'No email')}")
            print(f"  Role: {user.get('userType', 'No role')}")
            print(f"  ID: {user.get('_id', 'No ID')}")
            print()
            
        # Check if there are any recruiters
        recruiters = list(db.users.find({'userType': 'recruiter'}))
        print(f"Found {len(recruiters)} recruiters")
        
        # Check if there are any jobs
        jobs = list(db.jobs.find({}))
        print(f"Found {len(jobs)} jobs")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
