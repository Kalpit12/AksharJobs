from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from utils.db import get_db

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
            "phoneNumber": data["phoneNumber"],
            "linkedInProfile": data.get("linkedInProfile", ""),
            "companyName": data.get("companyName", ""),
            "companyWebsite": data.get("companyWebsite", ""),
            "profileImage": profile_image if data["userType"] == "job_seeker" else None,  # Profile for Job Seeker
            "companyLogo": company_logo if data["userType"] == "recruiter" else None,  # Logo for Recruiter
            "subscription": {
                "plan": "Basic",
                "status": "active",
                "startDate": None,
                "endDate": None,
                "features": []
            }
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
