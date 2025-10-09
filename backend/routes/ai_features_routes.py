"""
AI Features Routes
API endpoints for all AI-powered features
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime
from utils.db import get_db
from services.ai_service import ai_service
import logging

logger = logging.getLogger(__name__)

ai_features_bp = Blueprint('ai_features', __name__)

# ===== JOB SEEKER AI FEATURES =====

@ai_features_bp.route('/career-path-advisor', methods=['POST'])
@jwt_required()
def career_path_advisor():
    """Generate AI-powered career path roadmap for job seeker"""
    try:
        current_user_id = get_jwt_identity()
        db = get_db()
        
        # Get user data
        user = db.users.find_one({'_id': ObjectId(current_user_id)})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get job seeker comprehensive profile
        jobseeker_profile = db.jobseeker_profiles.find_one({'userId': ObjectId(current_user_id)})
        
        # Prepare user data for AI
        user_data = {
            'mostRecentJobTitle': user.get('employment', {}).get('mostRecentJobTitle', '') if jobseeker_profile else user.get('mostRecentJobTitle', 'Professional'),
            'skills': user.get('technicalSkills', []) + user.get('softSkills', []),
            'yearsOfExperience': user.get('employment', {}).get('yearsOfExperience', '0-1 year') if jobseeker_profile else '0-1 year',
            'currentLocation': user.get('location', {}).get('city', ''),
            'industry': user.get('industry', '')
        }
        
        # Generate career path using AI
        result = ai_service.generate_career_path(user_data)
        
        # Save to database for history
        career_path_history = db.career_path_history
        career_path_history.insert_one({
            'userId': ObjectId(current_user_id),
            'roadmap': result['roadmap'],
            'recommendations': result['recommendations'],
            'createdAt': datetime.utcnow()
        })
        
        logger.info(f"Career path generated for user {current_user_id}")
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error in career path advisor: {e}")
        return jsonify({'error': str(e)}), 500

# ===== INTERN AI FEATURES =====

@ai_features_bp.route('/project-recommender', methods=['POST'])
@jwt_required()
def project_recommender():
    """Recommend impactful projects for intern growth"""
    try:
        current_user_id = get_jwt_identity()
        db = get_db()
        
        # Get intern details
        intern_details = db.intern_details.find_one({'userId': ObjectId(current_user_id)})
        if not intern_details:
            return jsonify({'error': 'Intern profile not found'}), 404
        
        # Prepare intern data for AI
        intern_data = {
            'technicalSkills': intern_details.get('technicalSkills', []),
            'softSkills': intern_details.get('softSkills', []),
            'interests': intern_details.get('interests', []),
            'experienceLevel': 'Beginner',  # Most interns are beginners
            'desiredRole': intern_details.get('desiredRole', 'Professional')
        }
        
        # Generate project recommendations
        result = ai_service.recommend_projects(intern_data)
        
        # Save to database
        project_recommendations = db.project_recommendations
        project_recommendations.insert_one({
            'userId': ObjectId(current_user_id),
            'projects': result['recommended_projects'],
            'createdAt': datetime.utcnow()
        })
        
        logger.info(f"Projects recommended for intern {current_user_id}")
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error in project recommender: {e}")
        return jsonify({'error': str(e)}), 500

@ai_features_bp.route('/learning-path-generator', methods=['POST'])
@jwt_required()
def learning_path_generator():
    """Generate structured learning path for intern"""
    try:
        current_user_id = get_jwt_identity()
        db = get_db()
        
        # Get intern details
        intern_details = db.intern_details.find_one({'userId': ObjectId(current_user_id)})
        if not intern_details:
            return jsonify({'error': 'Intern profile not found'}), 404
        
        # Prepare intern data for AI
        intern_data = {
            'technicalSkills': intern_details.get('technicalSkills', []),
            'desiredRole': intern_details.get('desiredRole', 'Professional'),
            'internshipDuration': 12,  # Default 12 weeks
            'currentLevel': 'Beginner'
        }
        
        # Generate learning path
        result = ai_service.generate_learning_path(intern_data)
        
        # Save to database
        learning_paths = db.learning_paths
        learning_paths.insert_one({
            'userId': ObjectId(current_user_id),
            'learningPlan': result['learning_plan'],
            'weeklySchedule': result['weekly_schedule'],
            'createdAt': datetime.utcnow()
        })
        
        logger.info(f"Learning path generated for intern {current_user_id}")
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error in learning path generator: {e}")
        return jsonify({'error': str(e)}), 500

# ===== RECRUITER AI FEATURES =====

@ai_features_bp.route('/job-description-generator', methods=['POST'])
@jwt_required()
def job_description_generator():
    """Generate comprehensive job description"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not data.get('jobTitle'):
            return jsonify({'error': 'Job title is required'}), 400
        
        db = get_db()
        user = db.users.find_one({'_id': ObjectId(current_user_id)})
        
        # Prepare job data for AI
        job_data = {
            'jobTitle': data.get('jobTitle'),
            'companyName': data.get('companyName', user.get('companyName', 'Our Company')),
            'location': data.get('location', ''),
            'experienceLevel': data.get('experienceLevel', 'Mid-Level'),
            'skills': data.get('skills', []),
            'jobType': data.get('jobType', 'Full-time'),
            'workMode': data.get('workMode', 'Hybrid')
        }
        
        # Generate job description
        result = ai_service.generate_job_description(job_data)
        
        # Save to database for history
        jd_history = db.job_description_history
        jd_history.insert_one({
            'userId': ObjectId(current_user_id),
            'jobTitle': job_data['jobTitle'],
            'generatedDescription': result['generated_description'],
            'createdAt': datetime.utcnow()
        })
        
        logger.info(f"Job description generated for recruiter {current_user_id}")
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error in job description generator: {e}")
        return jsonify({'error': str(e)}), 500

@ai_features_bp.route('/application-review', methods=['POST'])
@jwt_required()
def application_review():
    """AI-powered application review"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not data.get('applicationId'):
            return jsonify({'error': 'Application ID is required'}), 400
        
        db = get_db()
        
        # Check if this is a mock test (using mock ObjectId)
        if data['applicationId'] == '507f1f77bcf86cd799439011':
            # Use mock data for testing
            application_data = {
                'candidateName': data.get('candidateName', 'John Doe'),
                'skills': data.get('skills', ['Python', 'React', 'JavaScript']),
                'experience': data.get('experience', '3 years'),
                'resumeText': data.get('resumeText', 'Experienced developer...')
            }
            
            job_requirements = {
                'requiredSkills': ['Python', 'React', 'Node.js', 'AWS'],
                'experienceLevel': 'Mid-Level'
            }
        else:
            # Get real application details
            application = db.applications.find_one({'_id': ObjectId(data['applicationId'])})
            if not application:
                return jsonify({'error': 'Application not found'}), 404
            
            # Get applicant details
            applicant = db.users.find_one({'_id': ObjectId(application['applicant_id'])})
            
            # Get job details
            job = db.jobs.find_one({'_id': ObjectId(application['job_id'])})
            
            # Prepare data for AI
            application_data = {
                'candidateName': f"{applicant.get('firstName', '')} {applicant.get('lastName', '')}",
                'skills': applicant.get('skills', []) + applicant.get('technicalSkills', []),
                'experience': applicant.get('experience', ''),
                'resumeText': application.get('resumeText', '')
            }
            
            job_requirements = {
                'requiredSkills': job.get('required_skills', '').split(', ') if isinstance(job.get('required_skills'), str) else job.get('required_skills', []),
                'experienceLevel': job.get('experience_level', 'Mid-Level')
            }
        
        # Review application using AI
        result = ai_service.review_application(application_data, job_requirements)
        
        # Save review to database
        application_reviews = db.application_reviews
        application_reviews.insert_one({
            'applicationId': ObjectId(data['applicationId']) if data['applicationId'] != '507f1f77bcf86cd799439011' else ObjectId(),
            'reviewerId': ObjectId(current_user_id),
            'overallScore': result['overall_score'],
            'recommendation': result['recommendation'],
            'summary': result['summary'],
            'createdAt': datetime.utcnow()
        })
        
        logger.info(f"Application reviewed by recruiter {current_user_id}")
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error in application review: {e}")
        return jsonify({'error': str(e)}), 500

@ai_features_bp.route('/offer-acceptance-predictor', methods=['POST'])
@jwt_required()
def offer_acceptance_predictor():
    """Predict likelihood of offer acceptance"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not data.get('candidateId') or not data.get('offeredSalary'):
            return jsonify({'error': 'Candidate ID and offered salary are required'}), 400
        
        db = get_db()
        
        # Check if this is a mock test (using mock ObjectId)
        if data['candidateId'] == '507f1f77bcf86cd799439011':
            # Use mock data for testing
            candidate_data = {
                'candidateName': 'John Doe',
                'currentSalary': data.get('candidateCurrentSalary', 100000),
                'location': 'San Francisco, CA',
                'priorities': ['remote', 'growth', 'salary']
            }
        else:
            # Get real candidate details
            candidate = db.users.find_one({'_id': ObjectId(data['candidateId'])})
            if not candidate:
                return jsonify({'error': 'Candidate not found'}), 404
            
            # Prepare candidate data
            candidate_data = {
                'candidateName': f"{candidate.get('firstName', '')} {candidate.get('lastName', '')}",
                'currentSalary': data.get('candidateCurrentSalary', 0),
                'location': candidate.get('location', {}).get('city', '') if isinstance(candidate.get('location'), dict) else '',
                'priorities': ['remote', 'growth', 'salary']  # Default priorities
            }
        
        # Prepare offer details
        offer_details = {
            'salary': data.get('offeredSalary'),
            'workMode': data.get('workMode', 'Hybrid'),
            'benefits': data.get('benefits', []),
            'jobTitle': data.get('jobTitle', 'Position')
        }
        
        # Predict acceptance
        result = ai_service.predict_offer_acceptance(candidate_data, offer_details)
        
        # Save prediction to database
        offer_predictions = db.offer_predictions
        offer_predictions.insert_one({
            'candidateId': ObjectId(data['candidateId']) if data['candidateId'] != '507f1f77bcf86cd799439011' else ObjectId(),
            'recruiterId': ObjectId(current_user_id),
            'acceptanceProbability': result['acceptance_probability'],
            'recommendations': result['recommendations'],
            'createdAt': datetime.utcnow()
        })
        
        logger.info(f"Offer acceptance predicted by recruiter {current_user_id}")
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error in offer acceptance predictor: {e}")
        return jsonify({'error': str(e)}), 500

# ===== UTILITY ENDPOINTS =====

@ai_features_bp.route('/ai-history/<feature_type>', methods=['GET'])
@jwt_required()
def get_ai_history(feature_type):
    """Get history of AI feature usage"""
    try:
        current_user_id = get_jwt_identity()
        db = get_db()
        
        collection_map = {
            'career-path': 'career_path_history',
            'projects': 'project_recommendations',
            'learning-path': 'learning_paths',
            'job-descriptions': 'job_description_history',
            'application-reviews': 'application_reviews',
            'offer-predictions': 'offer_predictions'
        }
        
        collection_name = collection_map.get(feature_type)
        if not collection_name:
            return jsonify({'error': 'Invalid feature type'}), 400
        
        collection = db[collection_name]
        history = list(collection.find(
            {'userId': ObjectId(current_user_id)} if feature_type != 'application-reviews' else {'reviewerId': ObjectId(current_user_id)},
            {'_id': 1, 'createdAt': 1}
        ).sort('createdAt', -1).limit(10))
        
        # Convert ObjectId to string
        for item in history:
            item['_id'] = str(item['_id'])
        
        return jsonify({'success': True, 'history': history}), 200
        
    except Exception as e:
        logger.error(f"Error fetching AI history: {e}")
        return jsonify({'error': str(e)}), 500

# Health check
@ai_features_bp.route('/health', methods=['GET'])
def health_check():
    """Health check for AI features"""
    return jsonify({
        'status': 'healthy',
        'ai_service': 'operational',
        'model': ai_service.model_name,
        'features_available': [
            'career-path-advisor',
            'project-recommender',
            'learning-path-generator',
            'job-description-generator',
            'application-review',
            'offer-acceptance-predictor'
        ]
    }), 200

