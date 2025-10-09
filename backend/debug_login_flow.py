#!/usr/bin/env python3
"""
Debug the complete login flow
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId
from models.user_model import User
from utils.auth_token import generate_jwt_token
import jwt
from config import Config

def debug_login_flow():
    """Debug the complete login flow"""
    
    email = "john.doe@example.com"
    password = "password123"
    
    print(f"🔍 Debugging login flow for: {email}")
    
    # Step 1: Check what User.find_by_email returns
    print(f"\n1️⃣ Checking User.find_by_email...")
    user = User.find_by_email(email)
    
    if user:
        print(f"✅ User found by email:")
        print(f"   ID: {user['_id']}")
        print(f"   Name: {user.get('firstName', '')} {user.get('lastName', '')}")
        print(f"   Email: {user.get('email', 'N/A')}")
        print(f"   Role: {user.get('userType', 'N/A')}")
        print(f"   Password hash: {user.get('password', 'N/A')[:50]}...")
        
        # Step 2: Generate JWT token
        print(f"\n2️⃣ Generating JWT token...")
        user_id = str(user['_id'])
        token = generate_jwt_token(user_id)
        print(f"   User ID for token: {user_id}")
        print(f"   Token: {token[:50]}...")
        
        # Step 3: Decode the token
        print(f"\n3️⃣ Decoding JWT token...")
        try:
            decoded = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=["HS256"])
            print(f"   Decoded subject: {decoded.get('sub')}")
            print(f"   Decoded expires: {decoded.get('exp')}")
            
            # Step 4: Check if the user from token exists
            print(f"\n4️⃣ Checking if user from token exists...")
            token_user_id = decoded.get('sub')
            token_user = User.find_by_id(token_user_id)
            
            if token_user:
                print(f"✅ User from token exists:")
                print(f"   ID: {token_user['_id']}")
                print(f"   Name: {token_user.get('firstName', '')} {token_user.get('lastName', '')}")
                print(f"   Email: {token_user.get('email', 'N/A')}")
            else:
                print(f"❌ User from token does not exist!")
                
                # Check if it exists in database directly
                print(f"\n5️⃣ Checking database directly...")
                db = get_db()
                if db:
                    direct_user = db.users.find_one({'_id': ObjectId(token_user_id)})
                    if direct_user:
                        print(f"✅ User exists in database directly:")
                        print(f"   ID: {direct_user['_id']}")
                        print(f"   Name: {direct_user.get('firstName', '')} {direct_user.get('lastName', '')}")
                        print(f"   Email: {direct_user.get('email', 'N/A')}")
                    else:
                        print(f"❌ User does not exist in database directly either!")
                        
        except Exception as e:
            print(f"❌ JWT decode error: {e}")
    else:
        print(f"❌ User not found by email")
    
    return True

if __name__ == "__main__":
    debug_login_flow()




