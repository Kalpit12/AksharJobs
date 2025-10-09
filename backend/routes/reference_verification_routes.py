"""
Reference Verification Routes
Handles reference verification API endpoints
"""

from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from services.reference_verification_service import (
    send_reference_verification_email,
    verify_reference_token,
    update_reference_status
)
from utils.db import get_db

reference_verification_routes = Blueprint("reference_verification_routes", __name__)

@reference_verification_routes.route("/add_reference", methods=["POST"])
def add_reference():
    """Add a new reference for a user"""
    try:
        data = request.get_json()
        user_id = data.get("userId")
        reference_data = {
            "name": data.get("name"),
            "email": data.get("email"),
            "position": data.get("position"),
            "organization": data.get("organization"),
            "relationship": data.get("relationship"),
            "phone": data.get("phone", ""),
            "linkedin": data.get("linkedin", ""),
            "notes": data.get("notes", "")
        }
        
        # Validate required fields
        required_fields = ["name", "email", "position", "organization", "relationship"]
        for field in required_fields:
            if not reference_data.get(field):
                return jsonify({
                    "success": False,
                    "error": f"{field} is required"
                }), 400
        
        # Get user data
        db = get_db()
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 404
        
        # Create reference record
        reference_record = {
            "user_id": user_id,
            "name": reference_data["name"],
            "email": reference_data["email"],
            "position": reference_data["position"],
            "organization": reference_data["organization"],
            "relationship": reference_data["relationship"],
            "phone": reference_data["phone"],
            "linkedin": reference_data["linkedin"],
            "notes": reference_data["notes"],
            "verification_status": "pending",
            "verified_at": None,
            "verified_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Save reference to database
        result = db.references.insert_one(reference_record)
        reference_id = str(result.inserted_id)
        
        # Send verification email to reference
        email_sent = send_reference_verification_email(
            reference_data["email"],
            reference_data["name"],
            user,
            {**reference_record, "_id": reference_id}
        )
        
        if email_sent:
            return jsonify({
                "success": True,
                "message": "Reference added successfully. Verification email sent to the reference.",
                "referenceId": reference_id
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": "Failed to send verification email"
            }), 500
            
    except Exception as e:
        print(f"Error adding reference: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@reference_verification_routes.route("/verify", methods=["POST"])
def verify_reference():
    """Verify a reference (approve or reject)"""
    try:
        data = request.get_json()
        reference_id = data.get("referenceId")
        action = data.get("action")  # approve or reject
        token = data.get("token")
        
        if not all([reference_id, action, token]):
            return jsonify({
                "success": False,
                "error": "Missing required parameters"
            }), 400
        
        # Verify token
        if not verify_reference_token(reference_id, action, token):
            return jsonify({
                "success": False,
                "error": "Invalid or expired token"
            }), 400
        
        # Get reference data
        db = get_db()
        reference = db.references.find_one({"_id": ObjectId(reference_id)})
        if not reference:
            return jsonify({
                "success": False,
                "error": "Reference not found"
            }), 404
        
        # Get user data
        user = db.users.find_one({"_id": ObjectId(reference["user_id"])})
        if not user:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 404
        
        # Update reference status
        verified_by = reference["email"]  # The reference person's email
        success = update_reference_status(reference_id, action, verified_by)
        
        if success:
            # Convert ObjectId to string for JSON serialization
            reference["_id"] = str(reference["_id"])
            user["_id"] = str(user["_id"])
            
            return jsonify({
                "success": True,
                "message": f"Reference {action}d successfully",
                "referenceData": reference,
                "userData": user
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": "Failed to update reference status"
            }), 500
            
    except Exception as e:
        print(f"Error verifying reference: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@reference_verification_routes.route("/user_references/<user_id>", methods=["GET"])
def get_user_references(user_id):
    """Get all references for a user"""
    try:
        db = get_db()
        references = list(db.references.find({"user_id": user_id}))
        
        # Convert ObjectId to string for JSON serialization
        for ref in references:
            ref["_id"] = str(ref["_id"])
        
        return jsonify({
            "success": True,
            "references": references
        }), 200
        
    except Exception as e:
        print(f"Error getting user references: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@reference_verification_routes.route("/delete_reference/<reference_id>", methods=["DELETE"])
def delete_reference(reference_id):
    """Delete a reference"""
    try:
        db = get_db()
        result = db.references.delete_one({"_id": ObjectId(reference_id)})
        
        if result.deleted_count > 0:
            return jsonify({
                "success": True,
                "message": "Reference deleted successfully"
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": "Reference not found"
            }), 404
            
    except Exception as e:
        print(f"Error deleting reference: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
