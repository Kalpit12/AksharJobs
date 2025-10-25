#!/usr/bin/env python3
"""
Recruiter Routes - Handles comprehensive recruiter profile operations
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user_model import User
from bson import ObjectId
import json
from datetime import datetime

recruiter_bp = Blueprint('recruiter', __name__)

@recruiter_bp.route('/register', methods=['POST'])
def register_recruiter():
    """
    Register a new recruiter with comprehensive profile information
    Saves data to the 'recruiters' collection in MongoDB
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data received'}), 400
        
        print(f"Received recruiter registration data: {data.get('companyName', 'N/A')}")
        
        # Prepare recruiter document for MongoDB
        recruiter_doc = {
            # Company Information
            'companyName': data.get('companyName', ''),
            'companyEmail': data.get('companyEmail', ''),
            'companyPhone': data.get('companyPhone', ''),
            'companyWebsite': data.get('companyWebsite', ''),
            'companySize': data.get('companySize', ''),
            'yearFounded': data.get('yearFounded', ''),
            'industry': data.get('industry', ''),
            'companyDescription': data.get('companyDescription', ''),
            'companyLogo': data.get('companyLogo', ''),
            
            # Company Location
            'country': data.get('country', ''),
            'state': data.get('state', ''),
            'city': data.get('city', ''),
            'postalCode': data.get('postalCode', ''),
            'address': data.get('address', ''),
            'latitude': data.get('latitude', ''),
            'longitude': data.get('longitude', ''),
            
            # Recruiter Personal Details
            'firstName': data.get('firstName', ''),
            'lastName': data.get('lastName', ''),
            'jobTitle': data.get('jobTitle', ''),
            'recruiterPhone': data.get('recruiterPhone', ''),
            'recruiterEmail': data.get('recruiterEmail', ''),
            'linkedinProfile': data.get('linkedinProfile', ''),
            
            # Recruitment Specialization
            'industries': data.get('industries', []),
            'functions': data.get('functions', []),
            'careerLevels': data.get('careerLevels', []),
            'averageHiringVolume': data.get('averageHiringVolume', ''),
            
            # Geographic Coverage
            'recruitCountries': data.get('recruitCountries', []),
            'offersRemote': data.get('offersRemote', ''),
            
            # Services & Offerings
            'employmentTypes': data.get('employmentTypes', []),
            'additionalServices': data.get('additionalServices', []),
            'averageTimeToHire': data.get('averageTimeToHire', ''),
            
            # Social Media & Online Presence
            'linkedinPage': data.get('linkedinPage', ''),
            'facebookPage': data.get('facebookPage', ''),
            'twitterHandle': data.get('twitterHandle', ''),
            'instagram': data.get('instagram', ''),
            'additionalLinks': data.get('additionalLinks', []),
            
            # Terms & Additional Information
            'hearAboutUs': data.get('hearAboutUs', ''),
            'additionalComments': data.get('additionalComments', ''),
            'agreeTerms': data.get('agreeTerms', False),
            'agreeDataProcessing': data.get('agreeDataProcessing', False),
            'agreeMarketing': data.get('agreeMarketing', False),
            'verifyInfo': data.get('verifyInfo', False),
            
            # Metadata
            'status': 'pending',  # pending, approved, rejected
            'createdAt': datetime.now(),
            'updatedAt': datetime.now()
        }
        
        # Save to MongoDB 'recruiters' collection
        from utils.db import get_db
        db = get_db()
        
        if db is None:
            print("❌ ERROR: Database connection is None!")
            return jsonify({'error': 'Database connection failed'}), 500
        
        print(f"✅ Database connection successful: {db.name}")
        print(f"📝 Attempting to insert recruiter: {recruiter_doc.get('companyName', 'N/A')}")
        
        # Insert into recruiters collection
        result = db.recruiters.insert_one(recruiter_doc)
        
        print(f"✅ Recruiter registered successfully with ID: {result.inserted_id}")
        print(f"📊 Verifying: Document count in recruiters collection: {db.recruiters.count_documents({})}")
        
        return jsonify({
            'message': 'Recruiter registered successfully',
            'recruiterId': str(result.inserted_id),
            'status': 'pending'
        }), 200
        
    except Exception as e:
        print(f"Error registering recruiter: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'An error occurred while registering recruiter',
            'details': str(e)
        }), 500


@recruiter_bp.route('/complete-profile', methods=['POST'])
@jwt_required()
def complete_recruiter_profile():
    """
    Complete comprehensive recruiter profile with all sections
    """
    try:
        user_id = get_jwt_identity()
        
        # Get form data
        data = request.form.to_dict()
        
        # Parse JSON arrays
        json_fields = [
            'industries', 'operatingRegions', 'positionTypes', 'hiringDepartments',
            'preferredFields', 'preferredSkills', 'preferredSoftSkills', 
            'internSearchKeywords', 'languageRequirements', 'perks', 
            'hiringStages', 'interviewPlatforms'
        ]
        
        for field in json_fields:
            if field in data:
                try:
                    data[field] = json.loads(data[field])
                except:
                    data[field] = []
        
        # Handle file upload (company logo)
        company_logo_url = None
        if 'companyLogo' in request.files:
            file = request.files['companyLogo']
            if file and file.filename:
                # Here you would handle file upload to storage
                # For now, we'll just note it was provided
                company_logo_url = f"uploads/logos/{user_id}_{file.filename}"
                # TODO: Implement actual file upload logic
        
        # Prepare recruiter profile data
        recruiter_profile = {
            # Section 1: Company Information
            'companyName': data.get('companyName', ''),
            'websiteURL': data.get('websiteURL', ''),
            'companyLinkedIn': data.get('companyLinkedIn', ''),
            'industries': data.get('industries', []),
            'companySize': data.get('companySize', ''),
            'headquartersCountry': data.get('headquartersCountry', ''),
            'headquartersCity': data.get('headquartersCity', ''),
            'operatingRegions': data.get('operatingRegions', []),
            'companyDescription': data.get('companyDescription', ''),
            'companyLogo': company_logo_url or '',
            
            # Section 2: Recruiter/HR Details
            'recruiterFullName': data.get('fullName', ''),
            'designation': data.get('designation', ''),
            'officialEmail': data.get('officialEmail', ''),
            'contactNumber': data.get('contactNumber', ''),
            'recruiterLinkedIn': data.get('recruiterLinkedIn', ''),
            'preferredCommunication': data.get('preferredCommunication', ''),
            
            # Section 3: Internship/Job Preferences
            'positionTypes': data.get('positionTypes', []),
            'workType': data.get('workType', ''),
            'hiringDepartments': data.get('hiringDepartments', []),
            'numberOfPositions': data.get('numberOfPositions', ''),
            'expectedStartDate': data.get('expectedStartDate', ''),
            'duration': data.get('duration', ''),
            'compensationAmount': data.get('compensationAmount', ''),
            'compensationCurrency': data.get('compensationCurrency', 'USD'),
            'applicationDeadline': data.get('applicationDeadline', ''),
            'workHours': data.get('workHours', ''),
            
            # Section 4: Candidate Requirements
            'preferredEducation': data.get('preferredEducation', ''),
            'preferredFields': data.get('preferredFields', []),
            'preferredSkills': data.get('preferredSkills', []),
            'preferredSoftSkills': data.get('preferredSoftSkills', []),
            'languageRequirements': data.get('languageRequirements', []),
            'minimumExperience': data.get('minimumExperience', ''),
            'minimumAcademic': data.get('minimumAcademic', ''),
            
            # Section 5: Company Policy & Benefits
            'provideCertificate': data.get('provideCertificate', ''),
            'offerStipend': data.get('offerStipend', ''),
            'stipendRange': data.get('stipendRange', ''),
            'provideLOR': data.get('provideLOR', ''),
            'offerPPO': data.get('offerPPO', ''),
            'workCulture': data.get('workCulture', ''),
            'perks': data.get('perks', []),
            
            # Section 6: Hiring Process
            'hiringStages': data.get('hiringStages', []),
            'processDuration': data.get('processDuration', ''),
            'interviewMode': data.get('interviewMode', ''),
            'interviewPlatforms': data.get('interviewPlatforms', []),
            
            # Metadata
            'profileCompleted': True,
            'profileCompletedAt': datetime.now(),
            'lastUpdated': datetime.now()
        }
        
        # Update user profile
        result = User.update_user(user_id, recruiter_profile)
        
        # PyMongo returns an UpdateResult, not a dict
        updated = False
        try:
            updated = bool(result and (getattr(result, 'modified_count', 0) > 0 or getattr(result, 'matched_count', 0) > 0))
        except Exception as e:
            print(f"Error interpreting update result: {e}")

        if updated:
            # Convert datetime objects to ISO strings for JSON response
            response_profile = recruiter_profile.copy()
            if isinstance(response_profile.get('profileCompletedAt'), datetime):
                response_profile['profileCompletedAt'] = response_profile['profileCompletedAt'].isoformat()
            if isinstance(response_profile.get('lastUpdated'), datetime):
                response_profile['lastUpdated'] = response_profile['lastUpdated'].isoformat()

            return jsonify({
                'message': 'Recruiter profile completed successfully',
                'profile': response_profile
            }), 200
        else:
            return jsonify({
                'error': 'Failed to update profile',
                'details': 'No documents matched or modified'
            }), 400
            
    except Exception as e:
        # Provide more visibility during development
        err_msg = str(e)
        print(f"Error completing recruiter profile: {err_msg}")
        return jsonify({
            'error': 'An error occurred while saving your profile',
            'details': err_msg
        }), 500


@recruiter_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_recruiter_profile():
    """
    Get recruiter profile data
    """
    try:
        user_id = get_jwt_identity()
        user = User.find_by_id(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Extract recruiter-specific fields
        recruiter_data = {
            'companyName': user.get('companyName', ''),
            'websiteURL': user.get('websiteURL', ''),
            'companyLinkedIn': user.get('companyLinkedIn', ''),
            'industries': user.get('industries', []),
            'companySize': user.get('companySize', ''),
            'headquartersCountry': user.get('headquartersCountry', ''),
            'headquartersCity': user.get('headquartersCity', ''),
            'operatingRegions': user.get('operatingRegions', []),
            'companyDescription': user.get('companyDescription', ''),
            'companyLogo': user.get('companyLogo', ''),
            'recruiterFullName': user.get('recruiterFullName', ''),
            'designation': user.get('designation', ''),
            'officialEmail': user.get('officialEmail', ''),
            'contactNumber': user.get('contactNumber', ''),
            'recruiterLinkedIn': user.get('recruiterLinkedIn', ''),
            'preferredCommunication': user.get('preferredCommunication', ''),
            'positionTypes': user.get('positionTypes', []),
            'workType': user.get('workType', ''),
            'hiringDepartments': user.get('hiringDepartments', []),
            'numberOfPositions': user.get('numberOfPositions', ''),
            'expectedStartDate': user.get('expectedStartDate', ''),
            'duration': user.get('duration', ''),
            'compensationAmount': user.get('compensationAmount', ''),
            'compensationCurrency': user.get('compensationCurrency', 'USD'),
            'applicationDeadline': user.get('applicationDeadline', ''),
            'workHours': user.get('workHours', ''),
            'preferredEducation': user.get('preferredEducation', ''),
            'preferredFields': user.get('preferredFields', []),
            'preferredSkills': user.get('preferredSkills', []),
            'preferredSoftSkills': user.get('preferredSoftSkills', []),
            'languageRequirements': user.get('languageRequirements', []),
            'minimumExperience': user.get('minimumExperience', ''),
            'minimumAcademic': user.get('minimumAcademic', ''),
            'provideCertificate': user.get('provideCertificate', ''),
            'offerStipend': user.get('offerStipend', ''),
            'stipendRange': user.get('stipendRange', ''),
            'provideLOR': user.get('provideLOR', ''),
            'offerPPO': user.get('offerPPO', ''),
            'workCulture': user.get('workCulture', ''),
            'perks': user.get('perks', []),
            'hiringStages': user.get('hiringStages', []),
            'processDuration': user.get('processDuration', ''),
            'interviewMode': user.get('interviewMode', ''),
            'interviewPlatforms': user.get('interviewPlatforms', []),
            'profileCompleted': user.get('profileCompleted', False)
        }
        
        return jsonify(recruiter_data), 200
        
    except Exception as e:
        print(f"Error fetching recruiter profile: {str(e)}")
        return jsonify({'error': 'Failed to fetch profile'}), 500


@recruiter_bp.route('/update-profile', methods=['PUT'])
@jwt_required()
def update_recruiter_profile_legacy():
    """
    Update existing recruiter profile (legacy endpoint)
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Add last updated timestamp
        data['lastUpdated'] = datetime.now()
        
        result = User.update_user(user_id, data)
        
        if result.get('success'):
            return jsonify({
                'message': 'Profile updated successfully'
            }), 200
        else:
            return jsonify({
                'error': 'Failed to update profile'
            }), 400
            
    except Exception as e:
        print(f"Error updating recruiter profile: {str(e)}")
        return jsonify({
            'error': 'An error occurred while updating your profile'
        }), 500


@recruiter_bp.route('/internships', methods=['GET'])
@jwt_required()
def get_recruiter_internships():
    """
    Get all internships posted by the current recruiter
    """
    try:
        recruiter_id = get_jwt_identity()
        
        if not recruiter_id:
            return jsonify({'error': 'Authentication required'}), 401
        
        print(f"Fetching internships for recruiter: {recruiter_id}")
        
        from utils.db import get_db
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Get internships posted by this recruiter (try both ObjectId and string)
        print(f"Searching for internships with recruiter_id: {recruiter_id}")
        internships = []
        
        # Try string match first (most common case)
        internships = list(db.internships.find({'recruiter_id': recruiter_id}))
        print(f"String match found {len(internships)} internships")
        
        # If no results, try ObjectId match
        if not internships:
            try:
                internships = list(db.internships.find({'recruiter_id': ObjectId(recruiter_id)}))
                print(f"ObjectId match found {len(internships)} internships")
            except Exception as e:
                print(f"ObjectId conversion failed: {e}")
                internships = []
        
        print(f"Found {len(internships)} internships")
        
        # Convert ObjectIds to strings for JSON serialization
        serializable_internships = []
        for internship in internships:
            # Create a clean copy of the internship data
            clean_internship = {}
            for key, value in internship.items():
                if key == '_id':
                    clean_internship[key] = str(value)
                elif key == 'recruiter_id':
                    clean_internship[key] = str(value)
                elif key == 'createdAt' and isinstance(value, datetime):
                    clean_internship[key] = value.isoformat()
                elif isinstance(value, bytes):
                    # Skip bytes objects that can't be JSON serialized
                    clean_internship[key] = str(value) if value else None
                elif isinstance(value, (str, int, float, bool, list, dict, type(None))):
                    # Only include JSON-serializable types
                    clean_internship[key] = value
                else:
                    # Convert other types to string
                    clean_internship[key] = str(value) if value is not None else None
            
            serializable_internships.append(clean_internship)
        
        return jsonify(serializable_internships), 200
        
    except Exception as e:
        print(f"Error fetching recruiter internships: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to fetch internships', 'details': str(e)}), 500

@recruiter_bp.route('/internships', methods=['POST'])
@jwt_required()
def create_internship():
    """
    Create a new internship posting
    """
    try:
        recruiter_id = get_jwt_identity()
        
        if not recruiter_id:
            return jsonify({'error': 'Authentication required'}), 401
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        print(f"Creating internship for recruiter: {recruiter_id}")
        print(f"Internship data: {data}")
        
        from utils.db import get_db
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Create internship document
        internship_data = {
            'title': data.get('title', ''),
            'company': data.get('company', ''),
            'location': data.get('location', ''),
            'type': data.get('type', 'Remote'),
            'duration': data.get('duration', '3-6 months'),
            'stipend': data.get('stipend', ''),
            'domain': data.get('domain', ''),
            'requiredSkills': data.get('requiredSkills', []),
            'description': data.get('description', ''),
            'responsibilities': data.get('responsibilities', ''),
            'requirements': data.get('requirements', ''),
            'benefits': data.get('benefits', ''),
            'applicationDeadline': data.get('applicationDeadline', ''),
            'recruiter_id': recruiter_id,
            'status': data.get('status', 'active'),
            'createdAt': datetime.utcnow(),
            'applicants': [],
            'views': 0
        }
        
        # Insert internship
        result = db.internships.insert_one(internship_data)
        internship_data['_id'] = str(result.inserted_id)
        internship_data['recruiter_id'] = str(internship_data['recruiter_id'])
        internship_data['createdAt'] = internship_data['createdAt'].isoformat()
        
        print(f"Internship created successfully: {result.inserted_id}")
        
        return jsonify(internship_data), 201
        
    except Exception as e:
        print(f"Error creating internship: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to create internship', 'details': str(e)}), 500

@recruiter_bp.route('/internships/<internship_id>', methods=['PUT'])
@jwt_required()
def update_internship(internship_id):
    """
    Update an existing internship
    """
    try:
        recruiter_id = get_jwt_identity()
        
        if not recruiter_id:
            return jsonify({'error': 'Authentication required'}), 401
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        print(f"Updating internship {internship_id} for recruiter: {recruiter_id}")
        
        from utils.db import get_db
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Find and update internship
        from bson import ObjectId
        try:
            result = db.internships.update_one(
                {'_id': ObjectId(internship_id), 'recruiter_id': recruiter_id},
                {'$set': data}
            )
            
            if result.matched_count == 0:
                return jsonify({'error': 'Internship not found or not authorized'}), 404
            
            # Return updated internship
            updated_internship = db.internships.find_one({'_id': ObjectId(internship_id)})
            if updated_internship:
                updated_internship['_id'] = str(updated_internship['_id'])
                updated_internship['recruiter_id'] = str(updated_internship['recruiter_id'])
                if 'createdAt' in updated_internship and isinstance(updated_internship['createdAt'], datetime):
                    updated_internship['createdAt'] = updated_internship['createdAt'].isoformat()
                
                return jsonify(updated_internship), 200
            else:
                return jsonify({'error': 'Failed to retrieve updated internship'}), 500
                
        except Exception as e:
            print(f"Error updating internship: {e}")
            return jsonify({'error': 'Invalid internship ID'}), 400
        
    except Exception as e:
        print(f"Error updating internship: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to update internship', 'details': str(e)}), 500


@recruiter_bp.route('/candidates', methods=['GET'])
@jwt_required()
def get_recruiter_candidates():
    """
    Get all candidates for the current recruiter
    """
    try:
        recruiter_id = get_jwt_identity()
        
        if not recruiter_id:
            return jsonify({'error': 'Authentication required'}), 401
        
        print(f"Fetching candidates for recruiter: {recruiter_id}")
        
        from utils.db import get_db
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Get all job seekers (candidates)
        candidates = list(db.users.find({'userType': 'jobSeeker'}))
        
        print(f"Found {len(candidates)} candidates")
        
        # Convert ObjectIds to strings for JSON serialization
        serializable_candidates = []
        for candidate in candidates:
            # Create a clean copy of the candidate data
            clean_candidate = {}
            for key, value in candidate.items():
                if key == '_id':
                    clean_candidate[key] = str(value)
                elif key == 'createdAt' and isinstance(value, datetime):
                    clean_candidate[key] = value.isoformat()
                elif isinstance(value, bytes):
                    # Skip bytes objects that can't be JSON serialized
                    clean_candidate[key] = str(value) if value else None
                elif isinstance(value, (str, int, float, bool, list, dict, type(None))):
                    # Only include JSON-serializable types
                    clean_candidate[key] = value
                else:
                    # Convert other types to string
                    clean_candidate[key] = str(value) if value is not None else None
            
            serializable_candidates.append(clean_candidate)
        
        return jsonify(serializable_candidates), 200
        
    except Exception as e:
        print(f"Error fetching candidates: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to fetch candidates', 'details': str(e)}), 500


@recruiter_bp.route('/applications', methods=['GET'])
@jwt_required()
def get_recruiter_applications():
    """
    Get all applications for jobs posted by the current recruiter
    """
    try:
        recruiter_id = get_jwt_identity()
        
        if not recruiter_id:
            return jsonify({'error': 'Authentication required'}), 401
        
        print(f"🔍 Fetching applications for recruiter: {recruiter_id}")
        
        from utils.db import get_db
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Get all jobs posted by this recruiter
        # Try both ObjectId and string formats
        recruiter_jobs = []
        try:
            recruiter_jobs = list(db.jobs.find({'recruiter_id': recruiter_id}))
            print(f"📋 Found {len(recruiter_jobs)} jobs with string recruiter_id")
        except Exception as e:
            print(f"Error finding jobs with string recruiter_id: {e}")
        
        # Also try ObjectId format
        if not recruiter_jobs:
            try:
                recruiter_jobs = list(db.jobs.find({'recruiter_id': ObjectId(recruiter_id)}))
                print(f"📋 Found {len(recruiter_jobs)} jobs with ObjectId recruiter_id")
            except Exception as e:
                print(f"Error finding jobs with ObjectId recruiter_id: {e}")
        
        # If no jobs found, try to find jobs where recruiter_id matches the user's email or other identifier
        if not recruiter_jobs:
            try:
                user = db.users.find_one({'_id': ObjectId(recruiter_id)})
                if user:
                    user_email = user.get('email', '')
                    # Try to find jobs by email or other patterns
                    recruiter_jobs = list(db.jobs.find({
                        '$or': [
                            {'recruiter_id': user_email},
                            {'recruiter_email': user_email},
                            {'posted_by': user_email},
                            {'company_email': user_email}
                        ]
                    }))
                    print(f"📋 Found {len(recruiter_jobs)} jobs with email matching")
            except Exception as e:
                print(f"Error finding jobs with email: {e}")
        
        if not recruiter_jobs:
            print("⚠️ No jobs found for this recruiter")
            return jsonify([]), 200
        
        # Get job IDs in both ObjectId and string formats
        job_ids_objects = [job['_id'] for job in recruiter_jobs]
        job_ids_strings = [str(job_id) for job_id in job_ids_objects]
        
        print(f"📋 Found {len(recruiter_jobs)} jobs, fetching applications...")
        print(f"🔑 Job IDs (first 3): {job_ids_strings[:3]}")
        
        # Get all applications for these jobs - try both ObjectId and string formats
        applications = list(db.applications.find({
            '$or': [
                {'job_id': {'$in': job_ids_objects}},
                {'job_id': {'$in': job_ids_strings}}
            ]
        }))
        
        # Also get intern applications (stored in separate collection)
        intern_applications = list(db.intern_applications.find({
            '$or': [
                {'internshipId': {'$in': job_ids_objects}},
                {'internshipId': {'$in': job_ids_strings}}
            ]
        }))
        
        # Convert intern applications to match regular application format
        for intern_app in intern_applications:
            intern_app['job_id'] = intern_app.get('internshipId')
            intern_app['applicant_id'] = intern_app.get('userId')
            intern_app['applied_at'] = intern_app.get('appliedAt')
            applications.append(intern_app)
        
        print(f"👥 Found {len(applications)} total applications ({len(intern_applications)} from interns)")
        
        # Create a job lookup dictionary for faster access
        job_lookup = {str(job['_id']): job for job in recruiter_jobs}
        
        # Enrich applications with all required data
        enriched_applications = []
        for app in applications:
            try:
                # Convert ObjectIds to strings
                app_id = str(app.get('_id', ''))
                job_id = str(app.get('job_id', ''))
                applicant_id = str(app.get('applicant_id', app.get('userId', '')))
                
                # Get job details
                job = job_lookup.get(job_id)
                if not job:
                    print(f"⚠️ Job not found for job_id: {job_id}")
                    continue
                
                # Get applicant details
                applicant = None
                try:
                    applicant = db.users.find_one({'_id': ObjectId(applicant_id)})
                except:
                    pass
                
                if not applicant:
                    print(f"⚠️ Applicant not found for applicant_id: {applicant_id}")
                    # Continue anyway with whatever data we have
                
                # Build enriched application object with all fields the frontend expects
                enriched_app = {
                    '_id': app_id,
                    'job_id': job_id,
                    'applicant_id': applicant_id,
                    'userId': applicant_id,  # For compatibility
                    
                    # Applicant information
                    'applicant_name': app.get('applicant_name', '') or (
                        f"{applicant.get('firstName', '')} {applicant.get('lastName', '')}".strip() if applicant else 'Unknown'
                    ),
                    'candidate_name': app.get('candidate_name', '') or (
                        f"{applicant.get('firstName', '')} {applicant.get('lastName', '')}".strip() if applicant else 'Unknown'
                    ),
                    'applicant_email': app.get('applicant_email', '') or (applicant.get('email', '') if applicant else ''),
                    
                    # Job information
                    'job_title': app.get('job_title', '') or job.get('job_title', job.get('title', 'Unknown Job')),
                    'company_name': app.get('company_name', '') or job.get('company_name', job.get('company', '')),
                    'location': app.get('location', '') or job.get('location', 'N/A'),
                    'job_type': app.get('job_type', '') or job.get('job_type', 'N/A'),
                    'salary_range': app.get('salary_range', '') or job.get('salary_range', 'N/A'),
                    
                    # Application status and dates
                    'status': app.get('status', 'pending'),
                    'status_display': (app.get('status', 'pending').replace('_', ' ').title()),
                    'applied_at': app.get('applied_at', '') or (app.get('created_at').isoformat() if app.get('created_at') else ''),
                    'created_at': app.get('created_at', '') if isinstance(app.get('created_at'), str) else (
                        app.get('created_at').isoformat() if app.get('created_at') else ''
                    ),
                    
                    # Match scores
                    'matchScore': app.get('matchScore', app.get('final_score', 0)),
                    'final_score': app.get('final_score', app.get('matchScore', 0)),
                    'education_score': app.get('education_score', 0),
                    'skill_score': app.get('skill_score', 0),
                    'experience_score': app.get('experience_score', 0),
                    
                    # Additional details
                    'cover_letter': app.get('cover_letter', ''),
                    'resume_skills': app.get('resume_skills', []),
                    'resume_path': app.get('resume_path', ''),
                    
                    # Tracking history (if available)
                    'tracking_history': []
                }
                
                # Get tracking history if available
                try:
                    tracking_history = list(db.application_tracking.find({
                        'userId': applicant_id,
                        'jobId': job_id
                    }).sort('created_at', -1))
                    
                    for record in tracking_history:
                        record['_id'] = str(record['_id'])
                        enriched_app['tracking_history'].append(record)
                except Exception as e:
                    print(f"Error fetching tracking history: {e}")
                
                enriched_applications.append(enriched_app)
                
            except Exception as e:
                print(f"❌ Error processing application {app.get('_id')}: {e}")
                import traceback
                traceback.print_exc()
                continue
        
        print(f"✅ Successfully enriched {len(enriched_applications)} applications")
        return jsonify(enriched_applications), 200
        
    except Exception as e:
        print(f"❌ Error fetching recruiter applications: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to fetch applications', 'details': str(e)}), 500


@recruiter_bp.route('/applications/<application_id>/status', methods=['PUT'])
@jwt_required()
def update_application_status(application_id):
    """
    Update application status for a specific application
    """
    try:
        recruiter_id = get_jwt_identity()
        
        if not recruiter_id:
            return jsonify({'error': 'Authentication required'}), 401
        
        data = request.get_json()
        if not data or 'status' not in data:
            return jsonify({'error': 'Status is required'}), 400
        
        new_status = data.get('status')
        notes = data.get('notes', '')
        interview_date = data.get('interview_date')
        interview_mode = data.get('interview_mode')
        
        print(f"🔄 Updating application {application_id} status to {new_status}")
        
        from utils.db import get_db
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Find the application - check both collections
        application = db.applications.find_one({'_id': ObjectId(application_id)})
        is_intern_application = False
        
        if not application:
            # Try intern applications collection
            application = db.intern_applications.find_one({'_id': ObjectId(application_id)})
            is_intern_application = True
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        # Get job/internship ID
        job_id = application.get('internshipId') if is_intern_application else application.get('job_id')
        job = db.jobs.find_one({'_id': job_id if isinstance(job_id, ObjectId) else ObjectId(job_id)})
        
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        # Check if recruiter owns this job
        job_recruiter_id = str(job.get('recruiter_id', ''))
        if job_recruiter_id != recruiter_id:
            return jsonify({'error': 'Unauthorized - you do not own this job posting'}), 403
        
        # Update the application status
        update_data = {
            'status': new_status,
            'status_display': new_status.replace('_', ' ').title(),
            'last_updated': datetime.utcnow()
        }
        
        if notes:
            update_data['notes'] = notes
        if interview_date:
            update_data['interview_date'] = interview_date
        if interview_mode:
            update_data['interview_mode'] = interview_mode
        
        # Update the correct collection based on application type
        if is_intern_application:
            result = db.intern_applications.update_one(
                {'_id': ObjectId(application_id)},
                {'$set': update_data}
            )
        else:
            result = db.applications.update_one(
                {'_id': ObjectId(application_id)},
                {'$set': update_data}
            )
        
        if result.modified_count == 0:
            return jsonify({'error': 'Failed to update application'}), 500
        
        # Create a tracking record
        tracking_record = {
            'userId': str(application.get('applicant_id', application.get('userId', ''))),
            'jobId': str(job_id),
            'status': new_status,
            'notes': notes,
            'timestamp': datetime.utcnow().isoformat(),
            'created_at': datetime.utcnow(),
            'updated_by': recruiter_id
        }
        db.application_tracking.insert_one(tracking_record)
        
        # Send email notification to candidate
        try:
            applicant_id = application.get('applicant_id', application.get('userId'))
            applicant = db.users.find_one({'_id': ObjectId(applicant_id) if isinstance(applicant_id, str) else applicant_id})
            
            if applicant:
                from services.email_notification_service import get_email_service
                email_service = get_email_service()
                recipient_name = f"{applicant.get('firstName', '')} {applicant.get('lastName', '')}".strip()
                recipient_email = applicant.get('email', '')
                job_title = application.get('job_title', job.get('job_title', job.get('title', 'Unknown Job')))
                company_name = application.get('company_name', job.get('company_name', ''))
                
                if new_status == 'interview' and interview_date:
                    email_service.send_interview_notification(
                        recipient_email, recipient_name, job_title, company_name,
                        interview_date, interview_mode or 'TBD', notes
                    )
                else:
                    email_service.send_application_status_notification(
                        recipient_email, recipient_name, job_title, company_name,
                        new_status, notes
                    )
        except Exception as e:
            print(f"⚠️ Failed to send email notification: {e}")
        
        print(f"✅ Application status updated successfully")
        return jsonify({
            'message': 'Application status updated successfully',
            'status': new_status,
            'application_id': application_id
        }), 200
        
    except Exception as e:
        print(f"❌ Error updating application status: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to update application status', 'details': str(e)}), 500


@recruiter_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_recruiter_stats():
    """
    Get dashboard statistics for the current recruiter
    """
    try:
        recruiter_id = get_jwt_identity()
        
        if not recruiter_id:
            return jsonify({'error': 'Authentication required'}), 401
        
        print(f"Fetching stats for recruiter: {recruiter_id}")
        
        from utils.db import get_db
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Get recruiter's jobs (try both ObjectId and string)
        try:
            recruiter_jobs = list(db.jobs.find({'recruiter_id': ObjectId(recruiter_id)}))
        except:
            recruiter_jobs = list(db.jobs.find({'recruiter_id': recruiter_id}))
        
        # If no jobs found, try to find jobs where recruiter_id matches the user's email or other identifier
        if not recruiter_jobs:
            # Get user details to find alternative identifiers
            user = db.users.find_one({'_id': ObjectId(recruiter_id)})
            if user:
                user_email = user.get('email', '')
                # Try to find jobs by email or other patterns
                recruiter_jobs = list(db.jobs.find({
                    '$or': [
                        {'recruiter_id': user_email},
                        {'recruiter_email': user_email},
                        {'posted_by': user_email},
                        {'company_email': user_email}
                    ]
                }))
        
        job_ids = [job['_id'] for job in recruiter_jobs]
        
        # Get applications for these jobs
        # Convert job_ids to strings for comparison since applications store job_id as string
        job_id_strings = [str(job_id) for job_id in job_ids]
        applications = list(db.applications.find({'job_id': {'$in': job_id_strings}}))
        
        print(f"Calculating stats: {len(recruiter_jobs)} jobs, {len(applications)} applications")
        
        # Calculate stats
        stats = {
            'activeJobs': len([job for job in recruiter_jobs if job.get('status') != 'closed']),
            'totalApplications': len(applications),
            'inInterview': len([app for app in applications if app.get('status') == 'interview']),
            'offersExtended': len([app for app in applications if app.get('status') == 'offer']),
            'newJobsThisWeek': 0,  # TODO: Calculate based on createdAt
            'applicationsIncrease': 0,  # TODO: Calculate based on previous month
            'interviewsThisWeek': 0,  # TODO: Calculate based on interview dates
            'offersAccepted': len([app for app in applications if app.get('status') == 'accepted'])
        }
        
        print(f"Stats calculated: {stats}")
        
        return jsonify(stats), 200
        
    except Exception as e:
        print(f"Error fetching recruiter stats: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to fetch stats', 'details': str(e)}), 500

# Settings Management Endpoints
@recruiter_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_recruiter_profile():
    """Update comprehensive recruiter profile information"""
    try:
        recruiter_id = get_jwt_identity()
        data = request.get_json()
        
        if not recruiter_id:
            return jsonify({'error': 'Authentication required'}), 401
        
        print(f"\n💾 Updating recruiter profile for ID: {recruiter_id}")
        print(f"📦 Received data keys: {list(data.keys())}")
        
        # Ensure arrays stay as arrays
        def ensure_array(value):
            if value is None:
                return []
            if isinstance(value, list):
                return value
            if isinstance(value, str):
                try:
                    import json
                    parsed = json.loads(value)
                    return parsed if isinstance(parsed, list) else []
                except:
                    return [item.strip() for item in value.split(',') if item.strip()]
            return []
        
        # Update user profile
        from utils.db import get_db
        db = get_db()
        
        update_data = {
            # Company Information
            'companyName': data.get('companyName'),
            'companyEmail': data.get('companyEmail'),
            'companyPhone': data.get('companyPhone'),
            'companyWebsite': data.get('companyWebsite'),
            'companySize': data.get('companySize'),
            'yearFounded': data.get('yearFounded'),
            'industry': data.get('industry'),
            'companyDescription': data.get('companyDescription'),
            'companyLogo': data.get('companyLogo'),
            
            # Company Location
            'country': data.get('country'),
            'state': data.get('state'),
            'city': data.get('city'),
            'postalCode': data.get('postalCode'),
            'address': data.get('address'),
            'latitude': data.get('latitude'),
            'longitude': data.get('longitude'),
            
            # Recruiter Personal Details
            'firstName': data.get('firstName'),
            'lastName': data.get('lastName'),
            'jobTitle': data.get('jobTitle'),
            'recruiterPhone': data.get('recruiterPhone'),
            'recruiterEmail': data.get('recruiterEmail'),
            'linkedinProfile': data.get('linkedinProfile'),
            'phoneNumber': data.get('recruiterPhone') or data.get('phoneNumber'),
            'email': data.get('recruiterEmail') or data.get('email'),
            
            # Recruitment Specialization - Ensure arrays
            'industries': ensure_array(data.get('industries')),
            'functions': ensure_array(data.get('functions')),
            'careerLevels': ensure_array(data.get('careerLevels')),
            'hiringVolume': data.get('hiringVolume'),
            'timeToHire': data.get('timeToHire'),
            
            # Geographic Coverage
            'recruitCountries': ensure_array(data.get('recruitCountries')),
            'offersRemote': data.get('offersRemote'),
            
            # Services & Offerings - Ensure arrays
            'employmentTypes': ensure_array(data.get('employmentTypes')),
            'additionalServices': ensure_array(data.get('additionalServices')),
            
            # Social Media
            'linkedinCompany': data.get('linkedinCompany'),
            'facebook': data.get('facebook'),
            'twitter': data.get('twitter'),
            'instagram': data.get('instagram'),
            'additionalLinks': ensure_array(data.get('additionalLinks')),
            
            # Additional
            'taxId': data.get('taxId'),
            'referralSource': data.get('referralSource'),
            'additionalComments': data.get('additionalComments'),
            
            # Metadata
            'updatedAt': datetime.utcnow()
        }
        
        # Remove None values but keep empty arrays
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        print(f"📝 Array fields being saved:")
        print(f"   - industries: {update_data.get('industries', [])} (type: {type(update_data.get('industries', []))})")
        print(f"   - functions: {update_data.get('functions', [])} (type: {type(update_data.get('functions', []))})")
        print(f"   - careerLevels: {update_data.get('careerLevels', [])} (type: {type(update_data.get('careerLevels', []))})")
        print(f"   - recruitCountries: {update_data.get('recruitCountries', [])} (type: {type(update_data.get('recruitCountries', []))})")
        print(f"   - employmentTypes: {update_data.get('employmentTypes', [])} (type: {type(update_data.get('employmentTypes', []))})")
        
        result = db.users.update_one(
            {"_id": ObjectId(recruiter_id)},
            {"$set": update_data}
        )
        
        if result.matched_count > 0:
            # Get updated user data
            updated_user = db.users.find_one({"_id": ObjectId(recruiter_id)})
            if updated_user:
                updated_user['_id'] = str(updated_user['_id'])
                
                print(f"✅ Profile updated successfully!")
                print(f"📊 Saved industries: {updated_user.get('industries', [])} (type: {type(updated_user.get('industries', []))})")
                
                return jsonify({
                    'message': 'Profile updated successfully',
                    'user': updated_user
                }), 200
            else:
                return jsonify({'error': 'Failed to retrieve updated user'}), 500
        else:
            # Even if nothing was modified, return success if user exists
            user = db.users.find_one({"_id": ObjectId(recruiter_id)})
            if user:
                user['_id'] = str(user['_id'])
                print(f"ℹ️ Profile already up to date (no changes detected)")
                return jsonify({
                    'message': 'Profile is already up to date',
                    'user': user
                }), 200
            else:
                return jsonify({'error': 'User not found'}), 404
            
    except Exception as e:
        print(f"❌ Error updating recruiter profile: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to update profile', 'details': str(e)}), 500

@recruiter_bp.route('/company', methods=['PUT'])
@jwt_required()
def update_company_info():
    """Update company information"""
    try:
        recruiter_id = get_jwt_identity()
        data = request.get_json()
        
        if not recruiter_id:
            return jsonify({'error': 'Authentication required'}), 401
        
        from utils.db import get_db
        db = get_db()
        
        update_data = {
            'companyName': data.get('companyName'),
            'companyEmail': data.get('companyEmail'),
            'companyPhone': data.get('companyPhone'),
            'companyWebsite': data.get('companyWebsite'),
            'companySize': data.get('companySize'),
            'industry': data.get('industry'),
            'companyDescription': data.get('companyDescription'),
            'address': data.get('address'),
            'city': data.get('city'),
            'state': data.get('state'),
            'country': data.get('country'),
            'postalCode': data.get('postalCode'),
            'updatedAt': datetime.utcnow()
        }
        
        # Remove None values
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        result = db.users.update_one(
            {"_id": ObjectId(recruiter_id)},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            updated_user = db.users.find_one({"_id": ObjectId(recruiter_id)})
            updated_user['_id'] = str(updated_user['_id'])
            
            return jsonify({
                'message': 'Company information updated successfully',
                'user': updated_user
            }), 200
        else:
            return jsonify({'error': 'No changes made'}), 400
            
    except Exception as e:
        print(f"Error updating company info: {e}")
        return jsonify({'error': 'Failed to update company information'}), 500

@recruiter_bp.route('/notifications', methods=['PUT'])
@jwt_required()
def update_notification_settings():
    """Update notification preferences"""
    try:
        recruiter_id = get_jwt_identity()
        data = request.get_json()
        
        if not recruiter_id:
            return jsonify({'error': 'Authentication required'}), 401
        
        from utils.db import get_db
        db = get_db()
        
        update_data = {
            'emailNotifications': data.get('emailNotifications'),
            'newApplications': data.get('newApplications'),
            'applicationUpdates': data.get('applicationUpdates'),
            'interviewReminders': data.get('interviewReminders'),
            'weeklyReports': data.get('weeklyReports'),
            'marketingEmails': data.get('marketingEmails'),
            'pushNotifications': data.get('pushNotifications'),
            'smsNotifications': data.get('smsNotifications'),
            'updatedAt': datetime.utcnow()
        }
        
        # Remove None values
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        result = db.users.update_one(
            {"_id": ObjectId(recruiter_id)},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            updated_user = db.users.find_one({"_id": ObjectId(recruiter_id)})
            updated_user['_id'] = str(updated_user['_id'])
            
            return jsonify({
                'message': 'Notification settings updated successfully',
                'user': updated_user
            }), 200
        else:
            return jsonify({'error': 'No changes made'}), 400
            
    except Exception as e:
        print(f"Error updating notification settings: {e}")
        return jsonify({'error': 'Failed to update notification settings'}), 500

@recruiter_bp.route('/preferences', methods=['PUT'])
@jwt_required()
def update_preferences():
    """Update user preferences"""
    try:
        recruiter_id = get_jwt_identity()
        data = request.get_json()
        
        if not recruiter_id:
            return jsonify({'error': 'Authentication required'}), 401
        
        from utils.db import get_db
        db = get_db()
        
        update_data = {
            'timezone': data.get('timezone'),
            'dateFormat': data.get('dateFormat'),
            'currency': data.get('currency'),
            'language': data.get('language'),
            'theme': data.get('theme'),
            'autoArchiveJobs': data.get('autoArchiveJobs'),
            'autoRejectThreshold': data.get('autoRejectThreshold'),
            'matchScoreThreshold': data.get('matchScoreThreshold'),
            'maxApplicationsPerJob': data.get('maxApplicationsPerJob'),
            'updatedAt': datetime.utcnow()
        }
        
        # Remove None values
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        result = db.users.update_one(
            {"_id": ObjectId(recruiter_id)},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            updated_user = db.users.find_one({"_id": ObjectId(recruiter_id)})
            updated_user['_id'] = str(updated_user['_id'])
            
            return jsonify({
                'message': 'Preferences updated successfully',
                'user': updated_user
            }), 200
        else:
            return jsonify({'error': 'No changes made'}), 400
            
    except Exception as e:
        print(f"Error updating preferences: {e}")
        return jsonify({'error': 'Failed to update preferences'}), 500

@recruiter_bp.route('/security', methods=['PUT'])
@jwt_required()
def update_security_settings():
    """Update security settings including password"""
    try:
        recruiter_id = get_jwt_identity()
        data = request.get_json()
        
        if not recruiter_id:
            return jsonify({'error': 'Authentication required'}), 401
        
        from utils.db import get_db
        from werkzeug.security import check_password_hash, generate_password_hash
        db = get_db()
        
        # Get current user
        user = db.users.find_one({"_id": ObjectId(recruiter_id)})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        update_data = {
            'twoFactorEnabled': data.get('twoFactorEnabled'),
            'updatedAt': datetime.utcnow()
        }
        
        # Handle password change
        if data.get('currentPassword') and data.get('newPassword'):
            if not check_password_hash(user.get('password', ''), data.get('currentPassword')):
                return jsonify({'error': 'Current password is incorrect'}), 400
            
            if data.get('newPassword') != data.get('confirmPassword'):
                return jsonify({'error': 'New passwords do not match'}), 400
            
            update_data['password'] = generate_password_hash(data.get('newPassword'))
        
        # Remove None values
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        result = db.users.update_one(
            {"_id": ObjectId(recruiter_id)},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            updated_user = db.users.find_one({"_id": ObjectId(recruiter_id)})
            # Remove password from response
            if 'password' in updated_user:
                del updated_user['password']
            updated_user['_id'] = str(updated_user['_id'])
            
            return jsonify({
                'message': 'Security settings updated successfully',
                'user': updated_user
            }), 200
        else:
            return jsonify({'error': 'No changes made'}), 400
            
    except Exception as e:
        print(f"Error updating security settings: {e}")
        return jsonify({'error': 'Failed to update security settings'}), 500