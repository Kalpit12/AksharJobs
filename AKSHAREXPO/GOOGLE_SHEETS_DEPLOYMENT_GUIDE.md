# 🚀 Google Sheets Deployment Guide - FIX REFERRAL TRACKING

## ⚠️ CRITICAL: You Must Deploy This Script

The Google Apps Script that receives referral data needs to be **updated** to store coins and share counts properly.

---

## 📋 Step-by-Step Deployment (5 minutes)

### Step 1: Open Google Apps Script
```
1. Go to: https://script.google.com
2. Click on your existing "AksharJobs Registration Handler" project
   OR create a new project if you don't have one
```

### Step 2: Replace the Code
```
1. Delete ALL existing code in the editor
2. Open the file: google_sheets_referral_script.gs (in AKSHAREXPO folder)
3. Copy ALL the code from that file
4. Paste it into the Google Apps Script editor
```

### Step 3: Update Sheet ID (IMPORTANT!)
```
1. Find this line at the top:
   const SHEET_ID = '14gfIXPlZQGuYYAWiW1RHlcDlBf_Tm63JMRrJ-4pyqwk';

2. Replace with YOUR Google Sheet ID:
   - Open your Google Sheet
   - Copy the ID from the URL:
     https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
   - Paste it in the SHEET_ID constant
```

### Step 4: Save the Script
```
1. Click the disk icon (💾) or press Ctrl+S
2. Name it: "AksharJobs Referral Tracker"
```

### Step 5: Deploy as Web App
```
1. Click "Deploy" → "New deployment"
2. Click the gear icon ⚙️ → Select "Web app"
3. Fill in:
   - Description: "Referral tracking webhook"
   - Execute as: "Me" (your email)
   - Who has access: "Anyone"
4. Click "Deploy"
5. Click "Authorize access"
6. Select your Google account
7. Click "Advanced" → "Go to AksharJobs Referral Tracker (unsafe)"
8. Click "Allow"
9. Copy the Web App URL (it looks like: https://script.google.com/macros/s/ABC123.../exec)
```

### Step 6: Update referral.html (if URL changed)
```
1. Open AKSHAREXPO/referral.html
2. Find this line (around line 1572):
   const REFERRAL_WEBHOOK_URL = 'https://script.google.com/macros/s/...';
3. Replace with your NEW Web App URL (if it changed)
4. Save the file
```

---

## ✅ What This Script Does

### Creates/Updates These Sheets:

#### 1. **Referral Tracking Sheet**
Columns:
- Timestamp
- Type (share/registration)
- Referrer Name
- Referrer Email ⬅️ **Used for tracking**
- Referrer Phone
- Referrer Role
- Platform
- Coins Earned ⬅️ **3 per share**
- Share Coins
- Referral Bonus Coins
- **Total Coins** ⬅️ **THIS IS NOW STORED!**
- **Total Shares** ⬅️ **THIS IS NOW STORED!**
- **Platform Share Count** ⬅️ **THIS IS NOW STORED!**
- Referral Code
- Source

#### 2. **Referral Clicks Sheet** (auto-created when someone registers via referral)
- Timestamp
- Referrer Email
- Referred Email
- Referred Name
- Coins Awarded

---

## 🧪 Test After Deployment

### Test 1: Share on WhatsApp
```
1. Go to your referral page
2. Click "Share on WhatsApp"
3. Confirm you shared
4. Open Google Sheets
5. Check "Referral Tracking" sheet
6. ✅ Should see a NEW ROW with:
   - Your email
   - Platform: whatsapp
   - Coins Earned: 3
   - Total Coins: 3
   - Total Shares: 1
   - Platform Share Count: 1
```

### Test 2: Share Again (Same Platform)
```
1. Click "Share on WhatsApp" again
2. Confirm you shared
3. Check Google Sheets
4. ✅ Should see ANOTHER ROW with:
   - Coins Earned: 3
   - Total Coins: 6 (increased!)
   - Total Shares: 2 (increased!)
   - Platform Share Count: 2 (increased!)
```

### Test 3: Different Platform
```
1. Click "Share on LinkedIn"
2. Confirm you shared
3. Check Google Sheets
4. ✅ Should see ANOTHER ROW with:
   - Platform: linkedin
   - Coins Earned: 3
   - Total Coins: 9 (increased!)
   - Total Shares: 3 (increased!)
   - Platform Share Count: 1 (first LinkedIn share)
```

---

## 📊 Expected Google Sheets Structure

After 3 shares (2 WhatsApp + 1 LinkedIn):

| Timestamp | Type | Referrer Email | Platform | Coins Earned | Total Coins | Total Shares | Platform Share Count |
|-----------|------|----------------|----------|--------------|-------------|--------------|---------------------|
| 2025-10-03 10:00 | share | test@example.com | whatsapp | 3 | 3 | 1 | 1 |
| 2025-10-03 10:05 | share | test@example.com | whatsapp | 3 | 6 | 2 | 2 |
| 2025-10-03 10:10 | share | test@example.com | linkedin | 3 | 9 | 3 | 1 |

---

## 🔍 Troubleshooting

### Issue: Still not seeing coins/shares in sheets
**Solution:**
1. Make sure you SAVED the script (Ctrl+S)
2. Make sure you DEPLOYED it (not just saved!)
3. Check you're using "Anyone" access
4. Verify SHEET_ID is correct

### Issue: Getting authorization errors
**Solution:**
1. Go through authorization again
2. Click "Advanced" → "Go to... (unsafe)"
3. Click "Allow"

### Issue: Script timeout errors
**Solution:**
1. This is normal for Google Sheets
2. Data should still be saved
3. Check the sheet manually

### Issue: Duplicate entries
**Solution:**
1. This is expected! Each share creates a new row
2. Use "Total Coins" column for the user's actual total

---

## 📞 Verify Deployment

Check these logs in your browser console:

### ✅ Good:
```javascript
Sending referral data to Google Sheets: {
  type: "share",
  referrerEmail: "test@example.com",
  platform: "whatsapp",
  coinsEarned: 3,
  totalCoins: 3,
  totalShares: 1
}
✅ Sent share data to Google Sheets for whatsapp
```

### ❌ Bad:
```javascript
❌ Error sending to Google Sheets
Failed to load resource: net::ERR_FAILED
```

---

## 🎯 Critical Points

1. **MUST deploy as Web App** (not just save the script)
2. **MUST use "Anyone" access** (not "Only myself")
3. **MUST update SHEET_ID** in the script
4. **MUST authorize the script** when deploying
5. **Each share creates a NEW ROW** (not updating existing rows)

---

## ✅ After Deployment

Your referral tracking will now properly capture:
- ✅ Every share action
- ✅ Coins earned per share
- ✅ Total coins (cumulative)
- ✅ Total shares count
- ✅ Platform-specific share counts
- ✅ Timestamps for all actions

---

**Deploy Time:** ~5 minutes
**Status:** CRITICAL - Must deploy to fix tracking!

