#!/usr/bin/env python3
"""Test MongoDB Atlas Connection"""

from pymongo import MongoClient
import sys

# MongoDB Atlas connection string
MONGO_URI = "mongodb+srv://akshar_admin:WDQW9zihOVlhkExy@cluster0.lkow2ar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

print("=" * 50)
print("Testing MongoDB Atlas Connection")
print("=" * 50)
print()

try:
    print("Connecting to MongoDB Atlas...")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    
    print("Pinging database...")
    result = client.admin.command('ping')
    
    print()
    print("✅ SUCCESS! Connected to MongoDB Atlas!")
    print(f"Ping result: {result}")
    
    # List databases
    print()
    print("Available databases:")
    dbs = client.list_database_names()
    for db in dbs:
        print(f"  - {db}")
    
    print()
    print("=" * 50)
    print("✅ MongoDB Atlas connection is working!")
    print("=" * 50)
    sys.exit(0)
    
except Exception as e:
    print()
    print("❌ FAILED! Could not connect to MongoDB Atlas")
    print(f"Error: {e}")
    print()
    print("Possible causes:")
    print("  1. IP address not whitelisted in MongoDB Atlas")
    print("  2. Incorrect credentials")
    print("  3. Network connectivity issue")
    print()
    print("=" * 50)
    sys.exit(1)

