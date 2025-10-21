import requests
import json

# Test simple login without complex error handling
login_data = {
    "email": "test@example.com",
    "password": "password123"
}

try:
    print("Testing simple login...")
    response = requests.post("http://localhost:3002/api/auth/login", json=login_data, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    print(f"Response Text: {response.text}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Login successful!")
        print(f"User ID: {data.get('userId')}")
        print(f"Token length: {len(data.get('token', ''))}")
    else:
        print(f"Login failed with status {response.status_code}")
        
except requests.exceptions.RequestException as e:
    print(f"Request error: {e}")
except Exception as e:
    print(f"Other error: {e}")
