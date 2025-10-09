from models.promo_code_model import PromoCode
from models.user_model import User
from utils.db import get_db
from datetime import datetime
from services.coin_service import CoinService

class PromoCodeService:
    """
    Service class for handling promo code operations
    """
    
    @staticmethod
    def create_user_promo_code(user_id, first_name, last_name, user_type):
        """
        Create a promo code for a new user during signup
        
        Args:
            user_id (str): User's ID
            first_name (str): User's first name
            last_name (str): User's last name
            user_type (str): Type of user (job_seeker or recruiter)
            
        Returns:
            dict: Created promo code data or error message
        """
        try:
            # Check if user already has a promo code
            existing_promo = PromoCode.find_by_owner_id(user_id)
            if existing_promo:
                return {
                    "success": True,
                    "message": "User already has a promo code",
                    "promo_code": existing_promo["code"]
                }
            
            # Create new promo code
            promo_data = PromoCode.create_promo_code(user_id, first_name, last_name, user_type)
            
            if promo_data:
                # Get benefits for user type (handle both formats)
                benefits = promo_data["benefits"].get(user_type) or promo_data["benefits"].get("job_seeker" if user_type == "jobSeeker" else user_type)
                
                return {
                    "success": True,
                    "message": "Promo code created successfully",
                    "promo_code": promo_data["code"],
                    "benefits": benefits
                }
            else:
                return {
                    "success": False,
                    "error": "Failed to create promo code"
                }
        except Exception as e:
            print(f"❌ Error in create_user_promo_code: {e}")
            return {
                "success": False,
                "error": "Internal server error"
            }
    
    @staticmethod
    def get_user_promo_code(user_id):
        """
        Get user's promo code
        
        Args:
            user_id (str): User's ID
            
        Returns:
            dict: Promo code data or error message
        """
        try:
            promo_stats = PromoCode.get_user_promo_stats(user_id)
            
            if promo_stats:
                return {
                    "success": True,
                    "promo_code": promo_stats
                }
            else:
                return {
                    "success": False,
                    "error": "No promo code found for this user"
                }
        except Exception as e:
            print(f"❌ Error in get_user_promo_code: {e}")
            return {
                "success": False,
                "error": "Internal server error"
            }
    
    @staticmethod
    def use_promo_code(code, user_id, user_type):
        """
        Use a promo code and apply benefits to user
        
        Args:
            code (str): Promo code to use
            user_id (str): User's ID
            user_type (str): Type of user (job_seeker or recruiter)
            
        Returns:
            dict: Result with benefits or error message
        """
        try:
            # Validate and use the promo code
            result = PromoCode.validate_and_use(code, user_id, user_type)
            
            if not result["success"]:
                return result
            
            # Apply benefits to user account
            benefits = result["benefits"]
            db = get_db()
            users = db["users"]
            
            # Update user's free credits
            update_data = {}
            
            if user_type == "job_seeker":
                if "free_applications" in benefits:
                    update_data["free_applications"] = benefits["free_applications"]
            elif user_type == "recruiter":
                if "free_job_posts" in benefits:
                    update_data["free_job_posts"] = benefits["free_job_posts"]
                if "free_resume_views" in benefits:
                    update_data["free_resume_views"] = benefits["free_resume_views"]
            
            if update_data:
                users.update_one(
                    {"_id": user_id},
                    {"$inc": update_data}  # Increment the free credits
                )
            
            # Award Akshar Coins to the promo code owner
            try:
                promo_code_data = PromoCode.find_by_code(code)
                if promo_code_data and promo_code_data.get("owner_id"):
                    owner_id = promo_code_data["owner_id"]
                    # Award 50 coins to the owner for someone using their promo code
                    CoinService.earn_coins(
                        owner_id,
                        CoinService.COIN_REWARDS["promo_code_used"],
                        f"Promo code used by another user",
                        reference_id=code
                    )
            except Exception as coin_error:
                print(f"⚠️ Failed to award coins to promo code owner: {coin_error}")
                # Don't fail the whole operation if coin award fails
            
            return {
                "success": True,
                "message": f"Promo code used successfully! You received: {benefits.get('description', 'benefits')}",
                "benefits": benefits,
                "owner_name": result["owner_name"]
            }
        except Exception as e:
            print(f"❌ Error in use_promo_code: {e}")
            return {
                "success": False,
                "error": "Internal server error"
            }
    
    @staticmethod
    def check_user_credits(user_id, user_type, action_type):
        """
        Check if user has credits for a specific action
        
        Args:
            user_id (str): User's ID
            user_type (str): Type of user (job_seeker or recruiter)
            action_type (str): Type of action (apply, post_job, view_resume)
            
        Returns:
            dict: Credit check result
        """
        try:
            db = get_db()
            users = db["users"]
            user = users.find_one({"_id": user_id})
            
            if not user:
                return {"success": False, "error": "User not found"}
            
            if user_type == "job_seeker" and action_type == "apply":
                free_applications = user.get("free_applications", 0)
                if free_applications > 0:
                    return {
                        "success": True,
                        "has_credit": True,
                        "credits_remaining": free_applications
                    }
                else:
                    return {
                        "success": True,
                        "has_credit": False,
                        "message": "No free applications remaining. Use a promo code to get free applications!"
                    }
            
            elif user_type == "recruiter" and action_type == "post_job":
                free_job_posts = user.get("free_job_posts", 0)
                if free_job_posts > 0:
                    return {
                        "success": True,
                        "has_credit": True,
                        "credits_remaining": free_job_posts
                    }
                else:
                    return {
                        "success": True,
                        "has_credit": False,
                        "message": "No free job posts remaining. Use a promo code to get free job posts!"
                    }
            
            elif user_type == "recruiter" and action_type == "view_resume":
                free_resume_views = user.get("free_resume_views", 0)
                if free_resume_views > 0:
                    return {
                        "success": True,
                        "has_credit": True,
                        "credits_remaining": free_resume_views
                    }
                else:
                    return {
                        "success": True,
                        "has_credit": False,
                        "message": "No free resume views remaining. Use a promo code to get free resume views!"
                    }
            
            return {"success": False, "error": "Invalid action type"}
            
        except Exception as e:
            print(f"❌ Error in check_user_credits: {e}")
            return {"success": False, "error": "Internal server error"}
    
    @staticmethod
    def consume_credit(user_id, user_type, action_type):
        """
        Consume a credit for a specific action
        
        Args:
            user_id (str): User's ID
            user_type (str): Type of user (job_seeker or recruiter)
            action_type (str): Type of action (apply, post_job, view_resume)
            
        Returns:
            dict: Result of credit consumption
        """
        try:
            db = get_db()
            users = db["users"]
            
            # Check if user has credits
            credit_check = PromoCodeService.check_user_credits(user_id, user_type, action_type)
            if not credit_check["success"] or not credit_check["has_credit"]:
                return credit_check
            
            # Consume the credit
            update_field = None
            if user_type == "job_seeker" and action_type == "apply":
                update_field = "free_applications"
            elif user_type == "recruiter" and action_type == "post_job":
                update_field = "free_job_posts"
            elif user_type == "recruiter" and action_type == "view_resume":
                update_field = "free_resume_views"
            
            if update_field:
                result = users.update_one(
                    {"_id": user_id},
                    {"$inc": {update_field: -1}}
                )
                
                if result.modified_count > 0:
                    return {
                        "success": True,
                        "message": f"Credit consumed for {action_type}",
                        "credits_remaining": credit_check["credits_remaining"] - 1
                    }
                else:
                    return {"success": False, "error": "Failed to consume credit"}
            else:
                return {"success": False, "error": "Invalid action type"}
                
        except Exception as e:
            print(f"❌ Error in consume_credit: {e}")
            return {"success": False, "error": "Internal server error"}
