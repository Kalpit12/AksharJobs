from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from utils.db import get_db

user_bp = Blueprint('users', __name__)

@user_bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    """Get all users (for messaging recipient selection)"""
    try:
        current_user_id = get_jwt_identity()
        db = get_db()
        
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        users = db["users"]
        
        # Get all users except the current user
        all_users = list(users.find(
            {"_id": {"$ne": ObjectId(current_user_id)}},
            {"password": 0, "passwordHash": 0}  # Exclude password fields
        ).limit(100))
        
        # Convert ObjectId to string
        for user in all_users:
            user['_id'] = str(user['_id'])
            user['id'] = str(user['_id'])
        
        return jsonify(all_users), 200
        
    except Exception as e:
        print(f"Error getting users: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@user_bp.route('/<user_id>', methods=['GET'])
@jwt_required()
def get_user_by_id(user_id):
    """Get a specific user by ID"""
    try:
        db = get_db()
        
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        users = db["users"]
        
        # Find user by ID
        user = users.find_one(
            {"_id": ObjectId(user_id)},
            {"password": 0, "passwordHash": 0}  # Exclude password fields
        )
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Convert ObjectId to string
        user['_id'] = str(user['_id'])
        user['id'] = str(user['_id'])
        
        return jsonify(user), 200
        
    except Exception as e:
        print(f"Error getting user: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@user_bp.route('/search', methods=['GET'])
@jwt_required()
def search_users():
    """Search users by name or email"""
    try:
        current_user_id = get_jwt_identity()
        query = request.args.get('q', '').strip()
        
        if not query:
            return jsonify({'users': []}), 200
        
        db = get_db()
        
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        users = db["users"]
        
        # Search users by name or email (case-insensitive)
        search_results = list(users.find(
            {
                "$and": [
                    {"_id": {"$ne": ObjectId(current_user_id)}},
                    {
                        "$or": [
                            {"firstName": {"$regex": query, "$options": "i"}},
                            {"lastName": {"$regex": query, "$options": "i"}},
                            {"email": {"$regex": query, "$options": "i"}}
                        ]
                    }
                ]
            },
            {"password": 0, "passwordHash": 0}
        ).limit(20))
        
        # Convert ObjectId to string
        for user in search_results:
            user['_id'] = str(user['_id'])
            user['id'] = str(user['_id'])
        
        return jsonify({'users': search_results}), 200
        
    except Exception as e:
        print(f"Error searching users: {e}")
        return jsonify({'error': 'Internal server error'}), 500

