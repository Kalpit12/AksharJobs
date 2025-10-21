#!/usr/bin/env python3
"""
Test script for AI Prediction System
Tests the complete AI-powered application tracker functionality
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:3002"
FRONTEND_URL = "http://localhost:3003"

def print_section(title):
    """Print a formatted section header"""
    print(f"\n{'='*60}")
    print(f"[AI] {title}")
    print(f"{'='*60}")

def print_result(title, success, details=None):
    """Print a formatted result"""
    status = "[PASS]" if success else "[FAIL]"
    print(f"{status} {title}")
    if details:
        print(f"   Details: {details}")

def login_user():
    """Login as a test user and return token"""
    print_section("User Authentication")
    
    login_data = {
        "email": "test@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Debug: Login response keys: {list(data.keys())}")
            token = data.get('access_token') or data.get('token')
            user_info = data.get('user', {})
            
            print_result("User Login", True, f"Logged in as {user_info.get('email', 'Unknown')}")
            if not token:
                print_result("Token Extraction", False, f"No token found in response. Available keys: {list(data.keys())}")
                return None
            return token
        else:
            print_result("User Login", False, f"Status: {response.status_code}")
            return None
            
    except Exception as e:
        print_result("User Login", False, f"Error: {str(e)}")
        return None

def test_model_status(token):
    """Test AI model status"""
    print_section("AI Model Status Check")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/api/ai/model-status", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            model_loaded = data.get('model_loaded', False)
            feature_columns = data.get('feature_columns', [])
            
            print_result("Model Status Check", True, f"Model loaded: {model_loaded}")
            print(f"   Feature columns: {len(feature_columns)}")
            
            return True
        else:
            print_result("Model Status Check", False, f"Status: {response.status_code}")
            return False
            
    except Exception as e:
        print_result("Model Status Check", False, f"Error: {str(e)}")
        return False

def test_prediction_insights(token):
    """Test AI prediction insights"""
    print_section("AI Prediction Insights")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/api/ai/prediction-insights", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            insights = data.get('insights', [])
            
            print_result("Prediction Insights", True, f"Found {len(insights)} insights")
            
            for i, insight in enumerate(insights[:3]):  # Show first 3 insights
                print(f"   Insight {i+1}: {insight.get('message', 'No message')}")
                
            return True
        else:
            print_result("Prediction Insights", False, f"Status: {response.status_code}")
            return False
            
    except Exception as e:
        print_result("Prediction Insights", False, f"Error: {str(e)}")
        return False

def test_all_applications_predictions(token):
    """Test AI predictions for all applications"""
    print_section("AI Predictions for All Applications")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/api/ai/predict-all-applications", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            applications = data.get('applications', [])
            
            print_result("All Applications Predictions", True, f"Found {len(applications)} applications with predictions")
            
            for i, app in enumerate(applications[:5]):  # Show first 5 applications
                job_title = app.get('job_title', 'Unknown')
                company = app.get('company', 'Unknown')
                probability = app.get('success_probability', 0)
                confidence = app.get('confidence_level', 'Unknown')
                
                print(f"   App {i+1}: {job_title} at {company}")
                print(f"      Success Probability: {probability}%")
                print(f"      Confidence Level: {confidence}")
                
            return True
        else:
            print_result("All Applications Predictions", False, f"Status: {response.status_code}")
            return False
            
    except Exception as e:
        print_result("All Applications Predictions", False, f"Error: {str(e)}")
        return False

def test_single_application_prediction(token, application_id):
    """Test AI prediction for a single application"""
    print_section("Single Application Prediction")
    
    headers = {"Authorization": f"Bearer {token}"}
    data = {"application_id": application_id}
    
    try:
        response = requests.post(f"{BASE_URL}/api/ai/predict-success", json=data, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            probability = data.get('success_probability', 0)
            confidence = data.get('confidence_level', 'Unknown')
            explanation = data.get('explanation', [])
            features = data.get('features', {})
            
            print_result("Single Application Prediction", True, f"Success Probability: {probability}%")
            print(f"   Confidence Level: {confidence}")
            print(f"   Explanation: {explanation[:2]}")  # Show first 2 explanations
            print(f"   Features: {features}")
            
            return True
        else:
            print_result("Single Application Prediction", False, f"Status: {response.status_code}")
            return False
            
    except Exception as e:
        print_result("Single Application Prediction", False, f"Error: {str(e)}")
        return False

def test_model_training(token):
    """Test AI model training (admin only)"""
    print_section("AI Model Training")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.post(f"{BASE_URL}/api/ai/train-model", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            training_samples = data.get('training_samples', 0)
            
            print_result("Model Training", True, f"Trained with {training_samples} samples")
            return True
        elif response.status_code == 403:
            print_result("Model Training", False, "Admin access required (expected for non-admin users)")
            return True  # This is expected for non-admin users
        else:
            print_result("Model Training", False, f"Status: {response.status_code}")
            return False
            
    except Exception as e:
        print_result("Model Training", False, f"Error: {str(e)}")
        return False

def test_frontend_integration():
    """Test frontend integration"""
    print_section("Frontend Integration Test")
    
    try:
        response = requests.get(FRONTEND_URL)
        
        if response.status_code == 200:
            print_result("Frontend Access", True, "Frontend is accessible")
            return True
        else:
            print_result("Frontend Access", False, f"Status: {response.status_code}")
            return False
            
    except Exception as e:
        print_result("Frontend Access", False, f"Error: {str(e)}")
        return False

def run_all_tests():
    """Run all AI prediction system tests"""
    print_section("AI-Powered Application Tracker Test Suite")
    print(f"Testing at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test results tracking
    results = []
    
    # 1. Login
    token = login_user()
    if not token:
        print("\n[ERROR] Cannot proceed without authentication token")
        return
    results.append(("Authentication", True))
    
    # 2. Test model status
    model_status = test_model_status(token)
    results.append(("Model Status", model_status))
    
    # 3. Test prediction insights
    insights = test_prediction_insights(token)
    results.append(("Prediction Insights", insights))
    
    # 4. Test all applications predictions
    all_predictions = test_all_applications_predictions(token)
    results.append(("All Applications Predictions", all_predictions))
    
    # 5. Test single application prediction (if we have applications)
    if all_predictions:
        # Try to get the first application ID
        try:
            response = requests.get(f"{BASE_URL}/api/ai/predict-all-applications", 
                                  headers={"Authorization": f"Bearer {token}"})
            if response.status_code == 200:
                data = response.json()
                applications = data.get('applications', [])
                if applications:
                    first_app_id = applications[0].get('application_id')
                    single_prediction = test_single_application_prediction(token, first_app_id)
                    results.append(("Single Application Prediction", single_prediction))
        except:
            results.append(("Single Application Prediction", False))
    else:
        results.append(("Single Application Prediction", False))
    
    # 6. Test model training
    training = test_model_training(token)
    results.append(("Model Training", training))
    
    # 7. Test frontend integration
    frontend = test_frontend_integration()
    results.append(("Frontend Integration", frontend))
    
    # Print summary
    print_section("Test Summary")
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    print(f"Tests Passed: {passed}/{total}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    print("\nDetailed Results:")
    for test_name, success in results:
        status = "[PASS]" if success else "[FAIL]"
        print(f"  {status} {test_name}")
    
    if passed == total:
        print("\n[SUCCESS] All tests passed! AI Prediction System is working correctly!")
    else:
        print(f"\n[WARNING] {total - passed} test(s) failed. Check the details above.")
    
    print(f"\nFrontend URL: {FRONTEND_URL}/application-tracker")
    print("You can now test the AI-powered application tracker in your browser!")

if __name__ == "__main__":
    run_all_tests()
