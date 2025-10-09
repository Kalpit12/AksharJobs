from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import jwt
from functools import wraps
import json
import os

status_bp = Blueprint('status', __name__)

# Redis connection for storing online status
try:
    import redis
    redis_client = redis.Redis(
        host=os.getenv('REDIS_HOST', 'localhost'),
        port=int(os.getenv('REDIS_PORT', 6379)),
        db=0,
        decode_responses=True,
        socket_connect_timeout=1,
        socket_timeout=1,
        retry_on_timeout=False
    )
    # Test connection with very short timeout
    redis_client.ping()
    REDIS_AVAILABLE = True
    print("✅ Redis connected successfully")
except Exception as e:
    print(f"⚠️ Redis not available: {e}. Using in-memory storage.")
    REDIS_AVAILABLE = False
    redis_client = None
    # Fallback to in-memory storage
    import threading
    _memory_store = {}
    _memory_lock = threading.Lock()

# Store for active connections
active_connections = {}

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=['HS256'])
            # Use 'sub' claim which is what Flask-JWT-Extended uses
            current_user_id = data.get('sub') or data.get('user_id')
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user_id, *args, **kwargs)
    return decorated

@status_bp.route('/api/status/online', methods=['POST'])
@token_required
def set_online(current_user_id):
    """Set user as online"""
    try:
        if REDIS_AVAILABLE:
            # Store online status in Redis with expiration
            redis_client.setex(f"user_status:{current_user_id}", 300, "online")  # 5 minutes timeout
            
            # Update last seen timestamp
            redis_client.setex(f"user_last_seen:{current_user_id}", 300, datetime.now().isoformat())
        else:
            # Use in-memory storage
            with _memory_lock:
                _memory_store[f"user_status:{current_user_id}"] = "online"
                _memory_store[f"user_last_seen:{current_user_id}"] = datetime.now().isoformat()
        
        return jsonify({
            'success': True,
            'message': 'User status set to online',
            'status': 'online'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error setting online status: {str(e)}'
        }), 500

@status_bp.route('/api/status/offline', methods=['POST'])
@token_required
def set_offline(current_user_id):
    """Set user as offline"""
    try:
        if REDIS_AVAILABLE and redis_client:
            # Set offline status
            redis_client.setex(f"user_status:{current_user_id}", 300, "offline")
            
            # Update last seen timestamp
            redis_client.setex(f"user_last_seen:{current_user_id}", 300, datetime.now().isoformat())
        else:
            # Use in-memory storage
            with _memory_lock:
                _memory_store[f"user_status:{current_user_id}"] = "offline"
                _memory_store[f"user_last_seen:{current_user_id}"] = datetime.now().isoformat()
        
        return jsonify({
            'success': True,
            'message': 'User status set to offline',
            'status': 'offline'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error setting offline status: {str(e)}'
        }), 500

@status_bp.route('/api/status/check/<user_id>', methods=['GET'])
def check_status(user_id):
    """Check if a user is online"""
    try:
        if REDIS_AVAILABLE and redis_client:
            status = redis_client.get(f"user_status:{user_id}")
            last_seen = redis_client.get(f"user_last_seen:{user_id}")
        else:
            with _memory_lock:
                status = _memory_store.get(f"user_status:{user_id}")
                last_seen = _memory_store.get(f"user_last_seen:{user_id}")
        
        if status is None:
            return jsonify({
                'success': True,
                'status': 'offline',
                'last_seen': None
            })
        
        return jsonify({
            'success': True,
            'status': status,
            'last_seen': last_seen
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error checking status: {str(e)}'
        }), 500

@status_bp.route('/api/status/heartbeat', methods=['POST'])
@token_required
def heartbeat(current_user_id):
    """Update user's last activity timestamp"""
    try:
        if REDIS_AVAILABLE and redis_client:
            # Update last seen timestamp
            redis_client.setex(f"user_last_seen:{current_user_id}", 300, datetime.now().isoformat())
            
            # Keep online status active
            redis_client.setex(f"user_status:{current_user_id}", 300, "online")
        else:
            # Use in-memory storage
            with _memory_lock:
                _memory_store[f"user_last_seen:{current_user_id}"] = datetime.now().isoformat()
                _memory_store[f"user_status:{current_user_id}"] = "online"
        
        return jsonify({
            'success': True,
            'message': 'Heartbeat updated'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error updating heartbeat: {str(e)}'
        }), 500

def get_user_status(user_id):
    """Helper function to get user status"""
    try:
        if REDIS_AVAILABLE and redis_client:
            status = redis_client.get(f"user_status:{user_id}")
            return status if status else "offline"
        else:
            with _memory_lock:
                status = _memory_store.get(f"user_status:{user_id}")
                return status if status else "offline"
    except:
        return "offline"

def is_user_online(user_id):
    """Helper function to check if user is online"""
    return get_user_status(user_id) == "online"
