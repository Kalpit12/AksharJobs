from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from services.auth_service import AuthService, get_user_by_id_or_email
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.cloudinary_service import upload_image

auth_routes = Blueprint("auth_routes", __name__)

@auth_routes.route("/signup", methods=["POST"])
@cross_origin(origins=["http://localhost:3000", "http://localhost:3001"])
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

    if 'profileImage' in request.files:  
        profile_image = request.files['profileImage']
        print(f"Received file: {profile_image.filename}")
    else:
        print("No file uploaded")

    data = request.form.to_dict()
    print(f"Received Sign up Data: {data}")
    user_type = data.get("userType", "")

    profile_image = request.files.get("profileImage")
    company_logo = request.files.get("companyLogo") 
    #print("Profile",profile_image)
    profile_image_url = upload_image(profile_image) if profile_image else None
    company_logo_url = upload_image(company_logo) if company_logo else None
    print("URL",profile_image_url)

    response, status = AuthService.signup(data, profile_image_url, company_logo_url)
    print("Sign UP result",response,status)
    return jsonify(response), status

@auth_routes.route("/login", methods=["POST"])
@cross_origin(origins=["http://localhost:3000", "http://localhost:3001"])
def login():
    """
    Handles user login.
    
    Request Body:
    - JSON with email and password
    
    Returns:
    - JSON response with user details and authentication token if successful.
    - Error message if authentication fails.
    """
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

@auth_routes.route('/update_profile', methods=['PUT'])
@cross_origin(origins=["http://localhost:3000", "http://localhost:3001"])
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
        user_id = data.get('userId')
        
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        # Get the user from database
        user_data = get_user_by_id_or_email(user_id)
        if not user_data:
            return jsonify({"error": "User not found"}), 404
        
        # Update fields
        update_fields = {}
        if 'firstName' in data:
            update_fields['firstName'] = data['firstName']
        if 'lastName' in data:
            update_fields['lastName'] = data['lastName']
        if 'profilePicture' in data:
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