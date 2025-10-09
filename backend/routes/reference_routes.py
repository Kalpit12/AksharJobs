from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import secrets
import string
from utils.db import get_db

reference_bp = Blueprint('reference', __name__)

# Email configuration
SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
SMTP_USERNAME = os.getenv('SMTP_USERNAME', '')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD', '')
FROM_EMAIL = os.getenv('FROM_EMAIL', 'noreply@aksharjobs.com')

# Test email configuration - override reference emails for testing
TEST_EMAIL = 'kalpitpatel751@gmail.com'

def generate_verification_token():
    """Generate a secure verification token"""
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))

def send_verification_email(reference_email, reference_name, candidate_name, verification_token):
    """Send verification email to reference"""
    try:
        # For testing purposes, send all emails to test email
        actual_email = TEST_EMAIL
        print(f"📧 TESTING: Sending verification email to {actual_email} instead of {reference_email}")
        
        # Create verification URL
        base_url = os.getenv('FRONTEND_URL', 'http://localhost:3003')
        verification_url = f"{base_url}/verify-reference/{verification_token}"
        
        # Create email content
        subject = f"Reference Verification Request - {candidate_name}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Reference Verification Request</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
                .content {{ background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }}
                .button {{ display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
                .test-notice {{ background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin-bottom: 20px; color: #92400e; }}
                .original-info {{ background: #e0f2fe; border: 1px solid #0ea5e9; padding: 15px; border-radius: 8px; margin-bottom: 20px; color: #0c4a6e; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Reference Verification Request</h1>
                </div>
                <div class="content">
                    <div class="test-notice">
                        <strong>🧪 TEST EMAIL:</strong> This is a test email. In production, this would be sent to {reference_email}.
                    </div>
                    
                    <div class="original-info">
                        <strong>Original Reference Details:</strong><br>
                        <strong>Name:</strong> {reference_name}<br>
                        <strong>Email:</strong> {reference_email}
                    </div>
                    
                    <p>Dear {reference_name},</p>
                    
                    <p><strong>{candidate_name}</strong> has listed you as a professional reference on their AksharJobs profile and would like you to verify your professional relationship.</p>
                    
                    <p>This verification will help enhance their profile credibility and assist them in their job search.</p>
                    
                    <p><strong>What you need to do:</strong></p>
                    <ul>
                        <li>Click the verification button below</li>
                        <li>Confirm your professional relationship with {candidate_name}</li>
                        <li>Optionally provide a brief recommendation</li>
                    </ul>
                    
                    <div style="text-align: center;">
                        <a href="{verification_url}" class="button">Verify Reference</a>
                    </div>
                    
                    <p><strong>Note:</strong> This verification is completely voluntary and you can decline if you prefer not to participate.</p>
                    
                    <p>If you have any questions or concerns, please contact us at support@aksharjobs.com</p>
                    
                    <p>Thank you for your time and support.</p>
                    
                    <p>Best regards,<br>The AksharJobs Team</p>
                </div>
                <div class="footer">
                    <p>This email was sent from AksharJobs. If you did not expect this email, please ignore it.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"[TEST] {subject}"
        msg['From'] = FROM_EMAIL
        msg['To'] = actual_email
        
        # Attach HTML content
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        # Send email
        if SMTP_USERNAME and SMTP_PASSWORD:
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
            server.quit()
            print(f"✅ TEST EMAIL SENT: Verification email sent to {actual_email}")
            return True
        else:
            print(f"📧 TEST EMAIL (No SMTP configured): Would send to {actual_email} with verification URL: {verification_url}")
            return True
            
    except Exception as e:
        print(f"Error sending verification email: {e}")
        return False

@reference_bp.route('/add', methods=['POST'])
@jwt_required()
def add_reference():
    """Add a new reference"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'company', 'position', 'relationship', 'yearsKnown']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Check if user already has this reference
        existing_reference = db.references.find_one({
            'user_id': ObjectId(current_user_id),
            'email': data['email']
        })
        
        if existing_reference:
            return jsonify({'error': 'Reference with this email already exists'}), 400
        
        # Generate verification token
        verification_token = generate_verification_token()
        
        # Create reference document
        reference = {
            'user_id': ObjectId(current_user_id),
            'name': data['name'],
            'email': data['email'],
            'phone': data['phone'],
            'company': data['company'],
            'position': data['position'],
            'relationship': data['relationship'],
            'yearsKnown': int(data['yearsKnown']),
            'additionalInfo': data.get('additionalInfo', ''),
            'status': 'pending',
            'verification_token': verification_token,
            'created_at': datetime.now(),
            'verified_at': None,
            'verified_by': None
        }
        
        # Insert reference
        result = db.references.insert_one(reference)
        reference_id = result.inserted_id
        
        # Get user details for email
        user = db.users.find_one({'_id': ObjectId(current_user_id)})
        candidate_name = f"{user.get('firstName', '')} {user.get('lastName', '')}".strip()
        
        # Send verification email
        email_sent = send_verification_email(
            data['email'],
            data['name'],
            candidate_name,
            verification_token
        )
        
        if not email_sent:
            print(f"Warning: Could not send verification email to {data['email']}")
        
        return jsonify({
            'message': 'Reference added successfully',
            'reference_id': str(reference_id),
            'email_sent': email_sent
        }), 201
        
    except Exception as e:
        print(f"Error adding reference: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@reference_bp.route('/my-references', methods=['GET'])
@jwt_required()
def get_my_references():
    """Get user's references"""
    try:
        current_user_id = get_jwt_identity()
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Get user's references
        references = list(db.references.find({'user_id': ObjectId(current_user_id)}))
        
        # Convert ObjectId to string
        for ref in references:
            ref['_id'] = str(ref['_id'])
            ref['user_id'] = str(ref['user_id'])
            # Convert datetime to string
            if ref.get('created_at'):
                ref['created_at'] = ref['created_at'].isoformat()
            if ref.get('verified_at'):
                ref['verified_at'] = ref['verified_at'].isoformat()
        
        return jsonify({'references': references}), 200
        
    except Exception as e:
        print(f"Error fetching references: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@reference_bp.route('/delete/<reference_id>', methods=['DELETE'])
@jwt_required()
def delete_reference(reference_id):
    """Delete a reference"""
    try:
        current_user_id = get_jwt_identity()
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Check if reference belongs to user
        reference = db.references.find_one({
            '_id': ObjectId(reference_id),
            'user_id': ObjectId(current_user_id)
        })
        
        if not reference:
            return jsonify({'error': 'Reference not found'}), 404
        
        # Delete reference
        db.references.delete_one({'_id': ObjectId(reference_id)})
        
        return jsonify({'message': 'Reference deleted successfully'}), 200
        
    except Exception as e:
        print(f"Error deleting reference: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@reference_bp.route('/verify/<token>', methods=['GET'])
def get_verification_page(token):
    """Get verification page for reference"""
    try:
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Find reference by token
        reference = db.references.find_one({'verification_token': token})
        
        if not reference:
            return jsonify({'error': 'Invalid verification token'}), 404
        
        # Get user details
        user = db.users.find_one({'_id': reference['user_id']})
        candidate_name = f"{user.get('firstName', '')} {user.get('lastName', '')}".strip()
        
        return jsonify({
            'reference': {
                'name': reference['name'],
                'email': reference['email'],
                'company': reference['company'],
                'position': reference['position'],
                'relationship': reference['relationship'],
                'yearsKnown': reference['yearsKnown'],
                'status': reference['status']
            },
            'candidate': {
                'name': candidate_name,
                'email': user.get('email', '')
            }
        }), 200
        
    except Exception as e:
        print(f"Error getting verification page: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@reference_bp.route('/verify/<token>', methods=['POST'])
def verify_reference(token):
    """Verify reference"""
    try:
        data = request.get_json()
        action = data.get('action')  # 'approve' or 'reject'
        recommendation = data.get('recommendation', '')
        
        if action not in ['approve', 'reject']:
            return jsonify({'error': 'Invalid action'}), 400
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Find reference by token
        reference = db.references.find_one({'verification_token': token})
        
        if not reference:
            return jsonify({'error': 'Invalid verification token'}), 404
        
        if reference['status'] != 'pending':
            return jsonify({'error': 'Reference has already been processed'}), 400
        
        # Update reference status
        update_data = {
            'status': 'verified' if action == 'approve' else 'rejected',
            'verified_at': datetime.now(),
            'verified_by': reference['email']
        }
        
        if action == 'approve' and recommendation:
            update_data['recommendation'] = recommendation
        
        db.references.update_one(
            {'verification_token': token},
            {'$set': update_data}
        )
        
        # Get user details for notification
        user = db.users.find_one({'_id': reference['user_id']})
        candidate_name = f"{user.get('firstName', '')} {user.get('lastName', '')}".strip()
        
        # Send notification email to candidate
        try:
            if SMTP_USERNAME and SMTP_PASSWORD:
                subject = f"Reference Verification Update - {reference['name']}"
                
                if action == 'approve':
                    message = f"Great news! {reference['name']} has verified your reference. This will enhance your profile credibility."
                else:
                    message = f"{reference['name']} has declined to verify your reference. You may want to contact them directly or add a different reference."
                
                msg = MIMEText(message)
                msg['Subject'] = f"[TEST] {subject}"
                msg['From'] = FROM_EMAIL
                msg['To'] = TEST_EMAIL  # Send to test email instead of candidate
                
                server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
                server.starttls()
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.send_message(msg)
                server.quit()
                print(f"✅ TEST NOTIFICATION SENT: Reference verification update sent to {TEST_EMAIL}")
        except Exception as e:
            print(f"Error sending notification email: {e}")
        
        return jsonify({
            'message': f'Reference {action}d successfully',
            'status': update_data['status']
        }), 200
        
    except Exception as e:
        print(f"Error verifying reference: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@reference_bp.route('/verification-stats', methods=['GET'])
@jwt_required()
def get_verification_stats():
    """Get reference verification statistics for user"""
    try:
        current_user_id = get_jwt_identity()
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Get reference counts by status
        pipeline = [
            {'$match': {'user_id': ObjectId(current_user_id)}},
            {'$group': {
                '_id': '$status',
                'count': {'$sum': 1}
            }}
        ]
        
        stats = list(db.references.aggregate(pipeline))
        
        # Format stats
        result = {
            'total': 0,
            'verified': 0,
            'pending': 0,
            'rejected': 0
        }
        
        for stat in stats:
            status = stat['_id']
            count = stat['count']
            result['total'] += count
            result[status] = count
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error getting verification stats: {e}")
        return jsonify({'error': 'Internal server error'}), 500
