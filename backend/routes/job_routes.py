from bson import ObjectId
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.job_service import get_all_jobs, get_jobs_by_user,get_job_by_id,update_job
from models.job_model import jobs_collection
from utils.db import get_db
from datetime import datetime
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
    
    # Get fresh database connection
    db = get_db()
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    # FREE JOB POSTS DISABLED - Recruiters can post unlimited jobs
    print(f"✅ Unlimited job posting enabled for all recruiters")

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
    
    # Handle skills - keep as array for frontend compatibility
    required_skills = data.get("skills") or data.get("required_skills") or []
    if isinstance(required_skills, str):
        # If it's a string, convert to array by splitting on comma
        required_skills = [skill.strip() for skill in required_skills.split(",") if skill.strip()]
    elif not isinstance(required_skills, list):
        required_skills = []
    
    responsibilities = data.get("responsibilities") or ""
    requirements = data.get("requirements") or ""
    education_required = data.get("education") or data.get("education_required") or ""
    
    # Handle benefits - keep as array for frontend compatibility
    benefits = data.get("benefits") or []
    if isinstance(benefits, str):
        # If it's a string, convert to array by splitting on comma
        benefits = [benefit.strip() for benefit in benefits.split(",") if benefit.strip()]
    elif not isinstance(benefits, list):
        benefits = []
    
    # Handle perks - keep as array
    perks = data.get("perks") or []
    if isinstance(perks, str):
        perks = [perk.strip() for perk in perks.split(",") if perk.strip()]
    elif not isinstance(perks, list):
        perks = []
    
    # Handle tools - keep as array or string
    tools = data.get("tools") or ""
    
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
        "required_skills": required_skills,  # Array
        "responsibilities": responsibilities,
        "requirements": requirements,
        "education_required": education_required,
        "benefits": benefits,  # Array
        "perks": perks,  # Array
        "tools": tools,  # String
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
        "salary_type": data.get("salary_type", ""),
        "work_mode": data.get("work_mode", remote_option),
        "experience_level": data.get("experience_level", experience_required),
        "department": data.get("department", ""),
        "vacancies": data.get("vacancies", 1),
        "country": data.get("country", ""),
        "state": data.get("state", ""),
        "city": data.get("city", ""),
        "office_address": data.get("office_address", ""),
        "postal_code": data.get("postal_code", ""),
        "preferred_joining_date": data.get("preferred_joining_date", ""),
        "apply_method": data.get("apply_method", "Apply through AksharJobs portal"),
        "contact_email": data.get("contact_email", ""),
        "hr_name": data.get("hr_name", ""),
        "visibility": data.get("visibility", "public"),
        "company_overview": data.get("company_overview", ""),
    }
    
    print(f"✅ Creating job posting: {job_title} at {company_name}")
    
    # Insert the job using the database connection
    result = db.jobs.insert_one(job)
    
    if not result.inserted_id:
        return jsonify({"error": "Failed to create job posting"}), 500
    
    print(f"✅ Job posted successfully with ID: {result.inserted_id}")
    
    return jsonify({
        "message": "Job posted successfully",
        "job_id": str(result.inserted_id)
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
    try:
        if not job_id:
            return jsonify({"error": "Job ID is required"}), 400
        
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate ObjectId format
        try:
            ObjectId(job_id)
        except Exception as e:
            return jsonify({"error": "Invalid job ID format"}), 400
        
        update_job(job_id, data)
        return jsonify({"message": "Job updated successfully"}), 200
    except Exception as e:
        print(f"Error updating job {job_id}: {str(e)}")
        return jsonify({"error": "Failed to update job", "details": str(e)}), 500

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

@job_routes.route("/get_internships", methods=["GET"])
def fetch_internships():
    """
    Fetches only internship listings.

    Returns:
        JSON response containing a list of internships only.
    """
    try:
        db = get_db()
        if db is None:
            print("ERROR: No database connection")
            return jsonify({"error": "Database connection failed"}), 500
        
        # Filter for internships only
        internships = db.jobs.find({
            "$or": [
                {"job_type": "Internship"},
                {"type": "Internship"},
                {"jobType": "Internship"}
            ]
        })
        
        # Convert ObjectIds to strings for JSON serialization
        serializable_internships = convert_objectids_to_strings(list(internships))
        print(f"🎯 Found {len(serializable_internships)} internships")
        return jsonify(serializable_internships), 200
    except Exception as e:
        print(f"Error fetching internships: {e}")
        return jsonify({"error": "Failed to fetch internships", "details": str(e)}), 500

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
        if not job_id:
            return jsonify({"error": "Job ID is required"}), 400
        
        print("Updating view...")
        # Validate ObjectId format
        try:
            job_object_id = ObjectId(job_id)
        except Exception as e:
            print(f"Invalid job ID format: {job_id}")
            return jsonify({"error": "Invalid job ID format"}), 400
        
        result = jobs_collection.update_one({"_id": job_object_id}, {"$inc": {"views": 1}})
        
        if result.matched_count == 0:
            return jsonify({"error": "Job not found"}), 404
        
        return jsonify({"message": "View count updated successfully"}), 200
    except Exception as e:
        print(f"Error updating view count: {str(e)}")
        return jsonify({"error": "Failed to update view count"}), 500
    

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
        if not job_id:
            return jsonify({"error": "Job ID is required"}), 400
        
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        applicant_id = data.get("applicant_id")

        print("Adding applicants...")
        if not applicant_id:
            return jsonify({"error": "Applicant ID required"}), 400

        # Validate ObjectId format
        try:
            job_object_id = ObjectId(job_id)
        except Exception as e:
            print(f"Invalid job ID format: {job_id}")
            return jsonify({"error": "Invalid job ID format"}), 400

        result = jobs_collection.update_one(
            {"_id": job_object_id},
            {"$addToSet": {"applicants": applicant_id}, "$inc": {"applicants_count": 1}}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Job not found"}), 404
        
        return jsonify({"message": "Application successful"}), 200
    except Exception as e:
        print(f"Error applying to job: {str(e)}")
        return jsonify({"error": "Failed to apply to job", "details": str(e)}), 500

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
    """Get recommended jobs for the current user based on preferred job titles"""
    try:
        current_user_id = get_jwt_identity()
        print(f"🎯 Getting recommended jobs for user: {current_user_id}")
        
        # Get database connection
        db = get_db()
        
        # Get user's profile to extract preferred job titles
        user = None
        try:
            user = db.users.find_one({'_id': ObjectId(current_user_id)})
        except:
            user = db.users.find_one({'_id': current_user_id})
        
        # Extract preferred job titles from user profile
        preferred_titles = []
        if user and user.get('preferredJobTitles'):
            # Parse comma-separated job titles
            titles_str = user.get('preferredJobTitles', '')
            preferred_titles = [title.strip().lower() for title in titles_str.split(',') if title.strip()]
            print(f"📋 User's preferred job titles: {preferred_titles}")
        
        # Get user's skills for additional matching
        user_skills = []
        if user:
            core_skills = user.get('coreSkills', [])
            skills = user.get('skills', [])
            if isinstance(core_skills, list):
                user_skills.extend([s.lower() for s in core_skills if s])
            elif isinstance(core_skills, str):
                user_skills.extend([s.strip().lower() for s in core_skills.split(',') if s.strip()])
            if isinstance(skills, list):
                user_skills.extend([s.lower() for s in skills if s])
            elif isinstance(skills, str):
                user_skills.extend([s.strip().lower() for s in skills.split(',') if s.strip()])
            user_skills = list(set(user_skills))  # Remove duplicates
            print(f"🔧 User's skills: {user_skills[:5]}...")  # Print first 5 skills
        
        # Get all jobs
        all_jobs = get_all_jobs()
        if not all_jobs:
            return jsonify([]), 200
        
        recommended_jobs = []
        
        # Calculate match score for each job
        for job in all_jobs:
            try:
                # Convert all ObjectId and datetime fields to strings for JSON serialization
                job_serializable = convert_objectids_to_strings(job)
                
                # Calculate match score based on preferred job titles and skills
                match_score = 0
                match_reasons = []
                
                job_title = job.get('title', '').lower()
                job_description = job.get('description', '').lower()
                job_skills = []
                
                # Extract job skills
                if 'requiredSkills' in job:
                    if isinstance(job['requiredSkills'], list):
                        job_skills.extend([s.lower() for s in job['requiredSkills'] if s])
                if 'skills' in job:
                    if isinstance(job['skills'], list):
                        job_skills.extend([s.lower() for s in job['skills'] if s])
                
                # Match based on preferred job titles (highest weight)
                if preferred_titles:
                    for preferred in preferred_titles:
                        if preferred in job_title:
                            match_score += 40  # Exact title match
                            match_reasons.append(f"Title matches: {preferred}")
                            break
                        elif any(word in job_title for word in preferred.split()):
                            match_score += 25  # Partial title match
                            match_reasons.append(f"Partial title match: {preferred}")
                            break
                        elif preferred in job_description:
                            match_score += 15  # Title mentioned in description
                            match_reasons.append(f"Mentioned in description: {preferred}")
                            break
                
                # Match based on skills (medium weight)
                if user_skills and job_skills:
                    matching_skills = set(user_skills) & set(job_skills)
                    if matching_skills:
                        skill_match_percentage = (len(matching_skills) / len(job_skills)) * 100
                        skill_score = min(30, skill_match_percentage * 0.3)  # Up to 30 points
                        match_score += skill_score
                        match_reasons.append(f"{len(matching_skills)} matching skills")
                
                # Base score for active jobs (low weight)
                if job.get('status') == 'active':
                    match_score += 10
                
                # Bonus for recent postings
                if 'postedDate' in job or 'postedAt' in job:
                    match_score += 5
                
                # Only include jobs with some relevance
                if match_score >= 15 or not preferred_titles:
                    job_serializable["match_score"] = round(min(match_score, 100), 1)
                    job_serializable["match_reasons"] = match_reasons
                    recommended_jobs.append(job_serializable)
                
            except Exception as e:
                print(f"Error processing job {job.get('_id', 'unknown')}: {str(e)}")
                continue
        
        # Sort jobs by match score in descending order (highest match first)
        recommended_jobs.sort(key=lambda x: x.get("match_score", 0), reverse=True)
        
        # Limit to top 20 recommendations
        top_recommendations = recommended_jobs[:20]
        
        print(f"✅ Returning {len(top_recommendations)} recommended jobs")
        if top_recommendations:
            print(f"🏆 Top match: {top_recommendations[0].get('title')} (Score: {top_recommendations[0].get('match_score')})")
        
        return jsonify(top_recommendations), 200
        
    except Exception as e:
        print(f"❌ Error in get_recommended_jobs_for_user: {str(e)}")
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