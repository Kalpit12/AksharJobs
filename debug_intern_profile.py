#!/usr/bin/env python3
"""
Debug script to check what's actually stored in the intern profile
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:3002"

def create_test_intern():
    """Create a test intern account"""
    try:
        signup_data = {
            "firstName": "Intern",
            "lastName": "Debug",
            "email": f"intern.debug.{int(time.time())}@example.com",
            "password": "TestPassword123!",
            "userType": "intern",
            "agreeToTerms": True
        }
        
        response = requests.post(
            f"{BASE_URL}/api/auth/signup",
            json=signup_data,
            timeout=30
        )
        
        if response.status_code == 201:
            data = response.json()
            print(f"✅ Created test intern account: {signup_data['email']}")
            return data.get('token'), data.get('userId')
        else:
            print(f"❌ Failed to create account: {response.status_code}")
            print(f"   Response: {response.text}")
            return None, None
            
    except Exception as e:
        print(f"❌ Error creating account: {e}")
        return None, None

def submit_comprehensive_intern_form(token):
    """Submit comprehensive intern form with detailed data"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        # Prepare comprehensive intern form data
        form_data = {
            # Personal Information
            'firstName': 'Intern',
            'lastName': 'Debug',
            'email': f'intern.debug.{int(time.time())}@example.com',
            'phone': '+254700000001',
            'dateOfBirth': '1998-05-20',
            'gender': 'Female',
            'community': 'Test Intern Community',
            
            # Nationality & Residency
            'nationality': 'Kenyan',
            'residentCountry': 'Kenya',
            'currentCity': 'Nairobi',
            'address': '456 Intern Street, Nairobi, Kenya',
            'postalCode': '00100',
            'latitude': '1.2921',
            'longitude': '36.8219',
            'willingToRelocate': 'Yes',
            
            # Education (as JSON array)
            'education': json.dumps([{
                'institution': 'University of Nairobi',
                'degree': 'Bachelor of Information Technology',
                'fieldOfStudy': 'Computer Science',
                'institutionLocation': 'Nairobi, Kenya',
                'gpa': '3.8',
                'eduStartYear': '2021',
                'eduEndYear': '2024',
                'currentYear': '3rd Year',
                'coursework': 'Data Structures, Algorithms, Database Systems',
                'achievements': 'Dean\'s List, Programming Competition Winner'
            }]),
            'graduationDate': '2024-06-01',
            'academicLevel': 'Undergraduate',
            
            # Skills & Competencies
            'technicalSkills': json.dumps(['Python', 'Django', 'MySQL', 'Git', 'JavaScript']),
            'softSkills': json.dumps(['Communication', 'Teamwork', 'Problem Solving', 'Leadership']),
            'languages': json.dumps([
                {'language': 'English', 'proficiency': 'Native'},
                {'language': 'Swahili', 'proficiency': 'Fluent'},
                {'language': 'French', 'proficiency': 'Intermediate'}
            ]),
            
            # Experience & Projects
            'experience': json.dumps([{
                'company': 'Tech Startup',
                'position': 'Junior Developer',
                'duration': '6 months',
                'description': 'Worked as a junior developer building web applications',
                'technologies': ['Python', 'Django', 'React'],
                'achievements': 'Improved application performance by 30%'
            }]),
            'projects': json.dumps([
                {
                    'projectName': 'E-commerce Website',
                    'projectDescription': 'Built a full-stack e-commerce platform using Django and React',
                    'technologies': ['Python', 'Django', 'React', 'PostgreSQL'],
                    'duration': '3 months',
                    'role': 'Full-stack Developer'
                },
                {
                    'projectName': 'Mobile App',
                    'projectDescription': 'Developed a mobile app for task management',
                    'technologies': ['React Native', 'Node.js', 'MongoDB'],
                    'duration': '2 months',
                    'role': 'Mobile Developer'
                }
            ]),
            
            # Internship Preferences
            'internshipType': 'Paid Internship',
            'internshipMode': 'Hybrid',
            'preferredDuration': '6 months',
            'startDate': '2024-01-01',
            'availability': 'Full-time',
            
            # Career Goals
            'careerGoals': 'To become a senior software developer and eventually a tech lead',
            'learningGoals': 'Learn cloud technologies and advanced software architecture',
            
            # Additional Information
            'interests': json.dumps(['Coding', 'Reading', 'Gaming', 'Traveling']),
            'activities': json.dumps(['Programming Club', 'Tech Meetups', 'Hackathons']),
            'certifications': json.dumps([
                'Python Programming Certificate',
                'AWS Cloud Practitioner',
                'Google Analytics Certificate'
            ]),
            'references': json.dumps([
                {
                    'name': 'Dr. Jane Smith',
                    'title': 'Professor',
                    'institution': 'University of Nairobi',
                    'email': 'jane.smith@university.ac.ke',
                    'phone': '+254700000003',
                    'relationship': 'Academic Supervisor'
                },
                {
                    'name': 'John Doe',
                    'title': 'Senior Developer',
                    'company': 'Tech Company Ltd',
                    'email': 'john.doe@techcompany.com',
                    'phone': '+254700000004',
                    'relationship': 'Industry Mentor'
                }
            ]),
            
            # Online Presence
            'linkedin': 'https://linkedin.com/in/intern-debug',
            'github': 'https://github.com/intern-debug',
            'portfolio': 'https://interndebug.portfolio.com',
            
            # Required fields
            'profileCompleted': 'true'
        }
        
        response = requests.post(
            f"{BASE_URL}/api/interns/submit-details",
            data=form_data,
            headers=headers,
            timeout=15
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Comprehensive intern form submitted successfully")
            return True
        else:
            print(f"❌ Form submission failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error submitting form: {e}")
        return False

def retrieve_intern_profile(token):
    """Retrieve and analyze the intern profile data"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(
            f"{BASE_URL}/api/interns/profile",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n📊 Intern Profile Data Analysis:")
            print(f"   Total fields: {len(data)}")
            print(f"   Field names: {list(data.keys())}")
            
            # Check specific comprehensive sections
            comprehensive_sections = [
                'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender',
                'nationality', 'address', 'education', 'graduationDate', 'technicalSkills', 'softSkills',
                'languages', 'experience', 'projects', 'internshipType',
                'internshipMode', 'careerGoals', 'interests', 'activities', 
                'certifications', 'references', 'linkedin', 'github', 'portfolio'
            ]
            
            print(f"\n🔍 Comprehensive Sections Check:")
            for section in comprehensive_sections:
                if section in data:
                    section_data = data[section]
                    if isinstance(section_data, (list, dict)):
                        print(f"   ✅ {section}: {len(section_data)} items")
                        if section in ['projects', 'references', 'certifications', 'technicalSkills', 'softSkills', 'education', 'experience', 'interests', 'activities']:
                            print(f"      Sample: {section_data[0] if section_data else 'Empty'}")
                    else:
                        print(f"   ✅ {section}: {section_data}")
                else:
                    print(f"   ❌ {section}: Missing")
            
            return data
        else:
            print(f"❌ Profile retrieval failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error retrieving profile: {e}")
        return None

def main():
    print("🔍 DEBUGGING INTERN PROFILE DATA")
    print("=" * 60)
    
    # Create test account
    token, user_id = create_test_intern()
    if not token:
        print("❌ Failed to create test account")
        return
    
    print(f"\n👤 Test Intern Account Created: {user_id}")
    
    # Submit comprehensive form
    print(f"\n📝 Submitting comprehensive intern form...")
    if not submit_comprehensive_intern_form(token):
        print("❌ Failed to submit form")
        return
    
    # Retrieve and analyze profile
    print(f"\n📊 Retrieving intern profile data...")
    profile_data = retrieve_intern_profile(token)
    
    if profile_data:
        print(f"\n✅ Intern profile analysis complete!")
        print(f"   The profile contains {len(profile_data)} fields")
        print(f"   All comprehensive sections should be present")
    else:
        print(f"\n❌ Failed to retrieve intern profile data")

if __name__ == "__main__":
    main()
