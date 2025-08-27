from utils.match_result import hybrid_score
from utils.GeminiResult import get_gemini_free_result
from utils.sbert_match import compute_similarity
from models.application_model import ApplicationModel
from utils.application import evaluate_application
from services.resume_service import get_resumes_by_user
from services.job_service import get_job_by_id

def process_application(user_id, job_id,status):
    """
    Processes a job application by evaluating a user's resume against the job description.

    Steps:
    1. Fetch the latest resume of the user.
    2. Retrieve the job details.
    3. Compute the similarity score using SBERT.
    4. Generate additional evaluation metrics (skills, experience, education).
    5. Calculate a final match score using hybrid scoring.
    6. Store the application details in the database.

    Args:
        user_id (str): ID of the job seeker.
        job_id (str): ID of the job posting.
        status (str): Application status (e.g., "Pending", "Applied").

    Returns:
        dict: Application processing result, including final match score and insights.
    """
    resume_data = get_resumes_by_user(user_id) 
    job_data = get_job_by_id(job_id)  

    if not resume_data:
        return {"error": "No resume found for this user"}, 404
    if not job_data:
        return {"error": "No job found for this ID"}, 404
   

    application_result = evaluate_application(resume_data, job_data)
    
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
    result=hybrid_score(match_score,resume_data[0],job_data)

    result_data=get_gemini_free_result(resume_data,job_data,match_score)
    
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
