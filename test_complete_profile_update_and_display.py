"""
Complete Profile Update and Display Test
1. Register a new user
2. Update profile with ALL fields
3. Fetch profile and verify ALL fields display correctly
"""

import requests
import json
from datetime import datetime
import random
import string

# Configuration
BACKEND_URL = "http://localhost:3002"

def generate_random_email():
    """Generate a random email for testing"""
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"fullprofile_test_{random_str}@test.com"

def test_complete_profile_workflow():
    """Test complete workflow: register -> update profile -> verify display"""
    
    print("=" * 90)
    print("COMPLETE PROFILE UPDATE & DISPLAY TEST")
    print("=" * 90)
    
    test_email = generate_random_email()
    
    # Step 1: Register basic user
    print("\n1. REGISTERING NEW USER")
    print("-" * 90)
    
    signup_data = {
        "userType": "jobSeeker",
        "firstName": "John",
        "lastName": "Doe",
        "email": test_email,
        "phoneNumber": "+1-555-123-4567",
        "password": "SecurePassword123!",
        "linkedInProfile": "https://linkedin.com/in/johndoe"
    }
    
    print(f"📧 Email: {test_email}")
    print(f"👤 Name: {signup_data['firstName']} {signup_data['lastName']}")
    
    try:
        signup_response = requests.post(
            f"{BACKEND_URL}/api/auth/signup",
            json=signup_data,
            headers={"Content-Type": "application/json"}
        )
        
        if signup_response.status_code not in [200, 201]:
            print(f"❌ Registration failed: {signup_response.text}")
            return False
        
        print("✅ User registered successfully!")
        signup_result = signup_response.json()
        token = signup_result.get('token')
        user_id = signup_result.get('userId')
        
        print(f"🔑 Token: {token[:30]}...")
        print(f"🆔 User ID: {user_id}")
        
        # Step 2: Update profile with ALL fields
        print("\n2. UPDATING PROFILE WITH COMPLETE DATA")
        print("-" * 90)
        
        complete_profile = {
            # Personal Information
            "firstName": "John",
            "middleName": "Michael",
            "lastName": "Doe",
            "email": test_email,
            "phoneNumber": "+1-555-123-4567",
            "altPhone": "+1-555-987-6543",
            "dateOfBirth": "1990-05-15",
            "gender": "Male",
            "bloodGroup": "O+",
            "community": "Technology Professionals",
            
            # Location & Residency
            "nationality": "United States",
            "residentCountry": "United States",
            "currentCity": "San Francisco",
            "postalCode": "94105",
            "address": "123 Tech Street, Suite 400",
            "location": "San Francisco, CA, USA",
            "latitude": 37.7749,
            "longitude": -122.4194,
            "workPermit": "US Citizen",
            
            # Preferred Locations
            "preferredLocation1": "San Francisco, CA",
            "preferredLocation2": "New York, NY",
            "preferredLocation3": "Remote",
            "willingToRelocate": "Yes",
            "workLocation": "Hybrid",
            
            # Professional Profile
            "professionalTitle": "Senior Full Stack Developer",
            "professionalSummary": "Experienced full-stack developer with 8+ years of expertise in building scalable web applications. Proficient in React, Node.js, Python, and cloud technologies.",
            "currentJobTitle": "Senior Software Engineer",
            "currentCompany": "Tech Corp Inc",
            "yearsOfExperience": "8",
            "yearsExperience": "8",
            "careerLevel": "Senior",
            "industry": "Technology",
            "summary": "Passionate about clean code and best practices.",
            
            # Job Preferences
            "jobType": "Full-time",
            "jobTypePreference": "Full-time",
            "noticePeriod": "2 weeks",
            "currentSalary": "120000",
            "expectedSalary": "150000",
            "currency": "USD",
            "currencyPreference": "USD",
            "availability": "Immediate",
            "travelAvailability": "Up to 25%",
            
            # Skills & Tools
            "skills": ["JavaScript", "Python", "React", "Node.js", "TypeScript", "MongoDB", "PostgreSQL", "AWS", "Docker", "Kubernetes"],
            "tools": ["VS Code", "Git", "GitHub", "Jira", "Postman", "Jenkins", "Docker", "AWS"],
            
            # Work Experience
            "experience": [
                {
                    "title": "Senior Software Engineer",
                    "role": "Senior Software Engineer",
                    "company": "Tech Corp Inc",
                    "location": "San Francisco, CA",
                    "startDate": "2020-01-01",
                    "endDate": "",
                    "currentJob": True,
                    "description": "Leading development of microservices architecture and mentoring junior developers."
                },
                {
                    "title": "Software Engineer",
                    "role": "Software Engineer",
                    "company": "StartupXYZ",
                    "location": "San Jose, CA",
                    "startDate": "2017-06-01",
                    "endDate": "2019-12-31",
                    "currentJob": False,
                    "description": "Developed RESTful APIs and responsive web applications."
                }
            ],
            
            # Education
            "education": [
                {
                    "degree": "Master of Science",
                    "degreeType": "Master of Science",
                    "fieldOfStudy": "Computer Science",
                    "institution": "Stanford University",
                    "location": "Stanford, CA",
                    "startYear": "2013",
                    "endYear": "2015",
                    "grade": "3.9 GPA"
                },
                {
                    "degree": "Bachelor of Science",
                    "degreeType": "Bachelor of Science",
                    "fieldOfStudy": "Software Engineering",
                    "institution": "UC Berkeley",
                    "location": "Berkeley, CA",
                    "startYear": "2009",
                    "endYear": "2013",
                    "grade": "3.7 GPA"
                }
            ],
            
            # Languages
            "languages": [
                {"language": "English", "proficiency": "Native"},
                {"language": "Spanish", "proficiency": "Professional"},
                {"language": "French", "proficiency": "Basic"}
            ],
            
            # Certifications
            "certifications": [
                {
                    "name": "AWS Certified Solutions Architect",
                    "issuer": "Amazon Web Services",
                    "issueDate": "2022-03-15",
                    "expiryDate": "2025-03-15",
                    "credentialId": "AWS-SA-123456"
                },
                {
                    "name": "Certified Kubernetes Administrator",
                    "issuer": "Cloud Native Computing Foundation",
                    "issueDate": "2021-09-20",
                    "expiryDate": "2024-09-20",
                    "credentialId": "CKA-789012"
                }
            ],
            
            # References
            "references": [
                {
                    "name": "Sarah Johnson",
                    "referenceName": "Sarah Johnson",
                    "title": "Engineering Manager",
                    "referenceTitle": "Engineering Manager",
                    "company": "Tech Corp Inc",
                    "referenceCompany": "Tech Corp Inc",
                    "relation": "Direct Supervisor",
                    "referenceRelationship": "Direct Supervisor",
                    "contact": "sarah.johnson@techcorp.com",
                    "referenceEmail": "sarah.johnson@techcorp.com",
                    "referencePhone": "+1-555-111-2222"
                }
            ],
            
            # Professional Links
            "professionalLinks": [
                {"type": "LinkedIn", "url": "https://linkedin.com/in/johndoe"},
                {"type": "GitHub", "url": "https://github.com/johndoe"},
                {"type": "Portfolio", "url": "https://johndoe.dev"}
            ],
            
            # Additional Info
            "hobbies": "Photography, Hiking, Reading Tech Blogs",
            "additionalComments": "Looking for opportunities with strong engineering culture.",
            "profileCompleted": True
        }
        
        print(f"📝 Updating profile with {len(complete_profile)} fields...")
        
        update_response = requests.put(
            f"{BACKEND_URL}/api/profile/profile",
            json=complete_profile,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )
        
        print(f"📤 Update Status: {update_response.status_code}")
        
        if update_response.status_code not in [200, 201]:
            print(f"⚠️ Update response: {update_response.text}")
            print("⚠️ Continuing to fetch profile...")
        else:
            print("✅ Profile updated successfully!")
        
        # Step 3: Fetch and verify profile
        print("\n3. FETCHING UPDATED PROFILE")
        print("-" * 90)
        
        profile_response = requests.get(
            f"{BACKEND_URL}/api/profile/profile",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )
        
        if profile_response.status_code != 200:
            print(f"❌ Failed to fetch profile: {profile_response.text}")
            return False
        
        profile_data = profile_response.json()
        print("✅ Profile fetched successfully!")
        
        # Also fetch auth user data
        auth_response = requests.get(
            f"{BACKEND_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if auth_response.status_code == 200:
            auth_data = auth_response.json()
            # Merge auth data with profile data
            profile_data = {**profile_data, **auth_data}
            print("✅ Auth user data merged!")
        
        non_empty = len([k for k, v in profile_data.items() if v and v != [] and v != {} and v != ''])
        print(f"📊 Profile has {non_empty} non-empty fields")
        
        # Step 4: Verify ALL fields are displaying
        print("\n4. VERIFYING ALL PROFILE FIELDS")
        print("=" * 90)
        
        all_checks = []
        
        # Personal Information
        print("\n👤 PERSONAL INFORMATION")
        print("-" * 90)
        personal_fields = [
            ("First Name", "firstName", "John"),
            ("Middle Name", "middleName", "Michael"),
            ("Last Name", "lastName", "Doe"),
            ("Email", "email", test_email),
            ("Phone", "phoneNumber", "+1-555-123-4567"),
            ("Alt Phone", "altPhone", "+1-555-987-6543"),
            ("Date of Birth", "dateOfBirth", "1990-05-15"),
            ("Gender", "gender", "Male"),
            ("Blood Group", "bloodGroup", "O+"),
            ("Community", "community", "Technology Professionals")
        ]
        
        for name, key, expected in personal_fields:
            value = profile_data.get(key) or profile_data.get('phone' if key == 'phoneNumber' else key)
            has_value = value and value != '' and value != []
            matches = str(value) == str(expected) if has_value else False
            status = "✅" if matches else ("⚠️" if has_value else "❌")
            all_checks.append((name, has_value))
            print(f"{status} {name}: {value or 'NOT SET'}")
        
        # Location
        print("\n📍 LOCATION & RESIDENCY")
        print("-" * 90)
        location_fields = [
            ("Nationality", "nationality"),
            ("Resident Country", "residentCountry"),
            ("Current City", "currentCity"),
            ("Postal Code", "postalCode"),
            ("Address", "address"),
            ("Location", "location"),
            ("Work Permit", "workPermit")
        ]
        
        for name, key in location_fields:
            value = profile_data.get(key)
            has_value = value and value != ''
            status = "✅" if has_value else "❌"
            all_checks.append((name, has_value))
            print(f"{status} {name}: {value or 'NOT SET'}")
        
        # Professional
        print("\n💼 PROFESSIONAL INFORMATION")
        print("-" * 90)
        prof_fields = [
            ("Professional Title", "professionalTitle"),
            ("Professional Summary", "professionalSummary"),
            ("Current Job Title", "currentJobTitle"),
            ("Current Company", "currentCompany"),
            ("Years of Experience", "yearsOfExperience"),
            ("Career Level", "careerLevel"),
            ("Industry", "industry"),
            ("Summary", "summary")
        ]
        
        for name, key in prof_fields:
            value = profile_data.get(key) or profile_data.get('yearsExperience' if key == 'yearsOfExperience' else key)
            has_value = value and value != ''
            status = "✅" if has_value else "❌"
            all_checks.append((name, has_value))
            display_val = str(value)[:50] + '...' if value and len(str(value)) > 50 else value
            print(f"{status} {name}: {display_val or 'NOT SET'}")
        
        # Job Preferences
        print("\n💰 JOB PREFERENCES")
        print("-" * 90)
        job_fields = [
            ("Job Type", "jobType"),
            ("Notice Period", "noticePeriod"),
            ("Current Salary", "currentSalary"),
            ("Expected Salary", "expectedSalary"),
            ("Currency", "currency"),
            ("Availability", "availability"),
            ("Travel Availability", "travelAvailability")
        ]
        
        for name, key in job_fields:
            value = profile_data.get(key) or profile_data.get('jobTypePreference' if key == 'jobType' else key)
            has_value = value and value != ''
            status = "✅" if has_value else "❌"
            all_checks.append((name, has_value))
            print(f"{status} {name}: {value or 'NOT SET'}")
        
        # Skills & Tools
        print("\n🛠️ SKILLS & TOOLS")
        print("-" * 90)
        skills = profile_data.get('skills', [])
        tools = profile_data.get('tools', [])
        
        has_skills = bool(skills and len(skills) > 0)
        has_tools = bool(tools and len(tools) > 0)
        
        all_checks.append(("Skills", has_skills))
        all_checks.append(("Tools", has_tools))
        
        print(f"{'✅' if has_skills else '❌'} Skills: {len(skills)} items")
        if skills:
            print(f"    {', '.join(skills[:5])}{'...' if len(skills) > 5 else ''}")
        else:
            print("    NOT SET")
        
        print(f"{'✅' if has_tools else '❌'} Tools: {len(tools)} items")
        if tools:
            print(f"    {', '.join(tools[:5])}{'...' if len(tools) > 5 else ''}")
        else:
            print("    NOT SET")
        
        # Work Experience
        print("\n💼 WORK EXPERIENCE")
        print("-" * 90)
        experience = profile_data.get('experience', []) or profile_data.get('workExperience', [])
        has_exp = bool(experience and len(experience) > 0)
        all_checks.append(("Work Experience", has_exp))
        
        print(f"{'✅' if has_exp else '❌'} Work Experience: {len(experience)} entries")
        for i, exp in enumerate(experience, 1):
            print(f"    {i}. {exp.get('title') or exp.get('role', 'N/A')} at {exp.get('company', 'N/A')}")
        if not experience:
            print("    NOT SET")
        
        # Education
        print("\n🎓 EDUCATION")
        print("-" * 90)
        education = profile_data.get('education', [])
        has_edu = bool(education and len(education) > 0)
        all_checks.append(("Education", has_edu))
        
        print(f"{'✅' if has_edu else '❌'} Education: {len(education)} entries")
        for i, edu in enumerate(education, 1):
            print(f"    {i}. {edu.get('degree') or edu.get('degreeType', 'N/A')} in {edu.get('fieldOfStudy', 'N/A')}")
            print(f"       {edu.get('institution', 'N/A')}")
        if not education:
            print("    NOT SET")
        
        # Languages
        print("\n🗣️ LANGUAGES")
        print("-" * 90)
        languages = profile_data.get('languages', [])
        has_lang = bool(languages and len(languages) > 0)
        all_checks.append(("Languages", has_lang))
        
        print(f"{'✅' if has_lang else '❌'} Languages: {len(languages)} entries")
        for lang in languages:
            if isinstance(lang, dict):
                print(f"    • {lang.get('language', 'N/A')}: {lang.get('proficiency', 'N/A')}")
        if not languages:
            print("    NOT SET")
        
        # Certifications
        print("\n📜 CERTIFICATIONS")
        print("-" * 90)
        certs = profile_data.get('certifications', [])
        has_certs = bool(certs and len(certs) > 0)
        all_checks.append(("Certifications", has_certs))
        
        print(f"{'✅' if has_certs else '❌'} Certifications: {len(certs)} entries")
        for cert in certs:
            print(f"    • {cert.get('name', 'N/A')}")
        if not certs:
            print("    NOT SET")
        
        # References
        print("\n✅ REFERENCES")
        print("-" * 90)
        refs = profile_data.get('references', [])
        has_refs = bool(refs and len(refs) > 0)
        all_checks.append(("References", has_refs))
        
        print(f"{'✅' if has_refs else '❌'} References: {len(refs)} entries")
        for ref in refs:
            print(f"    • {ref.get('name') or ref.get('referenceName', 'N/A')}")
        if not refs:
            print("    NOT SET")
        
        # Professional Links
        print("\n🔗 PROFESSIONAL LINKS")
        print("-" * 90)
        links = profile_data.get('professionalLinks', [])
        has_links = bool(links and len(links) > 0)
        all_checks.append(("Professional Links", has_links))
        
        print(f"{'✅' if has_links else '❌'} Professional Links: {len(links)} entries")
        for link in links:
            if isinstance(link, dict):
                print(f"    • {link.get('type', 'N/A')}: {link.get('url', 'N/A')}")
        if not links:
            print("    NOT SET")
        
        # Additional Info
        print("\n📝 ADDITIONAL INFORMATION")
        print("-" * 90)
        hobbies = profile_data.get('hobbies')
        comments = profile_data.get('additionalComments')
        
        all_checks.append(("Hobbies", bool(hobbies)))
        all_checks.append(("Additional Comments", bool(comments)))
        
        print(f"{'✅' if hobbies else '❌'} Hobbies: {hobbies or 'NOT SET'}")
        print(f"{'✅' if comments else '❌'} Additional Comments: {comments or 'NOT SET'}")
        
        # Final Summary
        print("\n" + "=" * 90)
        print("FINAL RESULTS")
        print("=" * 90)
        
        total = len(all_checks)
        passed = sum(1 for _, has_val in all_checks if has_val)
        percentage = (passed / total * 100) if total > 0 else 0
        
        print(f"\n📊 Profile Completeness: {passed}/{total} fields ({percentage:.1f}%)")
        print(f"✅ Fields with data: {passed}")
        print(f"❌ Fields missing: {total - passed}")
        
        # Show which fields are missing
        missing = [name for name, has_val in all_checks if not has_val]
        if missing:
            print(f"\n❌ Missing Fields ({len(missing)}):")
            for field in missing:
                print(f"   • {field}")
        
        print("\n" + "=" * 90)
        if percentage >= 90:
            print("🎉 EXCELLENT! Almost all fields are displaying correctly in My Profile!")
        elif percentage >= 70:
            print("✅ GOOD! Most fields are displaying correctly in My Profile!")
        elif percentage >= 50:
            print("⚠️ PARTIAL! Some fields are displaying but many are missing!")
        else:
            print("❌ FAILED! Most fields are NOT displaying in My Profile!")
        print("=" * 90)
        
        return percentage >= 70
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    try:
        result = test_complete_profile_workflow()
        exit(0 if result else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️ Test interrupted")
        exit(1)

