#!/usr/bin/env python3
"""
Debug configuration
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config import Config
import os
from dotenv import load_dotenv

def debug_config():
    """Debug configuration"""
    
    print("🔧 Configuration Debug:")
    
    # Check environment variables
    print(f"\n📋 Environment Variables:")
    print(f"   SECRET_KEY: {os.getenv('SECRET_KEY', 'NOT_SET')}")
    print(f"   MONGO_URI: {os.getenv('MONGO_URI', 'NOT_SET')}")
    print(f"   DB_NAME: {os.getenv('DB_NAME', 'NOT_SET')}")
    
    # Check Config class
    print(f"\n⚙️  Config Class:")
    print(f"   JWT_SECRET_KEY: {Config.JWT_SECRET_KEY}")
    print(f"   HOST: {Config.HOST}")
    print(f"   PORT: {Config.PORT}")
    
    # Check .env file
    print(f"\n📁 Environment File:")
    env_file = '.env'
    if os.path.exists(env_file):
        print(f"   ✅ .env file exists")
        with open(env_file, 'r') as f:
            content = f.read()
            print(f"   Content preview: {content[:200]}...")
    else:
        print(f"   ❌ .env file not found")
    
    # Check .env.local file
    env_local_file = '.env.local'
    if os.path.exists(env_local_file):
        print(f"   ✅ .env.local file exists")
        with open(env_local_file, 'r') as f:
            content = f.read()
            print(f"   Content preview: {content[:200]}...")
    else:
        print(f"   ❌ .env.local file not found")
    
    return True

if __name__ == "__main__":
    debug_config()




