from utils.db import get_db
from utils.extract_text import extract_text
from utils.parse_resume import parse_resume_with_gemini_free
from utils.store_data import store_parsed_resume
from gridfs import GridFS

db = get_db()
fs= GridFS(db)
resume_collection = db["resume_data"]

def process_resume(filepath, user_id):
    """
    Processes a resume by extracting text, parsing it with Gemini, and storing the structured data.

    Steps:
    1. Extracts text from the uploaded resume file.
    2. Uses Gemini AI to parse the extracted text into structured resume data.
    3. Associates the parsed resume with the user.
    4. Stores the parsed data in the database (updating if a resume already exists).

    Args:
        filepath (str): The local path to the resume file.
        user_id (str): The ID of the user uploading the resume.

    Returns:
        None
    """
    print("Into resume processing...")
    # Extract text from PDF or DOC
    extracted_text = extract_text(filepath)
    
    # Parse extracted text with Gemini Free API
    parsed_resume = parse_resume_with_gemini_free(extracted_text)
    
    parsed_resume["userId"] = user_id

    # If the user already has a resume, update it
    resume_collection.update_one(
        {"userId": user_id},
        {"$set": parsed_resume},  
        upsert=True  
    )

def get_resumes_by_user(user_id):
    """
    Retrieves a user's parsed resume details from the database.

    Args:
        user_id (str): The ID of the user.

    Returns:
        list: A list containing the parsed resume data (or an empty list if no resume exists).
    """
    resumes = list(resume_collection.find({"userId": user_id}, {"_id": 0}))
    
    # Check if user has any resumes before accessing
    if resumes and len(resumes) > 0:
        # Convert fileId to string if it exists
        if 'fileId' in resumes[0]:
            resumes[0]['fileId'] = str(resumes[0]['fileId'])
        print("Got resume from DB")
    else:
        print("No resumes found for user")
    
    return resumes