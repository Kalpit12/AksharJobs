#!/usr/bin/env python3
"""
Manual migration script to convert Werkzeug password hashes to bcrypt.

IMPORTANT: This script requires the users to provide their current passwords
because password hashes cannot be decrypted. It will send them password reset emails.

Alternatively, the automatic migration will happen when users login next time.
"""
from utils.db import get_db
import bcrypt
from datetime import datetime, timedelta

def list_werkzeug_users():
    """List all users still using Werkzeug hashes"""
    db = get_db()
    users = db['users']
    
    print(f"\n{'='*80}")
    print("USERS WITH WERKZEUG HASHES")
    print(f"{'='*80}\n")
    
    werkzeug_users = []
    
    all_users = users.find({})
    for user in all_users:
        password = user.get('password', '')
        if isinstance(password, str) and (password.startswith('scrypt:') or password.startswith('pbkdf2:')):
            werkzeug_users.append({
                'email': user.get('email'),
                'firstName': user.get('firstName'),
                'lastName': user.get('lastName'),
                'userType': user.get('userType')
            })
            print(f"📧 {user.get('email')}")
            print(f"   Name: {user.get('firstName')} {user.get('lastName')}")
            print(f"   Type: {user.get('userType')}")
            print()
    
    print(f"Total users with Werkzeug hashes: {len(werkzeug_users)}")
    return werkzeug_users

def migrate_user_with_password(email, new_password):
    """
    Manually migrate a specific user by setting a new password.
    USE WITH CAUTION - This changes the user's password!
    """
    db = get_db()
    users = db['users']
    
    user = users.find_one({"email": email})
    if not user:
        print(f"❌ User not found: {email}")
        return False
    
    password = user.get('password', '')
    if not (isinstance(password, str) and (password.startswith('scrypt:') or password.startswith('pbkdf2:'))):
        print(f"⚠️  User {email} is not using Werkzeug hash")
        return False
    
    # Generate bcrypt hash
    password_bytes = new_password.encode('utf-8')
    salt = bcrypt.gensalt()
    new_bcrypt_hash = bcrypt.hashpw(password_bytes, salt).decode('utf-8')
    
    # Update user
    result = users.update_one(
        {"email": email},
        {
            "$set": {
                "password": new_bcrypt_hash,
                "password_migrated_at": datetime.utcnow(),
                "password_migration_method": "manual"
            }
        }
    )
    
    if result.modified_count > 0:
        print(f"✓ Successfully migrated {email} to bcrypt")
        return True
    else:
        print(f"❌ Failed to migrate {email}")
        return False

def generate_password_reset_tokens():
    """
    Generate password reset tokens for all Werkzeug users.
    This is the SAFEST way to migrate - users reset their own passwords.
    """
    db = get_db()
    users = db['users']
    
    print(f"\n{'='*80}")
    print("GENERATING PASSWORD RESET TOKENS")
    print(f"{'='*80}\n")
    
    werkzeug_users = []
    all_users = users.find({})
    
    for user in all_users:
        password = user.get('password', '')
        if isinstance(password, str) and (password.startswith('scrypt:') or password.startswith('pbkdf2:')):
            email = user.get('email')
            
            # Generate reset token
            from utils.password_reset import generate_reset_token
            reset_token = generate_reset_token(email)
            
            # In a real scenario, you would send an email here
            reset_link = f"http://localhost:3003/reset-password?token={reset_token}&email={email}"
            
            werkzeug_users.append({
                'email': email,
                'reset_link': reset_link
            })
            
            print(f"User: {email}")
            print(f"Reset Link: {reset_link}")
            print()
    
    print(f"\n{'='*80}")
    print(f"Generated {len(werkzeug_users)} password reset links")
    print("Send these links to users via email to complete migration")
    print(f"{'='*80}\n")
    
    return werkzeug_users

def show_migration_status():
    """Show current migration status"""
    db = get_db()
    users = db['users']
    
    print(f"\n{'='*80}")
    print("PASSWORD HASH MIGRATION STATUS")
    print(f"{'='*80}\n")
    
    all_users = list(users.find({}))
    total = len(all_users)
    
    bcrypt_count = 0
    werkzeug_count = 0
    auto_migrated = 0
    manual_migrated = 0
    
    for user in all_users:
        password = user.get('password', '')
        if isinstance(password, str):
            if password.startswith('$2b$') or password.startswith('$2a$') or password.startswith('$2y$'):
                bcrypt_count += 1
                if user.get('password_migration_method') == 'automatic':
                    auto_migrated += 1
                elif user.get('password_migration_method') == 'manual':
                    manual_migrated += 1
            elif password.startswith('scrypt:') or password.startswith('pbkdf2:'):
                werkzeug_count += 1
    
    print(f"Total Users: {total}")
    print(f"  ✓ Bcrypt: {bcrypt_count} ({bcrypt_count/total*100:.1f}%)")
    print(f"  ⚠️  Werkzeug: {werkzeug_count} ({werkzeug_count/total*100:.1f}%)")
    print(f"\nMigration Methods:")
    print(f"  🔄 Automatic (on login): {auto_migrated}")
    print(f"  🔧 Manual: {manual_migrated}")
    print(f"  📝 Original bcrypt: {bcrypt_count - auto_migrated - manual_migrated}")
    
    if werkzeug_count > 0:
        print(f"\n⚠️  {werkzeug_count} users still need migration")
        print("   They will be automatically migrated on their next login")
    else:
        print(f"\n✓ All users migrated to bcrypt!")
    
    print(f"\n{'='*80}\n")

if __name__ == "__main__":
    import sys
    
    print("""
╔═══════════════════════════════════════════════════════════════════════════════╗
║                   WERKZEUG TO BCRYPT MIGRATION TOOL                           ║
╚═══════════════════════════════════════════════════════════════════════════════╝

This tool helps migrate users from Werkzeug password hashes to bcrypt.

MIGRATION OPTIONS:
  1. AUTOMATIC (Recommended): Users are automatically migrated when they login
  2. PASSWORD RESET: Generate reset links for users to set new passwords
  3. MANUAL: Directly set new passwords (requires knowing their passwords)

CURRENT IMPLEMENTATION: Automatic migration is already enabled in auth_service.py
Users will be migrated transparently on their next successful login.
""")
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "list":
            list_werkzeug_users()
        elif command == "status":
            show_migration_status()
        elif command == "reset-links":
            generate_password_reset_tokens()
        elif command == "migrate" and len(sys.argv) == 4:
            email = sys.argv[2]
            new_password = sys.argv[3]
            migrate_user_with_password(email, new_password)
        else:
            print("Invalid command!")
            print("\nUsage:")
            print("  python migrate_werkzeug_to_bcrypt.py list          # List users needing migration")
            print("  python migrate_werkzeug_to_bcrypt.py status        # Show migration status")
            print("  python migrate_werkzeug_to_bcrypt.py reset-links   # Generate password reset links")
            print("  python migrate_werkzeug_to_bcrypt.py migrate <email> <new_password>  # Manual migration")
    else:
        # Default: show status
        show_migration_status()
        print("\nTo see available commands, run with --help")

