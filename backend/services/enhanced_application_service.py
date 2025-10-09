"""
Enhanced Application Service with Advanced Gemini Models for Better Accuracy
"""

from utils.match_result import hybrid_score
from utils.sbert_match import compute_similarity
from models.application_model import ApplicationModel
from utils.application import evaluate_application
from services.resume_service import get_resumes_by_user
from services.job_service import get_job_by_id
from services.advanced_gemini_service import get_advanced_gemini_service
import logging
import json
import re

logger = logging.getLogger(__name__)

def process_application_enhanced(user_id, job_id, status):
    """
    Enhanced application processing with advanced Gemini models for better accuracy and precision.
    
    Steps:
    1. Fetch the latest resume of the user
    2. Retrieve the job details
    3. Parse resume with Gemini 1.5 Pro for better accuracy
    4. Compute similarity score using SBERT
    5. Generate advanced evaluation using Gemini 2.0 Flash Exp
    6. Calculate final match score with improved weighting
    7. Store enhanced application details in database
    
    Args:
        user_id (str): ID of the job seeker
        job_id (str): ID of the job posting
        status (str): Application status
        
    Returns:
        dict: Enhanced application processing result
    """
    try:
        # Get services
        gemini_service = get_advanced_gemini_service()
        
        # Fetch data
        resume_data = get_resumes_by_user(user_id)
        job_data = get_job_by_id(job_id)
        
        if not resume_data:
            return {"error": "No resume found for this user"}, 404
        if not job_data:
            return {"error": "No job found for this ID"}, 404
        
        logger.info(f"Processing application for user {user_id} and job {job_id}")
        
        # Enhanced resume parsing with Gemini 1.5 Pro
        logger.info("Parsing resume with Gemini 1.5 Pro...")
        resume_text = resume_data[0].get('raw_text', '') or str(resume_data[0])
        enhanced_resume_data = gemini_service.parse_resume_advanced(resume_text)
        
        if enhanced_resume_data:
            # Use enhanced parsed data
            logger.info("Using enhanced resume data from Gemini 1.5 Pro")
            resume_data = [enhanced_resume_data]
        
        # Get application evaluation
        application_result = evaluate_application(resume_data, job_data)
        resume_text = application_result.get("resume_text")
        job_text = application_result.get("job_text")
        
        # Compute SBERT similarity
        match_score = float(compute_similarity(resume_text, job_text))
        logger.info(f"SBERT similarity score: {match_score}")
        
        # Transform score to percentage
        def transform_score(original_score):
            """Enhanced score transformation for better accuracy"""
            if original_score >= 0.85:
                return round(90 + (original_score - 0.85) * 100, 2)
            elif original_score >= 0.75:
                return round(75 + (original_score - 0.75) * 150, 2)
            elif original_score >= 0.65:
                return round(55 + (original_score - 0.65) * 200, 2)
            elif original_score >= 0.55:
                return round(35 + (original_score - 0.55) * 200, 2)
            else:
                return round(original_score * 35, 2)
        
        percent = transform_score(match_score)
        logger.info(f"Transformed percentage score: {percent}")
        
        # Get hybrid score
        result = hybrid_score(match_score, resume_data[0], job_data)
        
        # Generate advanced analysis with Gemini 2.0 Flash Exp
        logger.info("Generating advanced match analysis with Gemini 2.0 Flash Exp...")
        advanced_analysis = gemini_service.generate_advanced_match_analysis(
            resume_data[0], job_data, match_score
        )
        
        if not advanced_analysis:
            logger.warning("Advanced analysis failed, falling back to basic analysis")
            # Fallback to basic analysis
            from utils.GeminiResult import get_gemini_free_result
            advanced_analysis = get_gemini_free_result(resume_data, job_data, match_score)
        
        # Extract scores with better error handling
        overall_match_score = 0
        skills_match = 0
        experience_match = 0
        education_match = 0
        cultural_fit_score = 0
        growth_potential_score = 0
        ai_confidence = 0
        
        try:
            overall_match_score = float(advanced_analysis.get("overall_match_score", "0"))
            skills_match = float(advanced_analysis.get("skills_match", "0"))
            experience_match = float(advanced_analysis.get("experience_match", "0"))
            education_match = float(advanced_analysis.get("education_match", "0"))
            cultural_fit_score = float(advanced_analysis.get("cultural_fit_score", "0"))
            growth_potential_score = float(advanced_analysis.get("growth_potential_score", "0"))
            ai_confidence = float(advanced_analysis.get("ai_confidence", "0"))
        except (ValueError, TypeError) as e:
            logger.warning(f"Error parsing advanced analysis scores: {e}")
        
        # Enhanced final score calculation with more factors
        final_score = (
            0.35 * percent +  # SBERT similarity (35%)
            0.25 * overall_match_score +  # Overall AI analysis (25%)
            0.15 * skills_match +  # Skills match (15%)
            0.10 * experience_match +  # Experience match (10%)
            0.10 * education_match +  # Education match (10%)
            0.03 * cultural_fit_score +  # Cultural fit (3%)
            0.02 * growth_potential_score  # Growth potential (2%)
        )
        
        logger.info(f"Enhanced final score: {final_score}")
        
        # Prepare enhanced application data
        application_data = {
            "userId": user_id,
            "jobId": job_id,
            "matchScore": match_score,
            "status": status,
            "education_score": education_match,
            "experience_score": experience_match,
            "skill_score": skills_match,
            "cultural_fit_score": cultural_fit_score,
            "growth_potential_score": growth_potential_score,
            "ai_confidence": ai_confidence,
            "missing_skills": advanced_analysis.get("detailed_analysis", {}).get("gaps", []),
            "education_match": education_match,
            "skills_match": skills_match,
            "experience_match": experience_match,
            "skill_score_why": advanced_analysis.get("detailed_analysis", {}).get("strengths", []),
            "job_seeker_insights": advanced_analysis.get("job_seeker_insights", {}),
            "recruiter_insights": advanced_analysis.get("recruiter_insights", {}),
            "gemini_match_score": overall_match_score,
            "final_score": final_score,
            "ai_suggestions": advanced_analysis.get("job_seeker_insights", {}).get("improvement_suggestions", []),
            "enhanced_analysis": advanced_analysis,  # Store full analysis
            "model_used": "gemini-2.0-flash-exp"  # Track which model was used
        }
        
        # Save application
        app_id = ApplicationModel.save_application(application_data)
        logger.info(f"Enhanced application processed successfully with ID: {app_id}")
        
        return {
            "message": "Enhanced application processed successfully",
            "applicationId": str(app_id),
            "final_score": final_score,
            "ai_confidence": ai_confidence,
            "model_used": "gemini-2.0-flash-exp",
            "analysis_summary": {
                "overall_match": overall_match_score,
                "skills_match": skills_match,
                "experience_match": experience_match,
                "education_match": education_match,
                "cultural_fit": cultural_fit_score,
                "growth_potential": growth_potential_score
            }
        }
        
    except Exception as e:
        logger.error(f"Error in enhanced application processing: {e}")
        return {"error": f"Enhanced processing failed: {str(e)}"}, 500

def get_enhanced_recommendations(user_id, limit=10):
    """
    Get enhanced job recommendations using advanced Gemini models
    
    Args:
        user_id (str): User ID
        limit (int): Number of recommendations
        
    Returns:
        list: Enhanced job recommendations
    """
    try:
        gemini_service = get_advanced_gemini_service()
        
        # Get user's resume data
        resume_data = get_resumes_by_user(user_id)
        if not resume_data:
            return {"error": "No resume found"}, 404
        
        # Parse resume with advanced model
        resume_text = resume_data[0].get('raw_text', '') or str(resume_data[0])
        enhanced_resume = gemini_service.parse_resume_advanced(resume_text)
        
        if enhanced_resume:
            resume_data = [enhanced_resume]
        
        # Generate personalized recommendations
        prompt = f"""
        Based on this candidate profile, recommend the top {limit} most suitable job titles and roles:
        
        Candidate Profile:
        {json.dumps(resume_data[0], indent=2)}
        
        Provide recommendations in this JSON format:
        {{
            "recommended_jobs": [
                {{
                    "title": "Job title",
                    "industry": "Industry",
                    "match_reason": "Why this role fits",
                    "required_skills": ["skill1", "skill2"],
                    "experience_level": "entry/mid/senior",
                    "salary_range": "estimated range"
                }}
            ],
            "career_path": "Suggested career progression",
            "skill_gaps": ["skills to develop"],
            "market_demand": "Current market demand for this profile"
        }}
        """
        
        response = gemini_service.call_gemini(prompt, model='gemini-1.5-pro', task_type='job_matching')
        
        if response:
            try:
                cleaned_response = re.sub(r'```json\n?', '', response)
                cleaned_response = re.sub(r'```', '', cleaned_response).strip()
                recommendations = json.loads(cleaned_response)
                return recommendations
            except json.JSONDecodeError:
                logger.error("Failed to parse recommendations JSON")
        
        return {"error": "Failed to generate recommendations"}, 500
        
    except Exception as e:
        logger.error(f"Error generating enhanced recommendations: {e}")
        return {"error": str(e)}, 500
