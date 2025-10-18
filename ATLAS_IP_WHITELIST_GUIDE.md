# 🔒 MongoDB Atlas IP Whitelist - Step by Step

## ✅ Your MongoDB Credentials Are Correct

**Connection String:** `mongodb+srv://akshar_admin:WDQW9zihOVlhkExy@cluster0.lkow2ar.mongodb.net/`

The backend is configured correctly. The ONLY issue is the IP whitelist.

---

## 🎯 **Fix It in 2 Minutes:**

### Step 1: Open MongoDB Atlas
Go to: **https://cloud.mongodb.com/**

### Step 2: Login
Use your MongoDB Atlas account credentials

### Step 3: Select Your Project
Click on your project name (the one with "cluster0.lkow2ar")

### Step 4: Go to Network Access
- Look at the **LEFT SIDEBAR**
- Click **"Network Access"** (under Security section)

### Step 5: Add IP Address
- Click the green **"+ ADD IP ADDRESS"** button (top right)
- You'll see a popup

### Step 6: Enter AWS Server IP
In the popup:
- **IP Address field:** Type `13.61.35.12`
- **Comment:** Type `AWS EC2 Server`
- Click **"Confirm"** button

### Step 7: Verify IP is Added
You should now see in the list:
```
✅ 13.61.35.12/32   AWS EC2 Server   Active
```

Wait 1-2 minutes for changes to propagate.

### Step 8: Restart Backend
Run this on your PC:
```powershell
ssh -i aksharjobs-key.pem ubuntu@13.61.35.12 "pm2 restart akshar-backend && sleep 5 && pm2 status"
```

### Step 9: Test
After 10 seconds:
```powershell
Invoke-WebRequest -Uri "http://13.61.35.12/api/health" -UseBasicParsing
```

**Expected:** `Status: 200` with `{"status":"healthy","database":"connected"}`

### Step 10: Refresh Dashboard
Refresh your browser - 502 errors should be GONE! ✅

---

## 📸 **Visual Guide:**

```
MongoDB Atlas Dashboard
    ↓
Left Sidebar → "Network Access"
    ↓
Green Button → "+ ADD IP ADDRESS"
    ↓
Popup appears
    ↓
IP Address: 13.61.35.12
Comment: AWS EC2 Server
    ↓
Click "Confirm"
    ↓
✅ Done!
```

---

## ⚡ **Alternative: Allow All IPs (Quick Test)**

**WARNING: Less secure - only for testing**

Instead of entering `13.61.35.12`:
- Click **"ALLOW ACCESS FROM ANYWHERE"** button
- This adds `0.0.0.0/0` (any IP can connect)
- Good for testing, but should restrict to specific IP for production

---

## 🔍 **Verify Current Network Access**

In MongoDB Atlas → Network Access, you should see your current whitelist.

If you see:
- ✅ Your local IP (from home)
- ❌ NOT `13.61.35.12` (your AWS server)

That's why it's failing!

---

## ❓ **Don't Have MongoDB Atlas Access?**

### Option A: Ask Administrator
Ask whoever manages your MongoDB cluster to whitelist:
```
IP: 13.61.35.12
Description: AWS EC2 Backend Server
```

### Option B: Use Local MongoDB
Run this to switch to local database:
```powershell
.\switch_to_local_mongodb.ps1
```

---

## 🎯 **After Whitelisting:**

### Quick Restart Command:
```powershell
ssh -i aksharjobs-key.pem ubuntu@13.61.35.12 "pm2 restart akshar-backend"
```

### Wait 10 seconds, then test:
```powershell
Invoke-WebRequest -Uri "http://13.61.35.12/api/health" -UseBasicParsing
```

### Expected Success Response:
```json
{
  "status": "healthy",
  "database": "connected",
  "port": 3002
}
```

---

## 📞 **Troubleshooting**

### If you added the IP but it still fails:

1. **Wait 2-3 minutes** - Changes take time to propagate
2. **Check spelling** - Make sure IP is exactly `13.61.35.12`
3. **Check it's Active** - Status should show "Active" not "Pending"
4. **Restart backend** - Run the restart command again

### If you can't access MongoDB Atlas:

Run local MongoDB instead:
```powershell
.\switch_to_local_mongodb.ps1
```

This will work immediately without any whitelist.

---

## ✅ **Success Checklist**

- [ ] Logged into MongoDB Atlas
- [ ] Navigated to Network Access
- [ ] Added IP: 13.61.35.12
- [ ] IP shows as "Active"
- [ ] Waited 2 minutes
- [ ] Restarted backend
- [ ] Health endpoint returns 200 OK
- [ ] Dashboard loads without 502 errors

---

**🚀 Go whitelist the IP now!** It takes 30 seconds in MongoDB Atlas.

**MongoDB Atlas:** https://cloud.mongodb.com/  
**IP to Add:** `13.61.35.12`  
**Then run:** `.\restart_after_whitelist.ps1`

