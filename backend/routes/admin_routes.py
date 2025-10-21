from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from functools import wraps
from datetime import datetime, timedelta
import json
from bson import ObjectId
from utils.db import get_db

print("[INFO] Loading admin_routes.py...")
admin_routes = Blueprint('admin_routes', __name__)
print("[OK] Admin routes Blueprint created")

# Test route to verify blueprint is registered
@admin_routes.route('/test', methods=['GET'])
def test_route():
    return jsonify({"message": "Admin routes are working!"}), 200

# Admin middleware decorator
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        print(f"🔐 Admin auth check for: {request.path}")
        try:
            # First try to get token from Authorization header
            auth_header = request.headers.get('Authorization')
            print(f"  Auth header: {auth_header[:50] if auth_header else 'None'}...")
            
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
                
                # Verify token using auth_token utility
                from utils.auth_token import verify_token
                try:
                    print(f"  Verifying token...")
                    decoded_token = verify_token(token)
                    print(f"  Token decoded: {decoded_token}")
                    if not decoded_token:
                        print(f"  ❌ Token verification returned None")
                        return jsonify({"error": "Invalid token"}), 401
                    
                    # Get user ID from decoded token (sub is the standard JWT claim for user ID)
                    current_user_id = decoded_token.get('sub') or decoded_token.get('userId') or decoded_token.get('user_id')
                    print(f"  User ID from token: {current_user_id}")
                except Exception as e:
                    print(f"  ❌ Token verification failed: {str(e)}")
                    import traceback
                    traceback.print_exc()
                    return jsonify({"error": "Token verification failed"}), 401
            else:
                # Fallback to JWT-Extended
                try:
                    verify_jwt_in_request()
                    current_user_id = get_jwt_identity()
                except Exception as e:
                    return jsonify({"error": "No valid authorization token provided"}), 401
            
            if not current_user_id:
                print(f"  ❌ No user ID extracted from token")
                return jsonify({"error": "Could not extract user ID from token"}), 401
            
            print(f"  Checking user in database...")
            # Use the same database connection as other routes
            db = get_db()
            
            user = db.users.find_one({"_id": ObjectId(current_user_id)})
            print(f"  User found: {user is not None}")
            
            if not user:
                print(f"  ❌ User not found in database")
                return jsonify({"error": "User not found"}), 404
            
            # Check if user is admin (check both role and userType)
            is_admin = user.get("role") == "admin" or user.get("userType") == "admin"
            print(f"  Is admin: {is_admin} (role={user.get('role')}, userType={user.get('userType')})")
            
            if not is_admin:
                print(f"  ❌ User is not admin")
                return jsonify({"error": "Admin access required", "role": user.get("role"), "userType": user.get("userType")}), 403
            
            print(f"  ✅ Admin auth passed, calling function...")
            return f(*args, **kwargs)
            
        except Exception as e:
            print(f"Admin auth error: {str(e)}")  # Debug logging
            import traceback
            traceback.print_exc()
            return jsonify({"error": "Authentication failed", "details": str(e)}), 401
    return decorated_function

# System Statistics
@admin_routes.route('/stats', methods=['GET'])
@admin_required
def get_system_stats():
    try:
        # Use the same database as other routes
        db = get_db()
        
        # Count users by type
        total_job_seekers = db.users.count_documents({"userType": "job_seeker"})
        total_recruiters = db.users.count_documents({"userType": "recruiter"})
        
        # Count total resumes and jobs
        total_resumes = db.resumes.count_documents({})
        total_jobs = db.jobs.count_documents({})
        
        # Count active vs inactive users
        active_users = db.users.count_documents({"status": "active"})
        inactive_users = db.users.count_documents({"status": {"$ne": "active"}})
        
        # Calculate MAU and DAU (simplified)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        one_day_ago = datetime.utcnow() - timedelta(days=1)
        
        monthly_active_users = db.users.count_documents({
            "lastActive": {"$gte": thirty_days_ago}
        })
        
        daily_active_users = db.users.count_documents({
            "lastActive": {"$gte": one_day_ago}
        })
        
        return jsonify({
            "totalJobSeekers": total_job_seekers,
            "totalRecruiters": total_recruiters,
            "totalResumes": total_resumes,
            "totalJobs": total_jobs,
            "activeUsers": active_users,
            "inactiveUsers": inactive_users,
            "monthlyActiveUsers": monthly_active_users,
            "dailyActiveUsers": daily_active_users
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Job Seeker Settings
@admin_routes.route('/jobseeker-settings', methods=['GET'])
@admin_required
def get_jobseeker_settings():
    try:
        # Use the same database as other routes
        db = get_db()
        settings = db.admin_settings.find_one({"type": "jobseeker"})
        
        if not settings:
            # Default settings
            default_settings = {
                "features": {
                    "resumeUpload": {"enabled": True, "premiumOnly": False},
                    "jobSearch": {"enabled": True, "premiumOnly": False},
                    "applicationTracking": {"enabled": True, "premiumOnly": False},
                    "culturalFitAssessment": {"enabled": True, "premiumOnly": False},
                    "matchScoreAnalysis": {"enabled": True, "premiumOnly": False},
                    "interviewScheduling": {"enabled": True, "premiumOnly": False},
                    "offerLetterGeneration": {"enabled": False, "premiumOnly": True}
                },
                "limits": {
                    "freeResumeUploads": 3,
                    "freeJobApplications": 10,
                    "freeMatchScoreViews": 5,
                    "freeCulturalFitTests": 2
                }
            }
            return jsonify(default_settings)
        
        return jsonify({
            "features": settings.get("features", {}),
            "limits": settings.get("limits", {})
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_routes.route('/jobseeker-settings', methods=['PUT'])
@admin_required
def update_jobseeker_settings():
    try:
        data = request.get_json()
        
        # Use the same database as other routes
        db = get_db()
        
        # Update or create settings
        db.admin_settings.update_one(
            {"type": "jobseeker"},
            {
                "$set": {
                    "features": data.get("features", {}),
                    "limits": data.get("limits", {}),
                    "updatedAt": datetime.utcnow()
                }
            },
            upsert=True
        )
        
        return jsonify({"message": "Job seeker settings updated successfully"})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Recruiter Settings
@admin_routes.route('/recruiter-settings', methods=['GET'])
@admin_required
def get_recruiter_settings():
    try:
        # Use the same database as other routes
        db = get_db()
        settings = db.admin_settings.find_one({"type": "recruiter"})
        
        if not settings:
            # Default settings
            default_settings = {
                "features": {
                    "jobPosting": {"enabled": True, "premiumOnly": False},
                    "candidateSearch": {"enabled": True, "premiumOnly": False},
                    "matchScoreAnalysis": {"enabled": True, "premiumOnly": False},
                    "interviewScheduling": {"enabled": True, "premiumOnly": False},
                    "culturalFitAssessment": {"enabled": True, "premiumOnly": False},
                    "offerLetterGeneration": {"enabled": False, "premiumOnly": True},
                    "advancedAnalytics": {"enabled": False, "premiumOnly": True},
                    "bulkOperations": {"enabled": False, "premiumOnly": True},
                    "directCvAccess": {"enabled": False, "premiumOnly": True},  # New CV Access feature
                    "swahiliAnalysis": {"enabled": True, "premiumOnly": False},  # Swahili & Local Language Analysis
                    "localMarketIntelligence": {"enabled": True, "premiumOnly": False},  # Local Market Intelligence
                    "realTimeCulturalScoring": {"enabled": True, "premiumOnly": False},  # Real-Time Cultural Scoring
                    "predictiveCulturalSuccess": {"enabled": True, "premiumOnly": False}  # Predictive Cultural Success
                },
                "limits": {
                    "freeJobPostings": 2,
                    "freeResumeViews": 10,
                    "freeMatchScoreViews": 5,
                    "freeCandidateSearches": 20,
                    "freeInterviewSlots": 5,
                    "freeCvAccess": 0,  # Free users get no CV access by default
                    "premiumCvAccess": 100,  # Premium users get 100 CV views per month
                    "enterpriseCvAccess": 1000  # Enterprise users get 1000 CV views per month
                }
            }
            return jsonify(default_settings)
        
        return jsonify({
            "features": settings.get("features", {}),
            "limits": settings.get("limits", {})
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_routes.route('/recruiter-settings', methods=['PUT'])
@admin_required
def update_recruiter_settings():
    try:
        data = request.get_json()
        
        # Use the same database as other routes
        db = get_db()
        
        # Update or create settings
        db.admin_settings.update_one(
            {"type": "recruiter"},
            {
                "$set": {
                    "features": data.get("features", {}),
                    "limits": data.get("limits", {}),
                    "updatedAt": datetime.utcnow()
                }
            },
            upsert=True
        )
        
        return jsonify({"message": "Recruiter settings updated successfully"})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# Subscription Plans
@admin_routes.route('/plans', methods=['GET'])
@admin_required
def get_plans():
    try:
        # Use the same database as other routes
        db = get_db()
        plans = list(db.subscription_plans.find({}))
        
        # Convert ObjectId to string for JSON serialization
        for plan in plans:
            plan["_id"] = str(plan["_id"])
        
        return jsonify({"plans": plans})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_routes.route('/plans', methods=['POST'])
@admin_required
def create_plan():
    try:
        data = request.get_json()
        
        # Use the same database as other routes
        db = get_db()
        
        # Add creation timestamp
        data["createdAt"] = datetime.utcnow()
        data["updatedAt"] = datetime.utcnow()
        
        result = db.subscription_plans.insert_one(data)
        
        return jsonify({
            "message": "Plan created successfully",
            "planId": str(result.inserted_id)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_routes.route('/plans/<plan_id>', methods=['PUT'])
@admin_required
def update_plan(plan_id):
    try:
        data = request.get_json()
        
        # Use the same database as other routes
        db = get_db()
        
        # Add update timestamp
        data["updatedAt"] = datetime.utcnow()
        
        result = db.subscription_plans.update_one(
            {"_id": ObjectId(plan_id)},
            {"$set": data}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Plan not found"}), 404
        
        return jsonify({"message": "Plan updated successfully"})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_routes.route('/plans/<plan_id>', methods=['DELETE'])
@admin_required
def delete_plan(plan_id):
    try:
        # Use the same database as other routes
        db = get_db()
        
        result = db.subscription_plans.delete_one({"_id": ObjectId(plan_id)})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Plan not found"}), 404
        
        return jsonify({"message": "Plan deleted successfully"})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Analytics
@admin_routes.route('/analytics', methods=['GET'])
@admin_required
def get_analytics():
    try:
        # Use the same database as other routes
        db = get_db()
        range_param = request.args.get('range', '30d')
        
        # Calculate date range
        if range_param == '7d':
            start_date = datetime.utcnow() - timedelta(days=7)
        elif range_param == '90d':
            start_date = datetime.utcnow() - timedelta(days=90)
        elif range_param == '1y':
            start_date = datetime.utcnow() - timedelta(days=365)
        else:  # 30d default
            start_date = datetime.utcnow() - timedelta(days=30)
        
        # User growth data
        user_growth = []
        current_date = start_date
        while current_date <= datetime.utcnow():
            next_date = current_date + timedelta(days=1)
            
            total_users = db.users.count_documents({
                "createdAt": {"$lt": next_date}
            })
            
            active_users = db.users.count_documents({
                "lastActive": {"$gte": current_date, "$lt": next_date}
            })
            
            user_growth.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "totalUsers": total_users,
                "activeUsers": active_users
            })
            
            current_date = next_date
        
        # Revenue data (simplified)
        revenue_data = []
        for i in range(12):
            month_date = datetime.utcnow() - timedelta(days=30*i)
            month_name = month_date.strftime("%B %Y")
            
            # Mock revenue calculation
            monthly_revenue = 5000 + (i * 1000)  # Replace with actual calculation
            
            revenue_data.append({
                "month": month_name,
                "revenue": monthly_revenue
            })
        
        # Feature usage data
        feature_usage = [
            {"feature": "Resume Upload", "usageCount": 1250},
            {"feature": "Job Search", "usageCount": 2100},
            {"feature": "Match Score", "usageCount": 1800},
            {"feature": "Cultural Fit", "usageCount": 950},
            {"feature": "Interview Scheduling", "usageCount": 650}
        ]
        
        # Application funnel data
        application_funnel = [
            {"stage": "Resume Uploaded", "count": 1250},
            {"stage": "Job Applied", "count": 980},
            {"stage": "Shortlisted", "count": 245},
            {"stage": "Interviewed", "count": 120},
            {"stage": "Hired", "count": 45}
        ]
        
        # User distribution
        user_distribution = {
            "jobSeekers": db.users.count_documents({"userType": "job_seeker"}),
            "recruiters": db.users.count_documents({"userType": "recruiter"}),
            "premiumUsers": db.users.count_documents({"subscription.plan": {"$ne": "Basic"}}),
            "enterpriseUsers": db.users.count_documents({"subscription.plan": "Enterprise"})
        }
        
        # Monthly stats
        monthly_stats = {
            "totalUsers": db.users.count_documents({}),
            "activeJobs": db.jobs.count_documents({"status": "active"}),
            "resumesUploaded": db.resumes.count_documents({
                "createdAt": {"$gte": start_date}
            }),
            "monthlyRevenue": 15000  # Replace with actual calculation
        }
        
        return jsonify({
            "userGrowth": user_growth,
            "revenueData": revenue_data,
            "featureUsage": feature_usage,
            "applicationFunnel": application_funnel,
            "userDistribution": user_distribution,
            "monthlyStats": monthly_stats
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_routes.route('/analytics/export', methods=['GET'])
@admin_required
def export_analytics():
    try:
        format_type = request.args.get('format', 'csv')
        range_param = request.args.get('range', '30d')
        
        # Get analytics data
        # Use the same database as other routes
        db = get_db()
        
        if format_type == 'csv':
            # Generate CSV content
            csv_content = "Date,Total Users,Active Users\n"
            # Add actual data here
            
            response = jsonify({"csv": csv_content})
            response.headers['Content-Type'] = 'text/csv'
            response.headers['Content-Disposition'] = f'attachment; filename=analytics-{range_param}.csv'
            return response
            
        elif format_type == 'pdf':
            # Generate PDF content (simplified)
            pdf_content = b"PDF content would be generated here"
            
            response = jsonify({"pdf": "PDF generated"})
            response.headers['Content-Type'] = 'application/pdf'
            response.headers['Content-Disposition'] = f'attachment; filename=analytics-{range_param}.pdf'
            return response
            
        else:
            return jsonify({"error": "Unsupported format"}), 400
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# User Management
@admin_routes.route('/users', methods=['GET'])
@admin_required
def get_users():
    try:
        # Use the same database as other routes
        db = get_db()
        users = list(db.users.find({}, {
            "password": 0,  # Exclude password
            "verificationToken": 0,
            "resetToken": 0
        }))
        
        # Convert ObjectId to string for JSON serialization
        for user in users:
            user["_id"] = str(user["_id"])
            if "createdAt" in user:
                user["createdAt"] = user["createdAt"].isoformat()
            if "lastActive" in user:
                user["lastActive"] = user["lastActive"].isoformat()
        
        return jsonify({"users": users})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_routes.route('/users/<user_id>/<action>', methods=['PUT'])
@admin_required
def user_action(user_id, action):
    try:
        # Use the same database as other routes
        db = get_db()
        
        if action == 'suspend':
            result = db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"status": "suspended", "updatedAt": datetime.utcnow()}}
            )
        elif action == 'activate':
            result = db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"status": "active", "updatedAt": datetime.utcnow()}}
            )
        elif action == 'delete':
            result = db.users.delete_one({"_id": ObjectId(user_id)})
        else:
            return jsonify({"error": "Invalid action"}), 400
        
        if result.matched_count == 0 and action != 'delete':
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({"message": f"User {action} successfully"})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_routes.route('/users/bulk-action', methods=['PUT'])
@admin_required
def bulk_user_action():
    try:
        data = request.get_json()
        user_ids = data.get("userIds", [])
        action = data.get("action")
        
        if not user_ids or not action:
            return jsonify({"error": "Missing user IDs or action"}), 400
        
        # Use the same database as other routes
        db = get_db()
        
        # Convert string IDs to ObjectId
        object_ids = [ObjectId(uid) for uid in user_ids]
        
        if action == 'suspend':
            result = db.users.update_many(
                {"_id": {"$in": object_ids}},
                {"$set": {"status": "suspended", "updatedAt": datetime.utcnow()}}
            )
        elif action == 'activate':
            result = db.users.update_many(
                {"_id": {"$in": object_ids}},
                {"$set": {"status": "active", "updatedAt": datetime.utcnow()}}
            )
        elif action == 'delete':
            result = db.users.delete_many({"_id": {"$in": object_ids}})
        else:
            return jsonify({"error": "Invalid action"}), 400
        
        return jsonify({
            "message": f"Bulk {action} completed successfully",
            "affectedCount": result.modified_count if action != 'delete' else result.deleted_count
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_routes.route('/users/export', methods=['GET'])
@admin_required
def export_users():
    try:
        format_type = request.args.get('format', 'csv')
        
        # Use the same database as other routes
        db = get_db()
        users = list(db.users.find({}, {
            "password": 0,
            "verificationToken": 0,
            "resetToken": 0
        }))
        
        if format_type == 'csv':
            # Generate CSV content
            csv_content = "Name,Email,User Type,Status,Subscription,Last Active\n"
            
            for user in users:
                name = f"{user.get('firstName', '')} {user.get('lastName', '')}"
                email = user.get('email', '')
                user_type = user.get('userType', '')
                status = user.get('status', 'active')
                subscription = user.get('subscription', {}).get('plan', 'Basic')
                last_active = user.get('lastActive', 'Never')
                
                if isinstance(last_active, datetime):
                    last_active = last_active.strftime("%Y-%m-%d")
                
                csv_content += f'"{name}","{email}","{user_type}","{status}","{subscription}","{last_active}"\n'
            
            response = jsonify({"csv": csv_content})
            response.headers['Content-Type'] = 'text/csv'
            response.headers['Content-Disposition'] = 'attachment; filename=users-export.csv'
            return response
            
        else:
            return jsonify({"error": "Unsupported format"}), 400
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Swahili Analysis Feature Management
@admin_routes.route('/swahili-analysis-settings', methods=['GET'])
@admin_required
def get_swahili_analysis_settings():
    try:
        # Use the same database as other routes
        db = get_db()
        
        settings = db.admin_settings.find_one({"type": "swahili_analysis"})
        
        if not settings:
            # Default settings
            default_settings = {
                "features": {
                    "swahiliAnalysis": {"enabled": True, "premiumOnly": False},
                    "localMarketIntelligence": {"enabled": True, "premiumOnly": False},
                    "realTimeCulturalScoring": {"enabled": True, "premiumOnly": False},
                    "predictiveCulturalSuccess": {"enabled": True, "premiumOnly": False}
                },
                "limits": {
                    "freeAnalysisPerMonth": 10,
                    "premiumAnalysisPerMonth": 100,
                    "enterpriseAnalysisPerMonth": 1000
                },
                "config": {
                    "supportedLanguages": ["swahili", "english", "kikuyu", "kamba", "luhya", "kisii", "meru", "kalenjin"],
                    "aiModel": "gemini-1.5-flash",
                    "analysisTimeout": 30
                }
            }
            return jsonify(default_settings)
        
        return jsonify(settings)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_routes.route('/swahili-analysis-settings', methods=['PUT'])
@admin_required
def update_swahili_analysis_settings():
    try:
        data = request.get_json()
        
        # Use the same database as other routes
        db = get_db()
        
        # Update or create settings
        db.admin_settings.update_one(
            {"type": "swahili_analysis"},
            {
                "$set": {
                    "features": data.get("features", {}),
                    "limits": data.get("limits", {}),
                    "config": data.get("config", {}),
                    "updatedAt": datetime.utcnow()
                }
            },
            upsert=True
        )
        
        return jsonify({"message": "Swahili analysis settings updated successfully"})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_routes.route('/swahili-analysis-settings/feature-toggle', methods=['PUT'])
@admin_required
def toggle_swahili_feature():
    try:
        data = request.get_json()
        feature_name = data.get("feature")
        enabled = data.get("enabled")
        
        if not feature_name or enabled is None:
            return jsonify({"error": "Missing feature name or enabled status"}), 400
        
        # Use the same database as other routes
        db = get_db()
        
        # Update the specific feature
        result = db.admin_settings.update_one(
            {"type": "swahili_analysis"},
            {
                "$set": {
                    f"features.{feature_name}.enabled": enabled,
                    "updatedAt": datetime.utcnow()
                }
            },
            upsert=True
        )
        
        return jsonify({
            "message": f"Feature {feature_name} {'enabled' if enabled else 'disabled'} successfully",
            "feature": feature_name,
            "enabled": enabled
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# (Removed duplicate route definitions to avoid endpoint conflicts)