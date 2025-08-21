from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from utils.db import get_db

db = get_db()
users = db["users"]

users_collection = db["users"]

class User:
    @staticmethod
    def create_user(data, profile_image=None, company_logo=None):
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
        return users.find_one({"email": email})

    @staticmethod
    def verify_password(hashed_password, password):
        return check_password_hash(hashed_password, password)

    @staticmethod
    def find_by_id(user_id):
        from bson import ObjectId
        if not ObjectId.is_valid(user_id):
            return None
        return users.find_one({"_id": ObjectId(user_id)})
