from pymongo import MongoClient
from datetime import datetime

from utils.db import get_db

# Global variables for collections
db = None
jobs = None
jobs_collection = None

def _get_collections():
    """Get database collections - NO CACHING to avoid stale data"""
    global db, jobs, jobs_collection
    
    # ALWAYS get fresh database connection (no caching)
    db = get_db()
    if db is not None:
        jobs = db["jobs"]
        jobs_collection = db["jobs"]
        print(f"[DEBUG job_model] Using database: {db.name}")
        print(f"[DEBUG job_model] Collection: jobs")
    else:
        # Fallback to direct connection if get_db fails
        try:
            from pymongo import MongoClient
            client = MongoClient('mongodb://localhost:27017/')
            db = client['TalentMatchDB']
            jobs = db["jobs"]
            jobs_collection = db["jobs"]
            print(f"[DEBUG job_model] Using fallback connection to: {db.name}")
        except Exception as e:
            print(f"[ERROR job_model] Failed to connect to database: {e}")
            return None, None, None
    
    return db, jobs, jobs_collection

# Initialize collections
_get_collections()

job_schema = {
    "recruiter_id": "",  # To link job with a recruiter
    "job_title": "",
    "company_name": "",
    "company_website": "",
    "industry": "",
    "location": "",
    "remote_option": "",  # On-site, Remote, Hybrid
    "job_type": "",  # Full-time, Part-time, Contract
    "salary_range": "",
    "experience_required": "",
    "required_skills": "",
    "responsibilities": "",
    "education_required": "",
    "application_deadline": "",
    "description": "",
    "views": 0,  # Default to 0
    "applicants": [],  # List of applicants
    "match_threshold": 70,  # Minimum match score threshold
    "auto_reject_threshold": 50,  # Auto-reject below this score
    # Community-related fields
    "target_communities": [],  # List of community IDs this job is targeting
    "all_communities": False,  # Whether job is visible to all communities
    "community_requirements": "",  # Specific community requirements
    "created_at": datetime.utcnow()
}
