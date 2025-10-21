from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.ai_prediction_service import prediction_service
from services.application_tracking_service import ApplicationTrackingService
from services.auth_service import AuthService
from services.job_service import get_job_by_id
from utils.db import get_db
from bson import ObjectId
import traceback

ai_prediction_bp = Blueprint('ai_prediction', __name__, url_prefix='/api/ai')

@ai_prediction_bp.route('/predict-success', methods=['POST'])
@jwt_required()
def predict_application_success():
    """Predict success probability for an application"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        application_id = data.get('application_id')
        if not application_id:
            return jsonify({'error': 'Application ID is required'}), 400
        
        # Get application data from database
        db = get_db()
        application = db.applications.find_one({
            '_id': ObjectId(application_id),
            'applicant_id': ObjectId(user_id)
        })
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        # Get job data
        job = get_job_by_id(application['job_id'])
        
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        # Get user profile
        user_profile = AuthService.get_user_by_id(user_id)
        
        if not user_profile:
            return jsonify({'error': 'User profile not found'}), 404
        
        # Make prediction
        success_probability = prediction_service.predict_success_probability(
            application, job, user_profile
        )
        
        # Get explanation
        explanation = prediction_service.get_prediction_explanation(
            application, job, user_profile
        )
        
        # Calculate confidence level
        confidence_level = "High" if success_probability > 0.7 or success_probability < 0.3 else "Medium"
        
        return jsonify({
            'success_probability': round(success_probability * 100, 1),
            'confidence_level': confidence_level,
            'explanation': explanation,
            'features': {
                'skills_match': round(application.get('skills_match_percentage', 0) * 100, 1),
                'experience_match': round(application.get('experience_level_match', 0) * 100, 1),
                'title_match': round(application.get('job_title_match_score', 0) * 100, 1)
            }
        })
        
    except Exception as e:
        print(f"Error predicting application success: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': 'Failed to predict application success'}), 500

@ai_prediction_bp.route('/predict-all-applications', methods=['GET'])
@jwt_required()
def predict_all_applications():
    """Get predictions for all user applications"""
    try:
        user_id = get_jwt_identity()
        
        # Get all applications
        applications = ApplicationTrackingService.get_job_seeker_applications(user_id)
        
        if not applications:
            return jsonify({'applications': []})
        
        # Get user profile
        user_profile = AuthService.get_user_by_id(user_id)
        
        if not user_profile:
            return jsonify({'error': 'User profile not found'}), 404
        
        predictions = []
        for app in applications:
            try:
                # Get job data
                job = get_job_by_id(app['job_id'])
                if not job:
                    continue
                
                # Make prediction
                success_probability = prediction_service.predict_success_probability(
                    app, job, user_profile
                )
                
                # Get explanation
                explanation = prediction_service.get_prediction_explanation(
                    app, job, user_profile
                )
                
                predictions.append({
                    'application_id': str(app['_id']),
                    'job_title': app.get('job_title', ''),
                    'company': app.get('company', ''),
                    'status': app.get('status', ''),
                    'success_probability': round(success_probability * 100, 1),
                    'confidence_level': "High" if success_probability > 0.7 or success_probability < 0.3 else "Medium",
                    'explanation': explanation[:3],  # Limit to top 3 explanations
                    'applied_date': app.get('appliedDate', '')
                })
                
            except Exception as e:
                print(f"Error predicting for application {app.get('_id')}: {str(e)}")
                continue
        
        # Sort by success probability (highest first)
        predictions.sort(key=lambda x: x['success_probability'], reverse=True)
        
        return jsonify({'applications': predictions})
        
    except Exception as e:
        print(f"Error predicting all applications: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': 'Failed to predict applications'}), 500

@ai_prediction_bp.route('/train-model', methods=['POST'])
@jwt_required()
def train_prediction_model():
    """Train the AI prediction model with historical data"""
    try:
        user_id = get_jwt_identity()
        
        # Check if user is admin (optional - you can remove this check)
        user = AuthService.get_user_by_id(user_id)
        if not user or user.get('role') != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        # Get all applications for training
        db = get_db()
        applications_collection = db['applications']
        jobs_collection = db['jobs']
        users_collection = db['users']
        
        # Get all applications with their job and user data
        applications_data = []
        applications = list(applications_collection.find({}))
        
        for app in applications:
            try:
                job = jobs_collection.find_one({'_id': app['job_id']})
                user = users_collection.find_one({'_id': app['user_id']})
                
                if job and user:
                    applications_data.append({
                        'application': app,
                        'job': job,
                        'user': user
                    })
            except Exception as e:
                print(f"Error processing application {app.get('_id')}: {str(e)}")
                continue
        
        # Train the model
        success = prediction_service.train_model(applications_data)
        
        if success:
            return jsonify({
                'message': 'Model trained successfully',
                'training_samples': len(applications_data)
            })
        else:
            return jsonify({'error': 'Failed to train model - insufficient data'}), 400
            
    except Exception as e:
        print(f"Error training model: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': 'Failed to train model'}), 500

@ai_prediction_bp.route('/model-status', methods=['GET'])
def get_model_status():
    """Get the status of the AI prediction model"""
    try:
        model_loaded = prediction_service.load_model()
        
        return jsonify({
            'model_loaded': model_loaded,
            'model_path': prediction_service.model_path,
            'feature_columns': prediction_service.feature_columns
        })
        
    except Exception as e:
        print(f"Error getting model status: {str(e)}")
        return jsonify({'error': 'Failed to get model status'}), 500

@ai_prediction_bp.route('/prediction-insights', methods=['GET'])
@jwt_required()
def get_prediction_insights():
    """Get insights about user's application patterns"""
    try:
        user_id = get_jwt_identity()
        
        # Get all applications
        applications = ApplicationTrackingService.get_job_seeker_applications(user_id)
        
        if not applications:
            return jsonify({'insights': []})
        
        # Analyze patterns
        insights = []
        
        # Success rate by company size
        company_sizes = {}
        for app in applications:
            company = app.get('company', '').lower()
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
        
        # Best application timing
        weekday_apps = {'monday': 0, 'tuesday': 0, 'wednesday': 0, 'thursday': 0, 'friday': 0}
        for app in applications:
            applied_date = app.get('appliedDate', '')
            if applied_date:
                try:
                    from datetime import datetime
                    date_obj = datetime.fromisoformat(applied_date)
                    weekday = date_obj.strftime('%A').lower()
                    if weekday in weekday_apps:
                        weekday_apps[weekday] += 1
                except:
                    continue
        
        best_day = max(weekday_apps, key=weekday_apps.get)
        if weekday_apps[best_day] > 0:
            insights.append({
                'type': 'best_application_day',
                'day': best_day.title(),
                'count': weekday_apps[best_day],
                'message': f"You've applied most frequently on {best_day.title()}s"
            })
        
        return jsonify({'insights': insights})
        
    except Exception as e:
        print(f"Error getting prediction insights: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': 'Failed to get insights'}), 500
