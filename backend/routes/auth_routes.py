from flask import Blueprint, request, jsonify
from services.auth_service import AuthService, get_user_by_id_or_email
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from utils.auth_token import generate_jwt_token
from services.email_service import EmailService
from utils.password_reset import generate_reset_token, verify_reset_token

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

@auth_routes.route("/forgot-password", methods=["POST"])
@cross_origin()
def forgot_password():
    """
    Handles forgot password requests.
    
    Request Body:
    - JSON with email
    
    Returns:
    - JSON response with success or error message.
    """
    try:
        data = request.json
        if not data or not data.get('email'):
            return jsonify({"error": "Email is required"}), 400
        
        email = data['email'].strip().lower()
        
        # Check if user exists
        user = get_user_by_id_or_email(email=email)
        if not user:
            # For security, don't reveal if email exists or not
            return jsonify({
                "message": "If an account with that email exists, we've sent a password reset link."
            }), 200
        
        # Generate reset token
        reset_token = generate_reset_token(email)
        
        # Store reset token in database (with expiration)
        from database.db import get_db_connection
        db = get_db_connection()
        users_collection = db.users
        
        # Update user with reset token and expiration
        import datetime
        reset_expires = datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # 1 hour expiry
        
        users_collection.update_one(
            {"email": email},
            {
                "$set": {
                    "resetToken": reset_token,
                    "resetTokenExpires": reset_expires
                }
            }
        )
        
        # Send reset email
        reset_link = f"{request.host_url.replace('api.', '')}reset-password?token={reset_token}&email={email}"
        
        email_sent = EmailService.send_password_reset_email(email, reset_link, user.get('firstName', ''))
        
        if email_sent:
            return jsonify({
                "message": "If an account with that email exists, we've sent a password reset link."
            }), 200
        else:
            return jsonify({"error": "Failed to send reset email. Please try again."}), 500
            
    except Exception as e:
        print(f"Forgot password error: {str(e)}")
        return jsonify({"error": "An error occurred. Please try again."}), 500

@auth_routes.route("/validate-reset-token", methods=["GET"])
@cross_origin()
def validate_reset_token():
    """
    Validates a password reset token.
    
    Query Parameters:
    - token: The reset token
    
    Returns:
    - JSON response with validation result.
    """
    try:
        token = request.args.get('token')
        if not token:
            return jsonify({"error": "Reset token is required"}), 400
        
        # Get email from query parameters
        email = request.args.get('email')
        if not email:
            return jsonify({"error": "Email parameter is required"}), 400
        
        # Verify token format (we'll validate the token exists in DB in the route)
        if not token or ':' not in token:
            return jsonify({"error": "Invalid reset token format"}), 400
        
        # Check if token exists in database and is not expired
        from database.db import get_db_connection
        db = get_db_connection()
        users_collection = db.users
        
        user = users_collection.find_one({
            "email": email,
            "resetToken": token,
            "resetTokenExpires": {"$gt": datetime.datetime.utcnow()}
        })
        
        if not user:
            return jsonify({"error": "Invalid or expired reset token"}), 400
        
        return jsonify({
            "message": "Token is valid",
            "email": email
        }), 200
        
    except Exception as e:
        print(f"Token validation error: {str(e)}")
        return jsonify({"error": "Failed to validate reset token"}), 500

@auth_routes.route("/reset-password", methods=["POST"])
@cross_origin()
def reset_password():
    """
    Handles password reset with token.
    
    Request Body:
    - JSON with token, email, password, confirmPassword
    
    Returns:
    - JSON response with success or error message.
    """
    try:
        data = request.json
        required_fields = ['token', 'email', 'password', 'confirmPassword']
        
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"{field} is required"}), 400
        
        token = data['token']
        email = data['email'].strip().lower()
        password = data['password']
        confirm_password = data['confirmPassword']
        
        # Validate passwords match
        if password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), 400
        
        # Validate password strength
        if len(password) < 8:
            return jsonify({"error": "Password must be at least 8 characters long"}), 400
        
        # Verify token format
        if not token or ':' not in token:
            return jsonify({"error": "Invalid reset token format"}), 400
        
        # Check if token exists in database and is not expired
        from database.db import get_db_connection
        db = get_db_connection()
        users_collection = db.users
        
        import datetime
        user = users_collection.find_one({
            "email": email,
            "resetToken": token,
            "resetTokenExpires": {"$gt": datetime.datetime.utcnow()}
        })
        
        if not user:
            return jsonify({"error": "Invalid or expired reset token"}), 400
        
        # Hash new password
        import bcrypt
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        
        # Update user password and clear reset token
        users_collection.update_one(
            {"email": email},
            {
                "$set": {
                    "password": hashed_password.decode('utf-8')
                },
                "$unset": {
                    "resetToken": "",
                    "resetTokenExpires": ""
                }
            }
        )
        
        return jsonify({
            "message": "Password updated successfully! Please log in with your new password."
        }), 200
        
    except Exception as e:
        print(f"Reset password error: {str(e)}")
        return jsonify({"error": "An error occurred. Please try again."}), 500