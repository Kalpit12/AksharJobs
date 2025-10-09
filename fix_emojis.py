#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fix emoji encoding in referral.html"""

import codecs

def fix_emojis(file_path):
    # Read with utf-8
    with codecs.open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Fix emojis using escaped sequences
    replacements = [
        ('\u00f0\u009f\u008e\u0089', '\U0001F389'),  # Party popper
        ('\u00f0\u009f\u00aa\u0099', '\U0001F4AA\u200D\u2642\uFE0F'),  # Coin (attempt)
        ('\u00f0\u009f\u0091\u00a5', '\U0001F465'),  # People
        ('\u00f0\u009f\u0093\u008a', '\U0001F4CA'),  # Chart
        ('\u00f0\u009f\u0092\u00a1', '\U0001F4A1'),  # Bulb
        ('\u00f0\u009f\u0092\u00b0', '\U0001F4B0'),  # Money bag
        ('\u00f0\u009f\u0093\u00b1', '\U0001F4F1'),  # Mobile
        ('\u00f0\u009f\u0093\u00a4', '\U0001F4E4'),  # Outbox
        ('\u00f0\u009f\u008c\u009f', '\U0001F31F'),  # Star
        ('\u00f0\u009f\u00a7\u00a0', '\U0001F9E0'),  # Brain
        ('\u00f0\u009f\u008c\u008d', '\U0001F30D'),  # Globe
        ('\u00f0\u009f\u0092\u00ab', '\U0001F4AB'),  # Dizzy
        ('\u00f0\u009f\u00a4\u009d', '\U0001F91D'),  # Handshake
        ('\u00f0\u009f\u008e\u0081', '\U0001F381'),  # Gift
        ('\u00f0\u009f\u0092\u008e', '\U0001F48E'),  # Gem
        ('\u00f0\u009f\u009a\u0080', '\U0001F680'),  # Rocket
        ('\u00f0\u009f\u0093\u009d', '\U0001F4DD'),  # Memo
        ('\u00e2\u009c\u0085', '\u2705'),  # Check mark
        ('\u00e2\u009d\u008c', '\u274C'),  # Cross mark
        ('\u00f0\u009f\u0092\u00be', '\U0001F4BE'),  # Floppy
        ('\u00f0\u009f\u0094\u00a2', '\U0001F522'),  # Numbers
        ('\u00e2\u009a\u00a1', '\u26A1'),  # Lightning
        ('\u00e2\u009a\u00a0\u00ef\u00b8\u008f', '\u26A0\uFE0F'),  # Warning
        ('\u00e2\u009d\u00a4\u00ef\u00b8\u008f', '\u2764\uFE0F'),  # Heart
    ]
    
    # Apply replacements
    count = 0
    for old, new in replacements:
        if old in content:
            occurrences = content.count(old)
            content = content.replace(old, new)
            count += occurrences
            print(f"Fixed {occurrences} occurrences of emoji")
    
    # Write back
    with codecs.open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\nTotal fixes: {count}")
    print(f"File saved: {file_path}")
    return count

if __name__ == '__main__':
    fix_emojis('AKSHAREXPO/referral.html')

