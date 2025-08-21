from flask import Blueprint, request, jsonify
from services.subscription_service import SubscriptionService
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
from datetime import datetime

subscription_bp = Blueprint('subscription', __name__)

@subscription_bp.route('/upgrade', methods=['POST'])
@jwt_required()
def upgrade_subscription():
    """Upgrade user subscription after successful payment"""
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        plan_name = data.get('planName')
        amount = data.get('amount')
        payment_method = data.get('paymentMethod', 'pesapal')
        
        if not plan_name or not amount:
            return jsonify({"error": "Plan name and amount are required"}), 400
        
        # Upgrade subscription
        success, message = SubscriptionService.upgrade_subscription(
            user_id, plan_name, amount, payment_method
        )
        
        if success:
            return jsonify({
                "success": True,
                "message": message,
                "subscription": {
                    "plan": plan_name,
                    "status": "active"
                }
            }), 200
        else:
            return jsonify({"error": message}), 400
            
    except Exception as e:
        print(f"Error upgrading subscription: {e}")
        return jsonify({"error": "Internal server error"}), 500

@subscription_bp.route('/status', methods=['GET'])
@jwt_required()
def get_subscription_status():
    """Get user's current subscription status"""
    try:
        user_id = get_jwt_identity()
        subscription = SubscriptionService.get_user_subscription(user_id)
        
        if subscription:
            return jsonify({
                "success": True,
                "subscription": subscription
            }), 200
        else:
            return jsonify({
                "success": True,
                "subscription": {
                    "plan": "Basic",
                    "status": "active",
                    "features": []
                }
            }), 200
            
    except Exception as e:
        print(f"Error getting subscription status: {e}")
        return jsonify({"error": "Internal server error"}), 500

@subscription_bp.route('/is-premium', methods=['GET'])
@jwt_required()
def check_premium_status():
    """Check if user has premium subscription"""
    try:
        user_id = get_jwt_identity()
        is_premium = SubscriptionService.is_premium_user(user_id)
        
        return jsonify({
            "success": True,
            "isPremium": is_premium
        }), 200
        
    except Exception as e:
        print(f"Error checking premium status: {e}")
        return jsonify({"error": "Internal server error"}), 500

@subscription_bp.route('/pesapal-webhook', methods=['POST'])
def pesapal_webhook():
    """Handle Pesapal payment webhook"""
    try:
        data = request.get_json()
        
        # Log webhook data for debugging
        print(f"Pesapal webhook received: {json.dumps(data, indent=2)}")
        
        # Extract payment details
        payment_status = data.get('payment_status')
        payment_id = data.get('payment_id')
        amount = data.get('amount')
        currency = data.get('currency')
        reference = data.get('reference')
        
        # Process payment status
        if payment_status == 'COMPLETED':
            # Payment successful - update subscription
            # You would typically extract user_id from reference
            # and update their subscription here
            
            return jsonify({
                "success": True,
                "message": "Payment processed successfully"
            }), 200
        elif payment_status == 'FAILED':
            return jsonify({
                "success": False,
                "message": "Payment failed"
            }), 400
        else:
            return jsonify({
                "success": False,
                "message": f"Payment status: {payment_status}"
            }), 400
            
    except Exception as e:
        print(f"Error processing Pesapal webhook: {e}")
        return jsonify({"error": "Internal server error"}), 500

@subscription_bp.route('/create-payment', methods=['POST'])
@jwt_required()
def create_payment():
    """Create a payment session for Pesapal"""
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        plan_name = data.get('planName')
        amount = data.get('amount')
        currency = data.get('currency', 'KES')
        
        if not plan_name or not amount:
            return jsonify({"error": "Plan name and amount are required"}), 400
        
        # In a real implementation, you would:
        # 1. Create a payment record in your database
        # 2. Generate a unique reference number
        # 3. Call Pesapal API to create payment session
        # 4. Return payment URL to frontend
        
        # For demo purposes, return a mock payment URL
        payment_data = {
            "payment_id": f"pay_{user_id}_{int(datetime.utcnow().timestamp())}",
            "reference": f"ref_{user_id}_{plan_name.lower()}",
            "amount": amount,
            "currency": currency,
            "plan_name": plan_name,
            "payment_url": f"https://demo.pesapal.com/pay/{user_id}",
            "status": "pending"
        }
        
        return jsonify({
            "success": True,
            "payment": payment_data
        }), 200
        
    except Exception as e:
        print(f"Error creating payment: {e}")
        return jsonify({"error": "Internal server error"}), 500
