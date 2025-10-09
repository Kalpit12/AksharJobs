#!/usr/bin/env python3
"""
Modern Resume Routes with Enhanced AI Integration
Clean, fast, and reliable resume processing
"""

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import uuid
import logging
from datetime import datetime
from bson import ObjectId

from services.new_resume_service import ModernResumeService
from services.personalized_recommendations import PersonalizedRecommendationService
from models.user_model import User
from utils.db import get_db

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

modern_resume_bp = Blueprint('modern_resume', __name__)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'txt'}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@modern_resume_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_resume():
    """Modern resume upload with AI processing"""
    try:
        logger.info("🚀 === MODERN RESUME UPLOAD STARTED ===")
        
        # Get user ID from JWT
        current_user_id = get_jwt_identity()
        logger.info(f"👤 User ID: {current_user_id}")
        
        # Get database connection
        db = get_db()
        if db is None:
            logger.error("❌ Database connection failed")
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Test database connection
        try:
            db.command('ping')
            logger.info("✅ Database connection verified")
        except Exception as e:
            logger.error(f"❌ Database ping failed: {e}")
            return jsonify({'error': 'Database connection test failed'}), 500
        
        # Get user information
        try:
            user = User.get_by_id(db, current_user_id)
            if not user:
                logger.error(f"❌ User not found: {current_user_id}")
                return jsonify({'error': 'User not found'}), 404
            
            logger.info(f"✅ User found: {user.get('firstName', 'Unknown')} {user.get('lastName', 'Unknown')}")
        except Exception as e:
            logger.error(f"❌ User lookup failed: {e}")
            return jsonify({'error': 'User lookup failed'}), 500
        
        # Check for resume file
        if 'resume' not in request.files:
            logger.error("❌ No resume file in request")
            return jsonify({'error': 'No resume file provided'}), 400
        
        file = request.files['resume']
        if file.filename == '':
            logger.error("❌ Empty filename")
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            logger.error(f"❌ Invalid file type: {file.filename}")
            return jsonify({'error': 'Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed'}), 400
        
        # Create uploads directory
        upload_dir = os.path.join(current_app.root_path, 'uploads', 'resumes')
        os.makedirs(upload_dir, exist_ok=True)
        logger.info(f"📁 Upload directory: {upload_dir}")
        
        # Generate unique filename
        try:
            file_extension = file.filename.rsplit('.', 1)[1].lower()
            unique_filename = f"{current_user_id}_{uuid.uuid4().hex}.{file_extension}"
            file_path = os.path.join(upload_dir, unique_filename)
            logger.info(f"📝 File extension: {file_extension}")
        except IndexError:
            logger.error(f"❌ No file extension found: {file.filename}")
            return jsonify({'error': 'File must have a valid extension'}), 400
        
        # Save uploaded file
        try:
            file.save(file_path)
            file_size = os.path.getsize(file_path)
            logger.info(f"💾 File saved: {file_path} ({file_size} bytes)")
        except Exception as e:
            logger.error(f"❌ File save failed: {e}")
            return jsonify({'error': 'Failed to save uploaded file'}), 500
        
        # Process resume with modern service
        try:
            logger.info("🤖 Starting modern resume processing...")
            
            # Get Gemini API key from environment
            gemini_api_key = os.getenv('GEMINI_API_KEY')
            
            # Create modern resume service
            resume_service = ModernResumeService(gemini_api_key)
            logger.info("✅ ModernResumeService created successfully")
            
            # Process the resume
            resume_data = resume_service.process_resume(file_path, file_extension)
            logger.info("✅ Resume processing completed")
            
            # Log processing method used
            processing_method = resume_data.get('processing_info', {}).get('extraction_method', 'unknown')
            ai_processed = resume_data.get('processing_info', {}).get('ai_processed', False)
            logger.info(f"📊 Processing method: {processing_method} (AI: {ai_processed})")
            
        except Exception as e:
            logger.error(f"❌ Resume processing failed: {e}")
            # Clean up uploaded file
            try:
                os.remove(file_path)
            except:
                pass
            
            return jsonify({'error': 'Resume processing failed', 'details': str(e)}), 500
        
        # Update user profile with resume data
        try:
            update_data = {
                'resume_file_path': file_path,
                'resume_data': resume_data,
                'resume_uploaded_at': datetime.now().isoformat(),
                'resume_processing_method': processing_method,
                'resume_ai_processed': ai_processed,
                'resume_published': False  # Default to unpublished
            }
            
            # Add AI recommendations if available
            if 'ai_recommendations' in resume_data:
                update_data['ai_recommendations'] = resume_data['ai_recommendations']
            
            success = User.update_profile(db, current_user_id, update_data)
            if not success:
                logger.error(f"❌ Failed to update user profile for user: {current_user_id}")
                return jsonify({'error': 'Failed to update user profile'}), 500
            
            logger.info("✅ User profile updated successfully")
            
        except Exception as e:
            logger.error(f"❌ Profile update failed: {e}")
            return jsonify({'error': 'Profile update failed'}), 500
        
        # Clean up uploaded file (we only need the processed data)
        try:
            os.remove(file_path)
            logger.info("🧹 Temporary file cleaned up")
        except Exception as e:
            logger.warning(f"⚠️ File cleanup failed: {e}")
            # Don't fail the upload for cleanup issues
        
        # Prepare response
        response_data = {
            'message': 'Resume uploaded and processed successfully!',
            'processing_method': processing_method,
            'ai_processed': ai_processed,
            'resume_data': resume_data,
            'file_info': {
                'original_name': file.filename,
                'file_size': file_size,
                'file_type': file_extension.upper()
            }
        }
        
        # Add AI recommendations if available
        if 'ai_recommendations' in resume_data:
            response_data['ai_recommendations'] = resume_data['ai_recommendations']
        
        logger.info(f"🎉 Resume upload completed successfully for user: {current_user_id}")
        return jsonify(response_data), 200
        
    except Exception as e:
        logger.error(f"❌ Unexpected error in resume upload: {e}")
        import traceback
        logger.error(f"📋 Full traceback: {traceback.format_exc()}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@modern_resume_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_resume_profile():
    """Get user's modern resume profile"""
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"👤 Getting profile for user: {current_user_id}")
        
        if not current_user_id:
            return jsonify({'error': 'Invalid JWT token'}), 401
        
        # Get database connection
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Convert user ID to ObjectId
        if not ObjectId.is_valid(current_user_id):
            return jsonify({'error': 'Invalid user ID format'}), 400
        
        user_object_id = ObjectId(current_user_id)
        user_profile = db.users.find_one({'_id': user_object_id})
        
        if user_profile and 'resume_data' in user_profile:
            # User has resume data
            resume_data = user_profile['resume_data']
            profile_data = {
                'resume_data': resume_data,
                'uploaded_at': user_profile.get('resume_uploaded_at'),
                'processing_method': user_profile.get('resume_processing_method', 'unknown'),
                'ai_processed': user_profile.get('resume_ai_processed', False),
                'is_default': False,
                'profile_completed': True
            }
            
            # Add AI recommendations if available
            if 'ai_recommendations' in user_profile:
                profile_data['ai_recommendations'] = user_profile['ai_recommendations']
            
            logger.info(f"✅ Returning resume data for user: {current_user_id}")
            return jsonify(profile_data), 200
        else:
            # New user - return welcome profile
            welcome_profile = {
                'resume_data': {
                    'personal_info': {
                        'name': 'Welcome to AksharJobs!',
                        'email': 'Complete your profile to get started',
                        'phone': '',
                        'location': '',
                        'linkedin': ''
                    },
                    'summary': 'Welcome to AksharJobs! Upload your resume to get started with AI-powered job matching and career insights.',
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
                'processing_method': 'none',
                'ai_processed': False,
                'is_default': True,
                'profile_completed': False
            }
            
            logger.info(f"👋 Returning welcome profile for new user: {current_user_id}")
            return jsonify(welcome_profile), 200
        
    except Exception as e:
        logger.error(f"❌ Error getting resume profile: {e}")
        import traceback
        logger.error(f"📋 Full traceback: {traceback.format_exc()}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@modern_resume_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_ai_recommendations():
    """Get AI-powered career recommendations"""
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"🤖 Getting AI recommendations for user: {current_user_id}")
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        user_profile = db.users.find_one({'_id': ObjectId(current_user_id)})
        
        if user_profile and 'ai_recommendations' in user_profile:
            # Return stored AI recommendations
            logger.info("✅ Returning stored AI recommendations")
            return jsonify(user_profile['ai_recommendations']), 200
        else:
            # Generate new recommendations if possible
            gemini_api_key = os.getenv('GEMINI_API_KEY')
            if gemini_api_key and user_profile and 'resume_data' in user_profile:
                try:
                    logger.info("🔄 Generating new AI recommendations...")
                    resume_service = ModernResumeService(gemini_api_key)
                    resume_data = user_profile['resume_data']
                    
                    # Generate recommendations
                    recommendations = resume_service._generate_ai_recommendations(resume_data)
                    
                    # Store new recommendations
                    User.update_profile(db, current_user_id, {'ai_recommendations': recommendations})
                    
                    logger.info("✅ New AI recommendations generated and stored")
                    return jsonify(recommendations), 200
                    
                except Exception as e:
                    logger.warning(f"⚠️ AI recommendations generation failed: {e}")
            
            # Return fallback recommendations
            if user_profile and 'resume_data' in user_profile:
                resume_service = ModernResumeService()
                resume_data = user_profile['resume_data']
                fallback_recommendations = resume_service._generate_fallback_recommendations(resume_data)
                
                logger.info("🔄 Returning fallback recommendations")
                return jsonify(fallback_recommendations), 200
            else:
                # Default recommendations for new users
                default_recommendations = {
                    "career_path": {
                        "suggested_roles": ["Junior Software Developer", "Frontend Developer", "Backend Developer"],
                        "next_steps": ["Upload your resume to get personalized recommendations", "Complete your profile", "Add your skills"]
                    },
                    "skill_development": {
                        "recommended_skills": ["JavaScript", "Python", "React.js", "Node.js"],
                        "learning_resources": ["FreeCodeCamp", "The Odin Project", "Harvard CS50"]
                    },
                    "job_search": {
                        "target_companies": ["Start with local tech companies", "Consider remote opportunities"],
                        "salary_range": "KSh 50,000 - 150,000",
                        "industry_focus": ["Technology", "Startups"]
                    }
                }
                
                logger.info("👋 Returning default recommendations for new user")
                return jsonify(default_recommendations), 200
        
    except Exception as e:
        logger.error(f"❌ Error getting recommendations: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@modern_resume_bp.route('/test', methods=['GET'])
def test_modern_resume_endpoint():
    """Test endpoint for modern resume service"""
    try:
        # Test ModernResumeService creation
        resume_service = ModernResumeService()
        logger.info("✅ ModernResumeService created successfully in test endpoint")
        
        return jsonify({
            'message': 'Modern Resume endpoint is working! 🚀',
            'service': 'ModernResumeService created successfully',
            'features': [
                'AI-powered resume processing',
                'Intelligent fallback extraction',
                'Fast text processing',
                'Multiple file format support'
            ],
            'timestamp': datetime.now().isoformat()
        }), 200
    except Exception as e:
        logger.error(f"❌ Test endpoint error: {str(e)}")
        return jsonify({
            'message': 'Modern Resume endpoint has issues',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@modern_resume_bp.route('/health', methods=['GET'])
def modern_resume_health():
    """Health check for modern resume service"""
    try:
        # Test service creation
        resume_service = ModernResumeService()
        
        # Test database connection
        db = get_db()
        db_status = "connected" if db is not None else "disconnected"
        
        # Test Gemini API if available
        gemini_api_key = os.getenv('GEMINI_API_KEY')
        gemini_status = "available" if gemini_api_key else "not configured"
        
        return jsonify({
            'status': 'healthy',
            'service': 'Modern Resume Service',
            'database': db_status,
            'gemini_ai': gemini_status,
            'features': {
                'ai_processing': gemini_api_key is not None,
                'fallback_processing': True,
                'multiple_formats': True,
                'fast_extraction': True
            },
            'timestamp': datetime.now().isoformat()
        }), 200
    except Exception as e:
        logger.error(f"❌ Health check failed: {e}")
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@modern_resume_bp.route('/update-skills', methods=['PUT'])
@jwt_required()
def update_skills():
    """Update user's skills in resume data"""
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"🔧 Updating skills for user: {current_user_id}")
        
        data = request.get_json()
        if not data or 'skills' not in data:
            return jsonify({'error': 'Skills data is required'}), 400
        
        skills = data['skills']
        
        # Validate skills structure
        if not isinstance(skills, dict):
            return jsonify({'error': 'Skills must be an object'}), 400
        
        required_categories = ['technical_skills', 'soft_skills', 'languages']
        for category in required_categories:
            if category not in skills:
                skills[category] = []
            elif not isinstance(skills[category], list):
                return jsonify({'error': f'{category} must be an array'}), 400
        
        # Get database connection
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Convert user ID to ObjectId
        if not ObjectId.is_valid(current_user_id):
            return jsonify({'error': 'Invalid user ID format'}), 400
        
        user_object_id = ObjectId(current_user_id)
        
        # Update user's resume data with new skills
        update_result = db.users.update_one(
            {'_id': user_object_id},
            {
                '$set': {
                    'resume_data.skills': skills,
                    'updatedAt': datetime.now().isoformat()
                }
            }
        )
        
        if update_result.modified_count > 0:
            logger.info(f"✅ Skills updated successfully for user: {current_user_id}")
            return jsonify({
                'success': True,
                'message': 'Skills updated successfully',
                'skills': skills
            }), 200
        else:
            logger.warning(f"⚠️ No changes made to skills for user: {current_user_id}")
            return jsonify({'error': 'No changes made or user not found'}), 400
        
    except Exception as e:
        logger.error(f"❌ Error updating skills: {e}")
        import traceback
        logger.error(f"📋 Full traceback: {traceback.format_exc()}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@modern_resume_bp.route('/update-personal', methods=['PUT'])
@jwt_required()
def update_personal_info():
    """Update user's personal information"""
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"🔧 Updating personal info for user: {current_user_id}")
        
        data = request.get_json()
        if not data or 'personal_info' not in data:
            return jsonify({'error': 'Personal info data is required'}), 400
        
        personal_info = data['personal_info']
        
        # Get database connection
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        user_object_id = ObjectId(current_user_id)
        
        # Update user's personal info
        update_result = db.users.update_one(
            {'_id': user_object_id},
            {
                '$set': {
                    'resume_data.personal_info': personal_info,
                    'updatedAt': datetime.now().isoformat()
                }
            }
        )
        
        if update_result.modified_count > 0:
            logger.info(f"✅ Personal info updated successfully for user: {current_user_id}")
            return jsonify({
                'success': True,
                'message': 'Personal information updated successfully',
                'personal_info': personal_info
            }), 200
        else:
            return jsonify({'error': 'No changes made or user not found'}), 400
        
    except Exception as e:
        logger.error(f"❌ Error updating personal info: {e}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@modern_resume_bp.route('/update-experience', methods=['PUT'])
@jwt_required()
def update_experience():
    """Update user's experience"""
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"🔧 Updating experience for user: {current_user_id}")
        
        data = request.get_json()
        if not data or 'experience' not in data:
            return jsonify({'error': 'Experience data is required'}), 400
        
        experience = data['experience']
        
        if not isinstance(experience, list):
            return jsonify({'error': 'Experience must be an array'}), 400
        
        db = get_db()
        user_object_id = ObjectId(current_user_id)
        
        update_result = db.users.update_one(
            {'_id': user_object_id},
            {
                '$set': {
                    'resume_data.experience': experience,
                    'updatedAt': datetime.now().isoformat()
                }
            }
        )
        
        if update_result.modified_count > 0:
            logger.info(f"✅ Experience updated successfully for user: {current_user_id}")
            return jsonify({
                'success': True,
                'message': 'Experience updated successfully',
                'experience': experience
            }), 200
        else:
            return jsonify({'error': 'No changes made or user not found'}), 400
        
    except Exception as e:
        logger.error(f"❌ Error updating experience: {e}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@modern_resume_bp.route('/update-education', methods=['PUT'])
@jwt_required()
def update_education():
    """Update user's education"""
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"🔧 Updating education for user: {current_user_id}")
        
        data = request.get_json()
        if not data or 'education' not in data:
            return jsonify({'error': 'Education data is required'}), 400
        
        education = data['education']
        
        if not isinstance(education, list):
            return jsonify({'error': 'Education must be an array'}), 400
        
        db = get_db()
        user_object_id = ObjectId(current_user_id)
        
        update_result = db.users.update_one(
            {'_id': user_object_id},
            {
                '$set': {
                    'resume_data.education': education,
                    'updatedAt': datetime.now().isoformat()
                }
            }
        )
        
        if update_result.modified_count > 0:
            logger.info(f"✅ Education updated successfully for user: {current_user_id}")
            return jsonify({
                'success': True,
                'message': 'Education updated successfully',
                'education': education
            }), 200
        else:
            return jsonify({'error': 'No changes made or user not found'}), 400
        
    except Exception as e:
        logger.error(f"❌ Error updating education: {e}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@modern_resume_bp.route('/update-projects', methods=['PUT'])
@jwt_required()
def update_projects():
    """Update user's projects"""
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"🔧 Updating projects for user: {current_user_id}")
        
        data = request.get_json()
        if not data or 'projects' not in data:
            return jsonify({'error': 'Projects data is required'}), 400
        
        projects = data['projects']
        
        if not isinstance(projects, list):
            return jsonify({'error': 'Projects must be an array'}), 400
        
        db = get_db()
        user_object_id = ObjectId(current_user_id)
        
        update_result = db.users.update_one(
            {'_id': user_object_id},
            {
                '$set': {
                    'resume_data.projects': projects,
                    'updatedAt': datetime.now().isoformat()
                }
            }
        )
        
        if update_result.modified_count > 0:
            logger.info(f"✅ Projects updated successfully for user: {current_user_id}")
            return jsonify({
                'success': True,
                'message': 'Projects updated successfully',
                'projects': projects
            }), 200
        else:
            return jsonify({'error': 'No changes made or user not found'}), 400
        
    except Exception as e:
        logger.error(f"❌ Error updating projects: {e}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@modern_resume_bp.route('/personalized-job-recommendations', methods=['GET'])
@jwt_required()
def get_personalized_job_recommendations():
    """Get personalized job recommendations based on user's resume"""
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"🎯 Getting personalized job recommendations for user: {current_user_id}")
        
        # Get query parameters
        limit = request.args.get('limit', 10, type=int)
        force_refresh = request.args.get('refresh', 'false').lower() == 'true'
        category = request.args.get('category', None)
        
        # Initialize recommendation service
        gemini_api_key = os.getenv('GEMINI_API_KEY')
        rec_service = PersonalizedRecommendationService(gemini_api_key)
        
        # Check for stored recommendations first (unless force refresh)
        if not force_refresh and not category:
            stored_recs = rec_service.get_stored_recommendations(current_user_id)
            if stored_recs:
                logger.info("✅ Returning stored personalized recommendations")
                return jsonify(stored_recs), 200
        
        # Generate new recommendations
        if category:
            recommendations = rec_service.get_recommendations_by_category(current_user_id, category)
        else:
            recommendations = rec_service.get_personalized_job_recommendations(current_user_id, limit)
        
        return jsonify(recommendations), 200
        
    except Exception as e:
        logger.error(f"❌ Error getting personalized job recommendations: {e}")
        return jsonify({'error': 'Failed to get recommendations', 'details': str(e)}), 500

@modern_resume_bp.route('/career-progression', methods=['GET'])
@jwt_required()
def get_career_progression():
    """Get career progression recommendations"""
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"📈 Getting career progression for user: {current_user_id}")
        
        gemini_api_key = os.getenv('GEMINI_API_KEY')
        rec_service = PersonalizedRecommendationService(gemini_api_key)
        
        progression_data = rec_service.get_career_progression_recommendations(current_user_id)
        
        return jsonify(progression_data), 200
        
    except Exception as e:
        logger.error(f"❌ Error getting career progression: {e}")
        return jsonify({'error': 'Failed to get career progression', 'details': str(e)}), 500

@modern_resume_bp.route('/refresh-recommendations', methods=['POST'])
@jwt_required()
def refresh_recommendations():
    """Force refresh of user recommendations"""
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"🔄 Force refreshing recommendations for user: {current_user_id}")
        
        gemini_api_key = os.getenv('GEMINI_API_KEY')
        rec_service = PersonalizedRecommendationService(gemini_api_key)
        
        recommendations = rec_service.refresh_recommendations(current_user_id)
        
        return jsonify({
            'message': 'Recommendations refreshed successfully',
            'recommendations': recommendations
        }), 200
        
    except Exception as e:
        logger.error(f"❌ Error refreshing recommendations: {e}")
        return jsonify({'error': 'Failed to refresh recommendations', 'details': str(e)}), 500

@modern_resume_bp.route('/publish', methods=['POST'])
@jwt_required()
def publish_resume():
    """Publish user's resume to make it visible to recruiters"""
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"📢 Publishing resume for user: {current_user_id}")
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Update resume status to published
        result = db.users.update_one(
            {'_id': ObjectId(current_user_id)},
            {
                '$set': {
                    'resume_published': True,
                    'resume_published_at': datetime.utcnow(),
                    'updatedAt': datetime.utcnow()
                }
            }
        )
        
        if result.modified_count > 0:
            logger.info(f"✅ Resume published for user: {current_user_id}")
            return jsonify({
                'success': True,
                'message': 'Resume published successfully',
                'published': True
            }), 200
        else:
            logger.warning(f"⚠️ No resume found to publish for user: {current_user_id}")
            return jsonify({'error': 'No resume found to publish'}), 404
            
    except Exception as e:
        logger.error(f"❌ Error publishing resume: {e}")
        return jsonify({'error': 'Failed to publish resume', 'details': str(e)}), 500

@modern_resume_bp.route('/unpublish', methods=['POST'])
@jwt_required()
def unpublish_resume():
    """Unpublish user's resume to hide it from recruiters"""
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"🔒 Unpublishing resume for user: {current_user_id}")
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Update resume status to unpublished
        result = db.users.update_one(
            {'_id': ObjectId(current_user_id)},
            {
                '$set': {
                    'resume_published': False,
                    'resume_unpublished_at': datetime.utcnow(),
                    'updatedAt': datetime.utcnow()
                }
            }
        )
        
        if result.modified_count > 0:
            logger.info(f"✅ Resume unpublished for user: {current_user_id}")
            return jsonify({
                'success': True,
                'message': 'Resume unpublished successfully',
                'published': False
            }), 200
        else:
            logger.warning(f"⚠️ No resume found to unpublish for user: {current_user_id}")
            return jsonify({'error': 'No resume found to unpublish'}), 404
            
    except Exception as e:
        logger.error(f"❌ Error unpublishing resume: {e}")
        return jsonify({'error': 'Failed to unpublish resume', 'details': str(e)}), 500

@modern_resume_bp.route('/publish-status', methods=['GET'])
@jwt_required()
def get_publish_status():
    """Get the current publish status of user's resume"""
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"📊 Getting publish status for user: {current_user_id}")
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Get resume publish status
        user = db.users.find_one(
            {'_id': ObjectId(current_user_id)},
            {'resume_published': 1, 'resume_published_at': 1, 'resume_unpublished_at': 1, 'updatedAt': 1, 'resume_data': 1}
        )
        
        if user:
            return jsonify({
                'published': user.get('resume_published', False),
                'publishedAt': user.get('resume_published_at'),
                'unpublishedAt': user.get('resume_unpublished_at'),
                'lastUpdated': user.get('updatedAt'),
                'hasResume': 'resume_data' in user and user['resume_data'] is not None
            }), 200
        else:
            return jsonify({
                'published': False,
                'message': 'User not found'
            }), 404
            
    except Exception as e:
        logger.error(f"❌ Error getting publish status: {e}")
        return jsonify({'error': 'Failed to get publish status', 'details': str(e)}), 500

@modern_resume_bp.route('/download', methods=['GET'])
@jwt_required()
def download_resume():
    """Download user's resume file"""
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"📥 Download request for user: {current_user_id}")
        
        if not current_user_id:
            return jsonify({'error': 'Invalid JWT token'}), 401
        
        # Get database connection
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Convert user ID to ObjectId
        if not ObjectId.is_valid(current_user_id):
            return jsonify({'error': 'Invalid user ID format'}), 400
        
        user_object_id = ObjectId(current_user_id)
        user_profile = db.users.find_one({'_id': user_object_id})
        
        if not user_profile or 'resume_data' not in user_profile:
            return jsonify({'error': 'No resume found'}), 404
        
        # Check if original file exists
        resume_file_path = user_profile.get('resume_file_path')
        if resume_file_path and os.path.exists(resume_file_path):
            # Serve the original file
            from flask import send_file
            return send_file(resume_file_path, as_attachment=True, download_name=f"resume_{current_user_id}.pdf")
        else:
            # Generate a PDF from the resume data
            resume_data = user_profile['resume_data']
            pdf_content = generate_resume_pdf(resume_data)
            
            from flask import Response
            return Response(
                pdf_content,
                mimetype='application/pdf',
                headers={
                    'Content-Disposition': f'attachment; filename=resume_{current_user_id}.pdf'
                }
            )
            
    except Exception as e:
        logger.error(f"❌ Error downloading resume: {e}")
        return jsonify({'error': 'Failed to download resume', 'details': str(e)}), 500

def generate_resume_pdf(resume_data):
    """Generate PDF content from resume data"""
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import inch
        from io import BytesIO
        
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
        )
        
        if resume_data.get('personal_info', {}).get('name'):
            story.append(Paragraph(resume_data['personal_info']['name'], title_style))
        
        # Contact info
        contact_info = []
        if resume_data.get('personal_info', {}).get('email'):
            contact_info.append(f"Email: {resume_data['personal_info']['email']}")
        if resume_data.get('personal_info', {}).get('phone'):
            contact_info.append(f"Phone: {resume_data['personal_info']['phone']}")
        if resume_data.get('personal_info', {}).get('location'):
            contact_info.append(f"Location: {resume_data['personal_info']['location']}")
        
        if contact_info:
            story.append(Paragraph("<br/>".join(contact_info), styles['Normal']))
            story.append(Spacer(1, 20))
        
        # Summary
        if resume_data.get('summary'):
            story.append(Paragraph("Professional Summary", styles['Heading2']))
            story.append(Paragraph(resume_data['summary'], styles['Normal']))
            story.append(Spacer(1, 20))
        
        # Skills
        if resume_data.get('skills'):
            story.append(Paragraph("Skills", styles['Heading2']))
            skills_text = []
            if resume_data['skills'].get('technical_skills'):
                skills_text.append(f"Technical: {', '.join(resume_data['skills']['technical_skills'])}")
            if resume_data['skills'].get('soft_skills'):
                skills_text.append(f"Soft Skills: {', '.join(resume_data['skills']['soft_skills'])}")
            if resume_data['skills'].get('languages'):
                skills_text.append(f"Languages: {', '.join(resume_data['skills']['languages'])}")
            
            if skills_text:
                story.append(Paragraph("<br/>".join(skills_text), styles['Normal']))
                story.append(Spacer(1, 20))
        
        # Experience
        if resume_data.get('experience'):
            story.append(Paragraph("Experience", styles['Heading2']))
            for exp in resume_data['experience']:
                exp_text = f"<b>{exp.get('title', '')}</b> - {exp.get('company', '')}"
                if exp.get('duration'):
                    exp_text += f" ({exp['duration']})"
                story.append(Paragraph(exp_text, styles['Normal']))
                if exp.get('description'):
                    story.append(Paragraph(exp['description'], styles['Normal']))
                story.append(Spacer(1, 10))
        
        # Education
        if resume_data.get('education'):
            story.append(Paragraph("Education", styles['Heading2']))
            for edu in resume_data['education']:
                edu_text = f"<b>{edu.get('degree', '')}</b> - {edu.get('institution', '')}"
                if edu.get('year'):
                    edu_text += f" ({edu['year']})"
                story.append(Paragraph(edu_text, styles['Normal']))
                story.append(Spacer(1, 10))
        
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()
        
    except ImportError:
        # Fallback: return a simple text representation
        resume_text = f"""
RESUME

Name: {resume_data.get('personal_info', {}).get('name', 'N/A')}
Email: {resume_data.get('personal_info', {}).get('email', 'N/A')}
Phone: {resume_data.get('personal_info', {}).get('phone', 'N/A')}
Location: {resume_data.get('personal_info', {}).get('location', 'N/A')}

SUMMARY
{resume_data.get('summary', 'N/A')}

SKILLS
Technical: {', '.join(resume_data.get('skills', {}).get('technical_skills', []))}
Soft Skills: {', '.join(resume_data.get('skills', {}).get('soft_skills', []))}
Languages: {', '.join(resume_data.get('skills', {}).get('languages', []))}

EXPERIENCE
{chr(10).join([f"- {exp.get('title', '')} at {exp.get('company', '')} ({exp.get('duration', '')})" for exp in resume_data.get('experience', [])])}

EDUCATION
{chr(10).join([f"- {edu.get('degree', '')} from {edu.get('institution', '')} ({edu.get('year', '')})" for edu in resume_data.get('education', [])])}
        """
        return resume_text.encode('utf-8')
    except Exception as e:
        logger.error(f"❌ Error generating PDF: {e}")
        return b"Error generating resume PDF"