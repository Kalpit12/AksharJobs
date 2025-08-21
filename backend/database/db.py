from pymongo import MongoClient
from dotenv import load_dotenv
import logging
import os
load_dotenv()

# Get MongoDB URI from environment variables
MONGO_URI = os.getenv("MONGO_URI")
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def get_mongo_client():
    if not MONGO_URI:
        logging.error("MONGO_URI environment variable not set.")
        return None

    try:
        client = MongoClient(MONGO_URI, tls=True)  
        logging.info("Connected to MongoDB successfully")
        return client
    except Exception as e:
        logging.error(f"Error connecting to MongoDB: {e}")
        return None

def get_db(client, db_name='resume_parser'):
    if client:  # Check if client is valid before trying to get the db
        db = client[db_name]
        return db
    else:
        logging.error("No valid MongoDB client provided.")
        return None