from flask import Blueprint, request, jsonify
from services.payment_service import PaymentService
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime
import json

payment_bp = Blueprint('payment', __name__)

@payment_bp.route('/create-payment', methods=['POST'])
@jwt_required()
def create_payment():
    """Create a new payment order"""
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        plan_name = data.get('planName')
        amount = data.get('amount')
        currency = data.get('currency', 'KES')
        payment_method = data.get('paymentMethod', 'pesapal')
        phone_number = data.get('phoneNumber')
        email = data.get('email')
        
        if not all([plan_name, amount, phone_number, email]):
            return jsonify({"error": "Missing required fields"}), 400
        
        payment_service = PaymentService()
        
        if payment_method == 'pesapal':
            payment_url, message = payment_service.create_pesapal_payment(
                user_id, plan_name, amount, currency, phone_number, email
            )
        elif payment_method == 'mpesa':
            checkout_id, message = payment_service.create_mpesa_stk_push(
                user_id, plan_name, amount, phone_number
            )
            payment_url = None
        else:
            return jsonify({"error": "Invalid payment method"}), 400
        
        if payment_url or checkout_id:
            return jsonify({
                "success": True,
                "message": message,
                "payment_url": payment_url,
                "checkout_id": checkout_id,
                "payment_method": payment_method
            }), 200
        else:
            return jsonify({"error": message}), 400
            
    except Exception as e:
        print(f"Error creating payment: {e}")
        return jsonify({"error": "Internal server error"}), 500

@payment_bp.route('/verify-payment', methods=['POST'])
@jwt_required()
def verify_payment():
    """Verify payment status"""
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        payment_id = data.get('payment_id')
        payment_method = data.get('payment_method')
        
        if not all([payment_id, payment_method]):
            return jsonify({"error": "Missing required fields"}), 400
        
        payment_service = PaymentService()
        
        # Get payment record
        from utils.db import get_db
        db = get_db()
        payments_collection = db["payments"]
        
        payment_record = payments_collection.find_one({
            "_id": ObjectId(payment_id),
            "user_id": ObjectId(user_id)
        })
        
        if not payment_record:
            return jsonify({"error": "Payment not found"}), 404
        
        # Verify based on payment method
        if payment_method == 'pesapal':
            order_tracking_id = payment_record.get('order_tracking_id')
            if order_tracking_id:
                payment_data, message = payment_service.verify_pesapal_payment(order_tracking_id)
            else:
                return jsonify({"error": "Invalid payment record"}), 400
        elif payment_method == 'mpesa':
            checkout_request_id = payment_record.get('checkout_request_id')
            if checkout_request_id:
                payment_data, message = payment_service.verify_mpesa_payment(checkout_request_id)
            else:
                return jsonify({"error": "Invalid payment record"}), 400
        else:
            return jsonify({"error": "Invalid payment method"}), 400
        
        if payment_data:
            # Update payment status
            status = payment_data.get('status', 'pending')
            if status == 'COMPLETED':
                # Process successful payment
                success, upgrade_message = payment_service.process_successful_payment(
                    user_id, payment_record['plan_name'], payment_record['amount'], payment_method
                )
                
                if success:
                    # Update payment record
                    payment_service.update_payment_status(payment_id, 'completed', payment_data.get('transaction_id'))
                    
                    return jsonify({
                        "success": True,
                        "status": "completed",
                        "message": "Payment completed successfully",
                        "subscription": {
                            "plan": payment_record['plan_name'],
                            "status": "active"
                        }
                    }), 200
                else:
                    return jsonify({"error": upgrade_message}), 400
            else:
                return jsonify({
                    "success": True,
                    "status": status,
                    "message": f"Payment status: {status}"
                }), 200
        else:
            return jsonify({"error": message}), 400
            
    except Exception as e:
        print(f"Error verifying payment: {e}")
        return jsonify({"error": "Internal server error"}), 500

@payment_bp.route('/pesapal-callback', methods=['POST'])
def pesapal_callback():
    """Handle Pesapal payment callback"""
    try:
        data = request.get_json()
        
        # Log callback data for debugging
        print(f"Pesapal callback received: {json.dumps(data, indent=2)}")
        
        # Extract payment details
        order_tracking_id = data.get('OrderTrackingId')
        payment_status = data.get('PaymentStatus')
        payment_method = data.get('PaymentMethod')
        amount = data.get('Amount')
        currency = data.get('Currency')
        
        if order_tracking_id and payment_status:
            # Update payment status in database
            from utils.db import get_db
            db = get_db()
            payments_collection = db["payments"]
            
            payment_record = payments_collection.find_one({
                "order_tracking_id": order_tracking_id
            })
            
            if payment_record:
                payment_service = PaymentService()
                
                if payment_status == 'COMPLETED':
                    # Process successful payment
                    success, message = payment_service.process_successful_payment(
                        str(payment_record['user_id']),
                        payment_record['plan_name'],
                        payment_record['amount'],
                        'pesapal'
                    )
                    
                    if success:
                        payment_service.update_payment_status(
                            str(payment_record['_id']),
                            'completed',
                            data.get('TransactionId')
                        )
                        
                        return jsonify({
                            "success": True,
                            "message": "Payment processed successfully"
                        }), 200
                    else:
                        return jsonify({
                            "success": False,
                            "message": f"Payment processing failed: {message}"
                        }), 400
                else:
                    # Update status to failed
                    payment_service.update_payment_status(
                        str(payment_record['_id']),
                        'failed'
                    )
                    
                    return jsonify({
                        "success": False,
                        "message": f"Payment failed: {payment_status}"
                    }), 400
            else:
                return jsonify({
                    "success": False,
                    "message": "Payment record not found"
                }), 404
        else:
            return jsonify({
                "success": False,
                "message": "Invalid callback data"
            }), 400
            
    except Exception as e:
        print(f"Error processing Pesapal callback: {e}")
        return jsonify({"error": "Internal server error"}), 500

@payment_bp.route('/mpesa-callback', methods=['POST'])
def mpesa_callback():
    """Handle M-Pesa payment callback"""
    try:
        data = request.get_json()
        
        # Log callback data for debugging
        print(f"M-Pesa callback received: {json.dumps(data, indent=2)}")
        
        # Extract payment details
        checkout_request_id = data.get('Body', {}).get('stkCallback', {}).get('CheckoutRequestID')
        result_code = data.get('Body', {}).get('stkCallback', {}).get('ResultCode')
        result_desc = data.get('Body', {}).get('stkCallback', {}).get('ResultDesc')
        
        if checkout_request_id and result_code is not None:
            # Update payment status in database
            from utils.db import get_db
            db = get_db()
            payments_collection = db["payments"]
            
            payment_record = payments_collection.find_one({
                "checkout_request_id": checkout_request_id
            })
            
            if payment_record:
                payment_service = PaymentService()
                
                if result_code == 0:  # Success
                    # Process successful payment
                    success, message = payment_service.process_successful_payment(
                        str(payment_record['user_id']),
                        payment_record['plan_name'],
                        payment_record['amount'],
                        'mpesa'
                    )
                    
                    if success:
                        # Get transaction details
                        transaction_details = data.get('Body', {}).get('stkCallback', {}).get('CallbackMetadata', {}).get('Item', [])
                        transaction_id = None
                        
                        for item in transaction_details:
                            if item.get('Name') == 'MpesaReceiptNumber':
                                transaction_id = item.get('Value')
                                break
                        
                        payment_service.update_payment_status(
                            str(payment_record['_id']),
                            'completed',
                            transaction_id
                        )
                        
                        return jsonify({
                            "success": True,
                            "message": "Payment processed successfully"
                        }), 200
                    else:
                        return jsonify({
                            "success": False,
                            "message": f"Payment processing failed: {message}"
                        }), 400
                else:
                    # Update status to failed
                    payment_service.update_payment_status(
                        str(payment_record['_id']),
                        'failed'
                    )
                    
                    return jsonify({
                        "success": False,
                        "message": f"Payment failed: {result_desc}"
                    }), 400
            else:
                return jsonify({
                    "success": False,
                    "message": "Payment record not found"
                }), 404
        else:
            return jsonify({
                "success": False,
                "message": "Invalid callback data"
            }), 400
            
    except Exception as e:
        print(f"Error processing M-Pesa callback: {e}")
        return jsonify({"error": "Internal server error"}), 500

@payment_bp.route('/payment-methods', methods=['GET'])
def get_payment_methods():
    """Get available payment methods"""
    try:
        payment_service = PaymentService()
        methods = payment_service.get_payment_methods()
        
        return jsonify({
            "success": True,
            "payment_methods": methods
        }), 200
        
    except Exception as e:
        print(f"Error getting payment methods: {e}")
        return jsonify({"error": "Internal server error"}), 500

@payment_bp.route('/payment-status/<payment_id>', methods=['GET'])
@jwt_required()
def get_payment_status(payment_id):
    """Get payment status by ID"""
    try:
        user_id = get_jwt_identity()
        
        from utils.db import get_db
        db = get_db()
        payments_collection = db["payments"]
        
        payment_record = payments_collection.find_one({
            "_id": ObjectId(payment_id),
            "user_id": ObjectId(user_id)
        })
        
        if not payment_record:
            return jsonify({"error": "Payment not found"}), 404
        
        return jsonify({
            "success": True,
            "payment": {
                "id": str(payment_record['_id']),
                "plan_name": payment_record['plan_name'],
                "amount": payment_record['amount'],
                "currency": payment_record['currency'],
                "payment_method": payment_record['payment_method'],
                "status": payment_record['status'],
                "created_at": payment_record['created_at'].isoformat(),
                "updated_at": payment_record['updated_at'].isoformat()
            }
        }), 200
        
    except Exception as e:
        print(f"Error getting payment status: {e}")
        return jsonify({"error": "Internal server error"}), 500
