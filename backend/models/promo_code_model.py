from pymongo import MongoClient
from utils.db import get_db
from datetime import datetime, timedelta
import random
import string

# Don't initialize database connection at module import time
db = None
promo_codes = None
promo_codes_collection = None

def _get_collections():
    """Lazy-load database collections when needed"""
    global db, promo_codes, promo_codes_collection
    if db is None:
        db = get_db()
        if db is not None:
            promo_codes = db["promo_codes"]
            promo_codes_collection = db["promo_codes"]
        else:
            # Fallback to direct connection if get_db fails
            try:
                client = MongoClient('mongodb://localhost:27017/')
                db = client['TalentMatchDB']  # Use correct database
                promo_codes = db["promo_codes"]
                promo_codes_collection = db["promo_codes"]
            except Exception as e:
                print(f"❌ Failed to connect to MongoDB: {e}")
                return None, None
    return promo_codes, promo_codes_collection

class PromoCode:
    @staticmethod
    def generate_promo_code(first_name, last_name, user_id):
        """
        Generate a unique promo code based on user's name and ID
        
        Args:
            first_name (str): User's first name
            last_name (str): User's last name
            user_id (str): User's ID
            
        Returns:
            str: Generated promo code
        """
        # Create base from first 3 chars of first name and last name
        base = f"{first_name[:3].upper()}{last_name[:3].upper()}"
        
        # Add random 4-digit number
        random_num = random.randint(1000, 9999)
        
        # Add last 4 chars of user_id for uniqueness
        user_suffix = str(user_id)[-4:] if len(str(user_id)) >= 4 else str(user_id).zfill(4)
        
        promo_code = f"{base}{random_num}{user_suffix}"
        return promo_code

    @staticmethod
    def create_promo_code(user_id, first_name, last_name, user_type):
        """
        Create a new promo code for a user
        
        Args:
            user_id (str): User's ID
            first_name (str): User's first name
            last_name (str): User's last name
            user_type (str): Type of user (job_seeker or recruiter)
            
        Returns:
            dict: Created promo code data or None if failed
        """
        promo_codes, _ = _get_collections()
        if promo_codes is None:
            return None
            
        # Generate unique promo code
        promo_code = PromoCode.generate_promo_code(first_name, last_name, user_id)
        
        # Ensure uniqueness
        while promo_codes.find_one({"code": promo_code}):
            promo_code = PromoCode.generate_promo_code(first_name, last_name, user_id)
        
        promo_data = {
            "code": promo_code,
            "owner_id": user_id,
            "owner_name": f"{first_name} {last_name}",
            "owner_type": user_type,
            "created_at": datetime.now(),
            "expires_at": datetime.now() + timedelta(days=365),  # Valid for 1 year
            "is_active": True,
            "usage_count": 0,
            "max_uses": 10,  # Each promo code can be used 10 times
            "benefits": {
                "jobSeeker": {
                    "free_applications": 1,
                    "description": "1 free job application"
                },
                "job_seeker": {
                    "free_applications": 1,
                    "description": "1 free job application"
                },
                "recruiter": {
                    "free_job_posts": 1,
                    "free_resume_views": 5,
                    "description": "1 free job post + 5 free resume views"
                }
            },
            "used_by": []  # Track who used this promo code
        }
        
        try:
            result = promo_codes.insert_one(promo_data)
            if result.inserted_id:
                promo_data["_id"] = result.inserted_id
                return promo_data
        except Exception as e:
            print(f"❌ Error creating promo code: {e}")
            return None

    @staticmethod
    def find_by_code(code):
        """
        Find promo code by code string
        
        Args:
            code (str): Promo code to search for
            
        Returns:
            dict: Promo code data or None if not found
        """
        promo_codes, _ = _get_collections()
        if promo_codes is None:
            return None
        return promo_codes.find_one({"code": code, "is_active": True})

    @staticmethod
    def find_by_owner_id(owner_id):
        """
        Find promo code by owner ID
        
        Args:
            owner_id (str): Owner's user ID
            
        Returns:
            dict: Promo code data or None if not found
        """
        promo_codes, _ = _get_collections()
        if promo_codes is None:
            return None
        return promo_codes.find_one({"owner_id": owner_id, "is_active": True})

    @staticmethod
    def validate_and_use(code, user_id, user_type):
        """
        Validate and use a promo code
        
        Args:
            code (str): Promo code to validate
            user_id (str): User trying to use the code
            user_type (str): Type of user (job_seeker or recruiter)
            
        Returns:
            dict: Validation result with benefits or error message
        """
        promo_codes, _ = _get_collections()
        if promo_codes is None:
            return {"success": False, "error": "Database connection failed"}
        
        # Find the promo code
        promo_code = promo_codes.find_one({"code": code, "is_active": True})
        
        if not promo_code:
            return {"success": False, "error": "Invalid promo code"}
        
        # Check if expired
        if promo_code["expires_at"] < datetime.now():
            return {"success": False, "error": "Promo code has expired"}
        
        # Check if user is trying to use their own code
        if promo_code["owner_id"] == user_id:
            return {"success": False, "error": "You cannot use your own promo code"}
        
        # Check if user has already used this code
        if user_id in promo_code.get("used_by", []):
            return {"success": False, "error": "You have already used this promo code"}
        
        # Check if max uses reached
        if promo_code["usage_count"] >= promo_code["max_uses"]:
            return {"success": False, "error": "This promo code has reached its usage limit"}
        
        # Update usage
        try:
            promo_codes.update_one(
                {"_id": promo_code["_id"]},
                {
                    "$inc": {"usage_count": 1},
                    "$push": {"used_by": user_id}
                }
            )
            
            # Return benefits based on user type
            benefits = promo_code["benefits"].get(user_type, {})
            return {
                "success": True,
                "benefits": benefits,
                "owner_name": promo_code["owner_name"]
            }
        except Exception as e:
            print(f"❌ Error updating promo code usage: {e}")
            return {"success": False, "error": "Failed to process promo code"}

    @staticmethod
    def get_user_promo_stats(owner_id):
        """
        Get promo code statistics for a user
        
        Args:
            owner_id (str): Owner's user ID
            
        Returns:
            dict: Promo code statistics
        """
        promo_codes, _ = _get_collections()
        if promo_codes is None:
            return None
        
        promo_code = promo_codes.find_one({"owner_id": owner_id, "is_active": True})
        
        if not promo_code:
            return None
        
        return {
            "code": promo_code["code"],
            "usage_count": promo_code["usage_count"],
            "max_uses": promo_code["max_uses"],
            "remaining_uses": promo_code["max_uses"] - promo_code["usage_count"],
            "created_at": promo_code["created_at"],
            "expires_at": promo_code["expires_at"],
            "used_by_count": len(promo_code.get("used_by", [])),
            "is_active": promo_code["is_active"]
        }

    @staticmethod
    def deactivate_promo_code(owner_id):
        """
        Deactivate a user's promo code
        
        Args:
            owner_id (str): Owner's user ID
            
        Returns:
            bool: True if successful, False otherwise
        """
        promo_codes, _ = _get_collections()
        if promo_codes is None:
            return False
        
        try:
            result = promo_codes.update_one(
                {"owner_id": owner_id, "is_active": True},
                {"$set": {"is_active": False}}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"❌ Error deactivating promo code: {e}")
            return False
