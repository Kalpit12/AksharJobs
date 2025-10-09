# ✅ COMPLETE TESTING GUIDE - Verify Everything Works

## 🧪 **METHOD 1: Use Test Page (Easiest)**

### **Step 1: Open Test Page**
```
1. Open file: AKSHAREXPO/COMPLETE_TEST.html in browser
2. Click "Run All Tests" button
3. Wait for all tests to complete
4. Check results on page
```

### **Step 2: Verify in Google Sheets**
```
1. Click "Open Google Sheet" button
2. Go to "Referral_Tracking" tab
3. Find row for test@example.com
4. ✅ Should show:
   - Share Count: 3
   - Akshar coins: 9
   - Platforms Shared: whatsapp, linkedin
   - Registered Count: 0
5. ✅ Should be ONE ROW (not multiple rows!)
```

---

## 🧪 **METHOD 2: Manual URL Test**

### **Test 1: Script Accessibility**
Paste this in browser:
```
https://script.google.com/macros/s/AKfycbxhLWyWb7Lk0_eG12b5YasJ0uontIvly3MHn_5pWbMix9B_akdk7pvBnO8fLovYAAlV0w/exec
```

**✅ Expected:**
```json
{
  "message": "AksharJobs Expo Registration & Referral API is running",
  "timestamp": "..."
}
```

---

### **Test 2: Send First Share**
Paste this URL in browser:
```
https://script.google.com/macros/s/AKfycbxhLWyWb7Lk0_eG12b5YasJ0uontIvly3MHn_5pWbMix9B_akdk7pvBnO8fLovYAAlV0w/exec?type=share&action=referral_share&referrerEmail=testuser@example.com&referrerName=TestUser&referrerPhone=1234567890&referrerRole=job_seeker&platform=whatsapp&coinsEarned=3&totalCoins=3&totalShares=1&referralCount=0
```

**✅ Expected Response:**
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

**❌ If You See:**
```json
{
  "message": "AksharJobs Expo Registration & Referral API is running",
  "received_parameters": {}
}
```
→ **Script is NOT processing data! Updated code not deployed!**

---

### **Test 3: Send Second Share (Same User, Same Platform)**
Paste this URL:
```
https://script.google.com/macros/s/AKfycbxhLWyWb7Lk0_eG12b5YasJ0uontIvly3MHn_5pWbMix9B_akdk7pvBnO8fLovYAAlV0w/exec?type=share&action=referral_share&referrerEmail=testuser@example.com&referrerName=TestUser&referrerPhone=1234567890&referrerRole=job_seeker&platform=whatsapp&coinsEarned=3&totalCoins=6&totalShares=2&referralCount=0
```

**✅ Expected:**
```json
{
  "success": true,
  "message": "Referral shared via whatsapp!...",
  "totalCoins": 6,
  "platformShareCounts": {"whatsapp": 2}
}
```

---

### **Test 4: Send Third Share (Different Platform)**
Paste this URL:
```
https://script.google.com/macros/s/AKfycbxhLWyWb7Lk0_eG12b5YasJ0uontIvly3MHn_5pWbMix9B_akdk7pvBnO8fLovYAAlV0w/exec?type=share&action=referral_share&referrerEmail=testuser@example.com&referrerName=TestUser&referrerPhone=1234567890&referrerRole=job_seeker&platform=linkedin&coinsEarned=3&totalCoins=9&totalShares=3&referralCount=0
```

**✅ Expected:**
```json
{
  "success": true,
  "totalCoins": 9,
  "platformsShared": ["whatsapp", "linkedin"],
  "platformShareCounts": {"whatsapp": 2, "linkedin": 1}
}
```

---

### **Test 5: Verify Google Sheets**

Open Google Sheet and check **"Referral_Tracking"** tab:

**✅ Expected Result:**

**ONE ROW for testuser@example.com:**

| Referrer Name | Referrer Email | Share Count | Akshar coins | Platforms Shared | Registered Count |
|--------------|----------------|-------------|--------------|------------------|------------------|
| TestUser | testuser@example.com | **3** | **9** | whatsapp, linkedin | **0** |

**NOT multiple rows:**
~~Row 1: TestUser | 3 coins~~
~~Row 2: TestUser | 6 coins~~
~~Row 3: TestUser | 9 coins~~

---

## 🔍 What Each Response Means:

### ✅ **SUCCESS Response:**
```json
{
  "success": true,
  "message": "Referral shared...",
  "actionType": "share",
  "totalCoins": 9
}
```
**Means:**
- ✅ Script recognized the request
- ✅ Processed the data
- ✅ Saved to Google Sheets
- ✅ Returned success

### ❌ **API RUNNING Response:**
```json
{
  "message": "AksharJobs Expo Registration & Referral API is running"
}
```
**Means:**
- ❌ Script did NOT recognize as referral request
- ❌ Did NOT process the data
- ❌ Did NOT save to Google Sheets
- ❌ Updated code NOT deployed

---

## 🚨 If Script Returns "API is running":

### **The Problem:**
Your Google Apps Script editor has the updated code, but the **deployed version is still using OLD code**.

### **The Solution:**
```
1. Go to: https://script.google.com
2. Open your project
3. Verify code is saved (Ctrl+S)
4. Click "Deploy" → "Manage deployments"
5. Click ✏️ (Edit)
6. Click "Version" dropdown
7. Select "New version" (creates @2, @3, etc.)
8. Click "Deploy"
9. Wait 30 seconds
10. Test again
```

---

## 📊 Google Sheets Verification Checklist:

After running all tests, your Google Sheet should have:

- [ ] "Referral_Tracking" sheet exists
- [ ] Headers are correct:
  - Column E: "Share Count" (not "Referrer Count")
  - Column J: "Registered Count" (not "Share Count Per Platform")
- [ ] ONE row for testuser@example.com
- [ ] Share Count: 3
- [ ] Akshar coins: 9
- [ ] Platforms Shared: whatsapp, linkedin
- [ ] Registered Count: 0
- [ ] NOT multiple rows for same user

---

## 🎯 Quick Test Command:

Paste this single URL to test everything:
```
https://script.google.com/macros/s/AKfycbxhLWyWb7Lk0_eG12b5YasJ0uontIvly3MHn_5pWbMix9B_akdk7pvBnO8fLovYAAlV0w/exec?type=share&action=referral_share&referrerEmail=quicktest@example.com&referrerName=QuickTest&referrerPhone=1234567890&referrerRole=job_seeker&platform=whatsapp&coinsEarned=3&totalCoins=3&totalShares=1&referralCount=0
```

**If you see "success": true → ✅ Everything is working!**
**If you see "API is running" → ❌ Need to deploy with "New version"!**

---

**Use COMPLETE_TEST.html for automated testing, or paste the URLs above manually to verify! 🧪**

