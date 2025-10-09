#!/usr/bin/env python3
"""
Debug script to test database connection and identify issues
"""

import os
from dotenv import load_dotenv
from utils.db import get_db, is_db_connected

def test_environment():
    """Test environment variables"""
    print("🔍 Testing Environment Variables:")
    load_dotenv()
    
    mongo_uri = os.getenv("MONGO_URI")
    db_name = os.getenv("DB_NAME")
    
    print(f"MONGO_URI: {mongo_uri[:50]}..." if mongo_uri and len(mongo_uri) > 50 else f"MONGO_URI: {mongo_uri}")
    print(f"DB_NAME: {db_name}")
    print()

def test_database_connection():
    """Test database connection"""
    print("🔍 Testing Database Connection:")
    
    try:
        # Test basic connection
        print("Testing get_db()...")
        db = get_db()
        if db:
            print("✅ get_db() successful")
            
            # Test ping command
            print("Testing ping command...")
            result = db.command('ping')
            print(f"✅ Ping successful: {result}")
            
            # Test list collections
            print("Testing list collections...")
            collections = db.list_collection_names()
            print(f"✅ Collections found: {len(collections)}")
            print(f"Collections: {collections[:5]}...")  # Show first 5
            
        else:
            print("❌ get_db() failed")
            
    except Exception as e:
        print(f"❌ Database test error: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
    
    print()

def test_connection_function():
    """Test the is_db_connected function"""
    print("🔍 Testing is_db_connected():")
    
    try:
        result = is_db_connected()
        print(f"✅ is_db_connected(): {result}")
    except Exception as e:
        print(f"❌ is_db_connected() error: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
    
    print()

if __name__ == "__main__":
    print("🚀 Database Connection Debug Test")
    print("=" * 50)
    
    test_environment()
    test_database_connection()
    test_connection_function()
    
    print("✅ Debug test completed!")
