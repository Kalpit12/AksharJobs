#!/usr/bin/env python3
"""
Test script for Recruiter Registration Form
Tests if data is being saved correctly to MongoDB in the 'recruiters' collection
"""

import requests
import json
import pymongo
from datetime import datetime
import time
import random
import string

# Configuration
API_BASE_URL = "http://localhost:3002"  # Backend API port
MONGODB_URI = "mongodb://localhost:27017"  # Adjust if your MongoDB runs on different host/port
DATABASE_NAME = "TalentMatchDB"  # Database name
COLLECTION_NAME = "recruiters"

def generate_test_data():
    """Generate realistic test data for recruiter registration"""
    # Generate random company name
    company_names = [
        "TechCorp Solutions", "InnovateHub Ltd", "Global Talent Partners", 
        "Elite Recruitment Co", "Future Workforce Inc", "ProHire Consulting",
        "TalentBridge International", "CareerConnect Ltd", "SmartRecruit Corp",
        "NextGen Staffing"
    ]
    
    # Generate random email
    domains = ["gmail.com", "company.com", "recruitment.com", "talent.com"]
    company_name = random.choice(company_names).lower().replace(" ", "")
    email = f"{company_name}@{random.choice(domains)}"
    
    # Generate random phone
    phone = f"+254{random.randint(700000000, 799999999)}"
    
    # Generate random year founded
    year_founded = random.randint(1990, 2023)
    
    # Generate random coordinates (Kenya area)
    latitude = round(random.uniform(-4.0, 4.0), 6)
    longitude = round(random.uniform(33.0, 42.0), 6)
    
    test_data = {
        # Company Information
        "companyName": random.choice(company_names),
        "companyEmail": email,
        "companyPhone": phone,
        "companyWebsite": f"https://www.{company_name}.com",
        "companySize": random.choice(["1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees"]),
        "yearFounded": str(year_founded),
        "industry": random.choice([
            "Technology & IT", "Finance & Banking", "Healthcare & Medical", 
            "Education & Training", "Manufacturing", "Retail & E-commerce"
        ]),
        "companyDescription": f"We are {random.choice(company_names)}, a leading company in the {random.choice(['technology', 'finance', 'healthcare', 'education'])} sector. We are committed to finding the best talent for our clients and providing excellent career opportunities.",
        
        # Company Location
        "country": "Kenya",
        "state": random.choice(["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"]),
        "city": random.choice(["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Malindi"]),
        "postalCode": str(random.randint(10000, 99999)),
        "address": f"{random.randint(1, 999)} {random.choice(['Main Street', 'Airport Road', 'Moi Avenue', 'Kenyatta Avenue'])}",
        "latitude": latitude,
        "longitude": longitude,
        
        # Recruiter Personal Details
        "firstName": random.choice(["John", "Jane", "David", "Sarah", "Michael", "Grace", "Peter", "Mary"]),
        "lastName": random.choice(["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"]),
        "jobTitle": random.choice([
            "HR Manager", "Talent Acquisition Lead", "Recruitment Specialist", 
            "Senior Recruiter", "Head of Talent", "HR Director"
        ]),
        "recruiterPhone": f"+254{random.randint(700000000, 799999999)}",
        "recruiterEmail": f"{random.choice(['john', 'jane', 'david', 'sarah'])}.{random.choice(['smith', 'johnson', 'williams'])}@{random.choice(domains)}",
        "linkedinProfile": f"https://www.linkedin.com/in/{random.choice(['john-smith', 'jane-johnson', 'david-williams'])}",
        
        # Arrays (will be set separately)
        "industries": random.sample([
            "Technology & IT", "Finance & Banking", "Healthcare & Medical", 
            "Education & Training", "Manufacturing", "Retail & E-commerce"
        ], random.randint(1, 3)),
        "functions": random.sample([
            "Software Development", "Sales", "Marketing", "Finance", 
            "Human Resources", "Operations", "Customer Service"
        ], random.randint(1, 4)),
        "recruitCountries": random.sample([
            "Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia", 
            "Ghana", "Nigeria", "South Africa"
        ], random.randint(1, 3)),
        "additionalLinks": [
            {
                "type": "Glassdoor",
                "url": f"https://www.glassdoor.com/Overview/Working-at-{company_name}-EI_IE{random.randint(100000, 999999)}.htm"
            }
        ],
        "employmentTypes": random.sample([
            "Full-time Positions", "Part-time Positions", "Contract/Temporary", 
            "Freelance/Project-based", "Internships"
        ], random.randint(1, 3)),
        "additionalServices": random.sample([
            "Visa Sponsorship Support", "Relocation Assistance", 
            "Training & Development Programs", "Comprehensive Benefits Package"
        ], random.randint(0, 2)),
        
        # Social Media
        "linkedinPage": f"https://www.linkedin.com/company/{company_name.lower()}",
        "facebookPage": f"https://www.facebook.com/{company_name.lower()}",
        "twitterHandle": f"https://twitter.com/{company_name.lower()}",
        "instagram": f"https://www.instagram.com/{company_name.lower()}",
        
        # Terms & Agreements
        "hearAboutUs": random.choice([
            "Search Engine (Google, Bing, etc.)", "Social Media", 
            "Referral from colleague", "Advertisement", "Industry Event/Conference"
        ]),
        "additionalComments": f"This is a test registration from the automated test script. Generated at {datetime.now().isoformat()}",
        "agreeTerms": True,
        "agreeDataProcessing": True,
        "agreeMarketing": random.choice([True, False]),
        "verifyInfo": True
    }
    
    return test_data

def test_api_endpoint(test_data):
    """Test the API endpoint for recruiter registration"""
    print("🧪 Testing API endpoint...")
    
    url = f"{API_BASE_URL}/api/recruiters/register"
    
    try:
        response = requests.post(
            url,
            json=test_data,
            headers={
                'Content-Type': 'application/json'
            },
            timeout=30
        )
        
        print(f"📡 API Response Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API call successful!")
            print(f"📄 Response: {json.dumps(result, indent=2)}")
            return True, result
        else:
            print(f"❌ API call failed with status {response.status_code}")
            print(f"📄 Error Response: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ API request failed: {e}")
        return False, None

def test_mongodb_connection():
    """Test MongoDB connection and check for data"""
    print("\n🔍 Testing MongoDB connection...")
    
    try:
        # Connect to MongoDB
        client = pymongo.MongoClient(MONGODB_URI)
        db = client[DATABASE_NAME]
        collection = db[COLLECTION_NAME]
        
        print(f"✅ Connected to MongoDB: {MONGODB_URI}")
        print(f"📊 Database: {DATABASE_NAME}")
        print(f"📋 Collection: {COLLECTION_NAME}")
        
        # Check if collection exists and get count
        count = collection.count_documents({})
        print(f"📈 Total documents in '{COLLECTION_NAME}' collection: {count}")
        
        # Get the latest document
        latest_doc = collection.find_one(sort=[("_id", -1)])
        if latest_doc:
            print("📄 Latest document:")
            print(f"   Company: {latest_doc.get('companyName', 'N/A')}")
            print(f"   Email: {latest_doc.get('companyEmail', 'N/A')}")
            print(f"   Created: {latest_doc.get('createdAt', 'N/A')}")
            print(f"   ID: {latest_doc.get('_id', 'N/A')}")
        
        client.close()
        return True, count
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return False, 0

def search_recruiter_by_email(email):
    """Search for a specific recruiter by email"""
    print(f"\n🔍 Searching for recruiter with email: {email}")
    
    try:
        client = pymongo.MongoClient(MONGODB_URI)
        db = client[DATABASE_NAME]
        collection = db[COLLECTION_NAME]
        
        recruiter = collection.find_one({"companyEmail": email})
        
        if recruiter:
            print("✅ Recruiter found!")
            print(f"   Company: {recruiter.get('companyName', 'N/A')}")
            print(f"   Email: {recruiter.get('companyEmail', 'N/A')}")
            print(f"   Phone: {recruiter.get('companyPhone', 'N/A')}")
            print(f"   Industry: {recruiter.get('industry', 'N/A')}")
            print(f"   Created: {recruiter.get('createdAt', 'N/A')}")
            return True
        else:
            print("❌ Recruiter not found in database")
            return False
            
    except Exception as e:
        print(f"❌ Search failed: {e}")
        return False
    finally:
        client.close()

def main():
    """Main test function"""
    print("🚀 Starting Recruiter Form Test")
    print("=" * 50)
    
    # Generate test data
    print("📝 Generating test data...")
    test_data = generate_test_data()
    print(f"✅ Generated test data for: {test_data['companyName']}")
    print(f"📧 Email: {test_data['companyEmail']}")
    
    # Test MongoDB connection first
    mongo_success, initial_count = test_mongodb_connection()
    if not mongo_success:
        print("❌ Cannot proceed without MongoDB connection")
        return
    
    # Test API endpoint
    api_success, api_result = test_api_endpoint(test_data)
    
    if api_success:
        print("\n⏳ Waiting 3 seconds for data to be saved...")
        time.sleep(3)
        
        # Check if data was saved to MongoDB
        final_success, final_count = test_mongodb_connection()
        
        # Also search by recruiter ID if available
        recruiter_id = api_result.get('recruiterId') if api_result else None
        
        if final_success and final_count > initial_count:
            print(f"✅ SUCCESS! Data was saved to MongoDB")
            print(f"📈 Document count increased from {initial_count} to {final_count}")
            
            # Search for the specific recruiter
            search_recruiter_by_email(test_data['companyEmail'])
        else:
            print("❌ FAILED! Data was not saved to MongoDB")
            print("🔍 Checking if data exists with different criteria...")
            
            # Try searching by recruiter ID
            if recruiter_id:
                print(f"\n🔍 Searching by recruiter ID: {recruiter_id}")
                try:
                    from bson import ObjectId
                    client = pymongo.MongoClient(MONGODB_URI)
                    db = client[DATABASE_NAME]
                    recruiter = db[COLLECTION_NAME].find_one({"_id": ObjectId(recruiter_id)})
                    if recruiter:
                        print("✅ Found recruiter by ID!")
                        print(f"   Company: {recruiter.get('companyName', 'N/A')}")
                        print(f"   Email: {recruiter.get('companyEmail', 'N/A')}")
                    else:
                        print("❌ Recruiter not found by ID either")
                    client.close()
                except Exception as e:
                    print(f"❌ Error searching by ID: {e}")
            
            search_recruiter_by_email(test_data['companyEmail'])
    else:
        print("❌ API test failed, skipping MongoDB verification")
    
    print("\n" + "=" * 50)
    print("🏁 Test completed!")

if __name__ == "__main__":
    main()
