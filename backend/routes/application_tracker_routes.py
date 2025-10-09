from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from services.application_tracking_service import get_tracking_service
from services.email_notification_service import get_email_service

application_tracker_bp = Blueprint('application_tracker', __name__)

@application_tracker_bp.route('/tracker/job-seeker/applications', methods=['GET'])
@jwt_required()
def get_job_seeker_applications():
    """Get all applications for the current job seeker with tracking history"""
    try:
        current_user_id = get_jwt_identity()
        tracking_service = get_tracking_service()
        
        applications, status_code = tracking_service.get_job_seeker_applications(current_user_id)
        return jsonify(applications), status_code
        
    except Exception as e:
        print(f"Error in get_job_seeker_applications: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@application_tracker_bp.route('/tracker/recruiter/candidates', methods=['GET'])
@jwt_required()
def get_recruiter_candidates():
    """Get all candidates for the current recruiter with tracking history"""
    try:
        current_user_id = get_jwt_identity()
        tracking_service = get_tracking_service()
        
        candidates, status_code = tracking_service.get_recruiter_candidates(current_user_id)
        return jsonify(candidates), status_code
        
    except Exception as e:
        print(f"Error in get_recruiter_candidates: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@application_tracker_bp.route('/tracker/update-status', methods=['POST'])
@jwt_required()
def update_application_status():
    """Update application status (for recruiters)"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        user_id = data.get('user_id')  # Job seeker ID
        job_id = data.get('job_id')
        new_status = data.get('status')
        notes = data.get('notes')
        interview_date = data.get('interview_date')
        interview_mode = data.get('interview_mode')
        
        if not all([user_id, job_id, new_status]):
            return jsonify({'error': 'user_id, job_id, and status are required'}), 400
        
        tracking_service = get_tracking_service()
        result, status_code = tracking_service.update_application_status(
            user_id, job_id, new_status, notes, interview_date, interview_mode
        )
        
        return jsonify(result), status_code
        
    except Exception as e:
        print(f"Error in update_application_status: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@application_tracker_bp.route('/tracker/history/<user_id>/<job_id>', methods=['GET'])
@jwt_required()
def get_tracking_history(user_id, job_id):
    """Get detailed tracking history for a specific application"""
    try:
        tracking_service = get_tracking_service()
        history, status_code = tracking_service.get_application_tracking_history(user_id, job_id)
        
        return jsonify(history), status_code
        
    except Exception as e:
        print(f"Error in get_tracking_history: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@application_tracker_bp.route('/tracker/statistics', methods=['GET'])
@jwt_required()
def get_application_statistics():
    """Get application statistics for the current user"""
    try:
        current_user_id = get_jwt_identity()
        tracking_service = get_tracking_service()
        
        stats, status_code = tracking_service.get_application_statistics(current_user_id)
        return jsonify(stats), status_code
        
    except Exception as e:
        print(f"Error in get_application_statistics: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@application_tracker_bp.route('/tracker/status-options', methods=['GET'])
def get_status_options():
    """Get available application status options"""
    try:
        tracking_service = get_tracking_service()
        status_options = []
        
        for status in tracking_service.STATUS_PROGRESSION:
            status_options.append({
                'value': status,
                'label': status.replace('_', ' ').title(),
                'description': _get_status_description(status)
            })
        
        return jsonify(status_options), 200
        
    except Exception as e:
        print(f"Error in get_status_options: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@application_tracker_bp.route('/tracker/bulk-update', methods=['POST'])
@jwt_required()
def bulk_update_status():
    """Bulk update application statuses (for recruiters)"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        applications = data.get('applications', [])  # List of {user_id, job_id, status, notes}
        new_status = data.get('status')
        notes = data.get('notes')
        
        if not applications or not new_status:
            return jsonify({'error': 'applications list and status are required'}), 400
        
        tracking_service = get_tracking_service()
        results = []
        
        for app in applications:
            user_id = app.get('user_id')
            job_id = app.get('job_id')
            app_notes = app.get('notes', notes)
            
            if user_id and job_id:
                result, status_code = tracking_service.update_application_status(
                    user_id, job_id, new_status, app_notes
                )
                results.append({
                    'user_id': user_id,
                    'job_id': job_id,
                    'result': result,
                    'status_code': status_code
                })
        
        return jsonify({
            'message': f'Bulk update completed for {len(results)} applications',
            'results': results
        }), 200
        
    except Exception as e:
        print(f"Error in bulk_update_status: {e}")
        return jsonify({'error': 'Internal server error'}), 500

def _get_status_description(status):
    """Get description for application status"""
    descriptions = {
        'pending': 'Application submitted and awaiting review',
        'ai_screening': 'Application is being evaluated by AI system',
        'reviewing': 'Application is being reviewed by hiring team',
        'shortlisted': 'Application has been shortlisted for further consideration',
        'interview': 'Candidate has been selected for interview',
        'hired': 'Candidate has been selected for the position',
        'rejected': 'Application was not successful this time'
    }
    return descriptions.get(status, 'Status description not available')
