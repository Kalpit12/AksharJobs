from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from jwt.exceptions import InvalidTokenError, DecodeError
import google.generativeai as genai
import os
from datetime import datetime
from config import Config

# Create Flask app instance
app = Flask(__name__)

# Configure app
app.config.from_object(Config)

# Initialize extensions (CORS handled manually below)
# CORS(app, 
#      origins=["http://localhost:3003", "http://127.0.0.1:3003", "*"],  # Allow frontend and all origins
#      methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
#      allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"],
#      supports_credentials=True,
#      expose_headers=["Content-Range", "X-Content-Range"])
jwt = JWTManager(app)

# JWT Error Handlers - Comprehensive Coverage
@jwt.invalid_token_loader
def invalid_token_callback(error_string):
    """Handle invalid token format or signature"""
    return jsonify({
        'error': 'Invalid or expired token',
        'message': 'Please log in again'
    }), 401

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_data):
    """Handle expired tokens"""
    return jsonify({
        'error': 'Token has expired',
        'message': 'Please log in again'
    }), 401

@jwt.unauthorized_loader
def unauthorized_callback(error_string):
    """Handle missing or malformed authorization header"""
    return jsonify({
        'error': 'Authorization required',
        'message': 'Please provide a valid token'
    }), 401

@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_data):
    """Handle revoked tokens"""
    return jsonify({
        'error': 'Token has been revoked',
        'message': 'Please log in again'
    }), 401

@jwt.needs_fresh_token_loader
def needs_fresh_token_callback(jwt_header, jwt_data):
    """Handle operations requiring fresh token"""
    return jsonify({
        'error': 'Fresh token required',
        'message': 'Please log in again'
    }), 401

@jwt.token_verification_failed_loader
def token_verification_failed_callback(jwt_header, jwt_data):
    """Handle token verification failures"""
    return jsonify({
        'error': 'Token verification failed',
        'message': 'Invalid token format'
    }), 401

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# Import and register route blueprints
from routes.auth_routes import auth_routes
from routes.job_routes import job_routes
from routes.application_routes import application_bp
from routes.user_profile_routes import user_profile_routes
from routes.oauth_routes import oauth_routes
from routes.payment_routes import payment_bp
from routes.promo_code_routes import promo_code_routes
from routes.coin_routes import coin_routes
from routes.notification_routes import notification_bp
from routes.message_routes import message_bp
from routes.user_routes import user_bp
from routes.analytics_routes import analytics_bp
from routes.admin_routes import admin_routes
from routes.enhanced_application_routes import enhanced_application_bp
from routes.application_tracker_routes import application_tracker_bp
from routes.modern_resume_routes import modern_resume_bp
from routes.local_language_routes import local_language_routes
from routes.status_routes import status_bp
from routes.cv_access_routes import cv_access_routes
from routes.user_settings_routes import user_settings_routes
from routes.candidates_routes import candidates_bp
from routes.community_routes import community_routes
from routes.ai_prediction_routes import ai_prediction_bp
from routes.debug_routes import debug_bp

# Import WebSocket service
from services.websocket_service import init_websocket
from routes.community_verification_routes import community_verification_routes
from routes.email_verification_routes import email_verification_routes
from routes.bulk_import_routes import bulk_import_bp
from routes.reference_routes import reference_bp
from routes.dashboard_routes import dashboard_routes
from routes.expo_routes import expo_bp
from routes.intern_routes import intern_bp
from routes.recruiter_routes import recruiter_bp
from routes.jobseeker_registration_routes import jobseeker_registration_routes
from routes.ai_features_routes import ai_features_bp
from routes.interviews_routes import interviews_routes
from routes.template_routes import template_routes

# Register blueprints
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(job_routes, url_prefix='/api/jobs')
app.register_blueprint(application_bp, url_prefix='/api/applications')
app.register_blueprint(user_profile_routes, url_prefix='/api/profile')
app.register_blueprint(oauth_routes, url_prefix='/api/auth')
app.register_blueprint(payment_bp, url_prefix='/api/payments')
app.register_blueprint(promo_code_routes, url_prefix='/api/promo')
app.register_blueprint(coin_routes, url_prefix='/api/coins')
app.register_blueprint(notification_bp, url_prefix='/api/notifications')
app.register_blueprint(message_bp, url_prefix='/api/messages')
app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
app.register_blueprint(admin_routes, url_prefix='/api/admin')
app.register_blueprint(template_routes, url_prefix='/api/admin')
app.register_blueprint(interviews_routes, url_prefix='/api/interviews')
print("[OK] Admin routes registered at /api/admin")
print("[OK] Template routes registered at /api/admin")
print("[OK] Interviews routes registered at /api/interviews")

# Debug: List all admin routes
print("[INFO] Admin routes available:")
for rule in app.url_map.iter_rules():
    if '/admin' in str(rule):
        print(f"  {rule.rule} - Methods: {rule.methods}")
app.register_blueprint(enhanced_application_bp, url_prefix='/api/enhanced-applications')
app.register_blueprint(application_tracker_bp, url_prefix='/api/application-tracker')
app.register_blueprint(modern_resume_bp, url_prefix='/api/modern-resumes')
app.register_blueprint(local_language_routes, url_prefix='/api/local-language')
app.register_blueprint(status_bp, url_prefix='/api/status')
app.register_blueprint(cv_access_routes, url_prefix='/api/cv-access')
app.register_blueprint(user_settings_routes, url_prefix='/api/user')
app.register_blueprint(candidates_bp, url_prefix='/api/candidates')
app.register_blueprint(community_routes, url_prefix='/api')
app.register_blueprint(community_verification_routes, url_prefix='/api/community-verification')
app.register_blueprint(email_verification_routes, url_prefix='/api/email-verification')
app.register_blueprint(reference_bp, url_prefix='/api/references')
app.register_blueprint(dashboard_routes, url_prefix='/api')
app.register_blueprint(expo_bp, url_prefix='/api/expo')
app.register_blueprint(intern_bp, url_prefix='/api/interns')
app.register_blueprint(recruiter_bp, url_prefix='/api/recruiters')
app.register_blueprint(jobseeker_registration_routes, url_prefix='/api/jobseeker')
app.register_blueprint(ai_features_bp, url_prefix='/api/ai')
app.register_blueprint(ai_prediction_bp, url_prefix='/api/ai')
app.register_blueprint(debug_bp, url_prefix='/api/debug')
app.register_blueprint(bulk_import_bp)

# Additional CORS handling for OPTIONS requests
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.set("Access-Control-Allow-Origin", "*")
        response.headers.set('Access-Control-Allow-Headers', "*")
        response.headers.set('Access-Control-Allow-Methods', "*")
        return response

# Ensure CORS headers are added to ALL responses
@app.after_request
def after_request(response):
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Headers', '*')
    response.headers.set('Access-Control-Allow-Methods', '*')
    return response

# Handle CORS for error responses
@app.errorhandler(Exception)
def handle_error(e):
    response = make_response(jsonify({"error": str(e)}), 500)
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Headers', '*')
    response.headers.set('Access-Control-Allow-Methods', '*')
    return response

# CORS is handled by Flask-CORS extension above
# Additional manual CORS handler for edge cases

# Health check endpoint
@app.route('/')
def health_check():
    return jsonify({
        'status': 'success',
        'message': 'RocketJobs Backend API is running',
        'version': '1.0.0'
    })

# Health endpoint for testing
@app.route('/health')
def health():
    return jsonify({
        'status': 'success',
        'message': 'RocketJobs Backend API is running',
        'version': '1.0.0'
    })

# CORS test endpoint
@app.route('/test-cors')
def test_cors():
    return jsonify({
        'status': 'success',
        'message': 'CORS is working properly'
    })

def generate_gemini_response(message, user_type, user_id, conversation_history=None):
    """
    Generate AI response using Google Gemini
    """
    try:
        # Initialize the Gemini model
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Create context based on user type
        if user_type == 'recruiter':
            context = """
            You are an AI recruiting assistant powered by Gemini. You help recruiters with:
            
            GENERAL RECRUITMENT:
            - Writing effective job descriptions for all industries and roles
            - Creating interview questions for various job levels and departments
            - Candidate screening strategies and assessment methods
            - Recruitment best practices and modern hiring trends
            - HR analytics, metrics, and data-driven recruitment
            - Diversity and inclusion in hiring across all sectors
            - Onboarding processes and employee retention
            - Talent acquisition strategies and employer branding
            
            INDUSTRY EXPERTISE (All Sectors):
            - Technology (Software, IT, Data Science, AI/ML, Cybersecurity, DevOps, Cloud, Mobile, Web, Blockchain)
            - Healthcare (Doctors, Nurses, Medical Technicians, Healthcare Admin, Pharmaceuticals, Biotech)
            - Finance (Banking, Investment, Insurance, Accounting, Fintech, Risk Management, Compliance)
            - Marketing & Sales (Digital Marketing, Content, Social Media, E-commerce, Business Development)
            - Operations (Supply Chain, Logistics, Manufacturing, Quality Control, Project Management)
            - Creative (Design, Writing, Media, Advertising, Entertainment, Arts, Communications)
            - Education (Teachers, Administrators, Curriculum Design, Training, Research)
            - Legal (Lawyers, Paralegals, Compliance, Legal Tech, Corporate Law)
            - Engineering (Civil, Mechanical, Electrical, Chemical, Aerospace, Environmental)
            - Retail & Hospitality (Customer Service, Management, Operations, Sales)
            - Government & Non-profit (Public Administration, Policy, Social Work, Advocacy)
            - Consulting (Management, Strategy, IT, HR, Financial, Operations)
            - Real Estate (Agents, Brokers, Property Management, Development, Investment)
            - Agriculture & Food (Farming, Food Science, Agribusiness, Sustainability)
            - Transportation (Logistics, Aviation, Shipping, Automotive, Public Transit)
            - Energy & Utilities (Renewable Energy, Oil & Gas, Power, Environmental)
            - Sports & Fitness (Coaching, Management, Sports Medicine, Recreation)
            - Media & Entertainment (Journalism, Broadcasting, Production, Gaming)
            - Research & Development (R&D, Innovation, Product Development, Scientific Research)
            
            ROLE LEVELS:
            - Entry-level positions and graduate programs
            - Mid-level professionals and specialists
            - Senior-level experts and team leads
            - Executive and C-level positions
            - Freelancers, contractors, and gig workers
            - Interns and apprentices
            - Remote and hybrid workers
            - International and expat positions
            
            Provide helpful, professional, and actionable advice. Be concise but comprehensive.
            """
        else:
            context = """
            You are an AI career assistant powered by Gemini. You help job seekers with:
            
            GENERAL CAREER GUIDANCE:
            - Resume optimization and writing for all industries
            - Interview preparation and common questions across all roles
            - Career development and growth strategies
            - Salary negotiation and compensation analysis
            - Job search techniques and networking
            - Skill development and upskilling recommendations
            - Professional networking and relationship building
            - Career change guidance and transition planning
            - Work-life balance and personal development
            - Remote work and digital nomad advice
            
            INDUSTRY EXPERTISE (All Sectors):
            - Technology (Software Development, Data Science, AI/ML, Cybersecurity, DevOps, Cloud Computing, Mobile Development, Web Development, Blockchain, IT Support, System Administration, Database Management, Network Engineering, QA Testing, Product Management, UX/UI Design)
            - Healthcare (Medical Practice, Nursing, Medical Technology, Healthcare Administration, Pharmaceuticals, Biotechnology, Mental Health, Physical Therapy, Medical Research, Healthcare IT, Public Health, Medical Sales)
            - Finance (Banking, Investment Banking, Financial Planning, Insurance, Accounting, Auditing, Fintech, Risk Management, Compliance, Corporate Finance, Investment Analysis, Financial Consulting, Tax Preparation, Credit Analysis)
            - Marketing & Sales (Digital Marketing, Content Marketing, Social Media, E-commerce, Business Development, Sales Management, Brand Management, Market Research, Public Relations, Advertising, Customer Success, Account Management)
            - Operations (Supply Chain Management, Logistics, Manufacturing, Quality Control, Project Management, Process Improvement, Operations Research, Vendor Management, Inventory Control, Production Planning)
            - Creative (Graphic Design, Web Design, Writing, Copywriting, Photography, Videography, Music, Art, Fashion, Interior Design, Architecture, Creative Direction, Content Creation, Social Media Management)
            - Education (Teaching, Educational Administration, Curriculum Development, Training, Educational Technology, Research, Academic Writing, Student Services, Educational Consulting, Online Learning)
            - Legal (Law Practice, Corporate Law, Criminal Law, Family Law, Intellectual Property, Legal Research, Paralegal Work, Compliance, Legal Technology, Court Reporting, Legal Writing)
            - Engineering (Civil Engineering, Mechanical Engineering, Electrical Engineering, Chemical Engineering, Aerospace Engineering, Environmental Engineering, Biomedical Engineering, Industrial Engineering, Software Engineering, Systems Engineering)
            - Retail & Hospitality (Store Management, Customer Service, Sales, Merchandising, Hospitality Management, Event Planning, Tourism, Food Service, Retail Buying, Visual Merchandising, Customer Experience)
            - Government & Non-profit (Public Administration, Policy Analysis, Social Work, Community Development, Advocacy, Grant Writing, Program Management, Public Relations, Research, International Development)
            - Consulting (Management Consulting, Strategy Consulting, IT Consulting, HR Consulting, Financial Consulting, Operations Consulting, Change Management, Business Analysis, Process Improvement)
            - Real Estate (Real Estate Sales, Property Management, Real Estate Development, Real Estate Investment, Commercial Real Estate, Residential Real Estate, Real Estate Appraisal, Mortgage Lending)
            - Agriculture & Food (Farming, Agricultural Science, Food Science, Agribusiness, Agricultural Engineering, Food Safety, Agricultural Economics, Sustainable Agriculture, Food Production, Agricultural Technology)
            - Transportation (Logistics, Supply Chain, Aviation, Shipping, Automotive, Public Transit, Fleet Management, Transportation Planning, Freight Management, Port Operations)
            - Energy & Utilities (Renewable Energy, Oil & Gas, Power Generation, Environmental Engineering, Energy Management, Utility Operations, Energy Trading, Energy Policy, Energy Efficiency, Nuclear Energy)
            - Sports & Fitness (Sports Coaching, Fitness Training, Sports Medicine, Recreation Management, Sports Marketing, Athletic Administration, Sports Psychology, Physical Therapy, Sports Nutrition, Event Management)
            - Media & Entertainment (Journalism, Broadcasting, Content Production, Gaming, Film, Television, Radio, Publishing, Social Media, Digital Media, Entertainment Law, Talent Management)
            - Research & Development (Scientific Research, Product Development, Innovation, Laboratory Work, Research Analysis, Patent Law, Technical Writing, Data Analysis, Experimental Design, Quality Assurance)
            
            ROLE LEVELS:
            - Entry-level positions and graduate programs
            - Mid-level professionals and specialists
            - Senior-level experts and team leads
            - Executive and C-level positions
            - Freelancers, contractors, and gig workers
            - Interns and apprentices
            - Remote and hybrid workers
            - International and expat positions
            
            Provide helpful, encouraging, and practical advice. Be supportive and motivating.
            """
        
        # Build conversation context
        conversation_text = ""
        if conversation_history:
            for msg in conversation_history[-5:]:  # Use last 5 messages for context
                role = "User" if msg['type'] == 'user' else "Assistant"
                conversation_text += f"{role}: {msg['text']}\n"
        
        # Create the full prompt
        prompt = f"""
        {context}
        
        IMPORTANT INSTRUCTIONS:
        - You are an expert career advisor with knowledge across ALL industries, job roles, and career levels
        - Provide specific, actionable advice tailored to the user's industry and role level
        - Include relevant examples, best practices, and industry-specific insights
        - Address questions about any job type, from entry-level to executive positions
        - Cover all departments: Technology, Healthcare, Finance, Marketing, Operations, Creative, Education, Legal, Engineering, Retail, Government, Consulting, Real Estate, Agriculture, Transportation, Energy, Sports, Media, Research, and more
        - Handle career transitions, skill development, salary negotiations, and job search strategies
        - Provide industry-specific resume tips, interview questions, and networking advice
        - Be encouraging and supportive while maintaining professionalism
        - If the question is unclear, ask clarifying questions to provide better assistance
        
        Previous conversation:
        {conversation_text}
        
        Current user message: {message}
        
        Please provide a comprehensive, helpful response that addresses their specific needs and industry context.
        """
        
        # Generate response
        response = model.generate_content(prompt)
        
        return {
            'response': response.text,
            'timestamp': datetime.now().isoformat(),
            'model': 'gemini-1.5-flash'
        }
        
    except Exception as e:
        print(f"Error generating Gemini response: {str(e)}")
        return {
            'response': "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }

@app.route('/api/chat/gemini', methods=['POST'])
def chat_with_gemini():
    """
    Chat endpoint for Gemini AI
    """
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
        
        message = data['message']
        user_type = data.get('userType', 'jobSeeker')
        user_id = data.get('userId')
        conversation_history = data.get('conversationHistory', [])
        
        # Generate AI response
        ai_response = generate_gemini_response(
            message=message,
            user_type=user_type,
            user_id=user_id,
            conversation_history=conversation_history
        )
        
        return jsonify(ai_response)
        
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'response': "I'm sorry, I'm having trouble processing your request. Please try again."
        }), 500

# Add error handler for HTTPS requests
@app.errorhandler(400)
def handle_bad_request(e):
    """Handle bad requests (like HTTPS requests to HTTP server)"""
    if 'Bad request version' in str(e):
        return jsonify({
            'error': 'HTTPS request detected',
            'message': 'This server only accepts HTTP requests. Please use http:// instead of https://',
            'correct_url': f'http://{Config.HOST}:{Config.PORT}',
            'status': 400
        }), 400
    return jsonify({'error': 'Bad request', 'status': 400}), 400

# Initialize WebSocket service
init_websocket(app)


if __name__ == '__main__':
    # Create database indexes for performance
    try:
        from utils.db_indexes import create_indexes
        print("\n🔧 Setting up database indexes...")
        create_indexes()
    except Exception as e:
        print(f"⚠️ Warning: Could not create indexes: {e}")
    
    # Get port from environment variable (for deployment platforms)
    import os
    port = int(os.getenv('PORT', Config.PORT))
    is_production = os.getenv('FLASK_ENV') == 'production'
    
    print("[START] Starting AksharJobs Backend Server with WebSocket support...")
    print(f"[URL] Server will be available at: http://{Config.HOST}:{port}")
    print("[API] API endpoints available at /api/*")
    print("[WEBSOCKET] Real-time features enabled via Socket.IO")
    print(f"[MODE] Running in {'PRODUCTION' if is_production else 'DEVELOPMENT'} mode")
    if not is_production:
        print("[WARN] IMPORTANT: Use HTTP (not HTTPS) for local network access")
    print("[CTRL+C] Press Ctrl+C to stop the server")
    
    # Import socketio from the websocket service
    from services.websocket_service import socketio
    
    # Run with SocketIO support
    socketio.run(
        app,
        host='0.0.0.0',  # Allow external connections (needed for deployment)
        port=port,
        debug=not is_production,  # Disable debug in production
        use_reloader=not is_production  # Disable reloader in production
    )