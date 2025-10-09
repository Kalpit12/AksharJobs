#!/usr/bin/env python3
"""
Delete test users from database
"""

from utils.db import get_db
from pymongo import MongoClient

def delete_test_users():
    """Delete all bulk imported users"""
    
    client = MongoClient('mongodb://localhost:27017/')
    db = client['TalentMatchDB']
    
    # Delete users with these specific emails
    test_emails = [
        'hemant.patel@maxproinfotech.com',
        'aashniptl2000@gmail.com'
    ]
    
    print("🗑️ Deleting test users...")
    
    for email in test_emails:
        result = db.users.delete_many({'email': email})
        print(f"  Deleted {result.deleted_count} user(s) with email: {email}")
    
    # Also delete all bulk imported users
    result = db.users.delete_many({'bulk_imported': True})
    print(f"\n✅ Deleted {result.deleted_count} total bulk imported users")
    
    # Clear bulk imports collection
    result = db.bulk_imports.delete_many({})
    print(f"✅ Deleted {result.deleted_count} import records")
    
    print("\n🎉 Database cleaned! Ready for fresh import.")

if __name__ == "__main__":
    delete_test_users()

