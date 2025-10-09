"""
Resume Service for retrieving resume data by user
"""

from models.resume_model import resume_collection
import logging

logger = logging.getLogger(__name__)

def get_resumes_by_user(user_id):
    """
    Get all resumes for a specific user
    
    Args:
        user_id (str): The user ID to get resumes for
        
    Returns:
        list: List of resume documents for the user
    """
    try:
        # Find all resumes for the user, sorted by creation date (newest first)
        resumes = list(resume_collection.find(
            {"userId": user_id}
        ).sort("createdAt", -1))
        
        logger.info(f"Found {len(resumes)} resumes for user {user_id}")
        return resumes
        
    except Exception as e:
        logger.error(f"Error getting resumes for user {user_id}: {e}")
        return []

def get_latest_resume_by_user(user_id):
    """
    Get the latest resume for a specific user
    
    Args:
        user_id (str): The user ID to get the latest resume for
        
    Returns:
        dict: The latest resume document for the user, or None if not found
    """
    try:
        # Find the most recent resume for the user
        resume = resume_collection.find_one(
            {"userId": user_id},
            sort=[("createdAt", -1)]
        )
        
        if resume:
            logger.info(f"Found latest resume for user {user_id}")
        else:
            logger.info(f"No resume found for user {user_id}")
            
        return resume
        
    except Exception as e:
        logger.error(f"Error getting latest resume for user {user_id}: {e}")
        return None

def save_resume(user_id, resume_data):
    """
    Save a resume for a user
    
    Args:
        user_id (str): The user ID
        resume_data (dict): The resume data to save
        
    Returns:
        str: The ID of the saved resume
    """
    try:
        from datetime import datetime
        
        # Add metadata
        resume_data["userId"] = user_id
        resume_data["createdAt"] = datetime.now()
        
        # Insert the resume
        result = resume_collection.insert_one(resume_data)
        
        logger.info(f"Saved resume for user {user_id} with ID {result.inserted_id}")
        return str(result.inserted_id)
        
    except Exception as e:
        logger.error(f"Error saving resume for user {user_id}: {e}")
        return None
