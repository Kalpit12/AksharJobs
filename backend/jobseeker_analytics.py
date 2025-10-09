"""
Job Seeker Analytics API Endpoint
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/api/analytics/jobseeker', methods=['GET'])
@jwt_required()
def get_jobseeker_analytics():
    """
    Get comprehensive analytics for job seekers
    """
    try:
        user_id = get_jwt_identity()
        period = request.args.get('period', '30d')
        
        # Mock analytics data
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

@analytics_bp.route('/api/analytics/jobseeker/trends', methods=['GET'])
@jwt_required()
def get_application_trends():
    """
    Get application trends over time
    """
    try:
        user_id = get_jwt_identity()
        period = request.args.get('period', '30d')
        
        # Mock trend data
        trends = {
            'applications': [
                {'date': '2024-01-01', 'count': 2},
                {'date': '2024-01-02', 'count': 1},
                {'date': '2024-01-03', 'count': 3},
                {'date': '2024-01-04', 'count': 1},
                {'date': '2024-01-05', 'count': 2},
                # ... more data points
            ],
            'responses': [
                {'date': '2024-01-01', 'count': 0},
                {'date': '2024-01-02', 'count': 1},
                {'date': '2024-01-03', 'count': 0},
                {'date': '2024-01-04', 'count': 1},
                {'date': '2024-01-05', 'count': 0},
                # ... more data points
            ],
            'interviews': [
                {'date': '2024-01-01', 'count': 0},
                {'date': '2024-01-02', 'count': 0},
                {'date': '2024-01-03', 'count': 1},
                {'date': '2024-01-04', 'count': 0},
                {'date': '2024-01-05', 'count': 0},
                # ... more data points
            ]
        }
        
        return jsonify(trends), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
