from bson import ObjectId
from models.job_model import jobs_collection
from datetime import datetime

def create_job(data):
    """
    Inserts a new job into the database.

    Args:
        data (dict): Job details including recruiter_id, job title, company info, industry, location, job type, 
                     salary, experience, required skills, responsibilities, education, deadline, and description.

    Returns:
        str: The inserted job's ID as a string.
    """
    job = {
        "recruiter_id": data.get("recruiter_id", ""),
        "job_title": data["jobTitle"],
        "company_name": data["companyName"],
        "company_website": data["companyWebsite"],
        "industry": data["industry"],
        "location": data["location"],
        "remote_option": data["remoteOption"],
        "job_type": data["jobType"],
        "salary_range": data["salaryRange"],
        "experience_required": data["experience"],
        "required_skills": data["skills"],
        "responsibilities": data["responsibilities"],
        "education_required": data["education"],
        "application_deadline": data["deadline"],
        "description": data["description"],
        "views": 0,
        "applicants": [],
        "created_at": datetime.utcnow(),
    }

    result= jobs_collection.insert_one(job)
    return str(result.inserted_id)

def get_job_by_id(job_id):
    """
    Fetches a job by its ID.

    Args:
        job_id (str): The ID of the job.

    Returns:
        dict or None: The job details if found, otherwise None.
    """
    print("Getting job by Id...")
    job = jobs_collection.find_one({"_id": ObjectId(job_id)})
    if job:
        job["_id"] = str(job["_id"])  # Convert ObjectId to string
    return job

def get_all_jobs():
    """
    Fetches all job listings.

    Returns:
        list: A list of job dictionaries with job IDs converted to strings.
    """
    print("Getting jobs...")
    jobs = jobs_collection.find({})
    return [{**job, "_id": str(job["_id"])} for job in jobs] # Exclude _id for frontend compatibility

def get_jobs_by_user(user_id):
    """
    Fetches all jobs posted by a specific recruiter.

    Args:
        user_id (str): The recruiter’s user ID.

    Returns:
        list: A list of job dictionaries posted by the recruiter.
    """
    print("Getting job by user...")
    jobs = jobs_collection.find({"recruiter_id": user_id})
    return [{**job, "_id": str(job["_id"])} for job in jobs]

def update_job(job_id, update_data):
    """Update job details."""
    return jobs_collection.update_one({"_id": ObjectId(job_id)}, {"$set": update_data})