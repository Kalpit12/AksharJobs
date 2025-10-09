#!/usr/bin/env python3
"""
Bulk Import Routes
API endpoints for bulk user data import from CSV/Excel files
"""

from flask import Blueprint, request, jsonify, send_file
from werkzeug.utils import secure_filename
from functools import wraps
import os
from datetime import datetime
import pandas as pd
import uuid

bulk_import_bp = Blueprint('bulk_import', __name__)

# Admin authentication decorator
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        from utils.auth_token import verify_token
        from utils.db import get_db
        from bson import ObjectId
        
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'No authorization token provided'}), 401
        
        # Remove 'Bearer ' prefix if present
        token = auth_header
        if token.startswith('Bearer '):
            token = token[7:]
        
        # Verify token and check if user is admin
        try:
            decoded_token = verify_token(token)
            if not decoded_token:
                return jsonify({'error': 'Invalid token'}), 401
            
            current_user_id = decoded_token.get('sub') or decoded_token.get('userId') or decoded_token.get('user_id')
            if not current_user_id:
                return jsonify({'error': 'Could not extract user ID from token'}), 401
            
            # Get user from database
            db = get_db()
            user = db.users.find_one({"_id": ObjectId(current_user_id)})
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            # Check if user is admin
            is_admin = user.get("role") == "admin" or user.get("userType") == "admin"
            if not is_admin:
                return jsonify({'error': 'Admin access required'}), 403
            
            # Store user data in request for use in route handlers
            request.user = {'userId': str(user['_id']), 'role': user.get('role'), 'userType': user.get('userType')}
            
        except Exception as e:
            print(f"Bulk import auth error: {str(e)}")
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    return decorated_function

# Configure upload folder
UPLOAD_FOLDER = 'uploads/bulk_imports'
TEMPLATE_FOLDER = 'templates/bulk_import'
ALLOWED_EXTENSIONS = {'csv', 'xls', 'xlsx'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(TEMPLATE_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# 1. Upload bulk data file
@bulk_import_bp.route('/api/bulk-import/upload', methods=['POST'])
@admin_required
def upload_bulk_file():
    """Upload CSV/Excel file for bulk user import"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Only CSV and Excel files allowed'}), 400
        
        # Get source organization
        source = request.form.get('source', 'Unknown')
        
        # Generate batch ID
        batch_id = f"BULK_{datetime.now().strftime('%Y%m%d')}_{str(uuid.uuid4())[:8]}"
        
        # Save file
        filename = secure_filename(file.filename)
        file_extension = filename.rsplit('.', 1)[1].lower()
        saved_filename = f"{batch_id}.{file_extension}"
        file_path = os.path.join(UPLOAD_FOLDER, saved_filename)
        file.save(file_path)
        
        # Parse file to get preview and count
        from services.bulk_import_service import BulkImportService
        service = BulkImportService()
        df = service.parse_file(file_path, file_extension)
        
        # Get preview (first 5 rows)
        preview = df.head(5).to_dict('records')
        total_records = len(df)
        
        # Save to database
        from utils.db import get_db
        db = get_db()
        bulk_imports = db['bulk_imports']
        
        import_doc = {
            'batch_id': batch_id,
            'source': source,
            'uploaded_by': request.user.get('userId'),
            'file_name': filename,
            'file_type': file_extension,
            'file_path': file_path,
            'file_size': os.path.getsize(file_path),
            'total_records': total_records,
            'status': 'uploaded',
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        }
        
        bulk_imports.insert_one(import_doc)
        
        return jsonify({
            'success': True,
            'batch_id': batch_id,
            'message': 'File uploaded successfully',
            'preview': preview,
            'total_records': total_records,
            'columns': list(df.columns)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 2. Validate uploaded data
@bulk_import_bp.route('/api/bulk-import/validate/<batch_id>', methods=['POST'])
@admin_required
def validate_bulk_data(batch_id):
    """Validate uploaded data before importing"""
    try:
        from utils.db import get_db
        from services.bulk_import_service import BulkImportService
        
        db = get_db()
        bulk_imports = db['bulk_imports']
        
        # Get import record
        import_doc = bulk_imports.find_one({'batch_id': batch_id})
        if not import_doc:
            return jsonify({'error': 'Import batch not found'}), 404
        
        # Parse file
        service = BulkImportService()
        df = service.parse_file(import_doc['file_path'], import_doc['file_type'])
        
        # Validate data
        validation_results = service.validate_data(df)
        
        # Update status
        bulk_imports.update_one(
            {'batch_id': batch_id},
            {'$set': {
                'status': 'validated',
                'validation_results': validation_results,
                'updated_at': datetime.now()
            }}
        )
        
        return jsonify(validation_results), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 3. Process and import validated data
@bulk_import_bp.route('/api/bulk-import/process/<batch_id>', methods=['POST'])
@admin_required
def process_bulk_import(batch_id):
    """Process validated data and create user accounts"""
    try:
        from utils.db import get_db
        from services.bulk_import_service import BulkImportService
        import threading
        
        db = get_db()
        bulk_imports = db['bulk_imports']
        
        # Get import record
        import_doc = bulk_imports.find_one({'batch_id': batch_id})
        if not import_doc:
            return jsonify({'error': 'Import batch not found'}), 404
        
        # Get options
        options = request.get_json() or {}
        
        # Update status to processing
        bulk_imports.update_one(
            {'batch_id': batch_id},
            {'$set': {
                'status': 'processing',
                'processing_started_at': datetime.now(),
                'updated_at': datetime.now()
            }}
        )
        
        # Process synchronously for better error visibility
        try:
            print(f"🔄 Starting processing for batch {batch_id}")
            service = BulkImportService()
            df = service.parse_file(import_doc['file_path'], import_doc['file_type'])
            print(f"📄 Parsed file: {len(df)} records found")
            results = service.process_import(df, batch_id, options)
            print(f"✅ Processing complete: {len(results['successful'])} successful, {len(results['failed'])} failed, {len(results['skipped'])} skipped")
            
            # Update status
            bulk_imports.update_one(
                {'batch_id': batch_id},
                {'$set': {
                    'status': 'completed',
                    'processing_completed_at': datetime.now(),
                    'successful_imports': len(results['successful']),
                    'failed_imports': len(results['failed']),
                    'skipped_imports': len(results['skipped']),
                    'results': results,
                    'updated_at': datetime.now()
                }}
            )
            
            # Generate report
            report_path = service.generate_import_report(batch_id, results)
            bulk_imports.update_one(
                {'batch_id': batch_id},
                {'$set': {'report_path': report_path}}
            )
            
            print(f"📧 Users created with batch_id: {batch_id}")
            for user_info in results['successful'][:5]:  # Show first 5
                print(f"  - {user_info['email']} (ID: {user_info['user_id']})")
            
        except Exception as e:
            print(f"❌ Processing failed: {str(e)}")
            import traceback
            traceback.print_exc()
            bulk_imports.update_one(
                {'batch_id': batch_id},
                {'$set': {
                    'status': 'failed',
                    'error': str(e),
                    'updated_at': datetime.now()
                }}
            )
        
        return jsonify({
            'success': True,
            'batch_id': batch_id,
            'status': 'processing',
            'message': 'Import started. Check status for progress.'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 4. Get import status
@bulk_import_bp.route('/api/bulk-import/status/<batch_id>', methods=['GET'])
@admin_required
def get_import_status(batch_id):
    """Get current status of bulk import"""
    try:
        from utils.db import get_db
        
        db = get_db()
        bulk_imports = db['bulk_imports']
        
        import_doc = bulk_imports.find_one({'batch_id': batch_id})
        if not import_doc:
            return jsonify({'error': 'Import batch not found'}), 404
        
        # Calculate progress
        progress = 0
        if import_doc['status'] == 'completed':
            progress = 100
        elif import_doc['status'] == 'processing':
            progress = 50  # Simplified progress tracking
        
        response = {
            'batch_id': batch_id,
            'status': import_doc['status'],
            'progress': progress,
            'total_records': import_doc.get('total_records', 0),
            'successful': import_doc.get('successful_imports', 0),
            'failed': import_doc.get('failed_imports', 0),
            'skipped': import_doc.get('skipped_imports', 0)
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 5. Get import history
@bulk_import_bp.route('/api/bulk-import/history', methods=['GET'])
@admin_required
def get_import_history():
    """Get list of all bulk imports"""
    try:
        from utils.db import get_db
        from bson import ObjectId
        
        db = get_db()
        bulk_imports = db['bulk_imports']
        users = db['users']
        
        # Get pagination params
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        skip = (page - 1) * limit
        
        # Get filters
        source_filter = request.args.get('source')
        status_filter = request.args.get('status')
        
        # Build query
        query = {}
        if source_filter:
            query['source'] = source_filter
        if status_filter:
            query['status'] = status_filter
        
        # Don't show archived imports by default
        show_archived = request.args.get('show_archived', 'false').lower() == 'true'
        if not show_archived:
            query['archived'] = {'$ne': True}
        
        # Get imports
        total_count = bulk_imports.count_documents(query)
        imports = list(bulk_imports.find(query).sort('created_at', -1).skip(skip).limit(limit))
        
        # Format response
        formatted_imports = []
        for imp in imports:
            # Get uploader name
            uploader = users.find_one({'_id': ObjectId(imp['uploaded_by'])}) if imp.get('uploaded_by') else None
            uploader_name = f"{uploader.get('firstName', '')} {uploader.get('lastName', '')}" if uploader else 'Unknown'
            
            formatted_imports.append({
                'batch_id': imp['batch_id'],
                'source': imp['source'],
                'description': imp.get('description', f"Bulk import from {imp['source']}"),
                'uploaded_by': uploader_name,
                'file_name': imp['file_name'],
                'total_records': imp.get('total_records', 0),
                'successful': imp.get('successful_imports', 0),
                'failed': imp.get('failed_imports', 0),
                'status': imp['status'],
                'archived': imp.get('archived', False),
                'created_at': imp['created_at'].isoformat() if imp.get('created_at') else None
            })
        
        return jsonify({
            'imports': formatted_imports,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_count,
                'pages': (total_count + limit - 1) // limit
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 6. Download import report
@bulk_import_bp.route('/api/bulk-import/report/<batch_id>', methods=['GET'])
@admin_required
def download_import_report(batch_id):
    """Download detailed import report"""
    try:
        from utils.db import get_db
        
        db = get_db()
        bulk_imports = db['bulk_imports']
        
        import_doc = bulk_imports.find_one({'batch_id': batch_id})
        if not import_doc:
            return jsonify({'error': 'Import batch not found'}), 404
        
        report_path = import_doc.get('report_path')
        if not report_path or not os.path.exists(report_path):
            return jsonify({'error': 'Report not found'}), 404
        
        return send_file(report_path, as_attachment=True, download_name=f'import_report_{batch_id}.csv')
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 7. Get sample template
@bulk_import_bp.route('/api/bulk-import/template/<user_type>', methods=['GET'])
def download_template(user_type):
    """Download CSV template for bulk import"""
    try:
        # Create template based on user type
        if user_type == 'jobSeeker':
            template_data = {
                'firstName': ['John', 'Jane'],
                'lastName': ['Doe', 'Smith'],
                'email': ['john.doe@example.com', 'jane.smith@example.com'],
                'phone': ['+254712345678', '+254798765432'],
                'userType': ['jobSeeker', 'jobSeeker'],
                'location': ['Nairobi, Kenya', 'Mombasa, Kenya'],
                'skills': ['Python, Java, SQL', 'Marketing, SEO, Content Writing'],
                'education': ['Bachelor Computer Science', 'MBA Marketing'],
                'experienceYears': [3, 5]
            }
        elif user_type == 'intern':
            template_data = {
                'firstName': ['Sarah', 'Michael', 'Emily'],
                'lastName': ['Wilson', 'Chen', 'Patel'],
                'email': ['sarah.wilson@university.ac.ke', 'michael.chen@university.ac.ke', 'emily.patel@university.ac.ke'],
                'phone': ['+254756789012', '+254767890123', '+254778901234'],
                'userType': ['intern', 'intern', 'intern'],
                'location': ['Nairobi, Kenya', 'Nairobi, Kenya', 'Mombasa, Kenya'],
                'universityName': ['University of Nairobi', 'Strathmore University', 'Technical University of Mombasa'],
                'studentId': ['SCT211-001/2024', 'BSC-CS-2023-145', 'DGD-2024-089'],
                'skills': ['Microsoft Office, Data Entry', 'Python, Web Development', 'Graphic Design, Adobe Creative Suite'],
                'education': ['Bachelor Business Administration (In Progress)', 'Bachelor Computer Science (In Progress)', 'Diploma Graphic Design'],
                'experienceYears': [0, 0, 1],
                'internshipPreference': ['Marketing, Business', 'Software Development, IT', 'Design, Creative'],
                'availability': ['Full-time', 'Part-time', 'Full-time']
            }
        elif user_type == 'recruiter':
            template_data = {
                'firstName': ['Alice', 'Bob'],
                'lastName': ['Johnson', 'Williams'],
                'email': ['alice@company.com', 'bob@company.com'],
                'phone': ['+254723456789', '+254734567890'],
                'userType': ['recruiter', 'recruiter'],
                'companyName': ['Tech Corp', 'Business Solutions Ltd'],
                'companyWebsite': ['https://techcorp.com', 'https://bizsolut ions.com'],
                'jobTitle': ['HR Manager', 'Talent Acquisition Lead']
            }
        else:  # mixed
            template_data = {
                'firstName': ['John', 'Alice'],
                'lastName': ['Doe', 'Johnson'],
                'email': ['john.doe@example.com', 'alice@company.com'],
                'phone': ['+254712345678', '+254723456789'],
                'userType': ['jobSeeker', 'recruiter'],
                'location': ['Nairobi, Kenya', ''],
                'companyName': ['', 'Tech Corp'],
                'skills': ['Python, Java', ''],
                'education': ['Bachelor Computer Science', '']
            }
        
        # Create DataFrame
        df = pd.DataFrame(template_data)
        
        # Save to temporary file
        template_path = os.path.join(TEMPLATE_FOLDER, f'{user_type}_template.csv')
        df.to_csv(template_path, index=False)
        
        return send_file(template_path, as_attachment=True, download_name=f'{user_type}_bulk_import_template.csv')
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 8. Send welcome emails with credentials
@bulk_import_bp.route('/api/bulk-import/send-welcome-emails/<batch_id>', methods=['POST'])
@admin_required
def send_welcome_emails(batch_id):
    """Send welcome emails with login credentials to users from a batch"""
    try:
        from utils.db import get_db
        
        db = get_db()
        users = db['users']
        bulk_imports = db['bulk_imports']
        
        # Get the import record to get the results
        import_doc = bulk_imports.find_one({'batch_id': batch_id})
        if not import_doc:
            return jsonify({'error': 'Import batch not found'}), 404
        
        # Find users from this batch
        batch_users = list(users.find({
            'bulk_import_batch_id': batch_id
        }))
        
        print(f"📊 Found {len(batch_users)} users for batch {batch_id}")
        
        emails_sent = 0
        
        # Send welcome emails with credentials
        from services.email_service import EmailService
        email_service = EmailService()
        
        for user in batch_users:
            print(f"👤 Processing user: {user.get('email')} - Has temp_password: {user.get('temp_password') is not None}")
            try:
                user_name = f"{user.get('firstName', '')} {user.get('lastName', '')}".strip()
                temp_password = user.get('temp_password', 'N/A')
                
                # Send the welcome email
                success = email_service.send_welcome_email(
                    user['email'],
                    user_name,
                    temp_password,
                    user
                )
                
                if success:
                    emails_sent += 1
                    print(f"✅ Welcome email sent to {user['email']}")
                
            except Exception as e:
                print(f"❌ Failed to send email to {user['email']}: {str(e)}")
        
        return jsonify({
            'success': True,
            'emails_sent': emails_sent,
            'message': f'Welcome emails prepared for {emails_sent} users. Check backend terminal for email details.'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 9. Archive import
@bulk_import_bp.route('/api/bulk-import/archive/<batch_id>', methods=['POST'])
@admin_required
def archive_import(batch_id):
    """Archive an import batch"""
    try:
        from utils.db import get_db
        
        db = get_db()
        bulk_imports = db['bulk_imports']
        
        # Update the import status to archived
        result = bulk_imports.update_one(
            {'batch_id': batch_id},
            {'$set': {
                'archived': True,
                'archived_at': datetime.now(),
                'updated_at': datetime.now()
            }}
        )
        
        if result.modified_count > 0:
            return jsonify({
                'success': True,
                'message': 'Import archived successfully'
            }), 200
        else:
            return jsonify({'error': 'Import batch not found'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 10. Get import details
@bulk_import_bp.route('/api/bulk-import/details/<batch_id>', methods=['GET'])
@admin_required
def get_import_details(batch_id):
    """Get detailed information about an import"""
    try:
        from utils.db import get_db
        from bson import ObjectId
        
        db = get_db()
        bulk_imports = db['bulk_imports']
        users = db['users']
        
        # Get import record
        import_doc = bulk_imports.find_one({'batch_id': batch_id})
        if not import_doc:
            return jsonify({'error': 'Import batch not found'}), 404
        
        # Get imported users
        imported_users = list(users.find(
            {'bulk_import_batch_id': batch_id},
            {'firstName': 1, 'lastName': 1, 'email': 1}
        ))
        
        # Format user list
        user_list = [
            {
                'name': f"{user.get('firstName', '')} {user.get('lastName', '')}",
                'email': user.get('email', '')
            }
            for user in imported_users
        ]
        
        return jsonify({
            'batch_id': batch_id,
            'source': import_doc['source'],
            'file_name': import_doc['file_name'],
            'status': import_doc['status'],
            'total_records': import_doc.get('total_records', 0),
            'successful': import_doc.get('successful_imports', 0),
            'failed': import_doc.get('failed_imports', 0),
            'created_at': import_doc['created_at'].isoformat() if import_doc.get('created_at') else None,
            'imported_users': user_list
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 11. Delete/Remove import
@bulk_import_bp.route('/api/bulk-import/delete/<batch_id>', methods=['DELETE'])
@admin_required
def delete_import(batch_id):
    """Delete an import batch and optionally its users"""
    try:
        from utils.db import get_db
        
        db = get_db()
        bulk_imports = db['bulk_imports']
        
        # Get the import record first
        import_doc = bulk_imports.find_one({'batch_id': batch_id})
        if not import_doc:
            return jsonify({'error': 'Import batch not found'}), 404
        
        # Delete the import record
        bulk_imports.delete_one({'batch_id': batch_id})
        
        # Optionally delete the uploaded file
        if import_doc.get('file_path') and os.path.exists(import_doc['file_path']):
            try:
                os.remove(import_doc['file_path'])
            except:
                pass
        
        return jsonify({
            'success': True,
            'message': 'Import removed successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 11. Resend verification emails
@bulk_import_bp.route('/api/bulk-import/resend-verification/<batch_id>', methods=['POST'])
@admin_required
def resend_verification_emails(batch_id):
    """Resend verification emails to unverified users from a batch"""
    try:
        from utils.db import get_db
        
        db = get_db()
        users = db['users']
        
        # Find unverified users from this batch
        unverified_users = list(users.find({
            'bulk_import_batch_id': batch_id,
            'emailVerified': False
        }))
        
        emails_sent = 0
        
        for user in unverified_users:
            try:
                # TODO: Implement actual email sending
                print(f"📧 Would send verification email to {user['email']}")
                emails_sent += 1
            except Exception as e:
                print(f"Failed to send email to {user['email']}: {str(e)}")
        
        return jsonify({
            'success': True,
            'emails_sent': emails_sent,
            'message': f'Verification emails would be sent to {emails_sent} pending users'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

