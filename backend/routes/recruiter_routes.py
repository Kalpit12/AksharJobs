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

