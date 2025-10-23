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
@jwt_required()
def get_dashboard_summary():
    """Get summary analytics for recruiter dashboard"""
    try:
        current_user_id = get_jwt_identity()
        
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

@analytics_bp.route('/recruitment-analytics', methods=['GET'])
@jwt_required()
def get_recruitment_analytics():
    """Get comprehensive recruitment analytics for dashboard cards"""
    try:
        print(f"🔍 Analytics endpoint called")
        print(f"📋 Request method: {request.method}")
        print(f"📋 Request headers: {dict(request.headers)}")
        
        current_user_id = get_jwt_identity()
        print(f"👤 Current user ID: {current_user_id}")
        
        days = int(request.args.get('days', 30))
        print(f"📅 Days parameter: {days}")
        
        analytics = analytics_service.get_recruitment_analytics(current_user_id, days)
        print(f"📊 Analytics result: {analytics is not None}")
        
        if analytics:
            return jsonify({"success": True, "data": analytics})
        else:
            print("❌ Analytics service returned None")
            return jsonify({"error": "Failed to get analytics data"}), 500
    except Exception as e:
        print(f"❌ Error in recruitment analytics: {e}")
        import traceback
        print(f"📋 Traceback: {traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

@analytics_bp.route('/recruiter/detailed', methods=['GET'])
@jwt_required()
def get_detailed_recruiter_analytics():
    """Get detailed analytics for recruiter including charts data"""
    try:
        current_user_id = get_jwt_identity()
        days = int(request.args.get('days', 30))
        
        # Get comprehensive analytics data
        analytics = analytics_service.get_detailed_recruiter_analytics(current_user_id, days)
        
        if analytics:
            return jsonify({"success": True, "data": analytics})
        else:
            return jsonify({"error": "Failed to get detailed analytics data"}), 500
    except Exception as e:
        print(f"❌ Error in detailed recruiter analytics: {e}")
        return jsonify({"error": str(e)}), 500

@analytics_bp.route('/recruiter/job-performance', methods=['GET'])
@jwt_required()
def get_job_performance_analytics():
    """Get job performance analytics for all jobs"""
    try:
        current_user_id = get_jwt_identity()
        
        analytics = analytics_service.get_all_jobs_performance(current_user_id)
        
        if analytics:
            return jsonify({"success": True, "data": analytics})
        else:
            return jsonify({"error": "Failed to get job performance data"}), 500
    except Exception as e:
        print(f"❌ Error in job performance analytics: {e}")
        return jsonify({"error": str(e)}), 500

@analytics_bp.route('/recruiter/candidate-insights', methods=['GET'])
@jwt_required()
def get_candidate_insights():
    """Get candidate insights and demographics"""
    try:
        current_user_id = get_jwt_identity()
        
        insights = analytics_service.get_candidate_insights(current_user_id)
        
        if insights:
            return jsonify({"success": True, "data": insights})
        else:
            return jsonify({"error": "Failed to get candidate insights"}), 500
    except Exception as e:
        print(f"❌ Error in candidate insights: {e}")
        return jsonify({"error": str(e)}), 500

# Job Seeker Analytics Endpoints
@analytics_bp.route('/jobseeker', methods=['GET'])
@jwt_required()
def get_jobseeker_analytics():
    """Get comprehensive analytics for job seekers - REAL DATA ONLY"""
    try:
        current_user_id = get_jwt_identity()
        period = request.args.get('period', '30d')
        
        # Calculate days based on period
        days = 30
        if period == '7d':
            days = 7
        elif period == '90d':
            days = 90
        elif period == '1y':
            days = 365
        
        from datetime import timedelta
        start_date = datetime.utcnow() - timedelta(days=days)
        from utils.db import get_db
        db = get_db()
        
        # Get user's applications
        applications = list(db.applications.find(
            {"userId": current_user_id, "created_at": {"$gte": start_date}},
            {"_id": 1, "job_id": 1, "status": 1, "created_at": 1, "matchScore": 1}
        ))
        
        # Calculate real analytics
        total_applications = len(applications)
        responses = len([app for app in applications if app.get("status") not in ["pending", "rejected"]])
        interviews = len([app for app in applications if app.get("status") == "interview_scheduled"])
        offers = len([app for app in applications if app.get("status") == "accepted"])
        
        # Get user's skills from profile
        user = db.users.find_one({"_id": ObjectId(current_user_id)})
        user_skills = user.get("skills", []) if user else []
        
        analytics_data = {
            'applications': {
                'total': total_applications,
                'thisMonth': total_applications,
                'lastMonth': 0,  # Would need historical data
                'trend': 0
            },
            'responses': {
                'total': responses,
                'rate': (responses / total_applications * 100) if total_applications > 0 else 0,
                'interviews': interviews,
                'offers': offers
            },
            'skills': {
                'topSkills': [{'name': skill, 'count': 1} for skill in user_skills[:5]],
                'skillGaps': [],
                'recommendations': []
            },
            'market': {
                'avgResponseTime': 0,
                'salaryRange': {'min': 0, 'max': 0},
                'topCompanies': [],
                'topLocations': []
            },
            'aiInsights': {
                'profileScore': 0,
                'suggestions': [],
                'keywords': user_skills,
                'improvements': []
            }
        }
        
        return jsonify(analytics_data), 200
        
    except Exception as e:
        print(f"Error in job seeker analytics: {e}")
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/jobseeker/trends', methods=['GET'])
@jwt_required()
def get_application_trends():
    """Get application trends over time for job seekers - REAL DATA ONLY"""
    try:
        current_user_id = get_jwt_identity()
        period = request.args.get('period', '30d')
        
        # Calculate days based on period
        days = 30
        if period == '7d':
            days = 7
        elif period == '90d':
            days = 90
        
        from datetime import timedelta
        start_date = datetime.utcnow() - timedelta(days=days)
        from utils.db import get_db
        db = get_db()
        
        # Get user's applications
        applications = list(db.applications.find(
            {"userId": current_user_id, "created_at": {"$gte": start_date}},
            {"_id": 1, "status": 1, "created_at": 1}
        ))
        
        # Group by date
        apps_by_date = {}
        responses_by_date = {}
        interviews_by_date = {}
        
        for app in applications:
            date = app.get("created_at", datetime.utcnow())
            if isinstance(date, str):
                try:
                    date = datetime.fromisoformat(date.replace('Z', '+00:00'))
                except:
                    date = datetime.utcnow()
            
            date_str = date.date().isoformat()
            apps_by_date[date_str] = apps_by_date.get(date_str, 0) + 1
            
            status = app.get("status", "pending")
            if status not in ["pending", "rejected"]:
                responses_by_date[date_str] = responses_by_date.get(date_str, 0) + 1
            
            if status == "interview_scheduled":
                interviews_by_date[date_str] = interviews_by_date.get(date_str, 0) + 1
        
        trends = {
            'applications': [{'date': date, 'count': count} for date, count in sorted(apps_by_date.items())],
            'responses': [{'date': date, 'count': count} for date, count in sorted(responses_by_date.items())],
            'interviews': [{'date': date, 'count': count} for date, count in sorted(interviews_by_date.items())]
        }
        
        return jsonify(trends), 200
        
    except Exception as e:
        print(f"Error in application trends: {e}")
        return jsonify({'error': str(e)}), 500

# AI Resume Optimization Endpoints
@analytics_bp.route('/ai/resume-optimization', methods=['POST'])
@jwt_required()
def optimize_resume():
    """AI-powered resume optimization endpoint - Placeholder for AI integration"""
    try:
        data = request.get_json()
        resume_data = data.get('resume_data', {})
        
        # Return empty structure - Real AI integration would go here
        suggestions = {
            'summary_suggestions': '',
            'skill_suggestions': [],
            'keywords': [],
            'improvements': [],
            'note': 'AI optimization requires external AI service integration'
        }
        
        return jsonify(suggestions), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/ai/analytics-insights', methods=['POST'])
@jwt_required()
def generate_analytics_insights():
    """AI-powered analytics insights for job seekers - Placeholder for AI integration"""
    try:
        data = request.get_json()
        period = data.get('period', '30d')
        user_id = data.get('user_id')
        
        # Return empty structure - Real AI integration would go here
        insights = {
            'profileScore': 0,
            'suggestions': [],
            'keywords': [],
            'improvements': [],
            'note': 'AI insights require external AI service integration'
        }
        
        return jsonify(insights), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500