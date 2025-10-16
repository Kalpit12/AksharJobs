"""Check if Dhruv Patel user exists in database"""
from utils.db import get_db
from pprint import pprint

db = get_db()
users_collection = db.users

# Search for Dhruv Patel
dhruv = users_collection.find_one({"email": "dhruvpatel771@gmail.com"})

if dhruv:
    print("✅ User found!")
    print("\nUser Details:")
    pprint({
        "_id": str(dhruv.get('_id')),
        "email": dhruv.get('email'),
        "firstName": dhruv.get('firstName'),
        "lastName": dhruv.get('lastName'),
        "phone": dhruv.get('phone'),
        "userType": dhruv.get('userType'),
        "role": dhruv.get('role'),
        "has_password": 'password' in dhruv
    })
else:
    print("❌ User NOT found!")
    print("\nSearching for similar users...")
    
    # Try case-insensitive search
    similar = users_collection.find_one({"email": {"$regex": "dhruv", "$options": "i"}})
    if similar:
        print("Found similar user:")
        print(f"  Email: {similar.get('email')}")
    else:
        print("No similar users found")
    
    # Check all job seekers
    all_seekers = list(users_collection.find({"userType": "jobSeeker"}).limit(5))
    print(f"\nFound {len(all_seekers)} job seekers in database:")
    for seeker in all_seekers:
        print(f"  - {seeker.get('email')} ({seeker.get('firstName')} {seeker.get('lastName')})")

