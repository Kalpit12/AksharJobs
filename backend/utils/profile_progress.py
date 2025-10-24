"""
Profile Progress Calculation Utility
Provides consistent progress calculation across dashboard and profile pages
"""

def calculate_profile_completion(user_data):
    """
    Calculate profile completion percentage based on filled fields
    
    Returns:
        int: Percentage from 0-100
    """
    if not user_data:
        return 0
    
    # Define weighted fields for comprehensive profile
    # Each category has a weight based on importance
    
    required_fields = {
        # Personal Information (20 points)
        'personal': {
            'weight': 20,
            'fields': ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender']
        },
        # Location & Residency (15 points)
        'location': {
            'weight': 15,
            'fields': ['nationality', 'residentCountry', 'currentCity', 'address']
        },
        # Professional Profile (25 points)
        'professional': {
            'weight': 25,
            'fields': ['professionalTitle', 'yearsExperience', 'careerLevel', 'industry', 'summary']
        },
        # Skills (15 points)
        'skills': {
            'weight': 15,
            'fields': ['coreSkills', 'tools']
        },
        # Education (10 points)
        'education': {
            'weight': 10,
            'fields': ['educationEntries']
        },
        # Experience (10 points)
        'experience': {
            'weight': 10,
            'fields': ['experienceEntries']
        },
        # Languages (5 points)
        'languages': {
            'weight': 5,
            'fields': ['languages']
        }
    }
    
    total_score = 0
    max_score = 100
    
    for category, details in required_fields.items():
        category_weight = details['weight']
        category_fields = details['fields']
        fields_count = len(category_fields)
        
        if fields_count == 0:
            continue
        
        filled_count = 0
        for field in category_fields:
            value = user_data.get(field)
            
            # Check if field has meaningful data
            if field in ['coreSkills', 'tools', 'educationEntries', 'experienceEntries', 'languages']:
                # Array fields - check if has items
                if isinstance(value, list) and len(value) > 0:
                    filled_count += 1
            else:
                # Regular fields - check if not empty
                if value and value != '' and value != 'N/A':
                    filled_count += 1
        
        # Calculate category score
        category_score = (filled_count / fields_count) * category_weight
        total_score += category_score
    
    # Round to nearest integer
    return int(round(total_score))


def get_profile_status(user_data):
    """
    Get comprehensive profile status information
    
    Returns:
        dict: Status information including completion percentage, missing fields, etc.
    """
    completion = calculate_profile_completion(user_data)
    is_draft = user_data.get('isDraft', False)
    profile_completed = user_data.get('profileCompleted', False)
    
    status = {
        'completionPercentage': completion,
        'isDraft': is_draft,
        'profileCompleted': profile_completed,
        'isComplete': completion >= 85 and profile_completed and not is_draft,
        'needsAttention': completion < 85 or is_draft,
        'status': 'complete' if (completion >= 85 and profile_completed and not is_draft) else 'incomplete'
    }
    
    # Identify missing critical fields
    missing_fields = []
    
    critical_fields = {
        'dateOfBirth': 'Date of Birth',
        'gender': 'Gender',
        'nationality': 'Nationality',
        'currentCity': 'Current City',
        'professionalTitle': 'Professional Title',
        'yearsExperience': 'Years of Experience',
        'coreSkills': 'Core Skills',
        'educationEntries': 'Education',
        'experienceEntries': 'Work Experience',
        'languages': 'Languages'
    }
    
    for field_key, field_label in critical_fields.items():
        value = user_data.get(field_key)
        
        if field_key in ['coreSkills', 'educationEntries', 'experienceEntries', 'languages']:
            if not isinstance(value, list) or len(value) == 0:
                missing_fields.append(field_label)
        else:
            if not value or value == '' or value == 'N/A':
                missing_fields.append(field_label)
    
    status['missingFields'] = missing_fields
    status['missingFieldsCount'] = len(missing_fields)
    
    return status


def get_completion_message(completion_percentage, is_draft=False):
    """
    Get user-friendly completion message
    
    Args:
        completion_percentage (int): Profile completion percentage
        is_draft (bool): Whether profile is saved as draft
    
    Returns:
        str: User-friendly message
    """
    if is_draft:
        return f"Draft saved ({completion_percentage}% complete). Continue editing to complete your profile."
    elif completion_percentage >= 85:
        return "Your profile is complete! You're ready to apply for jobs."
    elif completion_percentage >= 50:
        return f"You're halfway there! Complete your profile to increase your chances."
    elif completion_percentage >= 25:
        return f"Good start! Add more details to strengthen your profile."
    else:
        return "Let's build your professional profile. Start by filling in your basic information."

