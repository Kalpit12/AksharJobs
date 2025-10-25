"""
Notification Routes
Handles notification-related endpoints
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime
from utils.db import get_db

notification_bp = Blueprint('notifications', __name__)

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
        
        # Count unread notifications for user
        unread_count = notifications.count_documents({
            "user_id": user_id,
            "is_read": False
        })
        
        return jsonify({
            'success': True,
            'unread_count': unread_count
        }), 200
        
    except Exception as e:
        print(f"Error getting unread notification count: {e}")
        return jsonify({
            'success': True,
            'unread_count': 0
        }), 200

@notification_bp.route('/', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get all notifications for the current user"""
    try:
        user_id = get_jwt_identity()
        db = get_db()
        
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        notifications = db["notifications"]
        
        # Get notifications for user
        user_notifications = list(notifications.find({
            "user_id": user_id
        }).sort("created_at", -1).limit(50))
        
        # Format response
        for notif in user_notifications:
            notif['_id'] = str(notif['_id'])
            if 'created_at' in notif:
                notif['created_at'] = notif['created_at'].isoformat()
            if 'read_at' in notif:
                notif['read_at'] = notif['read_at'].isoformat()
        
        return jsonify({
            'success': True,
            'notifications': user_notifications
        }), 200
        
    except Exception as e:
        print(f"Error getting notifications: {e}")
        return jsonify({
            'success': True,
            'notifications': []
        }), 200

@notification_bp.route('/<notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_read(notification_id):
    """Mark a notification as read"""
    try:
        user_id = get_jwt_identity()
        db = get_db()
        
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        notifications = db["notifications"]
        
        # Update notification (only if user owns it)
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
            return jsonify({'error': 'Notification not found or not authorized'}), 404
        
        return jsonify({
            'success': True,
            'message': 'Notification marked as read'
        }), 200
        
    except Exception as e:
        print(f"Error marking notification as read: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@notification_bp.route('/mark-all-read', methods=['PUT'])
@jwt_required()
def mark_all_read():
    """Mark all notifications as read for the current user"""
    try:
        user_id = get_jwt_identity()
        db = get_db()
        
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        notifications = db["notifications"]
        
        # Mark all unread notifications as read
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
