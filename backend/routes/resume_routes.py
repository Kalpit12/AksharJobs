import os
from bson import ObjectId
from flask import Blueprint, make_response, request, jsonify, send_file
from werkzeug.utils import secure_filename
from gridfs import GridFS
from io import BytesIO
from utils.db import get_db
from services.resume_service import  get_resumes_by_user, process_resume

# Initialize database and GridFS for file storage
db = get_db()
fs=GridFS(db)
resume_collection = db["resume_data"]
resume_routes = Blueprint("resume_routes", __name__)

# Folder for temporary file storage
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"pdf", "doc", "docx"}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@resume_routes.route("/upload", methods=["POST"])
def upload_resume():
    """
    Handles resume uploads.

    - Validates file and user ID.
    - Saves the file temporarily, processes it, and stores it in GridFS.
    - Deletes any existing resume for the user before saving a new one.
    - Calls `process_resume()` to extract and store resume data.

    Returns:
        JSON response with success message and file ID.
    """
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    user_id = request.form.get("userId")

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        extension = file.filename.rsplit(".", 1)[1].lower()
        unique_filename = f"{user_id}_resume.{extension}"
        filepath = os.path.join(UPLOAD_FOLDER, unique_filename)

        file.save(filepath)  

        print(f"Processing resume for user: {user_id}, Filename: {unique_filename}")

        #  Read the file before storing it in GridFS
        with open(filepath, "rb") as f:
            file_data = f.read()

        if not file_data:
            return jsonify({"error": "File content is empty"}), 400

        existing_resume = resume_collection.find_one({"userId": user_id})
        if existing_resume and "fileId" in existing_resume:
            try:
                fs.delete(ObjectId(existing_resume["fileId"]))
                print(" Old resume deleted from GridFS")
            except Exception as e:
                print(f" Error deleting old resume: {str(e)}")

        file_id = fs.put(file_data, filename=unique_filename, content_type=file.content_type, userId=user_id)

        process_resume(filepath, user_id)

        resume_collection.update_one(
            {"userId": user_id},
            {"$set": {"fileId": file_id, "filename": unique_filename}},
            upsert=True
        )

        os.remove(filepath)  
        print("Process resume completed.")
        return jsonify({"message": "Resume uploaded successfully", "fileId": str(file_id)}), 200

    return jsonify({"error": "Invalid file format"}), 400

@resume_routes.route("/get_resumes/<user_id>", methods=["GET"])
def get_user_resumes(user_id):
    """
    Retrieves parsed resume details for a given user.

    Parameters:
        user_id (str): The ID of the user whose resumes are to be fetched.

    Returns:
        JSON response with resume data.
    """
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        resumes = get_resumes_by_user(user_id)
        
        if not resumes:
            return jsonify({"message": "No resumes found for this user", "resumes": []}), 200
        
        return jsonify({"resumes": resumes}), 200
        
    except Exception as e:
        print(f"Error getting resumes for user {user_id}: {str(e)}")
        return jsonify({"error": "Failed to retrieve resumes"}), 500

@resume_routes.route("/get_resumes_for_profile/<user_id>", methods=["GET"])
def get_user_resumes_by_profile(user_id):
    """
    Retrieves resume details for displaying on the user profile.

    Parameters:
        user_id (str): The ID of the user.

    Returns:
        JSON response with resume details including profile summary, skills, experience, and job recommendations.
    """
    print("Getting resume for profile...")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    resume = resume_collection.find_one({"userId": user_id})
    if not resume:
        return jsonify({"error": "No resume found"}), 404

    return jsonify({
            "name": resume.get("name", ""),
            "profile_summary": resume.get("profile_summary", ""),
            "experience": resume.get("experience"),
            "education": resume.get("education"),
            "projects": resume.get("projects"),
            "skills": resume.get("skills"),
            "certificates": resume.get("certificates"),
            "job_recommended": resume.get("jobRecommended"),
            "filename": resume.get("filename"),
            "fileId": str(resume["fileId"]) if "fileId" in resume else None,  
        "download_url": f"http://127.0.0.1:5000/api/resumes/download/{resume['fileId']}" if "fileId" in resume else None
        }), 200

@resume_routes.route("/download/<file_id>", methods=["GET"])
def download_resume(file_id):
    print("Downloading resume...")
    """
    Allows users to download a stored resume file.

    Parameters:
        file_id (str): The ID of the file in GridFS.

    Returns:
        A downloadable file response.
    """
    try:
        file = fs.get(ObjectId(file_id))  # Get file using file_id (GridFS stores files by ID)

        if not file:
            return jsonify({"error": "File not found"}), 404

        return send_file(
            BytesIO(file.read()),  #  Read file from GridFS
            mimetype=file.content_type,  
            as_attachment=True,
            download_name=file.filename 
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@resume_routes.route("/preview/<file_id>", methods=["GET"])
def preview_resume(file_id):
    print("Preview resume")
    """
    Allows users to preview a resume file in the browser.

    Parameters:
        file_id (str): The ID of the file in GridFS.

    Returns:
        A response displaying the resume inline (not as a download).
    """
    try:
        file = fs.get(ObjectId(file_id))  # Retrieve file from GridFS
        
        if not file:
            return jsonify({"error": "File not found"}), 404

        response = make_response(file.read())  #  Read file content
        response.headers["Content-Type"] = file.content_type 
        response.headers["Content-Disposition"] = f"inline; filename={file.filename}"  

        return response  
    except Exception as e:
        return jsonify({"error": str(e)}), 500