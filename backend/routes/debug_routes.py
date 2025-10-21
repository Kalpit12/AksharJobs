from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.job_service import get_job_by_id
from services.ai_prediction_service import prediction_service
from services.application_tracking_service import ApplicationTrackingService
from services.auth_service import AuthService
from utils.db import get_db
from bson import ObjectId
import traceback

debug_bp = Blueprint('debug', __name__, url_prefix='/api/debug')

@debug_bp.route('/test-job-lookup', methods=['GET'])
@jwt_required()
def test_job_lookup():
    """Test job lookup functionality"""
    try:
        user_id = get_jwt_identity()
        
        # Get applications
        applications = ApplicationTrackingService.get_job_seeker_applications(user_id)
        
        if not applications:
            return jsonify({'error': 'No applications found'})
        
        first_app = applications[0]
        job_id = first_app['job_id']
        
        # Test get_job_by_id
        job = get_job_by_id(job_id)
        
        return jsonify({
            'job_id': job_id,
            'job_found': job is not None,
            'job_title': job.get('job_title') if job else None,
            'job_description': job.get('description', '')[:100] if job else None
        })
        
    except Exception as e:
        return jsonify({'error': str(e), 'traceback': traceback.format_exc()})

@debug_bp.route('/test-ai-prediction', methods=['GET'])
@jwt_required()
def test_ai_prediction():
    """Test AI prediction functionality"""
    try:
        user_id = get_jwt_identity()
        
        # Get applications
        applications = ApplicationTrackingService.get_job_seeker_applications(user_id)
        
        if not applications:
            return jsonify({'error': 'No applications found'})
        
        first_app = applications[0]
        job_id = first_app['job_id']
        
        # Get job data
        job = get_job_by_id(job_id)
        
        if not job:
            return jsonify({'error': 'Job not found'})
        
        # Get user profile
        user_profile = AuthService.get_user_by_id(user_id)
        
        if not user_profile:
            return jsonify({'error': 'User profile not found'})
        
        # Test AI prediction
        probability = prediction_service.predict_success_probability(first_app, job, user_profile)
        explanation = prediction_service.get_prediction_explanation(first_app, job, user_profile)
        
        return jsonify({
            'success_probability': probability,
            'explanation': explanation,
            'job_title': job.get('job_title'),
            'user_name': f"{user_profile.get('firstName', '')} {user_profile.get('lastName', '')}"
        })
        
    except Exception as e:
        return jsonify({'error': str(e), 'traceback': traceback.format_exc()})
