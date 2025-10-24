#!/usr/bin/env python3
"""
Interactive script to help set up MongoDB Atlas connection
"""

import os

def setup_atlas_connection():
    """Guide user through setting up Atlas connection"""
    
    print("="*100)
    print(" "*30 + "MONGODB ATLAS CONNECTION SETUP")
    print("="*100)
    
    print("\n📋 This script will help you connect your backend to MongoDB Atlas")
    print("   where your registration data is currently being saved.\n")
    
    # Check if .env already exists
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    env_exists = os.path.exists(env_path)
    
    if env_exists:
        print(f"⚠️  WARNING: .env file already exists at: {env_path}")
        response = input("   Do you want to OVERWRITE it? (yes/no): ").strip().lower()
        if response not in ['yes', 'y']:
            print("\n❌ Cancelled. No changes made.")
            return
    
    print("\n" + "-"*100)
    print("STEP 1: Get your MongoDB Atlas connection string")
    print("-"*100)
    print("1. Go to: https://cloud.mongodb.com")
    print("2. Login to your account")
    print("3. Click on your cluster (e.g., Cluster0)")
    print("4. Click the 'Connect' button")
    print("5. Choose 'Connect your application'")
    print("6. Select 'Python' and version '3.12 or later'")
    print("7. Copy the connection string")
    print("\nIt should look like:")
    print("mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority")
    
    print("\n" + "-"*100)
    mongo_uri = input("📝 Paste your MongoDB Atlas connection string here: ").strip()
    
    if not mongo_uri or not mongo_uri.startswith("mongodb"):
        print("\n❌ Invalid connection string. Must start with 'mongodb://' or 'mongodb+srv://'")
        return
    
    print("\n" + "-"*100)
    print("STEP 2: Database Name")
    print("-"*100)
    
    db_name = input("📝 Enter database name (press Enter for 'TalentMatchDB'): ").strip()
    if not db_name:
        db_name = "TalentMatchDB"
    
    print("\n" + "-"*100)
    print("STEP 3: Generate Security Keys")
    print("-"*100)
    
    import secrets
    secret_key = secrets.token_urlsafe(32)
    jwt_secret = secrets.token_urlsafe(32)
    
    print(f"✅ Generated secure random keys")
    
    # Create .env content
    env_content = f"""# MongoDB Atlas Connection
MONGO_URI={mongo_uri}
DB_NAME={db_name}

# JWT and Security (Auto-generated secure keys)
SECRET_KEY={secret_key}
JWT_SECRET_KEY={jwt_secret}

# Application URLs
FRONTEND_URL=http://localhost:3003
BACKEND_URL=http://localhost:5000

# Created by setup_atlas_connection.py on {os.popen('date /t').read().strip() if os.name == 'nt' else os.popen('date').read().strip()}
"""
    
    # Write .env file
    try:
        with open(env_path, 'w') as f:
            f.write(env_content)
        
        print("\n" + "="*100)
        print("✅ SUCCESS! .env file created")
        print("="*100)
        print(f"\n📁 File location: {env_path}")
        print(f"\n📊 Configuration:")
        print(f"   Database: MongoDB Atlas (Cloud)")
        print(f"   DB Name: {db_name}")
        print(f"   Security: ✅ Secure keys generated")
        
        print("\n" + "="*100)
        print("🚀 NEXT STEPS")
        print("="*100)
        print("\n1. RESTART your backend:")
        print("   cd backend")
        print("   python app.py")
        print("\n2. You should see:")
        print("   [OK] MongoDB connected successfully!")
        print("   [DEBUG] Connected to URI: mongodb+srv://...")
        print("\n3. Login to your app")
        print("\n4. Go to MyProfile")
        print("\n5. ✅ You should now see ALL your registration data!")
        
        print("\n" + "="*100)
        print("🔍 VERIFICATION")
        print("="*100)
        print("\nTo verify the connection, run:")
        print("   python backend/check_mongodb_connection.py")
        print("\nShould show:")
        print("   ☁️  MongoDB Atlas (Cloud)")
        print("   👥 Job Seekers: [your count]")
        
        print("\n" + "="*100)
        
    except Exception as e:
        print(f"\n❌ Error writing .env file: {str(e)}")
        print("\nManual steps:")
        print(f"1. Create a file named '.env' in: {os.path.dirname(__file__)}")
        print(f"2. Add the configuration above")
        print(f"3. Save and restart backend")

if __name__ == "__main__":
    try:
        setup_atlas_connection()
    except KeyboardInterrupt:
        print("\n\n⚠️  Setup cancelled by user")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

