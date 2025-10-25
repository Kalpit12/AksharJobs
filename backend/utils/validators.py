#!/usr/bin/env python3
"""
Security Validators for AksharJobs
Validates and sanitizes user inputs to prevent attacks
"""

import re
from email_validator import validate_email, EmailNotValidError
import bleach

def validate_password_strength(password):
    """
    Validate password meets security requirements
    
    Requirements:
    - At least 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    - At least one special character
    
    Returns:
        tuple: (is_valid: bool, message: str)
    """
    if not password:
        return False, "Password is required"
    
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must contain at least one special character (!@#$%^&*)"
    
    return True, "Password is strong"


def validate_email_address(email):
    """
    Validate email format
    
    Returns:
        tuple: (is_valid: bool, normalized_email or error_message: str)
    """
    if not email:
        return False, "Email is required"
    
    try:
        validated = validate_email(email, check_deliverability=False)
        return True, validated.normalized
    except EmailNotValidError as e:
        return False, str(e)


def validate_objectid_format(id_string):
    """
    Validate MongoDB ObjectId format (24 hex characters)
    
    Returns:
        bool: True if valid ObjectId format
    """
    if not id_string:
        return False
    
    # ObjectId is 24 hexadecimal characters
    pattern = r'^[a-f\d]{24}$'
    return bool(re.match(pattern, str(id_string)))


def sanitize_string(text, max_length=10000):
    """
    Remove HTML tags and dangerous characters
    
    Args:
        text: String to sanitize
        max_length: Maximum allowed length
    
    Returns:
        str: Sanitized string
    """
    if not text:
        return ""
    
    # Convert to string if not already
    text = str(text)
    
    # Limit length to prevent DoS
    if len(text) > max_length:
        text = text[:max_length]
    
    # Remove HTML tags (allows only safe tags)
    clean_text = bleach.clean(
        text,
        tags=[],  # No HTML tags allowed
        strip=True
    )
    
    return clean_text.strip()


def sanitize_job_data(job_data):
    """
    Sanitize job posting data to prevent XSS and injection attacks
    
    Args:
        job_data: Dictionary containing job data
    
    Returns:
        dict: Sanitized job data
    """
    sanitized = {}
    
    # String fields to sanitize
    string_fields = [
        'job_title', 'company_name', 'company_website', 'location',
        'remote_option', 'job_type', 'salary_range', 'experience_required',
        'industry', 'description', 'responsibilities', 'requirements',
        'education_required', 'application_deadline', 'department',
        'country', 'state', 'city', 'office_address', 'postal_code',
        'apply_method', 'contact_email', 'hr_name', 'company_overview'
    ]
    
    for field in string_fields:
        if field in job_data:
            sanitized[field] = sanitize_string(job_data[field])
    
    # Array fields (skills, benefits, perks)
    array_fields = ['required_skills', 'benefits', 'perks', 'tools', 'target_communities']
    
    for field in array_fields:
        if field in job_data:
            if isinstance(job_data[field], list):
                sanitized[field] = [sanitize_string(item) for item in job_data[field] if item]
            elif isinstance(job_data[field], str):
                # Split comma-separated string into array
                items = [item.strip() for item in job_data[field].split(',') if item.strip()]
                sanitized[field] = [sanitize_string(item) for item in items]
            else:
                sanitized[field] = []
    
    # Numeric fields (keep as is, but validate)
    numeric_fields = ['views', 'vacancies', 'salary_min', 'salary_max']
    
    for field in numeric_fields:
        if field in job_data:
            try:
                sanitized[field] = int(job_data[field])
            except (ValueError, TypeError):
                sanitized[field] = 0
    
    # Boolean fields
    boolean_fields = ['all_communities']
    
    for field in boolean_fields:
        if field in job_data:
            sanitized[field] = bool(job_data[field])
    
    # Keep other fields as is (e.g., recruiter_id, created_at)
    other_fields = ['recruiter_id', 'created_at', 'updated_at', 'status', 'visibility']
    
    for field in other_fields:
        if field in job_data:
            sanitized[field] = job_data[field]
    
    return sanitized


def sanitize_user_profile_data(profile_data):
    """
    Sanitize user profile data
    
    Args:
        profile_data: Dictionary containing user profile data
    
    Returns:
        dict: Sanitized profile data
    """
    sanitized = {}
    
    # String fields
    string_fields = [
        'firstName', 'lastName', 'phoneNumber', 'location', 'bio',
        'currentPosition', 'companyName', 'industry', 'linkedinProfile',
        'githubProfile', 'portfolioUrl', 'jobTitle', 'designation'
    ]
    
    for field in string_fields:
        if field in profile_data:
            sanitized[field] = sanitize_string(profile_data[field], max_length=5000)
    
    # Array fields
    array_fields = [
        'skills', 'coreSkills', 'languages', 'preferredJobTitles',
        'industries', 'functions', 'careerLevels', 'recruitCountries'
    ]
    
    for field in array_fields:
        if field in profile_data:
            if isinstance(profile_data[field], list):
                sanitized[field] = [sanitize_string(item, max_length=500) for item in profile_data[field] if item]
            elif isinstance(profile_data[field], str):
                items = [item.strip() for item in profile_data[field].split(',') if item.strip()]
                sanitized[field] = [sanitize_string(item, max_length=500) for item in items]
    
    return sanitized


def validate_file_upload(filename, allowed_extensions, max_size_mb=10):
    """
    Validate file upload
    
    Args:
        filename: Name of the file
        allowed_extensions: Set of allowed extensions (e.g., {'pdf', 'doc', 'docx'})
        max_size_mb: Maximum file size in megabytes
    
    Returns:
        tuple: (is_valid: bool, error_message or None: str)
    """
    if not filename:
        return False, "No filename provided"
    
    # Check if file has extension
    if '.' not in filename:
        return False, "File must have an extension"
    
    # Get extension
    extension = filename.rsplit('.', 1)[1].lower()
    
    # Check if extension is allowed
    if extension not in allowed_extensions:
        return False, f"File type .{extension} not allowed. Allowed types: {', '.join(allowed_extensions)}"
    
    return True, None


def validate_url(url):
    """
    Validate URL format
    
    Returns:
        bool: True if valid URL
    """
    if not url:
        return True  # Empty URL is okay
    
    # Basic URL validation
    url_pattern = re.compile(
        r'^https?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
        r'localhost|'  # localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    
    return bool(url_pattern.match(url))


def validate_phone_number(phone):
    """
    Validate phone number format (basic validation)
    
    Returns:
        tuple: (is_valid: bool, message: str)
    """
    if not phone:
        return True, ""  # Phone is optional
    
    # Remove common separators
    clean_phone = re.sub(r'[\s\-\(\)\.]+', '', phone)
    
    # Check if it's all digits (with optional + at start)
    if not re.match(r'^\+?\d{7,15}$', clean_phone):
        return False, "Phone number must contain 7-15 digits"
    
    return True, ""


# Export all validators
__all__ = [
    'validate_password_strength',
    'validate_email_address',
    'validate_objectid_format',
    'sanitize_string',
    'sanitize_job_data',
    'sanitize_user_profile_data',
    'validate_file_upload',
    'validate_url',
    'validate_phone_number'
]

