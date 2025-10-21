# 🔐 MongoDB Atlas - Whitelist Server IP

Your backend is failing because the **server IP is not whitelisted** in MongoDB Atlas.

## ⚡ Quick Fix (5 minutes)

### Step 1: Find Your Server IPs

Your server has these IPs that need to be whitelisted:
- **Public IP:** `13.61.35.12`
- **Private IP:** `172.31.32.184`

### Step 2: Whitelist IPs in MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in
3. Click on your cluster
4. Go to **Network Access** (left sidebar)
5. Click **"+ ADD IP ADDRESS"**
6. Add these entries:

**Entry 1: Server Public IP**
- IP Address: `13.61.35.12/32`
- Comment: `AksharJobs Server`
- Click **"Confirm"**

**Entry 2: Allow All (For Testing)**
- Click **"ALLOW ACCESS FROM ANYWHERE"**
- Comment: `Development - All IPs`
- Click **"Confirm"**

### Step 3: Wait & Restart

Wait 2-3 minutes for Atlas to apply the changes, then:

```powershell
ssh -i "aksharjobs-key.pem.bak" ubuntu@13.61.35.12 "pm2 restart akshar-backend"
```

## 🔍 Alternative: Verify Atlas Credentials

If whitelisting doesn't work, the password might be wrong. Test the connection:

```powershell
# Test locally
python -c "from pymongo import MongoClient; client = MongoClient('mongodb+srv://akshar_admin:WDQW9zihOVlhkExy@cluster0.lkow2ar.mongodb.net/'); print('✅ Connected!'); print('Databases:', client.list_database_names())"
```

## 📋 Current Status

- ❌ Backend Status: Crashing (4510+ restarts)
- ❌ MongoDB Atlas: Authentication Failed
- ❌ Server IP: Not whitelisted
- ✅ Frontend: Working (but can't reach backend)
- ✅ Atlas Connection String: Configured

## ✅ After Whitelisting

The backend should connect successfully. Check with:

```bash
pm2 logs akshar-backend --lines 30
```

You should see:
```
✅ Successfully connected to MongoDB Atlas!
🚀 Server running on port 3002
```

## 🆘 Still Not Working?

### Option 1: Reset Atlas Password

1. Go to **Database Access** in Atlas
2. Edit user `akshar_admin`
3. Click **"Edit Password"**
4. Generate new password
5. Update `.env` file on server
6. Restart backend

### Option 2: Create New Atlas User

```bash
# On server
cd /var/www/AksharJobs/backend
nano .env  # Update MONGO_URI with new credentials
pm2 restart akshar-backend
```

---

**Next:** Whitelist the IPs in Atlas and wait 2-3 minutes before testing.

