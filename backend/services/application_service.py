from utils.match_result import hybrid_score
from utils.GeminiResult import get_gemini_free_result
from utils.sbert_match import compute_similarity
from models.application_model import ApplicationModel
from utils.application import evaluate_application
from services.resume_service import get_resumes_by_user
from services.job_service import get_job_by_id
from utils.db import get_db
from bson import ObjectId

def get_modern_resume_data(user_id):
    """
    Get resume data from the modern system (stored in users collection)
    """
    try:
        db = get_db()
        if db is None:
            print(f"❌ Database connection failed for user: {user_id}")
            return None
            
        print(f"🔍 Database connected, searching for user: {user_id}")
        
        # Convert user_id to ObjectId if needed
        if isinstance(user_id, str) and ObjectId.is_valid(user_id):
            user_object_id = ObjectId(user_id)
            print(f"✅ Using ObjectId: {user_object_id}")
        else:
            # If user_id is not a valid ObjectId, try to find by email or other identifier
            print(f"🔍 Searching by email/identifier: {user_id}")
            user = db.users.find_one({'email': user_id})
            if not user:
                print(f"❌ User not found with identifier: {user_id}")
                return None
            user_object_id = user['_id']
            print(f"✅ Found user by identifier, ObjectId: {user_object_id}")
        
        # Get user profile with resume data
        print(f"🔍 Fetching user profile for ObjectId: {user_object_id}")
        user_profile = db.users.find_one({'_id': user_object_id})
        
        if user_profile:
            print(f"✅ User profile found: {user_profile.get('firstName', '')} {user_profile.get('lastName', '')}")
            print(f"🔍 Checking for resume_data in profile...")
            if 'resume_data' in user_profile:
                resume_data = user_profile['resume_data']
                print(f"✅ Found modern resume data for user: {user_id}")
                print(f"📊 Resume data keys: {list(resume_data.keys()) if isinstance(resume_data, dict) else 'Not a dict'}")
                return resume_data
            else:
                print(f"❌ No resume_data field in user profile for user: {user_id}")
                return None
        else:
            print(f"❌ User profile not found for ObjectId: {user_object_id}")
            return None
            
    except Exception as e:
        print(f"❌ Error getting modern resume data: {e}")
        return None

def process_application(user_id, job_id, status):
    """
    Processes a job application by evaluating a user's resume against the job description.
    
    Uses caching to ensure consistent match scores - if a match score already exists for this 
    user-job pair, it reuses the existing calculation instead of recalculating.

    Steps:
    1. Check if match score already exists for this user-job pair
    2. If exists, reuse cached scores; if not, calculate new scores
    3. Fetch the latest resume of the user.
    4. Retrieve the job details.
    5. Compute the similarity score using SBERT.
    6. Generate additional evaluation metrics (skills, experience, education).
    7. Calculate a final match score using hybrid scoring.
    8. Store the application details in the database.

    Args:
        user_id (str): ID of the job seeker.
        job_id (str): ID of the job posting.
        status (str): Application status (e.g., "Pending", "Applied").

    Returns:
        dict: Application processing result, including final match score and insights.
    """
    # Check if we already have a match score for this user-job pair
    existing_application = ApplicationModel.get_application_by_user_and_job(user_id, job_id)
    
    if existing_application and existing_application.get('final_score') is not None:
        # Reuse existing match score data to ensure consistency
        print(f"Using cached match score for user {user_id} and job {job_id}")
        
        # Update only the status if it's different
        if existing_application.get('status') != status:
            ApplicationModel.update_application_status(user_id, job_id, status)
            
        return {
            "message": "Application processed (using cached match score)",
            "applicationId": str(existing_application.get('_id')),
            "final_score": existing_application.get('final_score'),
            "ai_suggestions": existing_application.get('ai_suggestions', [])
        }
    
    # If no existing match score, calculate new one
    print(f"🔍 Getting resume data for user: {user_id}")
    
    # Try modern resume system first
    resume_data = get_modern_resume_data(user_id)
    
    # If no modern resume data, try legacy system as fallback
    if not resume_data:
        print(f"🔄 No modern resume data, trying legacy system...")
        legacy_resumes = get_resumes_by_user(user_id)
        if legacy_resumes and len(legacy_resumes) > 0:
            resume_data = legacy_resumes[0]  # Use the first/latest resume
            print(f"✅ Found legacy resume data")
        else:
            print(f"❌ No resume data found in either system")
    
    job_data = get_job_by_id(job_id)  

    if not resume_data:
        print(f"❌ No resume found for user {user_id}")
        return {"error": "No resume found for this user. Please upload your resume first."}, 404
    if not job_data:
        return {"error": "No job found for this ID"}, 404
   
    print(f"Calculating new match score for user {user_id} and job {job_id}")
    
    # Ensure resume_data is in the correct format for evaluate_application
    if isinstance(resume_data, dict) and 'personal_info' in resume_data:
        # Modern resume format - wrap in list for compatibility
        resume_list = [resume_data]
        print(f"✅ Using modern resume format for application")
    elif isinstance(resume_data, list):
        # Legacy resume format - use as is
        resume_list = resume_data
        print(f"✅ Using legacy resume format for application")
    else:
        # Single resume object from legacy system
        resume_list = [resume_data]
        print(f"✅ Converting single resume to list format for application")
    
    application_result = evaluate_application(resume_list, job_data)
    
    resume_text=application_result.get("resume_text")
    #print(resume_text)
    job_text=application_result.get("job_text")
    #print(job_text)
    match_score=float(compute_similarity(resume_text, job_text))

    def transform_score(original_score):
        """
        Transforms the SBERT similarity score into a percentage-based match.

        Parameters:
            original_score (float): The similarity score from SBERT.

        Returns:
            float: Transformed percentage score.
        """
        if original_score >= 0.82:
            return round(85 + (original_score - 0.85) * 150, 2) 
        elif original_score >= 0.7:
            return round(65 + (original_score - 0.7) * 66.67, 2) 
        elif original_score >= 0.6:
            return round(40 + (original_score - 0.6) * 50, 2)  
        else:
            return round(original_score * 40, 2)  
    
    percent=transform_score(match_score)
    
    # Get the first resume for hybrid_score calculation
    first_resume = resume_list[0] if resume_list else resume_data
    result=hybrid_score(match_score,first_resume,job_data)

    result_data=get_gemini_free_result(resume_list,job_data,match_score)
    
    print("SBERT",match_score)
    print("Percent", percent)
    
    # Convert string values from Gemini API to numbers for calculation
    overall_match_score = float(result_data.get("overall_match_score", "0")) if result_data.get("overall_match_score") else 0
    skills_match = float(result_data.get("skills_match", "0")) if result_data.get("skills_match") else 0
    experience_match = float(result_data.get("experience_match", "0")) if result_data.get("experience_match") else 0
    education_match = float(result_data.get("education_match", "0")) if result_data.get("education_match") else 0
    
    final_score=(0.5*percent)+(0.2*overall_match_score)+(0.1*skills_match)+(0.1*experience_match)+(0.1*education_match)
    
    application_data = {
        "userId": user_id,
        "jobId": job_id,
        "matchScore": match_score,  # Store match score
        "status": status,
        "education_score":result.get("education_score"),
        "experience_score":result.get("experience_score"),
        "skill_score":result.get("skill_score"),
        "missing_skills":result.get("missing_skills"),
        "education_match":result_data.get("education_match"),
        "skills_match":result_data.get("skills_match"),
        "skill_score_why":result_data.get("skill_score_why"),
        "experience_match":result_data.get("experience_match"),
        "job_seeker_insights":result_data.get("job_seeker_insights"),
        "recruiter_insights":result_data.get("recruiter_insights"),
        "gemini_match_score":result_data.get("overall_match_score"),
        "final_score":final_score,
        "ai_suggestions":result_data.get("job_seeker_insights", {}).get("improvement_suggestions", [])
    }

    app_id = ApplicationModel.save_application(application_data)
    print("Application processed.")
    return {"message": "Application processed",
        "applicationId": str(app_id),
        "final_score":final_score,
        "ai_suggestions":result_data.get("job_seeker_insights", {}).get("improvement_suggestions", [])
        }


def get_match_score(user_id, job_id):
    """
    Get match score for a user-job pair without applying.
    
    This function is used when users browse jobs to see their match scores.
    It uses the same caching logic as process_application to ensure consistency.
    
    Args:
        user_id (str): ID of the job seeker.
        job_id (str): ID of the job posting.
    
    Returns:
        dict: Match score data or error message.
    """
    # Check if we already have a match score for this user-job pair
    existing_application = ApplicationModel.get_application_by_user_and_job(user_id, job_id)
    
    if existing_application and existing_application.get('final_score') is not None:
        # Return cached match score data
        print(f"Returning cached match score for user {user_id} and job {job_id}")
        return {
            "final_score": existing_application.get('final_score'),
            "skills_match": existing_application.get('skills_match'),
            "experience_match": existing_application.get('experience_match'),
            "education_match": existing_application.get('education_match'),
            "skill_score_why": existing_application.get('skill_score_why', ""),
            "job_seeker_insights": existing_application.get('job_seeker_insights', {}),
            "recruiter_insights": existing_application.get('recruiter_insights', {}),
            "overall_match_score": existing_application.get('overall_match_score', 0),
            "education_score": existing_application.get('education_score', 0),
            "experience_score": existing_application.get('experience_score', 0),
            "skill_score": existing_application.get('skill_score', 0),
            "missing_skills": existing_application.get('missing_skills', []),
            "cached": True
        }
    
    # If no existing match score, calculate new one (but don't save as application)
    print(f"🔍 Getting resume data for match score: user {user_id}")
    
    # Try modern resume system first
    resume_data = get_modern_resume_data(user_id)
    
    # If no modern resume data, try legacy system as fallback
    if not resume_data:
        print(f"🔄 No modern resume data, trying legacy system...")
        legacy_resumes = get_resumes_by_user(user_id)
        if legacy_resumes and len(legacy_resumes) > 0:
            resume_data = legacy_resumes[0]  # Use the first/latest resume
            print(f"✅ Found legacy resume data")
        else:
            print(f"❌ No resume data found in either system")
    
    job_data = get_job_by_id(job_id)  

    if not resume_data:
        print(f"❌ No resume found for user {user_id}")
        return {"error": "No resume found for this user. Please upload your resume first."}, 404
    if not job_data:
        return {"error": "No job found for this ID"}, 404
   
    print(f"Calculating match score for browsing: user {user_id} and job {job_id}")
    
    # Calculate match score using the same logic as process_application
    # Ensure resume_data is in the correct format for evaluate_application
    if isinstance(resume_data, dict) and 'personal_info' in resume_data:
        # Modern resume format - wrap in list for compatibility
        resume_list = [resume_data]
        print(f"✅ Using modern resume format")
    elif isinstance(resume_data, list):
        # Legacy resume format - use as is
        resume_list = resume_data
        print(f"✅ Using legacy resume format")
    else:
        # Single resume object from legacy system
        resume_list = [resume_data]
        print(f"✅ Converting single resume to list format")
    
    application_result = evaluate_application(resume_list, job_data)
    
    resume_text = application_result.get("resume_text")
    job_text = application_result.get("job_text")
    match_score = float(compute_similarity(resume_text, job_text))

    def transform_score(original_score):
        # More generous scoring for better user experience
        if original_score >= 0.6:
            return round(70 + (original_score - 0.6) * 75, 2)  # 70-100 for 0.6-1.0
        elif original_score >= 0.4:
            return round(50 + (original_score - 0.4) * 100, 2)  # 50-70 for 0.4-0.6
        elif original_score >= 0.2:
            return round(30 + (original_score - 0.2) * 100, 2)  # 30-50 for 0.2-0.4
        else:
            return round(original_score * 150, 2)  # 0-30 for 0-0.2  
    
    percent = transform_score(match_score)
    
    # Get the first resume for hybrid_score calculation
    first_resume = resume_list[0] if resume_list else resume_data
    result = hybrid_score(match_score, first_resume, job_data)
    result_data = get_gemini_free_result(resume_list, job_data, match_score)
    
    # Convert string values from Gemini API to numbers for calculation
    overall_match_score = float(result_data.get("overall_match_score", "0")) if result_data.get("overall_match_score") else 0
    skills_match = float(result_data.get("skills_match", "0")) if result_data.get("skills_match") else 0
    experience_match = float(result_data.get("experience_match", "0")) if result_data.get("experience_match") else 0
    education_match = float(result_data.get("education_match", "0")) if result_data.get("education_match") else 0
    
    # More balanced scoring that doesn't overly rely on similarity
    # Give more weight to AI-generated scores and less to similarity
    calculated_score = (0.3 * percent) + (0.3 * overall_match_score) + (0.2 * skills_match) + (0.1 * experience_match) + (0.1 * education_match)
    
    # Ensure minimum reasonable score for jobs with basic requirements
    # Check if job has minimal requirements (no specific skills, education, or experience)
    job_has_minimal_requirements = (
        not job_data.get('required_skills') or 
        job_data.get('required_skills', '').strip() in ['', 'N/A', 'None', 'Any', 'Any skills'] or
        job_data.get('education_required', '').strip() in ['', 'N/A', 'None', 'Any', 'High School', 'Any education'] or
        job_data.get('experience_required', '').strip() in ['', 'N/A', 'None', 'Any', '0 years', 'No experience']
    )
    
    if job_has_minimal_requirements:
        # For jobs with minimal requirements, ensure at least 40% match score
        final_score = max(calculated_score, 40.0)
    else:
        # For jobs with specific requirements, ensure at least 20% match score
        final_score = max(calculated_score, 20.0)
    
    # Cap the final score at 100
    final_score = min(final_score, 100.0)
    
    # Save this calculation as a "viewed" application for future caching
    application_data = {
        "userId": user_id,
        "jobId": job_id,
        "matchScore": match_score,
        "status": "viewed",  # Special status for browsing
        "education_score": result.get("education_score"),
        "experience_score": result.get("experience_score"),
        "skill_score": result.get("skill_score"),
        "missing_skills": result.get("missing_skills"),
        "education_match": result_data.get("education_match"),
        "skills_match": result_data.get("skills_match"),
        "experience_match": result_data.get("experience_match"),
        "gemini_match_score": result_data.get("overall_match_score"),
        "final_score": final_score,
        "skill_score_why": result_data.get("skill_score_why", ""),
        "job_seeker_insights": result_data.get("job_seeker_insights", {}),
        "recruiter_insights": result_data.get("recruiter_insights", {}),
        "overall_match_score": result_data.get("overall_match_score", 0),
        "ai_suggestions": result_data.get("job_seeker_insights", {}).get("improvement_suggestions", [])
    }
    
    # Save for future caching
    ApplicationModel.save_application(application_data)
    
    return {
        "final_score": final_score,
        "skills_match": skills_match,
        "experience_match": experience_match,
        "education_match": education_match,
        "skill_score_why": result_data.get("skill_score_why", ""),
        "job_seeker_insights": result_data.get("job_seeker_insights", {}),
        "recruiter_insights": result_data.get("recruiter_insights", {}),
        "overall_match_score": result_data.get("overall_match_score", 0),
        "education_score": result.get("education_score", 0),
        "experience_score": result.get("experience_score", 0),
        "skill_score": result.get("skill_score", 0),
        "missing_skills": result.get("missing_skills", []),
        "cached": False
    }


def update_application_status(user_id, job_id, status, interview_date=None, interview_mode=None):
    """
    Updates the status of a job application.

    Parameters:
        user_id (str): ID of the job seeker.
        job_id (str): ID of the job posting.
        status (str): New application status (e.g., "Interview Scheduled").
        interview_date (str, optional): Scheduled interview date (YYYY-MM-DD).
        interview_mode (str, optional): Mode of the interview (e.g., "Online" or "In-person").

    Returns:
        tuple: A response dictionary and HTTP status code.
    """
    if not user_id or not job_id:
        return {"error": "Missing userId or jobId"}, 400

    updated = ApplicationModel.update_application_status(user_id, job_id, status, interview_date, interview_mode)

    if updated:
        return {"message": f"Application status updated to '{status}' successfully."}, 200
    else:
        return {"error": "Application not found or status unchanged."}, 404
