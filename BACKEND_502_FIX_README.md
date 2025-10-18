# 🔧 Fix 502 Bad Gateway Errors - Quick Guide

## 🎯 Problem
Your frontend is getting **502 Bad Gateway** errors when trying to access the backend API at `http://13.61.35.12/api/*`

## 🔍 Root Cause
The backend server process on AWS is either:
- ❌ Not running
- ❌ Crashed
- ❌ Listening on wrong port
- ❌ Not configured in PM2

## ✅ Solution - Choose Your Method

### Method 1: PowerShell Script (Recommended)

1. **Open PowerShell** in the project directory
2. **Run the fix script:**
   ```powershell
   .\fix_502_errors.ps1
   ```

This script will:
- ✅ Check backend status
- ✅ Stop any stuck processes
- ✅ Clear port 3002
- ✅ Restart the backend with PM2
- ✅ Verify it's working
- ✅ Test all endpoints

### Method 2: Batch File (Simple)

1. **Double-click** `fix_502_errors_simple.bat`
2. Wait for it to complete
3. Refresh your browser

### Method 3: Manual SSH Commands

If you prefer to do it manually:

```bash
# 1. Connect to server
ssh -i aksharjobs-key.pem ubuntu@13.61.35.12

# 2. Navigate to project
cd /var/www/AksharJobs

# 3. Check PM2 status
pm2 status

# 4. Restart backend
pm2 restart akshar-backend

# OR if backend is not in PM2:
pm2 start ecosystem.config.js
pm2 save

# 5. Check if it's running
pm2 status
curl http://localhost:3002/api/health

# 6. Check logs if there are issues
pm2 logs akshar-backend --lines 50
```

## 🧪 Verification Steps

After running the fix:

### 1. Check Browser Console
Refresh your dashboard and check if 502 errors are gone.

### 2. Test Health Endpoint
Open in browser: `http://13.61.35.12/api/health`

Should return:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "database": "connected",
  "port": 3002
}
```

### 3. Test API Endpoints
- Dashboard data: `http://13.61.35.12/api/data`
- Profile: `http://13.61.35.12/api/jobseeker/profile`
- Notifications: `http://13.61.35.12/api/notifications/`

## 🔍 Common Issues & Solutions

### Issue 1: PuTTY Not Found
**Error:** "PuTTY's plink.exe not found"

**Solution:** Install PuTTY:
1. Download from: https://www.putty.org/
2. Install with default settings
3. Re-run the script

### Issue 2: Key File Not Found
**Error:** "Key file not found: aksharjobs-key.ppk"

**Solution:** 
- Ensure `aksharjobs-key.ppk` is in the same folder as the script
- OR convert your `.pem` file to `.ppk` using PuTTYgen

### Issue 3: Backend Keeps Crashing
**Symptom:** Backend starts but crashes immediately

**Solution:** Check logs on server:
```bash
ssh -i aksharjobs-key.pem ubuntu@13.61.35.12
pm2 logs akshar-backend --err --lines 100
```

Common causes:
- Missing environment variables in `.env`
- MongoDB connection issues
- Port 3002 already in use
- Python dependencies missing

### Issue 4: Still Getting 502 After Fix
**Possible causes:**

1. **Nginx not configured correctly**
   ```bash
   # On server
   sudo nginx -t
   sudo systemctl restart nginx
   ```

2. **Firewall blocking port**
   ```bash
   # On server
   sudo ufw allow 3002
   sudo ufw status
   ```

3. **Backend running on different port**
   ```bash
   # On server
   netstat -tlnp | grep :3002
   ```

## 📊 Monitoring

### View Real-time Logs
```bash
ssh -i aksharjobs-key.pem ubuntu@13.61.35.12
pm2 logs akshar-backend
```

### Check PM2 Status
```bash
pm2 status
pm2 monit
```

### View Resource Usage
```bash
pm2 info akshar-backend
```

## 🚨 Emergency Commands

### Complete Backend Reset
```bash
# On AWS server
cd /var/www/AksharJobs
pm2 delete akshar-backend
pm2 start ecosystem.config.js
pm2 save
```

### Force Kill and Restart
```bash
# Kill any process on port 3002
sudo lsof -ti:3002 | xargs sudo kill -9

# Start fresh
cd /var/www/AksharJobs
pm2 start ecosystem.config.js
pm2 save
```

### Check All Services
```bash
# MongoDB
sudo systemctl status mongod

# Nginx
sudo systemctl status nginx

# PM2
pm2 status

# Backend health
curl http://localhost:3002/api/health
```

## 📁 Important Files on Server

| File | Location | Purpose |
|------|----------|---------|
| Backend Code | `/var/www/AksharJobs/backend/` | Flask application |
| PM2 Config | `/var/www/AksharJobs/ecosystem.config.js` | Process manager config |
| Environment | `/var/www/AksharJobs/backend/.env` | Configuration & secrets |
| Nginx Config | `/etc/nginx/sites-available/default` | Web server config |
| Logs | `~/.pm2/logs/` | PM2 application logs |

## 🔄 Auto-Restart Setup

To ensure backend starts automatically on server reboot:

```bash
# On AWS server (one-time setup)
pm2 startup
pm2 save
```

## 📞 Still Having Issues?

If the fix scripts don't work:

1. **Collect diagnostic info:**
   ```bash
   # On server
   pm2 logs akshar-backend --lines 100 > ~/backend_logs.txt
   sudo tail -n 100 /var/log/nginx/error.log > ~/nginx_errors.txt
   pm2 status
   netstat -tlnp | grep :3002
   ```

2. **Check MongoDB connection:**
   ```bash
   # On server
   cd /var/www/AksharJobs/backend
   python3 -c "from database import get_database; db = get_database(); print('✅ MongoDB connected')"
   ```

3. **Verify environment variables:**
   ```bash
   # On server
   cd /var/www/AksharJobs/backend
   cat .env | grep -v PASSWORD | grep -v SECRET | grep -v KEY
   ```

## 🎯 Quick Test After Fix

1. **Refresh Dashboard** → Should load without 502 errors ✅
2. **Check Console** → No red error messages ✅
3. **Test Login** → Should work ✅
4. **View Profile** → Should load data ✅

---

**Last Updated:** October 17, 2025  
**Server:** AWS EC2 at 13.61.35.12  
**Backend Port:** 3002  
**PM2 Process:** akshar-backend

