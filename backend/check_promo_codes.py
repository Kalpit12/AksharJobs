#!/usr/bin/env python3
"""
Check promo codes in database
"""

from utils.db import get_db

def check_promo_codes():
    """Check promo codes in database"""
    try:
        print("🔍 Checking promo codes in database...")
        
        # Get database connection
        db = get_db()
        if db is None:
            print("❌ Failed to connect to database")
            return
            
        print(f"✅ Connected to database: {db.name}")
        
        promo_codes = db["promo_codes"]
        
        # Get all promo codes
        all_promos = list(promo_codes.find({}))
        print(f"📊 Total promo codes: {len(all_promos)}")
        
        for promo in all_promos:
            print(f"  🎫 Code: {promo['code']}")
            print(f"     Owner ID: {promo['owner_id']}")
            print(f"     Owner Name: {promo['owner_name']}")
            print(f"     Active: {promo['is_active']}")
            print(f"     Created: {promo.get('created_at', 'Unknown')}")
            print("  ---")
        
        # Check for our specific user
        user_id = "68b012a441ec82ed03ba21e7"
        user_promos = list(promo_codes.find({"owner_id": user_id}))
        print(f"\n🎯 Promo codes for user {user_id}: {len(user_promos)}")
        
        for promo in user_promos:
            print(f"  🎫 Code: {promo['code']}")
            print(f"     Active: {promo['is_active']}")
        
        # Also check with string comparison (in case of type mismatch)
        user_promos_str = list(promo_codes.find({"owner_id": {"$regex": "68b012a441ec82ed03ba21e7"}}))
        print(f"\n🔍 Promo codes with regex search: {len(user_promos_str)}")
        
        # Check all owner IDs to see the format
        owner_ids = promo_codes.distinct("owner_id")
        print(f"\n📋 All owner IDs: {owner_ids}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_promo_codes()
