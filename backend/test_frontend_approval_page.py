#!/usr/bin/env python3
"""
Test the frontend approval page by creating a test URL
"""

import requests
import time

def test_frontend_approval_page():
    """Test the frontend approval page"""
    
    print("🧪 Testing Frontend Approval Page")
    print("=" * 50)
    
    # Create a test user first
    timestamp = int(time.time())
    test_user_data = {
        "userType": "job_seeker",
        "firstName": "Test",
        "lastName": "User",
        "email": f"test.user{timestamp}@example.com",
        "password": "testpassword123",
        "phoneNumber": "+254-700000000",
        "location": "Nairobi, Kenya",
        "communities": ["68cfb561590068c36eb54d27"],
        "primary_community": "68cfb561590068c36eb54d27"
    }
    
    try:
        # Create user
        signup_response = requests.post("http://localhost:3002/api/auth/signup", json=test_user_data)
        
        if signup_response.status_code == 201:
            user_id = signup_response.json().get('userId')
            
            # Generate approval token
            from services.community_verification_service import generate_verification_token
            approve_token = generate_verification_token(user_id, 'approve')
            reject_token = generate_verification_token(user_id, 'reject')
            
            print(f"✅ Test user created!")
            print(f"   User ID: {user_id}")
            print(f"   Name: {test_user_data['firstName']} {test_user_data['lastName']}")
            print(f"   Email: {test_user_data['email']}")
            print(f"   Phone: {test_user_data['phoneNumber']}")
            
            print(f"\n🔗 Frontend Approval URLs:")
            print(f"   ✅ Approve: http://localhost:3003/verify-user?action=approve&userId={user_id}&token={approve_token}")
            print(f"   ❌ Reject: http://localhost:3003/verify-user?action=reject&userId={user_id}&token={reject_token}")
            
            print(f"\n📋 What happens when community leader clicks approve:")
            print(f"   1. Opens frontend page at /verify-user")
            print(f"   2. Page shows user information")
            print(f"   3. Page shows community information")
            print(f"   4. Page shows approval status")
            print(f"   5. User gets verification badge")
            print(f"   6. User can access community features")
            
            print(f"\n🎯 Test Instructions:")
            print(f"   1. Start the frontend: npm start (should run on port 3003)")
            print(f"   2. Copy the approve URL above")
            print(f"   3. Paste in browser")
            print(f"   4. You should see the professional approval page")
            print(f"   5. Check that user gets verification badge")
            
            print(f"\n✅ Frontend page is ready for testing!")
            
        else:
            print(f"❌ Failed to create test user: {signup_response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print(f"\n" + "=" * 50)

if __name__ == "__main__":
    test_frontend_approval_page()
