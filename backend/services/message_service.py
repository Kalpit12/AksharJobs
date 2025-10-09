from utils.db import get_db
from datetime import datetime, timedelta
from services.websocket_service import send_message_to_user, send_message_count_update
from bson import ObjectId
import json

class MessageService:
    
    @staticmethod
    def send_message(sender_id, recipient_id, content, message_type="text", metadata=None):
        """
        Send a message from one user to another
        
        Args:
            sender_id (str): ID of the sender
            recipient_id (str): ID of the recipient
            content (str): Message content
            message_type (str): Type of message (text, image, file, etc.)
            metadata (dict): Additional metadata
            
        Returns:
            dict: Created message data or error
        """
        try:
            db = get_db()
            if db is None:
                return {'success': False, 'error': 'Database connection failed'}
            
            messages = db["messages"]
            
            # Create message document
            message = {
                "sender_id": sender_id,
                "recipient_id": recipient_id,
                "content": content,
                "message_type": message_type,
                "is_read": False,
                "created_at": datetime.utcnow(),
                "metadata": metadata or {}
            }
            
            # Insert message
            result = messages.insert_one(message)
            
            if result.inserted_id:
                # Convert ObjectId to string
                message['_id'] = str(result.inserted_id)
                message['id'] = str(result.inserted_id)
                message['created_at'] = message['created_at'].isoformat()
                
                # Send real-time update to recipient
                send_message_to_user(recipient_id, message)
                
                # Update message count for recipient
                MessageService.update_message_count(recipient_id)
                
                return {
                    'success': True,
                    'message': message
                }
            else:
                return {'success': False, 'error': 'Failed to send message'}
                
        except Exception as e:
            print(f"Error sending message: {e}")
            return {'success': False, 'error': str(e)}
    
    @staticmethod
    def send_system_message(recipient_id, content, message_type="system", metadata=None):
        """Send a system message to a user"""
        return MessageService.send_message(
            sender_id="system",
            recipient_id=recipient_id,
            content=content,
            message_type=message_type,
            metadata=metadata
        )
    
    @staticmethod
    def send_job_application_message(recipient_id, job_title, company_name, action="applied"):
        """Send a job application related message"""
        content = f"You have {action} for the position '{job_title}' at {company_name}"
        
        return MessageService.send_system_message(
            recipient_id=recipient_id,
            content=content,
            message_type="job_application",
            metadata={
                "job_title": job_title,
                "company_name": company_name,
                "action": action
            }
        )
    
    @staticmethod
    def send_welcome_message(recipient_id, user_name):
        """Send a welcome message to a new user"""
        content = f"Welcome to AksharJobs, {user_name}! We're excited to help you find your dream job or the perfect candidate."
        
        return MessageService.send_system_message(
            recipient_id=recipient_id,
            content=content,
            message_type="welcome",
            metadata={
                "user_name": user_name
            }
        )
    
    @staticmethod
    def update_message_count(user_id):
        """Update message count for a user"""
        try:
            db = get_db()
            if db is None:
                return
            
            messages = db["messages"]
            
            # Count unread messages where user is recipient
            unread_count = messages.count_documents({
                "recipient_id": user_id,
                "is_read": False
            })
            
            # Send real-time update
            send_message_count_update(user_id, unread_count)
            
        except Exception as e:
            print(f"Error updating message count: {e}")
    
    @staticmethod
    def mark_message_read(user_id, message_id):
        """Mark a message as read"""
        try:
            db = get_db()
            if db is None:
                return {'success': False, 'error': 'Database connection failed'}
            
            messages = db["messages"]
            
            # Update message (only if user is the recipient)
            result = messages.update_one(
                {
                    "_id": ObjectId(message_id),
                    "recipient_id": user_id
                },
                {
                    "$set": {
                        "is_read": True,
                        "read_at": datetime.utcnow()
                    }
                }
            )
            
            if result.matched_count > 0:
                # Update message count
                MessageService.update_message_count(user_id)
                return {'success': True}
            else:
                return {'success': False, 'error': 'Message not found or not authorized'}
                
        except Exception as e:
            print(f"Error marking message as read: {e}")
            return {'success': False, 'error': str(e)}
    
    @staticmethod
    def get_user_messages(user_id, limit=50):
        """Get messages for a user"""
        try:
            db = get_db()
            if db is None:
                return {'success': False, 'error': 'Database connection failed'}
            
            messages = db["messages"]
            
            # Get messages where user is either sender or recipient
            user_messages = list(messages.find({
                "$or": [
                    {"sender_id": user_id},
                    {"recipient_id": user_id}
                ]
            }).sort("created_at", -1).limit(limit))
            
            # Convert ObjectId to string and format
            for message in user_messages:
                message['_id'] = str(message['_id'])
                message['id'] = str(message['_id'])
                if 'created_at' in message:
                    message['created_at'] = message['created_at'].isoformat()
                if 'read_at' in message:
                    message['read_at'] = message['read_at'].isoformat()
                
                # Add sender/recipient info
                message['is_sent'] = message['sender_id'] == user_id
                if message['sender_id'] == user_id:
                    message['other_user_id'] = message['recipient_id']
                else:
                    message['other_user_id'] = message['sender_id']
            
            return {
                'success': True,
                'messages': user_messages
            }
            
        except Exception as e:
            print(f"Error getting user messages: {e}")
            return {'success': False, 'error': str(e)}
    
    @staticmethod
    def get_conversation(user_id, other_user_id, limit=50):
        """Get conversation between two users"""
        try:
            db = get_db()
            if db is None:
                return {'success': False, 'error': 'Database connection failed'}
            
            messages = db["messages"]
            
            # Get conversation between two users
            conversation = list(messages.find({
                "$or": [
                    {
                        "sender_id": user_id,
                        "recipient_id": other_user_id
                    },
                    {
                        "sender_id": other_user_id,
                        "recipient_id": user_id
                    }
                ]
            }).sort("created_at", 1).limit(limit))  # Oldest first for conversation view
            
            # Convert ObjectId to string
            for message in conversation:
                message['_id'] = str(message['_id'])
                message['id'] = str(message['_id'])
                if 'created_at' in message:
                    message['created_at'] = message['created_at'].isoformat()
                if 'read_at' in message:
                    message['read_at'] = message['read_at'].isoformat()
                
                # Add sender/recipient info
                message['is_sent'] = message['sender_id'] == user_id
                message['other_user_id'] = other_user_id
            
            return {
                'success': True,
                'conversation': conversation
            }
            
        except Exception as e:
            print(f"Error getting conversation: {e}")
            return {'success': False, 'error': str(e)}
    
    @staticmethod
    def mark_conversation_read(user_id, other_user_id):
        """Mark all messages in a conversation as read"""
        try:
            db = get_db()
            if db is None:
                return {'success': False, 'error': 'Database connection failed'}
            
            messages = db["messages"]
            
            # Mark all unread messages from the other user as read
            result = messages.update_many(
                {
                    "sender_id": other_user_id,
                    "recipient_id": user_id,
                    "is_read": False
                },
                {
                    "$set": {
                        "is_read": True,
                        "read_at": datetime.utcnow()
                    }
                }
            )
            
            if result.modified_count > 0:
                # Update message count
                MessageService.update_message_count(user_id)
            
            return {
                'success': True,
                'modified_count': result.modified_count
            }
            
        except Exception as e:
            print(f"Error marking conversation as read: {e}")
            return {'success': False, 'error': str(e)}
    
    @staticmethod
    def cleanup_old_messages(days=90):
        """Clean up old messages"""
        try:
            db = get_db()
            if db is None:
                return {'success': False, 'error': 'Database connection failed'}
            
            messages = db["messages"]
            
            # Calculate cutoff date
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            # Delete old messages
            result = messages.delete_many({
                "created_at": {"$lt": cutoff_date},
                "is_read": True
            })
            
            print(f"Cleaned up {result.deleted_count} old messages")
            return {'success': True, 'deleted_count': result.deleted_count}
            
        except Exception as e:
            print(f"Error cleaning up messages: {e}")
            return {'success': False, 'error': str(e)}