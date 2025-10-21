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
def update_recruiter_profile():
    """
    Update existing recruiter profile
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
        
        print(f"Fetching applications for recruiter: {recruiter_id}")
        
        from utils.db import get_db
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Get all jobs posted by this recruiter
        # First try to find jobs by recruiter_id as ObjectId
        try:
            recruiter_jobs = list(db.jobs.find({'recruiter_id': ObjectId(recruiter_id)}))
        except:
            # If that fails, try as string
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
        
        print(f"Found {len(recruiter_jobs)} jobs, fetching applications...")
        print(f"Job IDs: {job_ids}")
        
        # Get all applications for these jobs
        # Convert job_ids to strings for comparison since applications store job_id as string
        job_id_strings = [str(job_id) for job_id in job_ids]
        print(f"Job ID strings: {job_id_strings}")
        
        applications = list(db.applications.find({'job_id': {'$in': job_id_strings}}))
        print(f"Found {len(applications)} applications")
        
        # Debug: Check all applications to see what job_ids exist
        all_apps = list(db.applications.find({}, {'job_id': 1, 'candidateName': 1}))
        print(f"All applications in database: {len(all_apps)}")
        for app in all_apps[:5]:  # Show first 5
            print(f"  App job_id: {app.get('job_id')} (candidate: {app.get('candidateName', 'Unknown')})")
        
        # Convert ObjectIds to strings and add candidate info
        serializable_applications = []
        for app in applications:
            app['_id'] = str(app['_id'])
            app['job_id'] = str(app['job_id'])
            app['user_id'] = str(app['user_id'])
            
            # Add candidate name from user collection
            try:
                candidate = db.users.find_one({'_id': ObjectId(app['user_id'])})
            except:
                candidate = db.users.find_one({'_id': app['user_id']})
            
            if candidate:
                app['candidateName'] = f"{candidate.get('firstName', '')} {candidate.get('lastName', '')}".strip()
                app['candidateEmail'] = candidate.get('email', '')
            
            # Add job title
            job = db.jobs.find_one({'_id': app['job_id'] if isinstance(app['job_id'], ObjectId) else ObjectId(app['job_id'])})
            if job:
                app['jobTitle'] = job.get('title', 'Unknown Job')
            
            if 'appliedAt' in app and isinstance(app['appliedAt'], datetime):
                app['appliedDate'] = app['appliedAt'].isoformat()
            
            serializable_applications.append(app)
        
        return jsonify(serializable_applications), 200
        
    except Exception as e:
        print(f"Error fetching recruiter applications: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to fetch applications', 'details': str(e)}), 500


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