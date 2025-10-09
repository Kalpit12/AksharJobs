# 🚀 MongoDB Atlas Quick Start Guide

**Goal:** Migrate from local MongoDB to MongoDB Atlas in 5 simple steps.

---

## ⚡ Quick Steps

### Step 1: Export Local Database (2 minutes)

```powershell
# Simply run this:
.\export_local_mongodb.bat
```

This creates a backup of your `TalentMatchDB` database.

---

### Step 2: Create Atlas Cluster (5 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up (use Google for faster signup)
3. Create a **FREE cluster** (M0):
   - Choose any cloud provider
   - Pick region: `Mumbai` (or closest to you)
   - Name: `AksharJobsCluster`
4. Click **"Create Cluster"** → Wait 3-5 minutes

---

### Step 3: Setup Access (3 minutes)

**Create Database User:**
1. Go to **Database Access** → **Add New Database User**
2. Username: `akshar_admin` (or your choice)
3. Password: Click **"Autogenerate Secure Password"** → **COPY IT!**
4. Role: **"Read and write to any database"**
5. Click **"Add User"**

**Whitelist Your IP:**
1. Go to **Network Access** → **Add IP Address**
2. Click **"Allow Access from Anywhere"** (for development)
3. Click **"Confirm"**

---

### Step 4: Get Connection String (1 minute)

1. Go to **Database** → Click **"Connect"** button
2. Choose **"Connect your application"**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://akshar_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with the password you copied earlier

**Example:**
```
mongodb+srv://akshar_admin:MySecureP@ss123@cluster0.ab1cd.mongodb.net/?retryWrites=true&w=majority
```

If password has special characters, URL encode them:
- `@` → `%40`
- `:` → `%3A`  
- `/` → `%2F`

---

### Step 5: Import and Configure (5 minutes)

**Option A: Using Script (Easiest)**

1. Run the import script:
   ```powershell
   .\import_to_atlas.bat
   ```

2. Paste your Atlas connection string when prompted

3. Update `.edn.local`:
   ```env
   # Change this line:
   MONGO_URI=mongodb+srv://akshar_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

**Option B: Manual Import**

```powershell
# Replace with your actual connection string
mongorestore --uri="mongodb+srv://akshar_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/" --db="TalentMatchDB" ./mongodb_backup_XXXXXX/TalentMatchDB
```

---

## ✅ Test Your Connection

```powershell
# Test Atlas connection
python test_atlas_connection.py

# Start backend
.\start_backend.bat

# Test an API endpoint
curl http://localhost:3002/api/auth/test
```

You should see:
```
✅ Successfully connected to MongoDB Atlas!
📊 Found X collections
```

---

## 🎉 You're Done!

Your application is now using MongoDB Atlas (cloud database)!

**Benefits:**
- ✅ Accessible from anywhere
- ✅ Automatic backups
- ✅ Better security
- ✅ Scalable
- ✅ Free tier for development

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Authentication failed | Check username/password in connection string |
| Connection timeout | Add your IP in Atlas Network Access |
| Can't find mongodump | Install [MongoDB Database Tools](https://www.mongodb.com/try/download/database-tools) |
| Special character in password | URL encode it (see Step 4) |

**Still having issues?** See detailed guide: `MONGODB_ATLAS_MIGRATION_GUIDE.md`

---

## 📋 Checklist

- [ ] Exported local database
- [ ] Created Atlas account and cluster
- [ ] Created database user
- [ ] Whitelisted IP address
- [ ] Got connection string
- [ ] Imported data to Atlas
- [ ] Updated `.edn.local`
- [ ] Tested connection successfully
- [ ] Backend starts without errors

---

**Total Time:** ~15 minutes

**Need help?** Check `MONGODB_ATLAS_MIGRATION_GUIDE.md` for detailed instructions.

