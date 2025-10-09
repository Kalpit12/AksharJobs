"""
CV Access Routes for CV Browser
Provides endpoints to access CV data for recruiters
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime, timedelta
from utils.db import get_db
import logging

cv_access_routes = Blueprint('cv_access', __name__)
logger = logging.getLogger(__name__)

@cv_access_routes.route('/cvs', methods=['GET'])
@jwt_required()
def get_all_cvs():
    """
    Get all available CVs for CV Browser
    Returns CVs with user information and extracted data
    """
    try:
            current_user_id = get_jwt_identity()
        logger.info(f"Getting CVs for user: {current_user_id}")
        
        db = get_db()
        
        if db is None:
            logger.error("Database connection failed")
            return jsonify({"error": "Database connection failed"}), 500
        
        # Get current user to check if they're a recruiter
        users_collection = db.users
        logger.info(f"Querying user with ID: {current_user_id}")
        
        try:
            current_user = users_collection.find_one({'_id': ObjectId(current_user_id)})
        except Exception as e:
            logger.error(f"Error querying user: {e}")
            return jsonify({"error": "Invalid user ID format"}), 400
        
        if not current_user:
            logger.error("User not found")
            return jsonify({"error": "User not found"}), 404
        
        if current_user.get('userType') != 'recruiter':
            logger.error("Access denied - not a recruiter")
            return jsonify({"error": "Access denied. Recruiters only."}), 403
        
        # Get all job seekers with completed profiles and resumes
        logger.info("Querying job seekers with completed profiles...")
        job_seekers = users_collection.find({
            'userType': 'jobSeeker',
            'profileCompleted': True,
            'resumePath': {'$exists': True, '$ne': ''}
        })
        
        job_seekers_list = list(job_seekers)
        logger.info(f"Found {len(job_seekers_list)} job seekers with completed profiles")
        
        cvs = []
        for user in job_seekers_list:
            try:
                logger.info(f"Processing user: {user.get('firstName', '')} {user.get('lastName', '')} ({user.get('email', '')})")
                
                # Get resume data from resume collection
                resume_collection = db.resume_data
                resume_data = resume_collection.find_one({'userId': user['_id']})
                
                logger.info(f"Resume data found: {resume_data is not None}")
                if resume_data:
                    logger.info(f"Resume data keys: {list(resume_data.keys())}")
                
                if not resume_data:
                    logger.warning(f"No resume data found for user {user.get('_id', 'unknown')}, using profile data")
                    # Continue processing even without resume data - use user profile data
                    resume_data = {}
                
                # Extract user information
                full_name = user.get('fullName', f"{user.get('firstName', '')} {user.get('lastName', '')}").strip()
                if not full_name:
                    full_name = user.get('email', 'Unknown User')
                
                # Extract location
                location = user.get('location', '')
                if isinstance(location, dict):
                    city = location.get('city', '')
                    country = location.get('country', '')
                    location = f"{city}, {country}" if city and country else city or country or 'Not specified'
                
                # Extract experience
                experience = user.get('experience', [])
                experience_years = 0
                if experience and isinstance(experience, list) and len(experience) > 0:
                    # Calculate total experience from experience array
                    for exp in experience:
                        if isinstance(exp, dict) and 'years' in exp:
                            try:
                                exp_years = float(exp['years'])
                                experience_years += exp_years
                            except (ValueError, TypeError):
                                pass
                
                experience_text = f"{int(experience_years)}+ years" if experience_years > 0 else "Entry level"
                
                # Extract skills - try resume data first, then user profile
                skills = resume_data.get('skills', []) if resume_data else user.get('skills', [])
                if isinstance(skills, str):
                    skills = [skill.strip() for skill in skills.split(',') if skill.strip()]
                elif not isinstance(skills, list):
                    skills = []
                
                # Extract education
                education = user.get('education', [])
                education_text = "Not specified"
                if education and isinstance(education, list) and len(education) > 0:
                    # Get the highest education
                    highest_edu = education[0]
                    if isinstance(highest_edu, dict):
                        degree = highest_edu.get('degree', '')
                        field = highest_edu.get('field', '')
                        education_text = f"{degree} {field}".strip()
                    elif isinstance(highest_edu, str):
                        education_text = highest_edu
                
                # Calculate match score based on profile completeness and quality
                match_score = 0
                
                # Base score for having a completed profile
                if user.get('profileCompleted'):
                    match_score += 20
                
                # Score for having skills
                if skills and len(skills) > 0:
                    match_score += min(20, len(skills) * 2)  # Max 20 points for skills
                
                # Score for having experience
                if experience_years > 0:
                    match_score += min(25, experience_years * 5)  # Max 25 points for experience
                
                # Score for having education
                if education_text != "Not specified":
                    match_score += 15
                
                # Score for having location
                if location and location != "Not specified":
                    match_score += 10
                
                # Score for having a resume file
                if user.get('resumePath'):
                    match_score += 10
                
                # Ensure score is between 60-95 (never 100% to show it's not perfect)
                match_score = max(60, min(95, match_score))
                
                # Get last active date - try multiple fields
                last_active = user.get('lastLogin') or user.get('last_login') or user.get('updatedAt') or user.get('createdAt') or datetime.utcnow()
                
                if isinstance(last_active, datetime):
                    time_diff = datetime.utcnow() - last_active
                    days_ago = time_diff.days
                    hours_ago = time_diff.seconds // 3600
                    
                    if days_ago == 0:
                        if hours_ago == 0:
                            minutes_ago = time_diff.seconds // 60
                            if minutes_ago < 1:
                                last_active_text = "Just now"
                            else:
                                last_active_text = f"{minutes_ago} minutes ago"
                        elif hours_ago == 1:
                            last_active_text = "1 hour ago"
                        else:
                            last_active_text = f"{hours_ago} hours ago"
                    elif days_ago == 1:
                        last_active_text = "1 day ago"
                    elif days_ago < 7:
                        last_active_text = f"{days_ago} days ago"
                    elif days_ago < 30:
                        weeks_ago = days_ago // 7
                        last_active_text = f"{weeks_ago} week{'s' if weeks_ago > 1 else ''} ago"
                    else:
                        months_ago = days_ago // 30
                        last_active_text = f"{months_ago} month{'s' if months_ago > 1 else ''} ago"
        else:
                    last_active_text = "Recently"
                
                # Create CV object
                cv_data = {
                    'id': str(user['_id']),
                    'name': full_name,
                    'title': resume_data.get('extracted_data', {}).get('job_title', user.get('experience', [{}])[0].get('title', 'Professional') if user.get('experience') else 'Professional'),
                    'experience': experience_text,
                    'location': location,
                    'skills': skills[:10],  # Limit to 10 skills
                    'education': education_text,
                    'matchScore': match_score,
                    'lastActive': last_active_text,
                    'email': user.get('email', ''),
                    'phone': user.get('phoneNumber', ''),
                    'resumePath': user.get('resumePath', ''),
                    'profileImage': user.get('profileImage', ''),
                    'createdAt': user.get('createdAt', datetime.utcnow()).isoformat() if isinstance(user.get('createdAt'), datetime) else str(user.get('createdAt', ''))
                }
                
                cvs.append(cv_data)
                logger.info(f"Successfully processed CV for user: {full_name}")
                logger.info(f"CV data: {cv_data}")
                
            except Exception as e:
                logger.error(f"Error processing user {user.get('_id', 'unknown')}: {e}")
                import traceback
                logger.error(f"Traceback: {traceback.format_exc()}")
                continue
        
        # Sort by creation date (newest first)
        cvs.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
        
        logger.info(f"Returning {len(cvs)} CVs to frontend")
        return jsonify({
            'success': True,
            'cvs': cvs,
            'total': len(cvs)
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting CVs: {e}")
        import traceback
        logger.error(f"Full traceback: {traceback.format_exc()}")
        return jsonify({"error": "Failed to fetch CVs", "details": str(e)}), 500

@cv_access_routes.route('/cvs/<cv_id>/view', methods=['POST'])
@jwt_required()
def view_cv(cv_id):
    """
    Record CV view and return detailed CV information
    """
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"Viewing CV {cv_id} for user {current_user_id}")
        
        db = get_db()
        
        if db is None:
            logger.error("Database connection failed")
            return jsonify({"error": "Database connection failed"}), 500
        
        # Get current user
        users_collection = db.users
        current_user = users_collection.find_one({'_id': ObjectId(current_user_id)})
        
        if not current_user or current_user.get('userType') != 'recruiter':
            logger.error("Access denied - not a recruiter")
            return jsonify({"error": "Access denied"}), 403
        
        # Get CV owner
        cv_owner = users_collection.find_one({'_id': ObjectId(cv_id)})
        if not cv_owner:
            logger.error(f"CV owner not found for ID {cv_id}")
            return jsonify({"error": "CV not found"}), 404
        
        logger.info(f"Found CV owner: {cv_owner.get('firstName', '')} {cv_owner.get('lastName', '')}")
        
        # Get resume data if available
        resume_collection = db.resume_data
        resume_data = resume_collection.find_one({'userId': cv_owner['_id']})
        logger.info(f"Resume data found: {resume_data is not None}")
        
        # Extract detailed CV information
        full_name = cv_owner.get('fullName', f"{cv_owner.get('firstName', '')} {cv_owner.get('lastName', '')}").strip()
        if not full_name:
            full_name = cv_owner.get('email', 'Unknown User')
        logger.info(f"Extracted name: {full_name}")
        
        # Extract location
        location = cv_owner.get('location', '')
        if isinstance(location, dict):
            city = location.get('city', '')
            country = location.get('country', '')
            location = f"{city}, {country}" if city and country else city or country or 'Not specified'
        
        # Extract experience
        experience = cv_owner.get('experience', [])
        experience_years = 0
        if experience and isinstance(experience, list) and len(experience) > 0:
            for exp in experience:
                if isinstance(exp, dict) and 'years' in exp:
                    try:
                        exp_years = float(exp['years'])
                        experience_years += exp_years
                    except (ValueError, TypeError):
                        pass
        
        experience_text = f"{int(experience_years)}+ years" if experience_years > 0 else "Entry level"
        
        # Extract skills
        skills = resume_data.get('skills', []) if resume_data else cv_owner.get('skills', [])
        if isinstance(skills, str):
            skills = [skill.strip() for skill in skills.split(',') if skill.strip()]
        elif not isinstance(skills, list):
            skills = []
        
        # Extract education
        education = cv_owner.get('education', [])
        education_text = "Not specified"
        if education and isinstance(education, list) and len(education) > 0:
            highest_edu = education[0]
            if isinstance(highest_edu, dict):
                degree = highest_edu.get('degree', '')
                field = highest_edu.get('field', '')
                education_text = f"{degree} {field}".strip()
            elif isinstance(highest_edu, str):
                education_text = highest_edu
        
        # Get last active date
        last_active = cv_owner.get('lastLogin') or cv_owner.get('last_login') or cv_owner.get('updatedAt') or cv_owner.get('createdAt') or datetime.utcnow()
        
        if isinstance(last_active, datetime):
            time_diff = datetime.utcnow() - last_active
            days_ago = time_diff.days
            hours_ago = time_diff.seconds // 3600
            
            if days_ago == 0:
                if hours_ago == 0:
                    minutes_ago = time_diff.seconds // 60
                    if minutes_ago < 1:
                        last_active_text = "Just now"
                    else:
                        last_active_text = f"{minutes_ago} minutes ago"
                elif hours_ago == 1:
                    last_active_text = "1 hour ago"
                else:
                    last_active_text = f"{hours_ago} hours ago"
            elif days_ago == 1:
                last_active_text = "1 day ago"
            elif days_ago < 7:
                last_active_text = f"{days_ago} days ago"
            elif days_ago < 30:
                weeks_ago = days_ago // 7
                last_active_text = f"{weeks_ago} week{'s' if weeks_ago > 1 else ''} ago"
            else:
                months_ago = days_ago // 30
                last_active_text = f"{months_ago} month{'s' if months_ago > 1 else ''} ago"
        else:
            last_active_text = "Recently"
        
        # Calculate match score
        match_score = 0
        if cv_owner.get('profileCompleted'):
            match_score += 20
        if skills and len(skills) > 0:
            match_score += min(20, len(skills) * 2)
        if experience_years > 0:
            match_score += min(25, experience_years * 5)
        if education_text != "Not specified":
            match_score += 15
        if location and location != "Not specified":
            match_score += 10
        if cv_owner.get('resumePath'):
            match_score += 10
        
        match_score = max(60, min(95, match_score))
        
        # Record the view (increment view count)
        users_collection.update_one(
            {'_id': ObjectId(current_user_id)},
            {'$inc': {'cv_views_this_month': 1}}
        )
        
        # Return detailed CV information
        cv_details = {
            'success': True,
            'cvId': cv_id,
            'name': full_name,
            'email': cv_owner.get('email', ''),
            'phone': cv_owner.get('phoneNumber', ''),
            'title': resume_data.get('extracted_data', {}).get('job_title', experience[0].get('title', 'Professional') if experience and len(experience) > 0 else 'Professional'),
            'experience': experience_text,
            'location': location,
            'skills': skills,
            'education': education_text,
            'matchScore': match_score,
            'lastActive': last_active_text,
            'resumePath': cv_owner.get('resumePath', ''),
            'profileImage': cv_owner.get('profileImage', ''),
            'experienceDetails': experience if experience else [],
            'educationDetails': education if education else [],
            'profileSummary': resume_data.get('profile_summary', '') if resume_data else '',
            'projects': resume_data.get('projects', []) if resume_data else [],
            'certificates': resume_data.get('certificates', []) if resume_data else [],
            'jobRecommended': resume_data.get('jobRecomended', []) if resume_data else []
        }
        
        return jsonify(cv_details), 200
        
    except Exception as e:
        logger.error(f"Error viewing CV {cv_id}: {e}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return jsonify({"error": "Failed to view CV", "details": str(e)}), 500

@cv_access_routes.route('/user/cv-limits', methods=['GET'])
@jwt_required()
def get_cv_limits():
    """
    Get user's CV view limits based on their subscription
    """
    try:
        current_user_id = get_jwt_identity()
        db = get_db()
        
        if db is None:
            return jsonify({"error": "Database connection failed"}), 500
        
        users_collection = db.users
        user = users_collection.find_one({'_id': ObjectId(current_user_id)})
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Get subscription info
        subscription = user.get('subscription', {})
        plan = subscription.get('plan', 'Basic')
        
        # Define limits based on plan
        limits = {
            'Basic': 50,
            'Professional': 200,
            'Enterprise': 1000
        }
        
        max_views = limits.get(plan, 50)
        view_count = user.get('cv_views_this_month', 0)
        
        return jsonify({
            'viewCount': view_count,
            'maxViews': max_views,
            'plan': plan
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting CV limits: {e}")
        return jsonify({"error": "Failed to get CV limits", "details": str(e)}), 500