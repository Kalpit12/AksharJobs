from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_jwt_extended import decode_token
from flask import request
from datetime import datetime
import json
from .status_service import StatusService

# Global socketio instance (will be initialized in app.py)
socketio = None

def init_websocket(app):
    """Initialize WebSocket with the Flask app"""
    global socketio
    socketio = SocketIO(app, cors_allowed_origins="*", logger=True, engineio_logger=True)
    
    # Register event handlers
    @socketio.on('connect')
    def handle_connect(auth=None):
        """Handle client connection"""
        print(f"Client connected: {request.sid}")
        emit('connected', {'message': 'Connected to real-time updates'})

    @socketio.on('disconnect')
    def handle_disconnect():
        """Handle client disconnection"""
        print(f"Client disconnected: {request.sid}")
        # Note: We can't get user_id from disconnect event easily
        # Status will expire automatically in Redis

    @socketio.on('authenticate')
    def handle_authenticate(data):
        """Authenticate user and join their personal room"""
        try:
            token = data.get('token')
            if not token:
                emit('auth_error', {'message': 'No token provided'})
                return
            
            # Decode JWT token
            decoded_token = decode_token(token)
            user_id = decoded_token['sub']
            
            # Join user to their personal room
            join_room(f"user_{user_id}")
            
            # Set user as online
            StatusService.handle_user_online(user_id, request.sid)
            
            print(f"User {user_id} authenticated and joined room user_{user_id}")
            emit('authenticated', {'message': 'Successfully authenticated', 'user_id': user_id})
            
        except Exception as e:
            print(f"Authentication error: {e}")
            emit('auth_error', {'message': 'Invalid token'})

    @socketio.on('join_notifications')
    def handle_join_notifications(data):
        """Join notification room for real-time updates"""
        try:
            token = data.get('token')
            if not token:
                emit('error', {'message': 'No token provided'})
                return
            
            decoded_token = decode_token(token)
            user_id = decoded_token['sub']
            
            # Join notification room
            join_room(f"notifications_{user_id}")
            emit('joined_notifications', {'message': 'Joined notification updates'})
            
        except Exception as e:
            print(f"Error joining notifications: {e}")
            emit('error', {'message': 'Failed to join notifications'})

    @socketio.on('join_messages')
    def handle_join_messages(data):
        """Join message room for real-time updates"""
        try:
            token = data.get('token')
            if not token:
                emit('error', {'message': 'No token provided'})
                return
            
            decoded_token = decode_token(token)
            user_id = decoded_token['sub']
            
            # Join message room
            join_room(f"messages_{user_id}")
            emit('joined_messages', {'message': 'Joined message updates'})
            
        except Exception as e:
            print(f"Error joining messages: {e}")
            emit('error', {'message': 'Failed to join messages'})
    
    @socketio.on('heartbeat')
    def handle_heartbeat(data):
        """Handle user heartbeat to keep them online"""
        try:
            token = data.get('token')
            if not token:
                emit('error', {'message': 'No token provided'})
                return
            
            decoded_token = decode_token(token)
            user_id = decoded_token['sub']
            
            # Update heartbeat
            StatusService.handle_heartbeat(user_id)
            emit('heartbeat_ack', {'message': 'Heartbeat received'})
            
        except Exception as e:
            print(f"Error handling heartbeat: {e}")
            emit('error', {'message': 'Failed to process heartbeat'})
    
    @socketio.on('get_status')
    def handle_get_status(data):
        """Get user's current status"""
        try:
            token = data.get('token')
            if not token:
                emit('error', {'message': 'No token provided'})
                return
            
            decoded_token = decode_token(token)
            user_id = decoded_token['sub']
            
            status_info = StatusService.get_user_status(user_id)
            emit('status_info', status_info)
            
        except Exception as e:
            print(f"Error getting status: {e}")
            emit('error', {'message': 'Failed to get status'})
    
    return socketio

def get_socketio():
    """Get the socketio instance"""
    return socketio

def send_notification_to_user(user_id, notification_data):
    """Send notification to a specific user"""
    if socketio:
        socketio.emit('new_notification', notification_data, room=f"notifications_{user_id}")
        print(f"Notification sent to user {user_id}")

def send_message_to_user(user_id, message_data):
    """Send message to a specific user"""
    if socketio:
        socketio.emit('new_message', message_data, room=f"messages_{user_id}")
        print(f"Message sent to user {user_id}")

def send_notification_count_update(user_id, count):
    """Send notification count update to a specific user"""
    if socketio:
        socketio.emit('notification_count_update', {'count': count}, room=f"notifications_{user_id}")

def send_message_count_update(user_id, count):
    """Send message count update to a specific user"""
    if socketio:
        socketio.emit('message_count_update', {'count': count}, room=f"messages_{user_id}")

def broadcast_notification(notification_data):
    """Broadcast notification to all connected users"""
    if socketio:
        socketio.emit('broadcast_notification', notification_data)

def broadcast_message(message_data):
    """Broadcast message to all connected users"""
    if socketio:
        socketio.emit('broadcast_message', message_data)
