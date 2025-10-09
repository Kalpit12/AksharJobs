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

# Job Seeker Analytics Endpoints
@analytics_bp.route('/jobseeker', methods=['GET'])
# @jwt_required()  # Temporarily disabled for testing
def get_jobseeker_analytics():
    """Get comprehensive analytics for job seekers"""
    try:
        # current_user_id = get_jwt_identity()  # Temporarily disabled
        current_user_id = "test_user"  # Mock user ID for testing
        period = request.args.get('period', '30d')
        
        # Mock analytics data for now
        # In a real implementation, this would query the database
        analytics_data = {
            'applications': {
                'total': 25,
                'thisMonth': 8,
                'lastMonth': 12,
                'trend': -33  # percentage change
            },
            'responses': {
                'total': 6,
                'rate': 24,  # percentage
                'interviews': 3,
                'offers': 1
            },
            'skills': {
                'topSkills': [
                    {'name': 'JavaScript', 'count': 15},
                    {'name': 'React', 'count': 12},
                    {'name': 'Python', 'count': 10},
                    {'name': 'Node.js', 'count': 8},
                    {'name': 'AWS', 'count': 6}
                ],
                'skillGaps': [
                    {
                        'skill': 'Docker',
                        'demand': 85,
                        'description': 'Containerization skills are in high demand for DevOps roles'
                    },
                    {
                        'skill': 'Machine Learning',
                        'demand': 78,
                        'description': 'AI/ML skills are trending in the job market'
                    }
                ],
                'recommendations': [
                    'Focus on full-stack development skills',
                    'Learn cloud technologies (AWS, Azure)',
                    'Develop soft skills like leadership'
                ]
            },
            'market': {
                'avgResponseTime': 5.2,
                'salaryRange': {
                    'min': 75000,
                    'max': 120000
                },
                'topCompanies': [
                    {'name': 'Google', 'count': 15},
                    {'name': 'Microsoft', 'count': 12},
                    {'name': 'Amazon', 'count': 10},
                    {'name': 'Meta', 'count': 8}
                ],
                'topLocations': [
                    {'name': 'San Francisco, CA', 'count': 25},
                    {'name': 'Seattle, WA', 'count': 18},
                    {'name': 'New York, NY', 'count': 15},
                    {'name': 'Austin, TX', 'count': 12}
                ]
            },
            'aiInsights': {
                'profileScore': 85,
                'suggestions': [
                    'Your profile is strong! Consider adding more project examples.',
                    'Your response rate could improve with better keyword optimization.',
                    'Try applying to more startups - they seem to respond well to your profile.'
                ],
                'keywords': [
                    'Full Stack Developer', 'React', 'Node.js', 'Python',
                    'AWS', 'Docker', 'Agile', 'Team Leadership'
                ],
                'improvements': [
                    'Add 2-3 more project examples with live demos',
                    'Include specific metrics in your experience descriptions',
                    'Update your skills to include trending technologies'
                ]
            }
        }
        
        return jsonify(analytics_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/jobseeker/trends', methods=['GET'])
@jwt_required()
def get_application_trends():
    """Get application trends over time for job seekers"""
    try:
        current_user_id = get_jwt_identity()
        period = request.args.get('period', '30d')
        
        # Mock trend data
        trends = {
            'applications': [
                {'date': '2024-01-01', 'count': 2},
                {'date': '2024-01-02', 'count': 1},
                {'date': '2024-01-03', 'count': 3},
                {'date': '2024-01-04', 'count': 1},
                {'date': '2024-01-05', 'count': 2},
            ],
            'responses': [
                {'date': '2024-01-01', 'count': 0},
                {'date': '2024-01-02', 'count': 1},
                {'date': '2024-01-03', 'count': 0},
                {'date': '2024-01-04', 'count': 1},
                {'date': '2024-01-05', 'count': 0},
            ],
            'interviews': [
                {'date': '2024-01-01', 'count': 0},
                {'date': '2024-01-02', 'count': 0},
                {'date': '2024-01-03', 'count': 1},
                {'date': '2024-01-04', 'count': 0},
                {'date': '2024-01-05', 'count': 0},
            ]
        }
        
        return jsonify(trends), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# AI Resume Optimization Endpoints
@analytics_bp.route('/ai/resume-optimization', methods=['POST'])
# @jwt_required()  # Temporarily disabled for testing
def optimize_resume():
    """AI-powered resume optimization endpoint"""
    try:
        data = request.get_json()
        resume_data = data.get('resume_data', {})
        
        # Mock AI optimization suggestions
        # In a real implementation, this would call an AI service
        suggestions = {
            'summary_suggestions': 'Consider adding more specific achievements and quantifiable results to your summary. Include relevant keywords from job descriptions you\'re targeting.',
            'skill_suggestions': [
                'Add "Machine Learning" to your skills',
                'Include "Project Management" experience',
                'Highlight "Leadership" capabilities'
            ],
            'keywords': [
                'Python', 'React', 'AWS', 'Docker', 'Kubernetes',
                'Agile', 'Scrum', 'CI/CD', 'Microservices', 'API Development'
            ],
            'improvements': [
                'Add more specific metrics to your experience descriptions',
                'Include relevant certifications',
                'Optimize your summary for ATS systems'
            ]
        }
        
        return jsonify(suggestions), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/ai/analytics-insights', methods=['POST'])
# @jwt_required()  # Temporarily disabled for testing
def generate_analytics_insights():
    """AI-powered analytics insights for job seekers"""
    try:
        data = request.get_json()
        period = data.get('period', '30d')
        user_id = data.get('user_id')
        
        # Mock AI insights
        # In a real implementation, this would analyze user data and generate insights
        insights = {
            'profileScore': 85,
            'suggestions': [
                'Your profile is strong! Consider adding more project examples.',
                'Your response rate could improve with better keyword optimization.',
                'Try applying to more startups - they seem to respond well to your profile.'
            ],
            'keywords': [
                'Full Stack Developer', 'React', 'Node.js', 'Python',
                'AWS', 'Docker', 'Agile', 'Team Leadership'
            ],
            'improvements': [
                'Add 2-3 more project examples with live demos',
                'Include specific metrics in your experience descriptions',
                'Update your skills to include trending technologies'
            ]
        }
        
        return jsonify(insights), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500