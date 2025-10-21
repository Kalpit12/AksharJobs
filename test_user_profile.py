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
        print(f"User data from login: {json.dumps(data, indent=2)}")
        
        # Test AI endpoint with real token
        headers = {"Authorization": f"Bearer {token}"}
        ai_response = requests.get("http://localhost:3002/api/ai/prediction-insights", headers=headers)
        print(f"AI endpoint status: {ai_response.status_code}")
        print(f"AI response: {ai_response.text}")
            
except Exception as e:
    print(f"Error: {e}")
