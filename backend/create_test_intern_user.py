"""
Create Test Intern User with Comprehensive Sample Data
========================================================
This script creates a test intern user with complete profile data
to verify the data flow from database to My Profile page.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.db import get_db
from bson import ObjectId
from datetime import datetime
import bcrypt

def create_test_intern_user():
    """
    Create a test intern user with all 15 comprehensive sections filled
    """
    print("\n" + "="*70)
    print("CREATING TEST INTERN USER WITH SAMPLE DATA")
    print("="*70 + "\n")
    
    db = get_db()
    users_collection = db.users
    
    # Test user credentials
    test_email = "test.intern@aksharvault.com"
    test_password = "Test@123"
    
    print(f"1. Checking if test user exists...")
    existing_user = users_collection.find_one({'email': test_email})
    
    if existing_user:
        print(f"   [INFO] Test user already exists: {test_email}")
        print(f"   [INFO] Will update with comprehensive data")
        user_id = existing_user['_id']
        is_new_user = False
    else:
        print(f"   [INFO] Creating new test user: {test_email}")
        
        # Hash password
        hashed_password = bcrypt.hashpw(test_password.encode('utf-8'), bcrypt.gensalt())
        
        # Create basic user document
        new_user = {
            'email': test_email,
            'password': hashed_password.decode('utf-8'),
            'firstName': 'Alex',
            'lastName': 'Johnson',
            'userType': 'intern',
            'phoneNumber': '+1234567890',
            'createdAt': datetime.utcnow(),
            'lastLogin': datetime.utcnow(),
            'isEmailVerified': True,
            'isPhoneVerified': True,
            'status': 'active',
            'akshar_coins': 50,
            'subscription': {
                'plan': 'free',
                'status': 'active',
                'startDate': datetime.utcnow(),
                'endDate': None,
                'features': []
            }
        }
        
        result = users_collection.insert_one(new_user)
        user_id = result.inserted_id
        print(f"   [OK] Created user with ID: {user_id}")
        is_new_user = True
    
    print(f"\n2. Creating comprehensive profile data...")
    
    # Comprehensive profile with all 15 sections
    comprehensive_profile = {
        # Section 1: Personal Information
        'firstName': 'Alex',
        'lastName': 'Johnson',
        'middleName': 'Marie',
        'email': test_email,
        'phone': '+1234567890',
        'altPhone': '+1234567891',
        'dateOfBirth': '2002-05-15',
        'gender': 'Female',
        
        # Section 2: Nationality & Residency
        'nationality': 'United States',
        'residentCountry': 'United States',
        'currentCity': 'San Francisco',
        'postalCode': '94102',
        'address': '123 Tech Street, Apartment 4B',
        'latitude': '37.7749',
        'longitude': '-122.4194',
        'validDocs': 'Passport, Driver\'s License',
        
        # Section 3: Preferred Internship Locations
        'preferredLocation1': 'San Francisco, CA',
        'preferredLocation2': 'New York, NY',
        'preferredLocation3': 'Remote',
        'willingToRelocate': 'Yes',
        'internshipMode': 'Hybrid',
        
        # Section 4: Education (Array of objects)
        'educationEntries': [
            {
                'institution': 'Stanford University',
                'degree': 'Bachelor of Science',
                'fieldOfStudy': 'Computer Science',
                'startDate': '2020-09',
                'endDate': '2024-05',
                'gpa': '3.8',
                'currentlyStudying': 'Yes',
                'relevantCoursework': 'Data Structures, Algorithms, Machine Learning, Web Development'
            },
            {
                'institution': 'Lincoln High School',
                'degree': 'High School Diploma',
                'fieldOfStudy': 'General Studies',
                'startDate': '2016-09',
                'endDate': '2020-06',
                'gpa': '3.9',
                'currentlyStudying': 'No',
                'relevantCoursework': 'AP Computer Science, AP Calculus, Physics'
            }
        ],
        
        # Section 5: Internship Objective & Career Goals
        'academicLevel': 'Undergraduate - Senior',
        'objective': 'Seeking a challenging software engineering internship to apply my skills in full-stack development and contribute to innovative projects in a fast-paced environment.',
        'industryInterest': 'Technology, Software Development, AI/ML',
        'preferredRole': 'Software Engineering Intern',
        
        # Section 6: Previous Internships & Work Experience (Array)
        'experienceEntries': [
            {
                'company': 'Tech Startup Inc.',
                'title': 'Frontend Developer Intern',
                'location': 'San Francisco, CA',
                'startDate': '2023-06',
                'endDate': '2023-08',
                'currentlyWorking': 'No',
                'description': 'Developed responsive web applications using React and TypeScript. Collaborated with design team to implement pixel-perfect UI components. Improved page load time by 40% through code optimization.',
                'internshipType': 'Summer Internship'
            },
            {
                'company': 'University Computer Lab',
                'title': 'Teaching Assistant',
                'location': 'Stanford, CA',
                'startDate': '2022-09',
                'endDate': '2023-05',
                'currentlyWorking': 'No',
                'description': 'Assisted professor in teaching Introduction to Programming course. Held office hours and graded assignments for 150+ students. Created tutorial materials and coding examples.',
                'internshipType': 'Part-time Work'
            }
        ],
        
        # Section 7: Skills & Competencies (Arrays)
        'technicalSkills': [
            'Python',
            'JavaScript',
            'React',
            'Node.js',
            'TypeScript',
            'HTML/CSS',
            'Git',
            'MongoDB',
            'PostgreSQL',
            'REST APIs',
            'Docker',
            'AWS'
        ],
        'softSkills': [
            'Problem Solving',
            'Communication',
            'Team Collaboration',
            'Time Management',
            'Leadership',
            'Critical Thinking',
            'Adaptability',
            'Creativity'
        ],
        
        # Section 8: Languages (Array)
        'languages': [
            {
                'language': 'English',
                'proficiency': 'Native'
            },
            {
                'language': 'Spanish',
                'proficiency': 'Intermediate'
            },
            {
                'language': 'French',
                'proficiency': 'Basic'
            }
        ],
        
        # Section 9: Academic Projects & Portfolio (Array)
        'projectEntries': [
            {
                'title': 'E-Commerce Platform',
                'description': 'Built a full-stack e-commerce platform with user authentication, product catalog, shopping cart, and payment integration using MERN stack.',
                'technologies': 'React, Node.js, Express, MongoDB, Stripe API',
                'role': 'Full-Stack Developer',
                'startDate': '2023-09',
                'endDate': '2023-12',
                'url': 'https://github.com/alexj/ecommerce-platform',
                'category': 'Web Development'
            },
            {
                'title': 'AI Chatbot Assistant',
                'description': 'Developed an intelligent chatbot using natural language processing and machine learning to provide customer support automation.',
                'technologies': 'Python, TensorFlow, Flask, OpenAI API',
                'role': 'ML Engineer',
                'startDate': '2023-01',
                'endDate': '2023-05',
                'url': 'https://github.com/alexj/ai-chatbot',
                'category': 'Machine Learning'
            }
        ],
        
        # Section 10: Extracurricular Activities & Leadership (Array)
        'activityEntries': [
            {
                'name': 'Women in Tech Club',
                'role': 'President',
                'organization': 'Stanford University',
                'startDate': '2022-09',
                'endDate': '2024-05',
                'currentlyActive': 'Yes',
                'description': 'Lead a student organization with 200+ members. Organize workshops, hackathons, and networking events. Secured $10K in sponsorships.'
            },
            {
                'name': 'Code for Good Hackathon',
                'role': 'Participant & Winner',
                'organization': 'TechForGood Foundation',
                'startDate': '2023-03',
                'endDate': '2023-03',
                'currentlyActive': 'No',
                'description': 'Won first place in 48-hour hackathon for developing a disaster relief coordination app. Collaborated with a team of 4 developers.'
            }
        ],
        
        # Section 11: Certifications & Training (Array)
        'certificationEntries': [
            {
                'name': 'AWS Certified Cloud Practitioner',
                'issuer': 'Amazon Web Services',
                'issueDate': '2023-06',
                'expiryDate': '2026-06',
                'credentialId': 'AWS-123456',
                'url': 'https://aws.amazon.com/certification'
            },
            {
                'name': 'Full-Stack Web Development',
                'issuer': 'freeCodeCamp',
                'issueDate': '2022-12',
                'expiryDate': '',
                'credentialId': 'FCC-789012',
                'url': 'https://freecodecamp.org/certification'
            }
        ],
        
        # Section 12: References (Array)
        'referenceEntries': [
            {
                'name': 'Dr. Sarah Chen',
                'relationship': 'Professor & Academic Advisor',
                'organization': 'Stanford University',
                'email': 'sarah.chen@stanford.edu',
                'phone': '+1234567892',
                'knownSince': '2020'
            },
            {
                'name': 'Michael Rodriguez',
                'relationship': 'Internship Supervisor',
                'organization': 'Tech Startup Inc.',
                'email': 'michael.r@techstartup.com',
                'phone': '+1234567893',
                'knownSince': '2023'
            }
        ],
        
        # Section 13: Online Presence & Portfolio (Array)
        'professionalLinks': [
            {
                'platform': 'LinkedIn',
                'url': 'https://linkedin.com/in/alexjohnson'
            },
            {
                'platform': 'GitHub',
                'url': 'https://github.com/alexj'
            },
            {
                'platform': 'Personal Portfolio',
                'url': 'https://alexjohnson.dev'
            },
            {
                'platform': 'Twitter',
                'url': 'https://twitter.com/alexjdev'
            }
        ],
        
        # Section 14: Internship Preferences & Availability
        'internshipDuration': '3-6 months',
        'availability': 'Immediate',
        'internshipTiming': 'Summer 2025',
        'expectedStipend': '3000-5000',
        'currencyPreference': 'USD',
        'unpaidWilling': 'No',
        'academicCredit': 'Yes',
        
        # Section 15: Additional Information
        'hobbies': 'Coding side projects, hiking, reading tech blogs, playing guitar, photography',
        'whyInternship': 'I am passionate about software development and eager to apply my academic knowledge in a real-world setting. I believe an internship will provide invaluable hands-on experience, help me develop professional skills, and allow me to contribute to meaningful projects while learning from experienced mentors.',
        'additionalComments': 'I am particularly interested in working on projects related to web development and machine learning. I am a quick learner, highly motivated, and committed to delivering high-quality work. Available for both remote and on-site opportunities.',
        
        # Career Interests (Array)
        'careerInterests': [
            'Software Engineering',
            'Full-Stack Development',
            'Machine Learning',
            'Cloud Computing'
        ],
        
        # Metadata
        'profileCompleted': True,
        'isDraft': False,
        'profileType': 'comprehensive',
        'createdAt': datetime.utcnow(),
        'updatedAt': datetime.utcnow()
    }
    
    print(f"   [OK] Comprehensive profile created with {len(comprehensive_profile)} fields")
    print(f"   [OK] Education entries: {len(comprehensive_profile['educationEntries'])}")
    print(f"   [OK] Experience entries: {len(comprehensive_profile['experienceEntries'])}")
    print(f"   [OK] Technical skills: {len(comprehensive_profile['technicalSkills'])}")
    print(f"   [OK] Soft skills: {len(comprehensive_profile['softSkills'])}")
    print(f"   [OK] Languages: {len(comprehensive_profile['languages'])}")
    print(f"   [OK] Projects: {len(comprehensive_profile['projectEntries'])}")
    print(f"   [OK] Activities: {len(comprehensive_profile['activityEntries'])}")
    print(f"   [OK] Certifications: {len(comprehensive_profile['certificationEntries'])}")
    print(f"   [OK] References: {len(comprehensive_profile['referenceEntries'])}")
    print(f"   [OK] Professional links: {len(comprehensive_profile['professionalLinks'])}")
    
    print(f"\n3. Saving to database...")
    
    # Update user with comprehensive profile
    result = users_collection.update_one(
        {'_id': ObjectId(user_id)},
        {
            '$set': {
                'comprehensiveInternProfile': comprehensive_profile,
                'profileCompleted': True,
                'profileType': 'comprehensive',
                'updatedAt': datetime.utcnow()
            }
        }
    )
    
    if result.modified_count > 0 or result.matched_count > 0:
        print(f"   [OK] Data saved successfully!")
    else:
        print(f"   [ERROR] Failed to save data")
        return False
    
    print(f"\n4. Verifying data was saved...")
    
    # Verify the data
    saved_user = users_collection.find_one({'_id': ObjectId(user_id)})
    
    if 'comprehensiveInternProfile' in saved_user:
        comp_profile = saved_user['comprehensiveInternProfile']
        print(f"   [OK] Comprehensive profile found with {len(comp_profile)} fields")
        
        # Check a few key fields
        checks = [
            ('firstName', comp_profile.get('firstName')),
            ('email', comp_profile.get('email')),
            ('educationEntries', len(comp_profile.get('educationEntries', []))),
            ('technicalSkills', len(comp_profile.get('technicalSkills', []))),
            ('experienceEntries', len(comp_profile.get('experienceEntries', [])))
        ]
        
        all_good = True
        for field, value in checks:
            if value:
                print(f"   [OK] {field}: {value}")
            else:
                print(f"   [WARNING] {field}: Missing or empty")
                all_good = False
        
        if all_good:
            print(f"\n   [SUCCESS] All data verified!")
        else:
            print(f"\n   [WARNING] Some data may be missing")
    else:
        print(f"   [ERROR] Comprehensive profile not found!")
        return False
    
    print(f"\n" + "="*70)
    print("TEST USER CREATED SUCCESSFULLY")
    print("="*70)
    print(f"\n[LOGIN CREDENTIALS]")
    print(f"   Email: {test_email}")
    print(f"   Password: {test_password}")
    print(f"   User ID: {user_id}")
    print(f"\n[URLS]")
    print(f"   Login: http://localhost:3003/login")
    print(f"   My Profile: http://localhost:3003/intern-profile")
    print(f"\n[NEXT STEPS]")
    print(f"   1. Login with the credentials above")
    print(f"   2. Navigate to My Profile page")
    print(f"   3. See all 15 sections filled with data")
    print(f"   4. Test Edit/Save/Cancel functionality")
    print(f"   5. Verify data persists after refresh")
    print(f"\n[RUN VERIFICATION TEST]")
    print(f"   cd backend")
    print(f"   python test_intern_data_flow.py")
    print("\n" + "="*70 + "\n")
    
    return True


if __name__ == '__main__':
    try:
        success = create_test_intern_user()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n[ERROR] Failed to create test user: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

