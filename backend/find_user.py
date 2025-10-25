#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Find user by searching various fields
"""

import sys
from pymongo import MongoClient

def find_user():
    """Find user by name or email"""
    
    client = MongoClient('mongodb://localhost:27017/')
    db = client['TalentMatchDB']
    
    search_term = "ashish"
    
    print(f"Searching for users with '{search_term}' in any field...")
    
    # Search in all text fields
    users = list(db.users.find({
        '$or': [
            {'firstName': {'$regex': search_term, '$options': 'i'}},
            {'lastName': {'$regex': search_term, '$options': 'i'}},
            {'middleName': {'$regex': search_term, '$options': 'i'}},
            {'email': {'$regex': search_term, '$options': 'i'}},
            {'fullName': {'$regex': search_term, '$options': 'i'}}
        ]
    }))
    
    if not users:
        print(f"No users found with '{search_term}' in their details.")
        return
    
    print(f"\nFound {len(users)} user(s):\n")
    
    for idx, user in enumerate(users, 1):
        print(f"{idx}. Name: {user.get('firstName', '')} {user.get('middleName', '')} {user.get('lastName', '')}".strip())
        print(f"   Email: {user.get('email', 'N/A')}")
        print(f"   User ID: {user.get('_id')}")
        print(f"   User Type: {user.get('userType', 'N/A')}")
        print(f"   Created At: {user.get('createdAt', 'N/A')}")
        if 'fullName' in user:
            print(f"   Full Name: {user.get('fullName')}")
        print()

if __name__ == "__main__":
    find_user()

