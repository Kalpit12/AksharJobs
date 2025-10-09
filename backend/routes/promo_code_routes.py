from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.promo_code_service import PromoCodeService
from bson import ObjectId

promo_code_routes = Blueprint("promo_code_routes", __name__)

@promo_code_routes.route("/create_promo_code", methods=["POST"])
@jwt_required()
def create_promo_code():
    """
    Create a promo code for the authenticated user
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        first_name = data.get("firstName", "")
        last_name = data.get("lastName", "")
        user_type = data.get("userType", "")
        
        if not all([first_name, last_name, user_type]):
            return jsonify({"error": "Missing required fields"}), 400
        
        result = PromoCodeService.create_user_promo_code(
            user_id, first_name, last_name, user_type
        )
        
        if result["success"]:
            return jsonify(result), 201
        else:
            return jsonify(result), 400
            
    except Exception as e:
        print(f"❌ Error in create_promo_code: {e}")
        return jsonify({"error": "Internal server error"}), 500

@promo_code_routes.route("/get_my_promo_code", methods=["GET"])
@jwt_required()
def get_my_promo_code():
    """
    Get the authenticated user's promo code
    """
    try:
        user_id = get_jwt_identity()
        
        result = PromoCodeService.get_user_promo_code(user_id)
        
        if result["success"]:
            return jsonify(result), 200
        else:
            return jsonify(result), 404
            
    except Exception as e:
        print(f"❌ Error in get_my_promo_code: {e}")
        return jsonify({"error": "Internal server error"}), 500

@promo_code_routes.route("/use_promo_code", methods=["POST"])
@jwt_required()
def use_promo_code():
    """
    Use a promo code
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or "code" not in data:
            return jsonify({"error": "Promo code is required"}), 400
        
        code = data["code"].strip().upper()
        user_type = data.get("userType", "")
        
        if not user_type:
            return jsonify({"error": "User type is required"}), 400
        
        result = PromoCodeService.use_promo_code(code, user_id, user_type)
        
        if result["success"]:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        print(f"❌ Error in use_promo_code: {e}")
        return jsonify({"error": "Internal server error"}), 500

@promo_code_routes.route("/check_credits", methods=["POST"])
@jwt_required()
def check_credits():
    """
    Check user's credits for a specific action
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        user_type = data.get("userType", "")
        action_type = data.get("actionType", "")
        
        if not all([user_type, action_type]):
            return jsonify({"error": "User type and action type are required"}), 400
        
        result = PromoCodeService.check_user_credits(user_id, user_type, action_type)
        
        return jsonify(result), 200 if result["success"] else 400
            
    except Exception as e:
        print(f"❌ Error in check_credits: {e}")
        return jsonify({"error": "Internal server error"}), 500

@promo_code_routes.route("/consume_credit", methods=["POST"])
@jwt_required()
def consume_credit():
    """
    Consume a credit for a specific action
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        user_type = data.get("userType", "")
        action_type = data.get("actionType", "")
        
        if not all([user_type, action_type]):
            return jsonify({"error": "User type and action type are required"}), 400
        
        result = PromoCodeService.consume_credit(user_id, user_type, action_type)
        
        return jsonify(result), 200 if result["success"] else 400
            
    except Exception as e:
        print(f"❌ Error in consume_credit: {e}")
        return jsonify({"error": "Internal server error"}), 500

@promo_code_routes.route("/validate_promo_code", methods=["POST"])
def validate_promo_code():
    """
    Validate a promo code without using it
    """
    try:
        data = request.get_json()
        
        if not data or "code" not in data:
            return jsonify({"error": "Promo code is required"}), 400
        
        code = data["code"].strip().upper()
        
        from models.promo_code_model import PromoCode
        promo_code = PromoCode.find_by_code(code)
        
        if not promo_code:
            return jsonify({"success": False, "error": "Invalid promo code"}), 404
        
        # Check if expired
        from datetime import datetime
        if promo_code["expires_at"] < datetime.now():
            return jsonify({"success": False, "error": "Promo code has expired"}), 400
        
        # Check if max uses reached
        if promo_code["usage_count"] >= promo_code["max_uses"]:
            return jsonify({"success": False, "error": "This promo code has reached its usage limit"}), 400
        
        return jsonify({
            "success": True,
            "owner_name": promo_code["owner_name"],
            "benefits": promo_code["benefits"],
            "usage_count": promo_code["usage_count"],
            "max_uses": promo_code["max_uses"],
            "remaining_uses": promo_code["max_uses"] - promo_code["usage_count"]
        }), 200
            
    except Exception as e:
        print(f"❌ Error in validate_promo_code: {e}")
        return jsonify({"error": "Internal server error"}), 500
