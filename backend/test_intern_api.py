#!/usr/bin/env python3
"""Test Intern API Endpoint"""

from utils.db import get_db
from services.intern_service import InternService
from bson import ObjectId

def test_intern_api():
    try:
        service = InternService()
        
        # Test with Aashni's ID (who has completed profile)
        user_id = ObjectId("68e3905e98ba5a0b08a55173")
        
        print("🧪 Testing intern profile API...")
        print(f"User ID: {user_id}")
        
        profile = service.get_intern_profile(user_id)
        
        if profile:
            print("\n✅ Profile retrieved successfully!")
            print(f"   Email: {profile.get('email')}")
            print(f"   Full Name: {profile.get('fullName')}")
            print(f"   Resume Path: {profile.get('resumePath', 'NOT SET')}")
            print(f"   College: {profile.get('collegeName')}")
            print(f"   Technical Skills: {len(profile.get('technicalSkills', []))}")
            print(f"\n📋 Full profile data:")
            import json
            print(json.dumps(profile, indent=2, default=str))
        else:
            print("\n❌ No profile found!")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_intern_api()

