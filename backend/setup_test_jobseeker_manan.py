from datetime import datetime, timedelta
from bson import ObjectId
from utils.db import get_db
import bcrypt

"""
Seed script: Creates a real job seeker 'Manan Patel' with realistic data
- User (job_seeker)
- Comprehensive jobseeker profile
- 3 sample jobs
- 2 applications
- Notifications (3)
- Messages (a short conversation)

Run:
  cd backend
  python setup_test_jobseeker_manan.py
"""

def upsert_user(db):
    users = db.users
    email = 'manan.patel@example.com'
    existing = users.find_one({'email': email})
    if existing:
        return existing
    password_hash = bcrypt.hashpw('Test@1234'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user = {
        'firstName': 'Manan',
        'lastName': 'Patel',
        'email': email,
        'phone': '+254712300001',
        'userType': 'job_seeker',
        'password': password_hash,
        'profileCompleted': True,
        'created_at': datetime.utcnow()
    }
    res = users.insert_one(user)
    user['_id'] = res.inserted_id
    return user


def upsert_profile(db, user_id):
    profiles = db.jobseeker_profiles
    obj_id = ObjectId(user_id)
    profile = profiles.find_one({'userId': obj_id})
    if profile:
        return profile
    profile_doc = {
        'userId': obj_id,
        'personalInfo': {
            'firstName': 'Manan',
            'lastName': 'Patel',
            'email': 'manan.patel@example.com',
            'phone': '+254712300001',
            'dateOfBirth': '1996-04-12'
        },
        'nationalityResidency': {
            'nationality': 'Kenyan',
            'residentCountry': 'Kenya',
            'currentCity': 'Nairobi'
        },
        'preferredLocations': {
            'preferredLocation1': 'Nairobi',
            'workLocation': 'Hybrid',
            'willingToRelocate': True
        },
        'professionalProfile': {
            'professionalTitle': 'Full Stack Developer',
            'yearsExperience': '3-5',
            'careerLevel': 'Mid-Level',
            'industry': 'Information Technology',
            'summary': 'Full stack developer specializing in React, Node.js, and MongoDB.'
        },
        'skills': {
            'technicalSkills': ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Docker'],
            'softSkills': ['Teamwork', 'Problem Solving', 'Communication']
        },
        'education': [
            {
                'institution': 'University of Nairobi',
                'degree': 'BSc Computer Science',
                'yearCompleted': 2019
            }
        ],
        'experience': [
            {
                'company': 'TechCorp Solutions',
                'title': 'Software Developer',
                'startDate': '2021-01-01',
                'endDate': None,
                'current': True,
                'description': 'Built scalable web apps using MERN stack.'
            }
        ],
        'created_at': datetime.utcnow()
    }
    profiles.update_one({'userId': obj_id}, {'$set': profile_doc}, upsert=True)
    return profile_doc


def create_jobs(db):
    jobs = db.jobs
    titles = [
        ('Full Stack Developer', 'TechCorp'),
        ('Frontend Engineer', 'WebTech'),
        ('Backend Developer', 'DataWorks')
    ]
    created_ids = []
    for title, company in titles:
        doc = {
            'job_title': title,
            'company_name': company,
            'location': 'Nairobi, Kenya',
            'job_type': 'Full-time',
            'salary_range': 'KES 150,000 - 250,000 per month',
            'experience_required': '3-5 years',
            'required_skills': 'JavaScript, React, Node.js, MongoDB',
            'responsibilities': 'Build and maintain web applications',
            'benefits': 'Health insurance, PTO',
            'created_at': datetime.utcnow(),
            'recruiter_id': 'seed_recruiter'
        }
        res = jobs.insert_one(doc)
        created_ids.append(res.inserted_id)
    return created_ids


def create_applications(db, user_id, job_ids):
    applications = db.applications
    user_obj = ObjectId(user_id)
    now = datetime.utcnow()
    docs = [
        {
            'jobId': str(job_ids[0]),
            'userId': str(user_id),
            'job_id': job_ids[0],
            'applicant_id': user_obj,
            'applicant_name': 'Manan Patel',
            'applicant_email': 'manan.patel@example.com',
            'status': 'pending',
            'applied_at': now.isoformat(),
            'created_at': now,
            'job_title': 'Full Stack Developer',
            'company_name': 'TechCorp',
            'location': 'Nairobi, Kenya',
            'job_type': 'Full-time',
            'salary_range': 'KES 150,000 - 250,000 per month',
            'final_score': 78.5,
            'skill_score': 80,
            'education_score': 75,
            'experience_score': 78
        },
        {
            'jobId': str(job_ids[1]),
            'userId': str(user_id),
            'job_id': job_ids[1],
            'applicant_id': user_obj,
            'applicant_name': 'Manan Patel',
            'applicant_email': 'manan.patel@example.com',
            'status': 'reviewing',
            'applied_at': (now - timedelta(days=3)).isoformat(),
            'created_at': now - timedelta(days=3),
            'job_title': 'Frontend Engineer',
            'company_name': 'WebTech',
            'location': 'Nairobi, Kenya',
            'job_type': 'Full-time',
            'salary_range': 'KES 180,000 - 230,000 per month',
            'final_score': 82.0,
            'skill_score': 85,
            'education_score': 75,
            'experience_score': 80
        }
    ]
    for d in docs:
        if not applications.find_one({'job_id': d['job_id'], 'applicant_id': user_obj}):
            applications.insert_one(d)


def create_notifications(db, user_id):
    notifications = db.notifications
    now = datetime.utcnow()
    docs = [
        {'user_id': str(user_id), 'type': 'application', 'title': 'Application Viewed', 'message': 'Recruiter viewed your application for Full Stack Developer.', 'is_read': False, 'created_at': now},
        {'user_id': str(user_id), 'type': 'interview', 'title': 'Interview Scheduled', 'message': 'Interview scheduled for Frontend Engineer on Friday 2:00 PM.', 'is_read': False, 'created_at': now - timedelta(days=1)},
        {'user_id': str(user_id), 'type': 'system', 'title': 'Welcome', 'message': 'Welcome to AksharJobs, Manan!', 'is_read': True, 'created_at': now - timedelta(days=5)}
    ]
    for d in docs:
        notifications.insert_one(d)


def create_messages(db, user_id):
    messages = db.messages
    recruiter_id = 'recruiter_demo'
    now = datetime.utcnow()
    thread = [
        {'sender_id': recruiter_id, 'recipient_id': str(user_id), 'content': 'Hi Manan, thanks for applying!', 'is_read': False, 'created_at': now - timedelta(days=1)},
        {'sender_id': str(user_id), 'recipient_id': recruiter_id, 'content': 'Thank you! Looking forward to the process.', 'is_read': True, 'created_at': now - timedelta(hours=20)}
    ]
    for m in thread:
        messages.insert_one(m)


def main():
    db = get_db()
    assert db is not None, 'Database connection failed'
    user = upsert_user(db)
    upsert_profile(db, user['_id'])
    job_ids = create_jobs(db)
    create_applications(db, user['_id'], job_ids)
    create_notifications(db, user['_id'])
    create_messages(db, user['_id'])
    print('✅ Seeded data for Manan Patel (job seeker) successfully')
    print(f"User ID: {user['_id']}")
    print('Credentials: email=manan.patel@example.com, password=Test@1234')

if __name__ == '__main__':
    main()
