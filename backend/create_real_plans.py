#!/usr/bin/env python3
"""
Script to create the REAL pricing plans that are actually being used in the frontend.
These are the plans from PricingPlans.jsx that users see and can purchase.
"""

from pymongo import MongoClient
from datetime import datetime

def create_real_plans():
    """Create the actual pricing plans used in the frontend"""
    
    # Connect to MongoDB
    try:
        client = MongoClient('mongodb://localhost:27017/')
        db = client['resume_matcher']  # Use your actual database name
        plans_collection = db['subscription_plans']
        
        print("✅ Connected to MongoDB successfully!")
        
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {str(e)}")
        return False
    
    # REAL PLANS FROM FRONTEND PricingPlans.jsx
    
    # Recruiter Plans
    recruiter_plans = [
        {
            "name": "Basic",
            "price": 0,
            "currency": "KSH",
            "billingCycle": "monthly",
            "userType": "recruiter",
            "description": "Free plan for recruiters to get started",
            "features": [
                "Post 2 jobs per month",
                "Basic candidate matching",
                "Standard support",
                "Basic analytics"
            ],
            "limits": {
                "jobPostings": 2,
                "resumeViews": 50,
                "matchScoreViews": 25,
                "candidateSearches": 20,
                "interviewSlots": 5
            },
            "isPopular": False,
            "isEnterprise": False,
            "isRecommended": False,
            "color": "#6A9C89",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "Starter",
            "price": 3500,
            "currency": "KSH",
            "billingCycle": "monthly",
            "userType": "recruiter",
            "description": "Perfect for growing recruitment teams",
            "features": [
                "Post 10 jobs per month",
                "Advanced candidate matching",
                "Priority support",
                "Enhanced analytics",
                "Candidate database access"
            ],
            "limits": {
                "jobPostings": 10,
                "resumeViews": 200,
                "matchScoreViews": 100,
                "candidateSearches": 100,
                "interviewSlots": 20
            },
            "isPopular": False,
            "isEnterprise": False,
            "isRecommended": True,
            "color": "#4A7C59",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "Professional",
            "price": 7500,
            "currency": "KSH",
            "billingCycle": "monthly",
            "userType": "recruiter",
            "description": "Advanced features for established recruiters",
            "features": [
                "Unlimited job postings",
                "AI-powered candidate matching",
                "Advanced analytics dashboard",
                "Priority support",
                "Full candidate database",
                "Custom branding",
                "Bulk messaging"
            ],
            "limits": {
                "jobPostings": -1,  # Unlimited
                "resumeViews": 1000,
                "matchScoreViews": 500,
                "candidateSearches": 500,
                "interviewSlots": 100
            },
            "isPopular": True,
            "isEnterprise": False,
            "isRecommended": False,
            "color": "#16423C",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "Enterprise",
            "price": 15000,
            "currency": "KSH",
            "billingCycle": "monthly",
            "userType": "recruiter",
            "description": "Enterprise-grade solutions for large organizations",
            "features": [
                "All Professional features",
                "Dedicated account manager",
                "Custom integrations",
                "Advanced reporting",
                "White-label solutions",
                "API access",
                "Priority onboarding"
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
            "isRecommended": False,
            "color": "#2D5A4A",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
    ]
    
    # Job Seeker Plans
    jobseeker_plans = [
        {
            "name": "Basic",
            "price": 0,
            "currency": "KSH",
            "billingCycle": "monthly",
            "userType": "job_seeker",
            "description": "Free plan for job seekers to get started",
            "features": [
                "Basic job matching",
                "Limited job applications (5/month)",
                "Basic resume analysis",
                "Standard support"
            ],
            "limits": {
                "jobApplications": 5,
                "resumeUploads": 1,
                "matchScoreViews": 10,
                "jobAlerts": 3,
                "interviewSlots": 2
            },
            "isPopular": False,
            "isEnterprise": False,
            "isRecommended": False,
            "color": "#6A9C89",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "Starter",
            "price": 1500,
            "currency": "KSH",
            "billingCycle": "monthly",
            "userType": "job_seeker",
            "description": "Enhanced features for active job seekers",
            "features": [
                "Advanced job matching",
                "Unlimited job applications",
                "Enhanced resume analysis",
                "Priority support",
                "Job alerts"
            ],
            "limits": {
                "jobApplications": -1,  # Unlimited
                "resumeUploads": 3,
                "matchScoreViews": 50,
                "jobAlerts": 10,
                "interviewSlots": 10
            },
            "isPopular": False,
            "isEnterprise": False,
            "isRecommended": True,
            "color": "#4A7C59",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "Professional",
            "price": 3500,
            "currency": "KSH",
            "billingCycle": "monthly",
            "userType": "job_seeker",
            "description": "Professional tools for serious job seekers",
            "features": [
                "AI-powered job matching",
                "Unlimited applications",
                "Advanced resume optimization",
                "Priority support",
                "Job alerts & notifications",
                "Career coaching tips",
                "Interview preparation tools"
            ],
            "limits": {
                "jobApplications": -1,  # Unlimited
                "jobApplications": -1,  # Unlimited
                "resumeUploads": 5,
                "matchScoreViews": 200,
                "jobAlerts": 25,
                "interviewSlots": 25
            },
            "isPopular": True,
            "isEnterprise": False,
            "isRecommended": False,
            "color": "#16423C",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "Premium",
            "price": 5500,
            "currency": "KSH",
            "billingCycle": "monthly",
            "userType": "job_seeker",
            "description": "Premium services for career advancement",
            "features": [
                "All Professional features",
                "Personal career advisor",
                "Exclusive job opportunities",
                "Resume writing service",
                "Mock interview sessions",
                "Salary negotiation guidance",
                "LinkedIn profile optimization"
            ],
            "limits": {
                "jobApplications": -1,  # Unlimited
                "resumeUploads": 10,
                "matchScoreViews": 500,
                "jobAlerts": 50,
                "interviewSlots": 50
            },
            "isPopular": False,
            "isEnterprise": False,
            "isRecommended": False,
            "color": "#2D5A4A",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
    ]
    
    # Combine all plans
    all_plans = recruiter_plans + jobseeker_plans
    
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
        
        # Insert all plans
        result = plans_collection.insert_many(all_plans)
        
        if result.inserted_ids:
            print(f"✅ {len(result.inserted_ids)} REAL pricing plans created successfully!")
            print("\n📋 Created Plans:")
            
            print("\n🏢 RECRUITER PLANS:")
            for i, plan in enumerate(recruiter_plans):
                print(f"  {i+1}. {plan['name']} - {plan['currency']} {plan['price']}/{plan['billingCycle']}")
                print(f"     Features: {len(plan['features'])} features")
                print(f"     Job Postings: {plan['limits']['jobPostings'] if plan['limits']['jobPostings'] != -1 else 'Unlimited'}")
                print(f"     Resume Views: {plan['limits']['resumeViews'] if plan['limits']['resumeViews'] != -1 else 'Unlimited'}")
                if plan['isRecommended']:
                    print(f"     ⭐ RECOMMENDED PLAN")
                if plan['isPopular']:
                    print(f"     🔥 POPULAR PLAN")
                if plan['isEnterprise']:
                    print(f"     👑 ENTERPRISE PLAN")
                print()
            
            print("\n👤 JOB SEEKER PLANS:")
            for i, plan in enumerate(jobseeker_plans):
                print(f"  {i+1}. {plan['name']} - {plan['currency']} {plan['price']}/{plan['billingCycle']}")
                print(f"     Features: {len(plan['features'])} features")
                print(f"     Job Applications: {plan['limits']['jobApplications'] if plan['limits']['jobApplications'] != -1 else 'Unlimited'}")
                print(f"     Resume Uploads: {plan['limits']['resumeUploads']}")
                if plan['isRecommended']:
                    print(f"     ⭐ RECOMMENDED PLAN")
                if plan['isPopular']:
                    print(f"     🔥 POPULAR PLAN")
                print()
            
            print("🚀 These are the ACTUAL plans users see and can purchase!")
            print("🌐 You can now view them in the admin dashboard at /admin")
            return True
        else:
            print("❌ Failed to create plans")
            return False
            
    except Exception as e:
        print(f"❌ Error creating plans: {str(e)}")
        return False

if __name__ == "__main__":
    print("🔧 Creating REAL Pricing Plans for RocketMatch...")
    print("=" * 60)
    print("📋 These are the actual plans from PricingPlans.jsx")
    print("💰 Users can see and purchase these plans")
    print("=" * 60)
    create_real_plans()
