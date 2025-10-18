# 🚨 FIX 502 ERRORS - START HERE 🚨

## ⚡ Step 1: Test if Backend is Down (10 seconds)

**Open PowerShell and run:**
```powershell
cd C:\Users\kalpi\Desktop\AksharJobs
.\test_backend_simple.ps1
```

**This will tell you:**
- ✅ Backend is working (no fix needed)
- ❌ Backend is down (need to fix)

---

## 🔧 Step 2: Fix the Backend (30 seconds)

**If Step 1 showed backend is down, run:**
```powershell
.\fix_502_errors.ps1
```

**What this does:**
- Connects to your AWS server (13.61.35.12)
- Restarts the backend process with PM2
- Verifies everything is working
- Tests the health endpoint

---

## ✅ Step 3: Verify Fix Worked (5 seconds)

**Run the test again:**
```powershell
.\test_backend_simple.ps1
```

**Expected output:**
```
✅ SUCCESS! Backend is responding!

Response Status: 200
Response Content:
{"status":"healthy","database":"connected","port":3002}

🎉 Your backend is WORKING!
```

**Then refresh your dashboard in the browser!**

---

## 🚫 If PowerShell Script Fails

### Problem: "Cannot find PuTTY's plink.exe"

**Solution 1:** Install PuTTY
1. Download: https://www.putty.org/latest.html
2. Install with default settings
3. Re-run the script

**Solution 2:** Use the batch file instead
```batch
Double-click: fix_502_errors_simple.bat
```

### Problem: "Cannot find key file"

**Solution:** Make sure `aksharjobs-key.ppk` is in the same folder

If you only have `aksharjobs-key.pem`:
1. Open PuTTYgen
2. Click "Load"
3. Select `aksharjobs-key.pem`
4. Click "Save private key"
5. Save as `aksharjobs-key.ppk`

### Problem: Script syntax errors

**Solution:** Copy commands manually to SSH client

See: `MANUAL_SSH_FIX.txt` for step-by-step commands

---

## 📞 Alternative: Manual SSH Fix

If scripts don't work, use PuTTY or Windows Terminal:

```bash
# 1. Connect
ssh -i aksharjobs-key.pem ubuntu@13.61.35.12

# 2. Navigate
cd /var/www/AksharJobs

# 3. Restart backend
pm2 restart akshar-backend

# 4. Check status
pm2 status

# 5. Test
curl http://localhost:3002/api/health

# Expected: {"status":"healthy"...}
```

---

## 🎯 Quick Checklist

- [ ] Run `.\test_backend_simple.ps1` to check status
- [ ] If backend is down, run `.\fix_502_errors.ps1`
- [ ] Wait 30 seconds for script to complete
- [ ] Run `.\test_backend_simple.ps1` again to verify
- [ ] Open `http://13.61.35.12/api/health` in browser
- [ ] Should see: `{"status":"healthy"...}`
- [ ] Refresh your dashboard
- [ ] 502 errors should be gone! ✅

---

## 📊 Understanding the Error

**What is 502 Bad Gateway?**
- Frontend (13.61.35.12) is working ✅
- Nginx web server is working ✅
- Backend API (port 3002) is NOT running ❌

**The Flow:**
```
Browser → Nginx (80/443) → Backend (3002)
                              ↑
                              ❌ This is broken
```

**After Fix:**
```
Browser → Nginx (80/443) → Backend (3002) ✅
```

---

## 🔍 Files Created for You

| File | Purpose | How to Use |
|------|---------|------------|
| `test_backend_simple.ps1` | Test backend health | `.\test_backend_simple.ps1` |
| `fix_502_errors.ps1` | Fix backend via SSH | `.\fix_502_errors.ps1` |
| `fix_502_errors_simple.bat` | Simple fix (batch) | Double-click it |
| `check_backend_status.ps1` | Detailed diagnostics | `.\check_backend_status.ps1` |
| `MANUAL_SSH_FIX.txt` | Manual commands | Read and copy commands |

---

## 🎯 Expected Timeline

1. **Test:** 10 seconds
2. **Fix:** 30 seconds  
3. **Verify:** 5 seconds
4. **Total:** ~1 minute

---

## 📝 Common Questions

**Q: Why did backend stop?**
A: Server restart, crash, or PM2 process manager issue

**Q: Will this affect my data?**
A: No, this only restarts the backend process. Data is safe in MongoDB.

**Q: Can I run this multiple times?**
A: Yes, it's safe to run as many times as needed.

**Q: What if it still doesn't work?**
A: Check logs on server: `pm2 logs akshar-backend --lines 50`

---

## 🚀 Ready to Fix?

**Run these two commands:**

```powershell
# Step 1: Test
.\test_backend_simple.ps1

# Step 2: Fix (if needed)
.\fix_502_errors.ps1
```

**That's it! Your backend will be fixed in ~30 seconds.**

---

**Current Server:** 13.61.35.12  
**Backend Port:** 3002  
**Process Name:** akshar-backend  
**Issue:** Backend not running → 502 errors  
**Fix:** Restart backend with PM2  
**Time:** ~30 seconds  

**👉 Start with: `.\test_backend_simple.ps1` 🚀**

