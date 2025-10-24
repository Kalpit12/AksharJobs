from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import random
from bson import ObjectId
from utils.db import get_db

dashboard_routes = Blueprint('dashboard_routes', __name__)

@dashboard_routes.route('/data', methods=['GET'])
@jwt_required()
def get_dashboard_data():
    """Get comprehensive dashboard data for the current user"""
    try:
        current_user_id = get_jwt_identity()
        db = get_db()
        
        if db is None:
            return jsonify({"error": "Database connection failed"}), 500
        
        # Get user data
        users_collection = db.users
        applications_collection = db.applications
        jobs_collection = db.jobs
        
        # Convert string ID to ObjectId
        try:
            user_object_id = ObjectId(current_user_id)
        except Exception as e:
            return jsonify({"error": "Invalid user ID format"}), 400
        
        # Get user profile
        user = users_collection.find_one({'_id': user_object_id})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Get user's applications - try both ObjectId and string formats
        user_applications = list(applications_collection.find({'userId': user_object_id}))
        if not user_applications:
            # Try with string user ID
            user_applications = list(applications_collection.find({'userId': current_user_id}))
        if not user_applications:
            # Try with applicant_id field (ObjectId format)
            user_applications = list(applications_collection.find({'applicant_id': user_object_id}))
        
        # Get saved jobs
        saved_job_ids = user.get('savedJobs', [])
        saved_jobs = []
        if saved_job_ids:
            saved_jobs = list(jobs_collection.find({'_id': {'$in': [ObjectId(job_id) for job_id in saved_job_ids]}}))
        
        # Get recommended jobs (jobs that match user's preferred job titles and skills)
        user_skills = []
        
        # Safely extract skills - handle both list and string formats
        for skill_field in ['technicalSkills', 'softSkills', 'coreSkills']:
            skill_data = user.get(skill_field, [])
            if isinstance(skill_data, list):
                user_skills.extend(skill_data)
            elif isinstance(skill_data, str) and skill_data:
                # If it's a string, try to parse it or split by comma
                try:
                    import json
                    parsed = json.loads(skill_data)
                    if isinstance(parsed, list):
                        user_skills.extend(parsed)
                except:
                    # If JSON parsing fails, split by comma
                    user_skills.extend([s.strip() for s in skill_data.split(',') if s.strip()])
        
        # Get preferred job titles
        preferred_titles = []
        if user.get('preferredJobTitles'):
            titles_str = user.get('preferredJobTitles', '')
            preferred_titles = [title.strip() for title in titles_str.split(',') if title.strip()]
        
        recommended_jobs = []
        all_jobs = list(jobs_collection.find({}))
        
        # Score and filter jobs based on preferred titles and skills
        scored_jobs = []
        for job in all_jobs:
            try:
                score = 0
                job_title = job.get('title', '') or job.get('job_title', '')
                if job_title:
                    job_title = str(job_title).lower()
                else:
                    job_title = ''
                
                # Safely get job skills
                job_skills = []
                req_skills = job.get('requiredSkills', [])
                if isinstance(req_skills, list):
                    job_skills.extend(req_skills)
                skills = job.get('skills', [])
                if isinstance(skills, list):
                    job_skills.extend(skills)
            
                # Match preferred job titles
                if preferred_titles:
                    for preferred in preferred_titles:
                        if preferred.lower() in job_title:
                            score += 40
                            break
                        elif any(word.lower() in job_title for word in preferred.split()):
                            score += 20
                            break
                
                # Match skills
                if user_skills and job_skills:
                    matching_skills = set(user_skills) & set(job_skills)
                    if matching_skills:
                        score += len(matching_skills) * 5
                
                if score > 0 or (not preferred_titles and len(scored_jobs) < 10):
                    job['match_score'] = score
                    scored_jobs.append(job)
            except Exception as job_error:
                # Skip jobs that cause errors
                print(f"Error processing job: {job_error}")
                continue
        
        # Sort by score and take top 10
        scored_jobs.sort(key=lambda x: x.get('match_score', 0), reverse=True)
        recommended_jobs = scored_jobs[:10]
        
        # Get profile views (mock for now - would need a separate collection)
        profile_views = []
        
        # Calculate stats
        stats = {
            'applicationsSent': len(user_applications),
            'interviewsScheduled': len([app for app in user_applications if app.get('status') == 'interview']),
            'profileViews': len(profile_views),
            'savedJobs': len(saved_jobs)
        }
        
        # Calculate profile completion percentage
        profile_completed = user.get('profileCompleted', False)
        is_draft = user.get('isDraft', False)
        
        # Calculate completion percentage based on filled fields
        required_fields = ['firstName', 'lastName', 'email', 'phone', 'professionalTitle', 
                          'yearsOfExperience', 'careerLevel', 'industry']
        filled_count = sum(1 for field in required_fields if user.get(field))
        profile_completion = int((filled_count / len(required_fields)) * 100) if required_fields else 0
        
        # If profile is marked as completed, ensure it shows 100%
        if profile_completed and not is_draft:
            profile_completion = 100
        
        # Prepare dashboard data
        dashboard_data = {
            'user': {
                'id': str(user.get('_id')),
                'name': user.get('fullName', user.get('name', '')),
                'email': user.get('email', ''),
                'userType': user.get('userType', ''),
                'profileImage': user.get('profileImage', ''),
                'location': user.get('location', {}),
                'phone': user.get('phone', ''),
                'dateOfBirth': user.get('dateOfBirth', ''),
                'gender': user.get('gender', ''),
                'nationality': user.get('nationality', ''),
                'technicalSkills': user.get('technicalSkills', []),
                'softSkills': user.get('softSkills', []),
                'education': user.get('education', []),
                'experience': user.get('experience', []),
                'profileCompleted': profile_completed
            },
            'profileCompletion': profile_completion,
            'isDraft': is_draft,
            'stats': stats,
            'applications': [
                {
                    'id': str(app.get('_id')),
                    'jobId': str(app.get('jobId')),
                    'jobTitle': app.get('jobTitle', ''),
                    'company': app.get('company', ''),
                    'status': app.get('status', 'pending'),
                    'appliedAt': app.get('appliedAt', datetime.now().isoformat()),
                    'location': app.get('location', '')
                }
                for app in user_applications
            ],
            'savedJobs': [
                {
                    'id': str(job.get('_id')),
                    'title': job.get('title', ''),
                    'company': job.get('company', ''),
                    'location': job.get('location', ''),
                    'type': job.get('type', ''),
                    'salary': job.get('salary', ''),
                    'description': job.get('description', ''),
                    'postedAt': job.get('postedAt', datetime.now().isoformat()),
                    'skills': job.get('requiredSkills', []) + job.get('preferredSkills', [])
                }
                for job in saved_jobs
            ],
            'recommendedJobs': [
                {
                    'id': str(job.get('_id')),
                    'title': job.get('title', ''),
                    'company': job.get('company', ''),
                    'location': job.get('location', ''),
                    'type': job.get('type', ''),
                    'salary': job.get('salary', ''),
                    'description': job.get('description', ''),
                    'postedAt': job.get('postedAt', datetime.now().isoformat()),
                    'skills': job.get('requiredSkills', []) + job.get('preferredSkills', [])
                }
                for job in recommended_jobs
            ],
            'profileViews': profile_views
        }
        
        return jsonify(dashboard_data), 200
        
    except Exception as e:
        print(f"Error fetching dashboard data: {e}")
        return jsonify({"error": "Failed to fetch dashboard data"}), 500

@dashboard_routes.route('/profile/views', methods=['GET'])
@jwt_required()
def get_profile_views():
    """Get profile views for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Mock data for now - replace with actual database query later
        mock_views = [
            {
                "id": 1,
                "viewerName": "Sarah Johnson",
                "viewerTitle": "HR Manager",
                "company": "TechCorp Solutions",
                "location": "New York, NY",
                "viewedAt": (datetime.now() - timedelta(hours=2)).isoformat(),
                "viewerType": "recruiter",
                "avatar": None
            },
            {
                "id": 2,
                "viewerName": "Michael Chen",
                "viewerTitle": "Senior Developer",
                "company": "InnovateTech",
                "location": "San Francisco, CA",
                "viewedAt": (datetime.now() - timedelta(days=1)).isoformat(),
                "viewerType": "professional",
                "avatar": None
            },
            {
                "id": 3,
                "viewerName": "Emily Rodriguez",
                "viewerTitle": "Talent Acquisition Specialist",
                "company": "StartupXYZ",
                "location": "Austin, TX",
                "viewedAt": (datetime.now() - timedelta(days=2)).isoformat(),
                "viewerType": "recruiter",
                "avatar": None
            }
        ]
        
        return jsonify(mock_views), 200
        
    except Exception as e:
        print(f"Error fetching profile views: {e}")
        return jsonify({"error": "Failed to fetch profile views"}), 500

@dashboard_routes.route('/network/activity', methods=['GET'])
@jwt_required()
def get_network_activity():
    """Get network activity for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Mock data for now - replace with actual database query later
        mock_activities = [
            {
                "id": 1,
                "type": "connection_request",
                "user": {
                    "name": "Alex Thompson",
                    "title": "Software Engineer",
                    "company": "Google",
                    "avatar": None
                },
                "timestamp": (datetime.now() - timedelta(hours=1)).isoformat(),
                "status": "pending"
            },
            {
                "id": 2,
                "type": "profile_view",
                "user": {
                    "name": "Jessica Lee",
                    "title": "Product Manager",
                    "company": "Meta",
                    "avatar": None
                },
                "timestamp": (datetime.now() - timedelta(hours=3)).isoformat(),
                "status": "completed"
            },
            {
                "id": 3,
                "type": "message",
                "user": {
                    "name": "David Kim",
                    "title": "Design Lead",
                    "company": "Apple",
                    "avatar": None
                },
                "timestamp": (datetime.now() - timedelta(days=1)).isoformat(),
                "status": "completed",
                "messagePreview": "Hi! I saw your profile and..."
            }
        ]
        
        return jsonify({
            "success": True,
            "activities": mock_activities,
            "totalActivities": len(mock_activities)
        }), 200
        
    except Exception as e:
        print(f"Error fetching network activity: {e}")
        return jsonify({"error": "Failed to fetch network activity"}), 500

@dashboard_routes.route('/recommendations/requests', methods=['GET'])
@jwt_required()
def get_recommendation_requests():
    """Get recommendation requests for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Mock data for now - replace with actual database query later
        mock_requests = [
            {
                "id": 1,
                "requesterName": "Maria Garcia",
                "requesterTitle": "Data Scientist",
                "company": "Netflix",
                "requestDate": (datetime.now() - timedelta(days=2)).isoformat(),
                "status": "pending",
                "message": "Hi! I would be grateful if you could write me a recommendation..."
            },
            {
                "id": 2,
                "requesterName": "John Smith",
                "requesterTitle": "Frontend Developer",
                "company": "Microsoft",
                "requestDate": (datetime.now() - timedelta(days=5)).isoformat(),
                "status": "completed",
                "message": "Thank you for considering my request for a recommendation."
            }
        ]
        
        return jsonify({
            "success": True,
            "requests": mock_requests,
            "totalRequests": len(mock_requests)
        }), 200
        
    except Exception as e:
        print(f"Error fetching recommendation requests: {e}")
        return jsonify({"error": "Failed to fetch recommendation requests"}), 500

@dashboard_routes.route('/portfolio/items', methods=['GET'])
@jwt_required()
def get_portfolio_items():
    """Get portfolio items for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Mock data for now - replace with actual database query later
        mock_items = [
            {
                "id": 1,
                "title": "E-Commerce Platform",
                "description": "Full-stack e-commerce solution with React and Node.js",
                "imageUrl": "https://via.placeholder.com/400x250/3b82f6/ffffff?text=E-Commerce+Platform",
                "technologies": ["React", "Node.js", "MongoDB", "Stripe"],
                "githubUrl": "https://github.com/user/ecommerce-platform",
                "liveUrl": "https://ecommerce-demo.com",
                "createdAt": (datetime.now() - timedelta(days=30)).isoformat(),
                "category": "Web Application"
            },
            {
                "id": 2,
                "title": "Mobile Banking App",
                "description": "Cross-platform mobile banking application with secure transactions",
                "imageUrl": "https://via.placeholder.com/400x250/10b981/ffffff?text=Mobile+Banking+App",
                "technologies": ["React Native", "Firebase", "Redux"],
                "githubUrl": "https://github.com/user/banking-app",
                "liveUrl": "https://banking-app-demo.com",
                "createdAt": (datetime.now() - timedelta(days=45)).isoformat(),
                "category": "Mobile Application"
            },
            {
                "id": 3,
                "title": "Data Analytics Dashboard",
                "description": "Real-time analytics dashboard with interactive visualizations",
                "imageUrl": "https://via.placeholder.com/400x250/8b5cf6/ffffff?text=Data+Dashboard",
                "technologies": ["Python", "Django", "Chart.js", "PostgreSQL"],
                "githubUrl": "https://github.com/user/analytics-dashboard",
                "liveUrl": "https://analytics-demo.com",
                "createdAt": (datetime.now() - timedelta(days=60)).isoformat(),
                "category": "Data Visualization"
            },
            {
                "id": 4,
                "title": "AI Chatbot",
                "description": "Intelligent chatbot with natural language processing capabilities",
                "imageUrl": "https://via.placeholder.com/400x250/f59e0b/ffffff?text=AI+Chatbot",
                "technologies": ["Python", "TensorFlow", "Flask", "NLTK"],
                "githubUrl": "https://github.com/user/ai-chatbot",
                "liveUrl": "https://chatbot-demo.com",
                "createdAt": (datetime.now() - timedelta(days=75)).isoformat(),
                "category": "AI/ML"
            }
        ]
        
        return jsonify({
            "success": True,
            "items": mock_items,
            "totalItems": len(mock_items)
        }), 200
        
    except Exception as e:
        print(f"Error fetching portfolio items: {e}")
        return jsonify({"error": "Failed to fetch portfolio items"}), 500
