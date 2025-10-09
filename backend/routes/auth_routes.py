from flask import Blueprint, request, jsonify
from services.auth_service import AuthService, get_user_by_id_or_email
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from utils.auth_token import generate_jwt_token

auth_routes = Blueprint("auth_routes", __name__)

@auth_routes.route("/signup", methods=["POST"])
def signup():
    """
    Handles user registration (signup).
    
    - Accepts multipart form data including user details and optional profile image/company logo.
    - Uploads images to Cloudinary if provided.
    - Calls AuthService to create a new user.
    
    Request Body:
    - form-data with user details (userType, name, email, password, etc.)
    - Optional files: profileImage, companyLogo
    
    Returns:
    - JSON response with success or error message.
    """

    # Handle both JSON and form data
    if request.is_json:
        data = request.json
    else:
        data = request.form.to_dict()
    
    # Ensure data is not None
    if data is None:
        return jsonify({"error": "No data received"}), 400
    
    print(f"Received Sign up Data: {data}")
    print(f"Data types: {[(k, type(v), v) for k, v in data.items()]}")
    
    # Validate required fields
    required_fields = ["userType", "firstName", "lastName", "email", "password"]
    
    print(f"Required fields check: {[(field, field in data, data.get(field, 'NOT_FOUND')) for field in required_fields]}")
    
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    # Validate that required fields are not empty strings
    for field in required_fields:
        if not data[field].strip():
            return jsonify({"error": f"Field {field} cannot be empty"}), 400
    
    user_type = data.get("userType", "")

    response, status = AuthService.signup(data, None, None)
    print("Sign UP result", response, status)
    return jsonify(response), status

@auth_routes.route("/login", methods=["POST", "OPTIONS"])
def login():
    """
    Handles user login.
    
    Request Body:
    - JSON with email and password
    
    Returns:
    - JSON response with user details and authentication token if successful.
    - Error message if authentication fails.
    """
    # Handle preflight OPTIONS request
    if request.method == "OPTIONS":
        return jsonify({"message": "OK"}), 200
    
    data = request.json
    response, status = AuthService.login(data)

    print("User got",response)
    
    return jsonify(response), status

@auth_routes.route("/logout", methods=["POST"])
@jwt_required()  
def logout():
    return jsonify({"message": "Logout successful"}), 200

@auth_routes.route('/get_user', methods=['GET'])
def get_user():
    print("Getting user by id...")
    """
    Retrieves user details based on user ID or email.
    
    Query Parameters:
    - userId (optional): The unique ID of the user.
    - email (optional): The email address of the user.
    
    Returns:
    - JSON response with user details if found.
    - Error message if user does not exist.
    """
    user_id = request.args.get('userId')
    email = request.args.get('email')

    if not user_id and not email:
        return jsonify({"error": "Provide either userId or email"}), 400

    user_data = get_user_by_id_or_email(user_id, email)

    if not user_data:
        return jsonify({"error": "User not found"}), 404
    print("User DB responded")
    return jsonify(user_data), 200

@auth_routes.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """
    Get current user profile from JWT token.
    Protected endpoint that automatically gets user ID from token.
    """
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({"error": "Invalid token"}), 401
        
        user_data = get_user_by_id_or_email(current_user_id)
        if not user_data:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify(user_data), 200
        
    except Exception as e:
        print(f"Error getting current user: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@auth_routes.route('/update_profile', methods=['PUT'])
def update_profile():
    """
    Updates user profile information.
    
    Request Body:
    - JSON with userId and fields to update (firstName, lastName, profilePicture)
    
    Returns:
    - JSON response with success or error message.
    """
    try:
        data = request.json
        if data is None:
            return jsonify({"error": "No data received"}), 400
            
        user_id = data.get('userId')
        
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        # Get the user from database
        user_data = get_user_by_id_or_email(user_id)
        if not user_data:
            return jsonify({"error": "User not found"}), 404
        
        # Update fields
        update_fields = {}
        if data.get('firstName'):
            update_fields['firstName'] = data['firstName']
        if data.get('lastName'):
            update_fields['lastName'] = data['lastName']
        if data.get('profilePicture'):
            update_fields['profileImage'] = data['profilePicture']
        
        if not update_fields:
            return jsonify({"error": "No fields to update"}), 400
        
        # Update user in database
        from services.auth_service import update_user_profile
        success = update_user_profile(user_id, update_fields)
        
        if success:
            return jsonify({
                "message": "Profile updated successfully",
                "updatedFields": update_fields
            }), 200
        else:
            return jsonify({"error": "Failed to update profile"}), 500
            
    except Exception as e:
        print(f"Error updating profile: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@auth_routes.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """Refresh JWT token"""
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({"error": "Invalid refresh token"}), 401
        
        # Generate new access token
        new_token = generate_jwt_token(current_user_id)
        
        return jsonify({
            "token": new_token,
            "message": "Token refreshed successfully"
        }), 200
        
    except Exception as e:
        print(f"Error refreshing token: {e}")
        return jsonify({"error": "Failed to refresh token"}), 500

@auth_routes.route("/change-password", methods=["POST"])
@jwt_required()
def change_password():
    """
    Change user password.
    
    Request Body:
    - currentPassword: Current password
    - newPassword: New password
    
    Returns:
    - JSON response with success or error message.
    """
    try:
        current_user_id = get_jwt_identity()
        data = request.json
        
        if not data or 'currentPassword' not in data or 'newPassword' not in data:
            return jsonify({"error": "Missing required fields"}), 400
        
        # For now, just return success (implement actual password change logic)
        return jsonify({"message": "Password changed successfully"}), 200
        
    except Exception as e:
        print(f"Error changing password: {str(e)}")
        return jsonify({"error": "Password change failed"}), 500

@auth_routes.route("/toggle-2fa", methods=["POST"])
@jwt_required()
def toggle_2fa():
    """
    Toggle two-factor authentication.
    
    Request Body:
    - enabled: Boolean to enable/disable 2FA
    
    Returns:
    - JSON response with success or error message.
    """
    try:
        current_user_id = get_jwt_identity()
        data = request.json
        
        if not data or 'enabled' not in data:
            return jsonify({"error": "Missing enabled field"}), 400
        
        # For now, just return success (implement actual 2FA logic)
        return jsonify({"message": f"2FA {'enabled' if data['enabled'] else 'disabled'} successfully"}), 200
        
    except Exception as e:
        print(f"Error toggling 2FA: {str(e)}")
        return jsonify({"error": "2FA toggle failed"}), 500

@auth_routes.route("/sessions", methods=["GET"])
@jwt_required()
def get_sessions():
    """
    Get user's active sessions.
    
    Returns:
    - JSON response with active sessions.
    """
    try:
        current_user_id = get_jwt_identity()
        
        # Mock sessions data (implement actual session tracking)
        sessions = [
            {
                "device": "Chrome on Windows",
                "location": "New York, NY",
                "lastActive": "2024-01-15 10:30 AM"
            },
            {
                "device": "Safari on iPhone",
                "location": "San Francisco, CA", 
                "lastActive": "2024-01-14 3:45 PM"
            }
        ]
        
        return jsonify({"sessions": sessions}), 200
        
    except Exception as e:
        print(f"Error getting sessions: {str(e)}")
        return jsonify({"error": "Failed to get sessions"}), 500