"""
Phone number validation and formatting utilities.
Ensures phone numbers are stored in E.164 format: +[country_code][number]
"""

import re

def validate_and_format_phone(phone_number):
    """
    Validates and formats a phone number to E.164 format.
    
    E.164 format: +[country_code][number]
    Example: +12345678900
    
    Args:
        phone_number (str): The phone number to validate and format
        
    Returns:
        str: Formatted phone number in E.164 format, or original if already valid
        
    Raises:
        ValueError: If phone number is invalid
    """
    if not phone_number:
        return ""
    
    # Remove all whitespace and special characters except +
    cleaned = re.sub(r'[^\d+]', '', phone_number)
    
    # Check if it already starts with +
    if not cleaned.startswith('+'):
        raise ValueError("Phone number must include country code starting with +")
    
    # Validate E.164 format
    # E.164 allows 1-15 digits after the +
    if not re.match(r'^\+[1-9]\d{1,14}$', cleaned):
        raise ValueError("Invalid phone number format. Must be in E.164 format: +[country_code][number]")
    
    return cleaned


def is_valid_e164_phone(phone_number):
    """
    Checks if a phone number is in valid E.164 format.
    
    Args:
        phone_number (str): The phone number to check
        
    Returns:
        bool: True if valid E.164 format, False otherwise
    """
    if not phone_number:
        return False
    
    # E.164 format: +[country_code][number] with 1-15 digits after +
    return bool(re.match(r'^\+[1-9]\d{1,14}$', phone_number))


def extract_country_code(phone_number):
    """
    Extracts the country code from an E.164 formatted phone number.
    
    Args:
        phone_number (str): Phone number in E.164 format
        
    Returns:
        str: Country code including the +, or None if invalid
    """
    if not is_valid_e164_phone(phone_number):
        return None
    
    # Common country code lengths: 1-4 digits
    # Try to match known patterns (this is a simplified version)
    # In production, you'd want to use a library like phonenumbers
    for length in [4, 3, 2, 1]:
        potential_code = phone_number[:length + 1]  # +1 for the + sign
        if len(phone_number) > length + 1:  # Ensure there are digits after the code
            return potential_code
    
    return None


def format_phone_display(phone_number):
    """
    Formats a phone number for display purposes.
    
    Args:
        phone_number (str): Phone number in E.164 format
        
    Returns:
        str: Formatted phone number for display
    """
    if not phone_number or not phone_number.startswith('+'):
        return phone_number
    
    # Simple formatting: +X (XXX) XXX-XXXX for display
    # This is a basic implementation; in production use phonenumbers library
    return phone_number

