import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env files
load_dotenv('.env.production')
load_dotenv('.env.local')
load_dotenv('.env')

# Get MongoDB URI and Database Name from .env
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "TalentMatchDB")  # Main application database

# Global connection variables
_client = None
_db = None

def get_db():
    """Establishes connection with MongoDB and returns the database object."""
    global _client, _db
    
    try:
        # Use cached connection if available and healthy
        if _client is not None and _db is not None:
            try:
                # Test if connection is still alive
                _db.command('ping')
                return _db
            except:
                # Connection is stale, close it
                print("[DEBUG] Existing connection is stale, creating new one...")
                try:
                    _client.close()
                except:
                    pass
                _client = None
                _db = None
        
        # Create new connection
        print("[DEBUG] Creating new MongoDB connection...")
        _client = MongoClient(
            MONGO_URI, 
            socketTimeoutMS=60000, 
            connectTimeoutMS=60000,
            maxPoolSize=50,
            minPoolSize=10,
            maxIdleTimeMS=45000,
            serverSelectionTimeoutMS=60000
        )
        _db = _client[DB_NAME]
        
        # Test the connection
        _db.command('ping')
        print(f"[OK] MongoDB connected successfully!")
        print(f"[DEBUG] Connected to URI: {MONGO_URI[:40]}...")
        print(f"[DEBUG] Database name: {DB_NAME}")
        if _db is not None:
            print(f"[DEBUG] Database object: {_db.name}")
        return _db
        
    except Exception as e:
        print(f"[ERROR] Error connecting to MongoDB: {e}")
        import traceback
        traceback.print_exc()
        # Reset connection variables on error
        _client = None
        _db = None
        return None

def is_db_connected():
    """Check if database connection is working"""
    try:
        db = get_db()
        if db is not None:
            # Test the connection by running a simple command
            db.command('ping')
            return True
        return False
    except Exception as e:
        print(f"[ERROR] Database connection test failed: {e}")
        return False

def close_db_connection():
    """Close the database connection"""
    global _client, _db
    try:
        if _client:
            _client.close()
            print("[CLOSED] MongoDB connection closed")
    except Exception as e:
        print(f"[ERROR] Error closing MongoDB connection: {e}")
    finally:
        _client = None
        _db = None
