#!/usr/bin/env python3
"""
Test the actual API endpoint while backend is running
"""

import requests
import json

def test_api():
    """Test the live API endpoint"""
    
    print("="*100)
    print(" "*30 + "LIVE API TEST")
    print("="*100)
    
    # First, we need to get a valid token by logging in
    print("\n📝 STEP 1: Getting authentication token...")
    print("-"*100)
    
    # Login with Max Pro (user with complete data)
    login_data = {
        "email": "maxpro233@gmail.com",
        "password": "password123"  # Assuming default password
    }
    
    try:
        login_response = requests.post(
            "http://localhost:3002/api/auth/login",
            json=login_data,
            timeout=10
        )
        
        if login_response.status_code == 200:
            login_result = login_response.json()
            token = login_result.get('token')
            print(f"✅ Login successful!")
            print(f"   Token: {token[:30]}...")
        else:
            print(f"❌ Login failed: {login_response.status_code}")
            print(f"   Response: {login_response.text}")
            print(f"\n⚠️  Cannot test API without valid token")
            print(f"   Try logging in through the frontend first")
            return
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Could not connect to backend at http://localhost:3002")
        print(f"   Make sure backend is running:")
        print(f"   cd backend && python app.py")
        return
    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        return
    
    # Now test the profile endpoint
    print(f"\n📝 STEP 2: Calling /api/jobseeker/profile...")
    print("-"*100)
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        profile_response = requests.get(
            "http://localhost:3002/api/jobseeker/profile",
            headers=headers,
            timeout=10
        )
        
        print(f"\n{'='*100}")
        print("API RESPONSE")
        print(f"{'='*100}\n")
        
        print(f"Status Code: {profile_response.status_code}")
        
        if profile_response.status_code == 200:
            data = profile_response.json()
            
            print(f"✅ SUCCESS! Profile data received\n")
            
            # Count filled fields
            filled_fields = [k for k, v in data.items() if v and v != '' and v != [] and k not in ['_id', 'userId']]
            
            print(f"📊 Response Summary:")
            print(f"   Total fields in response: {len(data)}")
            print(f"   Fields WITH data: {len(filled_fields)}")
            print(f"   Percentage: {int((len(filled_fields)/len(data))*100)}%")
            
            print(f"\n📋 Sample of returned fields:")
            print("-"*100)
            
            # Show important fields
            important_fields = ['firstName', 'lastName', 'email', 'dateOfBirth', 'gender', 
                              'professionalTitle', 'yearsExperience', 'nationality', 'currentCity',
                              'coreSkills', 'educationEntries', 'experienceEntries', 'languages',
                              'profileCompletion', 'isDraft', 'profileCompleted']
            
            for field in important_fields:
                if field in data:
                    value = data[field]
                    if isinstance(value, list):
                        value_display = f"{len(value)} items" if value else "Empty array"
                    elif value and value != '':
                        value_str = str(value)
                        value_display = value_str if len(value_str) <= 60 else value_str[:60] + "..."
                    else:
                        value_display = "EMPTY"
                    
                    status = "✅" if (value and value != '' and value != []) else "❌"
                    print(f"  {status} {field:30} : {value_display}")
                else:
                    print(f"  ❌ {field:30} : NOT IN RESPONSE")
            
            print(f"\n{'='*100}")
            print("VERDICT")
            print(f"{'='*100}\n")
            
            if len(filled_fields) >= 20:
                print(f"✅ SUCCESS: API is returning {len(filled_fields)} fields with data!")
                print(f"✅ MyProfile page SHOULD display this data correctly")
                print(f"\n💡 If MyProfile is still blank:")
                print(f"   1. Check browser console (F12) for errors")
                print(f"   2. Check frontend is making the API call")
                print(f"   3. Clear browser cache and try again")
            else:
                print(f"⚠️  API returned only {len(filled_fields)} fields")
                print(f"   This is less than expected")
                print(f"   Check GET endpoint flattening logic")
            
            # Show the complete response structure
            print(f"\n{'='*100}")
            print("COMPLETE API RESPONSE (formatted)")
            print(f"{'='*100}\n")
            
            # Pretty print the response
            print(json.dumps(data, indent=2, default=str)[:2000] + "\n... (truncated)")
            
        else:
            print(f"❌ FAILED: Status {profile_response.status_code}")
            print(f"   Response: {profile_response.text}")
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Could not connect to backend")
        print(f"   Make sure backend is running on http://localhost:3002")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    print(f"\n{'='*100}\n")

if __name__ == "__main__":
    try:
        test_api()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

