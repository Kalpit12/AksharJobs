import requests
import json
import hashlib
import hmac
import base64
from datetime import datetime, timedelta
from urllib.parse import urlencode
from utils.db import get_db
import os
from bson import ObjectId

class PaymentService:
    def __init__(self):
        # Pesapal API Configuration
        self.pesapal_consumer_key = os.getenv('PESAPAL_CONSUMER_KEY', 'your_consumer_key')
        self.pesapal_consumer_secret = os.getenv('PESAPAL_CONSUMER_SECRET', 'your_consumer_secret')
        self.pesapal_base_url = os.getenv('PESAPAL_BASE_URL', 'https://cybqa.pesapal.com/pesapalv3/api')
        
        # M-Pesa API Configuration
        self.mpesa_consumer_key = os.getenv('MPESA_CONSUMER_KEY', 'your_mpesa_consumer_key')
        self.mpesa_consumer_secret = os.getenv('MPESA_CONSUMER_SECRET', 'your_mpesa_consumer_secret')
        self.mpesa_base_url = os.getenv('MPESA_BASE_URL', 'https://sandbox.safaricom.co.ke')
        self.mpesa_shortcode = os.getenv('MPESA_SHORTCODE', '174379')
        self.mpesa_passkey = os.getenv('MPESA_PASSKEY', 'your_mpesa_passkey')
        
        # Database
        self.db = get_db()
        self.payments_collection = self.db["payments"]
        self.subscriptions_collection = self.db["subscriptions"]

    def generate_pesapal_oauth_token(self):
        """Generate Pesapal OAuth token"""
        try:
            url = f"{self.pesapal_base_url}/Auth/RequestToken"
            
            payload = {
                "consumer_key": self.pesapal_consumer_key,
                "consumer_secret": self.pesapal_consumer_secret
            }
            
            headers = {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
            
            response = requests.post(url, json=payload, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                return data.get('token')
            else:
                print(f"Pesapal OAuth error: {response.text}")
                return None
                
        except Exception as e:
            print(f"Error generating Pesapal OAuth token: {e}")
            return None

    def create_pesapal_payment(self, user_id, plan_name, amount, currency, phone_number, email):
        """Create Pesapal payment order"""
        try:
            token = self.generate_pesapal_oauth_token()
            if not token:
                return None, "Failed to get OAuth token"
            
            # Generate unique order tracking ID
            order_tracking_id = f"RocketMatch_{user_id}_{int(datetime.now().timestamp())}"
            
            # Payment data
            payment_data = {
                "amount": float(amount),
                "currency": currency,
                "description": f"RocketMatch Premium - {plan_name} Plan",
                "callback_url": f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/payment-callback",
                "cancellation_url": f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/payment-cancelled",
                "notification_id": order_tracking_id,
                "billing_address": {
                    "phone_number": phone_number,
                    "email_address": email,
                    "country_code": "KE"
                }
            }
            
            url = f"{self.pesapal_base_url}/Transactions/SubmitOrderRequest"
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
            
            response = requests.post(url, json=payment_data, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                
                # Store payment record
                payment_record = {
                    "user_id": ObjectId(user_id),
                    "order_tracking_id": order_tracking_id,
                    "plan_name": plan_name,
                    "amount": amount,
                    "currency": currency,
                    "payment_method": "pesapal",
                    "status": "pending",
                    "payment_url": data.get('redirect_url'),
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
                
                self.payments_collection.insert_one(payment_record)
                
                return data.get('redirect_url'), "Payment order created successfully"
            else:
                print(f"Pesapal payment creation error: {response.text}")
                return None, f"Payment creation failed: {response.text}"
                
        except Exception as e:
            print(f"Error creating Pesapal payment: {e}")
            return None, str(e)

    def generate_mpesa_access_token(self):
        """Generate M-Pesa access token"""
        try:
            url = f"{self.mpesa_base_url}/oauth/v1/generate?grant_type=client_credentials"
            
            auth_string = f"{self.mpesa_consumer_key}:{self.mpesa_consumer_secret}"
            auth_bytes = auth_string.encode('ascii')
            auth_b64 = base64.b64encode(auth_bytes).decode('ascii')
            
            headers = {
                "Authorization": f"Basic {auth_b64}"
            }
            
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                return data.get('access_token')
            else:
                print(f"M-Pesa token error: {response.text}")
                return None
                
        except Exception as e:
            print(f"Error generating M-Pesa access token: {e}")
            return None

    def create_mpesa_stk_push(self, user_id, plan_name, amount, phone_number):
        """Create M-Pesa STK Push payment"""
        try:
            access_token = self.generate_mpesa_access_token()
            if not access_token:
                return None, "Failed to get M-Pesa access token"
            
            # Format phone number
            if phone_number.startswith('0'):
                phone_number = f"254{phone_number[1:]}"
            elif not phone_number.startswith('254'):
                phone_number = f"254{phone_number}"
            
            # Generate timestamp
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            
            # Generate password
            password_string = f"{self.mpesa_shortcode}{self.mpesa_passkey}{timestamp}"
            password_bytes = password_string.encode('ascii')
            password_b64 = base64.b64encode(password_bytes).decode('ascii')
            
            # Generate unique reference
            reference = f"RocketMatch_{user_id}_{int(datetime.now().timestamp())}"
            
            # STK Push data
            stk_push_data = {
                "BusinessShortCode": self.mpesa_shortcode,
                "Password": password_b64,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": int(amount),
                "PartyA": phone_number,
                "PartyB": self.mpesa_shortcode,
                "PhoneNumber": phone_number,
                "CallBackURL": f"{os.getenv('BACKEND_URL', 'http://localhost:5000')}/api/payment/mpesa-callback",
                "AccountReference": reference,
                "TransactionDesc": f"RocketMatch Premium - {plan_name} Plan"
            }
            
            url = f"{self.mpesa_base_url}/mpesa/stkpush/v1/processrequest"
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            
            response = requests.post(url, json=stk_push_data, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                
                # Store payment record
                payment_record = {
                    "user_id": ObjectId(user_id),
                    "reference": reference,
                    "plan_name": plan_name,
                    "amount": amount,
                    "currency": "KES",
                    "payment_method": "mpesa",
                    "status": "pending",
                    "checkout_request_id": data.get('CheckoutRequestID'),
                    "phone_number": phone_number,
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
                
                self.payments_collection.insert_one(payment_record)
                
                return data.get('CheckoutRequestID'), "STK Push sent successfully"
            else:
                print(f"M-Pesa STK Push error: {response.text}")
                return None, f"STK Push failed: {response.text}"
                
        except Exception as e:
            print(f"Error creating M-Pesa STK Push: {e}")
            return None, str(e)

    def verify_pesapal_payment(self, order_tracking_id):
        """Verify Pesapal payment status"""
        try:
            token = self.generate_pesapal_oauth_token()
            if not token:
                return None, "Failed to get OAuth token"
            
            url = f"{self.pesapal_base_url}/Transactions/GetTransactionStatus?orderTrackingId={order_tracking_id}"
            headers = {
                "Authorization": f"Bearer {token}",
                "Accept": "application/json"
            }
            
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                return data, "Payment status retrieved successfully"
            else:
                print(f"Pesapal verification error: {response.text}")
                return None, f"Verification failed: {response.text}"
                
        except Exception as e:
            print(f"Error verifying Pesapal payment: {e}")
            return None, str(e)

    def verify_mpesa_payment(self, checkout_request_id):
        """Verify M-Pesa payment status"""
        try:
            access_token = self.generate_mpesa_access_token()
            if not access_token:
                return None, "Failed to get M-Pesa access token"
            
            url = f"{self.mpesa_base_url}/mpesa/stkpushquery/v1/query"
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            password_string = f"{self.mpesa_shortcode}{self.mpesa_passkey}{timestamp}"
            password_bytes = password_string.encode('ascii')
            password_b64 = base64.b64encode(password_bytes).decode('ascii')
            
            query_data = {
                "BusinessShortCode": self.mpesa_shortcode,
                "Password": password_b64,
                "Timestamp": timestamp,
                "CheckoutRequestID": checkout_request_id
            }
            
            response = requests.post(url, json=query_data, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                return data, "Payment status retrieved successfully"
            else:
                print(f"M-Pesa verification error: {response.text}")
                return None, f"Verification failed: {response.text}"
                
        except Exception as e:
            print(f"Error verifying M-Pesa payment: {e}")
            return None, str(e)

    def update_payment_status(self, payment_id, status, transaction_id=None):
        """Update payment status in database"""
        try:
            update_data = {
                "status": status,
                "updated_at": datetime.utcnow()
            }
            
            if transaction_id:
                update_data["transaction_id"] = transaction_id
            
            result = self.payments_collection.update_one(
                {"_id": ObjectId(payment_id)},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                return True, "Payment status updated successfully"
            else:
                return False, "Payment not found"
                
        except Exception as e:
            print(f"Error updating payment status: {e}")
            return False, str(e)

    def process_successful_payment(self, user_id, plan_name, amount, payment_method):
        """Process successful payment and upgrade subscription"""
        try:
            from services.subscription_service import SubscriptionService
            
            # Upgrade subscription
            success, message = SubscriptionService.upgrade_subscription(
                user_id, plan_name, amount, payment_method
            )
            
            if success:
                # Create subscription record
                subscription_record = {
                    "user_id": ObjectId(user_id),
                    "plan_name": plan_name,
                    "amount": amount,
                    "payment_method": payment_method,
                    "status": "active",
                    "start_date": datetime.utcnow(),
                    "end_date": datetime.utcnow() + timedelta(days=30),
                    "created_at": datetime.utcnow()
                }
                
                self.subscriptions_collection.insert_one(subscription_record)
                
                return True, "Subscription upgraded successfully"
            else:
                return False, message
                
        except Exception as e:
            print(f"Error processing successful payment: {e}")
            return False, str(e)

    def get_payment_methods(self):
        """Get available payment methods"""
        return [
            {
                "id": "pesapal",
                "name": "Pesapal",
                "description": "Pay with M-Pesa, Airtel Money, or cards",
                "icon": "💳",
                "popular": True
            },
            {
                "id": "mpesa",
                "name": "M-Pesa",
                "description": "Direct M-Pesa payment",
                "icon": "📱",
                "popular": False
            }
        ]
