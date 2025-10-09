from pymongo import MongoClient
from config import MONGO_URI

client = MongoClient(MONGO_URI,socketTimeoutMS=60000,  # 60 seconds
    connectTimeoutMS=60000)
db = client.get_database("resume_matcher")

resume_collection = db.get_collection("resume_data")

# Ensure Indexing for Faster Lookups
resume_collection.create_index([("userId", 1)])
resume_collection.create_index([("published", 1)])  # For filtering published resumes
