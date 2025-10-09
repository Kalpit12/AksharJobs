from utils.db import get_db
from datetime import datetime, timedelta
from services.websocket_service import send_notification_to_user, send_notification_count_update
import json

class NotificationService:
    
    @staticmethod
    def create_notification(user_id, notification_type, title, message, data=None):
        """
        Create a new notification for a user
        
        Args:
            user_id (str): ID of the user to notify
            notification_type (str): Type of notification (job, message, application, system, etc.)
            title (str): Notification title
            message (str): Notification message
            data (dict): Additional data for the notification
            
        Returns:
            dict: Created notification data or error
        """
        try:
            db = get_db()
            if db is None:
                return {'success': False, 'error': 'Database connection failed'}
            
            notifications = db["notifications"]
            
            # Create notification document
            notification = {
                "user_id": user_id,
                "type": notification_type,
                "title": title,
                "message": message,
                "is_read": False,
                "created_at": datetime.utcnow(),
                "data": data or {}
            }
            
            # Insert notification
            result = notifications.insert_one(notification)
            
            if result.inserted_id:
                # Convert ObjectId to string
                notification['_id'] = str(result.inserted_id)
                notification['id'] = str(result.inserted_id)
                notification['created_at'] = notification['created_at'].isoformat()
                
                # Send real-time update
                send_notification_to_user(user_id, notification)
                
                # Update notification count
                NotificationService.update_notification_count(user_id)
                
                return {
                    'success': True,
                    'notification': notification
                }
            else:
                return {'success': False, 'error': 'Failed to create notification'}
                
        except Exception as e:
            print(f"Error creating notification: {e}")
            return {'success': False, 'error': str(e)}
    
    @staticmethod
    def create_job_notification(user_id, job_title, company_name, action="posted"):
        """Create a job-related notification"""
        title = f"New Job {action.title()}"
        message = f"A new job '{job_title}' at {company_name} has been {action}"
        
        return NotificationService.create_notification(
            user_id=user_id,
            notification_type="job",
            title=title,
            message=message,
            data={
                "job_title": job_title,
                "company_name": company_name,
                "action": action
            }
        )
    
    @staticmethod
    def create_application_notification(user_id, job_title, company_name, status):
        """Create an application status notification"""
        status_messages = {
            "submitted": "Your application has been submitted",
            "reviewed": "Your application is being reviewed",
            "shortlisted": "Congratulations! You've been shortlisted",
            "rejected": "Unfortunately, your application was not selected",
            "accepted": "Congratulations! You've been accepted for the position"
        }
        
        title = f"Application Update - {job_title}"
        message = f"{status_messages.get(status, 'Your application status has been updated')} at {company_name}"
        
        return NotificationService.create_notification(
            user_id=user_id,
            notification_type="application",
            title=title,
            message=message,
            data={
                "job_title": job_title,
                "company_name": company_name,
                "status": status
            }
        )
    
    @staticmethod
    def create_message_notification(user_id, sender_name, message_preview):
        """Create a message notification"""
        title = f"New Message from {sender_name}"
        message = message_preview[:100] + "..." if len(message_preview) > 100 else message_preview
        
        return NotificationService.create_notification(
            user_id=user_id,
            notification_type="message",
            title=title,
            message=message,
            data={
                "sender_name": sender_name,
                "message_preview": message_preview
            }
        )
    
    @staticmethod
    def create_system_notification(user_id, title, message, data=None):
        """Create a system notification"""
        return NotificationService.create_notification(
            user_id=user_id,
            notification_type="system",
            title=title,
            message=message,
            data=data or {}
        )
    
    @staticmethod
    def update_notification_count(user_id):
        """Update notification count for a user"""
        try:
            db = get_db()
            if db is None:
                return
            
            notifications = db["notifications"]
            
            # Count unread notifications
            unread_count = notifications.count_documents({
                "user_id": user_id,
                "is_read": False
            })
            
            # Send real-time update
            send_notification_count_update(user_id, unread_count)
            
        except Exception as e:
            print(f"Error updating notification count: {e}")
    
    @staticmethod
    def mark_notification_read(user_id, notification_id):
        """Mark a notification as read"""
        try:
            db = get_db()
            if db is None:
                return {'success': False, 'error': 'Database connection failed'}
            
            notifications = db["notifications"]
            
            # Update notification
            result = notifications.update_one(
                {
                    "_id": ObjectId(notification_id),
                    "user_id": user_id
                },
                {
                    "$set": {
                        "is_read": True,
                        "read_at": datetime.utcnow()
                    }
                }
            )
            
            if result.matched_count > 0:
                # Update notification count
                NotificationService.update_notification_count(user_id)
                return {'success': True}
            else:
                return {'success': False, 'error': 'Notification not found'}
                
        except Exception as e:
            print(f"Error marking notification as read: {e}")
            return {'success': False, 'error': str(e)}
    
    @staticmethod
    def get_user_notifications(user_id, limit=50):
        """Get notifications for a user"""
        try:
            db = get_db()
            if db is None:
                return {'success': False, 'error': 'Database connection failed'}
            
            notifications = db["notifications"]
            
            # Get notifications for the user
            user_notifications = list(notifications.find(
                {"user_id": user_id}
            ).sort("created_at", -1).limit(limit))
            
            # Convert ObjectId to string
            for notification in user_notifications:
                notification['_id'] = str(notification['_id'])
                notification['id'] = str(notification['_id'])
                if 'created_at' in notification:
                    notification['created_at'] = notification['created_at'].isoformat()
                if 'read_at' in notification:
                    notification['read_at'] = notification['read_at'].isoformat()
            
            return {
                'success': True,
                'notifications': user_notifications
            }
            
        except Exception as e:
            print(f"Error getting user notifications: {e}")
            return {'success': False, 'error': str(e)}
    
    @staticmethod
    def cleanup_old_notifications(days=30):
        """Clean up old notifications"""
        try:
            db = get_db()
            if db is None:
                return {'success': False, 'error': 'Database connection failed'}
            
            notifications = db["notifications"]
            
            # Calculate cutoff date
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            # Delete old notifications
            result = notifications.delete_many({
                "created_at": {"$lt": cutoff_date},
                "is_read": True
            })
            
            print(f"Cleaned up {result.deleted_count} old notifications")
            return {'success': True, 'deleted_count': result.deleted_count}
            
        except Exception as e:
            print(f"Error cleaning up notifications: {e}")
            return {'success': False, 'error': str(e)}