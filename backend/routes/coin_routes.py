from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.coin_service import CoinService

coin_routes = Blueprint("coin_routes", __name__)

@coin_routes.route("/balance", methods=["GET"])
@jwt_required()
def get_balance():
    """
    Get user's Akshar Coin balance
    """
    try:
        user_id = get_jwt_identity()
        result = CoinService.get_user_balance(user_id)
        
        return jsonify(result), 200 if result["success"] else 400
        
    except Exception as e:
        print(f"❌ Error in get_balance: {e}")
        return jsonify({"error": "Internal server error"}), 500

@coin_routes.route("/earn", methods=["POST"])
@jwt_required()
def earn_coins():
    """
    Manually earn coins (for testing or admin purposes)
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        amount = data.get("amount", 0)
        reason = data.get("reason", "Manual credit")
        reference_id = data.get("reference_id")
        
        if amount <= 0:
            return jsonify({"error": "Amount must be positive"}), 400
        
        result = CoinService.earn_coins(user_id, amount, reason, reference_id)
        
        return jsonify(result), 200 if result["success"] else 400
        
    except Exception as e:
        print(f"❌ Error in earn_coins: {e}")
        return jsonify({"error": "Internal server error"}), 500

@coin_routes.route("/redeem", methods=["POST"])
@jwt_required()
def redeem_coins():
    """
    Redeem coins for benefits
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        user_type = data.get("userType", "")
        redemption_type = data.get("redemptionType", "")
        
        if not all([user_type, redemption_type]):
            return jsonify({"error": "User type and redemption type are required"}), 400
        
        result = CoinService.redeem_coins(user_id, user_type, redemption_type)
        
        return jsonify(result), 200 if result["success"] else 400
        
    except Exception as e:
        print(f"❌ Error in redeem_coins: {e}")
        return jsonify({"error": "Internal server error"}), 500

@coin_routes.route("/transactions", methods=["GET"])
@jwt_required()
def get_transactions():
    """
    Get user's coin transaction history
    """
    try:
        user_id = get_jwt_identity()
        limit = request.args.get("limit", 50, type=int)
        
        result = CoinService.get_transaction_history(user_id, limit)
        
        return jsonify(result), 200 if result["success"] else 400
        
    except Exception as e:
        print(f"❌ Error in get_transactions: {e}")
        return jsonify({"error": "Internal server error"}), 500

@coin_routes.route("/info", methods=["GET"])
def get_coin_info():
    """
    Get information about coin rewards and costs (no auth required)
    """
    try:
        result = CoinService.get_coin_info()
        return jsonify(result), 200
        
    except Exception as e:
        print(f"❌ Error in get_coin_info: {e}")
        return jsonify({"error": "Internal server error"}), 500

@coin_routes.route("/spend", methods=["POST"])
@jwt_required()
def spend_coins():
    """
    Spend coins (for custom actions)
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        amount = data.get("amount", 0)
        reason = data.get("reason", "Spent coins")
        reference_id = data.get("reference_id")
        
        if amount <= 0:
            return jsonify({"error": "Amount must be positive"}), 400
        
        result = CoinService.spend_coins(user_id, amount, reason, reference_id)
        
        return jsonify(result), 200 if result["success"] else 400
        
    except Exception as e:
        print(f"❌ Error in spend_coins: {e}")
        return jsonify({"error": "Internal server error"}), 500

