from pymongo import MongoClient
from datetime import datetime
from utils.db import get_db

db = get_db()
communities = db["communities"]
communities_collection = db["communities"]

# Community schema
community_schema = {
    "name": "",  # Community name (e.g., "Software Developers", "Healthcare Workers")
    "description": "",  # Brief description of the community
    "category": "",  # Category like "Technology", "Healthcare", "Finance", etc.
    "is_active": True,  # Whether the community is active
    "created_at": datetime.utcnow(),
    "updated_at": datetime.utcnow(),
    "member_count": 0,  # Number of members in this community
    "job_count": 0,  # Number of jobs posted in this community
    "tags": [],  # Relevant tags for the community
    "requirements": "",  # Any special requirements to join this community
    "color": "#3B82F6",  # Color code for UI representation
    "icon": "👥"  # Icon for UI representation
}

class Community:
    @staticmethod
    def create_community(data):
        """Create a new community"""
        communities, _ = _get_collections()
        if communities is None:
            return None
            
        community_data = {
            "name": data["name"],
            "description": data.get("description", ""),
            "category": data.get("category", ""),
            "is_active": data.get("is_active", True),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "member_count": 0,
            "job_count": 0,
            "tags": data.get("tags", []),
            "requirements": data.get("requirements", ""),
            "color": data.get("color", "#3B82F6"),
            "icon": data.get("icon", "👥")
        }
        
        try:
            result = communities.insert_one(community_data)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error creating community: {e}")
            return None

    @staticmethod
    def get_all_communities():
        """Get all active communities"""
        communities, _ = _get_collections()
        if communities is None:
            return []
            
        try:
            return list(communities.find({"is_active": True}).sort("name", 1))
        except Exception as e:
            print(f"Error fetching communities: {e}")
            return []

    @staticmethod
    def get_community_by_id(community_id):
        """Get community by ID"""
        communities, _ = _get_collections()
        if communities is None:
            return None
            
        try:
            from bson import ObjectId
            return communities.find_one({"_id": ObjectId(community_id)})
        except Exception as e:
            print(f"Error fetching community by ID: {e}")
            return None

    @staticmethod
    def get_community_by_name(name):
        """Get community by name"""
        communities, _ = _get_collections()
        if communities is None:
            return None
            
        try:
            return communities.find_one({"name": name})
        except Exception as e:
            print(f"Error fetching community by name: {e}")
            return None

    @staticmethod
    def update_member_count(community_id, increment=True):
        """Update member count for a community"""
        communities, _ = _get_collections()
        if communities is None:
            return False
            
        try:
            from bson import ObjectId
            change = 1 if increment else -1
            communities.update_one(
                {"_id": ObjectId(community_id)},
                {"$inc": {"member_count": change}, "$set": {"updated_at": datetime.utcnow()}}
            )
            return True
        except Exception as e:
            print(f"Error updating member count: {e}")
            return False

    @staticmethod
    def update_job_count(community_id, increment=True):
        """Update job count for a community"""
        communities, _ = _get_collections()
        if communities is None:
            return False
            
        try:
            from bson import ObjectId
            change = 1 if increment else -1
            communities.update_one(
                {"_id": ObjectId(community_id)},
                {"$inc": {"job_count": change}, "$set": {"updated_at": datetime.utcnow()}}
            )
            return True
        except Exception as e:
            print(f"Error updating job count: {e}")
            return False

def _get_collections():
    """Lazy-load database collections when needed"""
    global db, communities, communities_collection
    if db is None:
        db = get_db()
        if db is not None:
            communities = db["communities"]
            communities_collection = db["communities"]
        else:
            # Fallback to direct connection if get_db fails
            try:
                client = MongoClient('mongodb://localhost:27017/')
                db = client['resume_matcher']
                communities = db["communities"]
                communities_collection = db["communities"]
            except Exception as e:
                print(f"❌ Failed to connect to MongoDB: {e}")
                return None, None
    return communities, communities_collection
