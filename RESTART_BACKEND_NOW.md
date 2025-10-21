# 🔄 Restart Backend Right Now

## The Issue

Your backend is caching old password data. **You MUST restart it** for the new passwords to work.

## Quick Fix (2 Steps)

### Step 1: Open a NEW Terminal/PowerShell Window

Press `Win + R`, type `powershell`, press Enter

### Step 2: Run These Commands

```powershell
cd C:\Users\kalpi\Desktop\AksharJobs\backend
python app.py
```

**Keep this window open!** You should see:
```
✅ Connected to MongoDB successfully!
 * Running on http://0.0.0.0:3002
```

## Then Test Login

1. Go to: http://localhost:3003/login
2. Email: `test@example.com`
3. Password: `Test@123`
4. Click Login
5. ✅ Should work now!

## Alternative: Use the Batch File

Double-click: `restart_backend.bat` (in the root folder)

This will:
1. Stop the old backend
2. Start a new one
3. Open in a new window

---

## What Passwords Work Now?

**ALL 50 users** have password: `Test@123`

Examples:
- test@example.com / Test@123
- admin@example.com / Test@123  
- sarah.johnson@techcorp.com / Test@123
- Any email in your database / Test@123

---

**Do this NOW, then try logging in!** 🚀

