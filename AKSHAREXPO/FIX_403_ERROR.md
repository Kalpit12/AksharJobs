# 🚨 FIX 403 ERROR - Google Apps Script Access Denied

## 🔴 The Problem:

```
Failed to load resource: the server responded with a status of 403 ()
```

**What this means:**
Your Google Apps Script is **blocking requests** because it's not deployed with "Anyone" access.

---

## ✅ SOLUTION (3 minutes):

### **Step 1: Open Google Apps Script**
```
1. Go to: https://script.google.com
2. Find your deployed project
```

### **Step 2: Check Current Deployment**
```
1. Click "Deploy" (top right)
2. Click "Manage deployments"
3. Look at "Who has access" column
4. If it says "Only myself" → This is the problem! ❌
```

### **Step 3: Fix the Deployment**
```
1. Click the pencil icon ✏️ (Edit) next to your deployment
2. Under "Who has access" dropdown:
   - Change from "Only myself" 
   - To "Anyone" ← IMPORTANT!
3. Click "Deploy"
4. ✅ Done!
```

### **Step 4: Verify**
```
1. The "Who has access" column should now show: "Anyone"
2. ✅ This allows your website to send data to the script
```

---

## 📋 Alternative: Create New Deployment

If you can't edit the existing deployment:

### **Create Fresh Deployment:**
```
1. Click "Deploy" → "New deployment"
2. Click the gear icon ⚙️
3. Select type: "Web app"
4. Fill in:
   - Description: "Referral Tracking - Anyone Access"
   - Execute as: "Me" (your email)
   - Who has access: "Anyone" ← CRITICAL!
5. Click "Deploy"
6. Click "Authorize access"
7. Select your Google account
8. Click "Advanced" → "Go to [project name] (unsafe)"
9. Click "Allow"
10. Copy the NEW Web App URL
```

### **Update referral.html with New URL:**
```
1. If you got a NEW URL, update line 1572 in referral.html:
   const REFERRAL_WEBHOOK_URL = 'YOUR_NEW_URL_HERE';
2. Save the file
3. Refresh browser
```

---

## 🔍 How to Verify It's Fixed:

### **Test the Script Directly:**
```
1. Copy your script URL:
   https://script.google.com/macros/s/AKfycbwhWHbU8pXOUqbW8vOSuHPcKzQw1u5olqNk6Ou_mCB5VfZaCTco7d5m3Q9MwXGIab9szw/exec

2. Add test parameters:
   ?type=share&referrerEmail=test@test.com&referrerName=Test&platform=whatsapp

3. Full URL:
   https://script.google.com/macros/s/AKfycbwhWHbU8pXOUqbW8vOSuHPcKzQw1u5olqNk6Ou_mCB5VfZaCTco7d5m3Q9MwXGIab9szw/exec?type=share&referrerEmail=test@test.com&referrerName=Test&platform=whatsapp

4. Open this URL in browser

5. ✅ Should see:
   {"success":true,"message":"Referral shared via whatsapp!..."}

6. ❌ If you see 403 error → Access not set to "Anyone"
```

---

## 🎯 Common Causes of 403 Error:

### **Cause 1: Wrong Access Setting** (Most Common)
**Problem:** Deployment has "Only myself" access
**Fix:** Change to "Anyone" in deployment settings

### **Cause 2: Not Deployed as Web App**
**Problem:** Script saved but not deployed
**Fix:** Must deploy as "Web app" type

### **Cause 3: Old Deployment**
**Problem:** Using outdated deployment
**Fix:** Create new deployment with "Anyone" access

### **Cause 4: Authorization Expired**
**Problem:** You need to re-authorize
**Fix:** Edit deployment → Re-authorize → Deploy

---

## 📊 Deployment Settings Checklist:

When deploying, make sure:
- [x] Type: **Web app** (not API executable or other)
- [x] Execute as: **Me** (your email)
- [x] Who has access: **Anyone** ← CRITICAL!
- [x] Status: **Active** (not testing or inactive)

---

## 🔧 Quick Verification:

### **Check 1: Test URL Directly**
Open this in browser:
```
https://script.google.com/macros/s/AKfycbwhWHbU8pXOUqbW8vOSuHPcKzQw1u5olqNk6Ou_mCB5VfZaCTco7d5m3Q9MwXGIab9szw/exec
```

**✅ Good Response:**
```json
{
  "message": "AksharJobs Expo Registration & Referral API is running",
  "timestamp": "2025-10-03T08:35:45.195Z"
}
```

**❌ Bad Response:**
```
403 Forbidden
or
You do not have permission to access this resource
```

### **Check 2: Test with Parameters**
Open this in browser:
```
https://script.google.com/macros/s/AKfycbwhWHbU8pXOUqbW8vOSuHPcKzQw1u5olqNk6Ou_mCB5VfZaCTco7d5m3Q9MwXGIab9szw/exec?type=share&referrerEmail=test@test.com&referrerName=Test&platform=test
```

**✅ Good Response:**
```json
{
  "success": true,
  "message": "Referral shared via test!...",
  ...
}
```

---

## 🎓 Understanding the Error:

### **What 403 Means:**
```
403 = Forbidden = You don't have permission
```

### **Why It Happens:**
Google Apps Script has security settings. When deployed with "Only myself" access:
- ✅ You can access it (when logged into your Google account)
- ❌ Your website CANNOT access it
- ❌ Anonymous users CANNOT access it

### **The Fix:**
Change to "Anyone" access:
- ✅ Anyone can send data to the script
- ✅ Your website can access it
- ✅ All users can share and track data

---

## 🚀 After Fixing:

### **Console Logs Should Show:**
```javascript
✅ Fetch sent to Google Sheets (no-cors)
✅ Image pixel loaded successfully
✅ Iframe loaded successfully
```

### **NOT:**
```javascript
❌ Failed to load resource: 403
⚠️ Referral image pixel error
```

---

## 📞 Step-by-Step Fix:

```
1. Open: https://script.google.com
2. Select your project
3. Click "Deploy" → "Manage deployments"
4. Click ✏️ (Edit icon)
5. Change "Who has access" to "Anyone"
6. Click "Deploy"
7. Test by opening the script URL in browser
8. ✅ Should work without 403 error!
```

---

**This is a common deployment issue and easy to fix!**
**Just change access to "Anyone" and you're done! 🎉**

