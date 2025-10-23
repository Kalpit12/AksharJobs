python test_recruiter_applications.py#!/usr/bin/env python3
"""
Test script for the recruiter applications endpoint
"""

import requests
import json

# Configuration
API_BASE_URL = "http://localhost:3002"

def test_recruiter_applications():
    """Test the /api/recruiters/applications endpoint"""
    
    print("🧪 Testing Recruiter Applications Endpoint")
    print("=" * 60)
    
    # You'll need to replace this with a valid JWT token from a logged-in recruiter
    # To get a token:
    # 1. Log in as a recruiter at http://localhost:3003
    # 2. Open browser console
    # 3. Type: localStorage.getItem('token')
    # 4. Copy the token here
    
    token = input("\n📝 Enter your JWT token (from localStorage): ").strip()
    
    if not token:
        print("❌ No token provided. Please log in as a recruiter and get your token.")
        return
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    print(f"\n🔍 Fetching applications from: {API_BASE_URL}/api/recruiters/applications")
    
    try:
        response = requests.get(
            f"{API_BASE_URL}/api/recruiters/applications",
            headers=headers
        )
        
        print(f"\n📊 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            applications = response.json()
            print(f"✅ Success! Found {len(applications)} applications")
            
            if applications:
                print("\n📋 Sample Application Data:")
                print("=" * 60)
                sample = applications[0]
                print(json.dumps({
                    '_id': sample.get('_id'),
                    'applicant_name': sample.get('applicant_name'),
                    'job_title': sample.get('job_title'),
                    'company_name': sample.get('company_name'),
                    'status': sample.get('status'),
                    'matchScore': sample.get('matchScore'),
                    'applied_at': sample.get('applied_at'),
                    'has_tracking_history': len(sample.get('tracking_history', [])) > 0
                }, indent=2))
                
                print(f"\n📈 Application Statistics:")
                statuses = {}
                for app in applications:
                    status = app.get('status', 'unknown')
                    statuses[status] = statuses.get(status, 0) + 1
                
                for status, count in sorted(statuses.items()):
                    print(f"  • {status}: {count}")
                
            else:
                print("\n⚠️  No applications found. This could mean:")
                print("  • No candidates have applied to your job postings yet")
                print("  • You haven't posted any jobs yet")
                
        elif response.status_code == 401:
            print("❌ Authentication failed. Please check your token.")
            print(f"Response: {response.text}")
        elif response.status_code == 500:
            print("❌ Server error occurred")
            print(f"Response: {response.text}")
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Failed to connect to {API_BASE_URL}")
        print("Please make sure the backend server is running on port 3002")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    test_recruiter_applications()

