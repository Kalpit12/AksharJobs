# MongoDB Atlas Migration Guide

This guide will help you migrate your AksharJobs database from local MongoDB to MongoDB Atlas (cloud).

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: Create MongoDB Atlas Account](#step-1-create-mongodb-atlas-account)
3. [Step 2: Export Local Database](#step-2-export-local-database)
4. [Step 3: Import to Atlas](#step-3-import-to-atlas)
5. [Step 4: Update Application Configuration](#step-4-update-application-configuration)
6. [Step 5: Test the Connection](#step-5-test-the-connection)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- MongoDB local instance running with your data
- MongoDB Database Tools installed (mongodump, mongorestore)
- Internet connection
- Email for MongoDB Atlas account

---

## Step 1: Create MongoDB Atlas Account

### 1.1 Sign Up for MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with your email or Google account
3. Choose the **FREE tier (M0)** - Perfect for development/testing
4. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
5. Choose a region closest to your users (e.g., Mumbai for India)

### 1.2 Create a Cluster

1. After signing in, click **"Build a Database"**
2. Select **"Shared"** (Free tier)
3. Choose your cloud provider and region
4. Name your cluster (e.g., `AksharJobsCluster`)
5. Click **"Create Cluster"** (takes 3-5 minutes)

### 1.3 Configure Database Access

1. Go to **Database Access** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create username and strong password (SAVE THESE!)
   - Example: Username: `akshar_admin`
   - Password: Generate a strong password
5. Select **"Built-in Role"** → **"Read and write to any database"**
6. Click **"Add User"**

### 1.4 Configure Network Access

1. Go to **Network Access** in the left sidebar
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"**  )
   - **Note:** For production, restrict to specific IP addresses
4. Click **"Confirm"**

### 1.5 Get Connection String

1. Go to **Database** → Click **"Connect"** on your cluster
2. Select **"Connect your application"**
3. Choose **Driver: Python** and **Version: 3.12 or later**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your credentials
6. Keep this string safe!

---

## Step 2: Export Local Database

### 2.1 Check MongoDB Tools Installation

Open PowerShell and check if mongodump is installed:

```powershell
mongodump --version
```

If not installed, download from: https://www.mongodb.com/try/download/database-tools

### 2.2 Export Your Database

```powershell
# Navigate to your project directory
cd C:\Users\kalpi\Desktop\AksharJobs

# Create a backup directory
mkdir mongodb_backup

# Export the TalentMatchDB database
mongodump --uri="mongodb://localhost:27017/TalentMatchDB" --out="./mongodb_backup"
```

**What this does:**
- Creates a folder `mongodb_backup/TalentMatchDB/` with all your collections
- Each collection is exported as BSON and JSON files

### 2.3 Verify Export

```powershell
# Check the exported files
dir ./mongodb_backup/TalentMatchDB
```

You should see folders for all your collections (users, jobs, applications, etc.)

---

## Step 3: Import to Atlas

### 3.1 Using mongorestore (Recommended)

```powershell
# Replace with YOUR Atlas connection string and credentials
$ATLAS_URI = "mongodb+srv://akshar_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/"

# Import to Atlas
mongorestore --uri="$ATLAS_URI" --db="TalentMatchDB" ./mongodb_backup/TalentMatchDB
```

### 3.2 Alternative: Using MongoDB Compass (GUI Method)

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to your Atlas cluster using the connection string
3. Create database: `TalentMatchDB`
4. For each collection:
   - Click "Add Data" → "Import JSON or CSV File"
   - Select the `.json` file from your backup
   - Import

### 3.3 Verify Import

Connect to Atlas and verify:

```powershell
# Using mongosh to connect to Atlas
mongosh "$ATLAS_URI"

# Once connected, run:
use TalentMatchDB
show collections
db.users.countDocuments()
db.jobs.countDocuments()
```

---

## Step 4: Update Application Configuration

### 4.1 Update `.edn.local` File

Open `backend/.edn.local` and update the MongoDB configuration:

```env
# OLD (Local MongoDB)
# MONGO_URI=mongodb://localhost:27017/

# NEW (MongoDB Atlas)
MONGO_URI=mongodb+srv://akshar_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

# Database name remains the same
DB_NAME=TalentMatchDB
```

### 4.2 Connection String Format

Your Atlas connection string should look like:

```
mongodb+srv://<username>:<password>@<cluster-name>.<xxxxx>.mongodb.net/?retryWrites=true&w=majority&appName=<app-name>
```

**Important:**
- Replace `<username>` with your database username
- Replace `<password>` with your database password (URL encode special characters)
- No need to add database name in URI - it's configured in `DB_NAME`

### 4.3 Handle Special Characters in Password

If your password contains special characters, URL encode them:

| Character | URL Encoded |
|-----------|-------------|
| @         | %40         |
| :         | %3A         |
| /         | %2F         |
| ?         | %3F         |
| #         | %23         |
| [         | %5B         |
| ]         | %5D         |

Example:
- Password: `MyP@ss:word!`
- Encoded: `MyP%40ss%3Aword!`

---

## Step 5: Test the Connection

### 5.1 Create Test Script

Create `test_atlas_connection.py` in your project root:

```python
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.edn.local')

def test_atlas_connection():
    """Test MongoDB Atlas connection"""
    
    mongo_uri = os.getenv("MONGO_URI")
    db_name = os.getenv("DB_NAME")
    
    print("=" * 60)
    print("MongoDB Atlas Connection Test")
    print("=" * 60)
    print(f"Database: {db_name}")
    print(f"URI: {mongo_uri[:50]}...")
    print()
    
    try:
        # Connect to MongoDB Atlas
        print("📡 Connecting to MongoDB Atlas...")
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        
        # Test connection
        client.admin.command('ping')
        print("✅ Successfully connected to MongoDB Atlas!")
        print()
        
        # Get database
        db = client[db_name]
        
        # List collections
        collections = db.list_collection_names()
        print(f"📊 Found {len(collections)} collections:")
        for col in collections:
            count = db[col].count_documents({})
            print(f"   - {col}: {count} documents")
        
        print()
        print("=" * 60)
        print("✅ Atlas Connection Test PASSED!")
        print("=" * 60)
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print()
        print("Common issues:")
        print("1. Check username and password in connection string")
        print("2. Ensure IP address is whitelisted in Atlas")
        print("3. Verify network connection")
        print("4. Check if special characters in password are URL encoded")
        return False

if __name__ == "__main__":
    test_atlas_connection()
```

### 5.2 Run Test

```powershell
# Make sure you're in the project directory
cd C:\Users\kalpi\Desktop\AksharJobs

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Run test
python test_atlas_connection.py
```

### 5.3 Test Backend Application

```powershell
# Start the backend server
.\start_backend.bat

# In another terminal, test an API endpoint
curl http://localhost:3002/api/auth/test
```

---

## Troubleshooting

### Issue 1: Authentication Failed

**Error:** `Authentication failed`

**Solution:**
- Verify username and password in connection string
- Ensure the database user has correct permissions
- Check if special characters in password are URL encoded

### Issue 2: IP Not Whitelisted

**Error:** `Connection timeout` or `IP address not whitelisted`

**Solution:**
1. Go to Atlas → Network Access
2. Add your IP address or use `0.0.0.0/0` for development
3. Wait 2-3 minutes for changes to propagate

### Issue 3: Network Connection Issues

**Error:** `getaddrinfo ENOTFOUND`

**Solution:**
- Check your internet connection
- Try connecting with VPN disabled
- Verify DNS resolution: `nslookup cluster0.xxxxx.mongodb.net`

### Issue 4: SSL/TLS Issues

**Error:** `SSL: CERTIFICATE_VERIFY_FAILED`

**Solution:**
Add `&ssl=true&tlsAllowInvalidCertificates=true` to connection string (dev only):
```
mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority&ssl=true&tlsAllowInvalidCertificates=true
```

### Issue 5: Connection String Format

**Common mistakes:**
```
❌ mongodb://cluster0.mongodb.net          # Missing srv
❌ mongodb+srv://cluster0.mongodb.net/     # Missing credentials
❌ mongodb+srv://user@pass@cluster...      # Wrong format
✅ mongodb+srv://user:pass@cluster...      # Correct
```

### Issue 6: Slow Connection

**Solution:**
- Choose a cluster region closer to you
- Use connection pooling (already configured in your app)
- Consider upgrading from free tier if needed

---

## Best Practices

### 1. Security

✅ **Do:**
- Use strong passwords
- Restrict IP access in production
- Rotate database credentials regularly
- Use environment variables for credentials
- Enable audit logs in Atlas

❌ **Don't:**
- Commit `.edn.local` to Git
- Use simple passwords
- Allow 0.0.0.0/0 in production
- Share connection strings publicly

### 2. Backup Strategy

```powershell
# Create automated backups script (backup_to_atlas.ps1)
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backup_dir = ".\backups\backup_$timestamp"

# Export local DB
mongodump --uri="mongodb://localhost:27017/TalentMatchDB" --out=$backup_dir

# Compress
Compress-Archive -Path $backup_dir -DestinationPath "$backup_dir.zip"
```

### 3. Monitoring

- Enable **Atlas monitoring** to track:
  - Connection metrics
  - Query performance
  - Storage usage
  - Alerts for issues

### 4. Indexing

After migration, ensure indexes are created:

```python
# In your backend, add index creation
db.users.create_index([("email", 1)], unique=True)
db.jobs.create_index([("company_name", 1)])
db.jobs.create_index([("created_at", -1)])
```

---

## Migration Checklist

- [ ] Created MongoDB Atlas account
- [ ] Created cluster and database user
- [ ] Configured network access (whitelisted IP)
- [ ] Exported local database using mongodump
- [ ] Imported data to Atlas using mongorestore
- [ ] Updated `.edn.local` with Atlas connection string
- [ ] Tested connection with test script
- [ ] Started backend and verified functionality
- [ ] Tested key features (login, job posting, etc.)
- [ ] Set up automated backups
- [ ] Configured monitoring and alerts
- [ ] Documented connection string securely

---

## Cost Considerations

**Free Tier (M0):**
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Basic monitoring
- ✅ Good for development/testing

**When to Upgrade:**
- Storage exceeds 512 MB
- Need better performance
- Require advanced monitoring
- Production deployment

**Estimated Costs:**
- M2 (2GB): ~$9/month
- M10 (10GB): ~$57/month
- See [Atlas Pricing](https://www.mongodb.com/pricing)

---

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Connection String Format](https://docs.mongodb.com/manual/reference/connection-string/)
- [Database Tools](https://docs.mongodb.com/database-tools/)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [Atlas Free Tier](https://www.mongodb.com/cloud/atlas/register)

---

## Support

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review Atlas logs in the dashboard
3. Check MongoDB Community Forums
4. Contact MongoDB Support (for paid tiers)

---

**Migration Status:** ⏳ Ready to begin

Once completed, update this status to: ✅ Completed

Good luck with your migration! 🚀

