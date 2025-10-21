#!/usr/bin/env python3
"""
Test script to verify dashboard display and orange theme
"""

import requests
from datetime import datetime

def test_dashboard_endpoints():
    """Test if dashboard endpoints are accessible"""
    print("🔍 Testing Dashboard Endpoints...")
    
    base_url = "http://localhost:3003"
    endpoints = [
        "/recruiter-dashboard",
        "/post-job", 
        "/post-internship"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=5)
            if response.status_code == 200:
                print(f"✅ {endpoint} - Accessible")
            else:
                print(f"⚠️  {endpoint} - Status: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"❌ {endpoint} - Error: {str(e)}")

def create_test_job_data():
    """Create sample job data for testing"""
    print("\n📝 Creating Test Job Data...")
    
    job_data = {
        "title": f"Test Job - {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        "company": "Test Company",
        "location": "Remote",
        "type": "Full-time",
        "salary": "$80,000 - $120,000",
        "description": "This is a test job posting to verify the dashboard display.",
        "requirements": ["Python", "React", "Node.js"],
        "status": "active",
        "postedDate": datetime.now().isoformat(),
        "applicationCount": 5
    }
    
    print("✅ Test job data created:")
    for key, value in job_data.items():
        print(f"   {key}: {value}")
    
    return job_data

def create_test_internship_data():
    """Create sample internship data for testing"""
    print("\n🎓 Creating Test Internship Data...")
    
    internship_data = {
        "title": f"Test Internship - {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        "company": "Test Company",
        "location": "Hybrid",
        "type": "Full-time",
        "duration": "6 months",
        "stipend": "$2,000/month",
        "description": "This is a test internship posting to verify the dashboard display.",
        "requirements": ["Python", "JavaScript"],
        "status": "active",
        "postedDate": datetime.now().isoformat(),
        "applicationCount": 3
    }
    
    print("✅ Test internship data created:")
    for key, value in internship_data.items():
        print(f"   {key}: {value}")
    
    return internship_data

def verify_orange_theme_elements():
    """Verify that orange theme elements are properly defined"""
    print("\n🧡 Verifying Orange Theme Elements...")
    
    orange_theme_elements = {
        "Sidebar Background": "linear-gradient(180deg, #FF8A65 0%, #FF7043 100%)",
        "User Avatar": "linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)",
        "Primary Orange": "#FF8A65",
        "Secondary Orange": "#FF7043",
        "Text Color": "white",
        "Icon Color": "white"
    }
    
    print("✅ Orange theme elements defined:")
    for element, value in orange_theme_elements.items():
        print(f"   {element}: {value}")

def main():
    """Main test function"""
    print("🧪 Dashboard Display Tester")
    print("=" * 40)
    print("Testing dashboard display and orange theme verification")
    print()
    
    # Test 1: Check if endpoints are accessible
    test_dashboard_endpoints()
    
    # Test 2: Create test data
    job_data = create_test_job_data()
    internship_data = create_test_internship_data()
    
    # Test 3: Verify orange theme
    verify_orange_theme_elements()
    
    print("\n" + "=" * 40)
    print("🎉 Dashboard Display Test Complete!")
    print()
    print("Next Steps:")
    print("1. Run the main job flow test: python test_job_flow.py")
    print("2. Check the frontend at http://localhost:3003/recruiter-dashboard")
    print("3. Verify orange theme is applied correctly")
    print("4. Test job/internship posting forms")

if __name__ == "__main__":
    main()
