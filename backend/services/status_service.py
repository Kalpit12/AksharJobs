from flask_socketio import emit, join_room, leave_room
import redis
import json
import os
from datetime import datetime

# Redis connection for storing online status
try:
    import redis
    redis_client = redis.Redis(
        host=os.getenv('REDIS_HOST', 'localhost'),
        port=int(os.getenv('REDIS_PORT', 6379)),
        db=0,
        decode_responses=True
    )
    # Test connection
    redis_client.ping()
    REDIS_AVAILABLE = True
except Exception as e:
    print(f"Redis not available: {e}. Using in-memory storage.")
    REDIS_AVAILABLE = False
    redis_client = None
    # Fallback to in-memory storage
    import threading
    _memory_store = {}
    _memory_lock = threading.Lock()

class StatusService:
    @staticmethod
    def handle_user_online(user_id, socket_id):
        """Handle user coming online"""
        try:
            if REDIS_AVAILABLE and redis_client:
                # Store connection info
                redis_client.setex(f"user_connection:{user_id}", 300, socket_id)
                
                # Set online status
                redis_client.setex(f"user_status:{user_id}", 300, "online")
                redis_client.setex(f"user_last_seen:{user_id}", 300, datetime.now().isoformat())
            else:
                # Use in-memory storage
                with _memory_lock:
                    _memory_store[f"user_connection:{user_id}"] = socket_id
                    _memory_store[f"user_status:{user_id}"] = "online"
                    _memory_store[f"user_last_seen:{user_id}"] = datetime.now().isoformat()
            
            # Join user to their personal room
            join_room(f"user_{user_id}")
            
            # Notify other users about this user's online status
            emit('user_status_changed', {
                'user_id': user_id,
                'status': 'online',
                'timestamp': datetime.now().isoformat()
            }, room=f"user_{user_id}", include_self=False)
            
            return True
        except Exception as e:
            print(f"Error handling user online: {str(e)}")
            return False
    
    @staticmethod
    def handle_user_offline(user_id, socket_id):
        """Handle user going offline"""
        try:
            if REDIS_AVAILABLE and redis_client:
                # Set offline status
                redis_client.setex(f"user_status:{user_id}", 300, "offline")
                redis_client.setex(f"user_last_seen:{user_id}", 300, datetime.now().isoformat())
                
                # Remove connection info
                redis_client.delete(f"user_connection:{user_id}")
            else:
                # Use in-memory storage
                with _memory_lock:
                    _memory_store[f"user_status:{user_id}"] = "offline"
                    _memory_store[f"user_last_seen:{user_id}"] = datetime.now().isoformat()
                    _memory_store.pop(f"user_connection:{user_id}", None)
            
            # Leave user's personal room
            leave_room(f"user_{user_id}")
            
            # Notify other users about this user's offline status
            emit('user_status_changed', {
                'user_id': user_id,
                'status': 'offline',
                'timestamp': datetime.now().isoformat()
            }, room=f"user_{user_id}", include_self=False)
            
            return True
        except Exception as e:
            print(f"Error handling user offline: {str(e)}")
            return False
    
    @staticmethod
    def handle_heartbeat(user_id):
        """Handle user heartbeat to keep them online"""
        try:
            if REDIS_AVAILABLE and redis_client:
                # Update last seen timestamp
                redis_client.setex(f"user_last_seen:{user_id}", 300, datetime.now().isoformat())
                
                # Keep online status active
                redis_client.setex(f"user_status:{user_id}", 300, "online")
            else:
                # Use in-memory storage
                with _memory_lock:
                    _memory_store[f"user_last_seen:{user_id}"] = datetime.now().isoformat()
                    _memory_store[f"user_status:{user_id}"] = "online"
            
            return True
        except Exception as e:
            print(f"Error handling heartbeat: {str(e)}")
            return False
    
    @staticmethod
    def get_user_status(user_id):
        """Get user's current status"""
        try:
            if REDIS_AVAILABLE and redis_client:
                status = redis_client.get(f"user_status:{user_id}")
                last_seen = redis_client.get(f"user_last_seen:{user_id}")
            else:
                with _memory_lock:
                    status = _memory_store.get(f"user_status:{user_id}")
                    last_seen = _memory_store.get(f"user_last_seen:{user_id}")
            
            return {
                'status': status if status else 'offline',
                'last_seen': last_seen
            }
        except Exception as e:
            print(f"Error getting user status: {str(e)}")
            return {
                'status': 'offline',
                'last_seen': None
            }
    
    @staticmethod
    def cleanup_inactive_users():
        """Clean up users who haven't been active for a while"""
        try:
            # This would be called periodically to clean up inactive users
            # For now, we rely on Redis expiration
            pass
        except Exception as e:
            print(f"Error cleaning up inactive users: {str(e)}")
