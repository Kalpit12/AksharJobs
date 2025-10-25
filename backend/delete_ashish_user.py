#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Delete Ashishkumar Patel user from database
"""

import sys
from pymongo import MongoClient

def delete_user():
    """Delete user Ashishkumar Patel"""
    
    client = MongoClient('mongodb://localhost:27017/')
    db = client['TalentMatchDB']
    
    print("Searching for user 'Ashishkumar Patel'...")
    
    # Search for user by name (case insensitive)
    # Try different variations
    search_patterns = [
        {'firstName': {'$regex': 'ashish', '$options': 'i'}, 'lastName': {'$regex': 'patel', '$options': 'i'}},
        {'firstName': {'$regex': 'ashishkumar', '$options': 'i'}},
        {'email': {'$regex': 'ashish', '$options': 'i'}},
        {'$or': [
            {'firstName': {'$regex': 'ashish', '$options': 'i'}},
            {'email': {'$regex': 'ashish', '$options': 'i'}}
        ]}
    ]
    
    users_to_delete = []
    
    for pattern in search_patterns:
        users = list(db.users.find(pattern))
        for user in users:
            if user not in users_to_delete:
                users_to_delete.append(user)
    
    if not users_to_delete:
        print("No user found matching 'Ashishkumar Patel'")
        print("\nSearching all users with 'ashish' in name or email...")
        all_matches = list(db.users.find({
            '$or': [
                {'firstName': {'$regex': 'ashish', '$options': 'i'}},
                {'lastName': {'$regex': 'patel', '$options': 'i'}},
                {'email': {'$regex': 'ashish', '$options': 'i'}}
            ]
        }))
        
        if all_matches:
            print(f"\nFound {len(all_matches)} potential matches:")
            for idx, user in enumerate(all_matches, 1):
                print(f"\n{idx}. Name: {user.get('firstName', 'N/A')} {user.get('lastName', 'N/A')}")
                print(f"   Email: {user.get('email', 'N/A')}")
                print(f"   User ID: {user.get('_id')}")
                print(f"   User Type: {user.get('userType', 'N/A')}")
        return
    
    print(f"\nFound {len(users_to_delete)} user(s) to delete:\n")
    
    for user in users_to_delete:
        print(f"Name: {user.get('firstName', 'N/A')} {user.get('lastName', 'N/A')}")
        print(f"Email: {user.get('email', 'N/A')}")
        print(f"User ID: {user.get('_id')}")
        print(f"User Type: {user.get('userType', 'N/A')}\n")
    
    confirm = input("WARNING: Are you sure you want to delete these user(s)? (yes/no): ")
    
    if confirm.lower() != 'yes':
        print("Deletion cancelled.")
        return
    
    # Delete the users
    deleted_count = 0
    for user in users_to_delete:
        result = db.users.delete_one({'_id': user['_id']})
        if result.deleted_count > 0:
            deleted_count += 1
            print(f"Deleted user: {user.get('email', 'N/A')}")
    
    print(f"\nSuccessfully deleted {deleted_count} user(s)!")
    
    # Also delete related data
    for user in users_to_delete:
        user_id = user['_id']
        
        # Delete job seeker profile
        jobseeker_result = db.jobseeker_profiles.delete_many({'userId': user_id})
        if jobseeker_result.deleted_count > 0:
            print(f"  Deleted {jobseeker_result.deleted_count} job seeker profile(s)")
        
        # Delete recruiter profile
        recruiter_result = db.recruiter_profiles.delete_many({'userId': user_id})
        if recruiter_result.deleted_count > 0:
            print(f"  Deleted {recruiter_result.deleted_count} recruiter profile(s)")
        
        # Delete applications
        app_result = db.applications.delete_many({'applicantId': user_id})
        if app_result.deleted_count > 0:
            print(f"  Deleted {app_result.deleted_count} application(s)")
        
        # Delete jobs posted by user
        jobs_result = db.jobs.delete_many({'recruiterId': user_id})
        if jobs_result.deleted_count > 0:
            print(f"  Deleted {jobs_result.deleted_count} job(s)")

if __name__ == "__main__":
    delete_user()

