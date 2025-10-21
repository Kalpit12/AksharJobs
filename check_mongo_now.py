#!/usr/bin/env python3
"""
Check MongoDB RIGHT NOW - what's actually in there
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))

from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv('.env.production')
load_dotenv('.env.local')
load_dotenv('.env')

def check_mongo_now():
    print("=" * 80)
    print("🔍 CHECKING MONGODB RIGHT NOW")
    print("=" * 80)
    print()
    
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    DB_NAME = os.getenv("DB_NAME", "TalentMatchDB")
    
    print(f"URI: {MONGO_URI}")
    print(f"DB: {DB_NAME}")
    print()
    
    # Create BRAND NEW connection
    client = MongoClient(MONGO_URI, socketTimeoutMS=60000, connectTimeoutMS=60000)
    db = client[DB_NAME]
    
    test_emails = ["test@example.com", "admin@example.com", "sarah.johnson@techcorp.com"]
    
    for email in test_emails:
        user = db.users.find_one({"email": email})
        if user:
            pwd = user.get('password')
            pwd_type = type(pwd).__name__
            
            print(f"📧 {email}")
            print(f"   Type: {pwd_type}")
            
            if isinstance(pwd, bytes):
                pwd_str = pwd.decode('utf-8')
                print(f"   First 30 chars: {pwd_str[:30]}")
                print(f"   BYTES FORMAT!")
            elif isinstance(pwd, str):
                print(f"   First 30 chars: {pwd[:30]}")
                print(f"   STRING FORMAT")
            print()
    
    client.close()

if __name__ == "__main__":
    check_mongo_now()

