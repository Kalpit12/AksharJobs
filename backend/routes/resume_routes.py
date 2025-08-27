from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import uuid
from werkzeug.utils import secure_filename
import google.generativeai as genai
from services.resume_service import ResumeService
from models.user_model import User
from utils.db import get_db
from models.user_model import users_collection
import logging
from datetime import datetime
from bson import ObjectId

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

resume_bp = Blueprint('resume', __name__)

# Configure Gemini AI
def configure_gemini():
    try:
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            logger.error("GEMINI_API_KEY not found in environment variables")
            return None
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        return model
    except Exception as e:
        logger.error(f"Error configuring Gemini: {str(e)}")
        return None

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@resume_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_resume():
    """Upload and process resume with AI analysis"""
    try:
        current_user_id = get_jwt_identity()
        db = get_db()
        user = User.get_by_id(db, current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if file is present
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file provided'}), 400
        
        file = request.files['resume']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Only PDF, DOCX, and DOC files are allowed'}), 400
        
        # Create uploads directory if it doesn't exist
        upload_dir = os.path.join(current_app.root_path, 'uploads', 'resumes')
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{current_user_id}_{uuid.uuid4().hex}.{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save file
        file.save(file_path)
        logger.info(f"Resume saved to: {file_path}")
        
        # Process resume with AI (or basic processing if AI is not available)
        # Check if AI service is available
        gemini_model = None
        try:
            from app import gemini_model
        except:
            pass
        
        # Enable AI extraction for accurate data
        # gemini_model = None  # Comment this out to enable AI
        
        ai_recommendations = None
        
        if gemini_model:
            try:
                logger.info("AI service available, processing resume with Gemini for accurate extraction")
                resume_service = ResumeService(gemini_model)
                result = resume_service.process_resume(file_path, file_extension)
                if result:
                    resume_data, ai_recommendations = result
                    logger.info(f"✅ AI extraction successful - Data structure: {list(resume_data.keys()) if resume_data else 'None'}")
                    if resume_data:
                        logger.info(f"📋 Extracted: {len(resume_data.get('experience', []))} experience entries, {len(resume_data.get('education', []))} education entries")
                else:
                    logger.warning("AI extraction returned no data, falling back to text extraction")
                    resume_data = None
                    
            except Exception as ai_error:
                logger.error(f"AI processing failed: {str(ai_error)}")
                resume_data = None
                ai_recommendations = None
        else:
            # Force fallback extraction for testing
            logger.info("Using fallback extraction method")
            try:
                from services.resume_service import ResumeService
                resume_service = ResumeService(None)  # No AI model for fallback
                
                # Extract text first
                file_extension = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
                logger.info(f"Processing file: {file.filename}, extension: {file_extension}")
                
                text_content = resume_service._extract_text(file_path, file_extension)
                logger.info(f"Text extraction result - Content length: {len(text_content) if text_content else 0}")
                logger.info(f"Text extraction result - First 200 chars: {text_content[:200] if text_content else 'None'}")
                
                if text_content:
                    resume_data = resume_service._fallback_extraction(text_content)
                    logger.info(f"Fallback extraction result: {resume_data is not None}")
                    if resume_data:
                        logger.info(f"Fallback skills: {resume_data.get('skills', {})}")
                        logger.info(f"Fallback personal info: {resume_data.get('personal_info', {})}")
                else:
                    logger.error("Text extraction failed - no content returned")
                    resume_data = None
                    
            except Exception as fallback_error:
                logger.error(f"Fallback extraction failed: {str(fallback_error)}")
                import traceback
                logger.error(f"Traceback: {traceback.format_exc()}")
                resume_data = None
        
        if not resume_data:
            logger.error("Resume processing failed - no data returned")
            return jsonify({'error': 'Failed to process resume'}), 500
        
        # Update user profile with resume data
        update_data = {
            'resume_file_path': file_path,
            'resume_data': resume_data,
            'resume_uploaded_at': datetime.now().isoformat()
        }
        
        # Add AI recommendations if available
        if ai_recommendations:
            update_data['ai_recommendations'] = ai_recommendations
            logger.info("AI recommendations stored with resume data")
        
        success = User.update_profile(db, current_user_id, update_data)
        if not success:
            return jsonify({'error': 'Failed to update user profile'}), 500
        
        # Debug: Verify the data was saved
        logger.info(f"Profile update success: {success}")
        saved_profile = users_collection.find_one({'_id': current_user_id})
        if saved_profile:
            logger.info(f"Saved profile keys: {list(saved_profile.keys())}")
            logger.info(f"Has resume_data: {'resume_data' in saved_profile}")
            if 'resume_data' in saved_profile:
                logger.info(f"Saved resume_data keys: {list(saved_profile['resume_data'].keys())}")
                logger.info(f"Saved skills: {saved_profile['resume_data'].get('skills')}")
        
        # Clean up uploaded file
        try:
            os.remove(file_path)
        except:
            pass  # File cleanup is not critical
        
        response_data = {
            'message': 'Resume uploaded and processed successfully',
            'resume_data': resume_data
        }
        
        # Add AI recommendations in response if available
        if ai_recommendations:
            response_data['ai_recommendations'] = ai_recommendations
        
        # Debug logging
        logger.info(f"Response data structure:")
        logger.info(f"  - resume_data type: {type(resume_data)}")
        logger.info(f"  - resume_data keys: {resume_data.keys() if isinstance(resume_data, dict) else 'Not a dict'}")
        logger.info(f"  - resume_data.skills: {resume_data.get('skills') if isinstance(resume_data, dict) else 'No skills'}")
        logger.info(f"  - resume_data.skills type: {type(resume_data.get('skills')) if isinstance(resume_data, dict) else 'N/A'}")
        logger.info(f"  - ai_recommendations present: {ai_recommendations is not None}")
        
        return jsonify(response_data), 200
        
    except Exception as e:
        logger.error(f"Error in resume upload: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@resume_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_resume_profile():
    """Get user's resume profile data"""
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"Profile endpoint - JWT Identity: {current_user_id}")
        
        if not current_user_id:
            logger.error("Profile endpoint - No user ID from JWT")
            return jsonify({'error': 'Invalid JWT token - no user ID'}), 401
        
        db = get_db()
        
        # Convert string user ID to ObjectId for MongoDB query
        if not ObjectId.is_valid(current_user_id):
            logger.error(f"Profile endpoint - Invalid user ID format: {current_user_id}")
            return jsonify({'error': 'Invalid user ID format'}), 400
        
        user_object_id = ObjectId(current_user_id)
        
        # Get user profile where AI-processed resume data is stored
        user_profile = users_collection.find_one({'_id': user_object_id})
        
        # Debug logging for profile endpoint
        logger.info(f"Profile endpoint - User ID: {current_user_id}")
        logger.info(f"Profile endpoint - User profile found: {user_profile is not None}")
        if user_profile:
            logger.info(f"Profile endpoint - User profile keys: {list(user_profile.keys())}")
            logger.info(f"Profile endpoint - Has resume_data: {'resume_data' in user_profile}")
            if 'resume_data' in user_profile:
                resume_data = user_profile['resume_data']
                logger.info(f"Profile endpoint - Resume data keys: {list(resume_data.keys())}")
                logger.info(f"Profile endpoint - Resume skills: {resume_data.get('skills')}")
        
        if user_profile and 'resume_data' in user_profile:
            # Return the AI-processed resume data
            resume_data = user_profile['resume_data']
            profile_data = {
                'resume_data': resume_data,
                'uploaded_at': user_profile.get('resume_uploaded_at'),
                'is_default': False,
                'profile_completed': True
            }
            
            logger.info(f"Profile endpoint - Returning resume data successfully")
            return jsonify(profile_data), 200
        else:
            # Return a welcome message for new users
            welcome_profile = {
                'resume_data': {
                    'personal_info': {
                        'name': 'Welcome to AksharJobs!',
                        'email': 'Complete your profile to get started',
                        'phone': '',
                        'location': {}
                    },
                    'summary': 'Welcome to AksharJobs! Complete your profile to get started with AI-powered job matching.',
                    'skills': {
                        "technical_skills": [],
                        "soft_skills": [],
                        "languages": []
                    },
                    'experience': [],
                    'education': [],
                    'projects': [],
                    'certifications': [],
                    'achievements': []
                },
                'uploaded_at': None,
                'is_default': True,
                'profile_completed': False
            }
            
            logger.info(f"Profile endpoint - Returning welcome profile for new user")
            return jsonify(welcome_profile), 200
        
    except Exception as e:
        logger.error(f"Error getting resume profile: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@resume_bp.route('/test', methods=['GET'])
def test_resume_endpoint():
    """Test endpoint without JWT requirement"""
    return jsonify({
        'message': 'Resume endpoint is working!',
        'timestamp': datetime.now().isoformat()
    }), 200

@resume_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    """Get AI-generated recommendations based on resume"""
    try:
        current_user_id = get_jwt_identity()
        db = get_db()
        user_profile = users_collection.find_one({'_id': current_user_id})
        
        # Try to get user's resume data from user profile
        if user_profile and 'resume_data' in user_profile:
            resume_data = user_profile['resume_data']
            ai_recommendations = user_profile.get('ai_recommendations', {})
            
            # If we have AI recommendations, return them
            if ai_recommendations:
                logger.info("Returning stored AI recommendations")
                return jsonify(ai_recommendations), 200
            
            # Otherwise, generate new recommendations based on resume data
            gemini_model = configure_gemini()
            if gemini_model and resume_data:
                try:
                    logger.info("Generating new AI recommendations")
                    resume_service = ResumeService(gemini_model)
                    new_recommendations = resume_service.generate_recommendations(resume_data)
                    
                    # Store the new recommendations
                    User.update_profile(db, current_user_id, {'ai_recommendations': new_recommendations})
                    
                    logger.info("New AI recommendations generated and stored")
                    return jsonify(new_recommendations), 200
                except Exception as ai_error:
                    logger.error(f"Failed to generate AI recommendations: {str(ai_error)}")
            
            # Return structured recommendations based on actual resume data
            skills = resume_data.get('skills', {})
            technical_skills = skills.get('technical_skills', [])
            soft_skills = skills.get('soft_skills', [])
            experience = resume_data.get('experience', [])
            education = resume_data.get('education', [])
            personal_info = resume_data.get('personal_info', {})
            
            personalized_recommendations = {
                "career_path": {
                    "suggested_roles": [
                        f"Senior {technical_skills[0] if technical_skills else 'Software'} Developer" if experience else "Junior Developer",
                        "Technical Lead" if len(experience) > 3 else "Full Stack Developer",
                        "Product Manager" if soft_skills else "Backend Developer"
                    ],
                    "next_steps": [
                        "Update your skills with the latest technologies",
                        "Apply to companies that value your experience",
                        "Network with professionals in your field"
                    ]
                },
                "skill_development": {
                    "recommended_skills": [
                        "Cloud Computing (AWS/Azure)" if len(technical_skills) > 0 else "Web Development",
                        "Machine Learning" if "Python" in technical_skills else "React.js",
                        "DevOps" if "Docker" in technical_skills else "Node.js"
                    ],
                    "learning_resources": [
                        "Coursera - Complete Web Development Bootcamp",
                        "Udemy - Advanced React Patterns",
                        "LinkedIn Learning - Career Development"
                    ]
                },
                "job_search": {
                    "target_companies": [
                        "TechCorp Solutions",
                        "Innovate Kenya",
                        "Startup Kenya"
                    ],
                    "industry_focus": [
                        "Technology",
                        "E-commerce",
                        "FinTech"
                    ],
                    "salary_range": "KSh 150,000 - 300,000"
                },
                "networking": {
                    "professional_groups": [
                        "Kenya Tech Community",
                        "Nairobi Developers",
                        "African Software Engineers"
                    ]
                }
            }
            
            return jsonify(personalized_recommendations), 200
        else:
            # Return default recommendations for new users
            default_recommendations = {
                "career_path": {
                    "suggested_roles": [
                        "Junior Software Developer",
                        "Frontend Developer",
                        "Backend Developer"
                    ],
                    "next_steps": [
                        "Upload your resume to get personalized recommendations",
                        "Complete your profile information",
                        "Add your skills and experience"
                    ]
                },
                "skill_development": {
                    "recommended_skills": [
                        "JavaScript",
                        "Python",
                        "React.js",
                        "Node.js"
                    ],
                    "learning_resources": [
                        "FreeCodeCamp - JavaScript Algorithms",
                        "The Odin Project - Full Stack JavaScript",
                        "Harvard CS50 - Introduction to Computer Science"
                    ]
                },
                "job_search": {
                    "target_companies": [
                        "Start with local tech companies",
                        "Consider remote opportunities",
                        "Look for internship positions"
                    ],
                    "industry_focus": [
                        "Technology",
                        "Startups",
                        "Non-profit organizations"
                    ],
                    "salary_range": "KSh 50,000 - 150,000"
                },
                "networking": {
                    "professional_groups": [
                        "Meetup.com - Tech events in your area",
                        "LinkedIn groups for developers",
                        "GitHub community"
                    ]
                }
            }
            return jsonify(default_recommendations), 200
        
    except Exception as e:
        logger.error(f"Error generating recommendations: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@resume_bp.route('/debug-profile', methods=['GET'])
@jwt_required()
def debug_resume_profile():
    """Debug endpoint to inspect raw resume data"""
    try:
        current_user_id = get_jwt_identity()
        db = get_db()
        
        user_profile = users_collection.find_one({'_id': current_user_id})
        
        if user_profile and 'resume_data' in user_profile:
            resume_data = user_profile['resume_data']
            
            # Return raw data for inspection
            return jsonify({
                'debug_info': {
                    'resume_data_type': str(type(resume_data)),
                    'resume_data_keys': list(resume_data.keys()) if isinstance(resume_data, dict) else 'Not a dict',
                    'skills_exists': 'skills' in resume_data if isinstance(resume_data, dict) else False,
                    'skills_type': str(type(resume_data.get('skills'))) if isinstance(resume_data, dict) else 'N/A',
                    'skills_keys': list(resume_data.get('skills').keys()) if isinstance(resume_data, dict) and resume_data.get('skills') and isinstance(resume_data.get('skills'), dict) else 'N/A'
                },
                'raw_resume_data': resume_data
            }), 200
        else:
            return jsonify({'error': 'No resume data found'}), 404
            
    except Exception as e:
        logger.error(f"Error in debug endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500