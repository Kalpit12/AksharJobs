#!/usr/bin/env python3
"""
Script to create demo jobs for the public jobs page.
This will populate the database with sample job listings.
"""

from pymongo import MongoClient
from datetime import datetime, timedelta
import random

def create_demo_jobs():
    """Create demo jobs in the database"""
    
    # Connect to MongoDB
    try:
        client = MongoClient('mongodb://localhost:27017/')
        db = client['TalentMatchDB']
        jobs_collection = db['jobs']
        
        print("✅ Connected to MongoDB successfully!")
        
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {str(e)}")
        return False
    
    # Demo jobs data
    demo_jobs = [
        {
            "recruiter_id": "demo_recruiter_1",
            "job_title": "Senior Software Engineer",
            "company_name": "TechCorp Kenya",
            "company_website": "https://techcorp.ke",
            "industry": "Technology",
            "location": "Nairobi, Kenya",
            "remote_option": "Hybrid",
            "job_type": "Full-time",
            "salary_range": "KSh 150,000 - 250,000",
            "experience_required": "3-5 years",
            "required_skills": "Python, React, Node.js, MongoDB, AWS",
            "responsibilities": "Develop and maintain web applications, collaborate with cross-functional teams, mentor junior developers",
            "education_required": "Bachelor's degree in Computer Science or related field",
            "application_deadline": (datetime.now() + timedelta(days=30)).isoformat(),
            "description": "We are looking for a Senior Software Engineer to join our growing team. You will be responsible for developing high-quality software solutions and working with modern technologies.",
            "views": random.randint(50, 200),
            "applicants": [],
            "match_threshold": 75,
            "auto_reject_threshold": 50,
            "created_at": datetime.now()
        },
        {
            "recruiter_id": "demo_recruiter_2",
            "job_title": "Marketing Manager",
            "company_name": "Digital Solutions Ltd",
            "company_website": "https://digitalsolutions.co.ke",
            "industry": "Marketing",
            "location": "Mombasa, Kenya",
            "remote_option": "Remote",
            "job_type": "Full-time",
            "salary_range": "KSh 120,000 - 180,000",
            "experience_required": "2-4 years",
            "required_skills": "Digital Marketing, Social Media, Google Analytics, Content Creation",
            "responsibilities": "Develop marketing strategies, manage social media campaigns, analyze marketing metrics",
            "education_required": "Bachelor's degree in Marketing or related field",
            "application_deadline": (datetime.now() + timedelta(days=25)).isoformat(),
            "description": "Join our dynamic marketing team and help us grow our brand presence across digital platforms. We're looking for a creative and data-driven marketing professional.",
            "views": random.randint(30, 150),
            "applicants": [],
            "match_threshold": 70,
            "auto_reject_threshold": 45,
            "created_at": datetime.now()
        },
        {
            "recruiter_id": "demo_recruiter_3",
            "job_title": "Data Analyst",
            "company_name": "Analytics Pro",
            "company_website": "https://analyticspro.ke",
            "industry": "Data & Analytics",
            "location": "Kisumu, Kenya",
            "remote_option": "On-site",
            "job_type": "Full-time",
            "salary_range": "KSh 100,000 - 160,000",
            "experience_required": "1-3 years",
            "required_skills": "Python, SQL, Excel, Tableau, Statistics",
            "responsibilities": "Analyze business data, create reports and dashboards, provide insights to stakeholders",
            "education_required": "Bachelor's degree in Statistics, Mathematics, or related field",
            "application_deadline": (datetime.now() + timedelta(days=20)).isoformat(),
            "description": "We're seeking a talented Data Analyst to help us make data-driven decisions. You'll work with large datasets and create meaningful insights for our business.",
            "views": random.randint(40, 120),
            "applicants": [],
            "match_threshold": 65,
            "auto_reject_threshold": 40,
            "created_at": datetime.now()
        },
        {
            "recruiter_id": "demo_recruiter_4",
            "job_title": "UX/UI Designer",
            "company_name": "Creative Studio",
            "company_website": "https://creativestudio.ke",
            "industry": "Design",
            "location": "Nairobi, Kenya",
            "remote_option": "Hybrid",
            "job_type": "Part-time",
            "salary_range": "KSh 80,000 - 120,000",
            "experience_required": "2-4 years",
            "required_skills": "Figma, Adobe Creative Suite, User Research, Prototyping",
            "responsibilities": "Design user interfaces, conduct user research, create wireframes and prototypes",
            "education_required": "Bachelor's degree in Design or related field",
            "application_deadline": (datetime.now() + timedelta(days=15)).isoformat(),
            "description": "Join our creative team and help us design beautiful, user-friendly digital experiences. We're looking for a passionate designer with a strong portfolio.",
            "views": random.randint(25, 100),
            "applicants": [],
            "match_threshold": 70,
            "auto_reject_threshold": 45,
            "created_at": datetime.now()
        },
        {
            "recruiter_id": "demo_recruiter_5",
            "job_title": "Sales Representative",
            "company_name": "Growth Partners",
            "company_website": "https://growthpartners.ke",
            "industry": "Sales",
            "location": "Nakuru, Kenya",
            "remote_option": "On-site",
            "job_type": "Full-time",
            "salary_range": "KSh 90,000 - 140,000 + Commission",
            "experience_required": "1-3 years",
            "required_skills": "Sales, Communication, CRM, Customer Service",
            "responsibilities": "Generate leads, build client relationships, meet sales targets, provide customer support",
            "education_required": "Bachelor's degree in Business or related field",
            "application_deadline": (datetime.now() + timedelta(days=35)).isoformat(),
            "description": "We're looking for a motivated Sales Representative to join our team. You'll be responsible for driving sales growth and building lasting client relationships.",
            "views": random.randint(35, 110),
            "applicants": [],
            "match_threshold": 60,
            "auto_reject_threshold": 35,
            "created_at": datetime.now()
        },
        {
            "recruiter_id": "demo_recruiter_6",
            "job_title": "DevOps Engineer",
            "company_name": "CloudTech Solutions",
            "company_website": "https://cloudtech.ke",
            "industry": "Technology",
            "location": "Remote",
            "remote_option": "Remote",
            "job_type": "Contract",
            "salary_range": "KSh 180,000 - 300,000",
            "experience_required": "3-6 years",
            "required_skills": "Docker, Kubernetes, AWS, CI/CD, Linux",
            "responsibilities": "Manage cloud infrastructure, automate deployment processes, monitor system performance",
            "education_required": "Bachelor's degree in Computer Science or related field",
            "application_deadline": (datetime.now() + timedelta(days=40)).isoformat(),
            "description": "Join our DevOps team and help us scale our infrastructure. We're looking for an experienced engineer who can manage our cloud-based systems.",
            "views": random.randint(60, 180),
            "applicants": [],
            "match_threshold": 80,
            "auto_reject_threshold": 55,
            "created_at": datetime.now()
        },
        {
            "recruiter_id": "demo_recruiter_7",
            "job_title": "Content Writer",
            "company_name": "Wordsmith Agency",
            "company_website": "https://wordsmith.ke",
            "industry": "Content & Writing",
            "location": "Nairobi, Kenya",
            "remote_option": "Remote",
            "job_type": "Part-time",
            "salary_range": "KSh 60,000 - 100,000",
            "experience_required": "1-2 years",
            "required_skills": "Content Writing, SEO, Social Media, WordPress",
            "responsibilities": "Create engaging content, write blog posts, manage social media content, optimize for SEO",
            "education_required": "Bachelor's degree in English, Journalism, or related field",
            "application_deadline": (datetime.now() + timedelta(days=12)).isoformat(),
            "description": "We're seeking a creative Content Writer to help us create compelling content for our clients. You'll work on various projects and help build brand awareness.",
            "views": random.randint(20, 80),
            "applicants": [],
            "match_threshold": 65,
            "auto_reject_threshold": 40,
            "created_at": datetime.now()
        },
        {
            "recruiter_id": "demo_recruiter_8",
            "job_title": "Project Manager",
            "company_name": "Efficient Solutions",
            "company_website": "https://efficientsolutions.ke",
            "industry": "Project Management",
            "location": "Nairobi, Kenya",
            "remote_option": "Hybrid",
            "job_type": "Full-time",
            "salary_range": "KSh 130,000 - 200,000",
            "experience_required": "3-5 years",
            "required_skills": "Project Management, Agile, Scrum, Team Leadership",
            "responsibilities": "Lead project teams, manage timelines and budgets, coordinate with stakeholders, ensure project delivery",
            "education_required": "Bachelor's degree in Business or related field",
            "application_deadline": (datetime.now() + timedelta(days=28)).isoformat(),
            "description": "We're looking for an experienced Project Manager to lead our development teams. You'll be responsible for ensuring projects are delivered on time and within budget.",
            "views": random.randint(45, 130),
            "applicants": [],
            "match_threshold": 75,
            "auto_reject_threshold": 50,
            "created_at": datetime.now()
        }
    ]
    
    try:
        # Check if jobs already exist
        existing_jobs = jobs_collection.count_documents({})
        if existing_jobs > 0:
            print(f"📊 Found {existing_jobs} existing jobs in database")
            response = input("Do you want to add demo jobs anyway? (y/n): ")
            if response.lower() != 'y':
                print("❌ Demo jobs creation cancelled")
                return False
        
        # Insert demo jobs
        result = jobs_collection.insert_many(demo_jobs)
        
        if result.inserted_ids:
            print(f"✅ Successfully created {len(result.inserted_ids)} demo jobs!")
            print("\n📋 Demo Jobs Created:")
            for i, job in enumerate(demo_jobs, 1):
                print(f"   {i}. {job['job_title']} at {job['company_name']} - {job['location']}")
            
            print(f"\n🚀 You can now view these jobs on the public jobs page!")
            print(f"🌐 Visit: http://localhost:3002/public-jobs")
            return True
        else:
            print("❌ Failed to create demo jobs")
            return False
            
    except Exception as e:
        print(f"❌ Error creating demo jobs: {str(e)}")
        return False

if __name__ == "__main__":
    print("🔍 Creating Demo Jobs for Public Jobs Page")
    print("=" * 50)
    create_demo_jobs()
