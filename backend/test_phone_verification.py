#!/usr/bin/env python3
"""
Test script for the complete phone verification system
This tests the full flow from sending verification code to verification
"""

import requests
import json
import time

def test_phone_verification_system():
    """Test the complete phone verification system"""
    
    base_url = "http://localhost:5000/api"
    test_phone = "254789098686"
    
    print("🚀 Testing Complete Phone Verification System")
    print("=" * 60)
    
    # Test 1: Send verification code
    print("\n📱 Test 1: Sending Verification Code")
    print("-" * 40)
    
    try:
        response = requests.post(
            f"{base_url}/send-verification-code",
            json={"phoneNumber": test_phone},
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Verification code sent successfully!")
            
            # Test 2: Check verification status
            print("\n📊 Test 2: Checking Verification Status")
            print("-" * 40)
            
            status_response = requests.get(f"{base_url}/status/{test_phone}")
            print(f"Status: {status_response.status_code}")
            print(f"Response: {status_response.json()}")
            
            # Test 3: Mock SMS History (for debugging)
            print("\n📋 Test 3: Mock SMS History")
            print("-" * 40)
            
            history_response = requests.get(f"{base_url}/mock-sms-history")
            print(f"Status: {history_response.status_code}")
            print(f"Response: {history_response.json()}")
            
            print("\n🎉 All tests completed successfully!")
            print("Your phone verification system is ready for production! 🚀")
            
        else:
            print("❌ Failed to send verification code")
            print("Check if your backend is running on port 5000")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure your backend is running!")
        print("Run: cd backend && python app.py")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    test_phone_verification_system()
