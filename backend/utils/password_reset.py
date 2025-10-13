import secrets
import hashlib
import datetime

def generate_reset_token(email):
    """
    Generate a secure password reset token for the given email.
    
    Args:
        email (str): The user's email address
        
    Returns:
        str: A secure reset token
    """
    # Generate a random token
    token = secrets.token_urlsafe(32)
    
    # Create a hash of the token with email for additional security
    token_data = f"{email}:{token}"
    token_hash = hashlib.sha256(token_data.encode()).hexdigest()
    
    # Combine token with hash for verification
    reset_token = f"{token}:{token_hash}"
    
    return reset_token

def verify_reset_token(token):
    """
    Verify and extract email from a password reset token.
    
    Args:
        token (str): The reset token to verify
        
    Returns:
        str or None: The email address if token is valid, None otherwise
    """
    try:
        # Split token and hash
        if ':' not in token:
            return None
            
        token_part, hash_part = token.split(':', 1)
        
        # We need to find the email by checking tokens in database
        # For now, return None as we'll validate in the route
        return None
        
    except Exception as e:
        print(f"Error verifying reset token: {e}")
        return None

def is_token_valid(token, email):
    """
    Check if a reset token is valid for the given email.
    
    Args:
        token (str): The reset token
        email (str): The user's email
        
    Returns:
        bool: True if token is valid, False otherwise
    """
    try:
        # Split token and hash
        if ':' not in token:
            return False
            
        token_part, hash_part = token.split(':', 1)
        
        # Recreate the hash
        token_data = f"{email}:{token_part}"
        expected_hash = hashlib.sha256(token_data.encode()).hexdigest()
        
        # Compare hashes
        return hash_part == expected_hash
        
    except Exception as e:
        print(f"Error validating token: {e}")
        return False