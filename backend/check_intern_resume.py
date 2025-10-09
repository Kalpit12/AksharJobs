#!/usr/bin/env python3
"""
Check Intern Resume Data
"""

from utils.db import get_db
import json

def check_intern_resume():
    try:
        db = get_db()
        users_collection = db['users']
        
        # Find intern users
        intern_users = list(users_collection.find({'userType': 'intern'}))
        
        print(f"📊 Found {len(intern_users)} intern users\n")
        print("="*80)
        
        for user in intern_users:
            print(f"\n👤 Email: {user.get('email', 'N/A')}")
            print(f"   profileCompleted: {user.get('profileCompleted', False)}")
            print(f"   has internDetails: {'internDetails' in user}")
            
            if 'internDetails' in user:
                details = user['internDetails']
                print(f"   ✅ Intern Details Found:")
                print(f"      - fullName: {details.get('fullName', 'N/A')}")
                print(f"      - mobile: {details.get('mobile', 'N/A')}")
                print(f"      - collegeName: {details.get('collegeName', 'N/A')}")
                print(f"      - resumePath: {details.get('resumePath', 'NOT SET')}")
                print(f"      - technicalSkills: {len(details.get('technicalSkills', []))} skills")
                print(f"      - softSkills: {len(details.get('softSkills', []))} skills")
            else:
                print(f"   ❌ No internDetails found")
        
        print("\n" + "="*80)
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    print("🔍 Checking Intern Resume Data...")
    print("="*80)
    check_intern_resume()

