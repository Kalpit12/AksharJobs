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
        
        # Test each AI endpoint individually
        headers = {"Authorization": f"Bearer {token}"}
        
        print("\n=== Testing AI Model Status ===")
        status_response = requests.get("http://localhost:3002/api/ai/model-status", headers=headers)
        print(f"Status: {status_response.status_code}")
        print(f"Response: {status_response.text}")
        
        print("\n=== Testing Prediction Insights ===")
        insights_response = requests.get("http://localhost:3002/api/ai/prediction-insights", headers=headers)
        print(f"Status: {insights_response.status_code}")
        print(f"Response: {insights_response.text}")
        
        print("\n=== Testing All Applications Predictions ===")
        predictions_response = requests.get("http://localhost:3002/api/ai/predict-all-applications", headers=headers)
        print(f"Status: {predictions_response.status_code}")
        print(f"Response: {predictions_response.text}")
            
except Exception as e:
    print(f"Error: {e}")
