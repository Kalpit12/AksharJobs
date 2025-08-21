from flask import Blueprint, jsonify, request
from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from bson import ObjectId
from datetime import datetime
from pymongo import MongoClient

cv_access_routes = Blueprint('cv_access', __name__)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            
            # Direct database connection to ensure we get the right database
            client = MongoClient('mongodb://localhost:27017/')
            db = client['resume_matcher']  # Direct connection to resume_matcher
            
            user = db.users.find_one({"_id": ObjectId(current_user_id)})
            if not user or user.get("role") != "admin":
                return jsonify({"error": "Admin access required"}), 403
            
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({"error": "Authentication failed"}), 422
    return decorated_function

@cv_access_routes.route('/cv-access/limits', methods=['GET'])
@admin_required
def get_cv_access_limits():
    """Get CV access limits for different user tiers"""
    try:
        # Direct database connection to ensure we get the right database
        client = MongoClient('mongodb://localhost:27017/')
        db = client['resume_matcher']  # Direct connection to resume_matcher
        
        settings = db.admin_settings.find_one({"type": "recruiter"})
        
        if not settings:
            return jsonify({"error": "Recruiter settings not found"}), 404
        
        limits = settings.get("limits", {})
        
        return jsonify({
            "freeCvAccess": limits.get("freeCvAccess", 0),
            "premiumCvAccess": limits.get("premiumCvAccess", 100),
            "enterpriseCvAccess": limits.get("enterpriseCvAccess", 1000)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@cv_access_routes.route('/cv-access/feature-status', methods=['GET'])
@admin_required
def get_cv_access_feature_status():
    """Get CV access feature status"""
    try:
        # Direct database connection to ensure we get the right database
        client = MongoClient('mongodb://localhost:27017/')
        db = client['resume_matcher']  # Direct connection to resume_matcher
        
        settings = db.admin_settings.find_one({"type": "recruiter"})
        
        if not settings:
            return jsonify({"error": "Recruiter settings not found"}), 404
        
        features = settings.get("features", {})
        direct_cv_access = features.get("directCvAccess", {})
        
        return jsonify({
            "enabled": direct_cv_access.get("enabled", False),
            "premiumOnly": direct_cv_access.get("premiumOnly", True)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@cv_access_routes.route('/cv-access/user-limits/<user_id>', methods=['GET'])
def get_user_cv_limits(user_id):
    """Get CV access limits for a specific user"""
    try:
        # Direct database connection to ensure we get the right database
        client = MongoClient('mongodb://localhost:27017/')
        db = client['resume_matcher']  # Direct connection to resume_matcher
        
        # Get user's subscription plan
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        subscription_plan = user.get("subscription", {}).get("plan", "Basic")
        
        # Get CV access limits from admin settings
        settings = db.admin_settings.find_one({"type": "recruiter"})
        if not settings:
            return jsonify({"error": "Recruiter settings not found"}), 404
        
        limits = settings.get("limits", {})
        
        # Determine user's CV access limit based on plan
        if subscription_plan == "Enterprise":
            max_views = limits.get("enterpriseCvAccess", 1000)
        elif subscription_plan == "Professional":
            max_views = limits.get("premiumCvAccess", 100)
        else:
            max_views = limits.get("freeCvAccess", 0)
        
        # Get user's current CV view count for this month
        current_month = datetime.utcnow().strftime("%Y-%m")
        cv_views = db.cv_views.find_one({
            "userId": ObjectId(user_id),
            "month": current_month
        })
        
        view_count = cv_views.get("count", 0) if cv_views else 0
        
        return jsonify({
            "maxViews": max_views,
            "viewCount": view_count,
            "plan": subscription_plan,
            "remainingViews": max(0, max_views - view_count)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@cv_access_routes.route('/cv-access/record-view/<user_id>', methods=['POST'])
def record_cv_view(user_id):
    """Record a CV view for a user"""
    try:
        # Direct database connection to ensure we get the right database
        client = MongoClient('mongodb://localhost:27017/')
        db = client['resume_matcher']  # Direct connection to resume_matcher
        
        current_month = datetime.utcnow().strftime("%Y-%m")
        
        # Increment CV view count for the user this month
        result = db.cv_views.update_one(
            {
                "userId": ObjectId(user_id),
                "month": current_month
            },
            {
                "$inc": {"count": 1},
                "$set": {"lastView": datetime.utcnow()}
            },
            upsert=True
        )
        
        return jsonify({"message": "CV view recorded successfully"})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
