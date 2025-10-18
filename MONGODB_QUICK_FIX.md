# 🚨 MongoDB Connection - Quick Fix Options

Your backend is failing because MongoDB Atlas authentication is failing.

---

## ⚡ **OPTION 1: Use Local MongoDB (FASTEST - 2 minutes)**

This will install MongoDB on your AWS server and switch to using that instead of Atlas.

### Run this command:
```powershell
.\switch_to_local_mongodb.ps1
```

**What it does:**
1. ✅ Installs MongoDB on AWS server
2. ✅ Starts MongoDB service
3. ✅ Updates .env to use local MongoDB
4. ✅ Restarts backend
5. ✅ Tests everything works

**Pros:**
- ✅ Works immediately (no whitelist needed)
- ✅ Faster (no network latency)
- ✅ Full control
- ✅ Free

**Cons:**
- ⚠️ Data is on AWS server (need backups)
- ⚠️ Not cloud-distributed

**Time:** ~2 minutes

---

## 🌐 **OPTION 2: Fix MongoDB Atlas (If you have access)**

### Step 1: Login to MongoDB Atlas
Go to: https://cloud.mongodb.com/

### Step 2: Whitelist AWS Server IP
1. Click "Network Access" (left sidebar)
2. Click "+ ADD IP ADDRESS"
3. Enter: `13.61.35.12`
4. Click "Confirm"
5. Wait 2 minutes

### Step 3: Restart Backend
```powershell
.\restart_after_whitelist.ps1
```

**Pros:**
- ✅ Cloud-hosted database
- ✅ Automatic backups
- ✅ Scalable

**Cons:**
- ❌ Requires Atlas access
- ❌ Network latency
- ❌ May have costs

**Time:** ~3-5 minutes

---

## 🎯 **Which Should You Choose?**

### Choose **Option 1 (Local MongoDB)** if:
- ✅ You want it fixed NOW
- ✅ You don't have MongoDB Atlas access
- ✅ This is a development/test server
- ✅ You're okay with server-local data

### Choose **Option 2 (Atlas)** if:
- ✅ You have Atlas credentials
- ✅ You need cloud backups
- ✅ This is production
- ✅ You need multi-region access

---

## 🚀 **Quick Command Reference**

### Setup Local MongoDB:
```powershell
.\switch_to_local_mongodb.ps1
```

### After Atlas Whitelist:
```powershell
.\restart_after_whitelist.ps1
```

### Check Backend Status:
```powershell
ssh -i aksharjobs-key.pem ubuntu@13.61.35.12 "pm2 status"
```

### View Logs:
```powershell
ssh -i aksharjobs-key.pem ubuntu@13.61.35.12 "pm2 logs akshar-backend --lines 30"
```

### Test Health:
```powershell
Invoke-WebRequest -Uri "http://13.61.35.12/api/health" -UseBasicParsing
```

---

## 📊 **Current Status**

**Backend:** Online but crashing (19 restarts)  
**Error:** MongoDB Atlas authentication failed  
**IP:** 13.61.35.12 (NOT whitelisted in Atlas)  
**Solution:** Use local MongoDB OR whitelist IP  

---

## ✅ **Recommended: Run Local MongoDB Now**

Since Atlas is not whitelisted and backend keeps crashing:

```powershell
.\switch_to_local_mongodb.ps1
```

This will:
- Install MongoDB locally on AWS
- Update backend config
- Restart backend
- Test everything
- **Fix your 502 errors in 2 minutes!**

You can always switch back to Atlas later if needed.

---

**Ready to fix it? Run:** `.\switch_to_local_mongodb.ps1` 🚀

