from models.application_model import ApplicationModel
from services.email_notification_service import get_email_service
from utils.db import get_db
from bson import ObjectId
from datetime import datetime

class ApplicationTrackingService:
    """Service for managing application tracking and status updates"""
    
    # Define application status progression
    STATUS_PROGRESSION = [
        'pending',
        'ai_screening', 
        'reviewing',
        'shortlisted',
        'interview',
        'hired',
        'rejected'
    ]
    
    @staticmethod
    def update_application_status(user_id, job_id, new_status, notes=None, interview_date=None, interview_mode=None):
        """Update application status and send notifications"""
        try:
            # Validate status
            if new_status not in ApplicationTrackingService.STATUS_PROGRESSION:
                return {"error": f"Invalid status. Must be one of: {', '.join(ApplicationTrackingService.STATUS_PROGRESSION)}"}, 400
            
            # Get current application details
            db = get_db()
            application = db.applications.find_one({
                'applicant_id': ObjectId(user_id),
                'job_id': ObjectId(job_id)
            })
            
            if not application:
                return {"error": "Application not found"}, 404
            
            # Get user details for email
            user = db.users.find_one({'_id': ObjectId(user_id)})
            if not user:
                return {"error": "User not found"}, 404
            
            # Update application status in the correct collection
            db = get_db()
            update_data = {"$set": {"status": new_status, "last_updated": datetime.now().isoformat()}}
            if interview_date:
                update_data["$set"]["interview_date"] = interview_date
            if interview_mode:
                update_data["$set"]["interview_mode"] = interview_mode
            if notes:
                update_data["$set"]["notes"] = notes

            result = db.applications.update_one(
                {"applicant_id": ObjectId(user_id), "job_id": ObjectId(job_id)},
                update_data,
            )
            
            success = result.modified_count > 0
            
            # Create tracking record
            if success:
                tracking_record = {
                    "userId": user_id,
                    "jobId": job_id,
                    "status": new_status,
                    "notes": notes,
                    "timestamp": datetime.now().isoformat(),
                    "created_at": datetime.now()
                }
                db.application_tracking.insert_one(tracking_record)
            
            if not success:
                return {"error": "Failed to update application status"}, 500
            
            # Send email notification
            email_service = get_email_service()
            recipient_name = f"{user.get('firstName', '')} {user.get('lastName', '')}"
            recipient_email = user.get('email', '')
            job_title = application.get('job_title', '')
            company_name = application.get('company_name', '')
            
            # Send appropriate email based on status
            if new_status == 'interview' and interview_date:
                email_service.send_interview_notification(
                    recipient_email, recipient_name, job_title, company_name, 
                    interview_date, interview_mode or 'TBD', notes
                )
            else:
                email_service.send_application_status_notification(
                    recipient_email, recipient_name, job_title, company_name, 
                    new_status, notes
                )
            
            return {
                "message": f"Application status updated to '{new_status}' successfully",
                "status": new_status,
                "timestamp": datetime.now().isoformat()
            }, 200
            
        except Exception as e:
            print(f"Error updating application status: {e}")
            return {"error": "Internal server error"}, 500
    
    @staticmethod
    def get_job_seeker_applications(user_id):
        """Get all applications for a job seeker with tracking history"""
        try:
            db = get_db()
            
            # Get applications from the correct collection (applications, not application)
            applications = list(db.applications.find({
                'applicant_id': ObjectId(user_id)
            }))
            
            # Convert ObjectIds to strings and add tracking data
            for app in applications:
                app['_id'] = str(app['_id'])
                app['job_id'] = str(app['job_id'])
                app['applicant_id'] = str(app['applicant_id'])
                
                # Add progress percentage based on status
                app['progress_percentage'] = ApplicationTrackingService._calculate_progress(app.get('status', 'pending'))
                app['status_display'] = app.get('status', 'pending').replace('_', ' ').title()
                
                # Get tracking history
                app['tracking_history'] = list(db.application_tracking.find({
                    'userId': user_id,
                    'jobId': app['job_id']
                }).sort('created_at', -1))
                
                # Convert tracking history ObjectIds
                for record in app['tracking_history']:
                    record['_id'] = str(record['_id'])
            
            return applications, 200
            
        except Exception as e:
            print(f"Error getting job seeker applications: {e}")
            return {"error": "Internal server error"}, 500
    
    @staticmethod
    def get_recruiter_candidates(recruiter_id):
        """Get all candidates for a recruiter with tracking history"""
        try:
            db = get_db()
            
            # First get all jobs posted by the recruiter
            jobs = list(db.jobs.find({"recruiter_id": ObjectId(recruiter_id)}))
            job_ids = [job['_id'] for job in jobs]
            
            # Get all applications for these jobs from the correct collection
            applications = list(db.applications.find({"job_id": {"$in": job_ids}}))
            
            # Add tracking history and job details
            for app in applications:
                app['_id'] = str(app['_id'])
                app['job_id'] = str(app['job_id'])
                app['applicant_id'] = str(app['applicant_id'])
                
                # Add progress percentage and status display
                app['progress_percentage'] = ApplicationTrackingService._calculate_progress(app.get('status', 'pending'))
                app['status_display'] = app.get('status', 'pending').replace('_', ' ').title()
                
                # Get tracking history
                app['tracking_history'] = list(db.application_tracking.find({
                    'userId': app['applicant_id'],
                    'jobId': app['job_id']
                }).sort('created_at', -1))
                
                # Convert tracking history ObjectIds
                for record in app['tracking_history']:
                    record['_id'] = str(record['_id'])
                
                # Add job details
                job = next((j for j in jobs if j['_id'] == ObjectId(app['job_id'])), None)
                if job:
                    app['job_title'] = job.get('job_title', '')
                    app['company_name'] = job.get('company_name', '')
            
            return applications, 200
            
        except Exception as e:
            print(f"Error getting recruiter candidates: {e}")
            return {"error": "Internal server error"}, 500
    
    @staticmethod
    def get_application_tracking_history(user_id, job_id):
        """Get detailed tracking history for a specific application"""
        try:
            tracking_history = ApplicationModel.get_tracking_history(user_id, job_id)
            
            # Convert ObjectIds to strings
            for record in tracking_history:
                record['_id'] = str(record['_id'])
                record['status_display'] = record.get('status', '').replace('_', ' ').title()
            
            return tracking_history, 200
            
        except Exception as e:
            print(f"Error getting tracking history: {e}")
            return {"error": "Internal server error"}, 500
    
    @staticmethod
    def get_application_statistics(user_id):
        """Get application statistics for a user"""
        try:
            db = get_db()
            
            # Get applications from the correct collection
            applications = list(db.applications.find({
                'applicant_id': ObjectId(user_id)
            }))
            
            stats = {
                'total_applications': len(applications),
                'pending': 0,
                'ai_screening': 0,
                'reviewing': 0,
                'shortlisted': 0,
                'interview': 0,
                'hired': 0,
                'rejected': 0,
                'average_match_score': 0
            }
            
            total_match_score = 0
            match_count = 0
            
            for app in applications:
                status = app.get('status', 'pending')
                if status in stats:
                    stats[status] += 1
                
                # Calculate average match score
                match_score = app.get('final_score', 0)
                if match_score > 0:
                    total_match_score += match_score
                    match_count += 1
            
            if match_count > 0:
                stats['average_match_score'] = round(total_match_score / match_count, 1)
            
            return stats, 200
            
        except Exception as e:
            print(f"Error getting application statistics: {e}")
            return {"error": "Internal server error"}, 500
    
    @staticmethod
    def _calculate_progress(status):
        """Calculate progress percentage based on status"""
        status_index = ApplicationTrackingService.STATUS_PROGRESSION.index(status) if status in ApplicationTrackingService.STATUS_PROGRESSION else 0
        total_steps = len(ApplicationTrackingService.STATUS_PROGRESSION)
        return round((status_index + 1) / total_steps * 100)
    
    @staticmethod
    def send_application_submitted_notification(user_id, job_id):
        """Send notification when application is first submitted"""
        try:
            db = get_db()
            
            # Get application and user details
            application = db.applications.find_one({
                'applicant_id': ObjectId(user_id),
                'job_id': ObjectId(job_id)
            })
            
            if not application:
                return False
            
            user = db.users.find_one({'_id': ObjectId(user_id)})
            if not user:
                return False
            
            # Send email notification
            email_service = get_email_service()
            recipient_name = f"{user.get('firstName', '')} {user.get('lastName', '')}"
            recipient_email = user.get('email', '')
            job_title = application.get('job_title', '')
            company_name = application.get('company_name', '')
            
            return email_service.send_application_submitted_notification(
                recipient_email, recipient_name, job_title, company_name
            )
            
        except Exception as e:
            print(f"Error sending application submitted notification: {e}")
            return False

# Global instance
tracking_service = ApplicationTrackingService()

def get_tracking_service():
    """Get the global tracking service instance"""
    return tracking_service
