from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import json
from werkzeug.utils import secure_filename
from datetime import datetime
from utils.db import get_db
from bson import ObjectId

jobseeker_registration_routes = Blueprint('jobseeker_registration_routes', __name__)

# Configure upload folder
UPLOAD_FOLDER = 'uploads/jobseeker_profiles'
ALLOWED_RESUME_EXTENSIONS = {'pdf'}
ALLOWED_IMAGE_EXTENSIONS = {'jpg', 'jpeg', 'png'}

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(os.path.join(UPLOAD_FOLDER, 'resumes'), exist_ok=True)
os.makedirs(os.path.join(UPLOAD_FOLDER, 'photos'), exist_ok=True)

def allowed_file(filename, file_type='resume'):
    if file_type == 'resume':
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_RESUME_EXTENSIONS
    elif file_type == 'image':
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS
    return False

@jobseeker_registration_routes.route("/complete-profile", methods=["POST"])
@jwt_required()
def complete_jobseeker_profile():
    """Complete comprehensive job seeker profile with all 7 sections"""
    try:
        current_user_id = get_jwt_identity()
        print(f"Job seeker comprehensive profile setup for user ID: {current_user_id}")
        
        db = get_db()
        users_collection = db.users
        
        # Get user data - convert string ID to ObjectId
        try:
            user_object_id = ObjectId(current_user_id)
        except Exception as e:
            print(f"Invalid user ID format: {current_user_id}, error: {e}")
            return jsonify({"error": "Invalid user ID format"}), 400
        
        user = users_collection.find_one({'_id': user_object_id})
        if not user:
            print(f"User not found for ID: {current_user_id}")
            return jsonify({"error": "User not found"}), 404
        
        # Check if user is a job seeker
        if user.get('userType') != 'job_seeker':
            return jsonify({"error": "This endpoint is only for job seekers"}), 403
        
        print(f"Processing comprehensive profile for job seeker: {user.get('email')}")
        
        # Parse comprehensive form data
        try:
            # Section 1: Personal Information
            personal_info = {
                'firstName': request.form.get('firstName'),
                'middleName': request.form.get('middleName'),
                'lastName': request.form.get('lastName'),
                'email': request.form.get('email'),
                'phone': request.form.get('phone'),
                'altPhone': request.form.get('altPhone'),
                'dateOfBirth': request.form.get('dateOfBirth'),
                'gender': request.form.get('gender'),
                'community': request.form.get('community')
            }
            
            # Section 2: Nationality & Residency
            nationality_residency = {
                'nationality': request.form.get('nationality'),
                'residentCountry': request.form.get('residentCountry'),
                'currentCity': request.form.get('currentCity'),
                'postalCode': request.form.get('postalCode'),
                'address': request.form.get('address'),
                'latitude': request.form.get('latitude'),
                'longitude': request.form.get('longitude'),
                'workPermit': request.form.get('workPermit')
            }
            
            # Section 3: Preferred Working Locations
            preferred_locations = {
                'preferredLocation1': request.form.get('preferredLocation1'),
                'preferredLocation2': request.form.get('preferredLocation2'),
                'preferredLocation3': request.form.get('preferredLocation3'),
                'willingToRelocate': request.form.get('willingToRelocate'),
                'workLocation': request.form.get('workLocation')
            }
            
            # Section 4: Professional Profile
            professional_profile = {
                'professionalTitle': request.form.get('professionalTitle'),
                'yearsExperience': request.form.get('yearsExperience'),
                'careerLevel': request.form.get('careerLevel'),
                'industry': request.form.get('industry'),
                'summary': request.form.get('summary')
            }
            
            # Section 5: Work Experience (Array)
            experience_entries_str = request.form.get('experienceEntries')
            experience_entries = json.loads(experience_entries_str) if experience_entries_str else []
            
            # Section 6: Education (Array)
            education_entries_str = request.form.get('educationEntries')
            education_entries = json.loads(education_entries_str) if education_entries_str else []
            
            # Section 7: Skills & Competencies
            core_skills_str = request.form.get('coreSkills')
            tools_str = request.form.get('tools')
            skills_info = {
                'coreSkills': json.loads(core_skills_str) if core_skills_str else [],
                'tools': json.loads(tools_str) if tools_str else []
            }
            
            # Section 8: Languages (Array)
            languages_str = request.form.get('languages')
            languages = json.loads(languages_str) if languages_str else []
            
            # Section 9: Certifications (Array)
            certification_entries_str = request.form.get('certificationEntries')
            certification_entries = json.loads(certification_entries_str) if certification_entries_str else []
            
            # Section 10: Professional Memberships
            memberships = {
                'membershipOrg': request.form.get('membershipOrg'),
                'membershipType': request.form.get('membershipType'),
                'membershipDate': request.form.get('membershipDate')
            }
            
            # Section 11: References (Array)
            reference_entries_str = request.form.get('referenceEntries')
            reference_entries = json.loads(reference_entries_str) if reference_entries_str else []
            
            # Section 12: Professional Online Presence (Array)
            professional_links_str = request.form.get('professionalLinks')
            professional_links = json.loads(professional_links_str) if professional_links_str else []
            
            # Section 13: Job Preferences & Availability
            job_preferences = {
                'jobType': request.form.get('jobType'),
                'noticePeriod': request.form.get('noticePeriod'),
                'currentSalary': request.form.get('currentSalary'),
                'expectedSalary': request.form.get('expectedSalary'),
                'currencyPreference': request.form.get('currencyPreference'),
                'travelAvailability': request.form.get('travelAvailability')
            }
            
            # Section 14: Additional Information
            additional_info = {
                'askCommunity': request.form.get('askCommunity'),
                'hobbies': request.form.get('hobbies'),
                'additionalComments': request.form.get('additionalComments'),
                'agreeTerms': request.form.get('agreeTerms'),
                'allowContact': request.form.get('allowContact')
            }
            
        except Exception as e:
            print(f"Error parsing form data: {e}")
            return jsonify({"error": f"Error parsing form data: {str(e)}"}), 400
        
        # Handle file uploads
        profile_photo_path = None
        resume_file_path = None
        
        try:
            # Handle profile photo
            if 'profilePhoto' in request.files:
                photo_file = request.files['profilePhoto']
                if photo_file and photo_file.filename and allowed_file(photo_file.filename, 'image'):
                    filename = secure_filename(photo_file.filename)
                    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                    unique_filename = f"{current_user_id}_{timestamp}_{filename}"
                    file_path = os.path.join(UPLOAD_FOLDER, 'photos', unique_filename)
                    photo_file.save(file_path)
                    profile_photo_path = file_path
                    print(f"Profile photo saved to: {profile_photo_path}")
            
            # Handle resume file
            if 'resumeFile' in request.files:
                resume_file = request.files['resumeFile']
                if resume_file and resume_file.filename and allowed_file(resume_file.filename, 'resume'):
                    filename = secure_filename(resume_file.filename)
                    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                    unique_filename = f"{current_user_id}_{timestamp}_{filename}"
                    file_path = os.path.join(UPLOAD_FOLDER, 'resumes', unique_filename)
                    resume_file.save(file_path)
                    resume_file_path = file_path
                    print(f"Resume saved to: {resume_file_path}")
        
        except Exception as e:
            print(f"Error handling file uploads: {e}")
            # Continue even if file upload fails
        
        # Prepare comprehensive update data
        update_data = {
            # Personal Information
            'firstName': personal_info['firstName'],
            'middleName': personal_info['middleName'],
            'lastName': personal_info['lastName'],
            'fullName': f"{personal_info['firstName']} {personal_info.get('middleName', '')} {personal_info['lastName']}".replace('  ', ' ').strip(),
            'email': personal_info['email'],
            'phone': personal_info['phone'],
            'altPhone': personal_info['altPhone'],
            'dateOfBirth': personal_info['dateOfBirth'],
            'gender': personal_info['gender'],
            'community': personal_info['community'],
            
            # Nationality & Residency
            'nationality': nationality_residency['nationality'],
            'residentCountry': nationality_residency['residentCountry'],
            'currentCity': nationality_residency['currentCity'],
            'postalCode': nationality_residency['postalCode'],
            'address': nationality_residency['address'],
            'location': {
                'latitude': nationality_residency['latitude'],
                'longitude': nationality_residency['longitude'],
                'address': nationality_residency['address'],
                'city': nationality_residency['currentCity'],
                'country': nationality_residency['residentCountry']
            },
            'workPermit': nationality_residency['workPermit'],
            
            # Preferred Working Locations
            'preferredLocations': preferred_locations,
            
            # Professional Profile
            'professionalProfile': professional_profile,
            
            # Work Experience (Array)
            'experienceEntries': experience_entries,
            
            # Education (Array)
            'educationEntries': education_entries,
            
            # Skills & Competencies
            'coreSkills': skills_info['coreSkills'],
            'tools': skills_info['tools'],
            'skills': skills_info['coreSkills'] + skills_info['tools'],  # Combined for search
            
            # Languages (Array)
            'languages': languages,
            
            # Certifications (Array)
            'certifications': certification_entries,
            
            # Professional Memberships
            'memberships': memberships,
            
            # References (Array)
            'references': reference_entries,
            
            # Professional Online Presence (Array)
            'professionalLinks': professional_links,
            
            # Job Preferences & Availability
            'jobPreferences': job_preferences,
            
            # Additional Information
            'additionalInfo': additional_info,
            
            # Meta information
            'profileCompleted': True,
            'comprehensiveProfileCompleted': True,
            'profileCompletedAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        
        # Add file paths if available
        if profile_photo_path:
            update_data['profilePhotoPath'] = profile_photo_path
        
        if resume_file_path:
            update_data['resumePath'] = resume_file_path
            update_data['resumeUploadedAt'] = datetime.utcnow()
        
        print(f"Updating job seeker profile with comprehensive data")
        
        # Update user in database
        result = users_collection.update_one(
            {'_id': user_object_id},
            {'$set': update_data}
        )
        
        print(f"Update result: {result.modified_count} documents modified")
        
        if result.matched_count > 0:
            # Create comprehensive job seeker profile entry
            jobseeker_profiles_collection = db.jobseeker_profiles
            
            profile_entry = {
                'userId': user_object_id,
                'personalInfo': personal_info,
                'nationalityResidency': nationality_residency,
                'preferredLocations': preferred_locations,
                'professionalProfile': professional_profile,
                'experienceEntries': experience_entries,
                'educationEntries': education_entries,
                'skillsInfo': skills_info,
                'languages': languages,
                'certifications': certification_entries,
                'certificationEntries': certification_entries,
                'memberships': memberships,
                'references': reference_entries,
                'referenceEntries': reference_entries,
                'professionalLinks': professional_links,
                'jobPreferences': job_preferences,
                'additionalInfo': additional_info,
                'profilePhotoPath': profile_photo_path,
                'resumePath': resume_file_path,
                'createdAt': datetime.utcnow(),
                'updatedAt': datetime.utcnow()
            }
            
            # Insert or update job seeker profile
            jobseeker_profiles_collection.update_one(
                {'userId': user_object_id},
                {'$set': profile_entry},
                upsert=True
            )
            
            print("Comprehensive job seeker profile completed successfully")
            return jsonify({
                "success": True,
                "message": "Job seeker profile completed successfully",
                "profileCompleted": True,
                "comprehensiveProfileCompleted": True
            }), 200
        else:
            print("Failed to update user profile")
            return jsonify({"error": "Failed to update profile"}), 500
            
    except Exception as e:
        print(f"Error in job seeker profile setup: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"An error occurred during profile setup: {str(e)}"}), 500

@jobseeker_registration_routes.route("/profile", methods=["GET"])
@jwt_required()
def get_comprehensive_profile():
    """Get comprehensive job seeker profile"""
    try:
        current_user_id = get_jwt_identity()
        db = get_db()
        
        # Convert string ID to ObjectId
        try:
            user_object_id = ObjectId(current_user_id)
        except Exception as e:
            print(f"Invalid user ID format: {current_user_id}, error: {e}")
            return jsonify({"error": "Invalid user ID format"}), 400
        
        # Get profile from jobseeker_profiles collection
        jobseeker_profiles_collection = db.jobseeker_profiles
        profile = jobseeker_profiles_collection.find_one({'userId': user_object_id})
        
        if not profile:
            return jsonify({"error": "Profile not found"}), 404
        
        # Convert ObjectId to string for JSON serialization
        profile['_id'] = str(profile['_id'])
        profile['userId'] = str(profile['userId'])
        
        return jsonify(profile), 200
        
    except Exception as e:
        print(f"Error getting comprehensive profile: {e}")
        return jsonify({"error": "An error occurred while fetching profile"}), 500

