from bson import ObjectId
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.job_service import get_all_jobs, get_jobs_by_user,get_job_by_id,update_job
from models.job_model import jobs_collection
from datetime import datetime
from utils.db import get_db
import json
import random

job_routes = Blueprint("job_routes", __name__)

def convert_objectids_to_strings(obj):
    """Recursively convert all ObjectId instances to strings for JSON serialization"""
    if isinstance(obj, dict):
        return {key: convert_objectids_to_strings(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_objectids_to_strings(item) for item in obj]
    elif isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, datetime):
        return obj.isoformat()
    else:
        return obj

@job_routes.route("/add_job", methods=["POST"])
@jwt_required(optional=True)
def add_job():
    """
    Allows recruiters to post a new job.
    Supports both old and new data formats.

    Returns:
        JSON response with success message and HTTP status code 201.
    """
    data = request.json
    
    # Get recruiter ID from JWT or request data
    try:
        from flask_jwt_extended import get_jwt_identity
        jwt_user_id = get_jwt_identity()
        recruiter_id = jwt_user_id if jwt_user_id else data.get("recruiter_id", "")
    except:
        recruiter_id = data.get("recruiter_id", "")
    
    print(f"📝 Job posting request from recruiter: {recruiter_id}")
    print(f"📋 Request data: {data}")
    
    # Get database connection
    db = get_db()
    
    # Initialize variables
    free_job_posts = 0
    subscription_plan = 'Basic'
    
    # Check if recruiter has free job posts or is premium
    if recruiter_id:
        try:
            from bson import ObjectId
            user = db.users.find_one({'_id': ObjectId(recruiter_id)})
            if user:
                user_type = user.get('userType', '')
                if user_type == 'recruiter':
                    # Check for free job posts
                    free_job_posts = user.get('free_job_posts', 0)
                    subscription_plan = user.get('subscription', {}).get('plan', 'Basic')
                    
                    print(f"💳 Recruiter has {free_job_posts} free job posts, plan: {subscription_plan}")
                    
                    if free_job_posts <= 0 and subscription_plan == 'Basic':
                        return jsonify({
                            'error': 'No free job posts remaining',
                            'message': 'Use a promo code to get free job posts or upgrade to premium!',
                            'requires_promo': True
                        }), 402  # Payment Required
        except Exception as e:
            print(f"Error checking recruiter credits: {e}")

    # Support both old format (camelCase) and new format (snake_case)
    # Extract job data with fallbacks for both formats
    job_title = data.get("jobTitle") or data.get("title") or ""
    company_name = data.get("companyName") or data.get("company") or ""
    company_website = data.get("companyWebsite") or data.get("company_website") or ""
    industry = data.get("industry") or ""
    location = data.get("location") or ""
    remote_option = data.get("remoteOption") or data.get("work_mode") or "On-site"
    job_type = data.get("jobType") or data.get("job_type") or "Full-time"
    
    # Handle salary range - support both formats
    salary_range = data.get("salaryRange") or data.get("salary_range") or ""
    if not salary_range and data.get("salary_min") and data.get("salary_max"):
        currency = data.get("salary_currency", "USD")
        period = data.get("salary_period", "yearly")
        salary_range = f"{currency} {data.get('salary_min')} - {data.get('salary_max')} {period}"
    
    experience_required = data.get("experience") or data.get("experience_level") or ""
    
    # Handle skills - support both formats
    required_skills = data.get("skills") or data.get("required_skills") or ""
    if isinstance(required_skills, list):
        required_skills = ", ".join(required_skills)
    
    responsibilities = data.get("responsibilities") or ""
    requirements = data.get("requirements") or ""
    education_required = data.get("education") or data.get("education_required") or ""
    benefits = data.get("benefits") or ""
    application_deadline = data.get("deadline") or data.get("application_deadline") or ""
    description = data.get("description") or ""

    job = {
        "recruiter_id": recruiter_id,  
        "job_title": job_title,
        "company_name": company_name,
        "company_website": company_website,
        "industry": industry,
        "location": location,
        "remote_option": remote_option, 
        "job_type": job_type,  
        "salary_range": salary_range,
        "experience_required": experience_required,
        "required_skills": required_skills,
        "responsibilities": responsibilities,
        "requirements": requirements,
        "education_required": education_required,
        "benefits": benefits,
        # Community-related fields
        "target_communities": data.get("target_communities", []),
        "all_communities": data.get("all_communities", False),
        "community_requirements": data.get("community_requirements", ""),
        "application_deadline": application_deadline,
        "description": description,
        "views": 0,
        "applicants": [],
        "created_at": datetime.utcnow(),
        # Additional fields for new format
        "salary_min": data.get("salary_min", ""),
        "salary_max": data.get("salary_max", ""),
        "salary_currency": data.get("salary_currency", "USD"),
        "salary_period": data.get("salary_period", "yearly"),
        "work_mode": data.get("work_mode", remote_option),
        "experience_level": data.get("experience_level", experience_required),
    }
    
    print(f"✅ Creating job posting: {job_title} at {company_name}")
    result = jobs_collection.insert_one(job)
    
    # Consume free job post credit if recruiter
    if recruiter_id and result.inserted_id:
        try:
            from bson import ObjectId
            user = db.users.find_one({'_id': ObjectId(recruiter_id)})
            if user and user.get('userType') == 'recruiter':
                free_job_posts = user.get('free_job_posts', 0)
                subscription_plan = user.get('subscription', {}).get('plan', 'Basic')
                
                if free_job_posts > 0 and subscription_plan == 'Basic':
                    # Consume one free job post
                    db.users.update_one(
                        {'_id': ObjectId(recruiter_id)},
                        {'$inc': {'free_job_posts': -1}}
                    )
                    print(f"✅ Consumed free job post credit for recruiter {recruiter_id}")
        except Exception as e:
            print(f"Error consuming job post credit: {e}")
    
    return jsonify({
        "message": "Job posted successfully",
        "job_id": str(result.inserted_id),
        "free_job_posts_remaining": max(0, free_job_posts - 1) if recruiter_id else None
    }), 201


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
    try:
        job = get_job_by_id(job_id)
        if job:
            # Convert ObjectIds to strings for JSON serialization
            serializable_job = convert_objectids_to_strings(job)
            return jsonify(serializable_job), 200
        return jsonify({"error": "Job not found"}), 404
    except Exception as e:
        print(f"Error fetching job {job_id}: {e}")
        return jsonify({"error": "Failed to fetch job", "details": str(e)}), 500

@job_routes.route("/get_jobs", methods=["GET"])
def fetch_all_jobs():
    """
    Fetches all job listings.

    Returns:
        JSON response containing a list of all jobs.
    """
    try:
        jobs = get_all_jobs()
        # Convert ObjectIds to strings for JSON serialization
        serializable_jobs = convert_objectids_to_strings(jobs)
        return jsonify(serializable_jobs), 200
    except Exception as e:
        print(f"Error fetching jobs: {e}")
        return jsonify({"error": "Failed to fetch jobs", "details": str(e)}), 500

@job_routes.route("/get_jobs_for_user", methods=["GET"])
def fetch_jobs_for_user():
    """
    Fetches jobs relevant to the user's communities.
    
    Query Parameters:
        userId (str): The user's ID to get their communities
    
    Returns:
        JSON response containing a list of relevant jobs.
    """
    try:
        user_id = request.args.get('userId')
        if not user_id:
            # If no user ID, return all jobs (backward compatibility)
            jobs = get_all_jobs()
            serializable_jobs = convert_objectids_to_strings(jobs)
            return jsonify(serializable_jobs), 200
        
        # Get user's communities
        from utils.db import get_db
        db = get_db()
        user = db.users.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        user_communities = user.get("communities", [])
        user_primary_community = user.get("primary_community", "")
        
        # If user has no communities, return all jobs
        if not user_communities and not user_primary_community:
            jobs = get_all_jobs()
            serializable_jobs = convert_objectids_to_strings(jobs)
            return jsonify(serializable_jobs), 200
        
        # Get all jobs and filter by communities
        all_jobs = jobs_collection.find({})
        relevant_jobs = []
        
        for job in all_jobs:
            # Convert ObjectId to string for consistency
            job["_id"] = str(job["_id"])
            
            # If job targets all communities, include it
            if job.get("all_communities", False):
                relevant_jobs.append(job)
                continue
            
            # Check if job targets any of user's communities
            job_communities = job.get("target_communities", [])
            
            # Convert ObjectIds to strings for comparison
            job_community_strings = [str(community_id) for community_id in job_communities]
            user_community_strings = [str(community_id) for community_id in user_communities]
            
            # Add primary community if it exists
            if user_primary_community:
                user_community_strings.append(str(user_primary_community))
            
            # Check for overlap
            if any(community in user_community_strings for community in job_community_strings):
                relevant_jobs.append(job)
            elif not job_communities:
                # If job has no community targeting, include it (backward compatibility)
                relevant_jobs.append(job)
        
        # Convert ObjectIds to strings for JSON serialization
        serializable_jobs = convert_objectids_to_strings(relevant_jobs)
        return jsonify(serializable_jobs), 200
        
    except Exception as e:
        print(f"Error fetching jobs for user: {e}")
        return jsonify({"error": "Failed to fetch jobs", "details": str(e)}), 500

@job_routes.route("/test", methods=["GET"])
def test_jobs_endpoint():
    """
    Test endpoint to verify jobs routing is working.
    """
    return jsonify({
        "message": "Jobs endpoint is working!",
        "status": "success",
        "timestamp": datetime.utcnow().isoformat()
    }), 200

@job_routes.route("/jobs_by_user/<user_id>", methods=["GET"])
def fetch_jobs_by_user(user_id):
    """
    Fetches all jobs posted by a specific recruiter.

    URL Parameter:
        user_id (str): The ID of the recruiter.

    Returns:
        JSON response containing a list of jobs posted by the user.
    """
    try:
        jobs = get_jobs_by_user(user_id)
        # Convert ObjectIds to strings for JSON serialization
        serializable_jobs = convert_objectids_to_strings(jobs)
        return jsonify(serializable_jobs), 200
    except Exception as e:
        print(f"Error fetching jobs by user {user_id}: {e}")
        return jsonify({"error": "Failed to fetch jobs", "details": str(e)}), 500

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
        # Get database connection
        db = get_db()
        if db is None:
            return jsonify({"error": "Database connection failed"}), 500
        
        users_collection = db.users
        
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
                job["match_score"] = round(final_score, 1)
                job["score_breakdown"] = score_result
                
                # Convert all ObjectId and datetime fields to strings for JSON serialization
                job_serializable = convert_objectids_to_strings(job)
                
                recommended_jobs.append(job_serializable)
                
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
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Failed to generate recommendations: {str(e)}"}), 500

@job_routes.route("/saved", methods=["GET"])
@jwt_required()
def get_saved_jobs():
    """Get saved jobs for the current user"""
    try:
        current_user_id = get_jwt_identity()
        db = get_db()
        users_collection = db.users
        
        # Convert string ID to ObjectId
        try:
            user_object_id = ObjectId(current_user_id)
        except Exception as e:
            print(f"Invalid user ID format: {current_user_id}, error: {e}")
            return jsonify({"error": "Invalid user ID format"}), 400
        
        user = users_collection.find_one({'_id': user_object_id})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Get saved job IDs from user profile
        saved_job_ids = user.get('savedJobs', [])
        
        if not saved_job_ids:
            return jsonify([]), 200
        
        # Convert saved job IDs to ObjectIds
        try:
            saved_job_object_ids = [ObjectId(job_id) for job_id in saved_job_ids]
        except Exception as e:
            print(f"Error converting job IDs to ObjectIds: {e}")
            return jsonify({"error": "Invalid job ID format"}), 400
        
        # Fetch saved jobs from jobs collection
        jobs_collection = db.jobs
        saved_jobs = list(jobs_collection.find({'_id': {'$in': saved_job_object_ids}}))
        
        # Convert ObjectIds to strings for JSON serialization
        serializable_jobs = convert_objectids_to_strings(saved_jobs)
        
        return jsonify(serializable_jobs), 200
        
    except Exception as e:
        print(f"Error fetching saved jobs: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch saved jobs"}), 500

@job_routes.route("/recommended", methods=["GET"])
@jwt_required()
def get_recommended_jobs_for_user():
    """Get recommended jobs for the current user"""
    try:
        current_user_id = get_jwt_identity()
        print(f"Getting recommended jobs for user: {current_user_id}")
        
        # Get all jobs
        all_jobs = get_all_jobs()
        if not all_jobs:
            return jsonify([]), 200
        
        recommended_jobs = []
        
        # For now, return a subset of jobs as recommendations
        # In the future, this should implement proper recommendation logic
        for job in all_jobs[:10]:  # Limit to 10 recommendations
            try:
                # Convert all ObjectId and datetime fields to strings for JSON serialization
                job_serializable = convert_objectids_to_strings(job)
                
                # Add a simple match score (random for now)
                job_serializable["match_score"] = round(random.uniform(60, 95), 1)
                
                recommended_jobs.append(job_serializable)
                
            except Exception as e:
                print(f"Error processing job {job.get('_id', 'unknown')}: {str(e)}")
                continue
        
        # Sort jobs by match score in descending order (highest match first)
        recommended_jobs.sort(key=lambda x: x.get("match_score", 0), reverse=True)
        
        return jsonify(recommended_jobs), 200
        
    except Exception as e:
        print(f"Error in get_recommended_jobs_for_user: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to get recommended jobs"}), 500


@job_routes.route("/recruiter", methods=["GET"])
@jwt_required()
def get_recruiter_jobs():
    """
    Get all jobs posted by the current recruiter
    """
    try:
        recruiter_id = get_jwt_identity()
        
        if not recruiter_id:
            return jsonify({'error': 'Authentication required'}), 401
        
        print(f"Fetching jobs for recruiter: {recruiter_id}")
        
        # Get database connection
        db = get_db()
        if db is None:
            print("Database connection failed")
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Try to find jobs by recruiter_id (could be string or ObjectId)
        try:
            # First try as ObjectId
            jobs = list(db.jobs.find({'recruiter_id': ObjectId(recruiter_id)}))
        except:
            # If that fails, try as string
            jobs = list(db.jobs.find({'recruiter_id': recruiter_id}))
        
        print(f"Found {len(jobs)} jobs for recruiter {recruiter_id}")
        
        # Convert ObjectIds to strings for JSON serialization
        serializable_jobs = convert_objectids_to_strings(jobs)
        
        return jsonify(serializable_jobs), 200
        
    except Exception as e:
        print(f"Error fetching recruiter jobs: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to fetch jobs', 'details': str(e)}), 500