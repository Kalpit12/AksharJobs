from datetime import datetime
from utils.db import get_db

db = get_db()
gigs = db["gigs"]
gig_applications = db["gig_applications"]

class Gig:
    @staticmethod
    def create_gig(data, user_id):
        gig = {
            "title": data["title"],
            "description": data["description"],
            "category": data["category"],
            "skills_required": data["skills_required"],
            "budget": {
                "min_amount": data["budget"]["min_amount"],
                "max_amount": data["budget"]["max_amount"],
                "currency": "KES"
            },
            "duration": data["duration"],  # in days
            "urgency": data["urgency"],  # low, medium, high
            "location": {
                "type": data["location"]["type"],  # remote, on-site, hybrid
                "address": data["location"].get("address", "")
            },
            "posted_by": user_id,
            "status": "open",  # open, in_progress, completed, cancelled
            "created_at": datetime.utcnow(),
            "deadline": data["deadline"],
            "applications_count": 0,
            "selected_freelancer": None
        }
        
        result = gigs.insert_one(gig)
        gig["_id"] = result.inserted_id
        return gig

    @staticmethod
    def get_gigs(filters=None, page=1, limit=10):
        query = {}
        if filters:
            if filters.get("category"):
                query["category"] = filters["category"]
            if filters.get("status"):
                query["status"] = filters["status"]
            if filters.get("location_type"):
                query["location.type"] = filters["location_type"]
            if filters.get("max_budget"):
                query["budget.max_amount"] = {"$lte": filters["max_budget"]}
        
        skip = (page - 1) * limit
        return list(gigs.find(query).sort("created_at", -1).skip(skip).limit(limit))

    @staticmethod
    def get_gig_by_id(gig_id):
        return gigs.find_one({"_id": gig_id})

    @staticmethod
    def update_gig_status(gig_id, status):
        return gigs.update_one(
            {"_id": gig_id},
            {"$set": {"status": status}}
        )

class GigApplication:
    @staticmethod
    def apply_for_gig(gig_id, user_id, proposal, bid_amount):
        application = {
            "gig_id": gig_id,
            "applicant_id": user_id,
            "proposal": proposal,
            "bid_amount": bid_amount,
            "status": "pending",  # pending, accepted, rejected
            "applied_at": datetime.utcnow()
        }
        
        result = gig_applications.insert_one(application)
        application["_id"] = result.inserted_id
        
        # Update gig applications count
        gigs.update_one(
            {"_id": gig_id},
            {"$inc": {"applications_count": 1}}
        )
        
        return application

    @staticmethod
    def get_applications_for_gig(gig_id):
        return list(gig_applications.find({"gig_id": gig_id}))

    @staticmethod
    def get_user_applications(user_id):
        return list(gig_applications.find({"applicant_id": user_id}))

    @staticmethod
    def accept_application(application_id, gig_id):
        # Accept the application
        gig_applications.update_one(
            {"_id": application_id},
            {"$set": {"status": "accepted"}}
        )
        
        # Update gig status and selected freelancer
        gigs.update_one(
            {"_id": gig_id},
            {"$set": {
                "status": "in_progress",
                "selected_freelancer": application_id
            }}
        )
        
        # Reject other applications
        gig_applications.update_many(
            {"gig_id": gig_id, "_id": {"$ne": application_id}},
            {"$set": {"status": "rejected"}}
        )
