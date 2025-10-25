"""
Check what data exists for the intern user
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.db import get_db
from bson import ObjectId
import json

def check_user_data():
    db = get_db()
    users_collection = db.users
    
    # Find the intern user
    intern = users_collection.find_one({'userType': 'intern'})
    
    if not intern:
        print("No intern user found")
        return
    
    print("="*70)
    print("INTERN USER DATA CHECK")
    print("="*70)
    print(f"\nEmail: {intern.get('email')}")
    print(f"User ID: {intern.get('_id')}")
    print(f"User Type: {intern.get('userType')}")
    print(f"\nTop-level fields in user document:")
    
    for key in sorted(intern.keys()):
        if key != 'password':
            value = intern[key]
            if isinstance(value, dict):
                print(f"  {key}: dict with {len(value)} keys")
            elif isinstance(value, list):
                print(f"  {key}: list with {len(value)} items")
            else:
                val_str = str(value)[:50]
                print(f"  {key}: {val_str}...")
    
    # Check for profile data in different locations
    print(f"\nProfile Data Locations:")
    
    if 'comprehensiveInternProfile' in intern:
        comp = intern['comprehensiveInternProfile']
        print(f"  [FOUND] comprehensiveInternProfile: {len(comp)} fields")
        print(f"    Fields: {', '.join(list(comp.keys())[:10])}...")
    else:
        print(f"  [NOT FOUND] comprehensiveInternProfile")
    
    if 'internDetails' in intern:
        details = intern['internDetails']
        print(f"  [FOUND] internDetails: {len(details)} fields")
    else:
        print(f"  [NOT FOUND] internDetails")
    
    if 'profileCompleted' in intern:
        print(f"  [INFO] profileCompleted: {intern['profileCompleted']}")
    
    print("\n" + "="*70)

if __name__ == '__main__':
    check_user_data()

