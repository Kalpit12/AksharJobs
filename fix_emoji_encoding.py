#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix emoji encoding in referral.html
Replaces all corrupted emoji sequences with proper Unicode emojis
"""

import re

# Define emoji replacements (corrupted -> correct)
EMOJI_FIXES = {
    'ðŸŽ‰': '🎉',  # Party Popper
    'ðŸª™': '🪙',  # Coin
    'ðŸ'¥': '👥',  # People
    'ðŸ"Š': '📊',  # Chart
    'ðŸ'¡': '💡',  # Bulb
    'ðŸ'°': '💰',  # Money Bag
    'ðŸ"±': '📱',  # Mobile Phone
    'âš ï¸': '⚠️',  # Warning
    'ðŸ"¤': '📤',  # Outbox
    'ðŸŒŸ': '🌟',  # Star
    'ðŸ§ ': '🧠',  # Brain
    'ðŸŒ': '🌍',  # Globe
    'ðŸ'«': '💫',  # Dizzy
    'ðŸ¤': '🤝',  # Handshake
    'ðŸŽ': '🎁',  # Gift
    'ðŸ'Ž': '💎',  # Gem
    'ðŸš€': '🚀',  # Rocket
    'ðŸ"': '📝',  # Memo
    'âœ…': '✅',  # Check mark
    'â¤ï¸': '❤️',  # Heart
    'âŒ': '❌',  # Cross mark
    'ðŸ'¾': '💾',  # Floppy disk
    'ðŸ"¢': '🔢',  # Numbers
    'âš¡': '⚡',  # Lightning
}

def fix_emojis(file_path):
    """Fix all corrupted emojis in the file"""
    
    print(f"🔧 Reading file: {file_path}")
    
    # Read file with UTF-8 encoding
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_length = len(content)
    print(f"📏 Original file size: {original_length:,} characters")
    
    # Count replacements
    total_replacements = 0
    
    # Replace each corrupted emoji
    for corrupted, correct in EMOJI_FIXES.items():
        count = content.count(corrupted)
        if count > 0:
            content = content.replace(corrupted, correct)
            total_replacements += count
            print(f"  ✅ Replaced {count:2d} × '{corrupted}' → '{correct}'")
    
    # Write back with UTF-8 encoding (no BOM)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    new_length = len(content)
    print(f"\n📏 New file size: {new_length:,} characters")
    print(f"✅ Total replacements made: {total_replacements}")
    print(f"✅ File saved with UTF-8 encoding: {file_path}")
    
    return total_replacements

if __name__ == '__main__':
    file_path = 'AKSHAREXPO/referral.html'
    
    print("=" * 60)
    print("  EMOJI ENCODING FIX SCRIPT")
    print("=" * 60)
    print()
    
    try:
        replacements = fix_emojis(file_path)
        
        print()
        print("=" * 60)
        if replacements > 0:
            print("✅ SUCCESS! All emojis fixed!")
            print()
            print("Next steps:")
            print("1. Upload AKSHAREXPO/referral.html to your server")
            print("2. Test at www.aksharjobs.com/referral")
            print("3. You should see proper emojis: 🎉 🪙 👥 📊 💡 💰")
        else:
            print("ℹ️  No corrupted emojis found (already fixed!)")
        print("=" * 60)
        
    except FileNotFoundError:
        print(f"❌ Error: File not found: {file_path}")
        print("Make sure you're running this from the project root directory")
    except Exception as e:
        print(f"❌ Error: {e}")

