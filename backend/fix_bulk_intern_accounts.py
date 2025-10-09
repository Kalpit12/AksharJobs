#!/usr/bin/env python3
"""
Fix Bulk-Imported Intern Accounts
Updates userType to 'intern' for bulk-imported users with university information
"""

from utils.db import get_db
from datetime import datetime

def fix_bulk_intern_accounts():
    """Fix bulk-imported intern accounts"""
    try:
        db = get_db()
        users_collection = db['users']
        
        # Find all bulk-imported users
        bulk_users = list(users_collection.find({'bulk_imported': True}))
        
        print(f"📊 Found {len(bulk_users)} bulk-imported users")
        print("\n" + "="*60)
        
        updated_count = 0
        
        for user in bulk_users:
            user_email = user.get('email', 'No email')
            current_type = user.get('userType', 'Unknown')
            has_university = user.get('universityName') is not None
            has_student_id = user.get('studentId') is not None
            has_intern_pref = user.get('internshipPreference') is not None
            
            print(f"\n👤 User: {user_email}")
            print(f"   Current userType: {current_type}")
            print(f"   University Name: {user.get('universityName', 'N/A')}")
            print(f"   Student ID: {user.get('studentId', 'N/A')}")
            print(f"   Intern Preference: {user.get('internshipPreference', 'N/A')}")
            print(f"   Profile Completed: {user.get('profileCompleted', 'N/A')}")
            
            # If user has university info but userType is not 'intern', fix it
            if (has_university or has_student_id or has_intern_pref) and current_type != 'intern':
                print(f"   ⚠️  Should be intern but userType is '{current_type}'")
                print(f"   🔧 Updating to userType='intern'...")
                
                # Update the user
                result = users_collection.update_one(
                    {'_id': user['_id']},
                    {'$set': {
                        'userType': 'intern',
                        'role': 'intern',
                        'profileCompleted': False,  # Ensure they complete profile
                        'updated_at': datetime.now()
                    }}
                )
                
                if result.modified_count > 0:
                    print(f"   ✅ Updated successfully!")
                    updated_count += 1
                else:
                    print(f"   ❌ Update failed")
            elif current_type == 'intern':
                print(f"   ✅ Already set as intern")
            else:
                print(f"   ℹ️  Not an intern (no university info)")
        
        print("\n" + "="*60)
        print(f"\n📈 Summary:")
        print(f"   Total bulk-imported users: {len(bulk_users)}")
        print(f"   Updated to intern: {updated_count}")
        print(f"\n✅ Fix complete!")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    print("🔧 Fixing Bulk-Imported Intern Accounts...")
    print("="*60)
    fix_bulk_intern_accounts()

