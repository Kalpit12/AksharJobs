"""
Enhanced Application Routes with Advanced Gemini Models
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime
from utils.db import get_db
from services.enhanced_application_service import process_application_enhanced, get_enhanced_recommendations
from services.advanced_gemini_service import get_advanced_gemini_service
import logging

logger = logging.getLogger(__name__)

enhanced_application_bp = Blueprint('enhanced_application', __name__)

@enhanced_application_bp.route('/apply-enhanced', methods=['POST'])
@jwt_required()
def apply_for_job_enhanced():
    """Enhanced job application with advanced Gemini models"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'jobId' not in data:
            return jsonify({'error': 'Job ID is required'}), 400
        
        job_id = data['jobId']
        cover_letter = data.get('coverLetter', '')
        
        logger.info(f"Enhanced application request from user {current_user_id} for job {job_id}")
        
        # Process application with enhanced service
        result = process_application_enhanced(current_user_id, job_id, 'pending')
        
        if 'error' in result:
            return jsonify(result), result.get('status_code', 500)
        
        return jsonify({
            'message': 'Enhanced application submitted successfully',
            'application_id': result['applicationId'],
            'final_score': result['final_score'],
            'ai_confidence': result['ai_confidence'],
            'model_used': result['model_used'],
            'analysis_summary': result['analysis_summary']
        }), 201
        
    except Exception as e:
        logger.error(f"Error in enhanced application: {e}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@enhanced_application_bp.route('/recommendations-enhanced', methods=['GET'])
@jwt_required()
def get_enhanced_job_recommendations():
    """Get enhanced job recommendations using advanced Gemini models"""
    try:
        current_user_id = get_jwt_identity()
        limit = request.args.get('limit', 10, type=int)
        
        logger.info(f"Enhanced recommendations request from user {current_user_id}")
        
        recommendations = get_enhanced_recommendations(current_user_id, limit)
        
        if 'error' in recommendations:
            return jsonify(recommendations), recommendations.get('status_code', 500)
        
        return jsonify(recommendations), 200
        
    except Exception as e:
        logger.error(f"Error getting enhanced recommendations: {e}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@enhanced_application_bp.route('/analyze-resume', methods=['POST'])
@jwt_required()
def analyze_resume_enhanced():
    """Enhanced resume analysis using Gemini 1.5 Pro"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'resumeText' not in data:
            return jsonify({'error': 'Resume text is required'}), 400
        
        resume_text = data['resumeText']
        
        logger.info(f"Enhanced resume analysis request from user {current_user_id}")
        
        gemini_service = get_advanced_gemini_service()
        parsed_resume = gemini_service.parse_resume_advanced(resume_text)
        
        if not parsed_resume:
            return jsonify({'error': 'Failed to parse resume'}), 500
        
        return jsonify({
            'message': 'Resume analyzed successfully',
            'parsed_data': parsed_resume,
            'model_used': 'gemini-1.5-pro'
        }), 200
        
    except Exception as e:
        logger.error(f"Error in enhanced resume analysis: {e}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@enhanced_application_bp.route('/model-info', methods=['GET'])
def get_model_info():
    """Get information about available Gemini models"""
    try:
        gemini_service = get_advanced_gemini_service()
        model_info = gemini_service.get_model_info()
        
        return jsonify({
            'message': 'Model information retrieved successfully',
            'models': model_info
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting model info: {e}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@enhanced_application_bp.route('/test-enhanced', methods=['POST'])
def test_enhanced_service():
    """Test the enhanced Gemini service"""
    try:
        data = request.get_json()
        test_prompt = data.get('prompt', 'Hello, this is a test of the enhanced Gemini service.')
        model = data.get('model', None)
        
        gemini_service = get_advanced_gemini_service()
        response = gemini_service.call_gemini(test_prompt, model=model)
        
        if response:
            return jsonify({
                'message': 'Enhanced service test successful',
                'response': response,
                'model_used': model or 'auto-selected'
            }), 200
        else:
            return jsonify({'error': 'Enhanced service test failed'}), 500
            
    except Exception as e:
        logger.error(f"Error testing enhanced service: {e}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500
