from bson import ObjectId
from flask import Blueprint, request, jsonify
from services.job_service import get_all_jobs, get_jobs_by_user,get_job_by_id,update_job
from models.job_model import jobs_collection
from datetime import datetime
from models.user_model import users_collection

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

@job_routes.route("/recommended/<user_id>", methods=["GET"])
def get_recommended_jobs(user_id):
    """
    Retrieves AI-recommended job postings for a specific user.
    URL Parameter:
        user_id (str): The ID of the user.
    Returns:
        JSON array of recommended job postings with match scores.
    """
    try:
        # Get user's resume data
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Check if user has a resume
        if "resume_data" not in user or not user["resume_data"]:
            return jsonify({"error": "User has no resume uploaded"}), 404
        
        # Get all available jobs
        all_jobs = list(jobs_collection.find())
        if not all_jobs:
            return jsonify({"error": "No jobs available"}), 404
        
        recommended_jobs = []
        
        # Calculate match score for each job
        for job in all_jobs:
            try:
                # Use the existing match score calculation logic
                from utils.match_result import hybrid_score
                
                # Get user's resume data
                resume_data = user["resume_data"]
                
                # Extract skills properly from the nested structure
                if 'skills' in resume_data and isinstance(resume_data['skills'], dict):
                    # Handle nested skills structure
                    technical_skills = resume_data['skills'].get('technical_skills', [])
                    soft_skills = resume_data['skills'].get('soft_skills', [])
                    languages = resume_data['skills'].get('languages', [])
                    all_skills = technical_skills + soft_skills + languages
                    
                    # Create a flattened skills list for the hybrid_score function
                    flattened_resume_data = resume_data.copy()
                    flattened_resume_data['skills'] = all_skills
                else:
                    flattened_resume_data = resume_data
                
                # Calculate hybrid match score
                # For now, use a default SBERT score of 0.5 since we're not calculating it here
                # In a full implementation, you would calculate this using the SBERT model
                default_sbert_score = 0.5
                score_result = hybrid_score(default_sbert_score, flattened_resume_data, job)
                
                # Calculate final score from individual scores
                # Weight the scores: 40% skills, 30% education, 20% experience, 10% SBERT
                final_score = (
                    (score_result.get('skill_score', 0) * 0.4) +
                    (score_result.get('education_score', 0) * 0.3) +
                    (score_result.get('experience_score', 0) * 0.2) +
                    (default_sbert_score * 100 * 0.1)
                )
                
                # Add match score to job data
                job["_id"] = str(job["_id"])
                job["match_score"] = round(final_score, 1)
                job["score_breakdown"] = score_result
                
                # Convert datetime to string for JSON serialization
                if "posted_date" in job and isinstance(job["posted_date"], datetime):
                    job["posted_date"] = job["posted_date"].isoformat()
                if "created_at" in job and isinstance(job["created_at"], datetime):
                    job["created_at"] = job["created_at"].isoformat()
                if "application_deadline" in job and isinstance(job["application_deadline"], datetime):
                    job["application_deadline"] = job["application_deadline"].isoformat()
                
                recommended_jobs.append(job)
                
            except Exception as e:
                print(f"Error calculating match score for job {job.get('_id', 'unknown')}: {str(e)}")
                continue
        
        # Sort jobs by match score in descending order (highest match first)
        recommended_jobs.sort(key=lambda x: x.get("match_score", 0), reverse=True)
        
        # Limit to top 20 recommendations
        top_recommendations = recommended_jobs[:20]
        
        return jsonify({
            "message": "AI recommendations generated successfully",
            "recommendations": top_recommendations,
            "total_jobs_analyzed": len(all_jobs),
            "recommendations_count": len(top_recommendations)
        }), 200
        
    except Exception as e:
        print(f"Error in get_recommended_jobs: {str(e)}")
        return jsonify({"error": f"Failed to generate recommendations: {str(e)}"}), 500
