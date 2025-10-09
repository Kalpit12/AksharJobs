"""
Email configuration settings
"""

import os

# Email Configuration
EMAIL_CONFIG = {
    'SMTP_SERVER': os.getenv('SMTP_SERVER', 'smtp.gmail.com'),
    'SMTP_PORT': int(os.getenv('SMTP_PORT', '587')),
    'SENDER_EMAIL': os.getenv('SENDER_EMAIL', 'noreply@aksharjobs.com'),
    'SENDER_PASSWORD': os.getenv('SENDER_PASSWORD', ''),
    'SENDER_NAME': os.getenv('SENDER_NAME', 'AksharJobs Team'),
    'USE_TLS': True,
    'USE_SSL': False,
}

# Email Templates Configuration
EMAIL_TEMPLATES = {
    'FROM_NAME': 'AksharJobs',
    'FROM_EMAIL': 'noreply@aksharjobs.com',
    'REPLY_TO': 'support@aksharjobs.com',
    'COMPANY_NAME': 'AksharJobs',
    'COMPANY_WEBSITE': 'https://aksharjobs.com',
    'SUPPORT_EMAIL': 'support@aksharjobs.com',
}

# Status to Email Template Mapping
STATUS_EMAIL_MAPPING = {
    'reviewed': 'Application Under Review',
    'shortlisted': 'Application Shortlisted',
    'interview_scheduled': 'Interview Invitation',
    'accepted': 'Job Offer',
    'rejected': 'Application Update',
}

# Email sending settings
EMAIL_SETTINGS = {
    'MAX_RETRIES': 3,
    'RETRY_DELAY': 5,  # seconds
    'BATCH_SIZE': 50,  # for bulk emails
    'TIMEOUT': 30,  # seconds
}
