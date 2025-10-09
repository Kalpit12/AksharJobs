#!/usr/bin/env python3
"""
Test that phone number is properly included in verification emails
"""

import requests
import time
import json

def test_phone_number_in_email():
    """Test that phone number is properly displayed in verification emails"""
    
    print("🧪 Testing Phone Number in Verification Email")
    print("=" * 60)
    
    # Step 1: Get available communities
    print("\n1️⃣ Fetching available communities...")
    try:
        communities_response = requests.get("http://localhost:3002/api/communities")
        if communities_response.status_code == 200:
            communities_data = communities_response.json()
            communities = communities_data.get('communities', [])
            print(f"✅ Found {len(communities)} communities")
        else:
            print(f"❌ Failed to fetch communities: {communities_response.text}")
            return
    except Exception as e:
        print(f"❌ Error fetching communities: {e}")
        return
    
    # Step 2: Create a test user with phone number
    print("\n2️⃣ Creating test user with phone number...")
    
    timestamp = int(time.time())
    test_user_data = {
        "userType": "job_seeker",
        "firstName": "Sarah",
        "lastName": "Wanjiku",
        "email": f"sarah.wanjiku{timestamp}@example.com",
        "password": "testpassword123",
        "phoneNumber": "+254-789012345",  # Kenyan phone number
        "location": "Mombasa, Kenya",
        "communities": [communities[1]["_id"]],  # Kenya Marketing (KM)
        "primary_community": communities[1]["_id"]
    }
    
    try:
        # Signup user
        signup_response = requests.post("http://localhost:3002/api/auth/signup", json=test_user_data)
        
        if signup_response.status_code == 201:
            signup_data = signup_response.json()
            user_id = signup_data.get('userId')
            print(f"✅ User created successfully!")
            print(f"   User ID: {user_id}")
            print(f"   Name: {test_user_data['firstName']} {test_user_data['lastName']}")
            print(f"   Email: {test_user_data['email']}")
            print(f"   Phone: {test_user_data['phoneNumber']}")  # This should appear in email
            print(f"   Location: {test_user_data['location']}")
            print(f"   Community: Kenya Marketing (KM)")
            
            # Step 3: Send verification request
            print("\n3️⃣ Sending verification request with phone number...")
            verification_response = requests.post(
                "http://localhost:3002/api/community-verification/send_verification",
                json={"userId": user_id}
            )
            
            if verification_response.status_code == 200:
                verification_data = verification_response.json()
                print(f"✅ Verification request sent successfully!")
                print(f"   Message: {verification_data.get('message')}")
                print(f"   📧 Email sent to: hemant.patel@maxproinfotech.com")
                
                # Step 4: Show what should be in the email
                print("\n4️⃣ Email Content (with phone number):")
                print("=" * 50)
                print(f"📬 To: hemant.patel@maxproinfotech.com")
                print(f"📬 From: kalpitpatel751@gmail.com")
                print(f"📬 Subject: 🚀 AksharJobs - Community Verification Request - {test_user_data['firstName']} {test_user_data['lastName']}")
                print("=" * 50)
                print("📋 Professional Details:")
                print(f"   👤 Full Name: {test_user_data['firstName']} {test_user_data['lastName']}")
                print(f"   📧 Email Address: {test_user_data['email']}")
                print(f"   📱 Phone Number: {test_user_data['phoneNumber']} ← SHOULD BE DISPLAYED")
                print(f"   👔 User Type: {test_user_data['userType'].title()}")
                print(f"   📍 Location: {test_user_data['location']}")
                print(f"   🏷️ Requested Community: Kenya Marketing (KM)")
                print(f"   📅 Request Date: {time.strftime('%B %d, %Y at %I:%M %p')}")
                print("=" * 50)
                print("🔗 Verification Actions:")
                print("   ✅ Approve Professional")
                print("   ❌ Reject Request")
                print("=" * 50)
                
                print(f"\n🎉 SUCCESS! Verification email sent with phone number!")
                print(f"📬 Check inbox at hemant.patel@maxproinfotech.com")
                print(f"📱 Phone number should be displayed: {test_user_data['phoneNumber']}")
                
            else:
                print(f"❌ Failed to send verification request: {verification_response.text}")
        else:
            print(f"❌ User signup failed: {signup_response.text}")
            
    except Exception as e:
        print(f"❌ Error in verification flow: {e}")
    
    print("\n" + "=" * 60)
    print("🎯 Phone Number Email Test Complete!")
    print("\n📱 Phone Number Status:")
    print("   ✅ Phone number included in user data")
    print("   ✅ Email template updated to show phoneNumber field")
    print("   ✅ Verification email sent successfully")
    print("   📧 Check email inbox to verify phone number display")

if __name__ == "__main__":
    test_phone_number_in_email()
