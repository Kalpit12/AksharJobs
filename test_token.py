import requests
import json

# Test login and get token
login_data = {
    "email": "test@example.com",
    "password": "password123"
}

try:
    response = requests.post("http://localhost:3002/api/auth/login", json=login_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        token = data.get('token')
        print(f"Token: {token[:50]}..." if token else "No token found")
        print(f"Response keys: {list(data.keys())}")
        
        # Test AI endpoint with real token
        if token:
            headers = {"Authorization": f"Bearer {token}"}
            ai_response = requests.get("http://localhost:3002/api/ai/prediction-insights", headers=headers)
            print(f"AI endpoint status: {ai_response.status_code}")
            print(f"AI response: {ai_response.text}")
    else:
        print(f"Login failed: {response.text}")
except Exception as e:
    print(f"Error: {e}")
