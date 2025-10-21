import requests
import json

# Test login and get token
login_data = {
    "email": "test@example.com",
    "password": "password123"
}

try:
    response = requests.post("http://localhost:3002/api/auth/login", json=login_data)
    if response.status_code == 200:
        data = response.json()
        token = data.get('token')
        user_id = data.get('userId')
        
        print(f"User ID: {user_id}")
        
        # Test application tracker endpoint
        headers = {"Authorization": f"Bearer {token}"}
        app_response = requests.get("http://localhost:3002/api/application-tracker/tracker/job-seeker/applications", headers=headers)
        print(f"Applications endpoint status: {app_response.status_code}")
        if app_response.status_code == 200:
            apps_data = app_response.json()
            print(f"Applications found: {len(apps_data) if isinstance(apps_data, list) else len(apps_data.get('applications', []))}")
            if isinstance(apps_data, list) and apps_data:
                print(f"First application: {apps_data[0]}")
            elif isinstance(apps_data, dict) and apps_data.get('applications'):
                print(f"First application: {apps_data['applications'][0]}")
        else:
            print(f"Applications error: {app_response.text}")
            
except Exception as e:
    print(f"Error: {e}")
