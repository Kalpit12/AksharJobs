"""
Test script for AksharJobs Expo MongoDB Integration
Tests registration and referral tracking APIs
"""

import requests
import json
from datetime import datetime

# API Configuration
BASE_URL = "http://localhost:3002/api/expo"

def print_section(title):
    """Print a formatted section header"""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def test_health_check():
    """Test if the API is running"""
    print_section("1. Testing API Health Check")
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("[SUCCESS] API is running successfully!")
            return True
        else:
            print("[ERROR] API returned an error")
            return False
            
    except requests.exceptions.ConnectionError:
        print("[ERROR] Cannot connect to backend server")
        print("   Make sure the backend is running: cd backend && python app.py")
        return False
    except Exception as e:
        print(f"[ERROR] {str(e)}")
        return False

def test_registration():
    """Test user registration"""
    print_section("2. Testing Registration")
    
    # Create test registration data
    test_data = {
        "fullName": "Test User MongoDB",
        "email": f"test_mongo_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com",
        "phone": "1234567890",
        "role": "job_seeker",
        "experience": "3 years",
        "skills": "Python, JavaScript, MongoDB",
        "location": "Nairobi, Kenya",
        "jobType": "Full-time",
        "industry": "Technology"
    }
    
    print(f"Registering user: {test_data['fullName']}")
    print(f"Email: {test_data['email']}")
    print(f"Role: {test_data['role']}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/register",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 201:
            print("[SUCCESS] Registration successful!")
            return test_data['email']
        else:
            print("[ERROR] Registration failed")
            return None
            
    except Exception as e:
        print(f"[ERROR] {str(e)}")
        return None

def test_check_registration(email):
    """Test checking if user is registered"""
    print_section("3. Testing Registration Check")
    
    print(f"Checking registration for: {email}")
    
    try:
        response = requests.get(
            f"{BASE_URL}/registration/{email}",
            timeout=5
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("[OK] Registration found in database!")
            return True
        else:
            print("[X] Registration not found")
            return False
            
    except Exception as e:
        print(f"[X] ERROR: {str(e)}")
        return False

def test_referral_tracking():
    """Test referral tracking"""
    print_section("4. Testing Referral Tracking")
    
    # Create test referral data
    test_referral = {
        "type": "referral",
        "referrerName": "Test Referrer",
        "referrerEmail": f"referrer_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com",
        "referrerPhone": "9876543210",
        "referrerRole": "recruiter",
        "platform": "whatsapp",
        "referralCode": "AKSHAR2025"
    }
    
    print(f"Tracking referral for: {test_referral['referrerName']}")
    print(f"Platform: {test_referral['platform']}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/referral/track",
            json=test_referral,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print("[OK] Referral tracking successful!")
                print(f"   Coins Earned: {result.get('coinsEarned', 0)}")
                print(f"   Total Coins: {result.get('totalCoins', 0)}")
                return test_referral['referrerEmail']
            else:
                print("[X] Referral tracking failed")
                return None
        else:
            print("[X] Referral tracking failed")
            return None
            
    except Exception as e:
        print(f"[X] ERROR: {str(e)}")
        return None

def test_get_referral_data(email):
    """Test getting referral data"""
    print_section("5. Testing Get Referral Data")
    
    print(f"Getting referral data for: {email}")
    
    try:
        response = requests.get(
            f"{BASE_URL}/referral/data?email={email}",
            timeout=5
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("[OK] Referral data retrieved!")
            return True
        else:
            print("[X] Failed to get referral data")
            return False
            
    except Exception as e:
        print(f"[X] ERROR: {str(e)}")
        return False

def test_registration_stats():
    """Test getting registration statistics"""
    print_section("6. Testing Registration Statistics")
    
    try:
        response = requests.get(
            f"{BASE_URL}/registrations/stats",
            timeout=5
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            stats = response.json().get('stats', {})
            print(f"\n[OK] Statistics retrieved!")
            print(f"   Total Registrations: {stats.get('total', 0)}")
            print(f"   By Role: {stats.get('byRole', [])}")
            return True
        else:
            print("[X] Failed to get statistics")
            return False
            
    except Exception as e:
        print(f"[X] ERROR: {str(e)}")
        return False

def test_leaderboard():
    """Test getting referral leaderboard"""
    print_section("7. Testing Referral Leaderboard")
    
    try:
        response = requests.get(
            f"{BASE_URL}/referral/leaderboard?limit=10",
            timeout=5
        )
        
        print(f"Status Code: {response.status_code}")
        result = response.json()
        
        if response.status_code == 200:
            leaderboard = result.get('leaderboard', [])
            print(f"[OK] Leaderboard retrieved!")
            print(f"   Total entries: {len(leaderboard)}")
            
            if leaderboard:
                print("\n   Top 5 Referrers:")
                for i, entry in enumerate(leaderboard[:5], 1):
                    print(f"   {i}. {entry.get('name')} - {entry.get('totalCoins')} coins")
            else:
                print("   (No entries yet)")
            
            return True
        else:
            print("[X] Failed to get leaderboard")
            return False
            
    except Exception as e:
        print(f"[X] ERROR: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("  EXPO MONGODB INTEGRATION TEST")
    print("="*60)
    
    # Test 1: Health Check
    if not test_health_check():
        print("\n[ABORTED] Backend server is not running")
        print("\nTo start the backend:")
        print("  cd backend")
        print("  python app.py")
        return
    
    # Test 2: Registration
    registered_email = test_registration()
    
    if registered_email:
        # Test 3: Check Registration
        test_check_registration(registered_email)
    
    # Test 4: Referral Tracking
    referrer_email = test_referral_tracking()
    
    if referrer_email:
        # Test 5: Get Referral Data
        test_get_referral_data(referrer_email)
    
    # Test 6: Registration Stats
    test_registration_stats()
    
    # Test 7: Leaderboard
    test_leaderboard()
    
    # Final Summary
    print_section("TEST SUMMARY")
    print("\n[COMPLETED] All tests finished!")
    print("\nNext steps:")
    print("1. Check MongoDB to verify data:")
    print("   mongo")
    print("   use EXPO_REGISTRATION")
    print("   db.registrations.find().pretty()")
    print("   db.referral_tracking.find().pretty()")
    print("\n2. Open frontend: AKSHAREXPO/expo_landing.html")
    print("3. Try registering through the UI")
    print("4. Check browser console for MongoDB API logs")

if __name__ == "__main__":
    main()

