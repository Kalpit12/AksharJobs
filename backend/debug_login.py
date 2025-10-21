import sys
sys.path.append('.')
from services.auth_service import AuthService

# Test login data
data = {
    'email': 'manan.patel@example.com',
    'password': 'Test@1234'
}

print("Testing login with data:", data)
response, status = AuthService.login(data)
print(f"Response: {response}")
print(f"Status: {status}")
