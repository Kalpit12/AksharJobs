#!/usr/bin/env python3
"""
Script to create sample premium plans for the admin dashboard.
Run this script to populate the database with sample subscription plans.
"""

from pymongo import MongoClient
from datetime import datetime

def create_sample_plans():
    """Create sample premium plans in the database"""
    
    # Connect to MongoDB
    try:
        client = MongoClient('mongodb://localhost:27017/')
        db = client['resume_matcher']  # Use your actual database name
        plans_collection = db['subscription_plans']
        
        print("✅ Connected to MongoDB successfully!")
        
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {str(e)}")
        return False
    
    # Sample premium plans
    sample_plans = [
        {
            "name": "Basic",
            "price": 9.99,
            "billingCycle": "monthly",
            "description": "Perfect for individual job seekers and small recruiters",
            "features": [
                "Resume upload and storage",
                "Basic job matching",
                "Email notifications",
                "Standard support"
            ],
            "limits": {
                "jobPostings": 5,
                "resumeViews": 50,
                "matchScoreViews": 100,
                "candidateSearches": 25,
                "interviewSlots": 10
            },
            "isPopular": False,
            "isEnterprise": False,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "Premium",
            "price": 29.99,
            "billingCycle": "monthly",
            "description": "Advanced features for growing businesses and active job seekers",
            "features": [
                "Everything in Basic",
                "Advanced AI matching",
                "Priority support",
                "Analytics dashboard",
                "Custom branding",
                "Bulk operations"
            ],
            "limits": {
                "jobPostings": 25,
                "resumeViews": 200,
                "matchScoreViews": 500,
                "candidateSearches": 100,
                "interviewSlots": 50
            },
            "isPopular": True,
            "isEnterprise": False,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "Professional",
            "price": 79.99,
            "billingCycle": "monthly",
            "description": "Enterprise-grade features for large recruitment teams",
            "features": [
                "Everything in Premium",
                "Advanced analytics",
                "API access",
                "White-label solutions",
                "Dedicated account manager",
                "Custom integrations"
            ],
            "limits": {
                "jobPostings": 100,
                "resumeViews": 1000,
                "matchScoreViews": 2000,
                "candidateSearches": 500,
                "interviewSlots": 200
            },
            "isPopular": False,
            "isEnterprise": False,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "Enterprise",
            "price": 199.99,
            "billingCycle": "monthly",
            "description": "Custom solutions for large organizations with unlimited access",
            "features": [
                "Everything in Professional",
                "Unlimited access",
                "Custom development",
                "On-premise deployment",
                "SLA guarantees",
                "24/7 priority support"
            ],
            "limits": {
                "jobPostings": -1,  # Unlimited
                "resumeViews": -1,   # Unlimited
                "matchScoreViews": -1,  # Unlimited
                "candidateSearches": -1,  # Unlimited
                "interviewSlots": -1     # Unlimited
            },
            "isPopular": False,
            "isEnterprise": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
    ]
    
    try:
        # Check if plans already exist
        existing_plans = plans_collection.count_documents({})
        if existing_plans > 0:
            print(f"⚠️  {existing_plans} plans already exist in the database!")
            print("Do you want to replace them? (y/n): ", end="")
            choice = input().lower()
            if choice != 'y':
                print("❌ Operation cancelled.")
                return False
            else:
                # Delete existing plans
                plans_collection.delete_many({})
                print("🗑️  Existing plans deleted.")
        
        # Insert sample plans
        result = plans_collection.insert_many(sample_plans)
        
        if result.inserted_ids:
            print(f"✅ {len(result.inserted_ids)} sample plans created successfully!")
            print("\n📋 Created Plans:")
            for i, plan_id in enumerate(result.inserted_ids):
                plan = sample_plans[i]
                print(f"  {i+1}. {plan['name']} - ${plan['price']}/{plan['billingCycle']}")
                print(f"     Features: {len(plan['features'])} features")
                print(f"     Limits: {plan['limits']['jobPostings']} job postings, {plan['limits']['resumeViews']} resume views")
                print()
            
            print("🚀 You can now view these plans in the admin dashboard!")
            return True
        else:
            print("❌ Failed to create sample plans")
            return False
            
    except Exception as e:
        print(f"❌ Error creating sample plans: {str(e)}")
        return False

if __name__ == "__main__":
    print("🔧 Creating Sample Premium Plans for RocketMatch...")
    print("=" * 60)
    create_sample_plans()
