from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import json
from werkzeug.utils import secure_filename
from datetime import datetime
from utils.db import get_db
from bson import ObjectId
from utils.profile_progress import calculate_profile_completion, get_profile_status, get_completion_message

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
        
        # Check if this is a draft save or final submission
        is_draft = request.form.get('isDraft', 'false').lower() == 'true'
        profile_completed = request.form.get('profileCompleted', 'false').lower() == 'true'
        
        print(f"\n{'='*80}")
        print(f"📥 RECEIVED DATA FROM FRONTEND")
        print(f"{'='*80}")
        print(f"📋 Submission mode: {'DRAFT' if is_draft else 'FINAL'}")
        print(f"📋 Profile completed: {profile_completed}")
        print(f"📋 Total form fields received: {len(request.form)}")
        print(f"📋 Total files received: {len(request.files)}")
        
        # Log first 20 form fields to verify data is being sent
        print(f"\n📝 Sample of received form fields:")
        for idx, (key, value) in enumerate(list(request.form.items())[:20]):
            value_preview = str(value)[:100] if value else "EMPTY"
            print(f"  {idx+1}. {key}: {value_preview}")
        
        if len(request.form) > 20:
            print(f"  ... and {len(request.form) - 20} more fields")
        print(f"{'='*80}\n")
        
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
                'bloodGroup': request.form.get('bloodGroup'),
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
                'yearsExperience': request.form.get('yearsOfExperience') or request.form.get('yearsExperience'),
                'careerLevel': request.form.get('careerLevel'),
                'industry': request.form.get('industry'),
                'summary': request.form.get('summary') or request.form.get('professionalSummary')
            }
            
            # Section 5: Work Experience (Array)
            experience_entries_str = request.form.get('experienceEntries')
            try:
                experience_entries = json.loads(experience_entries_str) if experience_entries_str else []
            except json.JSONDecodeError as e:
                print(f"Error parsing experienceEntries: {e}, value: {experience_entries_str[:100]}")
                experience_entries = []
            
            # Section 6: Education (Array)
            education_entries_str = request.form.get('educationEntries')
            try:
                education_entries = json.loads(education_entries_str) if education_entries_str else []
            except json.JSONDecodeError as e:
                print(f"Error parsing educationEntries: {e}, value: {education_entries_str[:100]}")
                education_entries = []
            
            # Section 7: Skills & Competencies
            core_skills_str = request.form.get('coreSkills')
            tools_str = request.form.get('tools')
            try:
                core_skills = json.loads(core_skills_str) if core_skills_str else []
            except json.JSONDecodeError as e:
                print(f"Error parsing coreSkills: {e}, value: {core_skills_str[:100] if core_skills_str else 'None'}")
                core_skills = []
            try:
                tools = json.loads(tools_str) if tools_str else []
            except json.JSONDecodeError as e:
                print(f"Error parsing tools: {e}, value: {tools_str[:100] if tools_str else 'None'}")
                tools = []
            skills_info = {
                'coreSkills': core_skills,
                'tools': tools
            }
            
            # Section 8: Languages (Array)
            languages_str = request.form.get('languages')
            try:
                languages = json.loads(languages_str) if languages_str else []
            except json.JSONDecodeError as e:
                print(f"Error parsing languages: {e}, value: {languages_str[:100] if languages_str else 'None'}")
                languages = []
            
            # Section 9: Certifications (Array)
            certification_entries_str = request.form.get('certificationEntries')
            try:
                certification_entries = json.loads(certification_entries_str) if certification_entries_str else []
            except json.JSONDecodeError as e:
                print(f"Error parsing certificationEntries: {e}, value: {certification_entries_str[:100] if certification_entries_str else 'None'}")
                certification_entries = []
            
            # Section 10: Professional Memberships
            memberships = {
                'membershipOrg': request.form.get('membershipOrg'),
                'membershipType': request.form.get('membershipType'),
                'membershipDate': request.form.get('membershipDate')
            }
            
            # Section 11: References (Array)
            reference_entries_str = request.form.get('referenceEntries')
            try:
                reference_entries = json.loads(reference_entries_str) if reference_entries_str else []
            except json.JSONDecodeError as e:
                print(f"Error parsing referenceEntries: {e}, value: {reference_entries_str[:100] if reference_entries_str else 'None'}")
                reference_entries = []
            
            # Section 12: Professional Online Presence (Array)
            professional_links_str = request.form.get('professionalLinks')
            try:
                professional_links = json.loads(professional_links_str) if professional_links_str else []
            except json.JSONDecodeError as e:
                print(f"Error parsing professionalLinks: {e}, value: {professional_links_str[:100] if professional_links_str else 'None'}")
                professional_links = []
            
            # Section 13: Job Preferences & Availability
            job_preferences = {
                'preferredJobTitles': request.form.get('preferredJobTitles'),
                'jobType': request.form.get('jobType'),
                'noticePeriod': request.form.get('noticePeriod'),
                'currentSalary': request.form.get('currentSalary'),
                'expectedSalary': request.form.get('expectedSalary'),
                'currencyPreference': request.form.get('currencyPreference'),
                'travelAvailability': request.form.get('travelAvailability')
            }
            
            # Section 14: Additional Information
            additional_info = {
                'bloodGroup': request.form.get('bloodGroup'),  # Added for completeness
                'careerObjectives': request.form.get('careerObjectives'),
                'hobbies': request.form.get('hobbies'),
                'additionalComments': request.form.get('additionalComments'),
                'agreeTerms': request.form.get('agreeTerms'),
                'allowContact': request.form.get('allowContact')
            }
            
        except Exception as e:
            print(f"Unexpected error parsing form data: {e}")
            import traceback
            traceback.print_exc()
            # For draft saves, continue even if there are parsing errors
            if is_draft:
                print(f"⚠️  Continuing with draft save despite parsing error")
            else:
                return jsonify({"error": f"Error parsing form data: {str(e)}"}), 400
        
        # Age verification - User must be 18 or older
        # Skip age verification for draft saves
        if not is_draft:
            date_of_birth = personal_info.get('dateOfBirth')
            if date_of_birth:
                try:
                    # datetime is already imported at the top of the file
                    birth_date = datetime.strptime(date_of_birth, '%Y-%m-%d')
                    today = datetime.now()
                    age = today.year - birth_date.year
                    
                    # Adjust age if birthday hasn't occurred this year yet
                    if (today.month, today.day) < (birth_date.month, birth_date.day):
                        age -= 1
                    
                    if age < 18:
                        print(f"Age verification failed: User is {age} years old (under 18)")
                        return jsonify({
                            "error": "You must be at least 18 years old to create an account.",
                            "age_restriction": True
                        }), 400
                except ValueError as e:
                    print(f"Invalid date format for dateOfBirth: {date_of_birth}, error: {e}")
                    return jsonify({"error": "Invalid date of birth format"}), 400
        else:
            print(f"⚠️  Skipping age verification for draft save")
        
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
        # Save BOTH nested AND flat to ensure 100% data retrieval
        # Initialize with defaults to prevent any None issues
        personal_info = personal_info or {}
        nationality_residency = nationality_residency or {}
        preferred_locations = preferred_locations or {}
        professional_profile = professional_profile or {}
        experience_entries = experience_entries or []
        education_entries = education_entries or []
        skills_info = skills_info or {}
        languages = languages or []
        certification_entries = certification_entries or []
        memberships = memberships or {}
        reference_entries = reference_entries or []
        professional_links = professional_links or []
        job_preferences = job_preferences or {}
        additional_info = additional_info or {}
        
        update_data = {
            # Personal Information - FLAT (use .get() for safety)
            'firstName': personal_info.get('firstName', ''),
            'middleName': personal_info.get('middleName', ''),
            'lastName': personal_info.get('lastName', ''),
            'fullName': f"{personal_info.get('firstName', '')} {personal_info.get('middleName', '')} {personal_info.get('lastName', '')}".replace('  ', ' ').strip(),
            'email': personal_info.get('email', ''),
            'phone': personal_info.get('phone', ''),
            'altPhone': personal_info.get('altPhone', ''),
            'dateOfBirth': personal_info.get('dateOfBirth', ''),
            'gender': personal_info.get('gender', ''),
            'community': personal_info.get('community', ''),
            'bloodGroup': personal_info.get('bloodGroup', '') or additional_info.get('bloodGroup', ''),
            
            # Nationality & Residency - FLAT (use .get() for safety)
            'nationality': nationality_residency.get('nationality', ''),
            'residentCountry': nationality_residency.get('residentCountry', ''),
            'currentCity': nationality_residency.get('currentCity', ''),
            'postalCode': nationality_residency.get('postalCode', ''),
            'address': nationality_residency.get('address', ''),
            'latitude': nationality_residency.get('latitude', ''),
            'longitude': nationality_residency.get('longitude', ''),
            'workPermit': nationality_residency.get('workPermit', ''),
            'location': {
                'latitude': nationality_residency.get('latitude', ''),
                'longitude': nationality_residency.get('longitude', ''),
                'address': nationality_residency.get('address', ''),
                'city': nationality_residency.get('currentCity', ''),
                'country': nationality_residency.get('residentCountry', '')
            },
            
            # Preferred Working Locations - FLAT (use .get() for safety)
            'preferredLocation1': preferred_locations.get('preferredLocation1', ''),
            'preferredLocation2': preferred_locations.get('preferredLocation2', ''),
            'preferredLocation3': preferred_locations.get('preferredLocation3', ''),
            'willingToRelocate': preferred_locations.get('willingToRelocate', ''),
            'workLocation': preferred_locations.get('workLocation', ''),
            'preferredLocations': preferred_locations,  # Also keep nested for backward compatibility
            
            # Professional Profile - FLAT (use .get() for safety)
            'professionalTitle': professional_profile.get('professionalTitle', ''),
            'yearsExperience': professional_profile.get('yearsExperience', ''),
            'yearsOfExperience': professional_profile.get('yearsExperience', ''),  # Also save as yearsOfExperience
            'careerLevel': professional_profile.get('careerLevel', ''),
            'industry': professional_profile.get('industry', ''),
            'summary': professional_profile.get('summary', ''),
            'professionalSummary': professional_profile.get('summary', ''),
            'professionalProfile': professional_profile,  # Also keep nested
            
            # Work Experience (Array) - FLAT
            'experienceEntries': experience_entries,
            'experience': experience_entries,
            'workExperience': experience_entries,
            
            # Education (Array) - FLAT
            'educationEntries': education_entries,
            'education': education_entries,
            
            # Skills & Competencies - FLAT (use .get() for safety)
            'coreSkills': skills_info.get('coreSkills', []),
            'tools': skills_info.get('tools', []),
            'skills': skills_info.get('coreSkills', []) + skills_info.get('tools', []),  # Combined for search
            
            # Languages (Array) - FLAT
            'languages': languages,
            
            # Certifications (Array) - FLAT
            'certificationEntries': certification_entries,
            'certifications': certification_entries,
            
            # Professional Memberships - FLAT
            'membershipOrg': memberships.get('membershipOrg', ''),
            'membershipType': memberships.get('membershipType', ''),
            'membershipDate': memberships.get('membershipDate', ''),
            'memberships': memberships,  # Also keep nested
            
            # References (Array) - FLAT
            'referenceEntries': reference_entries,
            'references': reference_entries,
            
            # Professional Online Presence (Array) - FLAT
            'professionalLinks': professional_links,
            
            # Job Preferences & Availability - FLAT
            'preferredJobTitles': job_preferences.get('preferredJobTitles', ''),
            'jobType': job_preferences.get('jobType', ''),
            'noticePeriod': job_preferences.get('noticePeriod', ''),
            'currentSalary': job_preferences.get('currentSalary', ''),
            'expectedSalary': job_preferences.get('expectedSalary', ''),
            'currencyPreference': job_preferences.get('currencyPreference', ''),
            'travelAvailability': job_preferences.get('travelAvailability', ''),
            'jobPreferences': job_preferences,  # Also keep nested
            
            # Additional Information - FLAT
            'careerObjectives': additional_info.get('careerObjectives', ''),
            'hobbies': additional_info.get('hobbies', ''),
            'additionalComments': additional_info.get('additionalComments', ''),
            'agreeTerms': additional_info.get('agreeTerms', False),
            'allowContact': additional_info.get('allowContact', False),
            'additionalInfo': additional_info,  # Also keep nested
            
            # Meta information
            # CRITICAL: If draft, set profileCompleted to False regardless of form value
            'profileCompleted': False if is_draft else profile_completed,
            'hasCompletedProfile': False if is_draft else profile_completed,
            'isDraft': is_draft,
            'comprehensiveProfileCompleted': False if is_draft else profile_completed,
            'profileCompletedAt': datetime.utcnow() if (profile_completed and not is_draft) else None,
            'draftSavedAt': datetime.utcnow() if is_draft else None,
            'lastUpdatedAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        
        # Add file paths if available
        if profile_photo_path:
            update_data['profilePhotoPath'] = profile_photo_path
        
        if resume_file_path:
            update_data['resumePath'] = resume_file_path
            update_data['resumeUploadedAt'] = datetime.utcnow()
        
        print(f"\n{'='*80}")
        print(f"💾 SAVING TO USERS COLLECTION")
        print(f"{'='*80}")
        print(f"✅ Saving {len([v for v in update_data.values() if v])} filled fields")
        print(f"📋 Sample fields being saved:")
        sample_fields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender', 'bloodGroup', 
                        'nationality', 'currentCity', 'workPermit', 'professionalTitle', 'yearsExperience',
                        'careerLevel', 'industry', 'jobType', 'noticePeriod']
        for field in sample_fields:
            if field in update_data:
                print(f"  ✓ {field}: {update_data[field]}")
        print(f"📊 Array fields being saved:")
        print(f"  ✓ experienceEntries: {len(update_data.get('experienceEntries', []))} items")
        print(f"  ✓ educationEntries: {len(update_data.get('educationEntries', []))} items")
        print(f"  ✓ coreSkills: {len(update_data.get('coreSkills', []))} items")
        print(f"  ✓ languages: {len(update_data.get('languages', []))} items")
        print(f"{'='*80}\n")
        
        # Update user in database with error handling
        try:
            result = users_collection.update_one(
                {'_id': user_object_id},
                {'$set': update_data}
            )
        except Exception as db_error:
            print(f"❌ DATABASE UPDATE ERROR: {db_error}")
            import traceback
            traceback.print_exc()
            return jsonify({
                "error": f"Database error: {str(db_error)}",
                "details": "Failed to save profile data to database"
            }), 500
        
        print(f"\n{'='*80}")
        print(f"💾 DATABASE UPDATE RESULTS")
        print(f"{'='*80}")
        print(f"✅ Matched documents: {result.matched_count}")
        print(f"✅ Modified documents: {result.modified_count}")
        
        if result.modified_count == 0 and result.matched_count > 0:
            print(f"⚠️  WARNING: Document matched but not modified (data might be identical)")
        elif result.modified_count > 0:
            print(f"✅ SUCCESS: Data saved to users collection")
        else:
            print(f"❌ ERROR: No documents matched or modified!")
        print(f"{'='*80}\n")
        
        # VERIFICATION: Read back the data to confirm it was saved
        print(f"🔍 VERIFYING SAVED DATA...")
        saved_user = users_collection.find_one({'_id': user_object_id})
        if saved_user:
            verification_fields = ['dateOfBirth', 'gender', 'professionalTitle', 'yearsExperience', 'currentCity']
            print(f"✅ Verification - checking key fields:")
            for field in verification_fields:
                value = saved_user.get(field)
                if value:
                    print(f"  ✓ {field}: {value}")
                else:
                    print(f"  ❌ {field}: MISSING!")
            
            # Check arrays
            print(f"\n✅ Verification - checking arrays:")
            print(f"  ✓ coreSkills: {len(saved_user.get('coreSkills', []))} items")
            print(f"  ✓ experienceEntries: {len(saved_user.get('experienceEntries', []))} items")
            print(f"  ✓ educationEntries: {len(saved_user.get('educationEntries', []))} items")
            print(f"  ✓ languages: {len(saved_user.get('languages', []))} items")
        else:
            print(f"❌ ERROR: Could not read back saved data!")
        print(f"\n")
        
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
            
            # Insert or update job seeker profile with error handling
            try:
                jobseeker_profiles_collection.update_one(
                    {'userId': user_object_id},
                    {'$set': profile_entry},
                    upsert=True
                )
            except Exception as profile_db_error:
                print(f"⚠️  WARNING: Failed to update jobseeker_profiles collection: {profile_db_error}")
                # Don't fail the whole request - users collection was already updated
                import traceback
                traceback.print_exc()
            
            if is_draft:
                print("✅ Job seeker profile saved as DRAFT")
                print(f"📊 Draft Progress: Data saved but profile marked as incomplete")
                print(f"   - profileCompleted: False")
                print(f"   - isDraft: True")
                print(f"   - Data will be available for editing")
                return jsonify({
                    "success": True,
                    "message": "Profile saved as draft successfully",
                    "profileCompleted": False,
                    "hasCompletedProfile": False,
                    "isDraft": True,
                    "draftSavedAt": datetime.utcnow().isoformat(),
                    "needsCompletion": True
                }), 200
            else:
                print("✅ Job seeker profile COMPLETED successfully")
                print(f"📊 Profile Complete: All data saved and profile marked as complete")
                print(f"   - profileCompleted: True")
                print(f"   - isDraft: False")
            return jsonify({
                "success": True,
                "message": "Job seeker profile completed successfully",
                "profileCompleted": True,
                "hasCompletedProfile": True,
                "comprehensiveProfileCompleted": True,
                "isDraft": False
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
                    'preferredJobTitles': user_data.get('preferredJobTitles', ''),
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
        # Priority: user_data (users collection) > profile nested > profile direct
        # This ensures we ALWAYS get the latest data from registration form
        
        flattened_profile = {
            # Personal Information - Check ALL locations
            'firstName': (user_data.get('firstName') if user_data else None) or profile.get('personalInfo', {}).get('firstName') or profile.get('firstName') or '',
            'middleName': (user_data.get('middleName') if user_data else None) or profile.get('personalInfo', {}).get('middleName') or profile.get('middleName') or '',
            'lastName': (user_data.get('lastName') if user_data else None) or profile.get('personalInfo', {}).get('lastName') or profile.get('lastName') or '',
            'email': (user_data.get('email') if user_data else None) or profile.get('personalInfo', {}).get('email') or profile.get('email') or '',
            'phone': (user_data.get('phone') if user_data else None) or profile.get('personalInfo', {}).get('phone') or profile.get('phone') or '',
            'altPhone': (user_data.get('altPhone') if user_data else None) or profile.get('personalInfo', {}).get('altPhone') or profile.get('altPhone') or '',
            'dateOfBirth': (user_data.get('dateOfBirth') if user_data else None) or profile.get('personalInfo', {}).get('dateOfBirth') or profile.get('dateOfBirth') or '',
            'gender': (user_data.get('gender') if user_data else None) or profile.get('personalInfo', {}).get('gender') or profile.get('gender') or '',
            'community': (user_data.get('community') if user_data else None) or profile.get('personalInfo', {}).get('community') or profile.get('community') or '',
            'bloodGroup': (user_data.get('bloodGroup') if user_data else None) or profile.get('additionalInfo', {}).get('bloodGroup') or profile.get('bloodGroup') or '',
            
            # Nationality & Residency - Check ALL locations
            'nationality': (user_data.get('nationality') if user_data else None) or profile.get('nationalityResidency', {}).get('nationality') or profile.get('nationality') or '',
            'residentCountry': (user_data.get('residentCountry') if user_data else None) or profile.get('nationalityResidency', {}).get('residentCountry') or profile.get('residentCountry') or '',
            'currentCity': (user_data.get('currentCity') if user_data else None) or profile.get('nationalityResidency', {}).get('currentCity') or profile.get('currentCity') or '',
            'postalCode': (user_data.get('postalCode') if user_data else None) or profile.get('nationalityResidency', {}).get('postalCode') or profile.get('postalCode') or '',
            'address': (user_data.get('address') if user_data else None) or profile.get('nationalityResidency', {}).get('address') or profile.get('address') or '',
            'latitude': (user_data.get('latitude') if user_data else None) or profile.get('nationalityResidency', {}).get('latitude') or profile.get('latitude') or '',
            'longitude': (user_data.get('longitude') if user_data else None) or profile.get('nationalityResidency', {}).get('longitude') or profile.get('longitude') or '',
            'workPermit': (user_data.get('workPermit') if user_data else None) or profile.get('nationalityResidency', {}).get('workPermit') or profile.get('workPermit') or '',
            
            # Preferred Locations - Check ALL locations
            'preferredLocation1': (user_data.get('preferredLocation1') if user_data else None) or profile.get('preferredLocations', {}).get('preferredLocation1') or profile.get('preferredLocation1') or '',
            'preferredLocation2': (user_data.get('preferredLocation2') if user_data else None) or profile.get('preferredLocations', {}).get('preferredLocation2') or profile.get('preferredLocation2') or '',
            'preferredLocation3': (user_data.get('preferredLocation3') if user_data else None) or profile.get('preferredLocations', {}).get('preferredLocation3') or profile.get('preferredLocation3') or '',
            'willingToRelocate': (user_data.get('willingToRelocate') if user_data else None) or profile.get('preferredLocations', {}).get('willingToRelocate') or profile.get('willingToRelocate') or '',
            'workLocation': (user_data.get('workLocation') if user_data else None) or profile.get('preferredLocations', {}).get('workLocation') or profile.get('workLocation') or '',
            
            # Combined location field
            'location': ', '.join(filter(None, [
                (user_data.get('currentCity') if user_data else None) or profile.get('nationalityResidency', {}).get('currentCity') or profile.get('currentCity'),
                (user_data.get('residentCountry') if user_data else None) or profile.get('nationalityResidency', {}).get('residentCountry') or profile.get('residentCountry')
            ])),
            
            # Professional Profile - Check ALL locations
            'professionalTitle': (user_data.get('professionalTitle') if user_data else None) or profile.get('professionalProfile', {}).get('professionalTitle') or profile.get('professionalTitle') or '',
            'yearsOfExperience': (user_data.get('yearsExperience') if user_data else None) or profile.get('professionalProfile', {}).get('yearsExperience') or profile.get('yearsOfExperience') or profile.get('yearsExperience') or '',
            'yearsExperience': (user_data.get('yearsExperience') if user_data else None) or profile.get('professionalProfile', {}).get('yearsExperience') or profile.get('yearsExperience') or '',
            'careerLevel': (user_data.get('careerLevel') if user_data else None) or profile.get('professionalProfile', {}).get('careerLevel') or profile.get('careerLevel') or '',
            'industry': (user_data.get('industry') if user_data else None) or profile.get('professionalProfile', {}).get('industry') or profile.get('industry') or '',
            'professionalSummary': (user_data.get('summary') if user_data else None) or profile.get('professionalProfile', {}).get('summary') or profile.get('summary') or profile.get('professionalSummary') or '',
            'summary': (user_data.get('summary') if user_data else None) or profile.get('professionalProfile', {}).get('summary') or profile.get('summary') or '',
            
            # Skills - Check ALL locations (arrays)
            'coreSkills': (user_data.get('coreSkills', []) if user_data and user_data.get('coreSkills') else []) or profile.get('skillsInfo', {}).get('coreSkills', []) or profile.get('coreSkills', []) or profile.get('skills', []) or [],
            'skills': (user_data.get('coreSkills', []) if user_data and user_data.get('coreSkills') else []) or profile.get('skillsInfo', {}).get('coreSkills', []) or profile.get('skills', []) or profile.get('coreSkills', []) or [],
            'tools': (user_data.get('tools', []) if user_data and user_data.get('tools') else []) or profile.get('skillsInfo', {}).get('tools', []) or profile.get('tools', []) or [],
            
            # Professional Memberships - Check ALL locations  
            'membershipOrg': (user_data.get('membershipOrg') if user_data else None) or profile.get('professionalMemberships', {}).get('membershipOrg') or profile.get('memberships', {}).get('membershipOrg') or profile.get('membershipOrg') or '',
            'membershipType': (user_data.get('membershipType') if user_data else None) or profile.get('professionalMemberships', {}).get('membershipType') or profile.get('memberships', {}).get('membershipType') or profile.get('membershipType') or '',
            'membershipDate': (user_data.get('membershipDate') if user_data else None) or profile.get('professionalMemberships', {}).get('membershipDate') or profile.get('memberships', {}).get('membershipDate') or profile.get('membershipDate') or '',
            
            # Arrays - Check ALL locations
            'languages': (user_data.get('languages', []) if user_data and user_data.get('languages') else []) or profile.get('languages', []) or [],
            'experienceEntries': (user_data.get('experienceEntries', []) if user_data and user_data.get('experienceEntries') else []) or profile.get('experienceEntries', []) or profile.get('experience', []) or profile.get('workExperience', []) or [],
            'educationEntries': (user_data.get('educationEntries', []) if user_data and user_data.get('educationEntries') else []) or profile.get('educationEntries', []) or profile.get('education', []) or [],
            'certificationEntries': (user_data.get('certificationEntries', []) if user_data and user_data.get('certificationEntries') else []) or profile.get('certificationEntries', []) or profile.get('certifications', []) or [],
            'referenceEntries': (user_data.get('referenceEntries', []) if user_data and user_data.get('referenceEntries') else []) or profile.get('referenceEntries', []) or profile.get('references', []) or [],
            'professionalLinks': (user_data.get('professionalLinks', []) if user_data and user_data.get('professionalLinks') else []) or profile.get('professionalLinks', []) or [],
            
            # Job Preferences - Check ALL locations
            'preferredJobTitles': (user_data.get('preferredJobTitles') if user_data else None) or profile.get('jobPreferences', {}).get('preferredJobTitles') or profile.get('preferredJobTitles') or '',
            'jobType': (user_data.get('jobType') if user_data else None) or profile.get('jobPreferences', {}).get('jobType') or profile.get('jobType') or '',
            'noticePeriod': (user_data.get('noticePeriod') if user_data else None) or profile.get('jobPreferences', {}).get('noticePeriod') or profile.get('noticePeriod') or '',
            'availability': (user_data.get('availability') if user_data else None) or profile.get('jobPreferences', {}).get('availability') or profile.get('availability') or '',
            'currentSalary': (user_data.get('currentSalary') if user_data else None) or profile.get('jobPreferences', {}).get('currentSalary') or profile.get('currentSalary') or '',
            'expectedSalary': (user_data.get('expectedSalary') if user_data else None) or profile.get('jobPreferences', {}).get('expectedSalary') or profile.get('expectedSalary') or '',
            'currencyPreference': (user_data.get('currencyPreference') if user_data else None) or profile.get('jobPreferences', {}).get('currencyPreference') or profile.get('currencyPreference') or '',
            'travelAvailability': (user_data.get('travelAvailability') if user_data else None) or profile.get('jobPreferences', {}).get('travelAvailability') or profile.get('travelAvailability') or '',
            
            # Additional Info - Check ALL locations
            'careerObjectives': (user_data.get('careerObjectives') if user_data else None) or profile.get('additionalInfo', {}).get('careerObjectives') or profile.get('careerObjectives') or '',
            'hobbies': (user_data.get('hobbies') if user_data else None) or profile.get('additionalInfo', {}).get('hobbies') or profile.get('hobbies') or '',
            'additionalComments': (user_data.get('additionalComments') if user_data else None) or profile.get('additionalInfo', {}).get('additionalComments') or profile.get('additionalComments') or '',
            'agreeTerms': (user_data.get('agreeTerms') if user_data else None) or profile.get('additionalInfo', {}).get('agreeTerms') or profile.get('agreeTerms') or False,
            'allowContact': (user_data.get('allowContact') if user_data else None) or profile.get('additionalInfo', {}).get('allowContact') or profile.get('allowContact') or False,
            
            # File paths
            'profilePhotoPath': (user_data.get('profilePhotoPath') if user_data else None) or profile.get('profilePhotoPath'),
            'resumePath': (user_data.get('resumePath') if user_data else None) or profile.get('resumePath'),
            
            # Metadata
            '_id': str(profile.get('_id')) if profile.get('_id') else '',
            'userId': str(profile.get('userId')) if profile.get('userId') else str(user_object_id),
            'createdAt': profile.get('createdAt'),
            'updatedAt': profile.get('updatedAt') or (user_data.get('updatedAt') if user_data else None),
            
            # Profile completion status
            'profileCompleted': (user_data.get('profileCompleted') if user_data else None) or profile.get('profileCompleted') or False,
            'hasCompletedProfile': (user_data.get('hasCompletedProfile') if user_data else None) or profile.get('hasCompletedProfile') or False,
            'isDraft': (user_data.get('isDraft') if user_data else None) or profile.get('isDraft') or False,
            'draftSavedAt': (user_data.get('draftSavedAt') if user_data else None) or profile.get('draftSavedAt'),
            'comprehensiveProfileCompleted': (user_data.get('comprehensiveProfileCompleted') if user_data else None) or profile.get('comprehensiveProfileCompleted') or False
        }
        
        # Calculate profile completion percentage
        profile_status = get_profile_status(flattened_profile)
        completion_percentage = profile_status['completionPercentage']
        completion_message = get_completion_message(
            completion_percentage, 
            flattened_profile.get('isDraft', False)
        )
        
        # Add profile status to response
        flattened_profile['profileCompletion'] = completion_percentage
        flattened_profile['profileStatus'] = profile_status
        flattened_profile['completionMessage'] = completion_message
        
        # Enhanced logging for debugging
        print(f"\n{'='*80}")
        print(f"📊 COMPLETE DATA RETURN DEBUG")
        print(f"{'='*80}")
        print(f"✅ Returning {len([v for v in flattened_profile.values() if v])} filled fields out of {len(flattened_profile)} total fields")
        print(f"📊 Profile Completion: {completion_percentage}%")
        print(f"📋 Profile Status: {profile_status['status']}")
        print(f"📝 Is Draft: {flattened_profile.get('isDraft', False)}")
        print(f"✅ Profile Completed: {flattened_profile.get('profileCompleted', False)}")
        if profile_status['missingFieldsCount'] > 0:
            print(f"⚠️  Missing Fields ({profile_status['missingFieldsCount']}): {', '.join(profile_status['missingFields'][:5])}")
        print(f"{'='*80}\n")
        
        return jsonify(flattened_profile), 200
        
    except Exception as e:
        print(f"Error getting comprehensive profile: {e}")
        return jsonify({"error": "An error occurred while fetching profile"}), 500

