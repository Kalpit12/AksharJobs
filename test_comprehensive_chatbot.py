#!/usr/bin/env python3
"""
Comprehensive test script for Gemini Chatbot API
Tests questions from all industries, roles, and departments
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://192.168.0.31:3002"
API_ENDPOINT = f"{BASE_URL}/api/chat/gemini"

# Comprehensive test cases covering all industries and roles
test_cases = [
    # Technology Sector
    {
        "name": "Software Engineer - Resume Help",
        "data": {
            "message": "How do I write a resume for a senior software engineer position at a tech startup?",
            "userType": "jobSeeker",
            "userId": "test_tech_001"
        }
    },
    {
        "name": "Data Scientist - Career Advice",
        "data": {
            "message": "What skills should I develop to transition from data analyst to data scientist?",
            "userType": "jobSeeker",
            "userId": "test_tech_002"
        }
    },
    {
        "name": "Tech Recruiter - Interview Questions",
        "data": {
            "message": "What are the best technical interview questions for a DevOps engineer role?",
            "userType": "recruiter",
            "userId": "test_tech_003"
        }
    },
    
    # Healthcare Sector
    {
        "name": "Nurse - Career Development",
        "data": {
            "message": "How can I advance from registered nurse to nurse practitioner?",
            "userType": "jobSeeker",
            "userId": "test_health_001"
        }
    },
    {
        "name": "Healthcare Recruiter - Job Description",
        "data": {
            "message": "Help me write a job description for a medical technologist position",
            "userType": "recruiter",
            "userId": "test_health_002"
        }
    },
    
    # Finance Sector
    {
        "name": "Financial Analyst - Interview Prep",
        "data": {
            "message": "What are common interview questions for investment banking analyst positions?",
            "userType": "jobSeeker",
            "userId": "test_finance_001"
        }
    },
    {
        "name": "Finance Recruiter - Salary Negotiation",
        "data": {
            "message": "How do I handle salary negotiations for senior financial advisors?",
            "userType": "recruiter",
            "userId": "test_finance_002"
        }
    },
    
    # Marketing & Sales
    {
        "name": "Digital Marketer - Skill Development",
        "data": {
            "message": "What digital marketing certifications should I get to advance my career?",
            "userType": "jobSeeker",
            "userId": "test_marketing_001"
        }
    },
    {
        "name": "Sales Manager - Team Building",
        "data": {
            "message": "How do I build and manage a high-performing sales team?",
            "userType": "recruiter",
            "userId": "test_marketing_002"
        }
    },
    
    # Creative Industries
    {
        "name": "Graphic Designer - Portfolio",
        "data": {
            "message": "How do I create a portfolio that stands out for creative director positions?",
            "userType": "jobSeeker",
            "userId": "test_creative_001"
        }
    },
    {
        "name": "Creative Recruiter - Freelancer Hiring",
        "data": {
            "message": "What should I look for when hiring freelance content creators?",
            "userType": "recruiter",
            "userId": "test_creative_002"
        }
    },
    
    # Education Sector
    {
        "name": "Teacher - Career Transition",
        "data": {
            "message": "How can I transition from teaching to educational technology roles?",
            "userType": "jobSeeker",
            "userId": "test_education_001"
        }
    },
    {
        "name": "Education Recruiter - Remote Learning",
        "data": {
            "message": "How do I recruit and onboard remote learning specialists?",
            "userType": "recruiter",
            "userId": "test_education_002"
        }
    },
    
    # Legal Sector
    {
        "name": "Lawyer - Specialization",
        "data": {
            "message": "Should I specialize in corporate law or intellectual property law?",
            "userType": "jobSeeker",
            "userId": "test_legal_001"
        }
    },
    {
        "name": "Legal Recruiter - Associate Hiring",
        "data": {
            "message": "What qualities should I look for in junior associate candidates?",
            "userType": "recruiter",
            "userId": "test_legal_002"
        }
    },
    
    # Engineering
    {
        "name": "Civil Engineer - Project Management",
        "data": {
            "message": "How do I transition from civil engineer to project manager?",
            "userType": "jobSeeker",
            "userId": "test_engineering_001"
        }
    },
    {
        "name": "Engineering Recruiter - Technical Skills",
        "data": {
            "message": "How do I assess technical skills for mechanical engineer candidates?",
            "userType": "recruiter",
            "userId": "test_engineering_002"
        }
    },
    
    # Retail & Hospitality
    {
        "name": "Store Manager - Leadership",
        "data": {
            "message": "What leadership skills do I need to become a district manager?",
            "userType": "jobSeeker",
            "userId": "test_retail_001"
        }
    },
    {
        "name": "Hospitality Recruiter - Customer Service",
        "data": {
            "message": "How do I identify candidates with excellent customer service skills?",
            "userType": "recruiter",
            "userId": "test_retail_002"
        }
    },
    
    # Government & Non-profit
    {
        "name": "Social Worker - Career Growth",
        "data": {
            "message": "What career paths are available for social workers in non-profit organizations?",
            "userType": "jobSeeker",
            "userId": "test_gov_001"
        }
    },
    {
        "name": "Non-profit Recruiter - Mission Alignment",
        "data": {
            "message": "How do I ensure candidates are aligned with our organization's mission?",
            "userType": "recruiter",
            "userId": "test_gov_002"
        }
    },
    
    # Consulting
    {
        "name": "Management Consultant - Client Relations",
        "data": {
            "message": "How do I build strong client relationships as a management consultant?",
            "userType": "jobSeeker",
            "userId": "test_consulting_001"
        }
    },
    {
        "name": "Consulting Recruiter - Case Interviews",
        "data": {
            "message": "What case study questions should I ask consulting candidates?",
            "userType": "recruiter",
            "userId": "test_consulting_002"
        }
    },
    
    # Real Estate
    {
        "name": "Real Estate Agent - Market Analysis",
        "data": {
            "message": "How do I analyze market trends to advise clients on property investments?",
            "userType": "jobSeeker",
            "userId": "test_realestate_001"
        }
    },
    {
        "name": "Real Estate Recruiter - Agent Training",
        "data": {
            "message": "What training programs should I implement for new real estate agents?",
            "userType": "recruiter",
            "userId": "test_realestate_002"
        }
    },
    
    # Agriculture & Food
    {
        "name": "Agricultural Scientist - Research",
        "data": {
            "message": "How do I get funding for agricultural research projects?",
            "userType": "jobSeeker",
            "userId": "test_agriculture_001"
        }
    },
    {
        "name": "Food Industry Recruiter - Safety Compliance",
        "data": {
            "message": "What certifications should food safety managers have?",
            "userType": "recruiter",
            "userId": "test_agriculture_002"
        }
    },
    
    # Transportation
    {
        "name": "Logistics Coordinator - Supply Chain",
        "data": {
            "message": "How do I optimize supply chain operations for e-commerce?",
            "userType": "jobSeeker",
            "userId": "test_transport_001"
        }
    },
    {
        "name": "Transportation Recruiter - Driver Safety",
        "data": {
            "message": "How do I screen commercial drivers for safety compliance?",
            "userType": "recruiter",
            "userId": "test_transport_002"
        }
    },
    
    # Energy & Utilities
    {
        "name": "Renewable Energy Engineer - Career Path",
        "data": {
            "message": "What career opportunities exist in renewable energy sector?",
            "userType": "jobSeeker",
            "userId": "test_energy_001"
        }
    },
    {
        "name": "Energy Recruiter - Technical Skills",
        "data": {
            "message": "What technical skills are essential for power plant operators?",
            "userType": "recruiter",
            "userId": "test_energy_002"
        }
    },
    
    # Sports & Fitness
    {
        "name": "Fitness Trainer - Business Development",
        "data": {
            "message": "How do I start my own personal training business?",
            "userType": "jobSeeker",
            "userId": "test_sports_001"
        }
    },
    {
        "name": "Sports Recruiter - Athlete Development",
        "data": {
            "message": "How do I recruit and develop young athletes for professional sports?",
            "userType": "recruiter",
            "userId": "test_sports_002"
        }
    },
    
    # Media & Entertainment
    {
        "name": "Content Creator - Monetization",
        "data": {
            "message": "How do I monetize my content creation skills professionally?",
            "userType": "jobSeeker",
            "userId": "test_media_001"
        }
    },
    {
        "name": "Media Recruiter - Creative Talent",
        "data": {
            "message": "How do I identify and recruit creative talent for media production?",
            "userType": "recruiter",
            "userId": "test_media_002"
        }
    },
    
    # Research & Development
    {
        "name": "Research Scientist - Grant Writing",
        "data": {
            "message": "How do I write successful grant proposals for scientific research?",
            "userType": "jobSeeker",
            "userId": "test_research_001"
        }
    },
    {
        "name": "R&D Recruiter - Innovation Skills",
        "data": {
            "message": "What skills should I look for in R&D innovation managers?",
            "userType": "recruiter",
            "userId": "test_research_002"
        }
    }
]

def test_chatbot_api():
    """Test the chatbot API with comprehensive questions"""
    print("🚀 Comprehensive Gemini Chatbot API Tester")
    print("Testing questions from ALL industries, roles, and departments")
    print("=" * 80)
    
    # Test backend health
    try:
        health_response = requests.get(f"{BASE_URL}/health", timeout=5)
        if health_response.status_code == 200:
            print("✅ Backend server is running")
        else:
            print("❌ Backend server health check failed")
            return
    except Exception as e:
        print(f"❌ Cannot connect to backend server: {e}")
        print("Make sure the backend is running on port 3002")
        return
    
    print(f"\n🤖 Testing {len(test_cases)} comprehensive scenarios")
    print("=" * 80)
    
    successful_tests = 0
    failed_tests = 0
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n🧪 Test {i}: {test_case['name']}")
        print("-" * 60)
        
        try:
            start_time = time.time()
            
            response = requests.post(
                API_ENDPOINT,
                json=test_case['data'],
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            end_time = time.time()
            response_time = (end_time - start_time) * 1000
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Status: {response.status_code}")
                print(f"⏱️  Response time: {response_time:.2f}ms")
                print(f"🤖 AI Response: {result.get('response', 'No response')[:100]}...")
                print(f"📅 Timestamp: {result.get('timestamp', 'N/A')}")
                successful_tests += 1
            else:
                print(f"❌ Status: {response.status_code}")
                print(f"📝 Response: {response.text}")
                failed_tests += 1
                
        except Exception as e:
            print(f"❌ Error: {e}")
            failed_tests += 1
    
    print("\n" + "=" * 80)
    print("🏁 Comprehensive Testing Complete!")
    print(f"✅ Successful tests: {successful_tests}")
    print(f"❌ Failed tests: {failed_tests}")
    print(f"📊 Success rate: {(successful_tests / len(test_cases)) * 100:.1f}%")
    
    if successful_tests == len(test_cases):
        print("\n🎉 All tests passed! The chatbot can handle questions from all industries!")
    elif successful_tests > len(test_cases) * 0.8:
        print("\n👍 Most tests passed! The chatbot is working well across most industries!")
    else:
        print("\n⚠️  Some tests failed. Check the backend logs for issues.")
    
    print("\n💡 Next steps:")
    print("1. Test the frontend chatbot interface")
    print("2. Try asking industry-specific questions")
    print("3. Test career transition scenarios")
    print("4. Verify recruiter and job seeker perspectives")

if __name__ == "__main__":
    test_chatbot_api()
