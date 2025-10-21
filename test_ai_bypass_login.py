#!/usr/bin/env python3
"""
Test AI prediction system by bypassing login issues
"""

import sys
import os
sys.path.append('backend')

from services.ai_prediction_service import prediction_service
from services.application_tracking_service import ApplicationTrackingService
from services.auth_service import AuthService, get_user_by_id_or_email
from services.job_service import get_job_by_id
from utils.db import get_db
from bson import ObjectId

def test_ai_prediction_system():
    """Test the complete AI prediction system"""
    try:
        print("=" * 60)
        print("[AI] AI-Powered Application Tracker Test")
        print("=" * 60)
        
        # Get user ID (hardcoded from our database test)
        user_id = "689da98a2c13a4802661382c"
        print(f"Testing with user ID: {user_id}")
        
        # Get applications
        print("\n=== Getting Applications ===")
        applications = ApplicationTrackingService.get_job_seeker_applications(user_id)
        print(f"[OK] Found {len(applications)} applications")
        
        if not applications:
            print("[ERROR] No applications found")
            return
        
        # Get user profile
        print("\n=== Getting User Profile ===")
        user_profile = get_user_by_id_or_email(user_id=user_id)
        if not user_profile:
            print("[ERROR] User profile not found")
            return
        print(f"[OK] User profile found: {user_profile.get('firstName', '')} {user_profile.get('lastName', '')}")
        
        # Test predictions for each application
        print("\n=== AI Predictions ===")
        # Handle the case where applications might be nested lists or contain non-dict items
        flat_applications = []
        for app in applications:
            if isinstance(app, list):
                flat_applications.extend([a for a in app if isinstance(a, dict)])
            elif isinstance(app, dict):
                flat_applications.append(app)
        
        for i, app in enumerate(flat_applications[:3]):  # Test first 3 applications
            print(f"\nApplication {i+1}: {app.get('job_title', 'Unknown')} at {app.get('company_name', 'Unknown')}")
            
            # Get job data
            job_id = app['job_id']
            job = get_job_by_id(job_id)
            
            if not job:
                print(f"  [ERROR] Job not found for ID: {job_id}")
                continue
            
            print(f"  [OK] Job found: {job.get('job_title', 'Unknown')}")
            
            # Make prediction
            probability = prediction_service.predict_success_probability(app, job, user_profile)
            explanation = prediction_service.get_prediction_explanation(app, job, user_profile)
            
            print(f"  Success Probability: {probability:.1%}")
            print(f"  Confidence Level: {'High' if probability > 0.7 or probability < 0.3 else 'Medium'}")
            print(f"  Explanation: {explanation[:2]}")  # Show first 2 explanations
        
        # Test AI insights
        print("\n=== AI Insights ===")
        db = get_db()
        applications_data = list(db.applications.find({'applicant_id': ObjectId(user_id)}))
        
        if applications_data:
            # Analyze patterns
            insights = []
            
            # Success rate by company size
            company_sizes = {}
            for app in applications_data:
                company = app.get('company_name', '').lower()
                status = app.get('status', '').lower()
                
                # Determine company size
                if any(indicator in company for indicator in ['corp', 'corporation', 'inc', 'ltd']):
                    size = 'large'
                elif any(indicator in company for indicator in ['startup', 'labs', 'studio']):
                    size = 'startup'
                else:
                    size = 'medium'
                
                if size not in company_sizes:
                    company_sizes[size] = {'total': 0, 'successful': 0}
                
                company_sizes[size]['total'] += 1
                if status in ['interview', 'hired', 'shortlisted']:
                    company_sizes[size]['successful'] += 1
            
            for size, data in company_sizes.items():
                if data['total'] > 0:
                    success_rate = (data['successful'] / data['total']) * 100
                    insights.append({
                        'type': 'company_size_success',
                        'category': size.title(),
                        'success_rate': round(success_rate, 1),
                        'total_applications': data['total'],
                        'message': f"Your success rate with {size} companies is {success_rate:.1f}%"
                    })
            
            print(f"[OK] Generated {len(insights)} insights")
            for insight in insights:
                print(f"  - {insight['message']}")
        
        print("\n" + "=" * 60)
        print("[SUCCESS] AI Prediction System Test Complete!")
        print("=" * 60)
        
    except Exception as e:
        print(f"[ERROR] Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_ai_prediction_system()
