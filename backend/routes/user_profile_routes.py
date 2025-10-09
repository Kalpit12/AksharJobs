from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import json
from werkzeug.utils import secure_filename
from datetime import datetime
from utils.db import get_db
from bson import ObjectId

user_profile_routes = Blueprint('user_profile_routes', __name__)

# Configure upload folder
UPLOAD_FOLDER = 'uploads/resumes'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@user_profile_routes.route("/profile-setup", methods=["POST"])
@jwt_required()
def profile_setup():
    """Complete user profile setup with personal details, education, experience, and resume"""
    try:
        current_user_id = get_jwt_identity()
        print(f"Profile setup called for user ID: {current_user_id}")
        
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
            print(f"User not found for ID: {current_user_id} (ObjectId: {user_object_id})")
            return jsonify({"error": "User not found"}), 404
        
        print(f"Found user: {user.get('email', 'No email')}")
        
        # Get form data
        print(f"All form data received: {dict(request.form)}")
        print(f"All files received: {dict(request.files)}")
        
        full_name = request.form.get('fullName')
        email = request.form.get('email')
        phone = request.form.get('phone')
        date_of_birth = request.form.get('dateOfBirth')
        gender = request.form.get('gender')
        location = json.loads(request.form.get('location', '{}'))
        education = json.loads(request.form.get('education', '[]'))
        experience = json.loads(request.form.get('experience', '[]'))
        skills = json.loads(request.form.get('skills', '[]'))
        
        print(f"Parsed data - Full Name: {full_name}, Email: {email}, Phone: {phone}")
        print(f"Location: {location}, Education: {education}, Experience: {experience}, Skills: {skills}")
        
        # Validate required fields
        if not full_name or not email:
            return jsonify({"error": "Full name and email are required"}), 422
        
        # Handle resume file upload
        resume_file_path = None
        if 'resume' in request.files:
            resume_file = request.files['resume']
            if resume_file and resume_file.filename and allowed_file(resume_file.filename):
                filename = secure_filename(resume_file.filename)
                # Create unique filename with timestamp
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                unique_filename = f"{current_user_id}_{timestamp}_{filename}"
                file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
                resume_file.save(file_path)
                resume_file_path = file_path
                print(f"Resume saved to: {resume_file_path}")
        
        # Get additional location fields from request
        current_address = request.form.get('currentAddress', '')
        current_address_pin = request.form.get('currentAddressPin', '')
        home_address = request.form.get('homeAddress', '')
        home_address_pin = request.form.get('homeAddressPin', '')
        commute_options = json.loads(request.form.get('commuteOptions', '[]'))
        
        # Update user profile
        update_data = {
            'fullName': full_name,
            'phone': phone,
            'dateOfBirth': date_of_birth,
            'gender': gender,
            'location': location,
            'currentAddress': current_address,
            'currentAddressPin': current_address_pin,
            'homeAddress': home_address,
            'homeAddressPin': home_address_pin,
            'commuteOptions': commute_options,
            'education': education,
            'experience': experience,
            'skills': skills,
            'profileCompleted': True,
            'profileCompletedAt': datetime.utcnow()
        }
        
        if resume_file_path:
            update_data['resumePath'] = resume_file_path
            update_data['resumeUploadedAt'] = datetime.utcnow()
        
        print(f"Updating user with data: {update_data}")
        
        # Update user in database
        result = users_collection.update_one(
            {'_id': user_object_id},
            {'$set': update_data}
        )
        
        print(f"Update result: {result.modified_count} documents modified")
        
        if result.modified_count > 0:
            # Create resume profile entry
            resume_profile = {
                'userId': user_object_id,
                'fullName': full_name,
                'email': email,
                'phone': phone,
                'location': location,
                'education': education,
                'experience': experience,
                'skills': skills,
                'resumePath': resume_file_path,
                'createdAt': datetime.utcnow(),
                'updatedAt': datetime.utcnow()
            }
            
            # Insert or update resume profile
            resumes_collection = db.resumes
            resumes_collection.update_one(
                {'userId': user_object_id},
                {'$set': resume_profile},
                upsert=True
            )
            
            print("Profile setup completed successfully")
            return jsonify({
                "success": True,
                "message": "Profile completed successfully",
                "profileCompleted": True
            }), 200
        else:
            print("Failed to update user profile")
            return jsonify({"error": "Failed to update profile"}), 500
            
    except Exception as e:
        print(f"Error in profile setup: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"An error occurred during profile setup: {str(e)}"}), 500

@user_profile_routes.route("/profile", methods=["GET"])
@jwt_required()
def get_user_profile():
    """Get user profile information"""
    try:
        current_user_id = get_jwt_identity()
        db = get_db()
        users_collection = db.users
        
        # Convert string ID to ObjectId
        try:
            user_object_id = ObjectId(current_user_id)
        except Exception as e:
            print(f"Invalid user ID format: {current_user_id}, error: {e}")
            return jsonify({"error": "Invalid user ID format"}), 400
        
        user = users_collection.find_one({'_id': user_object_id})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Check if profile is completed
        profile_completed = user.get('profileCompleted', False)
        
        # Return profile data (including company fields for recruiters)
        profile_data = {
            "_id": str(user.get('_id')) if user.get('_id') else "",
            "fullName": user.get('fullName', ''),
            "firstName": user.get('firstName', ''),
            "lastName": user.get('lastName', ''),
            "email": user.get('email', ''),
            "phone": user.get('phone', ''),
            "dateOfBirth": user.get('dateOfBirth', ''),
            "gender": user.get('gender', ''),
            "bloodGroup": user.get('bloodGroup', ''),
            "location": user.get('location', {}),
            "currentAddress": user.get('currentAddress', ''),
            "currentAddressPin": user.get('currentAddressPin', ''),
            "homeAddress": user.get('homeAddress', ''),
            "homeAddressPin": user.get('homeAddressPin', ''),
            "commuteOptions": user.get('commuteOptions', []),
            "education": user.get('education', []),
            "experience": user.get('experience', []),
            "skills": user.get('skills', []),
            "jobPreferences": user.get('jobPreferences', {}),
            "salaryExpectations": user.get('salaryExpectations', {}),
            "availability": user.get('availability', {}),
            "languages": user.get('languages', []),
            "linkedinProfile": user.get('linkedinProfile', ''),
            "portfolio": user.get('portfolio', ''),
            "bio": user.get('bio', ''),
            "profileCompleted": profile_completed,
            "resumePath": user.get('resumePath', ''),
            "resumeUploadedAt": user.get('resumeUploadedAt', ''),
            "userType": user.get('userType', ''),
            # Recruiter/Company fields
            "companyName": user.get('companyName', ''),
            "companyWebsite": user.get('companyWebsite', ''),
            "industry": user.get('industry', ''),
            "companySize": user.get('companySize', ''),
            "foundedYear": user.get('foundedYear', ''),
            "companyDescription": user.get('companyDescription', ''),
            "companyLogo": user.get('companyLogo', '')
        }
        
        print(f"📋 GET Profile - Returning company fields: companyName={profile_data.get('companyName')}, industry={profile_data.get('industry')}, companySize={profile_data.get('companySize')}")
        
        return jsonify(profile_data), 200
        
    except Exception as e:
        print(f"Error getting user profile: {e}")
        return jsonify({"error": "An error occurred while fetching profile"}), 500

@user_profile_routes.route("/profile", methods=["PUT"])
@jwt_required()
def update_user_profile():
    """Update user profile information"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        db = get_db()
        users_collection = db.users
        
        # Update user profile
        update_data = {
            'updatedAt': datetime.utcnow()
        }
        
        # Add fields that are provided (including company fields for recruiters)
        fields_to_update = ['fullName', 'firstName', 'lastName', 'phone', 'dateOfBirth', 'gender', 'bloodGroup', 'location', 'currentAddress', 'currentAddressPin', 'homeAddress', 'homeAddressPin', 'commuteOptions', 'education', 'experience', 'skills', 'jobPreferences', 'salaryExpectations', 'availability', 'languages', 'linkedinProfile', 'portfolio', 'bio', 'companyName', 'companyWebsite', 'industry', 'companySize', 'foundedYear', 'companyDescription']
        for field in fields_to_update:
            if field in data:
                update_data[field] = data[field]
        
        print(f"📋 Updating profile with data: {update_data}")
        print(f"📋 Company fields being saved: companyName={update_data.get('companyName')}, industry={update_data.get('industry')}, companySize={update_data.get('companySize')}")
        
        # Convert string ID to ObjectId
        try:
            user_object_id = ObjectId(current_user_id)
        except Exception as e:
            print(f"Invalid user ID format: {current_user_id}, error: {e}")
            return jsonify({"error": "Invalid user ID format"}), 400
        
        result = users_collection.update_one(
            {'_id': user_object_id},
            {'$set': update_data}
        )
        
        print(f"📋 Update result: matched={result.matched_count}, modified={result.modified_count}")
        
        if result.matched_count > 0:
            # Also update resume profile for job seekers
            resumes_collection = db.resumes
            resume_update_data = {
                'updatedAt': datetime.utcnow()
            }
            
            for field in fields_to_update:
                if field in data:
                    resume_update_data[field] = data[field]
            
            resumes_collection.update_one(
                {'userId': user_object_id},
                {'$set': resume_update_data}
            )
            
            print(f"✅ Profile updated successfully for user {current_user_id}")
            return jsonify({
                "success": True,
                "message": "Profile updated successfully",
                "modified_count": result.modified_count
            }), 200
        else:
            print(f"❌ User not found for ID: {current_user_id}")
            return jsonify({"error": "User not found"}), 404
        
    except Exception as e:
        print(f"Error updating user profile: {e}")
        return jsonify({"error": "An error occurred while updating profile"}), 500

@user_profile_routes.route("/company-profile", methods=["PUT"])
@jwt_required()
def update_company_profile():
    """Update company profile information for recruiters"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        print(f"Company profile update request for user {current_user_id}: {data}")
        db = get_db()
        users_collection = db.users
        
        # Convert string ID to ObjectId
        try:
            user_object_id = ObjectId(current_user_id)
        except Exception as e:
            print(f"Invalid user ID format: {current_user_id}, error: {e}")
            return jsonify({"error": "Invalid user ID format"}), 400
        
        user = users_collection.find_one({'_id': user_object_id})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Check if user is a recruiter
        if user.get('userType') != 'recruiter':
            return jsonify({"error": "Only recruiters can update company profiles"}), 403
        
        # Update company profile
        update_data = {
            'updatedAt': datetime.utcnow()
        }
        
        # Add company fields that are provided
        company_fields = ['companyName', 'location', 'industry', 'companyWebsite', 'phone', 'companySize', 'foundedYear', 'companyDescription']
        for field in company_fields:
            if field in data:
                update_data[field] = data[field]
        
        result = users_collection.update_one(
            {'_id': user_object_id},
            {'$set': update_data}
        )
        
        if result.modified_count > 0:
            print(f"Company profile updated successfully for user {current_user_id}")
            return jsonify({
                "success": True,
                "message": "Company profile updated successfully"
            }), 200
        else:
            print(f"No changes made to company profile for user {current_user_id}")
            return jsonify({"error": "No changes made to company profile"}), 400
            
    except Exception as e:
        print(f"Error updating company profile: {e}")
        return jsonify({"error": "An error occurred while updating company profile"}), 500
