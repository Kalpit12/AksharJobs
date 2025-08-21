from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.application_routes import application_routes
from routes.auth_routes import auth_routes
from routes.job_routes import job_routes
from routes.resume_routes import resume_routes  # Import resume routes
from routes.analytics_routes import analytics_bp
from routes.subscription_routes import subscription_bp
from routes.phone_verification_routes import phone_verification_bp
from routes.email_verification_routes import email_verification_bp
from routes.gig_routes import gig_routes
from routes.admin_routes import admin_routes
from routes.cv_access_routes import cv_access_routes
from config import Config

app = Flask(__name__)

# CORS configuration
CORS(app, 
     origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
     supports_credentials=True,
     expose_headers=["Content-Type", "Authorization"])

# Global CORS handler for all routes
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin in ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"]:
        response.headers['Access-Control-Allow-Origin'] = origin
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Max-Age'] = '86400'  # Cache preflight for 24 hours
    return response

# Load configurations
app.config.from_object(Config)

# Initialize JWT
jwt = JWTManager(app)

# Register Blueprints (APIs)
app.register_blueprint(auth_routes, url_prefix="/api/auth")
app.register_blueprint(job_routes, url_prefix="/api/jobs")
app.register_blueprint(resume_routes, url_prefix="/api/resumes") 
app.register_blueprint(application_routes, url_prefix="/api/applications")
app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
app.register_blueprint(subscription_bp, url_prefix="/api/subscription")
app.register_blueprint(phone_verification_bp, url_prefix="/api")
app.register_blueprint(email_verification_bp, url_prefix="/api")
app.register_blueprint(gig_routes, url_prefix="/api")
app.register_blueprint(admin_routes, url_prefix="/api/admin")
app.register_blueprint(cv_access_routes, url_prefix="/api")

@app.route("/")
def home():
    return "API is running!"

@app.route("/test-cors", methods=["GET", "POST", "OPTIONS"])
def test_cors():
    """Test endpoint to verify CORS is working"""
    print(f"Test CORS endpoint called with method: {request.method}")
    print(f"Origin header: {request.headers.get('Origin')}")
    
    if request.method == "OPTIONS":
        print("Handling OPTIONS request")
        response = app.make_default_options_response()
        origin = request.headers.get('Origin')
        if origin in ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"]:
            response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
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
    app.run(debug=True, host='0.0.0.0', port=5000)
