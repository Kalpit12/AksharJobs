#!/usr/bin/env python3
"""
Script to create demo applications for testing the application tracker
"""

import os
import sys
from datetime import datetime, timedelta
from bson import ObjectId

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from models.application_model import ApplicationModel

def create_demo_applications():
    """Create demo applications with various statuses"""
    
    db = get_db()
    if db is None:
        print("❌ Failed to connect to database")
        return
    
    print("🚀 Creating demo applications...")
    
    # Get some existing users and jobs
    users = list(db.users.find({}, limit=5))
    jobs = list(db.jobs.find({}, limit=10))
    
    if not users or not jobs:
        print("❌ No users or jobs found. Please create some users and jobs first.")
        return
    
    # Demo application data
    demo_applications = [
        {
            "userId": str(users[0]['_id']),
            "jobId": str(jobs[0]['_id']),
            "status": "interview",
            "matchScore": 0.94,
            "final_score": 94,
            "education_score": 95,
            "experience_score": 90,
            "skill_score": 95,
            "applied_at": (datetime.now() - timedelta(days=5)).isoformat(),
            "job_title": "Product Manager",
            "company_name": "TechCorp Solutions",
            "applicant_name": "Manan Patel",
            "applicant_email": "manan.patel@example.com",
            "cover_letter": "I am excited to apply for the Product Manager position at TechCorp Solutions. With my extensive experience in product strategy, user research, and cross-functional team leadership, I believe I can drive significant value for your organization.",
            "interview_scheduled": (datetime.now() + timedelta(days=1)).isoformat(),
            "interview_mode": "video",
            "notes": "Strong candidate with excellent product management background. Ready for final interview round."
        },
        {
            "userId": str(users[1]['_id']) if len(users) > 1 else str(users[0]['_id']),
            "jobId": str(jobs[1]['_id']) if len(jobs) > 1 else str(jobs[0]['_id']),
            "status": "ai_screening",
            "matchScore": 0.92,
            "final_score": 92,
            "education_score": 95,
            "experience_score": 90,
            "skill_score": 90,
            "applied_at": (datetime.now() - timedelta(days=2)).isoformat(),
            "job_title": jobs[1].get('job_title', 'Data Scientist') if len(jobs) > 1 else jobs[0].get('job_title', 'Software Engineer'),
            "company_name": jobs[1].get('company_name', 'DataCorp') if len(jobs) > 1 else jobs[0].get('company_name', 'TechCorp'),
            "applicant_name": f"{users[1].get('firstName', '')} {users[1].get('lastName', '')}" if len(users) > 1 else f"{users[0].get('firstName', '')} {users[0].get('lastName', '')}",
            "applicant_email": users[1].get('email', '') if len(users) > 1 else users[0].get('email', ''),
            "cover_letter": "My experience in data science and machine learning makes me a perfect fit for this role."
        },
        {
            "userId": str(users[2]['_id']) if len(users) > 2 else str(users[0]['_id']),
            "jobId": str(jobs[2]['_id']) if len(jobs) > 2 else str(jobs[0]['_id']),
            "status": "reviewing",
            "matchScore": 0.78,
            "final_score": 78,
            "education_score": 85,
            "experience_score": 75,
            "skill_score": 80,
            "applied_at": (datetime.now() - timedelta(days=3)).isoformat(),
            "job_title": jobs[2].get('job_title', 'UX Designer') if len(jobs) > 2 else jobs[0].get('job_title', 'Software Engineer'),
            "company_name": jobs[2].get('company_name', 'DesignCorp') if len(jobs) > 2 else jobs[0].get('company_name', 'TechCorp'),
            "applicant_name": f"{users[2].get('firstName', '')} {users[2].get('lastName', '')}" if len(users) > 2 else f"{users[0].get('firstName', '')} {users[0].get('lastName', '')}",
            "applicant_email": users[2].get('email', '') if len(users) > 2 else users[0].get('email', ''),
            "cover_letter": "I have a strong background in user experience design and would love to contribute to your team."
        },
        {
            "userId": str(users[3]['_id']) if len(users) > 3 else str(users[0]['_id']),
            "jobId": str(jobs[3]['_id']) if len(jobs) > 3 else str(jobs[0]['_id']),
            "status": "shortlisted",
            "matchScore": 0.95,
            "final_score": 95,
            "education_score": 100,
            "experience_score": 95,
            "skill_score": 90,
            "applied_at": (datetime.now() - timedelta(days=4)).isoformat(),
            "job_title": jobs[3].get('job_title', 'Product Manager') if len(jobs) > 3 else jobs[0].get('job_title', 'Software Engineer'),
            "company_name": jobs[3].get('company_name', 'ProductCorp') if len(jobs) > 3 else jobs[0].get('company_name', 'TechCorp'),
            "applicant_name": f"{users[3].get('firstName', '')} {users[3].get('lastName', '')}" if len(users) > 3 else f"{users[0].get('firstName', '')} {users[0].get('lastName', '')}",
            "applicant_email": users[3].get('email', '') if len(users) > 3 else users[0].get('email', ''),
            "cover_letter": "My product management experience and technical background make me an ideal candidate for this position."
        },
        {
            "userId": str(users[4]['_id']) if len(users) > 4 else str(users[0]['_id']),
            "jobId": str(jobs[4]['_id']) if len(jobs) > 4 else str(jobs[0]['_id']),
            "status": "interview",
            "matchScore": 0.88,
            "final_score": 88,
            "education_score": 90,
            "experience_score": 85,
            "skill_score": 90,
            "applied_at": (datetime.now() - timedelta(days=5)).isoformat(),
            "job_title": jobs[4].get('job_title', 'DevOps Engineer') if len(jobs) > 4 else jobs[0].get('job_title', 'Software Engineer'),
            "company_name": jobs[4].get('company_name', 'DevOpsCorp') if len(jobs) > 4 else jobs[0].get('company_name', 'TechCorp'),
            "applicant_name": f"{users[4].get('firstName', '')} {users[4].get('lastName', '')}" if len(users) > 4 else f"{users[0].get('firstName', '')} {users[0].get('lastName', '')}",
            "applicant_email": users[4].get('email', '') if len(users) > 4 else users[0].get('email', ''),
            "cover_letter": "I have extensive experience in DevOps and cloud infrastructure, which aligns perfectly with your requirements."
        }
    ]
    
    # Create applications
    created_count = 0
    for app_data in demo_applications:
        try:
            # Check if application already exists
            existing = db.application.find_one({
                "userId": app_data["userId"],
                "jobId": app_data["jobId"]
            })
            
            if not existing:
                # Create the application
                app_id = ApplicationModel.save_application(app_data)
                
                # Create initial tracking record
                ApplicationModel.create_tracking_record(
                    app_data["userId"], 
                    app_data["jobId"], 
                    app_data["status"], 
                    "Application submitted"
                )
                
                # Add detailed tracking history for Manan Patel's Product Manager application
                if app_data["applicant_name"] == "Manan Patel" and app_data["job_title"] == "Product Manager":
                    # Create a comprehensive tracking history
                    tracking_history = [
                        {
                            "status": "pending",
                            "notes": "Application submitted successfully",
                            "timestamp": (datetime.now() - timedelta(days=5)).isoformat()
                        },
                        {
                            "status": "ai_screening", 
                            "notes": "AI screening completed - High match score (94%)",
                            "timestamp": (datetime.now() - timedelta(days=4)).isoformat()
                        },
                        {
                            "status": "reviewing",
                            "notes": "Application moved to manual review - Strong candidate profile",
                            "timestamp": (datetime.now() - timedelta(days=3)).isoformat()
                        },
                        {
                            "status": "shortlisted",
                            "notes": "Candidate shortlisted - Excellent product management experience",
                            "timestamp": (datetime.now() - timedelta(days=2)).isoformat()
                        },
                        {
                            "status": "interview",
                            "notes": "Interview scheduled for tomorrow - Final round with product team",
                            "timestamp": (datetime.now() - timedelta(days=1)).isoformat()
                        }
                    ]
                    
                    # Insert tracking history
                    for tracking in tracking_history:
                        ApplicationModel.create_tracking_record(
                            app_data["userId"],
                            app_data["jobId"], 
                            tracking["status"],
                            tracking["notes"]
                        )
                
                created_count += 1
                print(f"✅ Created application for {app_data['applicant_name']} - {app_data['job_title']} ({app_data['status']})")
            else:
                print(f"⚠️  Application already exists for {app_data['applicant_name']} - {app_data['job_title']}")
                
        except Exception as e:
            print(f"❌ Error creating application: {e}")
    
    print(f"\n🎉 Demo applications created successfully! ({created_count} new applications)")
    print("\n📋 Application Statuses Created:")
    print("   • Pending - Application submitted and awaiting review")
    print("   • AI Screening - Application is being evaluated by AI system")
    print("   • Reviewing - Application is being reviewed by hiring team")
    print("   • Shortlisted - Application has been shortlisted")
    print("   • Interview - Candidate has been selected for interview")
    print("\n🔗 You can now test the application tracker at:")
    print("   • Job Seeker Tracker: http://localhost:3003/application-tracker")
    print("   • Recruiter Tracker: http://localhost:3003/recruiter-tracker")

if __name__ == "__main__":
    create_demo_applications()
