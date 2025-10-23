from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime
from utils.db import get_db
from services.application_service import get_match_score

application_bp = Blueprint('application', __name__)

@application_bp.route('/test-email', methods=['POST'])
def test_email():
    """Test email functionality"""
    try:
        from services.email_service import get_email_service
        
        data = request.get_json()
        if not data or 'email' not in data:
            return jsonify({'error': 'Email address is required'}), 400
        
        email_service = get_email_service()
        
        # Send test email
        success = email_service.send_application_status_notification(
            applicant_email=data['email'],
            applicant_name=data.get('name', 'Test User'),
            job_title=data.get('job_title', 'Software Engineer'),
            company_name=data.get('company_name', 'Test Company'),
            status='reviewed'
        )
        
        if success:
            return jsonify({'message': 'Test email sent successfully'}), 200
        else:
            return jsonify({'error': 'Failed to send test email'}), 500
            
    except Exception as e:
        print(f"Error in test_email: {e}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@application_bp.route('/test-db', methods=['GET'])
def test_db_connection():
    """Test database connection"""
    try:
        print(f"🧪 Testing database connection...")
        db = get_db()
        if db is None:
            print(f"❌ Database connection failed")
            return jsonify({'error': 'Database connection failed'}), 500
        
        print(f"✅ Database connected: {db.name}")
        
        # Test job lookup
        job_id = "68b5508d79f0d1a0d21d345b"
        job_object_id = ObjectId(job_id)
        job = db.jobs.find_one({'_id': job_object_id})
        
        if job:
            print(f"✅ Job found: {job.get('job_title', 'N/A')}")
            return jsonify({
                'status': 'success',
                'database': db.name,
                'job_found': True,
                'job_title': job.get('job_title', 'N/A')
            }), 200
        else:
            print(f"❌ Job not found")
            return jsonify({
                'status': 'error',
                'database': db.name,
                'job_found': False
            }), 404
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({'error': str(e)}), 500

@application_bp.route('/apply', methods=['POST'])
@jwt_required()
def apply_for_job():
    """Apply for a job"""
    try:
        print(f"🚀 Application endpoint called")
        print(f"📋 Request method: {request.method}")
        print(f"📋 Request headers: {dict(request.headers)}")
        
        db = get_db()
        if db is None:
            print(f"❌ Database connection failed")
            return jsonify({'error': 'Database connection failed'}), 500
        
        current_user_id = get_jwt_identity()
        print(f"👤 Current user ID: {current_user_id}")
        
        data = request.get_json()
        print(f"📝 Request data: {data}")
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        job_id = data.get('job_id')
        cover_letter = data.get('cover_letter', '')
        
        if not job_id:
            return jsonify({'error': 'Job ID is required'}), 400
        
        # Validate ObjectId format
        try:
            job_object_id = ObjectId(job_id)
        except Exception as e:
            print(f"Invalid ObjectId format: {job_id}, error: {e}")
            return jsonify({'error': 'Invalid job ID format'}), 400
        
        # Validate job exists
        print(f"🔍 Looking for job with ID: {job_object_id}")
        job = db.jobs.find_one({'_id': job_object_id})
        print(f"🔍 Job lookup result: {job}")
        if not job:
            print(f"❌ Job not found in database")
            return jsonify({'error': 'Job not found'}), 404
        
        # Check if user already applied
        existing_application = db.applications.find_one({
            'job_id': job_object_id,
            'applicant_id': ObjectId(current_user_id)
        })
        
        if existing_application:
            return jsonify({'error': 'You have already applied for this job'}), 400
        
        # Get user details
        user = db.users.find_one({'_id': ObjectId(current_user_id)})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # PROMOCODE SYSTEM TEMPORARILY DEACTIVATED
        # Check if user has free applications or is premium
        # user_type = user.get('userType', '')
        # if user_type == 'job_seeker':
        #     # Check for free applications
        #     free_applications = user.get('free_applications', 0)
        #     subscription_plan = user.get('subscription', {}).get('plan', 'Basic')
        #     
        #     if free_applications <= 0 and subscription_plan == 'Basic':
        #         return jsonify({
        #             'error': 'No free applications remaining',
        #             'message': 'Use a promo code to get free applications or upgrade to premium!',
        #             'requires_promo': True
        #         }), 402  # Payment Required
        
        # Try to calculate match score, but don't require it
        print(f"🔍 Attempting to calculate match score for application...")
        final_score = 0
        education_score = 0
        skill_score = 0
        experience_score = 0
        skills_match = 0
        education_match = 0
        experience_match = 0
        
        try:
            from services.application_service import get_match_score
            match_result = get_match_score(current_user_id, job_id)
            
            if "error" in match_result:
                print(f"⚠️ Match score calculation failed (resume not required): {match_result['error']}")
                print(f"✅ Proceeding with application without match score")
            else:
                print(f"✅ Match score calculated successfully: {match_result.get('final_score', 0)}")
                final_score = match_result.get('final_score', 0)
                education_score = match_result.get('education_score', 0)
                skill_score = match_result.get('skill_score', 0)
                experience_score = match_result.get('experience_score', 0)
                skills_match = match_result.get('skills_match', 0)
                education_match = match_result.get('education_match', 0)
                experience_match = match_result.get('experience_match', 0)
        except Exception as e:
            print(f"⚠️ Error calculating match score (resume not required): {e}")
            print(f"✅ Proceeding with application without match score")

        # Create application with calculated match scores
        application = {
            'jobId': str(job_object_id),  # Use jobId for consistency with analytics
            'userId': str(current_user_id),  # Use userId for consistency with analytics
            'job_id': job_object_id,  # Keep for backward compatibility
            'applicant_id': ObjectId(current_user_id),  # Keep for backward compatibility
            'applicant_name': f"{user.get('firstName', '')} {user.get('lastName', '')}",
            'candidate_name': f"{user.get('firstName', '')} {user.get('lastName', '')}",  # Add for analytics
            'applicant_email': user.get('email', ''),
            'cover_letter': cover_letter,
            'status': 'pending',
            'applied_at': datetime.now().isoformat(),
            'created_at': datetime.now(),  # Add for analytics
            'job_title': job.get('job_title', ''),
            'company_name': job.get('company_name', ''),
            'location': job.get('location', 'N/A'),  # Add location
            'job_type': job.get('job_type', 'N/A'),  # Add job type
            'salary_range': job.get('salary_range', 'N/A'),  # Add salary range
            # Match score fields
            'matchScore': final_score,
            'final_score': final_score,
            'education_score': education_score,
            'skill_score': skill_score,
            'experience_score': experience_score,
            'skills_match': skills_match,
            'education_match': education_match,
            'experience_match': experience_match,
            'resume_skills': user.get('skills', []),  # Add skills for analytics
            'resume_path': user.get('resumePath', '')  # Add resume path for analytics
        }
        
        # Insert application
        result = db.applications.insert_one(application)
        
        if result.inserted_id:
            # PROMOCODE SYSTEM TEMPORARILY DEACTIVATED
            # Consume free application credit if user is job seeker
            # if user_type == 'job_seeker':
            #     free_applications = user.get('free_applications', 0)
            #     subscription_plan = user.get('subscription', {}).get('plan', 'Basic')
            #     
            #     if free_applications > 0 and subscription_plan == 'Basic':
            #         # Consume one free application
            #         db.users.update_one(
            #             {'_id': ObjectId(current_user_id)},
            #             {'$inc': {'free_applications': -1}}
            #         )
            #         print(f"✅ Consumed free application credit for user {current_user_id}")
            
            # Update job applicants count
            db.jobs.update_one(
                {'_id': job_object_id},
                {'$push': {'applicants': ObjectId(current_user_id)}}
            )
            
            # Send application submitted notification
            from services.application_tracking_service import get_tracking_service
            tracking_service = get_tracking_service()
            tracking_service.send_application_submitted_notification(current_user_id, job_id)
            
            return jsonify({
                'message': 'Application submitted successfully',
                'application_id': str(result.inserted_id)
            }), 201
        else:
            return jsonify({'error': 'Failed to submit application'}), 500
            
    except Exception as e:
        print(f"Error in apply_for_job: {e}")
        print(f"Request data: {data}")
        print(f"Current user ID: {current_user_id}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@application_bp.route('/my-applications', methods=['GET'])
@jwt_required()
def get_my_applications():
    """Get applications for the current user"""
    try:
        print(f"🔍 get_my_applications called")
        db = get_db()
        if db is None:
            print(f"❌ Database connection failed")
            return jsonify({'error': 'Database connection failed'}), 500
        
        current_user_id = get_jwt_identity()
        print(f"👤 Current user ID: {current_user_id}")
        
        # Validate ObjectId format
        try:
            user_object_id = ObjectId(current_user_id)
            print(f"✅ User ObjectId: {user_object_id}")
        except Exception as e:
            print(f"❌ Invalid user ID format: {current_user_id}, error: {e}")
            return jsonify({'error': 'Invalid user ID format'}), 400
        
        # Get user's applications with all available data
        print(f"🔍 Searching for applications with applicant_id: {user_object_id}")
        applications = list(db.applications.find({'applicant_id': user_object_id}))
        
        print(f"📊 Found {len(applications)} applications")
        
        # Convert ObjectId to string and ensure all required fields exist
        for app in applications:
            # Convert all ObjectId fields to strings
            for key, value in app.items():
                if isinstance(value, ObjectId):
                    app[key] = str(value)
            
            # Ensure _id is always a string
            app['_id'] = str(app['_id'])
            
            # Convert job_id if it exists
            if 'job_id' in app and app['job_id']:
                app['job_id'] = str(app['job_id'])
            
            # Convert applicant_id if it exists
            if 'applicant_id' in app and app['applicant_id']:
                app['applicant_id'] = str(app['applicant_id'])
            
            # Ensure all required fields exist with default values
            app['job_title'] = app.get('job_title', 'Unknown Job')
            app['company_name'] = app.get('company_name', 'Unknown Company')
            app['status'] = app.get('status', 'applied')
            app['applied_at'] = app.get('applied_at', app.get('created_at', ''))
            app['location'] = app.get('location', 'N/A')
            app['job_type'] = app.get('job_type', 'N/A')
            app['salary_range'] = app.get('salary_range', 'N/A')
            
            # Match score fields with defaults
            app['final_score'] = app.get('final_score', app.get('matchScore', 0))
            app['education_score'] = app.get('education_score', 0)
            app['skill_score'] = app.get('skill_score', 0)
            app['experience_score'] = app.get('experience_score', 0)
            app['skills_match'] = app.get('skills_match', 0)
            app['education_match'] = app.get('education_match', 0)
            app['experience_match'] = app.get('experience_match', 0)
            app['gemini_match_score'] = app.get('gemini_match_score', 0)
            app['matchScore'] = app.get('matchScore', 0)
            app['createdAt'] = app.get('createdAt', app.get('created_at', ''))
            
            # Convert datetime objects to strings
            for key, value in app.items():
                if hasattr(value, 'isoformat'):  # datetime objects
                    app[key] = value.isoformat()
        
        print(f"✅ Returning {len(applications)} applications")
        return jsonify(applications), 200
        
    except Exception as e:
        print(f"❌ Error in get_my_applications: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@application_bp.route('/update_status', methods=['PUT'])
@jwt_required()
def update_status():
    """Update application status (recruiter only) - Frontend compatible endpoint"""
    try:
        print(f"🔧 Update status endpoint called")
        print(f"📋 Request method: {request.method}")
        print(f"📋 Request headers: {dict(request.headers)}")
        
        db = get_db()
        if db is None:
            print(f"❌ Database connection failed")
            return jsonify({'error': 'Database connection failed'}), 500
        
        current_user_id = get_jwt_identity()
        print(f"👤 Current user ID: {current_user_id}")
        
        data = request.get_json()
        print(f"📝 Request data: {data}")
        
        if not data:
            print(f"❌ No data provided")
            return jsonify({'error': 'No data provided'}), 400
        
        user_id = data.get('userId')
        job_id = data.get('jobId')
        status = data.get('status')
        interview_date = data.get('interviewDate')
        interview_mode = data.get('interviewMode')
        
        print(f"📊 Extracted data:")
        print(f"   user_id: {user_id}")
        print(f"   job_id: {job_id}")
        print(f"   status: {status}")
        print(f"   interview_date: {interview_date}")
        print(f"   interview_mode: {interview_mode}")
        
        if not all([user_id, job_id, status]):
            print(f"❌ Missing required fields: user_id={user_id}, job_id={job_id}, status={status}")
            return jsonify({'error': 'userId, jobId, and status are required'}), 400
        
        # Validate status
        valid_statuses = ['pending', 'reviewed', 'shortlisted', 'interview_scheduled', 'accepted', 'rejected']
        if status not in valid_statuses:
            print(f"❌ Invalid status: {status}. Valid statuses: {valid_statuses}")
            return jsonify({'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}), 400
        
        # Validate ObjectId format
        try:
            user_object_id = ObjectId(user_id)
            job_object_id = ObjectId(job_id)
            print(f"✅ ObjectId validation passed: user_id={user_object_id}, job_id={job_object_id}")
        except Exception as e:
            print(f"❌ Invalid ObjectId format: user_id={user_id}, job_id={job_id}, error={e}")
            return jsonify({'error': f'Invalid ID format: {str(e)}'}), 400
        
        # Find the application
        print(f"🔍 Looking for application with user_id={user_object_id}, job_id={job_object_id}")
        application = db.applications.find_one({
            'applicant_id': user_object_id,
            'job_id': job_object_id
        })
        print(f"🔍 Application found: {application is not None}")
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        # Check if user is the recruiter for this job
        job = db.jobs.find_one({'_id': application['job_id']})
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        if str(job.get('recruiter_id')) != current_user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Prepare update data
        update_data = {
            'status': status,
            'updated_at': datetime.now().isoformat()
        }
        
        # Add interview details if provided
        if status == 'interview_scheduled':
            if interview_date:
                update_data['interview_date'] = interview_date
            if interview_mode:
                update_data['interview_mode'] = interview_mode
        
        # Update status
        result = db.applications.update_one(
            {'applicant_id': ObjectId(user_id), 'job_id': ObjectId(job_id)},
            {'$set': update_data}
        )
        
        if result.modified_count > 0:
            # Send email notification to applicant
            try:
                from services.email_service import get_email_service
                email_service = get_email_service()
                
                # Get applicant details
                applicant = db.users.find_one({'_id': ObjectId(user_id)})
                if applicant:
                    email_sent = email_service.send_application_status_notification(
                        applicant_email=applicant.get('email', ''),
                        applicant_name=f"{applicant.get('firstName', '')} {applicant.get('lastName', '')}".strip(),
                        job_title=job.get('job_title', ''),
                        company_name=job.get('company_name', ''),
                        status=status,
                        interview_date=interview_date,
                        interview_mode=interview_mode
                    )
                    
                    if email_sent:
                        print(f"✅ Email notification sent to {applicant.get('email')} for status update: {status}")
                    else:
                        print(f"❌ Failed to send email notification to {applicant.get('email')}")
                else:
                    print(f"❌ Applicant not found for user {user_id}")
            except Exception as e:
                print(f"❌ Error sending email notification: {e}")
            
            return jsonify({
                'message': f'Application status updated to "{status}" successfully',
                'status': status,
                'timestamp': datetime.now().isoformat()
            }), 200
        else:
            return jsonify({'error': 'Failed to update application status'}), 500
            
    except Exception as e:
        print(f"Error in update_status: {e}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@application_bp.route('/job/<job_id>', methods=['GET'])
@jwt_required()
def get_job_applications(job_id):
    """Get all applications for a specific job (recruiter only)"""
    try:
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        current_user_id = get_jwt_identity()
        
        # Check if user is the recruiter for this job
        job = db.jobs.find_one({'_id': ObjectId(job_id)})
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        if str(job.get('recruiter_id')) != current_user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Get applications for this job
        applications = list(db.applications.find(
            {'job_id': ObjectId(job_id)},
            {'_id': 1, 'applicant_name': 1, 'applicant_email': 1, 'status': 1, 'applied_at': 1, 'cover_letter': 1}
        ))
        
        # Convert ObjectId to string
        for app in applications:
            app['_id'] = str(app['_id'])
        
        return jsonify(applications), 200
        
    except Exception as e:
        print(f"Error in get_job_applications: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@application_bp.route('/<application_id>/status', methods=['PUT'])
@jwt_required()
def update_application_status(application_id):
    """Update application status (recruiter only)"""
    try:
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'status' not in data:
            return jsonify({'error': 'Status is required'}), 400
        
        new_status = data['status']
        valid_statuses = ['pending', 'reviewed', 'shortlisted', 'interview_scheduled', 'accepted', 'rejected']
        
        if new_status not in valid_statuses:
            return jsonify({'error': 'Invalid status'}), 400
        
        # Get application
        application = db.applications.find_one({'_id': ObjectId(application_id)})
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        # Check if user is the recruiter for this job
        job = db.jobs.find_one({'_id': application['job_id']})
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        if str(job.get('recruiter_id')) != current_user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Prepare update data
        update_data = {
            'status': new_status,
            'updated_at': datetime.now().isoformat()
        }
        
        # Add interview details if provided
        if new_status == 'interview_scheduled':
            if 'interview_date' in data:
                update_data['interview_date'] = data['interview_date']
            if 'interview_mode' in data:
                update_data['interview_mode'] = data['interview_mode']
        
        # Update status
        result = db.applications.update_one(
            {'_id': ObjectId(application_id)},
            {'$set': update_data}
        )
        
        if result.modified_count > 0:
            # Send email notification to applicant
            try:
                from services.email_service import get_email_service
                email_service = get_email_service()
                
                # Get applicant details
                applicant = db.users.find_one({'_id': application['applicant_id']})
                if applicant:
                    email_sent = email_service.send_application_status_notification(
                        applicant_email=applicant.get('email', ''),
                        applicant_name=f"{applicant.get('firstName', '')} {applicant.get('lastName', '')}".strip(),
                        job_title=job.get('job_title', ''),
                        company_name=job.get('company_name', ''),
                        status=new_status,
                        interview_date=data.get('interview_date'),
                        interview_mode=data.get('interview_mode')
                    )
                    
                    if email_sent:
                        print(f"✅ Email notification sent to {applicant.get('email')} for status update: {new_status}")
                    else:
                        print(f"❌ Failed to send email notification to {applicant.get('email')}")
                else:
                    print(f"❌ Applicant not found for application {application_id}")
                    
            except Exception as e:
                print(f"❌ Error sending email notification: {str(e)}")
                # Don't fail the status update if email fails
            
            return jsonify({'message': 'Application status updated successfully'}), 200
        else:
            return jsonify({'error': 'Failed to update status'}), 500
            
    except Exception as e:
        print(f"Error in update_application_status: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@application_bp.route('/get_applications', methods=['GET'])
@jwt_required()
def get_applications():
    """Get all applications for a specific job (recruiter only)"""
    try:
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        current_user_id = get_jwt_identity()
        job_id = request.args.get('jobId')
        
        if not job_id:
            return jsonify({'error': 'Job ID is required'}), 400
        
        # Validate job exists and user is the recruiter
        job = db.jobs.find_one({'_id': ObjectId(job_id)})
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        if str(job.get('recruiter_id')) != current_user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Get all applications for this job
        applications = list(db.applications.find({'job_id': ObjectId(job_id)}))
        
        # Convert ObjectIds to strings for JSON serialization
        for app in applications:
            app['_id'] = str(app['_id'])
            app['job_id'] = str(app['job_id'])
            app['applicant_id'] = str(app['applicant_id'])
        
        return jsonify({'applications': applications}), 200
        
    except Exception as e:
        print(f"Error in get_applications: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@application_bp.route('/all', methods=['GET'])
def get_all_applications():
    """Get all applications with user and job details (for testing purposes)"""
    try:
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Get all applications
        applications = list(db.applications.find({}))
        
        # Enrich applications with user and job details
        enriched_applications = []
        for app in applications:
            # Convert ObjectIds to strings
            app['_id'] = str(app['_id'])
            if 'job_id' in app:
                app['job_id'] = str(app['job_id'])
            if 'applicant_id' in app:
                app['applicant_id'] = str(app['applicant_id'])
            
            # Get user details
            if 'applicant_id' in app:
                try:
                    user = db.users.find_one({'_id': ObjectId(app['applicant_id'])})
                    if user:
                        app['applicant_name'] = user.get('fullName', 'Unknown')
                        app['applicant_email'] = user.get('email', 'Unknown')
                        app['applicant_phone'] = user.get('phone', 'Unknown')
                        app['applicant_location'] = user.get('location', {})
                except:
                    app['applicant_name'] = 'Unknown'
                    app['applicant_email'] = 'Unknown'
            
            # Get job details
            if 'job_id' in app:
                try:
                    job = db.jobs.find_one({'_id': ObjectId(app['job_id'])})
                    if job:
                        app['job_title'] = job.get('job_title', 'Unknown')
                        app['company_name'] = job.get('company_name', 'Unknown')
                        app['job_location'] = job.get('location', 'Unknown')
                except:
                    app['job_title'] = 'Unknown'
                    app['company_name'] = 'Unknown'
            
            enriched_applications.append(app)
        
        return jsonify({
            'applications': enriched_applications,
            'count': len(enriched_applications)
        }), 200
        
    except Exception as e:
        print(f"Error in get_all_applications: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@application_bp.route('/recruiter/all', methods=['GET'])
@jwt_required()
def get_recruiter_applications():
    """Get all applications for all jobs posted by a recruiter"""
    try:
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        current_user_id = get_jwt_identity()
        print(f"🔍 Getting applications for recruiter: {current_user_id}")
        
        # Get all jobs posted by this recruiter
        recruiter_jobs = list(db.jobs.find({'recruiter_id': current_user_id}))
        print(f"📋 Found {len(recruiter_jobs)} jobs for recruiter")
        
        if not recruiter_jobs:
            return jsonify({'applications': []}), 200
        
        # Get job IDs
        job_ids = [job['_id'] for job in recruiter_jobs]
        
        # Get all applications for these jobs
        applications = list(db.applications.find({'job_id': {'$in': job_ids}}))
        print(f"👥 Found {len(applications)} applications")
        
        # Enrich applications with job details
        enriched_applications = []
        for app in applications:
            # Find the corresponding job
            job = next((j for j in recruiter_jobs if j['_id'] == app['job_id']), None)
            if job:
                enriched_app = {
                    '_id': str(app['_id']),
                    'job_id': str(app['job_id']),
                    'applicant_id': str(app['applicant_id']),
                    'applicant_name': app.get('applicant_name', 'Unknown'),
                    'applicant_email': app.get('applicant_email', ''),
                    'status': app.get('status', 'pending'),
                    'applied_at': app.get('applied_at', ''),
                    'cover_letter': app.get('cover_letter', ''),
                    'job_title': job.get('job_title', 'Unknown Job'),
                    'company_name': job.get('company_name', 'Unknown Company'),
                    'location': job.get('location', ''),
                    'job_type': job.get('job_type', ''),
                    'salary_range': job.get('salary_range', ''),
                    'experience_required': job.get('experience_required', ''),
                    'education_required': job.get('education_required', ''),
                    'description': job.get('description', ''),
                    'required_skills': job.get('required_skills', ''),
                    'responsibilities': job.get('responsibilities', ''),
                    'benefits': job.get('benefits', ''),
                    'company_culture': job.get('company_culture', ''),
                    'application_deadline': job.get('application_deadline', ''),
                    'application_process': job.get('application_process', ''),
                    'additional_requirements': job.get('additional_requirements', ''),
                    'views': job.get('views', 0),
                    'created_at': job.get('created_at', '')
                }
                enriched_applications.append(enriched_app)
        
        print(f"✅ Returning {len(enriched_applications)} enriched applications")
        return jsonify({'applications': enriched_applications}), 200
        
    except Exception as e:
        print(f"❌ Error in get_recruiter_applications: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@application_bp.route('/update_status', methods=['PUT'])
@jwt_required()
def update_application_status_bulk():
    """Update application status for a specific user and job (recruiter only)"""
    try:
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        user_id = data.get('userId')
        job_id = data.get('jobId')
        status = data.get('status')
        interview_date = data.get('interviewDate')
        interview_mode = data.get('interviewMode')
        
        if not all([user_id, job_id, status]):
            return jsonify({'error': 'userId, jobId, and status are required'}), 400
        
        valid_statuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted']
        if status not in valid_statuses:
            return jsonify({'error': 'Invalid status'}), 400
        
        # Validate job exists and user is the recruiter
        job = db.jobs.find_one({'_id': ObjectId(job_id)})
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        if str(job.get('recruiter_id')) != current_user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Update application status
        update_data = {'status': status, 'updated_at': datetime.now().isoformat()}
        if interview_date:
            update_data['interview_date'] = interview_date
        if interview_mode:
            update_data['interview_mode'] = interview_mode
        
        result = db.applications.update_one(
            {
                'job_id': ObjectId(job_id),
                'applicant_id': ObjectId(user_id)
            },
            {'$set': update_data}
        )
        
        if result.modified_count > 0:
            return jsonify({'message': 'Application status updated successfully'}), 200
        else:
            return jsonify({'error': 'Application not found or no changes made'}), 404
        
    except Exception as e:
        print(f"Error in update_application_status_bulk: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@application_bp.route('/<application_id>', methods=['DELETE'])
@jwt_required()
def withdraw_application(application_id):
    """Withdraw an application (applicant only)"""
    try:
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        current_user_id = get_jwt_identity()
        
        # Get application
        application = db.applications.find_one({'_id': ObjectId(application_id)})
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        # Check if user is the applicant
        if str(application['applicant_id']) != current_user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Delete application
        result = db.applications.delete_one({'_id': ObjectId(application_id)})
        
        if result.deleted_count > 0:
            # Remove applicant from job applicants list
            db.jobs.update_one(
                {'_id': application['job_id']},
                {'$pull': {'applicants': ObjectId(current_user_id)}}
            )
            
            return jsonify({'message': 'Application withdrawn successfully'}), 200
        else:
            return jsonify({'error': 'Failed to withdraw application'}), 500
            
    except Exception as e:
        print(f"Error in withdraw_application: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@application_bp.route('/match-score/<job_id>', methods=['GET'])
@jwt_required()
def get_job_match_score(job_id):
    """Get match score for a specific job without applying"""
    try:
        current_user_id = get_jwt_identity()
        print(f"🎯 Getting match score for user {current_user_id} and job {job_id}")
        
        # Validate job_id format
        try:
            from bson import ObjectId
            ObjectId(job_id)
        except Exception as e:
            print(f"❌ Invalid job_id format: {job_id}, error: {e}")
            return jsonify({'error': 'Invalid job ID format'}), 400
        
        # Call the service function to get match score
        print(f"📞 Calling get_match_score service function...")
        result = get_match_score(current_user_id, job_id)
        print(f"📊 get_match_score result: {result}")
        
        if "error" in result:
            print(f"⚠️ Match score calculation returned error: {result}")
            return jsonify(result), 404
        
        print(f"✅ Match score calculated successfully")
        return jsonify({
            'message': 'Match score calculated successfully',
            'match_data': result
        }), 200
        
    except Exception as e:
        print(f"❌ Error in get_job_match_score: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@application_bp.route('/recruiter/interviews', methods=['GET'])
@jwt_required()
def get_scheduled_interviews():
    """Get all scheduled interviews for recruiter"""
    try:
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        current_user_id = get_jwt_identity()
        print(f"🔍 Getting scheduled interviews for recruiter: {current_user_id}")
        
        # Get all jobs posted by this recruiter
        recruiter_jobs = list(db.jobs.find({'recruiter_id': current_user_id}))
        print(f"📋 Found {len(recruiter_jobs)} jobs for recruiter")
        
        if not recruiter_jobs:
            return jsonify({'interviews': []}), 200
        
        # Get job IDs
        job_ids = [job['_id'] for job in recruiter_jobs]
        
        # Get all applications with scheduled interviews
        applications = list(db.applications.find({
            'job_id': {'$in': job_ids},
            'interview_date': {'$exists': True, '$ne': None}
        }))
        print(f"👥 Found {len(applications)} scheduled interviews")
        
        # Enrich with applicant and job details
        enriched_interviews = []
        for app in applications:
            # Find the corresponding job
            job = next((j for j in recruiter_jobs if j['_id'] == app['job_id']), None)
            
            # Get applicant details
            applicant = db.users.find_one({'_id': app['applicant_id']})
            
            if job and applicant:
                interview = {
                    '_id': str(app['_id']),
                    'job_id': str(app['job_id']),
                    'applicant_id': str(app['applicant_id']),
                    'applicant_name': f"{applicant.get('firstName', '')} {applicant.get('lastName', '')}".strip() or applicant.get('email', 'Unknown'),
                    'applicant_email': applicant.get('email', ''),
                    'applicant_phone': applicant.get('phone', ''),
                    'job_title': job.get('job_title', 'Unknown Job'),
                    'company_name': job.get('company_name', 'Unknown Company'),
                    'interview_date': app.get('interview_date', ''),
                    'interview_time': app.get('interview_time', ''),
                    'interview_mode': app.get('interview_mode', 'online'),
                    'interview_link': app.get('interview_link', ''),
                    'interview_location': app.get('interview_location', ''),
                    'interview_notes': app.get('interview_notes', ''),
                    'status': app.get('status', 'interview_scheduled'),
                    'created_at': app.get('created_at', ''),
                    'updated_at': app.get('updated_at', '')
                }
                enriched_interviews.append(interview)
        
        # Sort by interview date
        enriched_interviews.sort(key=lambda x: x.get('interview_date', ''), reverse=False)
        
        print(f"✅ Returning {len(enriched_interviews)} scheduled interviews")
        return jsonify({'interviews': enriched_interviews, 'count': len(enriched_interviews)}), 200
        
    except Exception as e:
        print(f"❌ Error in get_scheduled_interviews: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@application_bp.route('/schedule-interview', methods=['POST'])
@jwt_required()
def schedule_interview():
    """Schedule an interview for an application"""
    try:
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        applicant_id = data.get('applicant_id')
        job_id = data.get('job_id')
        interview_date = data.get('interview_date')
        interview_time = data.get('interview_time')
        interview_mode = data.get('interview_mode', 'online')
        interview_link = data.get('interview_link', '')
        interview_location = data.get('interview_location', '')
        interview_notes = data.get('interview_notes', '')
        
        if not all([applicant_id, job_id, interview_date]):
            return jsonify({'error': 'applicant_id, job_id, and interview_date are required'}), 400
        
        # Verify recruiter owns the job
        job = db.jobs.find_one({'_id': ObjectId(job_id)})
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        if str(job.get('recruiter_id')) != current_user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Update application with interview details
        update_data = {
            'status': 'interview_scheduled',
            'interview_date': interview_date,
            'interview_time': interview_time,
            'interview_mode': interview_mode,
            'interview_link': interview_link,
            'interview_location': interview_location,
            'interview_notes': interview_notes,
            'updated_at': datetime.now().isoformat()
        }
        
        result = db.applications.update_one(
            {'applicant_id': ObjectId(applicant_id), 'job_id': ObjectId(job_id)},
            {'$set': update_data}
        )
        
        if result.modified_count > 0:
            # Send notification email to applicant
            try:
                from services.email_service import get_email_service
                email_service = get_email_service()
                
                applicant = db.users.find_one({'_id': ObjectId(applicant_id)})
                if applicant:
                    email_service.send_application_status_notification(
                        applicant_email=applicant.get('email'),
                        applicant_name=f"{applicant.get('firstName', '')} {applicant.get('lastName', '')}".strip(),
                        job_title=job.get('job_title'),
                        company_name=job.get('company_name'),
                        status='interview_scheduled'
                    )
            except Exception as email_error:
                print(f"⚠️ Failed to send email notification: {email_error}")
            
            return jsonify({'message': 'Interview scheduled successfully'}), 200
        else:
            return jsonify({'error': 'Failed to schedule interview'}), 500
        
    except Exception as e:
        print(f"❌ Error in schedule_interview: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500
