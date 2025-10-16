#!/usr/bin/env python3
"""
Phone Number Verification Script for Dhruv Patel
This script checks if phone number is stored and displays it.
"""

import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:3002"  # Update this to your backend URL
API_URL = f"{BASE_URL}/api"

def print_header():
    """Print script header"""
    print("\n" + "="*60)
    print("📱 PHONE NUMBER VERIFICATION FOR DHRUV PATEL")
    print("="*60 + "\n")

def print_section(title):
    """Print section divider"""
    print(f"\n{'─'*60}")
    print(f"  {title}")
    print('─'*60)

def test_login_and_get_phone(email, password):
    """Test login and retrieve phone number"""
    print_section("🔐 Testing Login")
    
    try:
        # Login
        login_url = f"{API_URL}/auth/login"
        login_data = {
            "email": email,
            "password": password
        }
        
        print(f"Attempting login for: {email}")
        response = requests.post(login_url, json=login_data)
        
        if response.status_code == 200:
            user_data = response.json()
            print("✅ Login successful!")
            
            # Display user info
            print("\n📋 User Information:")
            print(f"  Name: {user_data.get('firstName', '')} {user_data.get('lastName', '')}")
            print(f"  Email: {user_data.get('email', 'N/A')}")
            print(f"  Phone: {user_data.get('phone', 'NOT FOUND ❌')}")
            print(f"  Role: {user_data.get('role', 'N/A')}")
            print(f"  User ID: {user_data.get('userId', 'N/A')}")
            
            # Check if phone exists
            phone = user_data.get('phone')
            if phone:
                print(f"\n✅ SUCCESS: Phone number found!")
                print(f"\n📱 PHONE NUMBER: {phone}")
                print(f"\n   Display this in the profile page!")
                return phone, user_data.get('token')
            else:
                print("\n❌ WARNING: Phone number not found in response")
                print("   The backend may not be returning the phone field")
                return None, user_data.get('token')
        else:
            error_data = response.json()
            print(f"❌ Login failed: {error_data.get('message', 'Unknown error')}")
            return None, None
            
    except Exception as e:
        print(f"❌ Error during login: {str(e)}")
        return None, None

def get_profile_data(token):
    """Get full profile data using auth token"""
    print_section("📄 Fetching Profile Data")
    
    if not token:
        print("❌ No token available. Cannot fetch profile.")
        return None
    
    try:
        profile_url = f"{API_URL}/jobseeker/profile"
        headers = {
            "Authorization": f"Bearer {token}"
        }
        
        print("Fetching profile data...")
        response = requests.get(profile_url, headers=headers)
        
        if response.status_code == 200:
            profile_data = response.json()
            print("✅ Profile data retrieved!")
            
            # Display profile info
            print("\n📋 Profile Information:")
            print(f"  Name: {profile_data.get('firstName', '')} {profile_data.get('lastName', '')}")
            print(f"  Email: {profile_data.get('email', 'N/A')}")
            print(f"  Phone: {profile_data.get('phone', 'NOT FOUND ❌')}")
            
            if profile_data.get('currentCity'):
                print(f"  Location: {profile_data.get('currentCity')}, {profile_data.get('residentCountry', '')}")
            
            if profile_data.get('professionalTitle'):
                print(f"  Title: {profile_data.get('professionalTitle')}")
            
            # Check phone
            phone = profile_data.get('phone')
            if phone:
                print(f"\n✅ SUCCESS: Phone in profile!")
                print(f"\n📱 PHONE NUMBER: {phone}")
                return phone
            else:
                print("\n⚠️  Phone not in profile data")
                return None
        else:
            print(f"❌ Failed to fetch profile: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Error fetching profile: {str(e)}")
        return None

def check_all_users(token):
    """Check all users in database (admin only)"""
    print_section("👥 Searching for Dhruv Patel in Database")
    
    if not token:
        print("❌ No token available")
        return
    
    try:
        # Try to get all users (might need admin access)
        users_url = f"{API_URL}/admin/users"  # Update based on your API
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(users_url, headers=headers)
        
        if response.status_code == 200:
            users = response.json()
            
            # Search for Dhruv Patel
            dhruv = None
            for user in users.get('users', []):
                if (user.get('firstName', '').lower() == 'dhruv' and 
                    user.get('lastName', '').lower() == 'patel'):
                    dhruv = user
                    break
            
            if dhruv:
                print("✅ Found Dhruv Patel in database!")
                print(f"\n📋 Database Record:")
                print(f"  Name: {dhruv.get('firstName')} {dhruv.get('lastName')}")
                print(f"  Email: {dhruv.get('email')}")
                print(f"  Phone: {dhruv.get('phone', 'NOT STORED ❌')}")
                print(f"  User ID: {dhruv.get('_id') or dhruv.get('userId')}")
                
                return dhruv.get('phone')
            else:
                print("⚠️  Dhruv Patel not found in database")
                return None
        else:
            print(f"⚠️  Cannot access user list (Status: {response.status_code})")
            print("   This might require admin privileges")
            return None
            
    except Exception as e:
        print(f"⚠️  Could not check users: {str(e)}")
        return None

def save_to_file(phone, user_data):
    """Save verification results to file"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    with open('dhruv_patel_verification.txt', 'w') as f:
        f.write(f"Phone Number Verification for Dhruv Patel\n")
        f.write(f"Generated: {timestamp}\n")
        f.write("="*60 + "\n\n")
        
        if phone:
            f.write(f"✅ PHONE NUMBER FOUND: {phone}\n\n")
        else:
            f.write(f"❌ PHONE NUMBER NOT FOUND\n\n")
        
        f.write("User Data:\n")
        f.write(json.dumps(user_data, indent=2))
    
    print(f"\n💾 Verification results saved to: dhruv_patel_verification.txt")

def main():
    """Main function"""
    print_header()
    
    # Dhruv Patel's credentials (update these)
    email = input("Enter Dhruv Patel's email (or press Enter for default): ").strip()
    if not email:
        email = "dhruv.patel@example.com"
    
    password = input("Enter password: ").strip()
    if not password:
        print("❌ Password is required!")
        return
    
    # Test login
    phone_from_login, token = test_login_and_get_phone(email, password)
    
    # Get profile data
    phone_from_profile = None
    if token:
        phone_from_profile = get_profile_data(token)
        
        # Try to check all users (optional)
        phone_from_db = check_all_users(token)
    
    # Final result
    print_section("📊 FINAL RESULTS")
    
    final_phone = phone_from_login or phone_from_profile
    
    if final_phone:
        print("\n✅ ✅ ✅ SUCCESS! ✅ ✅ ✅")
        print(f"\n{'='*60}")
        print(f"  DHRUV PATEL'S PHONE NUMBER: {final_phone}")
        print(f"{'='*60}\n")
        
        print("📝 Where to display this:")
        print("  1. Dashboard > My Profile > Personal Information")
        print("  2. Registration Form > Phone Number field")
        print("  3. Top bar user profile dropdown")
        
        # Save to file
        user_data = {
            'email': email,
            'phone': final_phone,
            'source': 'login' if phone_from_login else 'profile',
            'timestamp': datetime.now().isoformat()
        }
        save_to_file(final_phone, user_data)
    else:
        print("\n❌ PHONE NUMBER NOT FOUND")
        print("\nPossible reasons:")
        print("  1. Phone not entered during signup")
        print("  2. Backend not returning phone field")
        print("  3. Phone not stored in database")
        print("\n📝 Solutions:")
        print("  1. Add phone via profile/registration form")
        print("  2. Check backend response includes 'phone'")
        print("  3. Update database record manually")
    
    print("\n" + "="*60 + "\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Script interrupted by user")
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")

