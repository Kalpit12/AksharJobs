"""
Interviews Routes
Provides endpoints for managing interviews
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime, timedelta
from utils.db import get_db
import logging

interviews_routes = Blueprint('interviews_routes', __name__)
logger = logging.getLogger(__name__)

@interviews_routes.route('', methods=['GET'])
@interviews_routes.route('/', methods=['GET'])
@jwt_required()
def get_interviews():
    """Get interviews for the current user"""
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"Getting interviews for user: {current_user_id}")
        
        db = get_db()
        if db is None:
            logger.error("Database connection failed")
            return jsonify({"error": "Database connection failed"}), 500
        
        # Convert string ID to ObjectId
        try:
            user_object_id = ObjectId(current_user_id)
        except Exception as e:
            logger.error(f"Invalid user ID format: {current_user_id}, error: {e}")
            return jsonify({"error": "Invalid user ID format"}), 400
        
        # Get applications with interview status
        applications_collection = db.applications
        interviews = list(applications_collection.find({
            'user_id': user_object_id,
            'status': 'interview_scheduled'
        }))
        
        # Get job details for each interview
        jobs_collection = db.jobs
        interview_details = []
        
        for interview in interviews:
            try:
                job = jobs_collection.find_one({'_id': interview['job_id']})
                if job:
                    interview_detail = {
                        'id': str(interview['_id']),
                        'job_title': job.get('title', 'Unknown'),
                        'company': job.get('company', 'Unknown'),
                        'location': job.get('location', 'Unknown'),
                        'interview_date': interview.get('interview_date'),
                        'interview_mode': interview.get('interview_mode', 'TBD'),
                        'status': interview.get('status'),
                        'applied_date': interview.get('created_at'),
                        'job_id': str(job['_id'])
                    }
                    interview_details.append(interview_detail)
            except Exception as e:
                logger.error(f"Error processing interview {interview.get('_id')}: {e}")
                continue
        
        # Sort by interview date (upcoming first)
        interview_details.sort(key=lambda x: x.get('interview_date', ''))
        
        logger.info(f"Found {len(interview_details)} interviews for user {current_user_id}")
        return jsonify(interview_details), 200
        
    except Exception as e:
        logger.error(f"Error fetching interviews: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch interviews"}), 500

@interviews_routes.route('/<interview_id>', methods=['GET'])
@jwt_required()
def get_interview_details(interview_id):
    """Get details for a specific interview"""
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"Getting interview details for interview {interview_id} and user {current_user_id}")
        
        db = get_db()
        if db is None:
            logger.error("Database connection failed")
            return jsonify({"error": "Database connection failed"}), 500
        
        # Convert string ID to ObjectId
        try:
            user_object_id = ObjectId(current_user_id)
            interview_object_id = ObjectId(interview_id)
        except Exception as e:
            logger.error(f"Invalid ID format: {e}")
            return jsonify({"error": "Invalid ID format"}), 400
        
        # Get interview details
        applications_collection = db.applications
        interview = applications_collection.find_one({
            '_id': interview_object_id,
            'user_id': user_object_id
        })
        
        if not interview:
            return jsonify({"error": "Interview not found"}), 404
        
        # Get job details
        jobs_collection = db.jobs
        job = jobs_collection.find_one({'_id': interview['job_id']})
        
        if not job:
            return jsonify({"error": "Job not found"}), 404
        
        interview_details = {
            'id': str(interview['_id']),
            'job_title': job.get('title', 'Unknown'),
            'company': job.get('company', 'Unknown'),
            'location': job.get('location', 'Unknown'),
            'job_description': job.get('description', ''),
            'requirements': job.get('requirements', []),
            'interview_date': interview.get('interview_date'),
            'interview_mode': interview.get('interview_mode', 'TBD'),
            'status': interview.get('status'),
            'applied_date': interview.get('created_at'),
            'job_id': str(job['_id'])
        }
        
        return jsonify(interview_details), 200
        
    except Exception as e:
        logger.error(f"Error fetching interview details: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch interview details"}), 500

@interviews_routes.route('/upcoming', methods=['GET'])
@jwt_required()
def get_upcoming_interviews():
    """Get upcoming interviews for the current user"""
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"Getting upcoming interviews for user: {current_user_id}")
        
        db = get_db()
        if db is None:
            logger.error("Database connection failed")
            return jsonify({"error": "Database connection failed"}), 500
        
        # Convert string ID to ObjectId
        try:
            user_object_id = ObjectId(current_user_id)
        except Exception as e:
            logger.error(f"Invalid user ID format: {current_user_id}, error: {e}")
            return jsonify({"error": "Invalid user ID format"}), 400
        
        # Get applications with interview status and upcoming dates
        applications_collection = db.applications
        current_date = datetime.now().isoformat()
        
        interviews = list(applications_collection.find({
            'user_id': user_object_id,
            'status': 'interview_scheduled',
            'interview_date': {'$gte': current_date}
        }))
        
        # Get job details for each interview
        jobs_collection = db.jobs
        upcoming_interviews = []
        
        for interview in interviews:
            try:
                job = jobs_collection.find_one({'_id': interview['job_id']})
                if job:
                    interview_detail = {
                        'id': str(interview['_id']),
                        'job_title': job.get('title', 'Unknown'),
                        'company': job.get('company', 'Unknown'),
                        'location': job.get('location', 'Unknown'),
                        'interview_date': interview.get('interview_date'),
                        'interview_mode': interview.get('interview_mode', 'TBD'),
                        'job_id': str(job['_id'])
                    }
                    upcoming_interviews.append(interview_detail)
            except Exception as e:
                logger.error(f"Error processing upcoming interview {interview.get('_id')}: {e}")
                continue
        
        # Sort by interview date (soonest first)
        upcoming_interviews.sort(key=lambda x: x.get('interview_date', ''))
        
        logger.info(f"Found {len(upcoming_interviews)} upcoming interviews for user {current_user_id}")
        return jsonify(upcoming_interviews), 200
        
    except Exception as e:
        logger.error(f"Error fetching upcoming interviews: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch upcoming interviews"}), 500
