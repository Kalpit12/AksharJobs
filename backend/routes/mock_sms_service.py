"""
Mock SMS Service for Development and Testing
This service simulates SMS sending when the real SMS API is not available
"""

import random
import string
from datetime import datetime, timedelta

class MockSMSService:
    def __init__(self):
        self.sent_sms = {}
        self.sms_count = 0
    
    def send_sms(self, phone_number, message):
        """Mock SMS sending - simulates the real SMS API"""
        try:
            # Generate a mock SMS ID
            sms_id = f"mock_{int(datetime.now().timestamp())}_{random.randint(1000, 9999)}"
            
            # Store the sent SMS for debugging
            self.sent_sms[sms_id] = {
                'phone_number': phone_number,
                'message': message,
                'timestamp': datetime.now(),
                'status': 'sent'
            }
            
            self.sms_count += 1
            
            # Simulate API response
            mock_response = {
                'status': 'success',
                'message': 'SMS sent successfully',
                'sms_id': sms_id,
                'phone_number': phone_number,
                'timestamp': datetime.now().isoformat(),
                'mock': True
            }
            
            print(f"📱 MOCK SMS SENT:")
            print(f"   To: {phone_number}")
            print(f"   Message: {message}")
            print(f"   SMS ID: {sms_id}")
            print(f"   Total SMS sent: {self.sms_count}")
            
            return True, mock_response
            
        except Exception as e:
            print(f"❌ Mock SMS error: {str(e)}")
            return False, {'status': 'error', 'message': str(e)}
    
    def get_sms_history(self):
        """Get history of sent SMS messages"""
        return {
            'total_sent': self.sms_count,
            'messages': self.sent_sms
        }
    
    def clear_history(self):
        """Clear SMS history"""
        self.sent_sms.clear()
        self.sms_count = 0
        return {'status': 'success', 'message': 'SMS history cleared'}

# Global instance
mock_sms_service = MockSMSService()

def get_mock_sms_service():
    """Get the global mock SMS service instance"""
    return mock_sms_service
