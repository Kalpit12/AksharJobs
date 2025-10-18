#!/usr/bin/env python3
"""
Direct MongoDB Test - Insert data directly into MongoDB to verify connection
"""

import pymongo
from datetime import datetime

# Configuration
MONGODB_URI = "mongodb://localhost:27017"
DATABASE_NAME = "TalentMatchDB"
COLLECTION_NAME = "recruiters"

def test_direct_insert():
    """Test direct MongoDB insertion"""
    print("🚀 Testing Direct MongoDB Insertion")
    print("=" * 50)
    
    try:
        # Connect to MongoDB
        client = pymongo.MongoClient(MONGODB_URI)
        db = client[DATABASE_NAME]
        collection = db[COLLECTION_NAME]
        
        print(f"✅ Connected to MongoDB: {MONGODB_URI}")
        print(f"📊 Database: {DATABASE_NAME}")
        print(f"📋 Collection: {COLLECTION_NAME}")
        
        # Check initial count
        initial_count = collection.count_documents({})
        print(f"📈 Initial document count: {initial_count}")
        
        # Create test document
        test_doc = {
            'companyName': 'Test Company Direct Insert',
            'companyEmail': 'test@directinsert.com',
            'companyPhone': '+254700123456',
            'status': 'pending',
            'createdAt': datetime.now(),
            'updatedAt': datetime.now()
        }
        
        print(f"\n📝 Inserting test document: {test_doc['companyName']}")
        
        # Insert document
        result = collection.insert_one(test_doc)
        
        print(f"✅ Document inserted with ID: {result.inserted_id}")
        
        # Check final count
        final_count = collection.count_documents({})
        print(f"📈 Final document count: {final_count}")
        
        if final_count > initial_count:
            print("\n✅ SUCCESS! Document was saved to MongoDB")
            
            # Retrieve the document
            retrieved = collection.find_one({'_id': result.inserted_id})
            if retrieved:
                print(f"✅ Document retrieved successfully:")
                print(f"   Company: {retrieved.get('companyName', 'N/A')}")
                print(f"   Email: {retrieved.get('companyEmail', 'N/A')}")
                print(f"   Status: {retrieved.get('status', 'N/A')}")
        else:
            print("\n❌ FAILED! Document count did not increase")
        
        client.close()
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_direct_insert()

