import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get MongoDB URI and Database Name from .env
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "resume_matcher")  # Plans are in resume_matcher database

def get_db():
    """Establishes connection with MongoDB and returns the database object."""
    try:
        client = MongoClient(MONGO_URI,socketTimeoutMS=60000,  
    connectTimeoutMS=60000)
        db = client[DB_NAME]
        print(" MongoDB connected successfully!")  
        return db
    except Exception as e:
        print(f" Error connecting to MongoDB: {e}") 
        return None
