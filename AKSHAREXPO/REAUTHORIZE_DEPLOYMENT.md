# 🔐 RE-AUTHORIZE DEPLOYMENT - Fix 403 on Cached URLs

## 🔴 The Issue:

Even though your main script URL works, Google creates cached URLs like:
```
script.googleusercontent.com/macros/echo?user_content_key=...
```

These cached URLs can have different permissions and cause 403 errors.

---

## ✅ COMPLETE FIX (Re-authorize):

### **Step 1: Remove Current Deployment**
```
1. Go to: https://script.google.com
2. Open your project
3. Click "Deploy" → "Manage deployments"
4. Find your current deployment
5. Click the 3 dots (⋮) → "Archive"
6. Confirm archive
```

### **Step 2: Create BRAND NEW Deployment**
```
1. Make sure code is saved (Ctrl+S)
2. Click "Deploy" → "New deployment"
3. Click gear icon ⚙️ → Select "Web app"
4. Fill in:
   
   Description: Referral Tracker v2
   
   Execute as: Me (your-email@gmail.com)
   
   Who has access: Anyone ← SELECT THIS!
   
5. Click "Deploy"
```

### **Step 3: IMPORTANT - Re-authorize**
```
1. You'll see: "Authorization required"
2. Click "Authorize access"
3. Select your Google account
4. You'll see: "This app isn't verified"
5. Click "Advanced"
6. Click "Go to [Your Project Name] (unsafe)"
7. Scroll down
8. Click "Allow" ← IMPORTANT!
9. Wait for "Deployment successful" message
10. Copy the NEW Web App URL
```

### **Step 4: Update referral.html**
```
If you got a new URL (different from current one):
1. Open referral.html
2. Update line 1572 with the new URL
3. Save
```

### **Step 5: Test in Incognito**
```
1. Open incognito window (Ctrl+Shift+N)
2. Paste this URL (replace YOUR_URL with your new deployment URL):

YOUR_URL?type=share&action=referral_share&referrerEmail=neel66569@gmail.com&referrerName=Neel&platform=whatsapp&coinsEarned=3&totalCoins=3&totalShares=1&referralCount=0

3. ✅ Should see JSON with "success": true
4. ❌ Should NOT see 403 error
```

---

## 🎯 Why This Works:

### **The Problem:**
- Google caches script responses
- Cached URLs inherit old permissions
- Re-authorizing clears the cache and sets new permissions

### **The Solution:**
- Delete old deployment
- Create fresh deployment
- Re-authorize completely
- New permissions apply to all URLs (including cached ones)

---

## 📋 Authorization Flow:

```
Step 1: Click "Deploy"
Step 2: "Authorization required" appears
Step 3: Click "Authorize access"
Step 4: Select your Google account
Step 5: See "This app isn't verified" warning
Step 6: Click "Advanced" at bottom left
Step 7: Click "Go to [project] (unsafe)"
Step 8: Review permissions
Step 9: Click "Allow" button
Step 10: ✅ Deployment created with proper permissions!
```

---

## 🔍 Common Mistakes:

### ❌ **Mistake 1: Skipping Authorization**
```
Problem: Click "Deploy" but don't authorize
Result: Deployment has no permissions → 403 errors
Fix: Must complete full authorization flow
```

### ❌ **Mistake 2: Not Clicking "Unsafe"**
```
Problem: Stop at "This app isn't verified" screen
Result: Authorization not completed → 403 errors
Fix: Click "Advanced" → "Go to... (unsafe)" → "Allow"
```

### ❌ **Mistake 3: Using Old Deployment**
```
Problem: Edit existing deployment without re-authorizing
Result: Cached URLs still have old permissions
Fix: Delete old, create new, re-authorize
```

---

## ✅ After Successful Deployment:

### **Test from Referral Page:**
```
1. Open referral.html (fresh, clear cache: Ctrl+Shift+R)
2. Login as Neel
3. Share on WhatsApp
4. Check console:
   ✅ Should see: "✅ Fetch sent to Google Sheets successfully"
   ❌ Should NOT see: "403" errors
5. Wait 10 seconds
6. Check Google Sheets
   ✅ Should see new row for neel66569@gmail.com
```

---

## 🚀 Quick Checklist:

- [ ] Archived old deployment
- [ ] Created new deployment
- [ ] Selected "Web app" type
- [ ] Set "Execute as: Me"
- [ ] Set "Who has access: Anyone"
- [ ] Clicked "Authorize access"
- [ ] Clicked "Advanced" → "Go to... (unsafe)"
- [ ] Clicked "Allow"
- [ ] Got success message
- [ ] Copied new URL
- [ ] Updated referral.html (if URL changed)
- [ ] Tested in incognito (no 403)

---

**The key is to RE-AUTHORIZE completely! This clears all cached permissions and fixes the 403 errors on googleusercontent.com URLs! 🔑**

