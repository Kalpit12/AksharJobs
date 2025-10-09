# 🚨 COMPLETE FIX FOR 403 ERROR

## 🔴 The Problem:

You deployed a NEW script, but it **still has "Only myself" access**, causing 403 errors.

The error from `script.googleusercontent.com` is Google's cached/redirected URL, which inherits the deployment permissions.

---

## ✅ COMPLETE SOLUTION (5 minutes):

### **IMPORTANT: Delete Old Deployment & Create Fresh One**

### **Step 1: Go to Google Apps Script**
```
1. Open: https://script.google.com
2. Click on your project
```

### **Step 2: Delete ALL Old Deployments**
```
1. Click "Deploy" → "Manage deployments"
2. For EACH deployment in the list:
   - Click the 3 dots menu (⋮) on the right
   - Click "Archive"
   - Confirm
3. All deployments should now be archived/removed
```

### **Step 3: Create FRESH Deployment with "Anyone" Access**
```
1. Make sure your code is saved (Ctrl+S)
2. Click "Deploy" → "New deployment"
3. Click the gear icon ⚙️ next to "Select type"
4. Select "Web app"
5. Fill in the form:

   Description: "Referral Tracking - Anyone Access"
   
   Web app:
   - Execute as: "Me (your@email.com)"
   - Who has access: "Anyone" ← CRITICAL! SELECT THIS!
   
6. Click "Deploy"
7. If prompted, click "Authorize access"
   - Select your Google account
   - Click "Advanced"
   - Click "Go to [project name] (unsafe)"
   - Click "Allow"
8. Copy the NEW Web App URL
```

### **Step 4: Verify "Anyone" is Set**
```
After deployment, you should see:

╔════════════════════════════════════════╗
║  Active Deployments                    ║
╠════════════════════════════════════════╣
║  @1  │  Web app  │  Anyone  ← MUST SAY "ANYONE"!
╚════════════════════════════════════════╝

If it says "Only myself" → YOU MUST CHANGE IT!
```

### **Step 5: Update referral.html with NEW URL**
```
1. Copy the Web App URL from step 3
2. Open referral.html
3. Find line 1572
4. Replace with your NEW URL
5. Save
```

### **Step 6: Test the NEW URL**
```
1. Open NEW INCOGNITO WINDOW (Ctrl+Shift+N)
2. Paste your new URL with test parameters:
   YOUR_NEW_URL?type=share&referrerEmail=test@test.com&referrerName=Test&platform=test&action=referral_share

3. ✅ Should see SUCCESS response (NOT "API is running")
4. ❌ Should NOT see 403 error
```

---

## 🎯 Critical Checklist:

When creating deployment, verify:
- [ ] Type: **Web app** (not other types)
- [ ] Execute as: **Me** (your email)
- [ ] Who has access: **"Anyone"** ← MOST IMPORTANT!
- [ ] Not showing: "Only myself" or "Only domain users"

---

## 🧪 How to Verify "Anyone" Access Works:

### **Test 1: Incognito Test**
```
1. Open incognito window (Ctrl+Shift+N)
2. Paste your script URL
3. ✅ Should work (you're not logged in, but it should still work)
4. If you get 403 → Access is NOT set to "Anyone"
```

### **Test 2: With Parameters**
```
Paste this (with YOUR URL):
https://script.google.com/macros/s/YOUR_NEW_URL/exec?type=share&referrerEmail=test@test.com&referrerName=Test&platform=whatsapp&coinsEarned=3&totalCoins=3&totalShares=1&referralCount=0&action=referral_share

✅ Should see JSON with "success":true
❌ Should NOT see 403 error
```

---

## 🔧 If Still Getting 403:

### **Double-Check Deployment Settings:**
```
1. Go to: https://script.google.com
2. Open your project
3. Click "Deploy" → "Manage deployments"
4. Click ✏️ (Edit) on the active deployment
5. Verify "Who has access" dropdown shows: "Anyone"
6. If not, change it to "Anyone"
7. Click "Deploy"
8. Wait 30 seconds for changes to propagate
```

### **Clear Google's Cache:**
```
After changing deployment settings:
1. Wait 30-60 seconds
2. Test URL in NEW incognito window
3. Don't use old cached URLs
```

---

## 📝 Current URLs:

### **Old URL (Don't Use):**
```
https://script.google.com/macros/s/AKfycbwhWHbU8pXOUqbW8vOSuHPcKzQw1u5olqNk6Ou_mCB5VfZaCTco7d5m3Q9MwXGIab9szw/exec
```

### **New URL (Use This):**
```
https://script.google.com/macros/s/AKfycbzIWDUnsWhdqj7324Ue-mGhlgqTgf8BwTyhChGW0OyqRLqnYw52lsdadoCmhQiSMUjh/exec
```

---

## 🚀 Quick Command to Update referral.html:

I already updated it! The new URL is now in referral.html at line 1572.

---

## ✅ After Fixing Deployment:

### **Test Sequence:**
```
1. Verify deployment has "Anyone" access
2. Test URL in incognito with parameters
3. Should see success response (not 403)
4. Then test from referral page
5. Share should save to Google Sheets
```

---

**The URL is updated in referral.html. Now make ABSOLUTELY SURE the deployment has "Anyone" access in Google Apps Script! That's the key! 🔑**
