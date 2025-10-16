"""Verify Dhruv Patel's password and reset if needed"""
from utils.db import get_db
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId

db = get_db()
users_collection = db.users

# Find Dhruv
dhruv = users_collection.find_one({"email": "Dhruvpatel771@gmail.com"})

if dhruv:
    print("✅ User found!")
    print(f"Email: {dhruv.get('email')}")
    print(f"User ID: {dhruv.get('_id')}")
    print(f"Has password field: {'password' in dhruv}")
    
    # Test the password
    password_to_test = "Dhruv@123"
    
    if 'password' in dhruv:
        stored_hash = dhruv['password']
        is_correct = check_password_hash(stored_hash, password_to_test)
        
        if is_correct:
            print(f"\n✅ Password '{password_to_test}' is CORRECT!")
        else:
            print(f"\n❌ Password '{password_to_test}' is INCORRECT!")
            print("\nTrying to reset password...")
            
            # Reset password
            new_hash = generate_password_hash(password_to_test)
            result = users_collection.update_one(
                {'_id': dhruv['_id']},
                {'$set': {'password': new_hash}}
            )
            
            if result.modified_count > 0:
                print(f"✅ Password reset successfully to: {password_to_test}")
            else:
                print("❌ Failed to reset password")
    else:
        print("\n❌ User has no password field!")
        print("Creating password...")
        
        new_hash = generate_password_hash(password_to_test)
        result = users_collection.update_one(
            {'_id': dhruv['_id']},
            {'$set': {'password': new_hash}}
        )
        
        if result.modified_count > 0:
            print(f"✅ Password created successfully: {password_to_test}")
        else:
            print("❌ Failed to create password")
else:
    print("❌ User not found!")

