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
        
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test job lookup
        print("\n=== Testing Job Lookup ===")
        job_response = requests.get("http://localhost:3002/api/debug/test-job-lookup", headers=headers)
        print(f"Job lookup status: {job_response.status_code}")
        print(f"Job lookup response: {job_response.text}")
        
        # Test AI prediction
        print("\n=== Testing AI Prediction ===")
        ai_response = requests.get("http://localhost:3002/api/debug/test-ai-prediction", headers=headers)
        print(f"AI prediction status: {ai_response.status_code}")
        print(f"AI prediction response: {ai_response.text}")
            
except Exception as e:
    print(f"Error: {e}")
