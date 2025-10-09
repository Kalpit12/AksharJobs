from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime, timedelta
from utils.db import get_db
import json

notification_bp = Blueprint('notifications', __name__)

@notification_bp.route('/', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get all notifications for the current user"""
    try:
        print(f"🔔 Getting notifications...")
        user_id = get_jwt_identity()
        print(f"👤 User ID: {user_id}")
        
        db = get_db()
        print(f"🗄️ Database: {db}")
        
        if db is None:
            print(f"❌ Database connection failed")
            return jsonify({'error': 'Database connection failed'}), 500
        
        notifications = db["notifications"]
        print(f"📋 Notifications collection: {notifications}")
        
        # Get notifications for the user, ordered by creation date (newest first)
        user_notifications = list(notifications.find(
            {"user_id": user_id}
        ).sort("created_at", -1).limit(50))
        
        print(f"📨 Found {len(user_notifications)} notifications")
        
        # Convert ObjectId to string
        for notification in user_notifications:
            notification['_id'] = str(notification['_id'])
            notification['id'] = str(notification['_id'])
            if 'created_at' in notification:
                notification['created_at'] = notification['created_at'].isoformat()
        
        print(f"✅ Returning notifications successfully")
        return jsonify({
            'success': True,
            'notifications': user_notifications
        }), 200
        
    except Exception as e:
        print(f"❌ Error getting notifications: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@notification_bp.route('/unread-count', methods=['GET'])
@jwt_required()
def get_unread_count():
    """Get unread notification count for the current user"""
    try:
        user_id = get_jwt_identity()
        db = get_db()
        
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        notifications = db["notifications"]
        
        # Count unread notifications
        unread_count = notifications.count_documents({
            "user_id": user_id,
            "is_read": False
        })
        
        return jsonify({
            'success': True,
            'unread_count': unread_count
        }), 200
        
    except Exception as e:
        print(f"Error getting unread count: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@notification_bp.route('/<notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_read(notification_id):
    """Mark a specific notification as read"""
    try:
        user_id = get_jwt_identity()
        db = get_db()
        
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        notifications = db["notifications"]
        
        # Update the notification
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
        
        if result.matched_count == 0:
            return jsonify({'error': 'Notification not found'}), 404
        
        return jsonify({
            'success': True,
            'message': 'Notification marked as read'
        }), 200
        
    except Exception as e:
        print(f"Error marking notification as read: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@notification_bp.route('/mark-all-read', methods=['PUT'])
@jwt_required()
def mark_all_notifications_read():
    """Mark all notifications as read for the current user"""
    try:
        user_id = get_jwt_identity()
        db = get_db()
        
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        notifications = db["notifications"]
        
        # Update all unread notifications
        result = notifications.update_many(
            {
                "user_id": user_id,
                "is_read": False
            },
            {
                "$set": {
                    "is_read": True,
                    "read_at": datetime.utcnow()
                }
            }
        )
        
        return jsonify({
            'success': True,
            'message': f'{result.modified_count} notifications marked as read'
        }), 200
        
    except Exception as e:
        print(f"Error marking all notifications as read: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@notification_bp.route('/clear-all', methods=['DELETE'])
@jwt_required()
def clear_all_notifications():
    """Clear all notifications for the current user"""
    try:
        user_id = get_jwt_identity()
        db = get_db()
        
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        notifications = db["notifications"]
        
        # Delete all notifications for the user
        result = notifications.delete_many({"user_id": user_id})
        
        return jsonify({
            'success': True,
            'message': f'{result.deleted_count} notifications cleared'
        }), 200
        
    except Exception as e:
        print(f"Error clearing notifications: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@notification_bp.route('/create', methods=['POST'])
@jwt_required()
def create_notification():
    """Create a new notification (for testing or admin use)"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['type', 'title', 'message']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        notifications = db["notifications"]
        
        # Create notification
        notification = {
            "user_id": user_id,
            "type": data['type'],
            "title": data['title'],
            "message": data['message'],
            "is_read": False,
            "created_at": datetime.utcnow(),
            "data": data.get('data', {})  # Additional data for the notification
        }
        
        result = notifications.insert_one(notification)
        
        if result.inserted_id:
            # Convert ObjectId to string for response
            notification['_id'] = str(result.inserted_id)
            notification['id'] = str(result.inserted_id)
            notification['created_at'] = notification['created_at'].isoformat()
            
            return jsonify({
                'success': True,
                'notification': notification,
                'message': 'Notification created successfully'
            }), 201
        else:
            return jsonify({'error': 'Failed to create notification'}), 500
            
    except Exception as e:
        print(f"Error creating notification: {e}")
        return jsonify({'error': 'Internal server error'}), 500
