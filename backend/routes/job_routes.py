from bson import ObjectId
from flask import Blueprint, request, jsonify
from services.job_service import get_all_jobs, get_jobs_by_user,get_job_by_id,update_job
from models.job_model import jobs_collection
from datetime import datetime

job_routes = Blueprint("job_routes", __name__)

@job_routes.route("/add_job", methods=["POST"])
def add_job():
    """
    Allows recruiters to post a new job.

    Returns:
        JSON response with success message and HTTP status code 201.
    """
    data = request.json

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
    print("Adding job...")
    jobs_collection.insert_one(job)
    return jsonify({"message": "Job posted successfully"}), 201


@job_routes.route("/update_job/<job_id>", methods=["PUT"])
def update_job_route(job_id):
    """
    Allows recruiters to update job details.

    URL Parameter:
        job_id (str): The ID of the job to update.

    Returns:
        JSON response with success message and HTTP status code 200.
    """
    data = request.json
    update_job(job_id, data)
    return jsonify({"message": "Job updated successfully"}), 200

@job_routes.route("/get_job/<job_id>", methods=["GET"])
def get_job(job_id):
    """
    Fetches job details by job ID.

    URL Parameter:
        job_id (str): The ID of the job to fetch.

    Returns:
        JSON response containing job details if found, otherwise an error message.
    """
    job = get_job_by_id(job_id)
    if job:
        return jsonify(job), 200
    return jsonify({"error": "Job not found"}), 404

@job_routes.route("/get_jobs", methods=["GET"])
def fetch_all_jobs():
    """
    Fetches all job listings.

    Returns:
        JSON response containing a list of all jobs.
    """
    jobs = get_all_jobs()
    return jsonify(jobs), 200

@job_routes.route("/jobs_by_user/<user_id>", methods=["GET"])
def fetch_jobs_by_user(user_id):
    """
    Fetches all jobs posted by a specific recruiter.

    URL Parameter:
        user_id (str): The ID of the recruiter.

    Returns:
        JSON response containing a list of jobs posted by the user.
    """
    jobs = get_jobs_by_user(user_id)
    return jsonify(jobs), 200

@job_routes.route("/increase_views/<job_id>", methods=["POST"])
def increase_views(job_id):
    """
    Increments the view count of a job post.

    URL Parameter:
        job_id (str): The ID of the job.

    Returns:
        JSON response confirming the view count update.
    """
    try:
        print("Updating view...")
        jobs_collection.update_one({"_id": ObjectId(job_id)}, {"$inc": {"views": 1}})
        return jsonify({"message": "View count updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@job_routes.route("/apply/<job_id>", methods=["POST"])
def apply_to_job(job_id):
    """
    Allows a user to apply for a job.

    URL Parameter:
        job_id (str): The ID of the job.

    Returns:
        JSON response confirming the application or an error message.
    """
    try:
        data = request.json
        applicant_id = data.get("applicant_id")

        print("Adding applicants...")
        if not applicant_id:
            return jsonify({"error": "Applicant ID required"}), 400

        jobs_collection.update_one(
            {"_id": ObjectId(job_id)},
            {"$addToSet": {"applicants": applicant_id}, "$inc": {"applicants_count": 1}}
        )
        return jsonify({"message": "Application successful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
