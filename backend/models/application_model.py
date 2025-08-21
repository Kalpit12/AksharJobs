from bson import ObjectId
from pymongo import MongoClient

from config import MONGO_URI

client = MongoClient(MONGO_URI,socketTimeoutMS=60000,  
    connectTimeoutMS=60000)
db = client.get_database("resume_matcher")

application_collection = db.get_collection("application")

class ApplicationModel:
    @staticmethod
    def save_application(application_data):
        """ Save application results to the database, including matchScore """
        return application_collection.insert_one(application_data).inserted_id

    @staticmethod
    def get_applications(query):
        """Get all the applications"""
        applications = list(application_collection.find(query, {"_id": 0}))  
        return applications
    
    @staticmethod
    def get_application_by_user(user_id):
        """ Retrieve all job applications for a specific user """
        return list(application_collection.find({"userId": user_id}))

    @staticmethod
    def get_application_by_job(job_id):
        """ Retrieve all job applications for a specific job """
        return list(application_collection.find({"jobId": job_id}))

    def update_application_status(user_id, job_id, status, interview_date=None, interview_mode=None):
        """Update the application status and optionally interview details."""
        update_data = {"$set": {"status": status}}
        if interview_date:
            update_data["$set"]["interviewDate"] = interview_date
        if interview_mode:
            update_data["$set"]["interviewMode"] = interview_mode

        result = application_collection.update_one(
            {"userId": user_id, "jobId": job_id},
            update_data,
        )
        return result.modified_count > 0
    
    @staticmethod
    def get_application_by_id(application_id):
        """ Retrieve application by its ID """
        return application_collection.find_one({"_id": ObjectId(application_id)})
