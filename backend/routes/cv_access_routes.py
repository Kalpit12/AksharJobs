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
        current_user = users_collection.find_one({'_id': ObjectId(current_user_id)})
        if not current_user or current_user.get('userType') != 'recruiter':
            logger.error("Access denied - not a recruiter")
            return jsonify({"error": "Access denied. Recruiters only."}), 403
        
        # Get all job seekers with completed profiles and resumes
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
                resume_collection = db.resume_data
                resume_data = resume_collection.find_one({'userId': user['_id']})
                logger.info(f"Resume data found: {resume_data is not None}")
                
                if not resume_data:
                    logger.warning(f"No resume data found for user {user.get('_id', 'unknown')}, using profile data")
                    resume_data = {}
                
                # Extract user data
                full_name = f"{user.get('firstName', '')} {user.get('lastName', '')}".strip()
                if not full_name:
                    full_name = user.get('email', 'Unknown User')
                
                # Extract experience
                experience = user.get('experience', [])
                if experience and len(experience) > 0:
                    experience_text = f"{experience[0].get('title', 'Professional')} at {experience[0].get('company', 'Unknown Company')}"
                else:
                    experience_text = resume_data.get('extracted_data', {}).get('job_title', 'Professional')
                
                # Extract location
                location = user.get('location', 'Not specified')
                if not location or location == 'Not specified':
                    location = resume_data.get('extracted_data', {}).get('location', 'Not specified')
                
                # Handle location object format
                if isinstance(location, dict):
                    location_parts = []
                    if location.get('city'):
                        location_parts.append(location['city'])
                    if location.get('state'):
                        location_parts.append(location['state'])
                    if location.get('country'):
                        location_parts.append(location['country'])
                    location = ', '.join(location_parts) if location_parts else 'Not specified'
                
                # Extract skills
                skills = user.get('skills', [])
                if not skills:
                    skills = resume_data.get('extracted_data', {}).get('skills', [])
                if not skills:
                    skills = []
                
                # Extract education
                education = user.get('education', [])
                if education and len(education) > 0:
                    education_text = f"{education[0].get('degree', 'Degree')} from {education[0].get('institution', 'Institution')}"
                else:
                    education_text = resume_data.get('extracted_data', {}).get('education', 'Not specified')
                
                # Calculate last active time
                last_login = user.get('lastLogin')
                if last_login:
                    if isinstance(last_login, str):
                        try:
                            last_login = datetime.fromisoformat(last_login.replace('Z', '+00:00'))
                        except:
                            last_login = datetime.utcnow()
                    elif isinstance(last_login, datetime):
                        pass
                    else:
                        last_login = datetime.utcnow()
                    
                    now = datetime.utcnow()
                    if last_login.tzinfo is None:
                        last_login = last_login.replace(tzinfo=None)
                    if now.tzinfo is None:
                        now = now.replace(tzinfo=None)
                    
                    time_diff = now - last_login
                    days_ago = time_diff.days
                    
                    if days_ago == 0:
                        hours_ago = time_diff.seconds // 3600
                        if hours_ago == 0:
                            minutes_ago = time_diff.seconds // 60
                            if minutes_ago < 1:
                                last_active_text = "Just now"
                            else:
                                last_active_text = f"{minutes_ago} minute{'s' if minutes_ago > 1 else ''} ago"
                        else:
                            last_active_text = f"{hours_ago} hour{'s' if hours_ago > 1 else ''} ago"
                    elif days_ago == 1:
                        last_active_text = "Yesterday"
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
                
                # Calculate match score based on profile completeness
                match_score = 0
                if full_name and full_name != 'Unknown User':
                    match_score += 20
                if experience_text and experience_text != 'Professional':
                    match_score += 20
                if skills and len(skills) > 0:
                    match_score += 20
                if education_text and education_text != 'Not specified':
                    match_score += 15
                if location and location != 'Not specified':
                    match_score += 10
                if resume_data:
                    match_score += 15
                
                # Create CV object
                cv_data = {
                    'id': str(user['_id']),
                    'name': full_name,
                    'title': resume_data.get('extracted_data', {}).get('job_title', experience[0].get('title', 'Professional') if experience and len(experience) > 0 else 'Professional'),
                    'experience': experience_text,
                    'location': location,
                    'skills': skills[:10],
                    'education': education_text,
                    'matchScore': match_score,
                    'lastActive': last_active_text,
                    'resumePath': user.get('resumePath', ''),
                    'profileImage': user.get('profileImage', ''),
                    'createdAt': user.get('createdAt', datetime.utcnow()).isoformat() if isinstance(user.get('createdAt'), datetime) else str(user.get('createdAt', ''))
                }
                cvs.append(cv_data)
                logger.info(f"Successfully processed CV for user: {full_name}")
                
            except Exception as e:
                logger.error(f"Error processing user {user.get('_id', 'unknown')}: {e}")
                import traceback
                logger.error(f"Traceback: {traceback.format_exc()}")
                continue
        
        # Sort CVs by creation date (newest first)
        cvs.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
        logger.info(f"Returning {len(cvs)} CVs to frontend")
        return jsonify({'success': True, 'cvs': cvs, 'total': len(cvs)}), 200
        
    except Exception as e:
        logger.error(f"Error getting CVs: {e}")
        import traceback
        logger.error(f"Full traceback: {traceback.format_exc()}")
        return jsonify({"error": "Failed to fetch CVs", "details": str(e)}), 500

@cv_access_routes.route('/cvs/<cv_id>/view', methods=['POST'])
@jwt_required()
def view_cv(cv_id):
    """
    View a specific CV and record the view
    Returns detailed CV information
    """
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"Viewing CV {cv_id} for user {current_user_id}")
        
        db = get_db()
        if db is None:
            logger.error("Database connection failed")
            return jsonify({"error": "Database connection failed"}), 500
        
        users_collection = db.users
        current_user = users_collection.find_one({'_id': ObjectId(current_user_id)})
        if not current_user or current_user.get('userType') != 'recruiter':
            logger.error("Access denied - not a recruiter")
            return jsonify({"error": "Access denied"}), 403
        
        # Find the CV owner
        cv_owner = users_collection.find_one({'_id': ObjectId(cv_id)})
        if not cv_owner:
            logger.error(f"CV owner not found for ID {cv_id}")
            return jsonify({"error": "CV not found"}), 404
        logger.info(f"Found CV owner: {cv_owner.get('firstName', '')} {cv_owner.get('lastName', '')}")
        
        # Get resume data
        resume_collection = db.resume_data
        resume_data = resume_collection.find_one({'userId': cv_owner['_id']})
        logger.info(f"Resume data found: {resume_data is not None}")
        
        # Extract detailed information
        full_name = f"{cv_owner.get('firstName', '')} {cv_owner.get('lastName', '')}".strip()
        if not full_name:
            full_name = cv_owner.get('email', 'Unknown User')
        
        # Extract experience details
        experience = cv_owner.get('experience', [])
        if not experience:
            experience = resume_data.get('experience', []) if resume_data else []
        
        experience_text = "No experience listed"
        if experience and len(experience) > 0:
            exp = experience[0]
            experience_text = f"{exp.get('title', 'Professional')} at {exp.get('company', 'Unknown Company')}"
            if exp.get('duration'):
                experience_text += f" ({exp.get('duration')})"
        
        # Extract location
        location = cv_owner.get('location', 'Not specified')
        if not location or location == 'Not specified':
            location = resume_data.get('extracted_data', {}).get('location', 'Not specified') if resume_data else 'Not specified'
        
        # Handle location object format
        if isinstance(location, dict):
            location_parts = []
            if location.get('city'):
                location_parts.append(location['city'])
            if location.get('state'):
                location_parts.append(location['state'])
            if location.get('country'):
                location_parts.append(location['country'])
            location = ', '.join(location_parts) if location_parts else 'Not specified'
        
        # Extract skills
        skills = cv_owner.get('skills', [])
        if not skills and resume_data:
            skills = resume_data.get('extracted_data', {}).get('skills', [])
        if not skills:
            skills = []
        
        # Extract education details
        education = cv_owner.get('education', [])
        if not education and resume_data:
            education = resume_data.get('education', [])
        if not education:
            education = []
        
        education_text = "No education listed"
        if education and len(education) > 0:
            edu = education[0]
            education_text = f"{edu.get('degree', 'Degree')} from {edu.get('institution', 'Institution')}"
            if edu.get('year'):
                education_text += f" ({edu.get('year')})"
        
        # Calculate last active time
        last_login = cv_owner.get('lastLogin')
        if last_login:
            if isinstance(last_login, str):
                try:
                    last_login = datetime.fromisoformat(last_login.replace('Z', '+00:00'))
                except:
                    last_login = datetime.utcnow()
            elif isinstance(last_login, datetime):
                pass
            else:
                last_login = datetime.utcnow()
            
            now = datetime.utcnow()
            if last_login.tzinfo is None:
                last_login = last_login.replace(tzinfo=None)
            if now.tzinfo is None:
                now = now.replace(tzinfo=None)
            
            time_diff = now - last_login
            days_ago = time_diff.days
            
            if days_ago == 0:
                hours_ago = time_diff.seconds // 3600
                if hours_ago == 0:
                    minutes_ago = time_diff.seconds // 60
                    if minutes_ago < 1:
                        last_active_text = "Just now"
                    else:
                        last_active_text = f"{minutes_ago} minute{'s' if minutes_ago > 1 else ''} ago"
                else:
                    last_active_text = f"{hours_ago} hour{'s' if hours_ago > 1 else ''} ago"
            elif days_ago == 1:
                last_active_text = "Yesterday"
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
        if full_name and full_name != 'Unknown User':
            match_score += 20
        if experience_text and experience_text != 'No experience listed':
            match_score += 20
        if skills and len(skills) > 0:
            match_score += 20
        if education_text and education_text != 'No education listed':
            match_score += 15
        if location and location != 'Not specified':
            match_score += 10
        if resume_data:
            match_score += 15
        
        # Record the view
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
            'title': resume_data.get('extracted_data', {}).get('job_title', experience[0].get('title', 'Professional') if experience and len(experience) > 0 else 'Professional') if resume_data else (experience[0].get('title', 'Professional') if experience and len(experience) > 0 else 'Professional'),
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
        
        logger.info(f"Successfully returned CV details for {full_name}")
        return jsonify(cv_details), 200
        
    except Exception as e:
        logger.error(f"Error viewing CV {cv_id}: {e}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return jsonify({"error": "Failed to view CV", "details": str(e)}), 500

@cv_access_routes.route('/user/cv-limits', methods=['GET'])
@jwt_required()
def get_user_cv_limits():
    """
    Get CV viewing limits for the current user
    """
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"Getting CV limits for user: {current_user_id}")
        
        db = get_db()
        if db is None:
            logger.error("Database connection failed")
            return jsonify({"error": "Database connection failed"}), 500
        
        users_collection = db.users
        current_user = users_collection.find_one({'_id': ObjectId(current_user_id)})
        if not current_user:
            logger.error("User not found")
            return jsonify({"error": "User not found"}), 404
        
        # Get CV viewing limits based on subscription
        subscription = current_user.get('subscription', 'free')
        cv_views_this_month = current_user.get('cv_views_this_month', 0)
        
        # Set limits based on subscription
        if subscription == 'premium':
            max_views = 100
        elif subscription == 'pro':
            max_views = 50
        else:  # free
            max_views = 10
        
        logger.info(f"User {current_user_id} has {cv_views_this_month}/{max_views} CV views this month")
        return jsonify({
            'success': True,
            'viewCount': cv_views_this_month,
            'maxViews': max_views
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting CV limits: {e}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return jsonify({"error": "Failed to get CV limits", "details": str(e)}), 500
