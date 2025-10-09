from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from utils.db import get_db

candidates_bp = Blueprint('candidates', __name__)

@candidates_bp.route('/all', methods=['GET'])
@jwt_required()
def get_all_candidates():
    """Get all job seekers/candidates from the database"""
    try:
        db = get_db()
        
        # Get all job seekers
        job_seekers = list(db.users.find({
            'userType': {'$in': ['job_seeker', 'jobSeeker']}
        }))
        
        # Transform the data for frontend
        candidates = []
        for user in job_seekers:
            # Format location
            location = user.get('location', 'Location not specified')
            if isinstance(location, dict):
                location_parts = []
                if location.get('city'):
                    location_parts.append(location['city'])
                if location.get('state'):
                    location_parts.append(location['state'])
                if location.get('country'):
                    location_parts.append(location['country'])
                location = ', '.join(location_parts) if location_parts else 'Location not specified'
            elif not location or location == '':
                location = 'Location not specified'
            
            # Format experience
            experience = user.get('experience', 'Not specified')
            if isinstance(experience, list) and experience:
                exp_text = []
                for exp in experience:
                    if isinstance(exp, dict):
                        exp_str = f"{exp.get('title', '')} at {exp.get('company', '')}"
                        if exp.get('startDate') and exp.get('endDate'):
                            exp_str += f" ({exp['startDate']} - {exp['endDate']})"
                        exp_text.append(exp_str)
                experience = '; '.join(exp_text) if exp_text else 'Not specified'
            elif not experience or experience == '':
                experience = 'Not specified'
            
            # Format education
            education = user.get('education', 'Not specified')
            if isinstance(education, list) and education:
                edu_text = []
                for edu in education:
                    if isinstance(edu, dict):
                        edu_str = f"{edu.get('degree', '')} in {edu.get('field', '')}"
                        if edu.get('institution'):
                            edu_str += f" from {edu['institution']}"
                        if edu.get('graduationYear'):
                            edu_str += f" ({edu['graduationYear']})"
                        edu_text.append(edu_str)
                education = '; '.join(edu_text) if edu_text else 'Not specified'
            elif not education or education == '':
                education = 'Not specified'
            
            # Format skills
            skills = user.get('skills', 'Not specified')
            if isinstance(skills, list):
                skills = ', '.join(skills) if skills else 'Not specified'
            elif not skills or skills == '':
                skills = 'Not specified'
            
            candidate = {
                'id': str(user['_id']),
                'name': f"{user.get('firstName', '')} {user.get('lastName', '')}".strip() or 'Unknown',
                'email': user.get('email', ''),
                'title': user.get('jobTitle', 'Job Seeker'),
                'location': location,
                'experience': experience,
                'skills': skills,
                'education': education,
                'bio': user.get('bio', user.get('about', 'No bio available')),
                'avatar': user.get('profileImage', '/default-avatar.png'),
                'matchScore': 0,  # Default match score
                'phone': user.get('phoneNumber', 'Not provided'),
                'cvUrl': user.get('cvUrl', ''),
                'cvId': user.get('cvId', ''),
                'userType': user.get('userType', 'job_seeker')
            }
            candidates.append(candidate)
        
        return jsonify({
            'success': True,
            'candidates': candidates,
            'count': len(candidates)
        }), 200
        
    except Exception as e:
        print(f"Error fetching candidates: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch candidates',
            'details': str(e)
        }), 500

@candidates_bp.route('/with-applications', methods=['GET'])
@jwt_required()
def get_candidates_with_applications():
    """Get candidates who have applied to jobs posted by the current recruiter"""
    try:
        current_user_id = get_jwt_identity()
        db = get_db()
        
        # Get jobs posted by current recruiter
        recruiter_jobs = list(db.jobs.find({'recruiter_id': current_user_id}))
        job_ids = [str(job['_id']) for job in recruiter_jobs]
        
        if not job_ids:
            return jsonify({
                'success': True,
                'candidates': [],
                'count': 0,
                'message': 'No jobs posted by this recruiter'
            }), 200
        
        # Get applications for recruiter's jobs
        applications = list(db.applications.find({'job_id': {'$in': job_ids}}))
        
        # Get unique candidate IDs
        candidate_ids = list(set([app['applicant_id'] for app in applications]))
        
        # Get candidate details
        candidates = []
        for candidate_id in candidate_ids:
            user = db.users.find_one({'_id': ObjectId(candidate_id)})
            if user:
                # Get applications for this candidate
                user_applications = [app for app in applications if app['applicant_id'] == candidate_id]
                
                candidate = {
                    'id': str(user['_id']),
                    'name': f"{user.get('firstName', '')} {user.get('lastName', '')}".strip() or 'Unknown',
                    'email': user.get('email', ''),
                    'title': user.get('jobTitle', 'Job Seeker'),
                    'location': user.get('location', 'Location not specified'),
                    'experience': user.get('experience', 'Not specified'),
                    'skills': user.get('skills', 'Not specified'),
                    'education': user.get('education', 'Not specified'),
                    'bio': user.get('bio', user.get('about', 'No bio available')),
                    'avatar': user.get('profileImage', '/default-avatar.png'),
                    'matchScore': 0,
                    'phone': user.get('phoneNumber', 'Not provided'),
                    'cvUrl': user.get('cvUrl', ''),
                    'cvId': user.get('cvId', ''),
                    'userType': user.get('userType', 'job_seeker'),
                    'applications': user_applications
                }
                candidates.append(candidate)
        
        return jsonify({
            'success': True,
            'candidates': candidates,
            'count': len(candidates)
        }), 200
        
    except Exception as e:
        print(f"Error fetching candidates with applications: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch candidates with applications',
            'details': str(e)
        }), 500
