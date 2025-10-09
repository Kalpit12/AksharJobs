# 📸 VISUAL GUIDE - Fix 403 Error

## 🎯 The Issue:
```
403 Forbidden Error = Google Apps Script blocking requests
```

## ✅ The Fix: Change "Who has access" to "Anyone"

---

## 📋 EXACT STEPS WITH WHAT TO CLICK:

### **Step 1: Open Google Apps Script**
```
1. Browser → New Tab
2. Go to: https://script.google.com
3. You'll see your projects list
4. Click on your project (the one you deployed)
```

---

### **Step 2: Open Deployments**
```
1. Look at the TOP RIGHT of the screen
2. Find the blue "Deploy" button
3. Click "Deploy"
4. A dropdown menu appears
5. Click "Manage deployments"
```

**What you'll see:**
```
╔═══════════════════════════════════════╗
║  My Deployments                       ║
╠═══════════════════════════════════════╣
║  Deployment  │  Type    │  Who has   ║
║              │          │  access    ║
╠═══════════════════════════════════════╣
║  @1          │  Web app │  Only myself  ← PROBLEM!
║  ✏️ (edit)                            ║
╚═══════════════════════════════════════╝
```

---

### **Step 3: Edit Deployment**
```
1. Find the deployment in the list
2. Look for the ✏️ (pencil) icon on the right side
3. Click the ✏️ (pencil) icon
```

**What you'll see:**
```
╔═══════════════════════════════════════╗
║  Edit deployment                      ║
╠═══════════════════════════════════════╣
║  Configuration:                       ║
║    Description: [your description]    ║
║                                       ║
║  Execute as:                          ║
║    ○ Me (your@email.com)  ← Should be selected
║    ○ User accessing the web app       ║
║                                       ║
║  Who has access:                      ║
║    ▼ Only myself          ← CHANGE THIS!
║                                       ║
║  [ Cancel ]  [ Deploy ]               ║
╚═══════════════════════════════════════╝
```

---

### **Step 4: Change Access**
```
1. Click the "Who has access" dropdown
2. You'll see options:
   - Only myself
   - Anyone
   - Anyone with Google account
   
3. Select "Anyone" ← CLICK THIS!
```

**After selecting:**
```
╔═══════════════════════════════════════╗
║  Who has access:                      ║
║    ▼ Anyone               ← NOW THIS!
║                                       ║
║  [ Cancel ]  [ Deploy ]               ║
╚═══════════════════════════════════════╝
```

---

### **Step 5: Deploy**
```
1. Click the blue "Deploy" button at the bottom right
2. Wait a few seconds (deployment updating...)
3. You'll see: "Deployment updated successfully" ✅
4. Click "Done"
```

**Now the list shows:**
```
╔═══════════════════════════════════════╗
║  Deployment  │  Type    │  Who has   ║
║              │          │  access    ║
╠═══════════════════════════════════════╣
║  @1          │  Web app │  Anyone  ← FIXED! ✅
╚═══════════════════════════════════════╝
```

---

### **Step 6: Verify**
```
1. Copy your script URL:
   https://script.google.com/macros/s/AKfycbwhWHbU8pXOUqbW8vOSuHPcKzQw1u5olqNk6Ou_mCB5VfZaCTco7d5m3Q9MwXGIab9szw/exec

2. Open it in a NEW INCOGNITO WINDOW (Ctrl+Shift+N)

3. ✅ Should see:
   {"message":"AksharJobs Expo Registration & Referral API is running"...}

4. ❌ Should NOT see:
   403 Forbidden
   Authorization required
```

---

## 🎯 Visual Checklist:

### **Before Fix:**
```
Deployment Settings:
Execute as: Me ✅
Who has access: Only myself ❌ ← PROBLEM!
```

### **After Fix:**
```
Deployment Settings:
Execute as: Me ✅
Who has access: Anyone ✅ ← FIXED!
```

---

## 🧪 Test After Fix:

### **Test 1: Direct URL (Incognito)**
```
1. Open incognito window (Ctrl+Shift+N)
2. Paste script URL
3. ✅ Should work (no 403 error)
```

### **Test 2: From Referral Page**
```
1. Go to referral.html
2. Share on WhatsApp
3. Confirm share
4. Check console:
   ✅ Should NOT see: "403 error"
   ✅ Should see: "✅ Image pixel loaded successfully"
```

---

## 📞 Common Questions:

### **Q: Why "Anyone" is Safe?**
**A:** The script only accepts referral data. No sensitive operations. Anyone can send share data, which is exactly what you want!

### **Q: Will this expose my data?**
**A:** No! "Anyone" can SEND data to the script, but they can't READ your Google Sheet unless you share it with them.

### **Q: What if I can't find "Manage deployments"?**
**A:** Your script might not be deployed yet. Do "New deployment" instead (see Step 3 in previous section).

---

## 🎓 Understanding Access Levels:

### **"Only myself"**
- ✅ You can use it (when logged in)
- ❌ Your website CANNOT use it
- ❌ Other users CANNOT use it
- **Result:** 403 errors for everyone else

### **"Anyone"** ← USE THIS
- ✅ You can use it
- ✅ Your website CAN use it
- ✅ All users CAN use it
- **Result:** No 403 errors! ✅

### **"Anyone with Google account"**
- ✅ Works for logged-in Google users
- ⚠️ Might still cause issues for anonymous users
- **Not recommended** for this use case

---

## 🚀 After Fixing 403 Error:

### **Expected Behavior:**
```
1. User shares on WhatsApp
2. Data sent to Google Apps Script ✅
3. Script saves to Google Sheets ✅
4. No 403 errors ✅
5. Console shows: "✅ Image pixel loaded successfully"
```

### **Console Logs:**
```javascript
📤 Sending referral data to Google Sheets: {...}
🔗 Webhook URL: https://script.google.com/...
✅ Fetch sent to Google Sheets (no-cors)
✅ Image pixel loaded successfully  ← Should see this!
✅ Iframe loaded successfully       ← Should see this!
```

### **NOT:**
```javascript
❌ Failed to load resource: 403
⚠️ Referral image pixel error
```

---

## 📝 Summary:

**Problem:** 403 = Google Apps Script blocking requests
**Cause:** Deployment has "Only myself" access
**Fix:** Change to "Anyone" access
**Time to fix:** 2 minutes
**Difficulty:** Easy

---

## 🎯 Quick Fix Steps:

```
1. https://script.google.com
2. Open your project
3. Deploy → Manage deployments
4. Click ✏️ (edit)
5. Change "Who has access" to "Anyone"
6. Click "Deploy"
7. Done! ✅
```

**Then refresh your referral page and test!**

---

**This will fix the 403 error immediately! 🚀**

