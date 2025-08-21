from flask import request, jsonify
from functools import wraps
from utils.auth_token import verify_token

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"error": "Token is missing"}), 401
        
        decoded = verify_token(token)
        if not decoded:
            return jsonify({"error": "Invalid or expired token"}), 401
        
        request.user = decoded
        return f(*args, **kwargs)
    
    return decorated_function
