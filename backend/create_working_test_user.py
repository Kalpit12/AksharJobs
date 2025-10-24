#!/usr/bin/env python3
"""
Create a test jobseeker user that will work with the existing auth system
"""

import sys
import os
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from models.user_model import User
from bson import ObjectId

def create_working_test_user():
    """Create a test user using the same method as the actual signup"""
    
    print("🔧 Creating test user with proper authentication...")
    
    try:
        # Use the User model's create_user method (same as real signup)
        user_data = {
            "userType": "job_seeker",
            "firstName": "Complete",
            "lastName": "TestUser",
            "middleName": "Data",
            "email": f"complete.test{int(datetime.now().timestamp())}@example.com",
            "password": "Password123!",  # Plain password - will be hashed by User.create_user
            "phoneNumber": "+254712345678",
            "phone": "+254712345678",
            "altPhone": "+254787654321",
            
            # Personal Information
            "dateOfBirth": "1995-05-15",
            "gender": "Male",
            "bloodGroup": "O+",
            "community": "Technology",
            
            # Nationality & Residency
            "nationality": "Kenya",
            "residentCountry": "Kenya",
            "currentCity": "Nairobi",
            "postalCode": "00100",
            "address": "123 Test Street, Nairobi",
            "latitude": "-1.2921",
            "longitude": "36.8219",
            "workPermit": "Valid Work Permit",
            
            # Preferred Locations
            "preferredLocation1": "Nairobi",
            "preferredLocation2": "Mombasa",
            "preferredLocation3": "Remote",
            "willingToRelocate": "Yes",
            "workLocation": "Hybrid",
            
            # Professional Profile
            "professionalTitle": "Senior Full Stack Developer",
            "yearsExperience": "7",
            "yearsOfExperience": "7",
            "careerLevel": "Senior",
            "industry": "Technology",
            "summary": "Experienced full-stack developer with expertise in React, Node.js, Python, and MongoDB. Passionate about building scalable web applications.",
            "professionalSummary": "Experienced full-stack developer with expertise in React, Node.js, Python, and MongoDB. Passionate about building scalable web applications.",
            
            # Skills
            "coreSkills": ["React", "Node.js", "Python", "MongoDB", "JavaScript", "TypeScript", "AWS", "Docker", "Git"],
            "skills": ["React", "Node.js", "Python", "MongoDB", "JavaScript", "TypeScript", "AWS", "Docker", "Git"],
            "tools": ["VS Code", "Git", "Docker", "Postman", "Jira", "Figma"],
            
            # Languages
            "languages": [
                {"language": "English", "proficiency": "Native"},
                {"language": "Swahili", "proficiency": "Fluent"},
                {"language": "Spanish", "proficiency": "Intermediate"}
            ],
            
            # Education
            "educationEntries": [
                {
                    "degreeType": "Bachelor of Science",
                    "fieldOfStudy": "Computer Science",
                    "institution": "University of Nairobi",
                    "institutionLocation": "Nairobi, Kenya",
                    "grade": "First Class Honours",
                    "eduStartYear": "2012",
                    "eduEndYear": "2016",
                    "eduActivities": "Computer Science Club President, Hackathon Winner, Dean's List"
                },
                {
                    "degreeType": "Master of Science",
                    "fieldOfStudy": "Software Engineering",
                    "institution": "Strathmore University",
                    "institutionLocation": "Nairobi, Kenya",
                    "grade": "Distinction",
                    "eduStartYear": "2017",
                    "eduEndYear": "2019",
                    "eduActivities": "Research Assistant, Published 2 papers"
                }
            ],
            "education": [
                {
                    "degreeType": "Bachelor of Science",
                    "fieldOfStudy": "Computer Science",
                    "institution": "University of Nairobi",
                    "institutionLocation": "Nairobi, Kenya",
                    "grade": "First Class Honours",
                    "eduStartYear": "2012",
                    "eduEndYear": "2016",
                    "eduActivities": "Computer Science Club President, Hackathon Winner, Dean's List"
                }
            ],
            
            # Experience
            "experienceEntries": [
                {
                    "jobTitle": "Senior Full Stack Developer",
                    "company": "Tech Solutions Kenya",
                    "companyLocation": "Nairobi, Kenya",
                    "employmentType": "full-time",
                    "jobIndustry": "Technology",
                    "startDate": "2021-03",
                    "endDate": "",
                    "currentJob": True,
                    "jobDescription": "Leading development of enterprise web applications using React, Node.js, and MongoDB. Managing a team of 5 developers."
                },
                {
                    "jobTitle": "Full Stack Developer",
                    "company": "StartUp Hub",
                    "companyLocation": "Nairobi, Kenya",
                    "employmentType": "full-time",
                    "jobIndustry": "Technology",
                    "startDate": "2019-06",
                    "endDate": "2021-02",
                    "currentJob": False,
                    "jobDescription": "Developed multiple web applications for clients. Worked with React, Vue.js, Python Django, and PostgreSQL."
                },
                {
                    "jobTitle": "Junior Developer",
                    "company": "Digital Agency",
                    "companyLocation": "Nairobi, Kenya",
                    "employmentType": "full-time",
                    "jobIndustry": "Technology",
                    "startDate": "2016-08",
                    "endDate": "2019-05",
                    "currentJob": False,
                    "jobDescription": "Built responsive websites and web applications. Collaborated with designers and project managers."
                }
            ],
            "experience": [
                {
                    "jobTitle": "Senior Full Stack Developer",
                    "company": "Tech Solutions Kenya",
                    "companyLocation": "Nairobi, Kenya",
                    "employmentType": "full-time",
                    "jobIndustry": "Technology",
                    "startDate": "2021-03",
                    "endDate": "",
                    "currentJob": True,
                    "jobDescription": "Leading development of enterprise web applications."
                }
            ],
            "workExperience": [
                {
                    "jobTitle": "Senior Full Stack Developer",
                    "company": "Tech Solutions Kenya",
                    "companyLocation": "Nairobi, Kenya",
                    "employmentType": "full-time",
                    "jobIndustry": "Technology",
                    "startDate": "2021-03",
                    "endDate": "",
                    "currentJob": True,
                    "jobDescription": "Leading development of enterprise web applications."
                }
            ],
            
            # Certifications
            "certificationEntries": [
                {
                    "certificationName": "AWS Certified Solutions Architect",
                    "certIssuer": "Amazon Web Services",
                    "certIssueDate": "2022-06",
                    "certExpiryDate": "2025-06",
                    "credentialId": "AWS-SA-123456"
                },
                {
                    "certificationName": "MongoDB Certified Developer",
                    "certIssuer": "MongoDB University",
                    "certIssueDate": "2021-03",
                    "certExpiryDate": "",
                    "credentialId": "MDB-DEV-789012"
                }
            ],
            "certifications": [
                {
                    "certificationName": "AWS Certified Solutions Architect",
                    "certIssuer": "Amazon Web Services",
                    "certIssueDate": "2022-06",
                    "certExpiryDate": "2025-06",
                    "credentialId": "AWS-SA-123456"
                }
            ],
            
            # References
            "referenceEntries": [
                {
                    "refName": "John Kamau",
                    "refRelationship": "Former Manager",
                    "refCompany": "StartUp Hub",
                    "refEmail": "john.kamau@startuphub.co.ke",
                    "refPhone": "+254722111222"
                }
            ],
            "references": [
                {
                    "refName": "John Kamau",
                    "refRelationship": "Former Manager",
                    "refCompany": "StartUp Hub",
                    "refEmail": "john.kamau@startuphub.co.ke",
                    "refPhone": "+254722111222"
                }
            ],
            
            # Professional Links
            "professionalLinks": [
                {"platform": "LinkedIn", "url": "https://linkedin.com/in/completetest"},
                {"platform": "GitHub", "url": "https://github.com/completetest"},
                {"platform": "Portfolio", "url": "https://completetest.dev"}
            ],
            "linkedInProfile": "https://linkedin.com/in/completetest",
            
            # Job Preferences
            "preferredJobTitles": "Full Stack Developer, Senior Developer, Tech Lead",
            "jobType": "full-time",
            "jobTypePreference": "full-time",
            "noticePeriod": "1 month",
            "currentSalary": "180000",
            "expectedSalary": "250000",
            "currencyPreference": "KES",
            "travelAvailability": "Willing to travel",
            "availability": "Available",
            
            # Professional Memberships
            "membershipOrg": "ACM (Association for Computing Machinery)",
            "membershipType": "Professional Member",
            "membershipDate": "2020-01",
            
            # Additional Info
            "careerObjectives": "To become a technical architect and lead large-scale software projects while mentoring junior developers.",
            "hobbies": "Open source contribution, Tech blogging, Photography, Hiking",
            "additionalComments": "Available for remote or hybrid positions. Open to relocation for the right opportunity.",
            "agreeTerms": True,
            "allowContact": True,
            
            # Metadata
            "profileCompleted": True,
            "hasCompletedProfile": True,
            "is_verified": True,
            "is_active": True,
            "created_at": datetime.now()
        }
        
        # Create user using the User model (same as real signup)
        result = User.create_user(user_data)
        
        if result:
            print(f"✅ Test user created successfully!")
            print(f"\n{'='*80}")
            print(f"LOGIN CREDENTIALS:")
            print(f"{'='*80}")
            print(f"📧 Email: {user_data['email']}")
            print(f"🔑 Password: Password123!")
            print(f"{'='*80}")
            print(f"\n✅ This user has COMPLETE profile data including:")
            print(f"   ✓ Personal Information")
            print(f"   ✓ Education (2 degrees)")
            print(f"   ✓ Work Experience (3 positions)")
            print(f"   ✓ Skills (9 core skills)")
            print(f"   ✓ Languages (3 languages)")
            print(f"   ✓ Certifications (2 certificates)")
            print(f"   ✓ References (1 reference)")
            print(f"   ✓ Professional Links")
            print(f"   ✓ Job Preferences")
            print(f"\n🎯 NEXT STEPS:")
            print(f"   1. Login with the credentials above")
            print(f"   2. Navigate to MyProfile page")
            print(f"   3. You should see ALL sections filled with data!")
            print(f"\n{'='*80}")
            
            return user_data['email']
        else:
            print("❌ Failed to create user")
            return None
            
    except Exception as e:
        print(f"❌ Error creating test user: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    try:
        create_working_test_user()
    except KeyboardInterrupt:
        print("\n\n⚠️  Operation cancelled by user")
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()

