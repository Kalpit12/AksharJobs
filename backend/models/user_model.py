from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from utils.db import get_db
from datetime import datetime

# Don't initialize database connection at module import time
# This can cause crashes if MongoDB is not running
db = None
users = None
users_collection = None

def _get_collections():
    """Lazy-load database collections when needed"""
    global db, users, users_collection
    if db is None:
        db = get_db()
        if db is not None:
            users = db["users"]
            users_collection = db["users"]
        else:
            # Fallback to direct connection if get_db fails
            try:
                client = MongoClient('mongodb://localhost:27017/')
                db = client['resume_matcher']
                users = db["users"]
                users_collection = db["users"]
            except Exception as e:
                print(f"❌ Failed to connect to MongoDB: {e}")
                return None, None
    return users, users_collection

class User:
    """
    User Model for AksharJobs
    
    Base Fields (All Users):
    - userType, firstName, lastName, email, password, phoneNumber
    - profileImage, linkedInProfile, communities, primary_community
    - subscription, akshar_coins, coin_transactions
    
    Comprehensive Recruiter Fields:
    Section 1 - Company Information:
    - companyName, websiteURL, companyLinkedIn, industries (array)
    - companySize, headquartersCountry, headquartersCity
    - operatingRegions (array), companyDescription, companyLogo
    
    Section 2 - Recruiter/HR Details:
    - recruiterFullName, designation, officialEmail, contactNumber
    - recruiterLinkedIn, preferredCommunication
    
    Section 3 - Job Preferences:
    - positionTypes (array), workType, hiringDepartments (array)
    - numberOfPositions, expectedStartDate, duration
    - compensationAmount, compensationCurrency, applicationDeadline, workHours
    
    Section 4 - Candidate Requirements:
    - preferredEducation, preferredFields (array), preferredSkills (array)
    - preferredSoftSkills (array), internSearchKeywords (array)
    - languageRequirements (array), minimumExperience, minimumAcademic
    
    Section 5 - Company Policy & Benefits:
    - provideCertificate, offerStipend, stipendRange, provideLOR, offerPPO
    - workCulture, perks (array)
    
    Section 6 - Hiring Process:
    - hiringStages (array), processDuration, interviewMode
    - interviewPlatforms (array), profileCompleted, profileCompletedAt
    """
    
    @staticmethod
    def create_user(data, profile_image=None, company_logo=None):
        users, _ = _get_collections()
        if users is None:
            return None
            
        hashed_password = generate_password_hash(data["password"])
        user = {
            "userType": data["userType"],
            "firstName": data["firstName"],
            "lastName": data["lastName"],
            "email": data["email"],
            "password": hashed_password,
            "phoneNumber": data.get("phoneNumber", ""),
            "linkedInProfile": data.get("linkedInProfile", ""),
            "companyName": data.get("companyName", ""),
            "companyWebsite": data.get("companyWebsite", ""),
            "location": data.get("location", ""),
            "industry": data.get("industry", ""),
            "companySize": data.get("companySize", ""),
            "foundedYear": data.get("foundedYear", ""),
            "companyDescription": data.get("companyDescription", ""),
            "profileImage": profile_image if data["userType"] == "job_seeker" else None,  # Profile for Job Seeker
            "companyLogo": company_logo if data["userType"] == "recruiter" else None,  # Logo for Recruiter
            # Community-related fields
            "communities": data.get("communities", []),  # List of community IDs user belongs to
            "primary_community": data.get("primary_community", ""),  # Primary community ID
            "community_preferences": data.get("community_preferences", {}),  # Additional community settings
            # Community verification fields
            "community_verification_status": "pending",  # pending, verified, rejected
            "community_verification_requested_at": datetime.utcnow(),
            "community_verification_verified_at": None,
            "community_verification_verified_by": None,  # Community leader email who verified
            "subscription": {
                "plan": "Basic",
                "status": "active",
                "startDate": None,
                "endDate": None,
                "features": []
            },
            "free_applications": 0,  # For job seekers
            "free_job_posts": 0,     # For recruiters
            "free_resume_views": 0,  # For recruiters
            "promo_code_created": False,
            "akshar_coins": 10,  # Initial coin balance - everyone starts with 10 coins
            "coin_transactions": []  # Track coin earning and spending history
        }
        users.insert_one(user)
        return user

    @staticmethod
    def find_by_email(email):
        users, _ = _get_collections()
        if users is None:
            return None
        return users.find_one({"email": email})

    @staticmethod
    def verify_password(hashed_password, password):
        return check_password_hash(hashed_password, password)

    @staticmethod
    def find_by_id(user_id):
        users, _ = _get_collections()
        if users is None:
            return None
            
        from bson import ObjectId
        if not ObjectId.is_valid(user_id):
            return None
        return users.find_one({"_id": ObjectId(user_id)})
    
    @staticmethod
    def get_by_id(db, user_id):
        """Get user by ID from the provided database connection"""
        from bson import ObjectId
        if not ObjectId.is_valid(user_id):
            return None
        return db.users.find_one({"_id": ObjectId(user_id)})
    
    @staticmethod
    def update_profile(db, user_id, update_data):
        """Update user profile with resume data"""
        try:
            from bson import ObjectId
            if not ObjectId.is_valid(user_id):
                return False
            
            result = db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            return result.modified_count > 0 or result.matched_count > 0
        except Exception as e:
            print(f"Error updating user profile: {str(e)}")
            return False
    
    @staticmethod
    def update_user(user_id, update_data):
        """Update user data"""
        try:
            users, _ = _get_collections()
            if users is None:
                return None
                
            from bson import ObjectId
            if not ObjectId.is_valid(user_id):
                return None
            
            result = users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            return result
        except Exception as e:
            print(f"Error updating user: {str(e)}")
            return None
    
    @staticmethod
    def find_by_id_or_email(query):
        """Find user by ID or email"""
        try:
            users, _ = _get_collections()
            if users is None:
                return None
                
            from bson import ObjectId
            if ObjectId.is_valid(query):
                # Query is a valid ObjectId
                return users.find_one({"_id": ObjectId(query)}, {"password": 0})
            else:
                # Query is an email
                return users.find_one({"email": query}, {"password": 0})
        except Exception as e:
            print(f"Error finding user: {str(e)}")
            return None
