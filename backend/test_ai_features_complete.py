"""
Comprehensive Test Suite for All AI Features
Tests each AI feature individually and provides detailed results
"""

import requests
import json
from datetime import datetime
from bson import ObjectId

# Configuration
BASE_URL = "http://localhost:3002"
API_URL = f"{BASE_URL}/api"

# Test accounts
TEST_ACCOUNTS = {
    'jobseeker': {
        'email': 'jobseeker@test.com',
        'password': 'Test123!@#',
        'role': 'jobSeeker'
    },
    'intern': {
        'email': 'intern@test.com',
        'password': 'Test123!@#',
        'role': 'intern'
    },
    'recruiter': {
        'email': 'recruiter@test.com',
        'password': 'Test123!@#',
        'role': 'recruiter'
    }
}

def print_section(title, emoji="🧪"):
    print(f"\n{'='*70}")
    print(f"  {emoji} {title}")
    print(f"{'='*70}\n")

def print_result(success, message):
    icon = "✅" if success else "❌"
    print(f"{icon} {message}")

def login_user(user_type):
    """Login and get JWT token"""
    print_section(f"Logging in as {user_type.upper()}", "🔐")
    
    credentials = TEST_ACCOUNTS[user_type]
    login_url = f"{API_URL}/auth/login"
    
    try:
        response = requests.post(login_url, json={
            'email': credentials['email'],
            'password': credentials['password']
        })
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            user_id = data.get('userId')
            print_result(True, f"Login successful - User ID: {user_id}")
            return token, user_id
        else:
            print_result(False, f"Login failed: {response.text}")
            return None, None
    except Exception as e:
        print_result(False, f"Login error: {e}")
        return None, None

# ===== TEST 1: AI Career Path Advisor =====

def test_career_path_advisor():
    """Test AI Career Path Advisor for Job Seekers"""
    print_section("TEST 1: AI Career Path Advisor (Job Seeker)", "🎯")
    
    token, user_id = login_user('jobseeker')
    if not token:
        print_result(False, "Cannot test - login failed")
        return False
    
    endpoint = f"{API_URL}/ai/career-path-advisor"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    print(f"📍 Endpoint: POST {endpoint}")
    print(f"🎫 Token: {token[:20]}...")
    
    try:
        response = requests.post(endpoint, headers=headers)
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_result(True, "Career path generated successfully!")
            
            # Verify structure
            print(f"\n📋 Career Roadmap Structure:")
            if 'roadmap' in data:
                roadmap = data['roadmap']
                print(f"   ✓ Current Position: {roadmap['current_position']['title']}")
                print(f"   ✓ Year 1-2: {roadmap['year_1_2']['title']} (Salary +{roadmap['year_1_2']['salary_increase']})")
                print(f"   ✓ Year 3-4: {roadmap['year_3_4']['title']} (Salary +{roadmap['year_3_4']['salary_increase']})")
                print(f"   ✓ Year 5+: {roadmap['year_5']['title']} (Salary +{roadmap['year_5']['salary_increase']})")
            
            if 'recommendations' in data:
                print(f"\n📚 Recommendations:")
                print(f"   ✓ Immediate Actions: {len(data['recommendations']['immediate_actions'])} items")
                print(f"   ✓ Learning Resources: {len(data['recommendations']['learning_resources'])} items")
                print(f"   ✓ Networking Tips: {len(data['recommendations']['networking_tips'])} items")
            
            print(f"\n🤖 AI Confidence: {(data.get('ai_confidence', 0) * 100):.0f}%")
            return True
        else:
            print_result(False, f"Failed: {response.text}")
            return False
            
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False

# ===== TEST 2: AI Project Recommender =====

def test_project_recommender():
    """Test AI Project Recommender for Interns"""
    print_section("TEST 2: AI Project Recommender (Intern)", "💡")
    
    token, user_id = login_user('intern')
    if not token:
        print_result(False, "Cannot test - login failed or no intern account")
        return False
    
    endpoint = f"{API_URL}/ai/project-recommender"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    print(f"📍 Endpoint: POST {endpoint}")
    
    try:
        response = requests.post(endpoint, headers=headers)
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_result(True, "Projects recommended successfully!")
            
            # Verify structure
            if 'recommended_projects' in data:
                print(f"\n📋 Recommended Projects ({len(data['recommended_projects'])} total):")
                for i, project in enumerate(data['recommended_projects'], 1):
                    print(f"\n   {i}. {project['title']}")
                    print(f"      - Difficulty: {project['difficulty']}")
                    print(f"      - Impact: {project['impact']}")
                    print(f"      - Duration: {project['duration']}")
                    print(f"      - Resume Value: {project['resume_value']}/10")
                    print(f"      - Skills: {', '.join(project['skills_learned'][:3])}...")
            
            print(f"\n💡 Tips Provided: {len(data.get('tips', []))} tips")
            print(f"🤖 AI Confidence: {(data.get('ai_confidence', 0) * 100):.0f}%")
            return True
        else:
            print_result(False, f"Failed: {response.text}")
            return False
            
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False

# ===== TEST 3: AI Learning Path Generator =====

def test_learning_path_generator():
    """Test AI Learning Path Generator for Interns"""
    print_section("TEST 3: AI Learning Path Generator (Intern)", "📚")
    
    token, user_id = login_user('intern')
    if not token:
        print_result(False, "Cannot test - login failed")
        return False
    
    endpoint = f"{API_URL}/ai/learning-path-generator"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    print(f"📍 Endpoint: POST {endpoint}")
    
    try:
        response = requests.post(endpoint, headers=headers)
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_result(True, "Learning path generated successfully!")
            
            # Verify structure
            print(f"\n📋 Learning Plan ({data.get('total_duration_weeks', 0)} weeks):")
            print(f"   ✓ Estimated Hours: {data.get('estimated_hours', 0)}h")
            
            if 'learning_plan' in data:
                for phase_key, phase in data['learning_plan'].items():
                    print(f"\n   {phase_key.upper()}:")
                    print(f"      - Week: {phase['week']}")
                    print(f"      - Topics: {len(phase['topics'])} topics")
                    print(f"      - Resources: {len(phase['resources'])} resources")
                    print(f"      - Milestone: {phase['milestone']}")
            
            print(f"\n📅 Weekly Schedule: {len(data.get('weekly_schedule', []))} weeks planned")
            print(f"🤖 AI Confidence: {(data.get('ai_confidence', 0) * 100):.0f}%")
            return True
        else:
            print_result(False, f"Failed: {response.text}")
            return False
            
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False

# ===== TEST 4: AI Job Description Generator =====

def test_job_description_generator():
    """Test AI Job Description Generator for Recruiters"""
    print_section("TEST 4: AI Job Description Generator (Recruiter)", "✨")
    
    token, user_id = login_user('recruiter')
    if not token:
        print_result(False, "Cannot test - login failed")
        return False
    
    endpoint = f"{API_URL}/ai/job-description-generator"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    test_data = {
        'jobTitle': 'Senior Software Engineer',
        'companyName': 'TechCorp',
        'location': 'San Francisco, CA',
        'experienceLevel': 'Senior',
        'skills': ['Python', 'React', 'AWS', 'Docker'],
        'jobType': 'Full-time',
        'workMode': 'Hybrid'
    }
    
    print(f"📍 Endpoint: POST {endpoint}")
    print(f"📝 Input: {test_data['jobTitle']} at {test_data['companyName']}")
    
    try:
        response = requests.post(endpoint, json=test_data, headers=headers)
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_result(True, "Job description generated successfully!")
            
            # Verify structure
            print(f"\n📋 Generated Content:")
            print(f"   ✓ Description Length: {len(data.get('generated_description', ''))} characters")
            print(f"   ✓ Responsibilities: {len(data.get('responsibilities', []))} items")
            print(f"   ✓ Requirements: {len(data.get('requirements', []))} items")
            print(f"   ✓ SEO Keywords: {len(data.get('seo_keywords', []))} keywords")
            
            print(f"\n📈 Predictions:")
            print(f"   ✓ Expected Applications: {data.get('predicted_applications', 0)}")
            print(f"   ✓ Diversity Score: {(data.get('diversity_score', 0) * 100):.0f}%")
            print(f"   ✓ Readability Score: {(data.get('readability_score', 0) * 100):.0f}%")
            
            print(f"\n💡 Optimization Tips: {len(data.get('optimization_tips', []))} tips")
            print(f"🤖 AI Confidence: {(data.get('ai_confidence', 0) * 100):.0f}%")
            
            # Show sample
            print(f"\n📄 Sample Description (first 200 chars):")
            print(f"   {data.get('generated_description', '')[:200]}...")
            
            return True
        else:
            print_result(False, f"Failed: {response.text}")
            return False
            
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False

# ===== TEST 5: AI Application Review =====

def test_application_review():
    """Test AI Application Review for Recruiters"""
    print_section("TEST 5: AI Application Review Assistant (Recruiter)", "🔍")
    
    token, user_id = login_user('recruiter')
    if not token:
        print_result(False, "Cannot test - login failed")
        return False
    
    # First, we need to get or create a test application
    print("📋 Note: This test requires an existing application in the database")
    print("   If you have applications, the test will use the first one found")
    
    # Create a mock application for testing
    print("📋 Creating mock application for testing...")
    
    # Test with mock application data
    endpoint = f"{API_URL}/ai/application-review"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Mock application data for testing
    mock_application_data = {
        'applicationId': '507f1f77bcf86cd799439011',  # Mock ObjectId
        'candidateName': 'John Doe',
        'skills': ['Python', 'React', 'JavaScript', 'Node.js'],
        'experience': '3 years',
        'resumeText': 'Experienced software developer with strong background in web development...'
    }
    
    print(f"📍 Endpoint: POST {endpoint}")
    print(f"📝 Testing with mock application data")
    
    try:
        response = requests.post(
            endpoint,
            json=mock_application_data,
            headers=headers
        )
        
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_result(True, "Application reviewed successfully!")
            
            # Verify structure
            print(f"\n📋 Review Results:")
            print(f"   ✓ Overall Score: {data.get('overall_score', 0)}%")
            print(f"   ✓ Match Percentage: {data.get('match_percentage', 0):.1f}%")
            print(f"   ✓ Recommendation: {data.get('recommendation', 'N/A')}")
            print(f"   ✓ Priority: {data.get('priority', 'N/A')}")
            
            print(f"\n💪 Strengths: {len(data.get('strengths', []))} identified")
            for strength in data.get('strengths', [])[:3]:
                print(f"      • {strength}")
            
            print(f"\n⚠️  Concerns: {len(data.get('concerns', []))} identified")
            for concern in data.get('concerns', [])[:3]:
                print(f"      • {concern}")
            
            print(f"\n🎯 Skills Match:")
            print(f"   ✓ Matched: {len(data.get('skill_matches', []))} skills")
            print(f"   ✗ Missing: {len(data.get('missing_skills', []))} skills")
            
            print(f"\n❓ Interview Questions: {len(data.get('suggested_interview_questions', []))} suggested")
            print(f"⏱️  Time Saved: {data.get('estimated_review_time_saved', 'N/A')}")
            print(f"🤖 AI Confidence: {(data.get('ai_confidence', 0) * 100):.0f}%")
            
            return True
        else:
            print_result(False, f"Failed: {response.text}")
            return False
            
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False

# ===== TEST 6: AI Offer Acceptance Predictor =====

def test_offer_predictor():
    """Test AI Offer Acceptance Predictor for Recruiters"""
    print_section("TEST 6: AI Offer Acceptance Predictor (Recruiter)", "📊")
    
    token, user_id = login_user('recruiter')
    if not token:
        print_result(False, "Cannot test - login failed")
        return False
    
    # Use mock candidate data for testing
    print("📋 Using mock candidate data for testing...")
    
    endpoint = f"{API_URL}/ai/offer-acceptance-predictor"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Mock candidate data for testing
    test_offer = {
        'candidateId': '507f1f77bcf86cd799439011',  # Mock ObjectId
        'offeredSalary': 120000,
        'candidateCurrentSalary': 100000,
        'jobTitle': 'Senior Software Engineer',
        'workMode': 'Hybrid',
        'benefits': ['Health Insurance', '401k', 'Remote Work', 'Unlimited PTO']
    }
    
    print(f"📍 Endpoint: POST {endpoint}")
    print(f"💰 Offer: ${test_offer['offeredSalary']} (Current: ${test_offer['candidateCurrentSalary']})")
    
    try:
        response = requests.post(endpoint, json=test_offer, headers=headers)
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_result(True, "Offer acceptance predicted successfully!")
            
            # Verify structure
            print(f"\n📋 Prediction Results:")
            print(f"   ✓ Acceptance Probability: {data.get('acceptance_probability', 0)}%")
            print(f"   ✓ Confidence Level: {data.get('confidence_level', 'N/A')}")
            print(f"   ✓ Risk Level: {data.get('risk_level', 'N/A')}")
            print(f"   ✓ Salary Increase: +{data.get('salary_increase_percent', 0):.1f}%")
            
            print(f"\n✅ Positive Factors: {len(data.get('positive_factors', []))}")
            for factor in data.get('positive_factors', []):
                print(f"      • {factor}")
            
            print(f"\n⚠️  Negative Factors: {len(data.get('negative_factors', []))}")
            for factor in data.get('negative_factors', []):
                print(f"      • {factor}")
            
            print(f"\n💡 Recommendations: {len(data.get('recommendations', []))}")
            for rec in data.get('recommendations', [])[:3]:
                print(f"      • {rec}")
            
            print(f"\n🤝 Negotiation Insights:")
            print(f"   ✓ Negotiation Likelihood: {data.get('negotiation_likelihood', 0)}%")
            print(f"   ✓ Counter-Offer Risk: {data.get('counter_offer_risk', 'N/A')}")
            print(f"   ✓ Decision Timeline: {data.get('estimated_decision_timeline', 'N/A')}")
            
            print(f"\n🤖 AI Confidence: {(data.get('ai_confidence', 0) * 100):.0f}%")
            return True
        else:
            print_result(False, f"Failed: {response.text}")
            return False
            
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False

# ===== TEST AI SERVICE HEALTH =====

def test_ai_service_health():
    """Test AI service health endpoint"""
    print_section("AI Service Health Check", "🏥")
    
    endpoint = f"{API_URL}/ai/health"
    
    try:
        response = requests.get(endpoint)
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_result(True, "AI Service is healthy!")
            print(f"\n📋 Service Status:")
            print(f"   ✓ Status: {data.get('status', 'unknown')}")
            print(f"   ✓ AI Service: {data.get('ai_service', 'unknown')}")
            print(f"   ✓ Model: {data.get('model', 'unknown')}")
            print(f"   ✓ Features Available: {len(data.get('features_available', []))}")
            
            for feature in data.get('features_available', []):
                print(f"      • {feature}")
            
            return True
        else:
            print_result(False, f"Service unhealthy: {response.text}")
            return False
            
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False

# ===== MAIN TEST RUNNER =====

def main():
    """Run all AI feature tests"""
    print_section("AI FEATURES COMPREHENSIVE TEST SUITE", "🤖")
    print(f"Testing all 6 AI features")
    print(f"Base URL: {BASE_URL}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Check service health first
    health_ok = test_ai_service_health()
    if not health_ok:
        print("\n⚠️  AI service health check failed but continuing with tests...")
    
    # Run all tests
    results = {}
    
    # Job Seeker Feature
    results['career_path_advisor'] = test_career_path_advisor()
    
    # Intern Features
    results['project_recommender'] = test_project_recommender()
    results['learning_path_generator'] = test_learning_path_generator()
    
    # Recruiter Features
    results['job_description_generator'] = test_job_description_generator()
    results['application_review'] = test_application_review()
    results['offer_predictor'] = test_offer_predictor()
    
    # Summary
    print_section("TEST SUMMARY", "📊")
    
    total_tests = len(results)
    passed_tests = sum(1 for result in results.values() if result)
    failed_tests = total_tests - passed_tests
    
    print(f"Total Tests: {total_tests}")
    print(f"✅ Passed: {passed_tests}")
    print(f"❌ Failed: {failed_tests}")
    print(f"Success Rate: {(passed_tests/total_tests*100):.1f}%")
    
    print(f"\n📋 Detailed Results:")
    for feature, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status} - {feature.replace('_', ' ').title()}")
    
    if passed_tests == total_tests:
        print(f"\n🎉 ALL TESTS PASSED! AI features are working perfectly!")
    elif passed_tests > 0:
        print(f"\n⚠️  Some tests passed. Check failed tests above for issues.")
    else:
        print(f"\n❌ All tests failed. Please check:")
        print(f"   • Backend is running on port 3002")
        print(f"   • Database connection is working")
        print(f"   • Test accounts exist (run setup scripts)")
        print(f"   • API routes are registered correctly")
    
    print(f"\n💡 Setup Instructions if tests fail:")
    print(f"   1. Start backend: cd backend && python app.py")
    print(f"   2. Create test accounts:")
    print(f"      - Job Seeker: jobseeker@test.com / Test123!@#")
    print(f"      - Intern: intern@test.com / Test123!@#")
    print(f"      - Recruiter: recruiter@test.com / Test123!@#")
    print(f"   3. For intern, complete profile with skills")
    print(f"   4. For application review, create test application")

if __name__ == "__main__":
    main()

