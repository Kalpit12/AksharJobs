import requests
import json

# Test the AI endpoints that the frontend is trying to call
def test_ai_endpoints():
    print("Testing AI endpoints that frontend calls...")
    
    # First, let's try to get a working token by using a different approach
    # Let's check if there are any other users we can use
    
    # Test AI model status (this should work without authentication)
    print("\n=== Testing AI Model Status ===")
    try:
        response = requests.get("http://localhost:3002/api/ai/model-status")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("Model status endpoint working!")
            print(f"Response: {response.text}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Let's try to create a simple test user and get predictions
    print("\n=== Testing with Direct Database Access ===")
    
    # Since we know the AI service works directly, let's create a simple endpoint test
    # that bypasses the authentication issue
    
    # Test if we can call the predict-all-applications endpoint with a dummy token
    print("\n=== Testing AI Predictions Endpoint ===")
    try:
        headers = {
            'Authorization': 'Bearer dummy_token',
            'Content-Type': 'application/json'
        }
        response = requests.get("http://localhost:3002/api/ai/predict-all-applications", headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_ai_endpoints()
