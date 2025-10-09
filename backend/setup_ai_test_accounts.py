"""
Setup Test Accounts for AI Features Testing
Creates job seeker, intern, and recruiter accounts with sample data
"""

from utils.db import get_db
from werkzeug.security import generate_password_hash
from datetime import datetime
from bson import ObjectId

def setup_test_accounts():
    """Create all test accounts needed for AI features testing"""
    
    print("="*70)
    print("  SETTING UP AI FEATURES TEST ACCOUNTS")
    print("="*70)
    
    try:
        db = get_db()
        if db is None:
            print("❌ Failed to connect to database")
            return False
        
        users_collection = db.users
        
        # Test accounts configuration
        accounts = [
            {
                'email': 'jobseeker@test.com',
                'password': 'Test123!@#',
                'firstName': 'John',
                'lastName': 'Seeker',
                'userType': 'jobSeeker',
                'skills': ['Python', 'JavaScript', 'React', 'SQL', 'Docker'],
                'technicalSkills': ['Python', 'JavaScript', 'React', 'Node.js'],
                'softSkills': ['Communication', 'Leadership', 'Problem Solving'],
                'employment': {
                    'mostRecentJobTitle': 'Software Engineer',
                    'yearsOfExperience': '3-5 years',
                    'currentEmploymentStatus': 'Employed'
                },
                'location': {'city': 'San Francisco', 'country': 'USA'},
                'profileCompleted': True
            },
            {
                'email': 'intern@test.com',
                'password': 'Test123!@#',
                'firstName': 'Sarah',
                'lastName': 'Intern',
                'userType': 'intern',
                'profileCompleted': True
            },
            {
                'email': 'recruiter@test.com',
                'password': 'Test123!@#',
                'firstName': 'Mike',
                'lastName': 'Recruiter',
                'userType': 'recruiter',
                'companyName': 'TechCorp Solutions',
                'industry': 'Technology',
                'companyWebsite': 'https://techcorp.com',
                'free_job_posts': 10,
                'subscription': {
                    'plan': 'Basic',
                    'status': 'active'
                },
                'profileCompleted': True
            }
        ]
        
        created_accounts = []
        
        for account in accounts:
            email = account['email']
            
            # Check if account exists
            existing = users_collection.find_one({'email': email})
            
            if existing:
                print(f"\n👤 Account exists: {email}")
                print(f"   Updating with AI test data...")
                
                # Update with test data
                update_data = {k: v for k, v in account.items() if k not in ['email', 'password']}
                update_data['updatedAt'] = datetime.utcnow()
                
                users_collection.update_one(
                    {'email': email},
                    {'$set': update_data}
                )
                
                user_id = str(existing['_id'])
                created_accounts.append({
                    'email': email,
                    'userId': user_id,
                    'userType': account['userType']
                })
                
            else:
                print(f"\n👤 Creating new account: {email}")
                
                # Create new account
                new_user = {
                    'email': email,
                    'password': generate_password_hash(account['password']),
                    'firstName': account['firstName'],
                    'lastName': account['lastName'],
                    'userType': account['userType'],
                    'createdAt': datetime.utcnow(),
                    'updatedAt': datetime.utcnow(),
                    'verified': True,
                    'profileCompleted': account.get('profileCompleted', True)
                }
                
                # Add role-specific fields
                if account['userType'] == 'jobSeeker':
                    new_user.update({
                        'skills': account.get('skills', []),
                        'technicalSkills': account.get('technicalSkills', []),
                        'softSkills': account.get('softSkills', []),
                        'employment': account.get('employment', {}),
                        'location': account.get('location', {})
                    })
                elif account['userType'] == 'recruiter':
                    new_user.update({
                        'companyName': account.get('companyName', ''),
                        'industry': account.get('industry', ''),
                        'companyWebsite': account.get('companyWebsite', ''),
                        'free_job_posts': account.get('free_job_posts', 10),
                        'subscription': account.get('subscription', {})
                    })
                
                result = users_collection.insert_one(new_user)
                user_id = str(result.inserted_id)
                
                created_accounts.append({
                    'email': email,
                    'userId': user_id,
                    'userType': account['userType']
                })
        
        # Create intern details for intern account
        intern_account = next((acc for acc in created_accounts if acc['userType'] == 'intern'), None)
        if intern_account:
            intern_details_collection = db.intern_details
            
            intern_details = {
                'userId': ObjectId(intern_account['userId']),
                'fullName': 'Sarah Intern',
                'email': 'intern@test.com',
                'mobile': '+1-555-0123',
                'technicalSkills': ['Python', 'JavaScript', 'HTML', 'CSS'],
                'softSkills': ['Communication', 'Teamwork', 'Quick Learner'],
                'interests': ['Web Development', 'Machine Learning'],
                'desiredRole': 'Software Engineer',
                'internshipDuration': 12,
                'currentLocation': 'New York, NY',
                'createdAt': datetime.utcnow(),
                'updatedAt': datetime.utcnow()
            }
            
            intern_details_collection.update_one(
                {'userId': ObjectId(intern_account['userId'])},
                {'$set': intern_details},
                upsert=True
            )
            
            print(f"   ✅ Created intern profile with skills")
        
        # Display all accounts
        print("\n" + "="*70)
        print("  TEST ACCOUNTS CREATED/UPDATED")
        print("="*70)
        
        for account in created_accounts:
            print(f"\n📧 {account['userType'].upper()}")
            print(f"   Email: {account['email']}")
            print(f"   Password: Test123!@#")
            print(f"   User ID: {account['userId']}")
        
        print(f"\n✅ All test accounts ready for AI features testing!")
        print(f"\n💡 Next Step: Run 'python test_ai_features_complete.py'")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error setting up accounts: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = setup_test_accounts()
    exit(0 if success else 1)

