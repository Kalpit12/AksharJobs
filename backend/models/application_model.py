from bson import ObjectId
from pymongo import MongoClient
from datetime import datetime
from config import MONGO_URI

client = MongoClient(MONGO_URI,socketTimeoutMS=60000,  
    connectTimeoutMS=60000)
db = client.get_database("resume_matcher")

application_collection = db.get_collection("application")
application_tracking_collection = db.get_collection("application_tracking")

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
    
    @staticmethod
    def get_application_by_user_and_job(user_id, job_id):
        """ Retrieve a specific application for a user-job pair """
        return application_collection.find_one({"userId": user_id, "jobId": job_id})

    @staticmethod
    def update_application_status(user_id, job_id, status, interview_date=None, interview_mode=None, notes=None):
        """Update the application status and optionally interview details."""
        update_data = {"$set": {"status": status, "last_updated": datetime.now().isoformat()}}
        if interview_date:
            update_data["$set"]["interviewDate"] = interview_date
        if interview_mode:
            update_data["$set"]["interviewMode"] = interview_mode
        if notes:
            update_data["$set"]["notes"] = notes

        result = application_collection.update_one(
            {"userId": user_id, "jobId": job_id},
            update_data,
        )
        
        # Create tracking record
        if result.modified_count > 0:
            ApplicationModel.create_tracking_record(user_id, job_id, status, notes)
        
        return result.modified_count > 0
    
    @staticmethod
    def get_application_by_id(application_id):
        """ Retrieve application by its ID """
        return application_collection.find_one({"_id": ObjectId(application_id)})
    
    @staticmethod
    def create_tracking_record(user_id, job_id, status, notes=None):
        """Create a tracking record for application status change"""
        tracking_record = {
            "userId": user_id,
            "jobId": job_id,
            "status": status,
            "notes": notes,
            "timestamp": datetime.now().isoformat(),
            "created_at": datetime.now()
        }
        return application_tracking_collection.insert_one(tracking_record).inserted_id
    
    @staticmethod
    def get_tracking_history(user_id, job_id=None):
        """Get tracking history for a user or specific application"""
        query = {"userId": user_id}
        if job_id:
            query["jobId"] = job_id
        
        return list(application_tracking_collection.find(query).sort("created_at", -1))
    
    @staticmethod
    def get_applications_with_tracking(user_id):
        """Get applications with their tracking history"""
        applications = ApplicationModel.get_application_by_user(user_id)
        
        for app in applications:
            app['tracking_history'] = ApplicationModel.get_tracking_history(user_id, app.get('jobId'))
            app['_id'] = str(app['_id'])
        
        return applications
    
    @staticmethod
    def get_candidates_for_recruiter(recruiter_id):
        """Get all candidates who applied to jobs posted by a recruiter"""
        # First get all jobs posted by the recruiter
        jobs = list(db.jobs.find({"posted_by": ObjectId(recruiter_id)}))
        job_ids = [job['_id'] for job in jobs]
        
        # Get all applications for these jobs
        applications = list(application_collection.find({"jobId": {"$in": job_ids}}))
        
        # Add tracking history and job details
        for app in applications:
            app['tracking_history'] = ApplicationModel.get_tracking_history(app['userId'], app['jobId'])
            app['_id'] = str(app['_id'])
            app['jobId'] = str(app['jobId'])
            app['userId'] = str(app['userId'])
            
            # Add job details
            job = next((j for j in jobs if j['_id'] == ObjectId(app['jobId'])), None)
            if job:
                app['job_title'] = job.get('job_title', '')
                app['company_name'] = job.get('company_name', '')
        
        return applications
