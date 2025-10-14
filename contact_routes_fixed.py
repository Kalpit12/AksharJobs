from flask import Blueprint, request, jsonify
from datetime import datetime
import logging

contact_routes = Blueprint('contact_routes', __name__)

@contact_routes.route('/submit', methods=['POST'])
def submit_contact_form():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Log the contact form submission
        logging.info(f'Contact form submitted by {data.get("name")} ({data.get("email")})')
        
        # TODO: Send email notification to admin using existing email service
        # For now, just log the submission
        
        return jsonify({
            'success': True,
            'message': 'Thank you for your message! We will get back to you within 24 hours.'
        }), 201
        
    except Exception as e:
        logging.error(f'Error processing contact form: {str(e)}')
        return jsonify({'error': 'Failed to submit contact form. Please try again.'}), 500

