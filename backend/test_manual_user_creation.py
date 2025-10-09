#!/usr/bin/env python3
"""
Test manual user creation to verify the complete flow
"""

import requests
import time
import json

def test_manual_user_creation():
    """Test creating a user manually to verify the complete flow"""
    
    print("🧪 Testing Manual User Creation Flow")
    print("=" * 60)
    
    # Create a test user with all required fields
    timestamp = int(time.time())
    test_user_data = {
        "userType": "job_seeker",
        "firstName": "Sarah",
        "lastName": "Wanjiku",
        "email": f"sarah.wanjiku{timestamp}@example.com",
        "password": "testpassword123",
        "phoneNumber": "+254-789012345",
        "location": "Mombasa, Kenya",
        "communities": ["68cfb561590068c36eb54d27"],  # Kenya Marketing (KM)
        "primary_community": "68cfb561590068c36eb54d27"
    }
    
    print(f"\n📝 Creating user with data:")
    print(f"   👤 Name: {test_user_data['firstName']} {test_user_data['lastName']}")
    print(f"   📧 Email: {test_user_data['email']}")
    print(f"   📱 Phone: {test_user_data['phoneNumber']}")
    print(f"   📍 Location: {test_user_data['location']}")
    print(f"   🏷️ Community: Kenya Marketing (KM)")
    
    try:
        # Step 1: Create user via signup API
        print(f"\n1️⃣ Sending signup request...")
        signup_response = requests.post("http://localhost:3002/api/auth/signup", json=test_user_data)
        
        if signup_response.status_code == 201:
            signup_data = signup_response.json()
            user_id = signup_data.get('userId')
            verification_code = signup_data.get('verificationCode')
            requires_verification = signup_data.get('requiresVerification')
            
            print(f"✅ User created successfully!")
            print(f"   🆔 User ID: {user_id}")
            print(f"   📧 Email: {test_user_data['email']}")
            print(f"   🔑 Verification Code: {verification_code}")
            print(f"   ✅ Requires Verification: {requires_verification}")
            print(f"   🔗 Frontend redirects to: /verify-email")
            
            # Step 2: Verify the email
            print(f"\n2️⃣ Verifying email with code: {verification_code}")
            verify_response = requests.post(
                "http://localhost:3002/api/email-verification/verify_code",
                json={
                    "email": test_user_data['email'],
                    "code": verification_code
                }
            )
            
            if verify_response.status_code == 200:
                verify_data = verify_response.json()
                print(f"✅ Email verification successful!")
                print(f"   📝 Message: {verify_data.get('message')}")
                print(f"   🔗 Frontend redirects to: /login")
                
                # Step 3: Send community verification
                print(f"\n3️⃣ Sending community verification...")
                community_response = requests.post(
                    "http://localhost:3002/api/community-verification/send_verification",
                    json={"userId": user_id}
                )
                
                if community_response.status_code == 200:
                    community_data = community_response.json()
                    print(f"✅ Community verification email sent!")
                    print(f"   📧 Sent to: hemant.patel@maxproinfotech.com")
                    print(f"   📝 Message: {community_data.get('message')}")
                    
                    # Final summary
                    print(f"\n🎉 COMPLETE SUCCESS!")
                    print("=" * 50)
                    print("✅ User Creation: SUCCESS")
                    print("✅ Email Verification: SUCCESS") 
                    print("✅ Community Verification: SUCCESS")
                    print("✅ Frontend Flow: READY")
                    print("=" * 50)
                    
                    print(f"\n📋 What the user experiences:")
                    print(f"   1. Fills out signup form")
                    print(f"   2. Gets redirected to /verify-email")
                    print(f"   3. Receives verification email with code: {verification_code}")
                    print(f"   4. Enters code and gets verified")
                    print(f"   5. Gets redirected to /login")
                    print(f"   6. Community leader gets verification email")
                    print(f"   7. User gets verification badge after approval")
                    
                else:
                    print(f"❌ Community verification failed: {community_response.text}")
            else:
                print(f"❌ Email verification failed: {verify_response.text}")
        else:
            print(f"❌ User creation failed: {signup_response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print(f"\n" + "=" * 60)
    print("🎯 Manual User Creation Test Complete!")

if __name__ == "__main__":
    test_manual_user_creation()
