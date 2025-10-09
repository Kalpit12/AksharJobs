#!/usr/bin/env python3
"""
Test script for community verification system
"""

import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:3002"
TEST_USER_DATA = {
    "userType": "job_seeker",
    "firstName": "Test",
    "lastName": "User",
    "email": "test.user@example.com",
    "password": "testpassword123",
    "phoneNumber": "+1234567890",
    "location": "Test City",
    "communities": ["68cfb561590068c36eb54d27"],  # Hindu community ID
    "primary_community": "68cfb561590068c36eb54d27"
}

def test_community_verification():
    """Test the complete community verification flow"""
    print("🧪 Testing Community Verification System")
    print("=" * 50)
    
    # Step 1: Test signup with communities
    print("\n1️⃣ Testing user signup with communities...")
    signup_response = requests.post(f"{BASE_URL}/api/auth/signup", json=TEST_USER_DATA)
    
    if signup_response.status_code == 201:
        signup_data = signup_response.json()
        print(f"✅ User created successfully!")
        print(f"   User ID: {signup_data.get('userId')}")
        print(f"   Token: {signup_data.get('token', 'No token')[:20]}...")
        print(f"   Message: {signup_data.get('message')}")
        
        user_id = signup_data.get('userId')
        
        # Step 2: Test verification status endpoint
        print("\n2️⃣ Testing verification status endpoint...")
        status_response = requests.get(f"{BASE_URL}/api/community-verification/verification-status/{user_id}")
        
        if status_response.status_code == 200:
            status_data = status_response.json()
            print(f"✅ Verification status retrieved!")
            print(f"   Status: {status_data.get('verification_status')}")
            print(f"   Communities: {len(status_data.get('communities', []))}")
            
            # Step 3: Test verification request sending
            print("\n3️⃣ Testing verification request sending...")
            verification_response = requests.post(f"{BASE_URL}/api/community-verification/send_verification", 
                                                json={"userId": user_id})
            
            if verification_response.status_code == 200:
                verification_data = verification_response.json()
                print(f"✅ Verification request sent!")
                print(f"   Message: {verification_data.get('message')}")
            else:
                print(f"❌ Failed to send verification request: {verification_response.text}")
        else:
            print(f"❌ Failed to get verification status: {status_response.text}")
    else:
        print(f"❌ User signup failed: {signup_response.text}")
    
    # Step 4: Test communities endpoint
    print("\n4️⃣ Testing communities endpoint...")
    communities_response = requests.get(f"{BASE_URL}/api/communities")
    
    if communities_response.status_code == 200:
        communities_data = communities_response.json()
        print(f"✅ Communities retrieved!")
        print(f"   Total communities: {len(communities_data.get('communities', []))}")
        
        # Show first few communities
        for i, community in enumerate(communities_data.get('communities', [])[:3]):
            print(f"   {i+1}. {community.get('icon')} {community.get('name')}")
    else:
        print(f"❌ Failed to get communities: {communities_response.text}")
    
    print("\n" + "=" * 50)
    print("🎯 Community Verification Test Complete!")

if __name__ == "__main__":
    test_community_verification()
