# 🧪 VERIFY YOUR DEPLOYMENT

## 🔴 Current Status:

Your script URL returns:
```json
{"message":"AksharJobs Expo Registration & Referral API is running"}
```

This means it's **NOT processing referral shares** - it's just returning the default message.

---

## ✅ TEST IF SCRIPT PROCESSES DATA:

### **Test URL - Paste this in browser:**

```
https://script.google.com/macros/s/AKfycbxhLWyWb7Lk0_eG12b5YasJ0uontIvly3MHn_5pWbMix9B_akdk7pvBnO8fLovYAAlV0w/exec?type=share&action=referral_share&referrerEmail=test@example.com&referrerName=Test&referrerPhone=1234567890&referrerRole=job_seeker&platform=whatsapp&coinsEarned=3&totalCoins=3&totalShares=1&referralCount=0
```

---

## 📊 What You Should See:

### ✅ **If Script is Working:**
```json
{
  "success": true,
  "message": "Referral shared via whatsapp! You earned 3 coins. Share unlimited times to earn more!",
  "actionType": "share",
  "coinsEarned": 3,
  "totalCoins": 3,
  "referralCount": 0,
  "platformsShared": ["whatsapp"],
  "platformShareCounts": {"whatsapp": 1}
}
```

### ❌ **If Script is NOT Working:**
```json
{
  "message": "AksharJobs Expo Registration & Referral API is running",
  "timestamp": "2025-10-03T09:06:44.171Z",
  "received_parameters": {}
}
```

---

## 🔧 If You Get the BAD Response:

The updated code is **NOT deployed**. Follow these steps:

### **Step 1: Verify Code in Google Apps Script**
```
1. Go to: https://script.google.com
2. Open your project
3. Find line 830 (in doGet function)
4. It MUST say:
   if (e.parameters && e.parameters.referrerEmail && (requestType === 'share' || ...

5. If it doesn't have 'share' in the condition, the code is OLD!
```

### **Step 2: Copy Fresh Code**
```
1. Open: C:\Users\kalpi\Desktop\AksharJobs\AKSHAREXPO\google_sheets_integration.gs
2. Select ALL (Ctrl+A)
3. Copy (Ctrl+C)
4. Go to Google Apps Script
5. Select ALL existing code (Ctrl+A)
6. Paste (Ctrl+V)
7. Save (Ctrl+S)
```

### **Step 3: Deploy with "New Version"**
```
1. Click "Deploy" button (top right)
2. Click "Manage deployments"
3. Click the ✏️ (pencil) icon to edit
4. Find "Version" dropdown
5. Click it and select "New version"
6. Click "Deploy" button
7. Wait for "Deployment updated successfully"
8. Click "Done"
```

### **Step 4: Wait 30 Seconds**
```
Google needs time to activate the new version.
Wait 30 seconds before testing.
```

### **Step 5: Test Again**
```
Paste the test URL above in a NEW incognito window.
Should now see SUCCESS response!
```

---

## 🎯 Critical Point:

**You MUST click "New version" when deploying!**

If you just click "Deploy" without selecting "New version", Google Apps Script will use the OLD code version, not your updated code!

---

##Step-by-Step Deployment (Screenshot Guide):

```
1. Open Google Apps Script
2. Code is updated and saved
3. Click "Deploy" button (top right corner)
4. Click "Manage deployments" from dropdown
5. You see your deployment listed
6. Click the ✏️ (edit/pencil) icon
7. You see edit deployment dialog
8. Find "Version" dropdown (currently shows "@1" or similar)
9. Click the dropdown
10. Select "New version" from the list
11. Version changes to "@2" (or next number)
12. Click blue "Deploy" button at bottom
13. Wait for success message
14. Click "Done"
```

---

## 📞 How to Know It's Working:

### **Good Signs:**
- ✅ Test URL returns JSON with "success": true
- ✅ Console shows "✅ Received referral tracking data"
- ✅ Google Sheets gets new rows/updates
- ✅ No "API is running" message for referral requests

### **Bad Signs:**
- ❌ Test URL returns "API is running" message
- ❌ Console shows "received_parameters": {}
- ❌ Google Sheets doesn't update
- ❌ Still getting default message

---

**Test that URL above and tell me which response you get!**

**If you still get "API is running", the new version isn't deployed yet!**

