from pymongo import MongoClient
from datetime import datetime

from utils.db import get_db
db = get_db()
jobs=db["jobs"]
jobs_collection = db["jobs"]

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
