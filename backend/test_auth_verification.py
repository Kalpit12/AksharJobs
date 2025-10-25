#!/usr/bin/env python3
"""
Test script to verify authentication is working correctly
"""
from utils.db import get_db
from werkzeug.security import check_password_hash
import bcrypt

def test_password_verification():
    """Test password verification for existing users"""
    db = get_db()
    users = db['users']
    
    # Get a sample user
    sample_user = users.find_one({})
    
    if not sample_user:
        print("❌ No users found in database")
        return
    
    print(f"\n{'='*80}")
    print(f"Testing authentication for user: {sample_user.get('email')}")
    print(f"{'='*80}\n")
    
    # Check password field
    stored_password = sample_user.get('password')
    
    if not stored_password:
        print("❌ CRITICAL: User has no password field!")
        return
    
    print(f"✓ Password field exists")
    print(f"  Type: {type(stored_password)}")
    print(f"  Length: {len(stored_password) if stored_password else 0}")
    
    # Check password format
    pwd_str = stored_password if isinstance(stored_password, str) else stored_password.decode('utf-8')
    print(f"  First 30 chars: {pwd_str[:30]}")
    
    # Identify hash type
    if pwd_str.startswith('scrypt:'):
        print(f"  Hash Type: Werkzeug scrypt")
    elif pwd_str.startswith('$2b$') or pwd_str.startswith('$2a$') or pwd_str.startswith('$2y$'):
        print(f"  Hash Type: bcrypt")
    elif pwd_str.startswith('pbkdf2:'):
        print(f"  Hash Type: Werkzeug pbkdf2")
    else:
        print(f"  Hash Type: Unknown or plaintext")
        print(f"  ⚠️  WARNING: This might be a plaintext password!")
    
    # Test with correct password (you'll need to know this)
    print(f"\n{'='*80}")
    print(f"Password Verification Test")
    print(f"{'='*80}\n")
    
    test_password = input("Enter a test password to verify: ")
    
    # Try different verification methods
    print("\nTesting verification methods:")
    
    # Method 1: Werkzeug check_password_hash
    try:
        if pwd_str.startswith('scrypt:') or pwd_str.startswith('pbkdf2:'):
            result = check_password_hash(stored_password, test_password)
            print(f"  Werkzeug check_password_hash: {result}")
    except Exception as e:
        print(f"  Werkzeug check_password_hash: Failed - {e}")
    
    # Method 2: bcrypt checkpw (if bcrypt hash)
    try:
        if pwd_str.startswith('$2'):
            if isinstance(stored_password, str):
                result = bcrypt.checkpw(test_password.encode('utf-8'), stored_password.encode('utf-8'))
            else:
                result = bcrypt.checkpw(test_password.encode('utf-8'), stored_password)
            print(f"  bcrypt checkpw: {result}")
    except Exception as e:
        print(f"  bcrypt checkpw: Failed - {e}")
    
    # Method 3: Plain text comparison (BAD - but let's check)
    try:
        if pwd_str == test_password:
            print(f"  ⚠️  CRITICAL SECURITY ISSUE: Password stored as plaintext!")
            return True
        else:
            print(f"  Plaintext comparison: False (Good - password is hashed)")
    except Exception as e:
        print(f"  Plaintext comparison: Failed - {e}")

if __name__ == "__main__":
    test_password_verification()

