#!/usr/bin/env python3
"""
Security Logger for AksharJobs
Logs security-related events for monitoring and forensics
"""

import logging
import json
import os
from datetime import datetime
from collections import defaultdict
from datetime import timedelta

# Create logs directory if it doesn't exist
os.makedirs('logs', exist_ok=True)

# Configure security logger
security_logger = logging.getLogger('security')
security_logger.setLevel(logging.INFO)

# File handler for security events
handler = logging.FileHandler('logs/security.log')
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
security_logger.addHandler(handler)

# Console handler for development
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)
security_logger.addHandler(console_handler)


def log_security_event(event_type, details, ip_address=None, user_id=None, severity='INFO'):
    """
    Log security-related events
    
    Args:
        event_type: Type of security event (e.g., LOGIN_SUCCESS, LOGIN_FAILED, etc.)
        details: Description of the event
        ip_address: IP address of the request
        user_id: User ID if applicable
        severity: Severity level (INFO, WARNING, ERROR, CRITICAL)
    """
    log_entry = {
        'timestamp': datetime.utcnow().isoformat(),
        'event_type': event_type,
        'details': details,
        'ip_address': ip_address,
        'user_id': str(user_id) if user_id else None,
        'severity': severity
    }
    
    log_message = json.dumps(log_entry)
    
    if severity == 'CRITICAL':
        security_logger.critical(log_message)
    elif severity == 'ERROR':
        security_logger.error(log_message)
    elif severity == 'WARNING':
        security_logger.warning(log_message)
    else:
        security_logger.info(log_message)


# Track failed login attempts for brute force detection
failed_attempts = defaultdict(list)
blocked_ips = {}


def check_brute_force(ip_address, max_attempts=5, window_minutes=15, block_duration_minutes=60):
    """
    Check if IP address is attempting brute force attack
    
    Args:
        ip_address: IP address to check
        max_attempts: Maximum failed attempts allowed
        window_minutes: Time window to count attempts
        block_duration_minutes: How long to block after max attempts
    
    Returns:
        tuple: (is_blocked: bool, message: str or None)
    """
    now = datetime.utcnow()
    
    # Check if IP is currently blocked
    if ip_address in blocked_ips:
        blocked_until = blocked_ips[ip_address]
        if now < blocked_until:
            remaining = (blocked_until - now).seconds // 60
            log_security_event(
                'BLOCKED_IP_ATTEMPT',
                f'Blocked IP {ip_address} attempted access',
                ip_address=ip_address,
                severity='WARNING'
            )
            return True, f"Too many failed attempts. Try again in {remaining} minutes."
        else:
            # Block expired, remove from blocked list
            del blocked_ips[ip_address]
            failed_attempts[ip_address] = []
    
    # Clean old attempts outside the time window
    failed_attempts[ip_address] = [
        attempt for attempt in failed_attempts[ip_address]
        if now - attempt < timedelta(minutes=window_minutes)
    ]
    
    # Check if exceeded max attempts
    attempt_count = len(failed_attempts[ip_address])
    
    if attempt_count >= max_attempts:
        # Block the IP
        blocked_until = now + timedelta(minutes=block_duration_minutes)
        blocked_ips[ip_address] = blocked_until
        
        log_security_event(
            'IP_BLOCKED_BRUTE_FORCE',
            f'IP {ip_address} blocked for {block_duration_minutes} minutes after {max_attempts} failed attempts',
            ip_address=ip_address,
            severity='WARNING'
        )
        
        return True, f"Too many failed attempts. Account temporarily locked for {block_duration_minutes} minutes."
    
    return False, None


def record_failed_attempt(ip_address, email=None):
    """
    Record a failed login attempt
    
    Args:
        ip_address: IP address of the attempt
        email: Email address used in attempt (optional)
    """
    failed_attempts[ip_address].append(datetime.utcnow())
    
    log_security_event(
        'LOGIN_FAILED',
        f'Failed login attempt{f" for email: {email}" if email else ""}',
        ip_address=ip_address,
        severity='INFO'
    )


def clear_failed_attempts(ip_address):
    """
    Clear failed attempts for an IP (called on successful login)
    
    Args:
        ip_address: IP address to clear
    """
    if ip_address in failed_attempts:
        del failed_attempts[ip_address]
    
    if ip_address in blocked_ips:
        del blocked_ips[ip_address]


def log_login_success(user_id, email, ip_address):
    """Log successful login"""
    log_security_event(
        'LOGIN_SUCCESS',
        f'User {email} logged in successfully',
        ip_address=ip_address,
        user_id=user_id,
        severity='INFO'
    )
    clear_failed_attempts(ip_address)


def log_signup(user_id, email, ip_address, role):
    """Log new user registration"""
    log_security_event(
        'USER_SIGNUP',
        f'New {role} registered: {email}',
        ip_address=ip_address,
        user_id=user_id,
        severity='INFO'
    )


def log_password_change(user_id, email, ip_address):
    """Log password change"""
    log_security_event(
        'PASSWORD_CHANGE',
        f'Password changed for user: {email}',
        ip_address=ip_address,
        user_id=user_id,
        severity='INFO'
    )


def log_suspicious_activity(description, ip_address=None, user_id=None):
    """Log suspicious activity"""
    log_security_event(
        'SUSPICIOUS_ACTIVITY',
        description,
        ip_address=ip_address,
        user_id=user_id,
        severity='WARNING'
    )


def log_invalid_token(ip_address):
    """Log invalid token attempt"""
    log_security_event(
        'INVALID_TOKEN',
        'Invalid or expired token used',
        ip_address=ip_address,
        severity='WARNING'
    )


def log_unauthorized_access(resource, ip_address, user_id=None):
    """Log unauthorized access attempt"""
    log_security_event(
        'UNAUTHORIZED_ACCESS',
        f'Unauthorized access attempt to: {resource}',
        ip_address=ip_address,
        user_id=user_id,
        severity='WARNING'
    )


def log_data_breach_attempt(description, ip_address, user_id=None):
    """Log potential data breach attempt"""
    log_security_event(
        'DATA_BREACH_ATTEMPT',
        description,
        ip_address=ip_address,
        user_id=user_id,
        severity='CRITICAL'
    )


# Export all logging functions
__all__ = [
    'log_security_event',
    'check_brute_force',
    'record_failed_attempt',
    'clear_failed_attempts',
    'log_login_success',
    'log_signup',
    'log_password_change',
    'log_suspicious_activity',
    'log_invalid_token',
    'log_unauthorized_access',
    'log_data_breach_attempt'
]

