from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime, timedelta
from utils.db import get_db
import json

message_bp = Blueprint('messages', __name__)

@message_bp.route('/', methods=['GET'])
@jwt_required()
def get_messages():
    """Get all messages for the current user"""
    try:
        user_id = get_jwt_identity()
        db = get_db()
        
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        messages = db["messages"]
        
        # Get messages where user is either sender or recipient
        user_messages = list(messages.find({
            "$or": [
                {"sender_id": user_id},
                {"recipient_id": user_id}
            ]
        }).sort("created_at", -1).limit(50))
        
        # Get user collection for names/avatars
        users = db["users"]
        
        # Convert ObjectId to string and format response
        formatted_messages = []
        for message in user_messages:
            message['_id'] = str(message['_id'])
            message['id'] = str(message['_id'])
            if 'created_at' in message:
                message['created_at'] = message['created_at'].isoformat()
            if 'read_at' in message:
                message['read_at'] = message['read_at'].isoformat()
            
            # Add sender/recipient info
            if message['sender_id'] == user_id:
                message['is_sent'] = True
                message['other_user_id'] = message['recipient_id']
                # Get recipient info
                other_user = users.find_one({'_id': ObjectId(message['recipient_id'])})
            else:
                message['is_sent'] = False
                message['other_user_id'] = message['sender_id']
                # Get sender info
                other_user = users.find_one({'_id': ObjectId(message['sender_id'])})
            
            # Add other user's name and avatar
            if other_user:
                message['other_user_name'] = f"{other_user.get('firstName', '')} {other_user.get('lastName', '')}".strip() or 'User'
                message['other_user_avatar'] = other_user.get('profileImage') or other_user.get('companyLogo')
            else:
                message['other_user_name'] = 'User'
                message['other_user_avatar'] = None
            
            formatted_messages.append(message)
        
        return jsonify({
            'success': True,
            'messages': formatted_messages
        }), 200
        
    except Exception as e:
        print(f"Error getting messages: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@message_bp.route('/unread-count', methods=['GET'])
@jwt_required()
def get_unread_message_count():
    """Get unread message count for the current user"""
    try:
        user_id = get_jwt_identity()
        db = get_db()
        
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        messages = db["messages"]
        
        # Count unread messages where user is recipient
        unread_count = messages.count_documents({
            "recipient_id": user_id,
            "is_read": False
        })
        
        return jsonify({
            'success': True,
            'unread_count': unread_count
        }), 200
        
    except Exception as e:
        print(f"Error getting unread message count: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@message_bp.route('/send', methods=['POST'])
@jwt_required()
def send_message():
    """Send a new message"""
    try:
        sender_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['recipient_id', 'content']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        messages = db["messages"]
        
        # Create message
        message = {
            "sender_id": sender_id,
            "recipient_id": data['recipient_id'],
            "content": data['content'],
            "is_read": False,
            "created_at": datetime.utcnow(),
            "message_type": data.get('message_type', 'text'),  # text, image, file, etc.
            "metadata": data.get('metadata', {})  # Additional data
        }
        
        result = messages.insert_one(message)
        
        if result.inserted_id:
            # Convert ObjectId to string for response
            message['_id'] = str(result.inserted_id)
            message['id'] = str(result.inserted_id)
            message['created_at'] = message['created_at'].isoformat()
            
            return jsonify({
                'success': True,
                'message': message,
                'message_text': 'Message sent successfully'
            }), 201
        else:
            return jsonify({'error': 'Failed to send message'}), 500
            
    except Exception as e:
        print(f"Error sending message: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@message_bp.route('/<message_id>/read', methods=['PUT'])
@jwt_required()
def mark_message_read(message_id):
    """Mark a specific message as read"""
    try:
        user_id = get_jwt_identity()
        db = get_db()
        
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        messages = db["messages"]
        
        # Update the message (only if user is the recipient)
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
        
        if result.matched_count == 0:
            return jsonify({'error': 'Message not found or not authorized'}), 404
        
        return jsonify({
            'success': True,
            'message': 'Message marked as read'
        }), 200
        
    except Exception as e:
        print(f"Error marking message as read: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@message_bp.route('/conversation/<other_user_id>', methods=['GET'])
@jwt_required()
def get_conversation(other_user_id):
    """Get conversation between current user and another user"""
    try:
        user_id = get_jwt_identity()
        db = get_db()
        
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
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
        }).sort("created_at", 1))  # Oldest first for conversation view
        
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
        
        return jsonify({
            'success': True,
            'conversation': conversation
        }), 200
        
    except Exception as e:
        print(f"Error getting conversation: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@message_bp.route('/mark-conversation-read/<other_user_id>', methods=['PUT'])
@jwt_required()
def mark_conversation_read(other_user_id):
    """Mark all messages in a conversation as read"""
    try:
        user_id = get_jwt_identity()
        db = get_db()
        
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
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
        
        return jsonify({
            'success': True,
            'message': f'{result.modified_count} messages marked as read'
        }), 200
        
    except Exception as e:
        print(f"Error marking conversation as read: {e}")
        return jsonify({'error': 'Internal server error'}), 500
