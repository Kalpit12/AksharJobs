from utils.db import get_db
from datetime import datetime
from bson import ObjectId

class CoinService:
    """
    Service class for handling Akshar Coins operations
    """
    
    # Coin earning rates
    COIN_REWARDS = {
        "promo_code_used": 5,  # When someone uses your promo code
        "referral_signup": 5,  # When a referral signs up
        "profile_complete": 5,  # One-time bonus for completing profile
        "first_application": 3,  # Job seeker's first application
        "first_job_post": 3,  # Recruiter's first job post
        "daily_login": 3,  # Daily login bonus
        "share_promo": 2,  # Each time you share your promo code
    }
    
    # Coin redemption costs
    COIN_COSTS = {
        "job_seeker": {
            "job_application": 2,  # Cost per job application
            "premium_1_month": 50,  # 1 month premium
            "premium_3_months": 120,  # 3 months premium (20% discount)
            "premium_6_months": 200,  # 6 months premium (33% discount)
        },
        "recruiter": {
            "job_post": 5,  # Cost per job post
            "resume_view": 1,  # Cost per resume view
            "premium_1_month": 80,  # 1 month premium
            "premium_3_months": 200,  # 3 months premium (17% discount)
            "premium_6_months": 350,  # 6 months premium (27% discount)
        }
    }
    
    @staticmethod
    def get_user_balance(user_id):
        """
        Get user's current Akshar Coin balance
        
        Args:
            user_id (str): User's ID
            
        Returns:
            dict: User's coin balance and recent transactions
        """
        try:
            db = get_db()
            users = db["users"]
            
            if not ObjectId.is_valid(user_id):
                return {"success": False, "error": "Invalid user ID"}
            
            user = users.find_one({"_id": ObjectId(user_id)})
            
            if not user:
                return {"success": False, "error": "User not found"}
            
            # Get last 10 transactions
            recent_transactions = user.get("coin_transactions", [])[-10:]
            
            return {
                "success": True,
                "balance": user.get("akshar_coins", 0),
                "recent_transactions": recent_transactions,
                "total_earned": sum(t.get("amount", 0) for t in user.get("coin_transactions", []) if t.get("type") == "earn"),
                "total_spent": sum(abs(t.get("amount", 0)) for t in user.get("coin_transactions", []) if t.get("type") == "spend")
            }
            
        except Exception as e:
            print(f"❌ Error getting user balance: {e}")
            return {"success": False, "error": "Failed to get balance"}
    
    @staticmethod
    def earn_coins(user_id, amount, reason, reference_id=None):
        """
        Add coins to user's balance
        
        Args:
            user_id (str): User's ID
            amount (int): Amount of coins to add
            reason (str): Reason for earning coins
            reference_id (str, optional): Reference to related action
            
        Returns:
            dict: Result of operation
        """
        try:
            db = get_db()
            users = db["users"]
            
            if not ObjectId.is_valid(user_id):
                return {"success": False, "error": "Invalid user ID"}
            
            # Create transaction record
            transaction = {
                "type": "earn",
                "amount": amount,
                "reason": reason,
                "reference_id": reference_id,
                "timestamp": datetime.utcnow(),
                "balance_after": None  # Will be updated after the operation
            }
            
            # Update user's balance and add transaction
            result = users.update_one(
                {"_id": ObjectId(user_id)},
                {
                    "$inc": {"akshar_coins": amount},
                    "$push": {"coin_transactions": transaction}
                }
            )
            
            if result.modified_count > 0:
                # Get updated balance
                user = users.find_one({"_id": ObjectId(user_id)})
                new_balance = user.get("akshar_coins", 0)
                
                # Update the transaction with balance_after
                users.update_one(
                    {"_id": ObjectId(user_id), "coin_transactions.timestamp": transaction["timestamp"]},
                    {"$set": {"coin_transactions.$.balance_after": new_balance}}
                )
                
                return {
                    "success": True,
                    "message": f"Earned {amount} Akshar Coins!",
                    "amount": amount,
                    "new_balance": new_balance,
                    "reason": reason
                }
            else:
                return {"success": False, "error": "Failed to update balance"}
            
        except Exception as e:
            print(f"❌ Error earning coins: {e}")
            return {"success": False, "error": "Failed to earn coins"}
    
    @staticmethod
    def spend_coins(user_id, amount, reason, reference_id=None):
        """
        Deduct coins from user's balance
        
        Args:
            user_id (str): User's ID
            amount (int): Amount of coins to spend
            reason (str): Reason for spending coins
            reference_id (str, optional): Reference to related action
            
        Returns:
            dict: Result of operation
        """
        try:
            db = get_db()
            users = db["users"]
            
            if not ObjectId.is_valid(user_id):
                return {"success": False, "error": "Invalid user ID"}
            
            # Check if user has enough coins
            user = users.find_one({"_id": ObjectId(user_id)})
            
            if not user:
                return {"success": False, "error": "User not found"}
            
            current_balance = user.get("akshar_coins", 0)
            
            if current_balance < amount:
                return {
                    "success": False,
                    "error": f"Insufficient coins. You have {current_balance} coins but need {amount}.",
                    "current_balance": current_balance,
                    "required": amount
                }
            
            # Create transaction record
            transaction = {
                "type": "spend",
                "amount": -amount,  # Negative for spending
                "reason": reason,
                "reference_id": reference_id,
                "timestamp": datetime.utcnow(),
                "balance_after": None
            }
            
            # Update user's balance and add transaction
            result = users.update_one(
                {"_id": ObjectId(user_id)},
                {
                    "$inc": {"akshar_coins": -amount},
                    "$push": {"coin_transactions": transaction}
                }
            )
            
            if result.modified_count > 0:
                # Get updated balance
                user = users.find_one({"_id": ObjectId(user_id)})
                new_balance = user.get("akshar_coins", 0)
                
                # Update the transaction with balance_after
                users.update_one(
                    {"_id": ObjectId(user_id), "coin_transactions.timestamp": transaction["timestamp"]},
                    {"$set": {"coin_transactions.$.balance_after": new_balance}}
                )
                
                return {
                    "success": True,
                    "message": f"Spent {amount} Akshar Coins!",
                    "amount": amount,
                    "new_balance": new_balance,
                    "reason": reason
                }
            else:
                return {"success": False, "error": "Failed to update balance"}
            
        except Exception as e:
            print(f"❌ Error spending coins: {e}")
            return {"success": False, "error": "Failed to spend coins"}
    
    @staticmethod
    def redeem_coins(user_id, user_type, redemption_type):
        """
        Redeem coins for benefits
        
        Args:
            user_id (str): User's ID
            user_type (str): Type of user (job_seeker or recruiter)
            redemption_type (str): Type of redemption
            
        Returns:
            dict: Result of redemption
        """
        try:
            db = get_db()
            users = db["users"]
            
            # Get cost for redemption
            if user_type not in CoinService.COIN_COSTS:
                return {"success": False, "error": "Invalid user type"}
            
            if redemption_type not in CoinService.COIN_COSTS[user_type]:
                return {"success": False, "error": "Invalid redemption type"}
            
            cost = CoinService.COIN_COSTS[user_type][redemption_type]
            
            # Spend the coins
            spend_result = CoinService.spend_coins(
                user_id,
                cost,
                f"Redeemed for {redemption_type.replace('_', ' ').title()}",
                reference_id=redemption_type
            )
            
            if not spend_result["success"]:
                return spend_result
            
            # Grant the benefit
            benefit_field = None
            benefit_amount = 1
            
            if redemption_type == "job_application":
                benefit_field = "free_applications"
            elif redemption_type == "job_post":
                benefit_field = "free_job_posts"
            elif redemption_type == "resume_view":
                benefit_field = "free_resume_views"
                benefit_amount = 5  # Get 5 resume views
            
            if benefit_field:
                users.update_one(
                    {"_id": ObjectId(user_id)},
                    {"$inc": {benefit_field: benefit_amount}}
                )
            
            return {
                "success": True,
                "message": f"Successfully redeemed {cost} coins!",
                "redemption_type": redemption_type,
                "cost": cost,
                "new_balance": spend_result["new_balance"],
                "benefit": f"Added {benefit_amount} {benefit_field.replace('_', ' ')}" if benefit_field else "Benefit applied"
            }
            
        except Exception as e:
            print(f"❌ Error redeeming coins: {e}")
            return {"success": False, "error": "Failed to redeem coins"}
    
    @staticmethod
    def get_transaction_history(user_id, limit=50):
        """
        Get user's coin transaction history
        
        Args:
            user_id (str): User's ID
            limit (int): Number of transactions to return
            
        Returns:
            dict: Transaction history
        """
        try:
            db = get_db()
            users = db["users"]
            
            if not ObjectId.is_valid(user_id):
                return {"success": False, "error": "Invalid user ID"}
            
            user = users.find_one({"_id": ObjectId(user_id)})
            
            if not user:
                return {"success": False, "error": "User not found"}
            
            transactions = user.get("coin_transactions", [])
            
            # Sort by timestamp (newest first) and limit
            sorted_transactions = sorted(
                transactions,
                key=lambda x: x.get("timestamp", datetime.min),
                reverse=True
            )[:limit]
            
            return {
                "success": True,
                "transactions": sorted_transactions,
                "total_transactions": len(transactions)
            }
            
        except Exception as e:
            print(f"❌ Error getting transaction history: {e}")
            return {"success": False, "error": "Failed to get transaction history"}
    
    @staticmethod
    def get_coin_info():
        """
        Get information about coin rewards and costs
        
        Returns:
            dict: Coin rewards and costs information
        """
        return {
            "success": True,
            "rewards": CoinService.COIN_REWARDS,
            "costs": CoinService.COIN_COSTS
        }

