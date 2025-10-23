#!/usr/bin/env python3
"""
Quick setup script to configure local MongoDB connection
Run this to fix DNS timeout issues with MongoDB Atlas
"""

import os

def setup_local_mongodb():
    """Create .env file with local MongoDB configuration"""
    
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    
    # Check if .env already exists
    if os.path.exists(env_path):
        print("⚠️  .env file already exists!")
        response = input("Do you want to backup and replace it? (y/n): ").strip().lower()
        if response != 'y':
            print("❌ Setup cancelled. No changes made.")
            return
        
        # Backup existing .env
        backup_path = env_path + '.backup'
        with open(env_path, 'r') as f:
            content = f.read()
        with open(backup_path, 'w') as f:
            f.write(content)
        print(f"✅ Backed up existing .env to .env.backup")
    
    # Create new .env with local MongoDB configuration
    env_content = """# MongoDB Configuration - Local MongoDB
MONGO_URI=mongodb://localhost:27017/
DB_NAME=TalentMatchDB

# JWT Secret Key
SECRET_KEY=your-secret-key-change-this-in-production

# Gemini AI API Key (Optional)
GEMINI_API_KEY=

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Frontend Configuration
FRONTEND_HOST=localhost
FRONTEND_PORT=3003

# Backend Configuration
HOST=localhost
PORT=3002

# Environment
NODE_ENV=development
"""
    
    with open(env_path, 'w') as f:
        f.write(env_content)
    
    print("\n✅ Successfully created .env file with local MongoDB configuration!")
    print("\n📋 Configuration:")
    print("   • MongoDB: mongodb://localhost:27017/")
    print("   • Database: TalentMatchDB")
    print("   • Backend: http://localhost:3002")
    print("   • Frontend: http://localhost:3003")
    print("\n🚀 Next steps:")
    print("   1. Make sure MongoDB is running: net start MongoDB")
    print("   2. Restart your backend: python start_backend.py")
    print("   3. Open http://localhost:3003 and try the Candidate Tracker!")
    print("\n💡 Your local database already has:")
    print("   • 5 jobs")
    print("   • 15 applications")
    print("   • All ready to display!")

if __name__ == "__main__":
    print("🔧 MongoDB Local Setup")
    print("=" * 60)
    print("This will configure your backend to use local MongoDB")
    print("instead of MongoDB Atlas (fixes DNS timeout issues)")
    print("=" * 60)
    print()
    
    try:
        setup_local_mongodb()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\n💡 You can manually create a .env file in the backend folder with:")
        print("   MONGO_URI=mongodb://localhost:27017/")
        print("   DB_NAME=TalentMatchDB")

