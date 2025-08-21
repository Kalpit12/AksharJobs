from flask import Blueprint, request, jsonify
from services.analytics_service import AnalyticsService
from flask_jwt_extended import jwt_required, get_jwt_identity
import json

analytics_bp = Blueprint('analytics', __name__)
analytics_service = AnalyticsService()

@analytics_bp.route('/test', methods=['GET'])
def test_endpoint():
    """Test endpoint to verify analytics service is working"""
    try:
        return jsonify({"success": True, "message": "Analytics service is working!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@analytics_bp.route('/match-thresholds', methods=['GET'])
# @jwt_required()  # Temporarily disabled for testing
def get_match_thresholds():
    """Get match score thresholds for a recruiter's jobs"""
    try:
        # Temporarily use a hardcoded recruiter ID for testing
        current_user_id = "sample_recruiter_123"  # This matches the sample data we created
        
        thresholds = analytics_service.get_match_score_thresholds(current_user_id)
        return jsonify({"success": True, "data": thresholds})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@analytics_bp.route('/match-thresholds', methods=['POST'])
# @jwt_required()  # Temporarily disabled for testing
def set_match_thresholds():
    """Set match score thresholds for a specific job"""
    try:
        data = request.get_json()
        job_id = data.get('job_id')
        min_threshold = data.get('min_threshold', 70)
        auto_reject_threshold = data.get('auto_reject_threshold', 50)
        
        if not job_id:
            return jsonify({"error": "job_id is required"}), 400
        
        success = analytics_service.set_match_score_thresholds(
            job_id, min_threshold, auto_reject_threshold
        )
        
        if success:
            return jsonify({"success": True, "message": "Thresholds updated successfully"})
        else:
            return jsonify({"error": "Failed to update thresholds"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@analytics_bp.route('/skills-gap-analysis', methods=['GET'])
# @jwt_required()  # Temporarily disabled for testing
def get_skills_gap_analysis():
    """Get skills gap analysis for a specific job"""
    try:
        job_id = request.args.get('job_id')
        if not job_id:
            return jsonify({"error": "job_id is required"}), 400
        
        analysis = analytics_service.get_skills_gap_analysis(job_id)
        if analysis:
            return jsonify({"success": True, "data": analysis})
        else:
            return jsonify({"error": "Job not found or no applications"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@analytics_bp.route('/matching-history', methods=['GET'])
# @jwt_required()  # Temporarily disabled for testing
def get_matching_history():
    """Get matching history and performance metrics for a recruiter"""
    try:
        # Temporarily use a hardcoded recruiter ID for testing
        current_user_id = "sample_recruiter_123"  # This matches the sample data we created
        days = int(request.args.get('days', 30))
        
        history = analytics_service.get_matching_history(current_user_id, days)
        return jsonify({"success": True, "data": history})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@analytics_bp.route('/competitor-analysis', methods=['GET'])
# @jwt_required()  # Temporarily disabled for testing
def get_competitor_analysis():
    """Get competitor analysis for a job"""
    try:
        job_title = request.args.get('job_title')
        location = request.args.get('location')
        industry = request.args.get('industry')
        
        if not all([job_title, location, industry]):
            return jsonify({"error": "job_title, location, and industry are required"}), 400
        
        analysis = analytics_service.get_competitor_analysis(job_title, location, industry)
        if analysis:
            return jsonify({"success": True, "data": analysis})
        else:
            return jsonify({"error": "Failed to get competitor analysis"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@analytics_bp.route('/candidate-recommendations', methods=['GET'])
# @jwt_required()  # Temporarily disabled for testing
def get_candidate_recommendations():
    """Get candidate recommendations based on match score threshold"""
    try:
        job_id = request.args.get('job_id')
        min_threshold = int(request.args.get('min_threshold', 70))
        
        if not job_id:
            return jsonify({"error": "job_id is required"}), 400
        
        recommendations = analytics_service.get_candidate_recommendations(job_id, min_threshold)
        return jsonify({"success": True, "data": recommendations})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@analytics_bp.route('/job-performance', methods=['GET'])
# @jwt_required()  # Temporarily disabled for testing
def get_job_performance():
    """Get comprehensive performance metrics for a specific job"""
    try:
        job_id = request.args.get('job_id')
        if not job_id:
            return jsonify({"error": "job_id is required"}), 400
        
        metrics = analytics_service.get_job_performance_metrics(job_id)
        if metrics:
            return jsonify({"success": True, "data": metrics})
        else:
            return jsonify({"error": "Job not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@analytics_bp.route('/dashboard-summary', methods=['GET'])
# @jwt_required()  # Temporarily disabled for testing
def get_dashboard_summary():
    """Get summary analytics for recruiter dashboard"""
    try:
        # Temporarily use a hardcoded recruiter ID for testing
        current_user_id = "sample_recruiter_123"  # This matches the sample data we created
        
        # Get various metrics
        thresholds = analytics_service.get_match_score_thresholds(current_user_id)
        history = analytics_service.get_matching_history(current_user_id, 30)
        
        # Calculate summary stats
        total_jobs = len(thresholds)
        total_applications = sum(job.get('total_applications', 0) for job in history)
        avg_match_score = sum(job.get('average_match_score', 0) for job in history) / len(history) if history else 0
        
        summary = {
            "total_jobs": total_jobs,
            "total_applications": total_applications,
            "average_match_score": round(avg_match_score, 2),
            "recent_jobs": history[:5] if history else [],
            "thresholds": thresholds
        }
        
        return jsonify({"success": True, "data": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
