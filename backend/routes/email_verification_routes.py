"""
Email Verification Routes
Handles email verification API endpoints
"""

from flask import Blueprint, request, jsonify
from services.email_verification_service import (
    generate_verification_code, 
    send_verification_email, 
    store_verification_code,
    verify_email_code
)
from utils.db import get_db
from bson import ObjectId

email_verification_routes = Blueprint("email_verification_routes", __name__)

@email_verification_routes.route("/send_verification_code", methods=["POST"])
def send_verification_code():
    """Send verification code to user's email"""
    try:
        data = request.get_json()
        user_id = data.get("userId")
        email = data.get("email")
        user_name = data.get("userName")
        
        if not user_id or not email or not user_name:
            return jsonify({
                "success": False,
                "error": "User ID, email, and user name are required"
            }), 400
        
        # Generate verification code
        verification_code = generate_verification_code()
        
        # Store verification code
        verification_id = store_verification_code(user_id, email, verification_code)
        
        if not verification_id:
            return jsonify({
                "success": False,
                "error": "Failed to store verification code"
            }), 500
        
        # Send verification email
        email_sent = send_verification_email(email, user_name, verification_code)
        
        if email_sent:
            return jsonify({
                "success": True,
                "message": "Verification code sent to your email",
                "verificationCode": verification_code  # For testing purposes
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": "Failed to send verification email"
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@email_verification_routes.route("/verify_code", methods=["POST"])
def verify_code():
    """Verify the email verification code"""
    try:
        data = request.get_json()
        email = data.get("email")
        code = data.get("code")
        
        if not email or not code:
            return jsonify({
                "success": False,
                "error": "Email and verification code are required"
            }), 400
        
        # Verify the code
        result = verify_email_code(email, code)
        
        if result["success"]:
            return jsonify({
                "success": True,
                "message": result["message"],
                "userId": result["user_id"]
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": result["message"]
            }), 400
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@email_verification_routes.route("/resend_code", methods=["POST"])
def resend_code():
    """Resend verification code"""
    try:
        data = request.get_json()
        user_id = data.get("userId")
        email = data.get("email")
        user_name = data.get("userName")
        
        if not user_id or not email or not user_name:
            return jsonify({
                "success": False,
                "error": "User ID, email, and user name are required"
            }), 400
        
        # Generate new verification code
        verification_code = generate_verification_code()
        
        # Store new verification code
        verification_id = store_verification_code(user_id, email, verification_code)
        
        if not verification_id:
            return jsonify({
                "success": False,
                "error": "Failed to store verification code"
            }), 500
        
        # Send verification email
        email_sent = send_verification_email(email, user_name, verification_code)
        
        if email_sent:
            return jsonify({
                "success": True,
                "message": "New verification code sent to your email",
                "verificationCode": verification_code  # For testing purposes
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": "Failed to send verification email"
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500