from flask import Blueprint, request, jsonify, make_response
from models.application_model import  ApplicationModel
from services.application_service import process_application, update_application_status

application_routes = Blueprint("application_routes", __name__)

@application_routes.route("/apply", methods=["POST"])
def apply():
    """
    Processes a user's application for a job and returns the match score.

    Request JSON:
        {
            "userId": "string",
            "jobId": "string",
            "status": "string" (optional)
        }

    Returns:
        dict: Application result, including match score.
    """
    
    data = request.json
    user_id = data.get("userId")
    job_id = data.get("jobId")
    status=data.get("status")
    
    if not user_id or not job_id:
        return jsonify({"error": "Missing userId or jobId"}), 400
    

    result = process_application(user_id, job_id,status)
    
    # Handle the tuple return from process_application
    if isinstance(result, tuple) and len(result) == 2:
        # If result is a tuple (error_dict, status_code)
        error_dict, status_code = result
        return jsonify(error_dict), status_code
    else:
        # If result is a success dict
        return jsonify(result)

@application_routes.route("/get_applications", methods=["GET"])
def get_applications():
    """
    Fetches job applications based on filters:
    - If both `userId` and `jobId` are provided, fetches a specific application.
    - If only `userId` is provided, fetches all applications by that user.
    - If only `jobId` is provided, fetches all applications for that job.
    - If no parameters are provided, fetches all applications.

    Query Parameters:
        userId (str, optional): The ID of the job seeker.
        jobId (str, optional): The ID of the job.

    Returns:
        dict: A list of applications or a message if none are found.
    """

    user_id = request.args.get("userId")
    job_id = request.args.get("jobId")
    print("U",user_id)
    print("J",job_id)
    query = {}
    if user_id:
        query["userId"] = user_id
    if job_id:
        query["jobId"] = job_id

    applications = ApplicationModel.get_applications(query)

    if not applications:
        return jsonify({"applications": [], "message": "No applications found"}), 200
    print("Got application")
    return jsonify({"applications": applications}), 200


@application_routes.route("/update_status", methods=["PUT"])
def update_status():
    """
    Updates the status of a job application.

    Request JSON:
        {
            "userId": "string",
            "jobId": "string",
            "status": "string",  # e.g., "Interview Scheduled", "Rejected", "Accepted"
            "interviewDate": "YYYY-MM-DD" (optional),
            "interviewMode": "string" (optional)  # e.g., "Online", "Offline"
        }

    Returns:
        dict: Response message and status code.
    """
    data = request.json
    user_id = data.get("userId")
    job_id = data.get("jobId")
    status = data.get("status")
    interview_date = data.get("interviewDate")
    interview_mode = data.get("interviewMode")

    if not user_id or not job_id or not status:
        return jsonify({"error": "Missing required fields"}), 400
    print("Updating application...")
    response, status_code = update_application_status(user_id, job_id, status, interview_date, interview_mode)
    
    return jsonify(response), status_code
