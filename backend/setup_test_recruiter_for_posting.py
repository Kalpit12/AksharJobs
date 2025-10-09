"""
Setup Test Recruiter with Free Job Posts
Creates or updates a recruiter account for testing job posting
"""

import sys
from utils.db import get_db
from bson import ObjectId
from werkzeug.security import generate_password_hash
from datetime import datetime

def setup_test_recruiter():
    """Create or update test recruiter with free job posts"""
    
    print("="*60)
    print("  SETTING UP TEST RECRUITER FOR JOB POSTING")
    print("="*60)
    
    # Test recruiter credentials
    email = "recruiter@test.com"
    password = "Test123!@#"
    first_name = "Test"
    last_name = "Recruiter"
    company_name = "Test Company Inc"
    
    try:
        db = get_db()
        if db is None:
            print("❌ Failed to connect to database")
            return False
        
        users_collection = db.users
        
        # Check if recruiter already exists
        existing_user = users_collection.find_one({'email': email})
        
        if existing_user:
            print(f"\n👤 Found existing user: {email}")
            print(f"   User ID: {existing_user['_id']}")
            print(f"   Current free job posts: {existing_user.get('free_job_posts', 0)}")
            
            # Update existing user
            update_data = {
                'userType': 'recruiter',
                'free_job_posts': 10,  # Give 10 free job posts for testing
                'companyName': company_name,
                'industry': 'Technology',
                'companyWebsite': 'https://testcompany.com',
                'updatedAt': datetime.utcnow()
            }
            
            result = users_collection.update_one(
                {'_id': existing_user['_id']},
                {'$set': update_data}
            )
            
            if result.modified_count > 0:
                print(f"\n✅ Updated recruiter account!")
                print(f"   Free job posts: 10")
            else:
                print(f"\n⚠️ No changes made (data might already be set)")
            
            user_id = str(existing_user['_id'])
            
        else:
            print(f"\n👤 Creating new recruiter: {email}")
            
            # Create new recruiter
            hashed_password = generate_password_hash(password)
            
            new_user = {
                'firstName': first_name,
                'lastName': last_name,
                'email': email,
                'password': hashed_password,
                'userType': 'recruiter',
                'companyName': company_name,
                'industry': 'Technology',
                'companyWebsite': 'https://testcompany.com',
                'free_job_posts': 10,  # Give 10 free job posts
                'subscription': {
                    'plan': 'Basic',
                    'status': 'active'
                },
                'createdAt': datetime.utcnow(),
                'updatedAt': datetime.utcnow(),
                'profileCompleted': True,
                'verified': True
            }
            
            result = users_collection.insert_one(new_user)
            user_id = str(result.inserted_id)
            
            print(f"\n✅ Created new recruiter account!")
            print(f"   User ID: {user_id}")
            print(f"   Free job posts: 10")
        
        # Display credentials
        print(f"\n" + "="*60)
        print("  TEST RECRUITER CREDENTIALS")
        print("="*60)
        print(f"   Email:    {email}")
        print(f"   Password: {password}")
        print(f"   User ID:  {user_id}")
        print(f"   Company:  {company_name}")
        print(f"   Posts:    10 free job posts")
        print(f"\n✅ You can now use this account to test job posting!")
        print(f"\n💡 Run: python test_job_posting.py")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error setting up recruiter: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = setup_test_recruiter()
    sys.exit(0 if success else 1)

