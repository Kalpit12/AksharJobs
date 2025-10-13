from pymongo import MongoClient
from dotenv import load_dotenv
import logging
import os
load_dotenv('.edn.local')

# Get MongoDB URI from environment variables
MONGO_URI = os.getenv("MONGO_URI")
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def get_mongo_client():
    if not MONGO_URI:
        logging.error("MONGO_URI environment variable not set.")
        return None

    try:
        # For MongoDB Atlas, explicitly enable SSL/TLS
        client = MongoClient(MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)  
        logging.info("Connected to MongoDB successfully")
        return client
    except Exception as e:
        logging.error(f"Error connecting to MongoDB: {e}")
        return None

def get_db(client, db_name=None):
    if client:  # Check if client is valid before trying to get the db
        if db_name is None:
            # Use environment variable if no db_name provided
            from config import DB_NAME
            db_name = DB_NAME or 'TalentMatchDB'
        db = client[db_name]
        return db
    else:
        logging.error("No valid MongoDB client provided.")
        return None