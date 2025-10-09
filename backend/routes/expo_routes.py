from flask import Blueprint, request, jsonify
from models.expo_model import ExpoRegistration, ReferralTracking
from functools import wraps
from datetime import datetime

expo_bp = Blueprint('expo', __name__)

def handle_errors(f):
    """Decorator to handle errors consistently"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            print(f"❌ Error in {f.__name__}: {e}")
            return jsonify({
                "success": False,
                "error": str(e),
                "message": "An error occurred processing your request"
            }), 500
    return decorated_function


# ==================== REGISTRATION ENDPOINTS ====================

@expo_bp.route('/register', methods=['POST'])
@handle_errors
def register():
    """Register for the expo"""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['email', 'phone', 'role']
    if not data.get('fullName') and not data.get('name'):
        return jsonify({
            "success": False,
            "error": "Missing required field: name or fullName"
        }), 400
    
    for field in required_fields:
        if not data.get(field):
            return jsonify({
                "success": False,
                "error": f"Missing required field: {field}"
            }), 400
    
    # Create registration
    result = ExpoRegistration.create_registration(data)
    
    if result.get("success"):
        return jsonify(result), 201
    else:
        # Duplicate registration or other error
        return jsonify(result), 400


@expo_bp.route('/registrations', methods=['GET'])
@handle_errors
def get_registrations():
    """Get all registrations or filter by role"""
    role = request.args.get('role')
    limit = int(request.args.get('limit', 100))
    
    registrations = ExpoRegistration.get_registrations_by_role(role, limit)
    
    return jsonify({
        "success": True,
        "count": len(registrations),
        "registrations": registrations
    }), 200


@expo_bp.route('/registration/<email>', methods=['GET'])
@handle_errors
def get_registration_by_email(email):
    """Get registration by email"""
    registration = ExpoRegistration.get_registration_by_email(email)
    
    if registration:
        return jsonify({
            "success": True,
            "registration": registration
        }), 200
    else:
        return jsonify({
            "success": False,
            "message": "Registration not found"
        }), 404


@expo_bp.route('/registrations/stats', methods=['GET'])
@handle_errors
def get_registration_stats():
    """Get registration statistics"""
    stats = ExpoRegistration.get_registration_stats()
    
    return jsonify({
        "success": True,
        "stats": stats
    }), 200


# ==================== REFERRAL TRACKING ENDPOINTS ====================

@expo_bp.route('/referral/track', methods=['POST'])
@handle_errors
def track_referral():
    """Track a referral share or registration"""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['referrerName', 'referrerEmail', 'platform']
    for field in required_fields:
        if not data.get(field):
            return jsonify({
                "success": False,
                "error": f"Missing required field: {field}"
            }), 400
    
    # Track the referral
    result = ReferralTracking.track_referral(data)
    
    return jsonify(result), 200


@expo_bp.route('/referral/data', methods=['GET'])
@handle_errors
def get_referral_data():
    """Get referral data for a user or all users"""
    email = request.args.get('email')
    
    result = ReferralTracking.get_referral_data(email)
    
    return jsonify(result), 200


@expo_bp.route('/referral/leaderboard', methods=['GET'])
@handle_errors
def get_leaderboard():
    """Get referral leaderboard"""
    limit = int(request.args.get('limit', 50))
    
    result = ReferralTracking.get_leaderboard(limit)
    
    return jsonify(result), 200


@expo_bp.route('/referral/stats/<email>', methods=['GET'])
@handle_errors
def get_user_stats(email):
    """Get detailed stats for a specific user"""
    result = ReferralTracking.get_user_stats(email)
    
    if result.get("success"):
        return jsonify(result), 200
    else:
        return jsonify(result), 404


# ==================== LEGACY COMPATIBILITY ENDPOINTS ====================

@expo_bp.route('/check_registration', methods=['GET'])
@handle_errors
def check_registration():
    """Check if a user is registered (for compatibility with existing frontend)"""
    email = request.args.get('email')
    
    if not email:
        return jsonify({
            "registered": False,
            "message": "Email parameter is required"
        }), 400
    
    registration = ExpoRegistration.get_registration_by_email(email)
    
    if registration:
        return jsonify({
            "registered": True,
            "message": "User is registered",
            "userData": {
                "name": registration.get("fullName"),
                "email": registration.get("email"),
                "phone": registration.get("phone"),
                "role": registration.get("role"),
                "timestamp": registration.get("timestamp")
            }
        }), 200
    else:
        return jsonify({
            "registered": False,
            "message": "User not found in registration"
        }), 200


# ==================== HEALTH CHECK ====================

@expo_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "success": True,
        "message": "AksharJobs Expo API is running",
        "timestamp": str(datetime.utcnow())
    }), 200

