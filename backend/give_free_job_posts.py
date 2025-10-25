#!/usr/bin/env python3
"""
Give free job posts to a recruiter for testing
"""
from utils.db import get_db

def give_free_posts(email, num_posts=10):
    """Give free job posts to a recruiter"""
    db = get_db()
    users = db['users']
    
    user = users.find_one({"email": email})
    
    if not user:
        print(f"❌ User not found: {email}")
        return False
    
    if user.get('userType') != 'recruiter':
        print(f"❌ User is not a recruiter: {email}")
        return False
    
    result = users.update_one(
        {"email": email},
        {"$set": {"free_job_posts": num_posts}}
    )
    
    if result.modified_count > 0:
        print(f"✓ Gave {num_posts} free job posts to {email}")
        return True
    else:
        print(f"⚠ User already has free job posts or update failed")
        return False

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        email = sys.argv[1]
        num_posts = int(sys.argv[2]) if len(sys.argv) > 2 else 10
    else:
        email = "test.recruiter@flowtest.com"
        num_posts = 10
    
    give_free_posts(email, num_posts)

