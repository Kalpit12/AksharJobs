# 🔄 Migrate to MongoDB Atlas - Complete Package

Everything you need to migrate your AksharJobs database from local MongoDB to MongoDB Atlas (cloud).

---

## 📦 What's Included

This migration package includes:

| File | Purpose | When to Use |
|------|---------|-------------|
| `MONGODB_ATLAS_QUICK_START.md` | **Start here!** 5-step quick guide | First-time migration |
| `MONGODB_ATLAS_MIGRATION_GUIDE.md` | Detailed documentation | Troubleshooting & reference |
| `export_local_mongodb.bat` | Export your local database | Step 1: Backup |
| `import_to_atlas.bat` | Import to Atlas cluster | Step 5: Upload data |
| `test_atlas_connection.py` | Test Atlas connection | Verify migration |
| `url_encode_password.py` | Encode special characters | Password has @, :, /, etc. |

---

## 🚀 Quick Start (Choose Your Path)

### Path A: Super Quick (For Experienced Users)

```powershell
# 1. Export local database
.\export_local_mongodb.bat

# 2. Create Atlas cluster at https://www.mongodb.com/cloud/atlas/register
#    - Free tier M0
#    - Create database user
#    - Whitelist IP (0.0.0.0/0 for dev)
#    - Copy connection string

# 3. Import to Atlas
.\import_to_atlas.bat
# (Paste your connection string when prompted)

# 4. Update .edn.local with Atlas URI
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/...

# 5. Test
python test_atlas_connection.py
.\start_backend.bat
```

**Time:** ~10-15 minutes

---

### Path B: Guided (Recommended for First-Timers)

1. **Read the Quick Start Guide:**
   ```
   Open: MONGODB_ATLAS_QUICK_START.md
   ```
   This has step-by-step instructions with screenshots and explanations.

2. **Follow the steps** in order

3. **Use the detailed guide** if you run into issues:
   ```
   Open: MONGODB_ATLAS_MIGRATION_GUIDE.md
   ```

**Time:** ~20 minutes

---

## 🎯 Pre-Migration Checklist

Before starting, make sure you have:

- [ ] Local MongoDB running with data
- [ ] Internet connection
- [ ] Email for MongoDB Atlas account
- [ ] MongoDB Database Tools installed ([Download](https://www.mongodb.com/try/download/database-tools))
- [ ] Access to edit `.edn.local` file
- [ ] 15-20 minutes of time

**Check MongoDB Tools:**
```powershell
mongodump --version
mongorestore --version
```

If not found, install from: https://www.mongodb.com/try/download/database-tools

---

## 📊 Migration Process Overview

```
┌─────────────────┐
│  Local MongoDB  │
│  TalentMatchDB  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Export Data    │  ← export_local_mongodb.bat
│  (mongodump)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Create Atlas    │  ← Manual (Web Interface)
│    Cluster      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Import Data    │  ← import_to_atlas.bat
│ (mongorestore)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Update Config   │  ← Edit .edn.local
│  (.edn.local)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Test & Verify  │  ← test_atlas_connection.py
└─────────────────┘
```

---

## 🛠️ Tools Usage

### 1. Export Database

```powershell
.\export_local_mongodb.bat
```

**What it does:**
- Creates timestamped backup folder
- Exports all collections from TalentMatchDB
- Shows backup location

**Output:**
```
✅ Export successful!
Backup location: C:\Users\kalpi\Desktop\AksharJobs\mongodb_backup_20250109_143022
```

---

### 2. Import to Atlas

```powershell
.\import_to_atlas.bat
```

**What it does:**
- Finds your latest backup
- Prompts for Atlas connection string
- Imports all data to Atlas
- Verifies import

**You need:**
- Atlas connection string from Step 4 of Quick Start

---

### 3. Test Connection

```powershell
python test_atlas_connection.py
```

**What it does:**
- Reads connection string from `.edn.local`
- Tests connection to Atlas
- Lists all collections and document counts
- Verifies read/write permissions

**Expected output:**
```
✅ Successfully connected to MongoDB Atlas!
📊 Found 8 collections:
   📁 users
      └─ Documents: 25
   📁 jobs
      └─ Documents: 150
   ...
✅ ATLAS CONNECTION TEST PASSED!
```

---

### 4. URL Encode Password

```powershell
python url_encode_password.py
```

**When to use:**
- Password contains: `@ : / ? # [ ] & = + $ ,`
- Getting authentication errors
- Need to encode password for connection string

**Example:**
```
Enter password: MyP@ss:word!123
Encoded:        MyP%40ss%3Aword!123
```

---

## 🔧 Configuration Update

After importing data to Atlas, update your `.edn.local` file:

**Before (Local):**
```env
MONGO_URI=mongodb://localhost:27017/
DB_NAME=TalentMatchDB
```

**After (Atlas):**
```env
MONGO_URI=mongodb+srv://akshar_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=TalentMatchDB
```

**Important:**
- Replace `YOUR_PASSWORD` with your actual password
- Use URL encoded password if it has special characters
- Keep `DB_NAME` the same
- Don't add database name to URI

---

## ✅ Verification Steps

After migration, verify everything works:

### 1. Connection Test
```powershell
python test_atlas_connection.py
```
Should show: ✅ ATLAS CONNECTION TEST PASSED!

### 2. Backend Start
```powershell
.\start_backend.bat
```
Should show: [OK] MongoDB connected successfully!

### 3. API Test
```powershell
# Test health endpoint
curl http://localhost:3002/api/health

# Test a database-dependent endpoint
curl http://localhost:3002/api/jobs
```

### 4. Frontend Test
- Open `http://localhost:3003`
- Try logging in
- Create/view jobs
- Check user profile

---

## 🆘 Common Issues & Solutions

### Issue 1: mongodump not found

**Error:**
```
'mongodump' is not recognized as an internal or external command
```

**Solution:**
1. Download [MongoDB Database Tools](https://www.mongodb.com/try/download/database-tools)
2. Install and add to PATH
3. Restart PowerShell
4. Test: `mongodump --version`

---

### Issue 2: Authentication failed

**Error:**
```
❌ Authentication failed
```

**Solution:**
1. Check username and password in connection string
2. Encode special characters in password:
   ```powershell
   python url_encode_password.py
   ```
3. Verify user exists in Atlas → Database Access
4. Ensure user has "Read and write" permissions

---

### Issue 3: Network timeout

**Error:**
```
❌ Connection timeout
```

**Solution:**
1. Go to Atlas → Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Wait 2-3 minutes for changes to propagate
5. Try again

---

### Issue 4: Empty database after import

**Problem:**
- Connection works
- But no collections showing

**Solution:**
1. Check backup folder has data:
   ```powershell
   dir mongodb_backup_*\TalentMatchDB
   ```
2. Re-run export if empty:
   ```powershell
   .\export_local_mongodb.bat
   ```
3. Verify local MongoDB is running
4. Re-import:
   ```powershell
   .\import_to_atlas.bat
   ```

---

### Issue 5: Special characters in password

**Problem:**
- Password has `@`, `:`, `/`, etc.
- Getting authentication errors

**Solution:**
```powershell
# Use the encoder tool
python url_encode_password.py

# Enter your password when prompted
# Copy the encoded version to .edn.local
```

**Example:**
- Original: `P@ssw0rd:123`
- Encoded: `P%40ssw0rd%3A123`

---

## 📋 Complete Checklist

### Pre-Migration
- [ ] Local MongoDB running
- [ ] MongoDB Tools installed
- [ ] Have admin access to edit `.edn.local`
- [ ] Internet connection working

### Migration Steps
- [ ] Exported local database
- [ ] Created MongoDB Atlas account
- [ ] Created cluster (M0 Free tier)
- [ ] Created database user
- [ ] Added IP to whitelist
- [ ] Got connection string
- [ ] Encoded password (if needed)
- [ ] Imported data to Atlas
- [ ] Updated `.edn.local` with Atlas URI

### Verification
- [ ] Connection test passes
- [ ] Backend starts without errors
- [ ] API endpoints respond
- [ ] Frontend can access data
- [ ] All collections present
- [ ] Document counts match

### Post-Migration
- [ ] Deleted backup files (or archived)
- [ ] Documented new connection details
- [ ] Updated team members
- [ ] Set up monitoring in Atlas
- [ ] Configured automatic backups

---

## 📊 What Gets Migrated

✅ **Migrated:**
- All collections
- All documents
- Collection structures
- Data relationships

❌ **Not Migrated (Need Manual Setup):**
- Indexes (recreate in Atlas)
- Users and roles (Atlas has own auth)
- Replica set config (Atlas manages this)

**After migration, recreate indexes:**
```python
# In your backend code or MongoDB shell
db.users.createIndex({"email": 1}, {"unique": true})
db.jobs.createIndex({"created_at": -1})
db.applications.createIndex({"user_id": 1, "job_id": 1})
```

---

## 💰 Cost Information

**Free Tier (M0) - Perfect for Development:**
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Up to 100 database connections
- ✅ Basic monitoring
- ✅ Community support
- ✅ Good for: Dev, Testing, Small Apps

**When Free Tier Isn't Enough:**
- Storage > 512 MB
- Need dedicated resources
- Require advanced monitoring
- Production traffic

**Pricing:**
- M2 (2 GB): ~$9/month
- M10 (10 GB): ~$57/month
- See: https://www.mongodb.com/pricing

**Monitoring Your Usage:**
1. Go to Atlas Dashboard
2. Check "Metrics" tab
3. Monitor storage and connections
4. Set up alerts for limits

---

## 🎓 Additional Resources

### Documentation
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Connection Strings](https://docs.mongodb.com/manual/reference/connection-string/)
- [Database Tools](https://docs.mongodb.com/database-tools/)

### Tools
- [MongoDB Compass](https://www.mongodb.com/products/compass) - GUI for MongoDB
- [Atlas CLI](https://www.mongodb.com/docs/atlas/cli/stable/) - Command line tool
- [VS Code Extension](https://www.mongodb.com/products/vs-code) - MongoDB for VS Code

### Community
- [MongoDB Community Forums](https://www.mongodb.com/community/forums/)
- [Stack Overflow - mongodb](https://stackoverflow.com/questions/tagged/mongodb)
- [MongoDB University](https://university.mongodb.com/) - Free courses

---

## 🔄 Rolling Back (If Needed)

If you need to go back to local MongoDB:

1. **Restore `.edn.local`:**
   ```env
   MONGO_URI=mongodb://localhost:27017/
   DB_NAME=TalentMatchDB
   ```

2. **Verify local data:**
   ```powershell
   mongosh
   use TalentMatchDB
   show collections
   ```

3. **Restart backend:**
   ```powershell
   .\start_backend.bat
   ```

Your local data is still intact unless you deleted it!

---

## 🎯 Next Steps After Migration

1. **Monitor Performance**
   - Check Atlas dashboard daily
   - Review slow queries
   - Monitor storage usage

2. **Set Up Backups**
   - Atlas auto-backs up free tier daily
   - Configure backup schedule for paid tiers
   - Test restore process

3. **Optimize Indexes**
   ```javascript
   // In MongoDB shell or Compass
   db.users.createIndex({email: 1}, {unique: true})
   db.jobs.createIndex({created_at: -1})
   db.jobs.createIndex({location: 1, job_type: 1})
   ```

4. **Security Hardening**
   - Change default passwords
   - Restrict IP access (remove 0.0.0.0/0)
   - Enable audit logs
   - Set up alerts

5. **Team Access**
   - Add team members in Atlas
   - Set appropriate permissions
   - Share connection strings securely

---

## 📞 Support

**Having issues?**

1. Check the troubleshooting section above
2. Review detailed guide: `MONGODB_ATLAS_MIGRATION_GUIDE.md`
3. Check Atlas logs: Dashboard → Activity Feed
4. MongoDB Community: https://www.mongodb.com/community/forums/

**Found a bug in these scripts?**
- Check you have latest MongoDB tools
- Verify .edn.local file format
- Try manual commands from the guide

---

## ✨ Success!

Once you see these, you're done:

```
✅ Export successful!
✅ Import successful!
✅ ATLAS CONNECTION TEST PASSED!
✅ Backend starts successfully
✅ API endpoints working
✅ Frontend displays data
```

**Congratulations! Your AksharJobs is now running on MongoDB Atlas! 🎉**

---

**Quick Reference Card:**

```
Export:  .\export_local_mongodb.bat
Import:  .\import_to_atlas.bat
Test:    python test_atlas_connection.py
Encode:  python url_encode_password.py
Start:   .\start_backend.bat
```

**Need help?** Start with `MONGODB_ATLAS_QUICK_START.md`

