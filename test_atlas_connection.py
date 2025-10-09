import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .edn.local
load_dotenv('.edn.local')

def test_atlas_connection():
    """Test MongoDB Atlas connection"""
    
    mongo_uri = os.getenv("MONGO_URI")
    db_name = os.getenv("DB_NAME")
    
    print("=" * 60)
    print("MongoDB Atlas Connection Test")
    print("=" * 60)
    print(f"Database: {db_name}")
    print(f"URI: {mongo_uri[:50]}..." if len(mongo_uri) > 50 else f"URI: {mongo_uri}")
    print()
    
    try:
        # Connect to MongoDB Atlas
        print("📡 Connecting to MongoDB...")
        client = MongoClient(
            mongo_uri, 
            serverSelectionTimeoutMS=10000,
            socketTimeoutMS=60000,
            connectTimeoutMS=60000
        )
        
        # Test connection
        print("🔍 Testing connection with ping...")
        client.admin.command('ping')
        print("✅ Successfully connected to MongoDB!")
        print()
        
        # Get database
        db = client[db_name]
        
        # List collections
        print("📊 Fetching collections...")
        collections = db.list_collection_names()
        
        if not collections:
            print("⚠️  No collections found. Database might be empty.")
        else:
            print(f"✅ Found {len(collections)} collections:")
            print()
            
            total_docs = 0
            for col in sorted(collections):
                try:
                    count = db[col].count_documents({})
                    total_docs += count
                    
                    # Get sample document to show structure
                    sample = db[col].find_one()
                    
                    print(f"   📁 {col}")
                    print(f"      └─ Documents: {count:,}")
                    
                    if sample:
                        keys = list(sample.keys())[:5]  # Show first 5 fields
                        print(f"      └─ Fields: {', '.join(keys)}{'...' if len(sample.keys()) > 5 else ''}")
                    
                except Exception as e:
                    print(f"   ⚠️  {col}: Error counting - {e}")
            
            print()
            print(f"📈 Total documents across all collections: {total_docs:,}")
        
        # Test write operation (optional - can be commented out)
        print()
        print("🧪 Testing write capability...")
        try:
            test_collection = db['_connection_test']
            result = test_collection.insert_one({'test': True, 'timestamp': str(os.getenv('COMPUTERNAME', 'unknown'))})
            print(f"✅ Write test successful! Inserted ID: {result.inserted_id}")
            # Clean up test document
            test_collection.delete_one({'_id': result.inserted_id})
            print("✅ Cleanup successful")
        except Exception as e:
            print(f"⚠️  Write test failed: {e}")
            print("   (This might be a permissions issue)")
        
        print()
        print("=" * 60)
        print("✅ ATLAS CONNECTION TEST PASSED!")
        print("=" * 60)
        print()
        print("Next steps:")
        print("1. Your application is ready to use MongoDB Atlas")
        print("2. Start your backend: .\\start_backend.bat")
        print("3. Test your API endpoints")
        print()
        
        client.close()
        return True
        
    except Exception as e:
        print()
        print("=" * 60)
        print("❌ CONNECTION TEST FAILED")
        print("=" * 60)
        print()
        print(f"Error: {e}")
        print()
        print("💡 Common issues and solutions:")
        print()
        print("1️⃣  Authentication Failed")
        print("   → Check username and password in MONGO_URI")
        print("   → Ensure special characters are URL encoded")
        print("   → Verify database user exists in Atlas")
        print()
        print("2️⃣  Network Timeout / IP Not Whitelisted")
        print("   → Add your IP in Atlas → Network Access")
        print("   → Or allow 0.0.0.0/0 for development")
        print("   → Wait 2-3 minutes after adding IP")
        print()
        print("3️⃣  DNS Resolution Failed")
        print("   → Check your internet connection")
        print("   → Disable VPN and try again")
        print("   → Verify cluster URL is correct")
        print()
        print("4️⃣  SSL/TLS Certificate Issues")
        print("   → Add '&tlsAllowInvalidCertificates=true' to URI (dev only)")
        print()
        print("5️⃣  Connection String Format")
        print("   ✅ Correct: mongodb+srv://user:pass@cluster.mongodb.net/")
        print("   ❌ Wrong:   mongodb://cluster.mongodb.net/ (missing srv)")
        print()
        
        return False

if __name__ == "__main__":
    test_atlas_connection()

