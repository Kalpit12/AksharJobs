from utils.db import get_db

def store_parsed_resume(parsed_resume):
    db = get_db()
    resume_collection = db["resume_data"]

    try:
        resume_collection.insert_one(parsed_resume)
        print("Resume data stored successfully.")
    except Exception as e:
        print(f"Error storing resume data: {e}")
