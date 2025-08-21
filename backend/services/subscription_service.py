import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from utils.db import get_db
import os

db = get_db()
users = db["users"]

class SubscriptionService:
    @staticmethod
    def upgrade_subscription(user_id, plan_name, amount, payment_method):
        """Upgrade user subscription and send confirmation email"""
        try:
            # Update user subscription
            subscription_data = {
                "plan": plan_name,
                "status": "active",
                "startDate": datetime.utcnow(),
                "endDate": datetime.utcnow() + timedelta(days=30),
                "lastPayment": {
                    "amount": amount,
                    "method": payment_method,
                    "date": datetime.utcnow()
                }
            }
            
            # Define features based on plan
            if plan_name == "Starter":
                subscription_data["features"] = ["enhanced_matching", "priority_support", "job_alerts"]
            elif plan_name == "Professional":
                subscription_data["features"] = ["ai_matching", "unlimited_access", "premium_support", "advanced_analytics"]
            elif plan_name == "Premium":
                subscription_data["features"] = ["all_professional", "personal_advisor", "exclusive_opportunities", "premium_services"]
            elif plan_name == "Enterprise":
                subscription_data["features"] = ["all_features", "dedicated_manager", "custom_solutions", "api_access"]
            
            # Update user in database
            result = users.update_one(
                {"_id": user_id},
                {"$set": {"subscription": subscription_data}}
            )
            
            if result.modified_count > 0:
                # Send confirmation email
                SubscriptionService.send_upgrade_email(user_id, plan_name, amount)
                return True, "Subscription upgraded successfully"
            else:
                return False, "Failed to update subscription"
                
        except Exception as e:
            print(f"Error upgrading subscription: {e}")
            return False, str(e)
    
    @staticmethod
    def get_user_subscription(user_id):
        """Get user's current subscription details"""
        try:
            user = users.find_one({"_id": user_id})
            if user and "subscription" in user:
                return user["subscription"]
            return None
        except Exception as e:
            print(f"Error getting subscription: {e}")
            return None
    
    @staticmethod
    def is_premium_user(user_id):
        """Check if user has premium subscription"""
        try:
            subscription = SubscriptionService.get_user_subscription(user_id)
            if subscription and subscription.get("status") == "active":
                plan = subscription.get("plan", "Basic")
                return plan != "Basic"
            return False
        except Exception as e:
            print(f"Error checking premium status: {e}")
            return False
    
    @staticmethod
    def send_upgrade_email(user_id, plan_name, amount):
        """Send confirmation email for premium upgrade"""
        try:
            user = users.find_one({"_id": user_id})
            if not user:
                return False
            
            # Email configuration
            sender_email = os.getenv("SMTP_EMAIL", "noreply@rocketmatch.com")
            sender_password = os.getenv("SMTP_PASSWORD", "")
            smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
            smtp_port = int(os.getenv("SMTP_PORT", "587"))
            
            if not sender_password:
                print("SMTP password not configured, skipping email")
                return False
            
            # Create message
            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = user['email']
            msg['Subject'] = f"🎉 Welcome to {plan_name} - Your Premium Journey Begins!"
            
            # Email body
            body = f"""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #16423C; margin-bottom: 10px;">🚀 Welcome to Premium!</h1>
                        <p style="font-size: 18px; color: #6A9C89;">You've successfully upgraded to {plan_name}</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <h2 style="color: #16423C; margin-bottom: 15px;">🎯 What's Next?</h2>
                        <ul style="text-align: left; padding-left: 20px;">
                            <li>Explore your new premium features</li>
                            <li>Update your profile to maximize benefits</li>
                            <li>Start using AI-powered tools</li>
                            <li>Access priority support</li>
                        </ul>
                    </div>
                    
                    <div style="background: #e9efec; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <h3 style="color: #16423C; margin-bottom: 10px;">📊 Payment Details</h3>
                        <p><strong>Plan:</strong> {plan_name}</p>
                        <p><strong>Amount:</strong> KSH {amount}</p>
                        <p><strong>Date:</strong> {datetime.utcnow().strftime('%B %d, %Y')}</p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="https://rocketmatch.com/dashboard" 
                           style="background: #16423C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
                            Go to Dashboard
                        </a>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 14px;">
                        <p>Thank you for choosing RocketMatch!</p>
                        <p>If you have any questions, contact our support team.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            msg.attach(MIMEText(body, 'html'))
            
            # Send email
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(sender_email, sender_password)
            text = msg.as_string()
            server.sendmail(sender_email, user['email'], text)
            server.quit()
            
            print(f"Upgrade email sent to {user['email']}")
            return True
            
        except Exception as e:
            print(f"Error sending upgrade email: {e}")
            return False
    
    @staticmethod
    def check_subscription_expiry():
        """Check and update expired subscriptions"""
        try:
            current_date = datetime.utcnow()
            
            # Find expired subscriptions
            expired_users = users.find({
                "subscription.status": "active",
                "subscription.endDate": {"$lt": current_date}
            })
            
            for user in expired_users:
                # Update to basic plan
                users.update_one(
                    {"_id": user["_id"]},
                    {
                        "$set": {
                            "subscription": {
                                "plan": "Basic",
                                "status": "expired",
                                "startDate": user["subscription"]["startDate"],
                                "endDate": user["subscription"]["endDate"],
                                "features": []
                            }
                        }
                    }
                )
                
                print(f"Subscription expired for user {user['_id']}")
                
        except Exception as e:
            print(f"Error checking subscription expiry: {e}")

# Initialize subscription expiry checker
if __name__ == "__main__":
    SubscriptionService.check_subscription_expiry()
