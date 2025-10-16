#!/usr/bin/env python3
import pymongo
from config import MONGO_URI, DB_NAME

def check_users():
    try:
        # Connect to MongoDB
        client = pymongo.MongoClient(MONGO_URI)
        db = client[DB_NAME]
        users_collection = db.users
        
        # Get all users
        users = list(users_collection.find({}, {
            '_id': 1, 
            'email': 1, 
            'firstName': 1, 
            'lastName': 1, 
            'role': 1, 
            'userType': 1, 
            'profileCompleted': 1,
            'createdAt': 1
        }))
        
        print(f'📊 Total users in database: {len(users)}')
        print('=' * 60)
        
        if len(users) == 0:
            print('❌ No users found in the database.')
            print('💡 You can create new users by signing up at http://localhost:3003/signup')
        else:
            for i, user in enumerate(users, 1):
                print(f'{i}. Email: {user.get("email", "N/A")}')
                print(f'   Name: {user.get("firstName", "")} {user.get("lastName", "")}')
                print(f'   Role: {user.get("role", user.get("userType", "N/A"))}')
                print(f'   Profile Completed: {user.get("profileCompleted", False)}')
                print(f'   User ID: {user.get("_id")}')
                print(f'   Created: {user.get("createdAt", "N/A")}')
                print('-' * 40)
        
        client.close()
        
    except Exception as e:
        print(f'❌ Error connecting to MongoDB: {e}')
        print('🔧 Make sure MongoDB is running and the connection string is correct.')

if __name__ == "__main__":
    check_users()