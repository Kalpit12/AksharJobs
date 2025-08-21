from bson import ObjectId
from utils.db import get_db
from models.user_model import users_collection
import bcrypt
from utils.auth_token import generate_jwt_token
from services.cloudinary_service import upload_image
from pymongo import MongoClient

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

        if users_collection.find_one({"email": data["email"]}):
            return {"error": "User already exists"}, 400

        # Hash the password
        hashed_password = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt())

        # Map frontend userType to backend format
        user_type_mapping = {
            "jobSeeker": "job_seeker",
            "recruiter": "recruiter"
        }
        
        user_data = {
            "userType": user_type_mapping.get(data["userType"], data["userType"]),
            "firstName": data["firstName"],
            "lastName": data["lastName"],
            "email": data["email"],
            "password": hashed_password,
            "phoneNumber": data.get("phoneNumber", ""),
            "linkedInProfile": data.get("linkedInProfile", ""),
            "companyName": data.get("companyName", ""),
            "companyWebsite": data.get("companyWebsite", ""),
            "profileImage": profile_image_url, 
            "companyLogo": company_logo_url
        }

        users_collection.insert_one(user_data)
        return {"message": "User registered successfully"}, 201
    

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
        # Use same database as admin routes for consistency
        client = MongoClient('mongodb://localhost:27017/')
        db = client['resume_matcher']
        user = db.users.find_one({"email": data["email"]})  
    
        if not user or not bcrypt.checkpw(data["password"].encode("utf-8"), user["password"]):
            return {"error": "Invalid credentials"}, 401

        token = generate_jwt_token(str(user["_id"]))  # Pass user ID for JWT  
        print(user["_id"])
        # Map backend userType back to frontend format
        role_mapping = {
            "job_seeker": "jobSeeker",  # This will redirect to jobseeker dashboard
            "recruiter": "recruiter",
            "admin": "admin"  # This will redirect to admin dashboard
        }
        
        return {
            "token": token,
            "role": role_mapping.get(user["userType"], user["userType"]),
            "userId": str(user["_id"]),
            "firstName":user["firstName"],
            "lastName":user["lastName"],
            "linkedInProfile":user["linkedInProfile"],
            "companyName":user["companyName"],
            "companyWebsite":user["companyWebsite"],
            "profileImage": user.get("profileImage", "") if user["userType"] == "job_seeker" else None,
            "companyLogo": user.get("companyLogo", "") if user["userType"] == "recruiter" else None
       }, 200

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
        result = users_collection.update_one(
            {"_id": user_object_id},
            {"$set": update_data}
        )
        
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
    # Use same database connection as login function for consistency
    client = MongoClient('mongodb://localhost:27017/')
    db = client['resume_matcher']
    user_collection = db['users']

    query = {}
    if user_id:
        try:
            query["_id"] = ObjectId(user_id)  
        except:
            return None  
    elif email:
        query["email"] = email  

    user = user_collection.find_one(query, {"password": 0})  
    
    if user:
        user["_id"] = str(user["_id"])  
        return user
    return None
