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
        
        # Test getting applications first
        headers = {"Authorization": f"Bearer {token}"}
        app_response = requests.get("http://localhost:3002/api/application-tracker/tracker/job-seeker/applications", headers=headers)
        print(f"Applications status: {app_response.status_code}")
        
        if app_response.status_code == 200:
            applications = app_response.json()
            print(f"Found {len(applications)} applications")
            
            if applications:
                first_app = applications[0]
                print(f"First application ID: {first_app['_id']}")
                print(f"Job ID: {first_app['job_id']}")
                
                # Test single application prediction
                print("\n=== Testing Single Application Prediction ===")
                pred_data = {"application_id": first_app['_id']}
                pred_response = requests.post("http://localhost:3002/api/ai/predict-success", json=pred_data, headers=headers)
                print(f"Prediction status: {pred_response.status_code}")
                print(f"Prediction response: {pred_response.text}")
        
        # Test AI insights
        print("\n=== Testing AI Insights ===")
        insights_response = requests.get("http://localhost:3002/api/ai/prediction-insights", headers=headers)
        print(f"Insights status: {insights_response.status_code}")
        print(f"Insights response: {insights_response.text}")
            
except Exception as e:
    print(f"Error: {e}")
