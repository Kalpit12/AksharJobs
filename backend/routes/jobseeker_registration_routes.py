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
        if user.get('userType') != 'jobSeeker':
            return jsonify({"error": "This endpoint is only for job seekers"}), 403
        
        print(f"Processing comprehensive profile for job seeker: {user.get('email')}")
        
        # Parse form data
        try:
            # Section 1: Personal Information
            personal_info = {
                'fullName': request.form.get('fullName'),
                'email': request.form.get('email'),
                'mobileNumber': request.form.get('mobileNumber'),
                'countryCode': request.form.get('countryCode'),
                'dateOfBirth': request.form.get('dateOfBirth'),
                'gender': request.form.get('gender'),
                'currentLocationCountry': request.form.get('currentLocationCountry'),
                'currentLocationCity': request.form.get('currentLocationCity'),
                'willingToRelocate': request.form.get('willingToRelocate'),
                'nationality': request.form.get('nationality'),
                'linkedinProfile': request.form.get('linkedinProfile'),
                'portfolioWebsite': request.form.get('portfolioWebsite')
            }
            
            # Section 2: Education Details
            education_info = {
                'highestEducationLevel': request.form.get('highestEducationLevel'),
                'fieldOfStudy': request.form.get('fieldOfStudy'),
                'institutionName': request.form.get('institutionName'),
                'countryOfInstitution': request.form.get('countryOfInstitution'),
                'graduationYear': request.form.get('graduationYear'),
                'academicPerformance': request.form.get('academicPerformance'),
                'relevantCoursework': request.form.get('relevantCoursework')
            }
            
            # Section 3: Employment Information
            employment_info = {
                'currentEmploymentStatus': request.form.get('currentEmploymentStatus'),
                'yearsOfExperience': request.form.get('yearsOfExperience'),
                'mostRecentJobTitle': request.form.get('mostRecentJobTitle'),
                'mostRecentCompany': request.form.get('mostRecentCompany'),
                'employmentType': request.form.get('employmentType'),
                'workExperienceSummary': request.form.get('workExperienceSummary')
            }
            
            # Section 4: Skills & Expertise
            technical_skills = request.form.get('technicalSkills')
            soft_skills = request.form.get('softSkills')
            languages_known = request.form.get('languagesKnown')
            
            skills_info = {
                'technicalSkills': json.loads(technical_skills) if technical_skills else [],
                'softSkills': json.loads(soft_skills) if soft_skills else [],
                'languagesKnown': json.loads(languages_known) if languages_known else [],
                'certifications': request.form.get('certifications')
            }
            
            # Section 5: Job Preferences
            job_types = request.form.get('jobTypes')
            preferred_industries = request.form.get('preferredIndustries')
            preferred_cities = request.form.get('preferredCities')
            
            job_preferences = {
                'jobTypes': json.loads(job_types) if job_types else [],
                'preferredWorkMode': request.form.get('preferredWorkMode'),
                'preferredIndustries': json.loads(preferred_industries) if preferred_industries else [],
                'preferredJobRoles': request.form.get('preferredJobRoles'),
                'preferredCountryOfWork': request.form.get('preferredCountryOfWork'),
                'preferredCities': json.loads(preferred_cities) if preferred_cities else [],
                'expectedSalaryCurrency': request.form.get('expectedSalaryCurrency'),
                'expectedSalaryAmount': request.form.get('expectedSalaryAmount'),
                'availabilityToJoin': request.form.get('availabilityToJoin'),
                'desiredWorkHours': request.form.get('desiredWorkHours'),
                'jobKeywords': request.form.get('jobKeywords')
            }
            
            # Section 6: Career Goals
            career_goals = {
                'shortTermGoal': request.form.get('shortTermGoal'),
                'longTermGoal': request.form.get('longTermGoal'),
                'preferredCompanyType': request.form.get('preferredCompanyType'),
                'motivationForJobChange': request.form.get('motivationForJobChange')
            }
            
            # Section 7: Additional Information
            additional_info = {
                'validWorkPermit': request.form.get('validWorkPermit'),
                'requireVisaSponsorship': request.form.get('requireVisaSponsorship'),
                'openToRelocation': request.form.get('openToRelocation'),
                'willingToTravel': request.form.get('willingToTravel'),
                'ownLaptopAndInternet': request.form.get('ownLaptopAndInternet'),
                'physicalLimitations': request.form.get('physicalLimitations'),
                'howDidYouHear': request.form.get('howDidYouHear')
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
        
        # Prepare update data
        update_data = {
            # Personal Information
            'fullName': personal_info['fullName'],
            'phone': f"{personal_info['countryCode']}{personal_info['mobileNumber']}",
            'mobileNumber': personal_info['mobileNumber'],
            'countryCode': personal_info['countryCode'],
            'dateOfBirth': personal_info['dateOfBirth'],
            'gender': personal_info['gender'],
            'location': {
                'country': personal_info['currentLocationCountry'],
                'city': personal_info['currentLocationCity']
            },
            'willingToRelocate': personal_info['willingToRelocate'],
            'nationality': personal_info['nationality'],
            'linkedinProfile': personal_info['linkedinProfile'],
            'portfolio': personal_info['portfolioWebsite'],
            
            # Education Details
            'education': [education_info],
            
            # Employment Information
            'employment': employment_info,
            
            # Skills & Expertise
            'skills': skills_info['technicalSkills'] + skills_info['softSkills'],
            'technicalSkills': skills_info['technicalSkills'],
            'softSkills': skills_info['softSkills'],
            'languages': skills_info['languagesKnown'],
            'certifications': skills_info['certifications'],
            
            # Job Preferences
            'jobPreferences': job_preferences,
            
            # Career Goals
            'careerGoals': career_goals,
            
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
                'educationInfo': education_info,
                'employmentInfo': employment_info,
                'skillsInfo': skills_info,
                'jobPreferences': job_preferences,
                'careerGoals': career_goals,
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

