#!/usr/bin/env python3
"""
Create promo code for kalpitpatel751@gmail.com
"""

from services.promo_code_service import PromoCodeService
from utils.db import get_db

def create_promo_for_kalpit():
    """Create promo code for kalpitpatel751@gmail.com"""
    try:
        print("🔍 Looking for user: kalpitpatel751@gmail.com")
        
        # Get database connection directly
        from pymongo import MongoClient
        client = MongoClient('mongodb://localhost:27017/')
        db = client['TalentMatchDB']
        print(f"📁 Connected to database: {db.name}")
            
        users = db["users"]
        
        # Find the user
        user = users.find_one({"email": "kalpitpatel751@gmail.com"})
        
        if not user:
            print("❌ User not found")
            return
            
        print(f"✅ User found: {user.get('firstName', '')} {user.get('lastName', '')}")
        print(f"📧 Email: {user['email']}")
        print(f"🆔 User ID: {str(user['_id'])}")
        print(f"👤 User Type: {user.get('userType', 'Unknown')}")
        
        # Check if user already has a promo code
        print("\n🎫 Checking existing promo code...")
        existing_promo = PromoCodeService.get_user_promo_code(str(user['_id']))
        
        if existing_promo['success']:
            print("✅ User already has a promo code!")
            print(f"🎫 Promo code data: {existing_promo['promo_code']}")
        else:
            print("ℹ️ User doesn't have a promo code. Creating one...")
            
            # Create promo code
            result = PromoCodeService.create_user_promo_code(
                str(user['_id']),
                user.get('firstName', 'Kalpit'),
                user.get('lastName', 'Patel'),
                user.get('userType', 'jobSeeker')
            )
            
            print(f"📊 Create result: {result}")
            
            if result['success']:
                print("✅ Promo code created successfully!")
                print(f"🎫 Promo code: {result.get('promo_code', 'Unknown')}")
                print(f"🎁 Benefits: {result.get('benefits', 'Unknown')}")
                
                # Verify by getting the promo code again
                print("\n🔍 Verifying promo code creation...")
                verify_result = PromoCodeService.get_user_promo_code(str(user['_id']))
                
                if verify_result['success']:
                    print("✅ Verification successful!")
                    print(f"🎫 Verified promo code: {verify_result['promo_code']}")
                else:
                    print(f"❌ Verification failed: {verify_result.get('error', 'Unknown error')}")
            else:
                print(f"❌ Failed to create promo code: {result.get('error', 'Unknown error')}")
                
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    create_promo_for_kalpit()
