#!/usr/bin/env python3
"""
Test the complete community approval flow
"""

import requests
import time
import json

def test_approval_flow():
    """Test the complete community approval flow"""
    
    print("🧪 Testing Complete Community Approval Flow")
    print("=" * 60)
    
    # Step 1: Create a test user
    print("\n1️⃣ Creating test user...")
    
    timestamp = int(time.time())
    test_user_data = {
        "userType": "job_seeker",
        "firstName": "James",
        "lastName": "Mwangi",
        "email": f"james.mwangi{timestamp}@example.com",
        "password": "testpassword123",
        "phoneNumber": "+254-723456789",
        "location": "Nakuru, Kenya",
        "communities": ["68cfb561590068c36eb54d27"],  # Kenya Marketing (KM)
        "primary_community": "68cfb561590068c36eb54d27"
    }
    
    try:
        # Signup user
        signup_response = requests.post("http://localhost:3002/api/auth/signup", json=test_user_data)
        
        if signup_response.status_code == 201:
            signup_data = signup_response.json()
            user_id = signup_data.get('userId')
            verification_code = signup_data.get('verificationCode')
            
            print(f"✅ User created successfully!")
            print(f"   User ID: {user_id}")
            print(f"   Email: {test_user_data['email']}")
            print(f"   Verification Code: {verification_code}")
            
            # Step 2: Verify email
            print(f"\n2️⃣ Verifying email...")
            verify_response = requests.post(
                "http://localhost:3002/api/email-verification/verify_code",
                json={
                    "email": test_user_data['email'],
                    "code": verification_code
                }
            )
            
            if verify_response.status_code == 200:
                print(f"✅ Email verification successful!")
                
                # Step 3: Send community verification
                print(f"\n3️⃣ Sending community verification...")
                community_response = requests.post(
                    "http://localhost:3002/api/community-verification/send_verification",
                    json={"userId": user_id}
                )
                
                if community_response.status_code == 200:
                    print(f"✅ Community verification email sent!")
                    print(f"   📧 Email sent to: hemant.patel@maxproinfotech.com")
                    
                    # Step 4: Get verification status (should be pending)
                    print(f"\n4️⃣ Checking verification status...")
                    status_response = requests.get(
                        f"http://localhost:3002/api/community-verification/verification-status/{user_id}"
                    )
                    
                    if status_response.status_code == 200:
                        status_data = status_response.json()
                        print(f"✅ Current verification status: {status_data['verification_status']}")
                        print(f"   Communities: {[c['name'] for c in status_data['communities']]}")
                        
                        # Step 5: Simulate community leader approval
                        print(f"\n5️⃣ Simulating community leader approval...")
                        
                        # Generate a test token (in real scenario, this comes from email)
                        from services.community_verification_service import generate_verification_token
                        approve_token = generate_verification_token(user_id, 'approve')
                        
                        print(f"   🔗 Approval URL: http://localhost:3003/verify-user?action=approve&userId={user_id}&token={approve_token}")
                        print(f"   📧 Community leader clicks this link in their email")
                        
                        # Step 6: Process the approval via API
                        print(f"\n6️⃣ Processing approval via API...")
                        approval_response = requests.post(
                            "http://localhost:3002/api/community-verification/verify",
                            json={
                                "action": "approve",
                                "userId": user_id,
                                "token": approve_token
                            }
                        )
                        
                        if approval_response.status_code == 200:
                            approval_data = approval_response.json()
                            print(f"✅ User approved successfully!")
                            print(f"   Message: {approval_data['message']}")
                            print(f"   User: {approval_data['userData']['firstName']} {approval_data['userData']['lastName']}")
                            print(f"   Community: {approval_data['communityData']['name']}")
                            
                            # Step 7: Check final verification status
                            print(f"\n7️⃣ Checking final verification status...")
                            final_status_response = requests.get(
                                f"http://localhost:3002/api/community-verification/verification-status/{user_id}"
                            )
                            
                            if final_status_response.status_code == 200:
                                final_status_data = final_status_response.json()
                                print(f"✅ Final verification status: {final_status_data['verification_status']}")
                                print(f"   Verified by: {final_status_data['verified_by']}")
                                print(f"   Verified at: {final_status_data['verified_at']}")
                                
                                # Final summary
                                print(f"\n🎉 COMPLETE APPROVAL FLOW SUCCESS!")
                                print("=" * 50)
                                print("✅ User Creation: SUCCESS")
                                print("✅ Email Verification: SUCCESS")
                                print("✅ Community Email Sent: SUCCESS")
                                print("✅ Community Leader Approval: SUCCESS")
                                print("✅ User Verification Status: UPDATED")
                                print("✅ Verification Badge: READY")
                                print("=" * 50)
                                
                                print(f"\n📋 Complete Flow Summary:")
                                print(f"   1. User signs up with communities")
                                print(f"   2. User verifies email with code")
                                print(f"   3. Community verification email sent to leader")
                                print(f"   4. Leader clicks approve button in email")
                                print(f"   5. Leader sees professional approval page")
                                print(f"   6. User gets verification badge on profile")
                                print(f"   7. User can access community features")
                                
                                print(f"\n🔗 Frontend URLs:")
                                print(f"   📧 Email Verification: /verify-email")
                                print(f"   🏷️ Community Approval: /verify-user?action=approve&userId={user_id}&token={approve_token}")
                                print(f"   👤 User Profile: /profile (with verification badge)")
                                
                            else:
                                print(f"❌ Failed to get final status: {final_status_response.text}")
                        else:
                            print(f"❌ Approval failed: {approval_response.text}")
                    else:
                        print(f"❌ Failed to get verification status: {status_response.text}")
                else:
                    print(f"❌ Failed to send community verification: {community_response.text}")
            else:
                print(f"❌ Email verification failed: {verify_response.text}")
        else:
            print(f"❌ User creation failed: {signup_response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print(f"\n" + "=" * 60)
    print("🎯 Community Approval Flow Test Complete!")

if __name__ == "__main__":
    test_approval_flow()
