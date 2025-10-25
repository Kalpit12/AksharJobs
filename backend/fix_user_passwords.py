#!/usr/bin/env python3
"""
Script to audit and fix user passwords in the database.
This will identify users with improperly hashed or missing passwords.
"""
from utils.db import get_db
import bcrypt

def audit_user_passwords():
    """Audit all user passwords in the database"""
    db = get_db()
    users = db['users']
    
    print(f"\n{'='*80}")
    print("USER PASSWORD AUDIT")
    print(f"{'='*80}\n")
    
    all_users = list(users.find({}))
    total_users = len(all_users)
    
    print(f"Total users in database: {total_users}\n")
    
    issues_found = []
    bcrypt_count = 0
    werkzeug_count = 0
    missing_count = 0
    unknown_count = 0
    
    for user in all_users:
        user_id = user.get('_id')
        email = user.get('email', 'NO_EMAIL')
        password = user.get('password')
        
        # Check if password exists
        if not password:
            missing_count += 1
            issues_found.append({
                'id': user_id,
                'email': email,
                'issue': 'MISSING_PASSWORD',
                'severity': 'CRITICAL'
            })
            print(f"❌ CRITICAL: User {email} has no password field")
            continue
        
        # Convert to string if needed
        if isinstance(password, bytes):
            password = password.decode('utf-8')
        
        # Check password format
        if isinstance(password, str):
            if password.startswith('scrypt:') or password.startswith('pbkdf2:'):
                werkzeug_count += 1
                print(f"⚠️  User {email}: Uses Werkzeug hash (should migrate to bcrypt)")
            elif password.startswith('$2b$') or password.startswith('$2a$') or password.startswith('$2y$'):
                bcrypt_count += 1
                print(f"✓ User {email}: Uses bcrypt hash (SECURE)")
            elif len(password) < 20:
                unknown_count += 1
                issues_found.append({
                    'id': user_id,
                    'email': email,
                    'issue': 'POSSIBLE_PLAINTEXT',
                    'severity': 'CRITICAL',
                    'password_length': len(password)
                })
                print(f"❌ CRITICAL: User {email} has suspicious password (length: {len(password)})")
                print(f"   First 10 chars: {password[:10]}")
            else:
                unknown_count += 1
                issues_found.append({
                    'id': user_id,
                    'email': email,
                    'issue': 'UNKNOWN_HASH_FORMAT',
                    'severity': 'HIGH'
                })
                print(f"❌ User {email}: Unknown hash format")
                print(f"   First 10 chars: {password[:10]}")
        else:
            unknown_count += 1
            issues_found.append({
                'id': user_id,
                'email': email,
                'issue': 'INVALID_PASSWORD_TYPE',
                'severity': 'CRITICAL',
                'type': str(type(password))
            })
            print(f"❌ CRITICAL: User {email} has invalid password type: {type(password)}")
    
    # Print summary
    print(f"\n{'='*80}")
    print("AUDIT SUMMARY")
    print(f"{'='*80}\n")
    print(f"Total Users: {total_users}")
    print(f"  ✓ Bcrypt (Secure): {bcrypt_count}")
    print(f"  ⚠️  Werkzeug (Legacy): {werkzeug_count}")
    print(f"  ❌ Missing Password: {missing_count}")
    print(f"  ❌ Unknown/Suspicious: {unknown_count}")
    
    if issues_found:
        print(f"\n{'='*80}")
        print(f"CRITICAL ISSUES FOUND: {len(issues_found)}")
        print(f"{'='*80}\n")
        for issue in issues_found:
            print(f"  User: {issue['email']}")
            print(f"  Issue: {issue['issue']}")
            print(f"  Severity: {issue['severity']}")
            print()
    
    return issues_found

def check_specific_user(email):
    """Check a specific user's password"""
    db = get_db()
    users = db['users']
    
    user = users.find_one({"email": email})
    
    if not user:
        print(f"❌ User not found: {email}")
        return
    
    print(f"\n{'='*80}")
    print(f"USER: {email}")
    print(f"{'='*80}\n")
    
    password = user.get('password')
    
    if not password:
        print("❌ CRITICAL: No password field!")
        return
    
    if isinstance(password, bytes):
        password = password.decode('utf-8')
    
    print(f"Password Type: {type(password)}")
    print(f"Password Length: {len(password)}")
    print(f"First 50 chars: {password[:50]}")
    
    # Identify hash type
    if password.startswith('scrypt:'):
        print(f"\n✓ Hash Type: Werkzeug scrypt")
        print(f"  This is secure but should be migrated to bcrypt")
    elif password.startswith('pbkdf2:'):
        print(f"\n✓ Hash Type: Werkzeug pbkdf2")
        print(f"  This is secure but should be migrated to bcrypt")
    elif password.startswith('$2b$') or password.startswith('$2a$') or password.startswith('$2y$'):
        print(f"\n✓ Hash Type: bcrypt")
        print(f"  This is SECURE and using the recommended format")
    else:
        print(f"\n❌ CRITICAL: Unknown or plaintext password!")
        print(f"  This user cannot login securely!")
    
    # Test password verification
    print(f"\n{'='*80}")
    print("PASSWORD VERIFICATION TEST")
    print(f"{'='*80}\n")
    
    test_password = input("Enter test password to verify (or press Enter to skip): ")
    
    if test_password:
        # Try bcrypt
        try:
            if password.startswith('$2'):
                result = bcrypt.checkpw(test_password.encode('utf-8'), password.encode('utf-8'))
                print(f"  bcrypt verification: {result}")
        except Exception as e:
            print(f"  bcrypt verification failed: {e}")
        
        # Try werkzeug
        try:
            if password.startswith('scrypt:') or password.startswith('pbkdf2:'):
                from werkzeug.security import check_password_hash
                result = check_password_hash(password, test_password)
                print(f"  werkzeug verification: {result}")
        except Exception as e:
            print(f"  werkzeug verification failed: {e}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        # Check specific user
        email = sys.argv[1]
        check_specific_user(email)
    else:
        # Audit all users
        audit_user_passwords()

