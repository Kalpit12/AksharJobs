#!/usr/bin/env python3
"""
Test script to create promo code for existing user
"""

from services.promo_code_service import PromoCodeService
from models.user_model import User
from utils.db import get_db
import sys

def create_promo_for_existing_user():
    """Create promo code for existing user kalpitpatel751@gmail.com"""
    try:
        print("🔍 Looking for existing user: kalpitpatel751@gmail.com")
        
        # Get database connection
        db = get_db()
        if db is None:
            print("❌ Failed to connect to database")
            return
            
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
            print(f"🎫 Promo code: {existing_promo['promo_code']}")
        else:
            print("ℹ️ User doesn't have a promo code. Creating one...")
            
            # Create promo code
            result = PromoCodeService.create_user_promo_code(
                str(user['_id']),
                user.get('firstName', 'User'),
                user.get('lastName', 'Name'),
                user.get('userType', 'jobSeeker')
            )
            
            if result['success']:
                print("✅ Promo code created successfully!")
                print(f"🎫 Promo code: {result.get('promo_code', 'Unknown')}")
                print(f"🎁 Benefits: {result.get('benefits', 'Unknown')}")
            else:
                print(f"❌ Failed to create promo code: {result.get('error', 'Unknown error')}")
                
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

def test_promo_code_service():
    """Test the promo code service directly"""
    try:
        print("🧪 Testing PromoCodeService...")
        
        # Test with a dummy user
        test_result = PromoCodeService.create_user_promo_code(
            "test_user_id_123",
            "Test",
            "User",
            "jobSeeker"
        )
        
        print(f"📊 Test result: {test_result}")
        
        if test_result['success']:
            print("✅ PromoCodeService is working correctly!")
        else:
            print(f"❌ PromoCodeService failed: {test_result.get('error', 'Unknown error')}")
            
    except Exception as e:
        print(f"❌ Error testing PromoCodeService: {e}")
        import traceback
        traceback.print_exc()

def main():
    """Main function"""
    print("🚀 Testing Promo Code for Existing User")
    print("=" * 50)
    
    # Test 1: Test the service directly
    test_promo_code_service()
    
    print("\n" + "=" * 50)
    
    # Test 2: Create promo code for existing user
    create_promo_for_existing_user()
    
    print("\n" + "=" * 50)
    print("🏁 Test completed!")

if __name__ == "__main__":
    main()
