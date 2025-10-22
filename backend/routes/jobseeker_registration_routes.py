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
        
        # Check if database connection is valid
        if db is None:
            print("❌ Database connection failed - db is None")
            return jsonify({"error": "Database connection failed"}), 500
        
        # Convert string ID to ObjectId
        try:
            user_object_id = ObjectId(current_user_id)
        except Exception as e:
            print(f"Invalid user ID format: {current_user_id}, error: {e}")
            return jsonify({"error": "Invalid user ID format"}), 400
        
        # Get profile from jobseeker_profiles collection
        jobseeker_profiles_collection = db.jobseeker_profiles
        profile = jobseeker_profiles_collection.find_one({'userId': user_object_id})
        
        # Get user data from users collection for missing fields
        users_collection = db.users
        user_data = users_collection.find_one({'_id': user_object_id})
        
        # If profile not found in jobseeker_profiles, try to get from users collection
        if not profile:
            print(f"⚠️ Profile not found in jobseeker_profiles for user {current_user_id}, checking users collection...")
            
            if not user_data:
                print(f"❌ User not found in users collection: {current_user_id}")
                return jsonify({"error": "Profile not found"}), 404
            
            # Create a profile structure from user data
            print(f"✅ Found user in users collection, creating profile structure...")
            profile = {
                'userId': user_object_id,
                'personalInfo': {
                    'firstName': user_data.get('firstName', ''),
                    'middleName': user_data.get('middleName', ''),
                    'lastName': user_data.get('lastName', ''),
                    'email': user_data.get('email', ''),
                    'phone': user_data.get('phone', '') or user_data.get('phoneNumber', ''),
                    'altPhone': user_data.get('altPhone', ''),
                    'dateOfBirth': user_data.get('dateOfBirth', ''),
                    'gender': user_data.get('gender', ''),
                    'community': user_data.get('community', ''),
                },
                'nationalityResidency': {
                    'nationality': user_data.get('nationality', ''),
                    'residentCountry': user_data.get('residentCountry', ''),
                    'currentCity': user_data.get('currentCity', ''),
                    'postalCode': user_data.get('postalCode', ''),
                    'address': user_data.get('address', ''),
                    'latitude': user_data.get('latitude', ''),
                    'longitude': user_data.get('longitude', ''),
                    'workPermit': user_data.get('workPermit', ''),
                },
                'preferredLocations': {
                    'preferredLocation1': user_data.get('preferredLocation1', ''),
                    'preferredLocation2': user_data.get('preferredLocation2', ''),
                    'preferredLocation3': user_data.get('preferredLocation3', ''),
                    'willingToRelocate': user_data.get('willingToRelocate', ''),
                    'workLocation': user_data.get('workLocation', ''),
                },
                'professionalProfile': {
                    'professionalTitle': user_data.get('professionalTitle', ''),
                    'yearsExperience': user_data.get('yearsOfExperience', '') or user_data.get('yearsExperience', ''),
                    'careerLevel': user_data.get('careerLevel', ''),
                    'industry': user_data.get('industry', ''),
                    'summary': user_data.get('professionalSummary', '') or user_data.get('summary', ''),
                },
                'skillsInfo': {
                    'coreSkills': user_data.get('skills', []) if isinstance(user_data.get('skills'), list) else [],
                    'tools': user_data.get('tools', []) if isinstance(user_data.get('tools'), list) else [],
                },
                'languages': user_data.get('languages', []),
                'experienceEntries': user_data.get('experience', []) or user_data.get('workExperience', []),
                'educationEntries': user_data.get('education', []),
                'certificationEntries': user_data.get('certifications', []),
                'referenceEntries': user_data.get('references', []),
                'professionalLinks': user_data.get('professionalLinks', {}),
                'jobPreferences': {
                    'jobType': user_data.get('jobType', ''),
                    'jobTypePreference': user_data.get('jobTypePreference', ''),
                    'noticePeriod': user_data.get('noticePeriod', ''),
                    'currentSalary': user_data.get('currentSalary', ''),
                    'expectedSalary': user_data.get('expectedSalary', ''),
                    'currencyPreference': user_data.get('currencyPreference', ''),
                    'travelAvailability': user_data.get('travelAvailability', ''),
                    'availability': user_data.get('availability', ''),
                },
                'professionalMemberships': {
                    'membershipOrg': user_data.get('membershipOrg', ''),
                    'membershipType': user_data.get('membershipType', ''),
                    'membershipDate': user_data.get('membershipDate', ''),
                },
                'additionalInfo': {
                    'bloodGroup': user_data.get('bloodGroup', ''),
                    'askCommunity': user_data.get('askCommunity', ''),
                    'hobbies': user_data.get('hobbies', ''),
                    'additionalComments': user_data.get('additionalComments', ''),
                }
            }
        else:
            print(f"✅ Found profile in jobseeker_profiles collection")
            # Profile exists in jobseeker_profiles, but we still need to check users collection for missing fields
            if user_data:
                print(f"🔍 Checking users collection for missing fields...")
                
                # Fill in missing fields from users collection
                missing_fields = []
                
                # Additional Info fields
                if not profile.get('additionalInfo', {}).get('bloodGroup') and user_data.get('bloodGroup'):
                    print(f"🩸 Adding missing bloodGroup from users collection: {user_data.get('bloodGroup')}")
                    if 'additionalInfo' not in profile:
                        profile['additionalInfo'] = {}
                    profile['additionalInfo']['bloodGroup'] = user_data.get('bloodGroup')
                    missing_fields.append('bloodGroup')
                
                if not profile.get('additionalInfo', {}).get('askCommunity') and user_data.get('askCommunity'):
                    if 'additionalInfo' not in profile:
                        profile['additionalInfo'] = {}
                    profile['additionalInfo']['askCommunity'] = user_data.get('askCommunity')
                    missing_fields.append('askCommunity')
                
                if not profile.get('additionalInfo', {}).get('hobbies') and user_data.get('hobbies'):
                    if 'additionalInfo' not in profile:
                        profile['additionalInfo'] = {}
                    profile['additionalInfo']['hobbies'] = user_data.get('hobbies')
                    missing_fields.append('hobbies')
                
                if not profile.get('additionalInfo', {}).get('additionalComments') and user_data.get('additionalComments'):
                    if 'additionalInfo' not in profile:
                        profile['additionalInfo'] = {}
                    profile['additionalInfo']['additionalComments'] = user_data.get('additionalComments')
                    missing_fields.append('additionalComments')
                
                # Nationality & Residency fields
                profile_work_permit = profile.get('nationalityResidency', {}).get('workPermit')
                user_work_permit = user_data.get('workPermit')
                
                # Always update workPermit if user_data has a different value (not just if missing)
                if user_work_permit and profile_work_permit != user_work_permit:
                    print(f"🛂 Updating workPermit from '{profile_work_permit}' to '{user_work_permit}' from users collection")
                    if 'nationalityResidency' not in profile:
                        profile['nationalityResidency'] = {}
                    profile['nationalityResidency']['workPermit'] = user_work_permit
                    missing_fields.append('workPermit')
                elif not profile_work_permit and user_work_permit:
                    print(f"🛂 Adding missing workPermit from users collection: {user_work_permit}")
                    if 'nationalityResidency' not in profile:
                        profile['nationalityResidency'] = {}
                    profile['nationalityResidency']['workPermit'] = user_work_permit
                    missing_fields.append('workPermit')
                else:
                    print(f"🛂 Work Permit debug - profile has: {profile_work_permit}, user_data has: {user_work_permit}")
                
                if not profile.get('nationalityResidency', {}).get('postalCode') and user_data.get('postalCode'):
                    if 'nationalityResidency' not in profile:
                        profile['nationalityResidency'] = {}
                    profile['nationalityResidency']['postalCode'] = user_data.get('postalCode')
                    missing_fields.append('postalCode')
                
                if not profile.get('nationalityResidency', {}).get('address') and user_data.get('address'):
                    if 'nationalityResidency' not in profile:
                        profile['nationalityResidency'] = {}
                    profile['nationalityResidency']['address'] = user_data.get('address')
                    missing_fields.append('address')
                
                if not profile.get('nationalityResidency', {}).get('latitude') and user_data.get('latitude'):
                    if 'nationalityResidency' not in profile:
                        profile['nationalityResidency'] = {}
                    profile['nationalityResidency']['latitude'] = user_data.get('latitude')
                    missing_fields.append('latitude')
                
                if not profile.get('nationalityResidency', {}).get('longitude') and user_data.get('longitude'):
                    if 'nationalityResidency' not in profile:
                        profile['nationalityResidency'] = {}
                    profile['nationalityResidency']['longitude'] = user_data.get('longitude')
                    missing_fields.append('longitude')
                
                # Preferred Locations fields
                if not profile.get('preferredLocations', {}).get('preferredLocation1') and user_data.get('preferredLocation1'):
                    if 'preferredLocations' not in profile:
                        profile['preferredLocations'] = {}
                    profile['preferredLocations']['preferredLocation1'] = user_data.get('preferredLocation1')
                    missing_fields.append('preferredLocation1')
                
                if not profile.get('preferredLocations', {}).get('preferredLocation2') and user_data.get('preferredLocation2'):
                    if 'preferredLocations' not in profile:
                        profile['preferredLocations'] = {}
                    profile['preferredLocations']['preferredLocation2'] = user_data.get('preferredLocation2')
                    missing_fields.append('preferredLocation2')
                
                if not profile.get('preferredLocations', {}).get('preferredLocation3') and user_data.get('preferredLocation3'):
                    if 'preferredLocations' not in profile:
                        profile['preferredLocations'] = {}
                    profile['preferredLocations']['preferredLocation3'] = user_data.get('preferredLocation3')
                    missing_fields.append('preferredLocation3')
                
                if not profile.get('preferredLocations', {}).get('willingToRelocate') and user_data.get('willingToRelocate'):
                    if 'preferredLocations' not in profile:
                        profile['preferredLocations'] = {}
                    profile['preferredLocations']['willingToRelocate'] = user_data.get('willingToRelocate')
                    missing_fields.append('willingToRelocate')
                
                if not profile.get('preferredLocations', {}).get('workLocation') and user_data.get('workLocation'):
                    if 'preferredLocations' not in profile:
                        profile['preferredLocations'] = {}
                    profile['preferredLocations']['workLocation'] = user_data.get('workLocation')
                    missing_fields.append('workLocation')
                
                # Job Preferences fields
                if not profile.get('jobPreferences', {}).get('noticePeriod') and user_data.get('noticePeriod'):
                    if 'jobPreferences' not in profile:
                        profile['jobPreferences'] = {}
                    profile['jobPreferences']['noticePeriod'] = user_data.get('noticePeriod')
                    missing_fields.append('noticePeriod')
                
                if not profile.get('jobPreferences', {}).get('currentSalary') and user_data.get('currentSalary'):
                    if 'jobPreferences' not in profile:
                        profile['jobPreferences'] = {}
                    profile['jobPreferences']['currentSalary'] = user_data.get('currentSalary')
                    missing_fields.append('currentSalary')
                
                if not profile.get('jobPreferences', {}).get('expectedSalary') and user_data.get('expectedSalary'):
                    if 'jobPreferences' not in profile:
                        profile['jobPreferences'] = {}
                    profile['jobPreferences']['expectedSalary'] = user_data.get('expectedSalary')
                    missing_fields.append('expectedSalary')
                
                if not profile.get('jobPreferences', {}).get('currencyPreference') and user_data.get('currencyPreference'):
                    if 'jobPreferences' not in profile:
                        profile['jobPreferences'] = {}
                    profile['jobPreferences']['currencyPreference'] = user_data.get('currencyPreference')
                    missing_fields.append('currencyPreference')
                
                if not profile.get('jobPreferences', {}).get('travelAvailability') and user_data.get('travelAvailability'):
                    if 'jobPreferences' not in profile:
                        profile['jobPreferences'] = {}
                    profile['jobPreferences']['travelAvailability'] = user_data.get('travelAvailability')
                    missing_fields.append('travelAvailability')
                
                # Professional Memberships fields
                if not profile.get('professionalMemberships', {}).get('membershipOrg') and user_data.get('membershipOrg'):
                    if 'professionalMemberships' not in profile:
                        profile['professionalMemberships'] = {}
                    profile['professionalMemberships']['membershipOrg'] = user_data.get('membershipOrg')
                    missing_fields.append('membershipOrg')
                
                if not profile.get('professionalMemberships', {}).get('membershipType') and user_data.get('membershipType'):
                    if 'professionalMemberships' not in profile:
                        profile['professionalMemberships'] = {}
                    profile['professionalMemberships']['membershipType'] = user_data.get('membershipType')
                    missing_fields.append('membershipType')
                
                if not profile.get('professionalMemberships', {}).get('membershipDate') and user_data.get('membershipDate'):
                    if 'professionalMemberships' not in profile:
                        profile['professionalMemberships'] = {}
                    profile['professionalMemberships']['membershipDate'] = user_data.get('membershipDate')
                    missing_fields.append('membershipDate')
                
                if missing_fields:
                    print(f"✅ Added {len(missing_fields)} missing fields from users collection: {missing_fields}")
                else:
                    print(f"✅ No missing fields found - all data is in jobseeker_profiles")
        
        # Flatten the nested structure for frontend compatibility
        # Handle both nested profile structure and direct user data
        flattened_profile = {
            # Personal Information
            'firstName': profile.get('personalInfo', {}).get('firstName') or profile.get('firstName'),
            'middleName': profile.get('personalInfo', {}).get('middleName') or profile.get('middleName'),
            'lastName': profile.get('personalInfo', {}).get('lastName') or profile.get('lastName'),
            'email': profile.get('personalInfo', {}).get('email') or profile.get('email'),
            'phone': profile.get('personalInfo', {}).get('phone') or profile.get('phone'),
            'altPhone': profile.get('personalInfo', {}).get('altPhone') or profile.get('altPhone'),
            'dateOfBirth': profile.get('personalInfo', {}).get('dateOfBirth') or profile.get('dateOfBirth'),
            'gender': profile.get('personalInfo', {}).get('gender') or profile.get('gender'),
            'community': profile.get('personalInfo', {}).get('community') or profile.get('community'),
            
            # Additional Info (including bloodGroup) - FIXED: Check both nested and direct
            'bloodGroup': profile.get('additionalInfo', {}).get('bloodGroup') or profile.get('bloodGroup'),
            'askCommunity': profile.get('additionalInfo', {}).get('askCommunity') or profile.get('askCommunity'),
            'hobbies': profile.get('additionalInfo', {}).get('hobbies') or profile.get('hobbies'),
            'additionalComments': profile.get('additionalInfo', {}).get('additionalComments') or profile.get('additionalComments'),
            
            # Nationality & Residency - FIXED: Check both nested and direct
            'nationality': profile.get('nationalityResidency', {}).get('nationality') or profile.get('nationality'),
            'residentCountry': profile.get('nationalityResidency', {}).get('residentCountry') or profile.get('residentCountry'),
            'currentCity': profile.get('nationalityResidency', {}).get('currentCity') or profile.get('currentCity'),
            'postalCode': profile.get('nationalityResidency', {}).get('postalCode') or profile.get('postalCode'),
            'address': profile.get('nationalityResidency', {}).get('address') or profile.get('address'),
            'latitude': profile.get('nationalityResidency', {}).get('latitude') or profile.get('latitude'),
            'longitude': profile.get('nationalityResidency', {}).get('longitude') or profile.get('longitude'),
            'workPermit': profile.get('nationalityResidency', {}).get('workPermit') or profile.get('workPermit'),
            
            # Preferred Locations - FIXED: Check both nested and direct
            'preferredLocation1': profile.get('preferredLocations', {}).get('preferredLocation1') or profile.get('preferredLocation1'),
            'preferredLocation2': profile.get('preferredLocations', {}).get('preferredLocation2') or profile.get('preferredLocation2'),
            'preferredLocation3': profile.get('preferredLocations', {}).get('preferredLocation3') or profile.get('preferredLocation3'),
            'willingToRelocate': profile.get('preferredLocations', {}).get('willingToRelocate') or profile.get('willingToRelocate'),
            'workLocation': profile.get('preferredLocations', {}).get('workLocation') or profile.get('workLocation'),
            
            # Combined location field for dedicated MyProfile page compatibility
            'location': ', '.join(filter(None, [
                profile.get('nationalityResidency', {}).get('currentCity') or profile.get('currentCity'),
                profile.get('nationalityResidency', {}).get('residentCountry') or profile.get('residentCountry')
            ])),
            
            # Professional Profile - FIXED: Check both nested and direct
            'professionalTitle': profile.get('professionalProfile', {}).get('professionalTitle') or profile.get('professionalTitle'),
            'yearsOfExperience': profile.get('professionalProfile', {}).get('yearsExperience') or profile.get('yearsOfExperience'),
            'careerLevel': profile.get('professionalProfile', {}).get('careerLevel') or profile.get('careerLevel'),
            'industry': profile.get('professionalProfile', {}).get('industry') or profile.get('industry'),
            'professionalSummary': profile.get('professionalProfile', {}).get('summary') or profile.get('professionalSummary'),
            
            # Skills - FIXED: Check both nested and direct
            'coreSkills': profile.get('skillsInfo', {}).get('coreSkills', []) or profile.get('skills', []) or profile.get('coreSkills', []),
            'tools': profile.get('skillsInfo', {}).get('tools', []) or profile.get('tools', []),
            
            # Professional Memberships - FIXED: Check both nested and direct
            'membershipOrg': profile.get('professionalMemberships', {}).get('membershipOrg') or profile.get('membershipOrg'),
            'membershipType': profile.get('professionalMemberships', {}).get('membershipType') or profile.get('membershipType'),
            'membershipDate': profile.get('professionalMemberships', {}).get('membershipDate') or profile.get('membershipDate'),
            
            # Arrays - FIXED: Check both nested and direct
            'languages': profile.get('languages', []) or profile.get('languages', []),
            'experienceEntries': profile.get('experienceEntries', []) or profile.get('experience', []) or profile.get('workExperience', []),
            'educationEntries': profile.get('educationEntries', []) or profile.get('education', []),
            'certificationEntries': profile.get('certificationEntries', []) or profile.get('certifications', []),
            'referenceEntries': profile.get('referenceEntries', []) or profile.get('references', []),
            'professionalLinks': profile.get('professionalLinks', {}) or profile.get('professionalLinks', {}),
            
            # Job Preferences - FIXED: Check both nested and direct
            'jobType': profile.get('jobPreferences', {}).get('jobType') or profile.get('jobType'),
            'jobTypePreference': profile.get('jobPreferences', {}).get('jobTypePreference') or profile.get('jobTypePreference'),
            'noticePeriod': profile.get('jobPreferences', {}).get('noticePeriod') or profile.get('noticePeriod'),
            'availability': profile.get('jobPreferences', {}).get('availability') or profile.get('availability'),
            'currentSalary': profile.get('jobPreferences', {}).get('currentSalary') or profile.get('currentSalary'),
            'expectedSalary': profile.get('jobPreferences', {}).get('expectedSalary') or profile.get('expectedSalary'),
            'salaryCurrency': profile.get('jobPreferences', {}).get('currencyPreference') or profile.get('currencyPreference'),
            'currencyPreference': profile.get('jobPreferences', {}).get('currencyPreference') or profile.get('currencyPreference'),
            'travelAvailability': profile.get('jobPreferences', {}).get('travelAvailability') or profile.get('travelAvailability'),
            
            # Memberships - FIXED: Check both nested and direct
            'membershipOrg': profile.get('memberships', {}).get('membershipOrg') or profile.get('membershipOrg'),
            'membershipType': profile.get('memberships', {}).get('membershipType') or profile.get('membershipType'),
            'membershipDate': profile.get('memberships', {}).get('membershipDate') or profile.get('membershipDate'),
            
            # Additional Info - FIXED: Check both nested and direct
            'askCommunity': profile.get('additionalInfo', {}).get('askCommunity') or profile.get('askCommunity'),
            'hobbies': profile.get('additionalInfo', {}).get('hobbies') or profile.get('hobbies'),
            'additionalComments': profile.get('additionalInfo', {}).get('additionalComments') or profile.get('additionalComments'),
            'agreeTerms': profile.get('additionalInfo', {}).get('agreeTerms') or profile.get('agreeTerms'),
            'allowContact': profile.get('additionalInfo', {}).get('allowContact') or profile.get('allowContact'),
            
            # File paths
            'profilePhotoPath': profile.get('profilePhotoPath'),
            'resumePath': profile.get('resumePath'),
            
            # Metadata
            '_id': str(profile.get('_id')),
            'userId': str(profile.get('userId')),
            'createdAt': profile.get('createdAt'),
            'updatedAt': profile.get('updatedAt')
        }
        
        # Log what's being returned for debugging
        print(f"🩸 Returning Blood Group: {flattened_profile.get('bloodGroup')}")
        print(f"🛂 Returning Work Permit: {flattened_profile.get('workPermit')}")
        print(f"👤 Returning Demographics: bloodGroup={flattened_profile.get('bloodGroup')}, gender={flattened_profile.get('gender')}, dateOfBirth={flattened_profile.get('dateOfBirth')}")
        print(f"🌍 Returning Location: nationality={flattened_profile.get('nationality')}, currentCity={flattened_profile.get('currentCity')}, workPermit={flattened_profile.get('workPermit')}")
        
        # Debug: Check the actual profile structure
        print(f"🔍 Profile structure debug:")
        print(f"  - profile type: {type(profile)}")
        print(f"  - profile keys: {list(profile.keys()) if isinstance(profile, dict) else 'Not a dict'}")
        print(f"  - profile.bloodGroup direct: {profile.get('bloodGroup') if isinstance(profile, dict) else 'N/A'}")
        print(f"  - profile.additionalInfo: {profile.get('additionalInfo') if isinstance(profile, dict) else 'N/A'}")
        if isinstance(profile, dict) and 'additionalInfo' in profile:
            print(f"  - profile.additionalInfo.bloodGroup: {profile.get('additionalInfo', {}).get('bloodGroup')}")
        
        # Debug: Check what the fallback logic is doing
        nested_blood = profile.get('additionalInfo', {}).get('bloodGroup') if isinstance(profile, dict) else None
        direct_blood = profile.get('bloodGroup') if isinstance(profile, dict) else None
        print(f"🔍 Blood Group fallback debug:")
        print(f"  - nested_blood: {nested_blood}")
        print(f"  - direct_blood: {direct_blood}")
        print(f"  - final result: {nested_blood or direct_blood}")
        
        return jsonify(flattened_profile), 200
        
    except Exception as e:
        print(f"Error getting comprehensive profile: {e}")
        return jsonify({"error": "An error occurred while fetching profile"}), 500

