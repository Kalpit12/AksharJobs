import bcrypt
import sys
sys.path.append('.')
from utils.db import get_db

# Get user from database
db = get_db()
user = db.users.find_one({'email': 'manan.patel@example.com'})
stored_hash = user['password']
print(f"Stored hash: {stored_hash}")

# Test password verification
password = 'Test@1234'
result = bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))
print(f"Password check result: {result}")

# Generate new hash
new_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
print(f"New hash: {new_hash.decode()}")

# Update password
db.users.update_one(
    {'email': 'manan.patel@example.com'}, 
    {'$set': {'password': new_hash.decode()}}
)
print("Password updated successfully")
