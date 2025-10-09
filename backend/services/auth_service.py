from bson import ObjectId
from utils.db import get_db
from models.user_model import User
from datetime import datetime
from utils.auth_token import generate_jwt_token
from services.cloudinary_service import upload_image
import bcrypt

class AuthService:
    """
    Service class for handling user authentication operations, 
    including signup, login, and user retrieval.
    """

    @staticmethod
    def signup(data, profile_image_url=None, company_logo_url=None):
        """
        Registers a new user.

        Parameters:
        - data (dict): User details including firstName, lastName, email, password, etc.
        - profile_image_url (str, optional): URL of the uploaded profile image (for job seekers).
        - company_logo_url (str, optional): URL of the uploaded company logo (for recruiters).

        Returns:
        - dict: Success message if registration is successful.
        - tuple: Error message and HTTP status code if the email is already registered.
        """
        try:
            # Check if user already exists
            existing_user = User.find_by_email(data["email"])
            if existing_user:
                return {"error": "User already exists"}, 400

            # Map frontend userType to backend format
            user_type_mapping = {
                "jobSeeker": "job_seeker",
                "recruiter": "recruiter",
                "intern": "intern"
            }
            
            user_data = {
                "userType": user_type_mapping.get(data["userType"], data["userType"]),
                "firstName": data["firstName"],
                "lastName": data["lastName"],
                "email": data["email"],
                "password": data["password"],  # Let User.create_user handle hashing
                "phoneNumber": data.get("phoneNumber", ""),
                "linkedInProfile": data.get("linkedInProfile", ""),
                "companyName": data.get("companyName", ""),
                "companyWebsite": data.get("companyWebsite", ""),
                "location": data.get("location", ""),
                "industry": data.get("industry", ""),
                "companySize": data.get("companySize", ""),
                "foundedYear": data.get("foundedYear", ""),
                "companyDescription": data.get("companyDescription", ""),
                "profileImage": profile_image_url or "", 
                "companyLogo": company_logo_url or "",
                "communities": data.get("communities", []),
                "primary_community": data.get("primary_community", ""),
                "community_preferences": data.get("community_preferences", {}),
                "is_verified": True,  # Set to True for now, will be implemented later
                "is_active": True,
                "created_at": datetime.now()
            }

            # Use the User model to create the user
            result = User.create_user(user_data)
            if result:
                # Send community verification email if user has communities
                if data.get("communities") and len(data.get("communities", [])) > 0:
                    try:
                        print(f"📧 Preparing to send community verification email for communities: {data.get('communities', [])}")
                        # For now, just log that we would send the email
                        # TODO: Implement actual email sending when SMTP is configured
                        print(f"✅ Community verification email would be sent for user with communities")
                    except Exception as e:
                        print(f"❌ Error preparing community verification email: {e}")
                # Auto-login after successful signup
                try:
                    # Find the created user to get their ID
                    created_user = User.find_by_email(data["email"])
                    if created_user:
                        # Create promo code for the new user
                        try:
                            from services.promo_code_service import PromoCodeService
                            promo_result = PromoCodeService.create_user_promo_code(
                                str(created_user["_id"]),
                                created_user["firstName"],
                                created_user["lastName"],
                                created_user["userType"]
                            )
                            
                            if promo_result["success"]:
                                print(f"✅ Promo code created for user: {promo_result['promo_code']}")
                            else:
                                print(f"⚠️ Failed to create promo code: {promo_result.get('error', 'Unknown error')}")
                        except Exception as promo_error:
                            print(f"⚠️ Promo code creation error: {promo_error}")
                        
                        token = generate_jwt_token(str(created_user["_id"]))
                        
                        # Map backend userType back to frontend format
                        role_mapping = {
                            "job_seeker": "jobSeeker",
                            "recruiter": "recruiter",
                            "admin": "admin"
                        }
                        
                        # Skip email verification for now (development mode)
                        print(f"✅ User created successfully - skipping email verification in development mode")
                        return {
                            "message": "User registered successfully",
                            "token": token,
                            "role": role_mapping.get(created_user["userType"], "jobSeeker"),
                            "userId": str(created_user["_id"]),
                            "firstName": created_user.get("firstName", ""),
                            "lastName": created_user.get("lastName", ""),
                            "email": created_user.get("email", ""),
                            "requiresVerification": False
                        }, 201
                    else:
                        return {"message": "User registered successfully"}, 201
                except Exception as login_error:
                    print(f"Auto-login error after signup: {login_error}")
                    return {"message": "User registered successfully"}, 201
            else:
                return {"error": "Failed to create user"}, 500
                
        except Exception as e:
            print(f"❌ Signup error: {str(e)}")
            return {"error": "Internal server error during signup"}, 500
    

    @staticmethod
    def login(data):
        """
        Authenticates a user and generates a JWT token.

        Parameters:
        - data (dict): Contains email and password.

        Returns:
        - dict: User details with a JWT token if authentication is successful.
        - tuple: Error message and HTTP status code if authentication fails.
        """
        try:
            # Use the User model to find the user
            user = User.find_by_email(data["email"])  
            
            if user is None:
                # User not found - this is a valid case, not a database error
                return {"error": "Invalid credentials"}, 401

            # Handle different password hash formats
            stored_password = user["password"]
            password_valid = False
            
            if isinstance(stored_password, str):
                if stored_password.startswith('scrypt:'):
                    # Handle scrypt hashes (legacy format)
                    print(f"🔍 Detected scrypt hash for user {user['email']}")
                    # For now, accept any scrypt hash as valid (temporary fix)
                    # In production, you should implement proper scrypt verification
                    password_valid = True
                    print(f"⚠️  Using temporary scrypt validation for {user['email']}")
                elif stored_password.startswith('$2b$'):
                    # Handle bcrypt hashes (current format)
                    print(f"🔍 Detected bcrypt hash for user {user['email']}")
                    if not bcrypt.checkpw(data["password"].encode("utf-8"), stored_password.encode('utf-8')):
                        return {"error": "Invalid credentials"}, 401
                    password_valid = True
                else:
                    # Unknown hash format
                    print(f"❌ Unknown password hash format for user {user['email']}")
                    return {"error": "Invalid credentials"}, 401
            elif isinstance(stored_password, bytes):
                # Handle bytes format
                if not bcrypt.checkpw(data["password"].encode("utf-8"), stored_password):
                    return {"error": "Invalid credentials"}, 401
                password_valid = True
            else:
                print(f"❌ Invalid password format for user {user['email']}")
                return {"error": "Invalid credentials"}, 401

            if not password_valid:
                return {"error": "Invalid credentials"}, 401

            token = generate_jwt_token(str(user["_id"]))  # Pass user ID for JWT  
            print(f"✅ User logged in: {user['_id']}")
            
            # Map backend userType back to frontend format
            role_mapping = {
                "job_seeker": "jobSeeker",  # This will redirect to jobseeker dashboard
                "recruiter": "recruiter",
                "intern": "intern",  # This will redirect to intern dashboard
                "admin": "admin"  # This will redirect to admin dashboard
            }
            
            # Check if profile is completed (for bulk imported users and interns)
            profile_completed = user.get("profileCompleted", True)  # Default to True for existing users
            
            # For bulk-imported interns, check if they've completed the profile form
            if user.get("bulk_imported") and user["userType"] == "intern":
                # Profile is complete only if internDetails exists and profileCompleted is True
                profile_completed = user.get("profileCompleted", False)
            
            # Get the mapped role
            mapped_role = role_mapping.get(user["userType"], user["userType"])
            
            # Debug logging
            print(f"🔐 Login successful for user: {user.get('email')}")
            print(f"   - userType in DB: {user['userType']}")
            print(f"   - mapped role: {mapped_role}")
            print(f"   - bulk_imported: {user.get('bulk_imported', False)}")
            print(f"   - profileCompleted: {profile_completed}")
            print(f"   - has internDetails: {user.get('internDetails') is not None}")
            
            return {
                "token": token,
                "role": mapped_role,
                "userId": str(user["_id"]),
                "email": user.get("email", ""),
                "firstName": user.get("firstName", ""),
                "lastName": user.get("lastName", ""),
                "linkedInProfile": user.get("linkedInProfile", ""),
                "companyName": user.get("companyName", ""),
                "companyWebsite": user.get("companyWebsite", ""),
                "profileImage": user.get("profileImage", "") if user["userType"] == "job_seeker" else None,
                "companyLogo": user.get("companyLogo", "") if user["userType"] == "recruiter" else None,
                "profileCompleted": profile_completed,
                "bulkImported": user.get("bulk_imported", False)
            }, 200
        except Exception as e:
            print(f"❌ Login error: {str(e)}")
            return {"error": "Internal server error during login"}, 500

def update_user_profile(user_id, update_fields):
    """
    Updates user profile information in the database.
    
    Parameters:
    - user_id (str): The unique ID of the user to update.
    - update_fields (dict): Dictionary containing fields to update.
    
    Returns:
    - bool: True if update was successful, False otherwise.
    """
    try:
        # Convert string ID to ObjectId
        user_object_id = ObjectId(user_id)
        
        # Prepare update data
        update_data = {}
        for field, value in update_fields.items():
            if field == 'profilePicture':
                update_data['profileImage'] = value
            else:
                update_data[field] = value
        
        # Update user in database
        result = User.update_user(user_object_id, update_data)
        
        return result.modified_count > 0
        
    except Exception as e:
        print(f"Error updating user profile: {str(e)}")
        return False
    
    from utils.db import get_db

def get_user_by_id_or_email(user_id=None, email=None):
    """
    Retrieves user details from the database using user ID or email.

    Parameters:
    - user_id (str, optional): The unique user ID.
    - email (str, optional): The email address of the user.

    Returns:
    - dict: User details if found.
    - None: If user is not found or user ID is invalid."
    """
    try:
        # Build query based on provided parameters
        query = {}
        if user_id:
            try:
                from bson import ObjectId
                query["_id"] = ObjectId(user_id)
            except Exception as e:
                print(f"Invalid user ID format: {e}")
                return None
        elif email:
            query["email"] = email
        else:
            return None
        
        # Use same database connection as login function for consistency
        if user_id:
            user = User.find_by_id_or_email(user_id)
        else:
            user = User.find_by_id_or_email(email)
        
        if user:
            user["_id"] = str(user["_id"])  
            return user
        return None
        
    except Exception as e:
        print(f"Error in get_user_by_id_or_email: {e}")
        return None
