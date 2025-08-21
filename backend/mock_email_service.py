import random
from datetime import datetime, timedelta

class MockEmailService:
    def __init__(self):
        self.email_history = []
        self.verification_codes = {}
    
    def send_email(self, email, verification_code):
        """Mock email sending - stores the email in history"""
        timestamp = datetime.now()
        email_record = {
            'email': email,
            'verification_code': verification_code,
            'timestamp': timestamp,
            'status': 'sent'
        }
        self.email_history.append(email_record)
        
        # Store verification code for later verification
        self.verification_codes[email] = {
            'code': verification_code,
            'timestamp': timestamp,
            'expires_at': timestamp + timedelta(minutes=10)
        }
        
        print(f"📧 Mock Email Sent to {email}: Verification Code {verification_code}")
        return True
    
    def get_email_history(self):
        """Get all sent emails from mock service"""
        return self.email_history
    
    def clear_history(self):
        """Clear email history"""
        self.email_history = []
        self.verification_codes = {}
        return True
    
    def verify_code(self, email, code):
        """Verify a verification code"""
        if email not in self.verification_codes:
            return False
        
        email_data = self.verification_codes[email]
        
        # Check if code has expired
        if datetime.now() > email_data['expires_at']:
            return False
        
        # Check if code matches
        if email_data['code'] == code:
            # Remove the code after successful verification
            del self.verification_codes[email]
            return True
        
        return False

# Global instance
mock_email_service = MockEmailService()

def get_mock_email_service():
    """Get the global mock email service instance"""
    return mock_email_service
