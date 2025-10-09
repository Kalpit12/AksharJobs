"""
Community Verification Routes
Handles community verification requests and approvals
"""

from flask import Blueprint, request, jsonify, render_template_string
from bson import ObjectId
from datetime import datetime
from services.community_verification_service import (
    send_community_verification_email, 
    verify_token, 
    update_user_verification_status,
    get_community_name
)
from utils.db import get_db

community_verification_routes = Blueprint("community_verification_routes", __name__)

@community_verification_routes.route("/send_verification", methods=["POST"])
def send_verification_request():
    """Send verification request to community leaders"""
    try:
        data = request.get_json()
        user_id = data.get("userId")
        
        if not user_id:
            return jsonify({"success": False, "error": "User ID is required"}), 400
        
        # Get user data
        db = get_db()
        user = db.users.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            return jsonify({"success": False, "error": "User not found"}), 404
        
        # Get user's communities
        communities = user.get("communities", [])
        if not communities:
            return jsonify({"success": False, "error": "No communities selected"}), 400
        
        # Send verification email
        success = send_community_verification_email(user, communities)
        
        if success:
            return jsonify({
                "success": True, 
                "message": "Verification request sent to community leaders"
            }), 200
        else:
            return jsonify({
                "success": False, 
                "error": "Failed to send verification email"
            }), 500
            
    except Exception as e:
        print(f"Error sending verification request: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@community_verification_routes.route("/verify", methods=["POST"])
def verify_user():
    """Handle user verification from email link"""
    try:
        data = request.get_json()
        action = data.get("action")  # approve or reject
        user_id = data.get("userId")
        token = data.get("token")
        
        if not all([action, user_id, token]):
            return jsonify({"success": False, "error": "Missing required parameters"}), 400
        
        # Verify token
        token_data = verify_token(token)
        if not token_data:
            return jsonify({"success": False, "error": "Invalid or expired token"}), 400
        
        # Get user data
        db = get_db()
        user = db.users.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            return jsonify({"success": False, "error": "User not found"}), 404
        
        # Get community data
        communities = []
        for community_id in user.get("communities", []):
            try:
                community = db.communities.find_one({"_id": ObjectId(community_id)})
                if community:
                    community["_id"] = str(community["_id"])  # Convert ObjectId to string
                    communities.append(community)
            except Exception as e:
                print(f"Error getting community {community_id}: {e}")
                continue
        
        # Update user verification status
        verified_by = "hemant.patel@maxproinfotech.com"  # Community leader email
        success = update_user_verification_status(user_id, action, verified_by if action == "approve" else None)
        
        if success:
            # Get updated user data
            updated_user = db.users.find_one({"_id": ObjectId(user_id)})
            updated_user["_id"] = str(updated_user["_id"])  # Convert ObjectId to string
            
            return jsonify({
                "success": True,
                "message": f"User verification {action}d successfully",
                "userData": updated_user,
                "communityData": communities[0] if communities else None,
                "communities": communities
            }), 200
        else:
            return jsonify({"success": False, "error": "Failed to update verification status"}), 500
            
    except Exception as e:
        print(f"Error verifying user: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@community_verification_routes.route("/verification-status/<user_id>", methods=["GET"])
def get_verification_status(user_id):
    """Get user's verification status"""
    try:
        db = get_db()
        user = db.users.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            return jsonify({"success": False, "error": "User not found"}), 404
        
        # Get community names
        communities = []
        for community_id in user.get("communities", []):
            community_name = get_community_name(community_id)
            communities.append({"id": community_id, "name": community_name})
        
        return jsonify({
            "success": True,
            "verification_status": user.get("community_verification_status", "pending"),
            "verified_at": user.get("community_verification_verified_at"),
            "verified_by": user.get("community_verification_verified_by"),
            "communities": communities
        }), 200
        
    except Exception as e:
        print(f"Error getting verification status: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
