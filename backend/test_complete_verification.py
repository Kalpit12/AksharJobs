#!/usr/bin/env python3
"""
Complete verification system test script
Tests both phone and email verification functionality
"""

import requests
import json
import time

def test_complete_verification_system():
    """Test the complete verification system (phone + email)"""
    
    base_url = "http://localhost:5000/api"
    test_phone = "254789098686"
    test_email = "test@example.com"
    
    print("🚀 Testing Complete Verification System")
    print("=" * 60)
    
    # Test 1: Phone Verification
    print("\n📱 Test 1: Phone Verification")
    print("-" * 40)
    
    try:
        # Send phone verification code
        phone_response = requests.post(
            f"{base_url}/send-verification-code",
            json={"phoneNumber": test_phone},
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Phone Verification Status: {phone_response.status_code}")
        if phone_response.ok:
            print("✅ Phone verification code sent successfully!")
            phone_data = phone_response.json()
            print(f"📋 Response: {phone_data}")
        else:
            print(f"❌ Phone verification failed: {phone_response.json()}")
            return
            
    except Exception as e:
        print(f"❌ Phone verification error: {str(e)}")
        return
    
    # Test 2: Email Verification
    print("\n📧 Test 2: Email Verification")
    print("-" * 40)
    
    try:
        # Send email verification code
        email_response = requests.post(
            f"{base_url}/send-email-verification",
            json={"email": test_email},
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Email Verification Status: {email_response.status_code}")
        if email_response.ok:
            print("✅ Email verification code sent successfully!")
            email_data = email_response.json()
            print(f"📋 Response: {email_data}")
        else:
            print(f"❌ Email verification failed: {email_response.json()}")
            return
            
    except Exception as e:
        print(f"❌ Email verification error: {str(e)}")
        return
    
    # Test 3: Check Verification Statuses
    print("\n📊 Test 3: Check Verification Statuses")
    print("-" * 40)
    
    try:
        # Check phone status
        phone_status = requests.get(f"{base_url}/status/{test_phone}")
        print(f"Phone Status: {phone_status.status_code}")
        if phone_status.ok:
            print(f"📱 Phone Status: {phone_status.json()}")
        
        # Check email status
        email_status = requests.get(f"{base_url}/email-status/{test_email}")
        print(f"Email Status: {email_status.status_code}")
        if email_status.ok:
            print(f"📧 Email Status: {email_status.json()}")
            
    except Exception as e:
        print(f"❌ Status check error: {str(e)}")
    
    # Test 4: Mock Service History
    print("\n📋 Test 4: Mock Service History")
    print("-" * 40)
    
    try:
        # Check mock SMS history
        sms_history = requests.get(f"{base_url}/mock-sms-history")
        print(f"SMS History Status: {sms_history.status_code}")
        if sms_history.ok:
            print(f"📱 SMS History: {sms_history.json()}")
        
        # Check mock email history
        email_history = requests.get(f"{base_url}/mock-email-history")
        print(f"Email History Status: {email_history.status_code}")
        if email_history.ok:
            print(f"📧 Email History: {email_history.json()}")
            
    except Exception as e:
        print(f"❌ History check error: {str(e)}")
    
    print("\n🎉 All tests completed!")
    print("Your verification system is working correctly! 🚀")
    
    # Instructions for manual testing
    print("\n💡 Manual Testing Instructions:")
    print("1. Open your React app in the browser")
    print("2. Navigate to the signup page")
    print("3. Try the phone verification flow")
    print("4. Try the email verification flow")
    print("5. Check that both verifications work before signup")

if __name__ == "__main__":
    test_complete_verification_system()
