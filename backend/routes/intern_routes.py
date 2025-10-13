"""
Intern Routes
Handles all intern-related endpoints including profile management,
details submission, and AI-powered recommendations
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.intern_service import InternService
from utils.db import get_db
from bson import ObjectId
import os
from werkzeug.utils import secure_filename

intern_bp = Blueprint('intern', __name__)
intern_service = InternService()

# Allowed file extensions for resume upload
ALLOWED_EXTENSIONS = {'pdf'}
UPLOAD_FOLDER = 'uploads/intern_resumes'

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@intern_bp.route('/submit-details', methods=['POST'])
@jwt_required()
def submit_intern_details():
    """
    Submit comprehensive intern details form
    Accepts multipart/form-data with all intern information, profile photo, and resume file
    """
    try:
        current_user_id = get_jwt_identity()
        user_id = ObjectId(current_user_id)
        
        # Extract comprehensive form data
        intern_data = {
            # Personal Information
            'firstName': request.form.get('firstName'),
            'middleName': request.form.get('middleName', ''),
            'lastName': request.form.get('lastName'),
            'email': request.form.get('email'),
            'phone': request.form.get('phone'),
            'altPhone': request.form.get('altPhone', ''),
            'dateOfBirth': request.form.get('dateOfBirth'),
            'gender': request.form.get('gender', ''),
            
            # Nationality & Residency
            'nationality': request.form.get('nationality'),
            'residentCountry': request.form.get('residentCountry'),
            'currentCity': request.form.get('currentCity'),
            'postalCode': request.form.get('postalCode', ''),
            'address': request.form.get('address', ''),
            'workPermit': request.form.get('workPermit', ''),
            
            # Preferred Locations
            'preferredLocation1': request.form.get('preferredLocation1'),
            'preferredLocation2': request.form.get('preferredLocation2', ''),
            'preferredLocation3': request.form.get('preferredLocation3', ''),
            'willingToRelocate': request.form.get('willingToRelocate'),
            'workLocation': request.form.get('workLocation', ''),
            
            # Professional Profile
            'professionalTitle': request.form.get('professionalTitle', ''),
            'yearsExperience': request.form.get('yearsExperience', ''),
            'careerLevel': request.form.get('careerLevel', ''),
            'industry': request.form.get('industry', ''),
            'summary': request.form.get('summary', ''),
            
            # Education (JSON string)
            'education': request.form.get('education', '[]'),
            
            # Internship Objectives
            'internshipObjectives': request.form.get('internshipObjectives', ''),
            'careerGoals': request.form.get('careerGoals', ''),
            'learningGoals': request.form.get('learningGoals', ''),
            'skillsToDevelop': request.form.get('skillsToDevelop', ''),
            
            # Work Experience (JSON string)
            'experience': request.form.get('experience', '[]'),
            
            # Skills & Competencies (JSON strings)
            'technicalSkills': request.form.get('technicalSkills', '[]'),
            'softSkills': request.form.get('softSkills', '[]'),
            'languages': request.form.get('languages', '[]'),
            'interests': request.form.get('interests', '[]'),
            
            # Projects (JSON string)
            'projects': request.form.get('projects', '[]'),
            
            # Activities (JSON string)
            'activities': request.form.get('activities', '[]'),
            
            # Certifications (JSON string)
            'certifications': request.form.get('certifications', '[]'),
            
            # References (JSON string)
            'references': request.form.get('references', '[]'),
            
            # Online Presence
            'linkedin': request.form.get('linkedin', ''),
            'github': request.form.get('github', ''),
            'portfolio': request.form.get('portfolio', ''),
            'twitter': request.form.get('twitter', ''),
            'otherLink': request.form.get('otherLink', ''),
            
            # Internship Preferences
            'internshipType': request.form.get('internshipType', ''),
            'internshipMode': request.form.get('internshipMode', ''),
            'duration': request.form.get('duration', ''),
            'availabilityStartDate': request.form.get('availabilityStartDate', ''),
            'weeklyHours': request.form.get('weeklyHours', ''),
            'stipendExpectation': request.form.get('stipendExpectation', ''),
            'academicLevel': request.form.get('academicLevel', ''),
            'currentSemester': request.form.get('currentSemester', ''),
            'graduationDate': request.form.get('graduationDate', ''),
            
            # Additional Information
            'additionalInfo': request.form.get('additionalInfo', ''),
            'hearAboutUs': request.form.get('hearAboutUs', ''),
            'community': request.form.get('community', ''),
            
            # Metadata
            'profileCompleted': True,
            'submittedAt': intern_service.get_current_timestamp()
        }
        
        # Handle profile photo upload (50KB limit)
        profile_photo_path = None
        if 'profilePhoto' in request.files:
            file = request.files['profilePhoto']
            if file and file.filename:
                # Check file size (50KB limit)
                if file.content_length and file.content_length > 50 * 1024:
                    return jsonify({'error': 'Profile photo must be 50KB or smaller'}), 400
                
                # Create upload directory if it doesn't exist
                photo_folder = 'uploads/intern_photos'
                os.makedirs(photo_folder, exist_ok=True)
                
                # Generate unique filename
                filename = secure_filename(f"{user_id}_profile.jpg")
                filepath = os.path.join(photo_folder, filename)
                file.save(filepath)
                profile_photo_path = filepath
                intern_data['profilePhotoPath'] = profile_photo_path
        
        # Handle resume file upload
        resume_path = None
        if 'resume' in request.files:
            file = request.files['resume']
            if file and file.filename and allowed_file(file.filename):
                # Create upload directory if it doesn't exist
                os.makedirs(UPLOAD_FOLDER, exist_ok=True)
                
                # Generate unique filename
                filename = secure_filename(f"{user_id}_{file.filename}")
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                file.save(filepath)
                resume_path = filepath
                intern_data['resumePath'] = resume_path
        
        # Save comprehensive intern details to database
        result = intern_service.save_comprehensive_intern_details(user_id, intern_data)
        
        if result['success']:
            return jsonify({
                'message': 'Comprehensive intern profile submitted successfully',
                'internId': str(user_id)
            }), 200
        else:
            return jsonify({'error': result.get('error', 'Failed to save intern details')}), 400
            
    except Exception as e:
        print(f"Error submitting intern details: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@intern_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_intern_profile():
    """
    Get intern profile data
    """
    try:
        current_user_id = get_jwt_identity()
        user_id = ObjectId(current_user_id)
        profile = intern_service.get_intern_profile(user_id)
        
        if profile:
            return jsonify(profile), 200
        else:
            return jsonify({'error': 'Profile not found'}), 404
            
    except Exception as e:
        print(f"Error fetching intern profile: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@intern_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    """
    Get AI-powered internship recommendations for the intern
    """
    try:
        current_user_id = get_jwt_identity()
        user_id = ObjectId(current_user_id)
        recommendations = intern_service.generate_recommendations(user_id)
        
        return jsonify({
            'recommendations': recommendations,
            'count': len(recommendations)
        }), 200
            
    except Exception as e:
        print(f"Error generating recommendations: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@intern_bp.route('/saved', methods=['GET'])
@jwt_required()
def get_saved_internships():
    """
    Get saved internships for the intern
    """
    try:
        current_user_id = get_jwt_identity()
        user_id = ObjectId(current_user_id)
        saved = intern_service.get_saved_internships(user_id)
        
        return jsonify({
            'saved': saved,
            'count': len(saved)
        }), 200
            
    except Exception as e:
        print(f"Error fetching saved internships: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@intern_bp.route('/save/<internship_id>', methods=['POST'])
@jwt_required()
def save_internship(internship_id):
    """
    Save an internship for later
    """
    try:
        current_user_id = get_jwt_identity()
        user_id = ObjectId(current_user_id)
        result = intern_service.save_internship(user_id, internship_id)
        
        if result['success']:
            return jsonify({'message': 'Internship saved successfully'}), 200
        else:
            return jsonify({'error': result.get('error', 'Failed to save internship')}), 400
            
    except Exception as e:
        print(f"Error saving internship: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@intern_bp.route('/apply/<internship_id>', methods=['POST'])
@jwt_required()
def apply_to_internship(internship_id):
    """
    Apply to an internship
    """
    try:
        current_user_id = get_jwt_identity()
        user_id = ObjectId(current_user_id)
        result = intern_service.apply_to_internship(user_id, internship_id)
        
        if result['success']:
            return jsonify({'message': 'Application submitted successfully'}), 200
        else:
            return jsonify({'error': result.get('error', 'Failed to submit application')}), 400
            
    except Exception as e:
        print(f"Error applying to internship: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@intern_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_intern_stats():
    """
    Get intern statistics (applications, saves, etc.)
    """
    try:
        current_user_id = get_jwt_identity()
        user_id = ObjectId(current_user_id)
        stats = intern_service.get_intern_stats(user_id)
        
        return jsonify(stats), 200
            
    except Exception as e:
        print(f"Error fetching intern stats: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@intern_bp.route('/resume/<filename>', methods=['GET'])
def get_intern_resume(filename):
    """
    Serve intern resume files
    """
    try:
        from flask import send_from_directory
        return send_from_directory(UPLOAD_FOLDER, filename)
    except Exception as e:
        print(f"Error serving resume: {str(e)}")
        return jsonify({'error': 'Resume not found'}), 404

