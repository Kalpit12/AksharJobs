# 🔧 Fix MongoDB Atlas Connection - Whitelist AWS Server

## 🎯 Problem
Backend shows: `[ERROR] Error connecting to MongoDB: bad auth : Authentication failed.`

This means your AWS server IP is NOT whitelisted in MongoDB Atlas.

---

## ✅ Solution: Add AWS IP to MongoDB Atlas

### Step 1: Login to MongoDB Atlas
1. Go to: https://cloud.mongodb.com/
2. Login with your credentials
3. Select your organization/project

### Step 2: Navigate to Network Access
1. In the left sidebar, click **"Network Access"**
2. You'll see a list of allowed IP addresses

### Step 3: Add AWS Server IP
1. Click **"+ ADD IP ADDRESS"** button (top right)
2. Enter the AWS server IP:
   ```
   IP Address: 13.61.35.12
   Description: AWS EC2 Server
   ```
3. Click **"Confirm"**
4. Wait 1-2 minutes for the change to propagate

### Step 4: Verify IP is Added
You should see:
```
✅ 13.61.35.12/32   AWS EC2 Server   Active
```

### Step 5: Restart Backend on AWS

**Option A: Run PowerShell command from your local PC:**
```powershell
ssh -i aksharjobs-key.pem -o "StrictHostKeyChecking=no" ubuntu@13.61.35.12 "pm2 restart akshar-backend"
```

**Option B: SSH into server manually:**
```bash
ssh -i aksharjobs-key.pem ubuntu@13.61.35.12
pm2 restart akshar-backend
pm2 logs akshar-backend --lines 20
```

### Step 6: Test
After 10 seconds, test the health endpoint:
```powershell
Invoke-WebRequest -Uri "http://13.61.35.12/api/health" -UseBasicParsing
```

Should return:
```json
{"status":"healthy","database":"connected","port":3002}
```

---

## 🔍 Alternative: Allow Access from Anywhere (Quick Test)

**WARNING: Less secure - use only for testing**

1. In MongoDB Atlas → Network Access
2. Click "+ ADD IP ADDRESS"
3. Click "ALLOW ACCESS FROM ANYWHERE"
4. Click "Confirm"
5. Restart backend

This adds `0.0.0.0/0` which allows any IP.  
**For production, use specific IP (13.61.35.12) instead!**

---

## ❓ If Authentication Still Fails

### Check MongoDB User Credentials

1. In MongoDB Atlas, go to **"Database Access"** (left sidebar)
2. Find user: `akshar_admin`
3. Verify:
   - ✅ User exists
   - ✅ User has "Read and write to any database" role
   - ✅ Password is correct: `WDQW9zihOVlhkExy`

### If User Doesn't Exist or Password Wrong

1. In "Database Access", click "+ ADD NEW DATABASE USER"
2. Authentication Method: **Password**
3. Username: `akshar_admin`
4. Password: `WDQW9zihOVlhkExy` (or click "Autogenerate Secure Password")
5. Database User Privileges: **"Built-in Role" → "Atlas admin"**
6. Click "Add User"
7. Update `.env` file on AWS server with new credentials

### Update .env on Server

If you changed the password:

```bash
# SSH into server
ssh -i aksharjobs-key.pem ubuntu@13.61.35.12

# Edit .env file
nano /var/www/AksharJobs/backend/.env

# Update MONGO_URI line:
MONGO_URI=mongodb+srv://akshar_admin:NEW_PASSWORD@cluster0.lkow2ar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Save: Ctrl+O, Enter, Ctrl+X

# Restart backend
pm2 restart akshar-backend

# Check logs
pm2 logs akshar-backend --lines 20
```

---

## 🎯 Quick Test After Fix

```powershell
# From your local PC
ssh -i aksharjobs-key.pem ubuntu@13.61.35.12 "curl -s http://localhost:3002/api/health"
```

Expected output:
```json
{"status":"healthy","database":"connected","port":3002}
```

---

## 📊 Summary

**Current Issue:** MongoDB Atlas blocking connection from AWS server  
**AWS Server IP:** 13.61.35.12  
**Solution:** Whitelist IP in MongoDB Atlas Network Access  
**Time to Fix:** 2-3 minutes  

**After whitelisting IP:**
- ✅ Backend will connect to MongoDB
- ✅ 502 errors will be fixed
- ✅ Dashboard will load data
- ✅ All API endpoints will work

---

**Quick Action:** Whitelist `13.61.35.12` in MongoDB Atlas → Restart backend → Test!

