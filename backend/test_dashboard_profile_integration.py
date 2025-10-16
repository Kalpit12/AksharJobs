"""Test if dashboard now fetches profile data correctly"""
import requests
import json

# Configuration
BASE_URL = "http://localhost:3002"
FRONTEND_URL = "http://localhost:3003"

# Test User Credentials
TEST_USER = {
    "email": "Dhruvpatel771@gmail.com",
    "password": "Dhruv@123"
}

def test_dashboard_profile_integration():
    print("="*80)
    print("TESTING DASHBOARD + PROFILE INTEGRATION")
    print("="*80)
    
    # Step 1: Login
    print("\n1. Logging in...")
    login_url = f"{BASE_URL}/api/auth/login"
    login_response = requests.post(login_url, json=TEST_USER)
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        return
    
    token = login_response.json().get('token')
    print(f"✅ Login successful! Token: {token[:50]}...")
    
    # Step 2: Test Dashboard Data
    print("\n2. Testing Dashboard Data...")
    dashboard_url = f"{BASE_URL}/api/data"
    headers = {"Authorization": f"Bearer {token}"}
    
    dashboard_response = requests.get(dashboard_url, headers=headers)
    if dashboard_response.status_code == 200:
        dashboard_data = dashboard_response.json()
        print("✅ Dashboard data fetched successfully!")
        print(f"   User Name: {dashboard_data.get('user', {}).get('name')}")
        print(f"   User Email: {dashboard_data.get('user', {}).get('email')}")
        print(f"   User Phone: {dashboard_data.get('user', {}).get('phone')}")
    else:
        print(f"❌ Dashboard data failed: {dashboard_response.status_code}")
    
    # Step 3: Test Profile Data
    print("\n3. Testing Profile Data...")
    profile_url = f"{BASE_URL}/api/jobseeker/profile"
    
    profile_response = requests.get(profile_url, headers=headers)
    if profile_response.status_code == 200:
        profile_data = profile_response.json()
        print("✅ Profile data fetched successfully!")
        print(f"   First Name: {profile_data.get('firstName')}")
        print(f"   Last Name: {profile_data.get('lastName')}")
        print(f"   Email: {profile_data.get('email')}")
        print(f"   Phone: {profile_data.get('phone')}")
        print(f"   Professional Title: {profile_data.get('professionalTitle')}")
        print(f"   Years Experience: {profile_data.get('yearsOfExperience')}")
        print(f"   Core Skills: {len(profile_data.get('coreSkills', []))} skills")
        print(f"   Experience Entries: {len(profile_data.get('experienceEntries', []))} entries")
        print(f"   Education Entries: {len(profile_data.get('educationEntries', []))} entries")
    else:
        print(f"❌ Profile data failed: {profile_response.status_code}")
        print(f"   Error: {profile_response.text}")
    
    # Step 4: Test Combined Data
    print("\n4. Testing Combined Data (what dashboard should show)...")
    if dashboard_response.status_code == 200 and profile_response.status_code == 200:
        combined_user = {
            **dashboard_data.get('user', {}),
            **profile_data
        }
        
        print("✅ Combined data structure:")
        print(f"   Name: {combined_user.get('name')} (from dashboard)")
        print(f"   First Name: {combined_user.get('firstName')} (from profile)")
        print(f"   Last Name: {combined_user.get('lastName')} (from profile)")
        print(f"   Email: {combined_user.get('email')} (from profile)")
        print(f"   Phone: {combined_user.get('phone')} (from profile)")
        print(f"   Professional Title: {combined_user.get('professionalTitle')} (from profile)")
        print(f"   Years Experience: {combined_user.get('yearsOfExperience')} (from profile)")
        print(f"   Core Skills: {combined_user.get('coreSkills')} (from profile)")
        
        # Check if data is properly populated
        has_real_data = (
            combined_user.get('firstName') and 
            combined_user.get('lastName') and 
            combined_user.get('professionalTitle') and
            combined_user.get('coreSkills')
        )
        
        if has_real_data:
            print("\n🎉 SUCCESS! Dashboard should now display real data!")
            print("   The frontend should show:")
            print(f"   - Name: {combined_user.get('firstName')} {combined_user.get('lastName')}")
            print(f"   - Job Title: {combined_user.get('professionalTitle')}")
            print(f"   - Skills: {len(combined_user.get('coreSkills', []))} skills")
        else:
            print("\n❌ ISSUE: Combined data still has placeholder values")
    else:
        print("❌ Cannot test combined data - one or both API calls failed")
    
    print("\n" + "="*80)
    print("TEST COMPLETE")
    print("="*80)

if __name__ == "__main__":
    test_dashboard_profile_integration()
