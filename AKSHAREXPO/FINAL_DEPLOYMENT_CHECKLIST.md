# ✅ FINAL DEPLOYMENT CHECKLIST - Get Script Working

## 🔴 Current Problem:

Your script returns:
```json
{"message":"AksharJobs Expo Registration & Referral API is running"}
```

This means it's **NOT processing referral data**. The updated code isn't deployed.

---

## ✅ SOLUTION - Verify and Deploy Correctly:

### **Step 1: Verify Code in Google Apps Script**

```
1. Go to: https://script.google.com
2. Open your project
3. Press Ctrl+F (Find)
4. Search for: "requestType === 'share'"
5. Should find it on line ~849
6. The line should look like:
   if (referrerEmail && (requestType === 'share' || requestType === 'referral' || ...

7. ✅ If you find it → Code is updated
8. ❌ If you don't find it → Code is OLD, need to paste new code
```

---

### **Step 2: If Code is OLD - Paste Updated Code**

```
1. Open: C:\Users\kalpi\Desktop\AksharJobs\AKSHAREXPO\google_sheets_integration.gs
2. Select ALL (Ctrl+A)
3. Copy (Ctrl+C)
4. Go to Google Apps Script (https://script.google.com)
5. Select ALL code in editor (Ctrl+A)
6. Paste (Ctrl+V)
7. Save (Ctrl+S)
8. Verify the line with 'share' is there
```

---

### **Step 3: Deploy with "New Version" (CRITICAL!)**

```
1. Click "Deploy" button (top right)
2. Click "Manage deployments"
3. You'll see your deployment list
4. Click the ✏️ (pencil/edit) icon
5. Find "Version" dropdown (shows current version like "@3")
6. Click the dropdown
7. Select "New version" from the list
8. Version should change to "@4" (or next number)
9. Click blue "Deploy" button
10. Wait for green "Deployment updated successfully" ✅
11. Click "Done"
```

**IMPORTANT:** If you skip "New version", Google Apps Script uses the OLD code version!

---

### **Step 4: Wait and Test**

```
1. Wait 30 seconds (for deployment to propagate)
2. Open NEW incognito window (Ctrl+Shift+N)
3. Paste this test URL:

https://script.google.com/macros/s/AKfycbzEzInMtaTHux3dNtmcckpy2jfX-ywaDJflALkXtXgBRruelQOb5WbjonEPpgvFJ_bHyw/exec?type=share&action=referral_share&referrerEmail=test@example.com&referrerName=Test&referrerPhone=1234&referrerRole=job_seeker&platform=whatsapp&coinsEarned=3&totalCoins=3&totalShares=1&referralCount=0

4. Check response:
   ✅ GOOD: {"success":true,"message":"Referral shared..."}
   ❌ BAD: {"message":"API is running"}
```

---

## 🎯 Visual Guide - What to Click:

```
Google Apps Script Editor:
┌─────────────────────────────────────────┐
│ [Save] [Run] [Debug] [Deploy ▼]        │ ← Click "Deploy"
└─────────────────────────────────────────┘

Deploy Menu:
┌─────────────────────────────────────────┐
│ • New deployment                        │
│ • Manage deployments     ← Click this   │
│ • Test deployments                      │
└─────────────────────────────────────────┘

Manage Deployments:
┌─────────────────────────────────────────┐
│ Active Deployments                      │
│ @3 | Web app | Anyone    [✏️] [⋮]      │ ← Click ✏️
└─────────────────────────────────────────┘

Edit Deployment:
┌─────────────────────────────────────────┐
│ Version: @3 ▼          ← Click dropdown │
│   • @1 - Oct 3, 08:30                   │
│   • @2 - Oct 3, 09:00                   │
│   • @3 - Oct 3, 09:30   ← Current      │
│   • New version         ← SELECT THIS! │
│                                         │
│ [Cancel]  [Deploy]     ← Then click    │
└─────────────────────────────────────────┘
```

---

## 🔍 How to Know It's Working:

### **After Deploying "New Version":**

Test URL should return:
```json
{
  "success": true,
  "message": "Referral shared via whatsapp! You earned 3 coins...",
  "actionType": "share",
  "coinsEarned": 3,
  "totalCoins": 3
}
```

**If you STILL see "API is running":**
- The new version didn't deploy correctly
- Try again, or create a completely new deployment

---

## ⚡ Alternative: Create Fresh Deployment

If "New version" doesn't work:

```
1. Deploy → Manage deployments
2. Archive the current deployment (3 dots menu → Archive)
3. Deploy → New deployment
4. Select "Web app"
5. Execute as: Me
6. Who has access: Anyone
7. Deploy
8. Authorize (click through all prompts)
9. Copy the NEW URL
10. Update referral.html line 1572 with NEW URL
```

---

## 📊 Success Criteria:

- [ ] Code has `requestType === 'share'` check
- [ ] Code is saved in Google Apps Script
- [ ] Deployed with "New version"
- [ ] Test URL returns `{"success":true,...}`
- [ ] NOT returning "API is running" for referral requests
- [ ] Data appears in Google Sheets

---

**The key is clicking "New version" when deploying! This activates the updated code! 🔑**

