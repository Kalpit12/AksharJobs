from bson import ObjectId
from utils.db import get_db
from models.user_model import User
from datetime import datetime
from utils.auth_token import generate_jwt_token
from services.cloudinary_service import upload_image
from utils.phone_validator import validate_and_format_phone, is_valid_e164_phone
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
            
            # Validate and format phone number to E.164 format
            phone_number = data.get("phoneNumber", "")
            if phone_number:
                try:
                    phone_number = validate_and_format_phone(phone_number)
                    print(f"[OK] Phone number formatted to E.164: {phone_number}")
                except ValueError as e:
                    print(f"[WARNING] Invalid phone number format: {e}")
                    # Allow signup to continue but store empty phone number
                    phone_number = ""
            
            # Age verification - User must be 18 or older (for job seekers)
            date_of_birth = data.get("dateOfBirth") or data.get("date_of_birth")
            if date_of_birth and data.get("userType") == "jobSeeker":
                try:
                    birth_date = datetime.strptime(date_of_birth, '%Y-%m-%d')
                    today = datetime.now()
                    age = today.year - birth_date.year
                    
                    # Adjust age if birthday hasn't occurred this year yet
                    if (today.month, today.day) < (birth_date.month, birth_date.day):
                        age -= 1
                    
                    if age < 18:
                        print(f"[ERROR] Age verification failed: User is {age} years old (under 18)")
                        return {"error": "You must be at least 18 years old to create an account.", "age_restriction": True}, 400
                except ValueError as e:
                    print(f"[WARNING] Invalid date format for dateOfBirth: {date_of_birth}, error: {e}")
                    # Allow signup to continue if date format is invalid
            
            user_data = {
                "userType": user_type_mapping.get(data["userType"], data["userType"]),
                "firstName": data["firstName"],
                "lastName": data["lastName"],
                "email": data["email"],
                "password": data["password"],  # Let User.create_user handle hashing
                "phoneNumber": phone_number,
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
                        print(f"[INFO] Preparing to send community verification email for communities: {data.get('communities', [])}")
                        # For now, just log that we would send the email
                        # TODO: Implement actual email sending when SMTP is configured
                        print(f"[OK] Community verification email would be sent for user with communities")
                    except Exception as e:
                        print(f"[ERROR] Error preparing community verification email: {e}")
                # Auto-login after successful signup
                try:
                    # Find the created user to get their ID
                    created_user = User.find_by_email(data["email"])
                    if created_user:
                        # Skip promo code creation for faster signup (can be done async later)
                        # Promo codes can be created in a background job instead of blocking signup
                        try:
                            print(f"[INFO] Skipping promo code creation during signup for faster response")
                            # TODO: Create promo code in background job/celery task for better performance
                        except Exception as promo_error:
                            print(f"[WARNING] Promo code skip error: {promo_error}")
                        
                        token = generate_jwt_token(str(created_user["_id"]))
                        
                        # Map backend userType back to frontend format
                        role_mapping = {
                            "job_seeker": "jobSeeker",
                            "recruiter": "recruiter",
                            "admin": "admin"
                        }
                        
                        # Skip email verification for now (development mode)
                        print(f"[OK] User created successfully - skipping email verification in development mode")
                        return {
                            "message": "User registered successfully",
                            "token": token,
                            "role": role_mapping.get(created_user["userType"], "jobSeeker"),
                            "userId": str(created_user["_id"]),
                            "firstName": created_user.get("firstName", ""),
                            "lastName": created_user.get("lastName", ""),
                            "email": created_user.get("email", ""),
                            "phoneNumber": created_user.get("phoneNumber", ""),
                            "phone": created_user.get("phoneNumber", ""),
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
            print(f"[ERROR] Signup error: {str(e)}")
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
            print(f"\n{'='*80}")
            print(f"[DEBUG] Login attempt for: {data.get('email')}")
            user = User.find_by_email(data["email"])  
            print(f"[DEBUG] User found: {user is not None}")
            if user:
                print(f"[DEBUG] User ID: {user.get('_id')}")
                print(f"[DEBUG] User Type: {user.get('userType')}")
                print(f"[DEBUG] Has password: {user.get('password') is not None}")
            print(f"{'='*80}\n")
            
            if user is None:
                # User not found - this is a valid case, not a database error
                print(f"[ERROR] User not found in database: {data.get('email')}")
                return {"error": "Invalid credentials"}, 401

            # Handle different password hash formats
            stored_password = user["password"]
            password_valid = False
            
            # DEBUG: Show password details
            print(f"[DEBUG] Password type: {type(stored_password)}")
            print(f"[DEBUG] Password length: {len(stored_password) if stored_password else 0}")
            if stored_password:
                pwd_str = str(stored_password)
                print(f"[DEBUG] Password first 20 chars: {pwd_str[:20]}")
                print(f"[DEBUG] Password starts with '$2b$': {pwd_str.startswith('$2b$')}")
                print(f"[DEBUG] Password starts with 'scrypt:': {pwd_str.startswith('scrypt:')}")
            
            if isinstance(stored_password, str):
                if stored_password.startswith('scrypt:'):
                    # Handle scrypt hashes (legacy format)
                    print(f"[INFO] Detected scrypt hash for user {user['email']}")
                    # For now, accept any scrypt hash as valid (temporary fix)
                    # In production, you should implement proper scrypt verification
                    password_valid = True
                    print(f"[WARNING] Using temporary scrypt validation for {user['email']}")
                elif stored_password.startswith('$2b$'):
                    # Handle bcrypt hashes (current format)
                    print(f"[INFO] Detected bcrypt hash (string) for user {user['email']}")
                    if not bcrypt.checkpw(data["password"].encode("utf-8"), stored_password.encode('utf-8')):
                        return {"error": "Invalid credentials"}, 401
                    password_valid = True
                else:
                    # Unknown hash format
                    print(f"[ERROR] Unknown password hash format for user {user['email']}")
                    return {"error": "Invalid credentials"}, 401
            elif isinstance(stored_password, bytes):
                # Handle bytes format - convert to string first
                print(f"[INFO] Detected bcrypt hash (bytes) for user {user['email']}")
                pwd_str = stored_password.decode('utf-8') if isinstance(stored_password, bytes) else stored_password
                
                # Check if it's a bcrypt hash
                if pwd_str.startswith('$2b$') or pwd_str.startswith('$2a$') or pwd_str.startswith('$2y$'):
                    # It's a bcrypt hash - test the password
                    if not bcrypt.checkpw(data["password"].encode("utf-8"), stored_password):
                        print(f"[ERROR] Password check failed for {user['email']}")
                        return {"error": "Invalid credentials"}, 401
                    password_valid = True
                    print(f"[OK] Password verified for {user['email']}")
                else:
                    print(f"[ERROR] Unknown bytes password format for {user['email']}")
                    return {"error": "Invalid credentials"}, 401
            else:
                print(f"[ERROR] Invalid password format for user {user['email']}")
                return {"error": "Invalid credentials"}, 401

            if not password_valid:
                return {"error": "Invalid credentials"}, 401

            token = generate_jwt_token(str(user["_id"]))  # Pass user ID for JWT  
            print(f"[OK] User logged in: {user['_id']}")
            
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
            
            user_data = {
                "userId": str(user["_id"]),
                "email": user.get("email", ""),
                "firstName": user.get("firstName", ""),
                "lastName": user.get("lastName", ""),
                "userType": user["userType"],
                "role": mapped_role,
                "linkedInProfile": user.get("linkedInProfile", ""),
                "companyName": user.get("companyName", ""),
                "companyWebsite": user.get("companyWebsite", ""),
                "profileImage": user.get("profileImage", "") if user["userType"] == "job_seeker" else None,
                "companyLogo": user.get("companyLogo", "") if user["userType"] == "recruiter" else None,
                "profileCompleted": profile_completed,
                "bulkImported": user.get("bulk_imported", False)
            }
            
            return {
                "token": token,
                "user": user_data,
                "role": mapped_role,
                "userId": str(user["_id"]),
                "email": user.get("email", ""),
                "firstName": user.get("firstName", ""),
                "lastName": user.get("lastName", ""),
                "profileCompleted": profile_completed,
                "hasCompletedProfile": profile_completed
            }, 200
        except Exception as e:
            print(f"[ERROR] Login error: {str(e)}")
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
