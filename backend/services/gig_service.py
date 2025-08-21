from models.gig_model import Gig, GigApplication
from bson import ObjectId
from datetime import datetime

class GigService:
    @staticmethod
    def create_gig_service(gig_data, user_id):
        try:
            # Validate required fields
            required_fields = ["title", "description", "category", "skills_required", "budget", "duration", "urgency", "location", "deadline"]
            for field in required_fields:
                if field not in gig_data:
                    return {"success": False, "error": f"Missing required field: {field}"}
            
            # Validate budget
            if gig_data["budget"]["min_amount"] > gig_data["budget"]["max_amount"]:
                return {"success": False, "error": "Minimum budget cannot be greater than maximum budget"}
            
            # Validate deadline
            deadline = datetime.fromisoformat(gig_data["deadline"].replace('Z', '+00:00'))
            if deadline <= datetime.utcnow():
                return {"success": False, "error": "Deadline must be in the future"}
            
            # Get user role and apply role-based restrictions
            from models.user_model import User
            user = User.find_by_id(user_id)
            if not user:
                return {"success": False, "error": "User not found"}
            
            user_role = user.get("userType")
            
            # Role-based validation
            if user_role == "recruiter":
                # Recruiters can post company gigs with higher budgets
                if gig_data["budget"]["max_amount"] < 5000:
                    return {"success": False, "error": "Recruiter gigs must have a minimum budget of KES 5,000"}
                if gig_data["budget"]["max_amount"] > 1000000:
                    return {"success": False, "error": "Recruiter gigs cannot exceed KES 1,000,000"}
                    
            elif user_role == "job_seeker":
                # Job seekers can post service offerings with reasonable budgets
                if gig_data["budget"]["max_amount"] > 100000:
                    return {"success": False, "error": "Job seeker gigs cannot exceed KES 100,000"}
                if gig_data["budget"]["min_amount"] < 500:
                    return {"success": False, "error": "Job seeker gigs must have a minimum budget of KES 500"}
                    
            else:
                return {"success": False, "error": "Invalid user role"}
            
            # Additional validation based on category and role
            if user_role == "job_seeker":
                # Job seekers are limited to service-based categories
                service_categories = [
                    "Content Writing", "Virtual Assistant", "Translation", 
                    "Video Editing", "Social Media Management", "Data Entry",
                    "Research", "Administrative", "Other"
                ]
                if gig_data["category"] not in service_categories:
                    return {"success": False, "error": "Job seekers can only post service-based gigs"}
            
            gig = Gig.create_gig(gig_data, user_id)
            return {"success": True, "gig": gig}
            
        except Exception as e:
            return {"success": False, "error": str(e)}

    @staticmethod
    def get_gigs_service(filters=None, page=1, limit=10):
        try:
            # Validate pagination
            if page < 1:
                page = 1
            if limit < 1 or limit > 50:
                limit = 10
            
            gigs = Gig.get_gigs(filters, page, limit)
            
            # Convert ObjectId to string for JSON serialization
            for gig in gigs:
                gig["_id"] = str(gig["_id"])
                gig["posted_by"] = str(gig["posted_by"])
                if gig["selected_freelancer"]:
                    gig["selected_freelancer"] = str(gig["selected_freelancer"])
            
            return {"success": True, "gigs": gigs, "page": page, "limit": limit}
            
        except Exception as e:
            return {"success": False, "error": str(e)}

    @staticmethod
    def get_gig_by_id_service(gig_id):
        try:
            if not ObjectId.is_valid(gig_id):
                return {"success": False, "error": "Invalid gig ID"}
            
            gig = Gig.get_gig_by_id(ObjectId(gig_id))
            if not gig:
                return {"success": False, "error": "Gig not found"}
            
            # Convert ObjectId to string
            gig["_id"] = str(gig["_id"])
            gig["posted_by"] = str(gig["posted_by"])
            if gig["selected_freelancer"]:
                gig["selected_freelancer"] = str(gig["selected_freelancer"])
            
            return {"success": True, "gig": gig}
            
        except Exception as e:
            return {"success": False, "error": str(e)}

    @staticmethod
    def apply_for_gig_service(gig_id, user_id, proposal, bid_amount):
        try:
            if not ObjectId.is_valid(gig_id):
                return {"success": False, "error": "Invalid gig ID"}
            
            # Check if gig exists and is open
            gig = Gig.get_gig_by_id(ObjectId(gig_id))
            if not gig:
                return {"success": False, "error": "Gig not found"}
            
            if gig["status"] != "open":
                return {"success": False, "error": "Gig is not open for applications"}
            
            # Check if user already applied
            existing_application = GigApplication.get_applications_for_gig(ObjectId(gig_id))
            for app in existing_application:
                if app["applicant_id"] == user_id:
                    return {"success": False, "error": "You have already applied for this gig"}
            
            # Validate bid amount
            if bid_amount < gig["budget"]["min_amount"] or bid_amount > gig["budget"]["max_amount"]:
                return {"success": False, "error": "Bid amount must be within the specified budget range"}
            
            application = GigApplication.apply_for_gig(ObjectId(gig_id), user_id, proposal, bid_amount)
            application["_id"] = str(application["_id"])
            application["gig_id"] = str(application["gig_id"])
            
            return {"success": True, "application": application}
            
        except Exception as e:
            return {"success": False, "error": str(e)}

    @staticmethod
    def get_gig_applications_service(gig_id, user_id):
        try:
            if not ObjectId.is_valid(gig_id):
                return {"success": False, "error": "Invalid gig ID"}
            
            # Check if user is the gig poster
            gig = Gig.get_gig_by_id(ObjectId(gig_id))
            if not gig:
                return {"success": False, "error": "Gig not found"}
            
            if str(gig["posted_by"]) != user_id:
                return {"success": False, "error": "Unauthorized access"}
            
            applications = GigApplication.get_applications_for_gig(ObjectId(gig_id))
            
            # Convert ObjectIds to strings
            for app in applications:
                app["_id"] = str(app["_id"])
                app["gig_id"] = str(app["gig_id"])
                app["applicant_id"] = str(app["applicant_id"])
            
            return {"success": True, "applications": applications}
            
        except Exception as e:
            return {"success": False, "error": str(e)}

    @staticmethod
    def accept_gig_application_service(application_id, gig_id, user_id):
        try:
            if not ObjectId.is_valid(application_id) or not ObjectId.is_valid(gig_id):
                return {"success": False, "error": "Invalid ID"}
            
            # Check if user is the gig poster
            gig = Gig.get_gig_by_id(ObjectId(gig_id))
            if not gig:
                return {"success": False, "error": "Gig not found"}
            
            if str(gig["posted_by"]) != user_id:
                return {"success": False, "error": "Unauthorized access"}
            
            if gig["status"] != "open":
                return {"success": False, "error": "Gig is not open for applications"}
            
            # Accept the application
            GigApplication.accept_application(ObjectId(application_id), ObjectId(gig_id))
            
            return {"success": True, "message": "Application accepted successfully"}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
