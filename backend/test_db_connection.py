#!/usr/bin/env python3
"""
Test database connection
"""

from utils.db import get_db
from models.promo_code_model import PromoCode

def test_db_connection():
    """Test database connection"""
    try:
        print("🔍 Testing database connection...")
        
        # Test get_db function
        db = get_db()
        if db is None:
            print("❌ get_db() returned None")
            return
            
        print(f"✅ Connected to database: {db.name}")
        
        # List collections
        collections = db.list_collection_names()
        print(f"📁 Collections: {collections}")
        
        # Check users collection
        if 'users' in collections:
            users_count = db.users.count_documents({})
            print(f"👥 Users count: {users_count}")
            
            # Find our test user
            user = db.users.find_one({"email": "kalpitpatel751@gmail.com"})
            if user:
                print(f"✅ Found user: {user.get('firstName', '')} {user.get('lastName', '')}")
                print(f"🆔 User ID: {str(user['_id'])}")
            else:
                print("❌ User not found")
        
        # Check promo_codes collection
        if 'promo_codes' in collections:
            promo_count = db.promo_codes.count_documents({})
            print(f"🎫 Promo codes count: {promo_count}")
            
            # Find promo codes for our user
            user_promos = list(db.promo_codes.find({"owner_id": "68b012a441ec82ed03ba21e7"}))
            print(f"🎫 User promo codes: {len(user_promos)}")
            
            for promo in user_promos:
                print(f"  Code: {promo['code']}")
                print(f"  Active: {promo['is_active']}")
                print(f"  Owner: {promo['owner_name']}")
        
        # Test PromoCode model
        print("\n🧪 Testing PromoCode model...")
        promo_stats = PromoCode.get_user_promo_stats("68b012a441ec82ed03ba21e7")
        print(f"📊 Promo stats: {promo_stats}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_db_connection()