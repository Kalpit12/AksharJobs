from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.application_routes import application_routes
from routes.auth_routes import auth_routes
from routes.job_routes import job_routes
from routes.resume_routes import resume_bp  # Import resume routes
from routes.analytics_routes import analytics_bp
from routes.subscription_routes import subscription_bp
from routes.phone_verification_routes import phone_verification_bp
from routes.email_verification_routes import email_verification_bp
from routes.gig_routes import gig_routes
from routes.admin_routes import admin_routes
from routes.cv_access_routes import cv_access_routes
from routes.oauth_routes import oauth_routes
from routes.user_profile_routes import user_profile_routes
from routes.local_language_routes import local_language_routes
from config import Config

app = Flask(__name__)

# CORS configuration - More permissive for development
CORS(app, 
     origins=["http://localhost:3003", "http://127.0.0.1:3003", "http://localhost:3000", "http://127.0.0.1:3000"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Origin", "Accept"],
     supports_credentials=False)

# Global CORS handler - This ensures ALL routes get CORS headers
@app.after_request
def after_request(response):
    # Get the origin from the request
    origin = request.headers.get('Origin')
    
    # Set CORS headers for all responses
    if origin in ["http://localhost:3003", "http://127.0.0.1:3003", "http://localhost:3000", "http://127.0.0.1:3000"]:
        response.headers['Access-Control-Allow-Origin'] = origin
    else:
        # Default to allowing the frontend port
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3003'
    
    # Always set these headers
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Origin, Accept'
    response.headers['Access-Control-Allow-Credentials'] = 'false'
    response.headers['Access-Control-Max-Age'] = '86400'  # Cache preflight for 24 hours
    
    # Handle preflight OPTIONS requests
    if request.method == 'OPTIONS':
        response.status_code = 200
        # Ensure OPTIONS responses have proper CORS headers
        if origin in ["http://localhost:3003", "http://127.0.0.1:3003", "http://localhost:3000", "http://127.0.0.1:3000"]:
            response.headers['Access-Control-Allow-Origin'] = origin
        else:
            response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3003'
    
    return response

# Load configurations
app.config.from_object(Config)

# Initialize JWT
jwt = JWTManager(app)

# JWT Error Handlers
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    print(f"JWT Token expired: {jwt_payload}")
    return jsonify({
        'error': 'Token has expired',
        'message': 'Please log in again'
    }), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    print(f"JWT Invalid token: {error}")
    return jsonify({
        'error': 'Invalid token',
        'message': 'Please log in again'
    }), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    print(f"JWT Missing token: {error}")
    return jsonify({
        'error': 'Missing token',
        'message': 'Please log in again'
    }), 401

@jwt.needs_fresh_token_loader
def token_not_fresh_callback(jwt_header, jwt_payload):
    print(f"JWT Token not fresh: {jwt_payload}")
    return jsonify({
        'error': 'Token not fresh',
        'message': 'Please log in again'
    }), 401

@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    print(f"JWT Token revoked: {jwt_payload}")
    return jsonify({
        'error': 'Token has been revoked',
        'message': 'Please log in again'
    }), 401

# Register Blueprints (APIs)
app.register_blueprint(auth_routes, url_prefix="/api/auth")
app.register_blueprint(job_routes, url_prefix="/api/jobs")
app.register_blueprint(resume_bp, url_prefix="/api/resumes") 
app.register_blueprint(application_routes, url_prefix="/api/applications")
app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
app.register_blueprint(subscription_bp, url_prefix="/api/subscription")
app.register_blueprint(phone_verification_bp, url_prefix="/api")
app.register_blueprint(email_verification_bp, url_prefix="/api")
app.register_blueprint(gig_routes, url_prefix="/api")
app.register_blueprint(admin_routes, url_prefix="/api/admin")
app.register_blueprint(cv_access_routes, url_prefix="/api")
app.register_blueprint(oauth_routes, url_prefix="/api/auth")
app.register_blueprint(user_profile_routes, url_prefix="/api/users")
app.register_blueprint(local_language_routes, url_prefix="/api/local-language")

@app.route("/")
def home():
    return "API is running!"

@app.route("/health", methods=["GET"])
def health_check():
    """Simple health check endpoint"""
    try:
        # Test database connection
        from utils.db import get_db
        db = get_db()
        if db is not None:
            # Test the connection by running a simple command
            try:
                db.command('ping')
                return jsonify({
                    "status": "healthy",
                    "database": "connected",
                    "timestamp": "2024-01-01T00:00:00Z"
                })
            except Exception as db_error:
                return jsonify({
                    "status": "unhealthy",
                    "database": "connection_failed",
                    "error": str(db_error),
                    "timestamp": "2024-01-01T00:00:00Z"
                }), 500
        else:
            return jsonify({
                "status": "unhealthy",
                "database": "disconnected",
                "timestamp": "2024-01-01T00:00:00Z"
            }), 500
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e),
            "timestamp": "2024-01-01T00:00:00Z"
        }), 500

@app.route("/test-cors", methods=["GET", "POST", "OPTIONS"])
def test_cors():
    """Test endpoint to verify CORS is working"""
    print(f"Test CORS endpoint called with method: {request.method}")
    print(f"Origin header: {request.headers.get('Origin')}")
    
    if request.method == "OPTIONS":
        print("Handling OPTIONS request")
        response = app.make_default_options_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
        response.headers['Access-Control-Allow-Credentials'] = 'false'
        return response
    
    return jsonify({
        "message": "CORS test successful",
        "method": request.method,
        "origin": request.headers.get('Origin'),
        "timestamp": "2024-01-01T00:00:00Z"
    })

@app.route("/debug-cors", methods=["GET", "POST", "OPTIONS"])
def debug_cors():
    """Debug endpoint to see all request details"""
    print(f"=== DEBUG CORS ===")
    print(f"Method: {request.method}")
    print(f"Path: {request.path}")
    print(f"Headers: {dict(request.headers)}")
    print(f"Origin: {request.headers.get('Origin')}")
    
    response = jsonify({
        "method": request.method,
        "path": request.path,
        "headers": dict(request.headers),
        "origin": request.headers.get('Origin')
    })
    
    return response

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=3002)
