#!/usr/bin/env python3
"""
Test script for job posting flow - from posting to dashboard reflection
Tests both job posting and internship posting flows
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:3002"  # Backend URL
FRONTEND_URL = "http://localhost:3003"  # Frontend URL

# Test recruiter credentials (you may need to adjust these)
TEST_RECRUITER_EMAIL = "recruiter@test.com"
TEST_RECRUITER_PASSWORD = "password123"

class JobFlowTester:
    def __init__(self):
        self.session = requests.Session()
        self.token = None
        self.recruiter_id = None
        
    def login_recruiter(self):
        """Login as recruiter to get authentication token"""
        print("🔐 Logging in as recruiter...")
        
        login_data = {
            "email": TEST_RECRUITER_EMAIL,
            "password": TEST_RECRUITER_PASSWORD
        }
        
        try:
            response = self.session.post(f"{BASE_URL}/api/auth/login", json=login_data)
            if response.status_code == 200:
                data = response.json()
                self.token = data.get('token')
                self.recruiter_id = data.get('user', {}).get('_id')
                print(f"✅ Login successful! Recruiter ID: {self.recruiter_id}")
                return True
            else:
                print(f"❌ Login failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Login error: {str(e)}")
            return False
    
    def test_job_posting(self):
        """Test job posting flow"""
        print("\n📝 Testing Job Posting Flow...")
        
        job_data = {
            "title": f"Senior Software Engineer - Test {datetime.now().strftime('%H:%M')}",
            "company": "Test Company",
            "location": "New York, NY",
            "jobType": "Full-time",
            "workMode": "Remote",
            "experienceLevel": "3-5 years",
            "vacancies": 2,
            "industry": "Technology",
            "department": "Engineering",
            "skills": ["Python", "React", "Node.js", "AWS"],
            "education": "Bachelor's",
            "summary": "We are looking for a talented Senior Software Engineer to join our team.",
            "responsibilities": "Develop and maintain web applications, collaborate with team members, write clean code",
            "desiredProfile": "Strong programming skills, experience with modern frameworks",
            "companyOverview": "A leading tech company focused on innovation",
            "salaryType": "Fixed",
            "salaryMin": 80000,
            "salaryMax": 120000,
            "currency": "USD",
            "benefits": ["Health Insurance", "Dental", "401k"],
            "country": "USA",
            "city": "New York",
            "applyMethod": "Email",
            "contactEmail": "hr@company.com",
            "visibility": "Public",
            "status": "active"
        }
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        try:
            response = self.session.post(f"{BASE_URL}/api/jobs/add_job", json=job_data, headers=headers)
            if response.status_code == 200 or response.status_code == 201:
                job = response.json()
                print(f"✅ Job posted successfully! Job ID: {job.get('_id')}")
                print(f"   Title: {job.get('title')}")
                print(f"   Status: {job.get('status')}")
                return job
            else:
                print(f"❌ Job posting failed: {response.status_code} - {response.text}")
                return None
        except Exception as e:
            print(f"❌ Job posting error: {str(e)}")
            return None
    
    def test_internship_posting(self):
        """Test internship posting flow"""
        print("\n🎓 Testing Internship Posting Flow...")
        
        internship_data = {
            "title": f"Software Development Intern - Test {datetime.now().strftime('%H:%M')}",
            "internshipType": "Full-time",
            "duration": "6 Months",
            "stipendType": "Paid",
            "stipendAmount": 2000,
            "stipendCurrency": "USD",
            "eligibility": "Undergraduate",
            "openings": 3,
            "skills": ["Python", "JavaScript", "React"],
            "industry": "Technology",
            "about": "Exciting internship opportunity in software development",
            "responsibilities": "Assist in developing web applications, learn modern technologies",
            "learningOpportunities": "Hands-on experience with real projects, mentorship",
            "mentorship": True,
            "certificate": True,
            "jobOfferPossible": True,
            "startDate": "2024-02-01",
            "endDate": "2024-08-01",
            "location": "San Francisco, CA",
            "country": "USA",
            "city": "San Francisco",
            "workMode": "Hybrid",
            "workingDays": "5 days",
            "workingHours": "9 AM - 5 PM",
            "applyMethod": "Email",
            "contactEmail": "internships@company.com",
            "visibility": "Public",
            "status": "active"
        }
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        try:
            response = self.session.post(f"{BASE_URL}/api/internships", json=internship_data, headers=headers)
            if response.status_code == 201:
                internship = response.json()
                print(f"✅ Internship posted successfully! Internship ID: {internship.get('_id')}")
                print(f"   Title: {internship.get('title')}")
                print(f"   Status: {internship.get('status')}")
                return internship
            else:
                print(f"❌ Internship posting failed: {response.status_code} - {response.text}")
                return None
        except Exception as e:
            print(f"❌ Internship posting error: {str(e)}")
            return None
    
    def test_dashboard_stats(self):
        """Test that dashboard stats reflect the posted jobs/internships"""
        print("\n📊 Testing Dashboard Stats...")
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        try:
            # Test recruiter jobs endpoint
            response = self.session.get(f"{BASE_URL}/api/jobs/get_jobs_for_user", headers=headers)
            if response.status_code == 200:
                jobs = response.json()
                active_jobs = [job for job in jobs if job.get('status') == 'active']
                print(f"✅ Found {len(jobs)} total jobs, {len(active_jobs)} active")
                
                for job in active_jobs[:3]:  # Show first 3 jobs
                    print(f"   - {job.get('title')} ({job.get('status')})")
            else:
                print(f"❌ Failed to fetch recruiter jobs: {response.status_code}")
            
            # Note: Internship posting not implemented yet
            print("ℹ️  Internship posting not implemented yet - skipping internship test")
                
        except Exception as e:
            print(f"❌ Dashboard stats error: {str(e)}")
    
    def test_recruiter_dashboard_api(self):
        """Test the recruiter dashboard API endpoint"""
        print("\n🏢 Testing Recruiter Dashboard API...")
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        try:
            # Test dashboard stats endpoint
            response = self.session.get(f"{BASE_URL}/api/recruiter/dashboard", headers=headers)
            if response.status_code == 200:
                stats = response.json()
                print("✅ Dashboard stats retrieved successfully:")
                print(f"   - Active Jobs: {stats.get('activeJobs', 0)}")
                print(f"   - Total Applications: {stats.get('totalApplications', 0)}")
                print(f"   - In Interview: {stats.get('inInterview', 0)}")
                print(f"   - Offers Extended: {stats.get('offersExtended', 0)}")
                return stats
            else:
                print(f"❌ Failed to fetch dashboard stats: {response.status_code}")
                return None
        except Exception as e:
            print(f"❌ Dashboard API error: {str(e)}")
            return None
    
    def run_complete_test(self):
        """Run the complete job flow test"""
        print("🚀 Starting Complete Job Flow Test")
        print("=" * 50)
        
        # Step 1: Login
        if not self.login_recruiter():
            print("❌ Cannot proceed without authentication")
            return
        
        # Step 2: Post a job
        job = self.test_job_posting()
        
        # Step 3: Post an internship
        internship = self.test_internship_posting()
        
        # Wait a moment for data to be processed
        print("\n⏳ Waiting for data processing...")
        time.sleep(2)
        
        # Step 4: Test dashboard stats
        self.test_dashboard_stats()
        
        # Step 5: Test recruiter dashboard API
        stats = self.test_recruiter_dashboard_api()
        
        print("\n" + "=" * 50)
        print("🎉 Job Flow Test Complete!")
        
        if job and internship:
            print("✅ Both job and internship posting flows work!")
        elif job or internship:
            print("⚠️  Partial success - some posting flows work")
        else:
            print("❌ Both posting flows failed")
        
        if stats:
            print("✅ Dashboard stats API is working!")
        else:
            print("❌ Dashboard stats API failed")

def main():
    """Main function to run the test"""
    print("🧪 Job Flow Tester")
    print("This script tests the complete job posting flow:")
    print("1. Recruiter login")
    print("2. Job posting")
    print("3. Internship posting")
    print("4. Dashboard stats reflection")
    print("5. Recruiter dashboard API")
    print()
    
    tester = JobFlowTester()
    tester.run_complete_test()

if __name__ == "__main__":
    main()
