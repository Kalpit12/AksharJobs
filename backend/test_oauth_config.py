#!/usr/bin/env python3
"""
Test script to check OAuth configuration
"""

import os
from dotenv import load_dotenv

def test_oauth_config():
    print("=== Testing OAuth Configuration ===")
    
    # Try loading from .env.local first
    print("1. Loading from .env.local...")
    load_dotenv('.env.local')
    
    # Check OAuth variables
    oauth_vars = [
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET', 
        'LINKEDIN_CLIENT_ID',
        'LINKEDIN_CLIENT_SECRET',
        'GOOGLE_REDIRECT_URI',
        'LINKEDIN_REDIRECT_URI'
    ]
    
    print("\n2. Checking OAuth environment variables:")
    for var in oauth_vars:
        value = os.getenv(var)
        status = "✓ SET" if value else "✗ NOT SET"
        print(f"   {var}: {status}")
        if value:
            print(f"     Value: {value[:20]}{'...' if len(value) > 20 else ''}")
    
    # Try loading from .edn.local as fallback
    print("\n3. Trying to load from .edn.local...")
    load_dotenv('.edn.local', override=True)
    
    print("\n4. Checking OAuth variables after .edn.local:")
    for var in oauth_vars:
        value = os.getenv(var)
        status = "✓ SET" if value else "✗ NOT SET"
        print(f"   {var}: {status}")
        if value:
            print(f"     Value: {value[:20]}{'...' if len(value) > 20 else ''}")
    
    print("\n=== Configuration Test Complete ===")

if __name__ == "__main__":
    test_oauth_config()
