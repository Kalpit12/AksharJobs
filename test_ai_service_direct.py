#!/usr/bin/env python3
"""
Direct test of AI prediction service
"""

import sys
import os
sys.path.append('backend')

from services.ai_prediction_service import prediction_service
from bson import ObjectId

# Sample application data (from our test)
application_data = {
    '_id': '68d0ff7fb48a11fb2f3e3331',
    'applicant_email': 'test@example.com',
    'applicant_id': '689da98a2c13a4802661382c',
    'applicant_name': 'Test User',
    'applied_at': '2025-09-22T10:49:19.965424',
    'candidate_name': 'Test User',
    'company_name': 'TechCorp Solutions',
    'cover_letter': 'I am interested in this position and would like to be considered.',
    'created_at': 'Mon, 22 Sep 2025 10:49:19 GMT',
    'education_match': None,
    'education_score': 90,
    'experience_match': None,
    'experience_score': 80,
    'final_score': 85,
    'jobId': '68b01ac13bc6c3bf44308ef2',
    'job_id': '68b01ac13bc6c3bf44308ef2',
    'job_title': 'Data Scientist',
    'job_type': 'Full-time',
    'location': 'San Francisco, CA',
    'matchScore': 85,
    'progress_percentage': 14,
    'resume_path': '',
    'resume_skills': [],
    'salary_range': '$120,000 - $150,000 per year',
    'skill_score': 85,
    'skills_match': None,
    'status': 'pending',
    'status_display': 'Pending',
    'tracking_history': [],
    'userId': '689da98a2c13a4802661382c'
}

# Sample job data (from our test)
job_data = {
    '_id': '68b01ac13bc6c3bf44308ef2',
    'job_title': 'Data Scientist',
    'company_name': 'TechCorp Solutions',
    'description': 'We are seeking a talented Data Scientist to join our growing team at TechCorp Solutions. You will work on cutting-edge projects, develop machine learning models, and help drive data-driven decision making across the organization.',
    'required_skills': ['Python (Pandas, NumPy, Scikit-learn, TensorFlow/PyTorch)', 'SQL and database management', 'Machine Learning algorithms and techniques', 'Statistical analysis and hypothesis testing', 'Data visualization (Matplotlib, Seaborn, Plotly)', 'Big Data technologies (Spark, Hadoop)', 'Git version control', 'Cloud platforms (AWS, Azure, or GCP)', 'Deep Learning frameworks', 'Natural Language Processing (NLP)'],
    'experience_required': '3-5 years',
    'education_required': "Master's in Data Science, Computer Science, or related field",
    'location': 'San Francisco, CA',
    'job_type': 'Full-time',
    'salary_range': '$120,000 - $150,000 per year'
}

# Sample user profile (from our test)
user_profile = {
    'email': 'test@example.com',
    'firstName': 'Test',
    'lastName': 'User',
    'role': 'jobSeeker',
    'profileCompleted': True
}

try:
    print("Testing AI prediction service directly...")
    
    # Test feature extraction
    print("\n=== Testing Feature Extraction ===")
    features = prediction_service.extract_features_from_application(application_data, job_data, user_profile)
    print(f"Features extracted: {features}")
    
    # Test prediction
    print("\n=== Testing Prediction ===")
    probability = prediction_service.predict_success_probability(application_data, job_data, user_profile)
    print(f"Success probability: {probability}")
    
    # Test explanation
    print("\n=== Testing Explanation ===")
    explanation = prediction_service.get_prediction_explanation(application_data, job_data, user_profile)
    print(f"Explanation: {explanation}")
    
    print("\n[SUCCESS] AI prediction service is working!")
    
except Exception as e:
    print(f"[ERROR] AI prediction service failed: {e}")
    import traceback
    traceback.print_exc()
