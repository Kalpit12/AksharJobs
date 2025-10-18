# 🚨 QUICK FIX for 502 Errors - START HERE

## ⚡ Fastest Fix (2 minutes)

### Option 1: Use the PowerShell Script (RECOMMENDED)

1. **Open PowerShell** in this directory (`C:\Users\kalpi\Desktop\AksharJobs`)

2. **Run this command:**
   ```powershell
   .\fix_502_errors.ps1
   ```

3. **Wait 30 seconds** for the script to complete

4. **Refresh your browser** - errors should be gone! ✅

---

### Option 2: Use the Batch File (Double-Click)

1. **Double-click** `fix_502_errors_simple.bat`
2. **Wait** for it to complete
3. **Refresh browser** ✅

---

### Option 3: Manual SSH (If scripts don't work)

1. **Open PuTTY or Windows Terminal**

2. **Connect to server:**
   ```bash
   ssh -i aksharjobs-key.pem ubuntu@13.61.35.12
   ```

3. **Run these commands:**
   ```bash
   cd /var/www/AksharJobs
   pm2 restart akshar-backend
   pm2 status
   ```

4. **Test it:**
   ```bash
   curl http://localhost:3002/api/health
   ```

5. **Exit and refresh browser** ✅

---

## 🔍 Check Status First (Optional)

Before fixing, you can check what's wrong:

```powershell
.\check_backend_status.ps1
```

This will show you:
- ✅ or ❌ Backend API status
- PM2 process status
- Port availability
- Recent error logs

---

## ✅ How to Verify Fix Worked

After running the fix:

### 1. Browser Test
- Refresh your dashboard
- Console should show no 502 errors
- Dashboard should load data

### 2. Direct API Test
Open in browser: `http://13.61.35.12/api/health`

Should see:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-17T...",
  "database": "connected",
  "port": 3002
}
```

### 3. Check Specific Endpoints
- ✅ `http://13.61.35.12/api/data` - Should return dashboard data
- ✅ `http://13.61.35.12/api/notifications/` - Should return notifications
- ✅ `http://13.61.35.12/api/jobseeker/profile` - Should return profile

---

## 🚨 If Fix Doesn't Work

### Problem: PuTTY Not Found

**Install PuTTY:**
1. Download: https://www.putty.org/latest.html
2. Install with default settings
3. Re-run the fix script

### Problem: Permission Denied

**Convert PEM to PPK:**
1. Open PuTTYgen
2. Load `aksharjobs-key.pem`
3. Save private key as `aksharjobs-key.ppk`
4. Re-run script

### Problem: Backend Still Not Responding

**Try complete restart:**
```bash
# SSH into server
ssh -i aksharjobs-key.pem ubuntu@13.61.35.12

# Complete reset
cd /var/www/AksharJobs
pm2 delete akshar-backend
pm2 start ecosystem.config.js
pm2 save

# Check status
pm2 status
curl http://localhost:3002/api/health
```

### Problem: "Backend Started" but Still 502

**Check Nginx:**
```bash
# On server
sudo systemctl status nginx
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📞 Need More Help?

1. **Run diagnostic:**
   ```powershell
   .\check_backend_status.ps1 > status.txt
   ```
   Share the `status.txt` file

2. **Get detailed logs:**
   ```bash
   # On server
   pm2 logs akshar-backend --lines 100
   sudo tail -50 /var/log/nginx/error.log
   ```

3. **Check MongoDB:**
   ```bash
   # On server
   cd /var/www/AksharJobs/backend
   python3 -c "from database import get_database; db = get_database(); print('DB OK')"
   ```

---

## 🎯 Expected Timeline

- **Script execution:** ~30 seconds
- **Backend startup:** ~5 seconds
- **Total fix time:** ~1 minute
- **Browser refresh:** Immediate

---

## 📝 What the Script Does

1. ✅ Checks current PM2 status
2. ✅ Shows recent error logs
3. ✅ Stops hung backend process
4. ✅ Clears port 3002
5. ✅ Starts fresh backend instance
6. ✅ Saves PM2 configuration
7. ✅ Verifies backend is running
8. ✅ Tests health endpoint
9. ✅ Checks Nginx status

---

## 🔒 Safe to Run

- ✅ Won't delete data
- ✅ Won't affect database
- ✅ Won't break existing setup
- ✅ Only restarts backend process
- ✅ Can be run multiple times

---

**Current Server:** 13.61.35.12  
**Backend Port:** 3002  
**Process Name:** akshar-backend  
**Issue:** 502 Bad Gateway  
**Fix Time:** ~1 minute  

**👉 Run `.\fix_502_errors.ps1` now! 🚀**

