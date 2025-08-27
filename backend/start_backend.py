#!/usr/bin/env python3
"""
RocketJobs Backend Startup Script
This script helps start the Flask backend server with proper configuration.
"""

import os
import sys
import subprocess
from pathlib import Path

def check_mongodb():
    """Check if MongoDB is running"""
    try:
        import pymongo
        client = pymongo.MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=5000)
        client.server_info()
        print("✅ MongoDB is running and accessible")
        return True
    except Exception as e:
        print("❌ MongoDB connection failed:")
        print(f"   Error: {e}")
        print("\n📋 Please ensure MongoDB is running:")
        print("   Windows: MongoDB should be running as a Windows service")
        print("   macOS: brew services start mongodb/brew/mongodb-community")
        print("   Linux: sudo systemctl start mongod")
        return False

def check_dependencies():
    """Check if required Python packages are installed"""
    required_packages = [
        'flask', 'flask_cors', 'pymongo', 'bcrypt', 
        'flask_jwt_extended', 'dotenv'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("❌ Missing required packages:")
        for package in missing_packages:
            print(f"   - {package}")
        print("\n📋 Install missing packages with:")
        print("   pip install -r requirements.txt")
        return False
    
    print("✅ All required packages are installed")
    return True

def check_env_file():
    """Check if .edn.local file exists and has required variables"""
    env_file = Path('.edn.local')
    
    if not env_file.exists():
        print("❌ .edn.local file not found")
        print("\n📋 Create a .edn.local file with:")
        print("   MONGO_URI=mongodb://localhost:27017/")
        print("   DB_NAME=TalentMatchDB")
        print("   SECRET_KEY=your-super-secret-jwt-key")
        return False
    
    # Read .edn.local file
    env_vars = {}
    with open(env_file, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                env_vars[key] = value
    
    required_vars = ['MONGO_URI', 'DB_NAME', 'SECRET_KEY']
    missing_vars = [var for var in required_vars if var not in env_vars]
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        return False
    
    print("✅ .edn.local file is properly configured")
    return True

def start_server():
    """Start the Flask server"""
    print("\n🚀 Starting RocketJobs Backend Server...")
    
    try:
        # Import and run the Flask app
        from app import app
        
        print("✅ Flask app imported successfully")
        print("🌐 Server will be available at: http://localhost:5000")
        print("📱 API endpoints:")
        print("   - POST /api/auth/login")
        print("   - POST /api/auth/signup")
        print("   - GET /api/jobs")
        print("\n⏹️  Press Ctrl+C to stop the server")
        
        # Start the server
        app.run(
            host="0.0.0.0", 
            port=5000, 
            debug=True,
            use_reloader=True
        )
        
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        return False

def main():
    """Main function to run all checks and start server"""
    print("🔍 RocketJobs Backend Startup Check")
    print("=" * 40)
    
    # Run all checks
    checks = [
        check_dependencies(),
        check_mongodb(),
        check_env_file()
    ]
    
    if not all(checks):
        print("\n❌ Startup checks failed. Please fix the issues above.")
        sys.exit(1)
    
    print("\n✅ All startup checks passed!")
    
    # Start the server
    start_server()

if __name__ == "__main__":
    main()
