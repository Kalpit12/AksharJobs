from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from functools import wraps
from datetime import datetime
from bson import ObjectId
from utils.db import get_db

template_routes = Blueprint('template_routes', __name__)

# Admin middleware
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({"error": "No authorization token"}), 401
            
            token = auth_header.split(' ')[1]
            from utils.auth_token import verify_token
            decoded_token = verify_token(token)
            
            if not decoded_token:
                return jsonify({"error": "Invalid token"}), 401
            
            current_user_id = decoded_token.get('sub')
            db = get_db()
            user = db.users.find_one({"_id": ObjectId(current_user_id)})
            
            if not user or (user.get("role") != "admin" and user.get("userType") != "admin"):
                return jsonify({"error": "Admin access required"}), 403
            
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    return decorated_function

# Dashboard Templates
@template_routes.route('/dashboard-templates', methods=['GET'])
@admin_required
def get_dashboard_templates():
    try:
        db = get_db()
        templates = db.dashboard_templates.find_one({"type": "dashboard_config"})
        
        if not templates:
            # Return default templates
            default_templates = {
                "recruiter": {
                    "name": "Recruiter Dashboard",
                    "theme": {
                        "primary": "#ff9800",
                        "secondary": "#f57c00",
                        "gradient": "linear-gradient(180deg, #FF8A65 0%, #FF7043 100%)"
                    },
                    "sections": [
                        {"id": "dashboard", "name": "Dashboard", "icon": "th-large", "enabled": True},
                        {"id": "jobs", "name": "Job Postings", "icon": "briefcase", "enabled": True},
                        {"id": "candidates", "name": "Candidates", "icon": "users", "enabled": True},
                        {"id": "analytics", "name": "Analytics", "icon": "chart-bar", "enabled": True}
                    ]
                },
                "jobSeeker": {
                    "name": "Job Seeker Dashboard",
                    "theme": {
                        "primary": "#1976d2",
                        "secondary": "#1565c0",
                        "gradient": "linear-gradient(180deg, #1976d2 0%, #1565c0 100%)"
                    },
                    "sections": [
                        {"id": "dashboard", "name": "Dashboard", "icon": "th-large", "enabled": True},
                        {"id": "jobs", "name": "Browse Jobs", "icon": "search", "enabled": True},
                        {"id": "applications", "name": "Applications", "icon": "file-alt", "enabled": True}
                    ]
                },
                "intern": {
                    "name": "Intern Dashboard",
                    "theme": {
                        "primary": "#22c55e",
                        "secondary": "#16a34a",
                        "gradient": "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                    },
                    "sections": [
                        {"id": "dashboard", "name": "Dashboard", "icon": "th-large", "enabled": True},
                        {"id": "internships", "name": "Find Internships", "icon": "search", "enabled": True}
                    ]
                }
            }
            return jsonify(default_templates)
        
        return jsonify(templates.get("templates", {}))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@template_routes.route('/dashboard-templates', methods=['PUT'])
@admin_required
def update_dashboard_templates():
    try:
        data = request.get_json()
        db = get_db()
        
        db.dashboard_templates.update_one(
            {"type": "dashboard_config"},
            {"$set": {
                "templates": data,
                "updatedAt": datetime.utcnow()
            }},
            upsert=True
        )
        
        return jsonify({"message": "Templates updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Message Templates
@template_routes.route('/message-templates', methods=['GET'])
@admin_required
def get_message_templates():
    try:
        db = get_db()
        templates = list(db.message_templates.find())
        
        # Convert ObjectId to string
        for template in templates:
            template['_id'] = str(template['_id'])
        
        if not templates:
            # Return default templates
            return jsonify([
                {
                    "id": "1",
                    "name": "Welcome Email",
                    "type": "email",
                    "subject": "Welcome to AksharJobs!",
                    "body": "Hello {{firstName}},\n\nWelcome to AksharJobs!\n\nBest regards,\nThe AksharJobs Team"
                }
            ])
        
        return jsonify(templates)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@template_routes.route('/message-templates', methods=['POST'])
@admin_required
def create_message_template():
    try:
        data = request.get_json()
        db = get_db()
        
        template = {
            "name": data.get('name'),
            "type": data.get('type', 'email'),
            "subject": data.get('subject', ''),
            "body": data.get('body', ''),
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        result = db.message_templates.insert_one(template)
        template['_id'] = str(result.inserted_id)
        
        return jsonify({"message": "Template created", "template": template})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@template_routes.route('/message-templates/<template_id>', methods=['DELETE'])
@admin_required
def delete_message_template(template_id):
    try:
        db = get_db()
        db.message_templates.delete_one({"_id": ObjectId(template_id)})
        return jsonify({"message": "Template deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Send Messages/Emails
@template_routes.route('/send-message', methods=['POST'])
@admin_required
def send_message():
    try:
        data = request.get_json()
        db = get_db()
        
        # Get recipients
        query = {}
        if data.get('userType') != 'all':
            query['userType'] = data.get('userType')
        
        users = list(db.users.find(query, {"email": 1, "firstName": 1, "lastName": 1, "userType": 1}))
        
        # Process message with template variables
        subject = data.get('subject', '')
        body = data.get('body', '')
        message_type = data.get('type', 'email')
        
        sent_count = 0
        
        for user in users:
            # Replace variables
            personalized_subject = subject.replace('{{firstName}}', user.get('firstName', ''))
            personalized_body = body.replace('{{firstName}}', user.get('firstName', ''))
            personalized_body = personalized_body.replace('{{lastName}}', user.get('lastName', ''))
            personalized_body = personalized_body.replace('{{email}}', user.get('email', ''))
            
            if message_type == 'email':
                # Send email (integrate with email service)
                # For now, store in database
                db.sent_emails.insert_one({
                    "recipientId": user['_id'],
                    "recipientEmail": user.get('email'),
                    "subject": personalized_subject,
                    "body": personalized_body,
                    "sentAt": datetime.utcnow(),
                    "status": "sent"
                })
            else:
                # Send in-app message
                db.messages.insert_one({
                    "recipientId": user['_id'],
                    "senderId": "admin",
                    "subject": personalized_subject,
                    "body": personalized_body,
                    "sentAt": datetime.utcnow(),
                    "read": False
                })
            
            sent_count += 1
        
        # Save to sent messages history
        db.sent_messages_history.insert_one({
            "subject": subject,
            "body": body,
            "type": message_type,
            "recipientCount": sent_count,
            "userType": data.get('userType'),
            "sentAt": datetime.utcnow()
        })
        
        return jsonify({
            "message": "Messages sent successfully",
            "sentCount": sent_count
        })
    except Exception as e:
        print(f"Error sending message: {e}")
        return jsonify({"error": str(e)}), 500

@template_routes.route('/sent-messages', methods=['GET'])
@admin_required
def get_sent_messages():
    try:
        db = get_db()
        messages = list(db.sent_messages_history.find().sort("sentAt", -1).limit(50))
        
        # Convert ObjectId to string
        for msg in messages:
            msg['_id'] = str(msg['_id'])
            msg['sentAt'] = msg['sentAt'].isoformat() if msg.get('sentAt') else None
        
        return jsonify(messages)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
