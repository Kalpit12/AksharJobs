"""Find Dhruv's exact email"""
from utils.db import get_db

db = get_db()
users_collection = db.users

# Search for any variation
variations = [
    "dhruvpatel771@gmail.com",
    "Dhruvpatel771@gmail.com",
    "DhruvPatel771@gmail.com",
    "DHRUVPATEL771@GMAIL.COM"
]

print("Searching for Dhruv Patel...")
for email in variations:
    user = users_collection.find_one({"email": email})
    if user:
        print(f"\n✅ FOUND with email: '{email}'")
        print(f"   User ID: {user.get('_id')}")
        print(f"   First Name: {user.get('firstName')}")
        print(f"   Last Name: {user.get('lastName')}")
        print(f"   Has Password: {'password' in user}")
        break
else:
    print("\n❌ Not found with any variation")
    
    # Case-insensitive search
    print("\nTrying case-insensitive search...")
    user = users_collection.find_one({"email": {"$regex": "^dhruvpatel771@gmail.com$", "$options": "i"}})
    if user:
        print(f"✅ Found with regex!")
        print(f"   Exact email in DB: '{user.get('email')}'")
        print(f"   User ID: {user.get('_id')}")
    else:
        print("❌ Still not found")
        
        # Show all users with 'dhruv' in email
        print("\nAll users with 'dhruv' in email:")
        for u in users_collection.find({"email": {"$regex": "dhruv", "$options": "i"}}):
            print(f"  - {u.get('email')}")

