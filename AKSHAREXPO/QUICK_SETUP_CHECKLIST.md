# ⚡ Quick Setup Checklist - AksharJobs Expo Integration

## 🎯 5-Minute Setup Guide

Follow these steps in order. ✅ Check each box as you complete it.

---

### Step 1: Create Google Sheet (1 minute)

- [ ] Go to [Google Sheets](https://sheets.google.com)
- [ ] Click "Blank spreadsheet"
- [ ] Name it: **AksharJobs Expo Data**
- [ ] Copy Sheet ID from URL:
  ```
  https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
                                        ^^^^^^^^^^^^^^^^^^^
  ```
- [ ] Save Sheet ID: `_______________________________`

---

### Step 2: Deploy Apps Script (2 minutes)

- [ ] In Google Sheet: **Extensions** → **Apps Script**
- [ ] Delete default code
- [ ] Open file: `AKSHAREXPO/google_sheets_integration.gs`
- [ ] Copy ALL code
- [ ] Paste into Apps Script editor
- [ ] Update **line 15** with your Sheet ID:
  ```javascript
  const SHEET_ID = 'YOUR_SHEET_ID_FROM_STEP_1';
  ```
- [ ] Click **Save** (💾 or Ctrl+S)
- [ ] Click **Deploy** → **New deployment**
- [ ] Type: **Web app**
- [ ] Execute as: **Me**
- [ ] Who has access: **Anyone** ⚠️ IMPORTANT!
- [ ] Click **Deploy**
- [ ] Click **Authorize**
- [ ] Copy Web App URL:
  ```
  https://script.google.com/macros/s/ABC.../exec
  ```
- [ ] Save Web App URL: `_______________________________`

---

### Step 3: Update Landing Page (1 minute)

#### File 1: expo_landing.js

- [ ] Open: `AKSHAREXPO/expo_landing.js`

- [ ] Find **line 291** (search for `REGISTRATION_WEBHOOK_URL`)
  
- [ ] Replace URL with your Web App URL:
  ```javascript
  const REGISTRATION_WEBHOOK_URL = 'YOUR_WEB_APP_URL_HERE';
  ```

- [ ] Find **line 1001** (search for `REFERRAL_WEBHOOK_URL`)
  
- [ ] Replace URL with SAME Web App URL:
  ```javascript
  const REFERRAL_WEBHOOK_URL = 'YOUR_WEB_APP_URL_HERE';
  ```

- [ ] Save file

#### File 2: expo_api_config.js

- [ ] Open: `AKSHAREXPO/expo_api_config.js`

- [ ] Find **line 30** (search for `GOOGLE_SHEETS_WEB_APP_URL`)

- [ ] Replace URL with your Web App URL:
  ```javascript
  const GOOGLE_SHEETS_WEB_APP_URL = 'YOUR_WEB_APP_URL_HERE';
  ```

- [ ] Verify **line 66** says:
  ```javascript
  const USE_MONGODB_API = false;
  ```

- [ ] Save file

---

### Step 4: Test Integration (1 minute)

#### Test 1: Web App is Running

- [ ] Open your Web App URL in browser
- [ ] Should see JSON response:
  ```json
  {
    "message": "AksharJobs Expo Registration & Referral API is running",
    "timestamp": "2025-10-01..."
  }
  ```

#### Test 2: Apps Script Functions

- [ ] Go back to Apps Script editor
- [ ] Click **Run** dropdown → Select `testSetup`
- [ ] Click ▶️ **Run**
- [ ] Check **Execution log** (View → Logs)
- [ ] Should see ✅ success messages

#### Test 3: Full Registration Flow

- [ ] Open `expo_landing.html` in browser
- [ ] Fill registration form with test data:
  - Name: Test User
  - Email: test@yourcompany.com
  - Phone: +254712345678
  - Role: Job Seeker
- [ ] Click **Submit**
- [ ] Go to your Google Sheet
- [ ] Should see new row in:
  - `AKJOBS_REGISTRATION` sheet
  - `Job_Seekers` sheet

#### Test 4: Referral System

- [ ] On expo landing page, click **"Start Referring"**
- [ ] Register first if prompted
- [ ] Click **"Share via WhatsApp"**
- [ ] Go to Google Sheet
- [ ] Check `Referral_Tracking` sheet
- [ ] Should see entry with 3 coins

---

## ✅ Setup Complete!

If all tests passed, your integration is ready! 🎉

---

## 🔧 Configuration Reference

### Important URLs & Values

**Your Sheet ID:**
```
_______________________________________________
```

**Your Web App URL:**
```
_______________________________________________
```

**Files Updated:**
- ✅ `google_sheets_integration.gs` (line 15)
- ✅ `expo_landing.js` (lines 291, 1001)
- ✅ `expo_api_config.js` (line 30)

**Feature Flag:**
```javascript
USE_MONGODB_API = false  // Using Google Sheets ✅
```

---

## 📊 Your Google Sheets

Bookmark these for easy access:

**Main Sheet:**
```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
```

**Quick Links:**
- View registrations: `AKJOBS_REGISTRATION` tab
- View referrals: `Referral_Tracking` tab
- View referral clicks: `Referral_Clicks` tab
- Role-specific: Click tabs at bottom

---

## 🚀 Ready to Deploy!

### Local Testing
```bash
# Open in browser
file:///path/to/AKSHAREXPO/expo_landing.html
```

### Deploy to Web (Choose One)

**Option 1: Vercel (Recommended - 2 minutes)**
```bash
1. Go to vercel.com
2. Sign up (free)
3. Click "Add New" → "Project"
4. Upload AKSHAREXPO folder
5. Deploy
```

**Option 2: Netlify**
```bash
1. Go to netlify.com
2. Drag AKSHAREXPO folder to Netlify Drop
3. Deploy
```

**Option 3: GitHub Pages**
```bash
1. Create GitHub repo
2. Upload AKSHAREXPO folder
3. Settings → Pages → Deploy
```

---

## 🎯 During Your Expo

### Monitor Registrations Live
1. Open Google Sheet on laptop/tablet
2. Registrations appear in real-time
3. Use filters to view by role
4. Export data: File → Download → CSV

### Share Landing Page
```
Your deployed URL: _________________________

QR Code: Generate at qr-code-generator.com
```

### Backup Plan
If internet issues at expo:
- Print registration forms as backup
- Enter data manually to Google Sheet later
- All data syncs automatically

---

## 📞 Troubleshooting

### ❌ "Registration not saving"

**Check:**
- [ ] Web App URL correct in all 3 files?
- [ ] Apps Script deployed with "Anyone" access?
- [ ] Sheet ID correct in Apps Script?
- [ ] Browser console (F12) shows errors?

**Fix:**
1. Re-deploy Apps Script
2. Clear browser cache
3. Try incognito mode

---

### ❌ "Coins not awarding"

**Check:**
- [ ] User registered first?
- [ ] `Referral_Tracking` sheet exists?
- [ ] REFERRAL_WEBHOOK_URL correct in expo_landing.js?

**Fix:**
1. Open browser console (F12)
2. Look for referral tracking errors
3. Verify user email in localStorage

---

### ❌ "CORS errors in console"

**This is NORMAL!** ✅

Google Apps Script uses no-cors mode. Data IS being saved even with CORS errors.

**Verify:**
- Check Google Sheet - data should be there
- Check Apps Script Execution log

---

### ❌ "Duplicate registrations"

This shouldn't happen! Script checks emails.

**If it does:**
1. Open Apps Script Execution log
2. Look for errors in `processRegistration()`
3. Manually delete duplicates from sheet
4. Re-test registration flow

---

## 📖 Additional Resources

**Detailed Guides:**
- `GOOGLE_SHEETS_INTEGRATION_GUIDE.md` - Full setup guide
- `DATA_FLOW_REFERENCE.md` - How data flows
- `EXPO_DEPLOYMENT_SIMPLE.md` - MongoDB option

**Need Help?**
- Check browser console (F12) for errors
- Check Apps Script Execution log
- Review test functions in Apps Script

---

## 🎉 You're All Set!

**What works now:**
- ✅ User registration → Saved to Google Sheets
- ✅ Referral sharing → 3 coins awarded
- ✅ Referral registration → +1 bonus coin
- ✅ Duplicate prevention → No duplicate emails or referrals
- ✅ Real-time updates → See data instantly
- ✅ Role filtering → Separate sheets per role

**Next steps:**
1. Deploy to web (Vercel/Netlify)
2. Generate QR code for expo
3. Share with attendees
4. Monitor registrations in Google Sheet

---

**Congratulations! Your expo registration system is live! 🚀**

Share your landing page and start collecting registrations!

