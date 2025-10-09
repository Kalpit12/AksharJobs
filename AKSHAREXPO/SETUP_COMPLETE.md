# ✅ AksharJobs Expo Setup Complete!

## 🎉 All Configuration Updated

**Date:** October 1, 2025  
**Status:** ✅ Ready to Use

---

## 📊 Your Configuration

### Google Sheet
```
Sheet ID: 14gfIXPlZQGuYYAWiW1RHlcDlBf_Tm63JMRrJ-4pyqwk
Sheet URL: https://docs.google.com/spreadsheets/d/14gfIXPlZQGuYYAWiW1RHlcDlBf_Tm63JMRrJ-4pyqwk/edit

Main Sheet Name: AksharJobs Expo Registration Data
```

### Web App API
```
URL: https://script.google.com/macros/s/AKfycbzRmFvG5-2sEfjOew-qPazvHQtT8H-uTxeE1drmg1IT9QrSBI636SNEu78hMQhYUkY4mQ/exec

Status: ✅ Running
Last Verified: 2025-10-01 09:57:14 UTC
```

---

## ✅ Files Updated (All 5 Files)

1. ✅ **google_sheets_integration.gs**
   - Line 15: Sheet ID configured
   - Line 18: Main sheet name set

2. ✅ **expo_landing.js**
   - Line 291: REGISTRATION_WEBHOOK_URL updated
   - Line 1001: REFERRAL_WEBHOOK_URL updated

3. ✅ **expo_api_config.js**
   - Line 30: GOOGLE_SHEETS_WEB_APP_URL updated

4. ✅ **registration.html**
   - Line 974: REGISTRATION_FORM_WEBHOOK_URL updated

5. ✅ **referral.html**
   - Line 841: REFERRAL_WEBHOOK_URL updated

---

## 🧪 Test Now

### Clear Browser Cache First (Important!)
```
Chrome: Ctrl+Shift+Delete → Clear cached images and files
Firefox: Ctrl+Shift+Delete → Cached Web Content
Safari: Cmd+Option+E
```

Or use **Incognito/Private mode** for testing.

### Test Registration

1. **Open:** `AKSHAREXPO/registration.html` in browser

2. **Fill form:**
   - Full Name: Test User
   - Email: test@yourcompany.com
   - Phone: +254712345678
   - Role: Job Seeker

3. **Submit**

4. **Check Google Sheet:**
   - Open: https://docs.google.com/spreadsheets/d/14gfIXPlZQGuYYAWiW1RHlcDlBf_Tm63JMRrJ-4pyqwk/edit
   - Look for tab: `AksharJobs Expo Registration Data`
   - Should see new row with your test data

### Test Referral System

1. **Open:** `AKSHAREXPO/referral.html` in browser

2. **Click "Share via WhatsApp"**

3. **Check Google Sheet:**
   - Look for tab: `Referral_Tracking`
   - Should see entry with 3 coins (or 5 coins if you used WhatsApp)

---

## 📋 Expected Behavior

### Registration Flow
```
User fills form
    ↓
Validates data
    ↓
Sends to: https://script.google.com/.../exec
    ↓
Google Apps Script processes
    ↓
Saves to: AksharJobs Expo Registration Data
    ↓
Also saves to: Role-specific sheet (e.g., Job_Seekers)
    ↓
Success message shown
```

### What Gets Created in Your Sheet

**On First Registration:**
- ✅ `AksharJobs Expo Registration Data` (main sheet)
- ✅ `Job_Seekers` (or other role-specific sheet)

**On First Referral Share:**
- ✅ `Referral_Tracking` (coins & stats)
- ✅ `Referral_Clicks` (duplicate prevention)

---

## 🐛 Troubleshooting

### If Registration Still Fails

**1. Clear Browser Cache**
```
The old webhook URL might be cached.
Use Ctrl+Shift+Delete or try Incognito mode.
```

**2. Check Console for Errors**
```
Press F12 → Console tab
Look for red error messages
Should show success, not "duplicate" error
```

**3. Verify Web App URL**
```
All 5 files should have this URL:
https://script.google.com/macros/s/AKfycbzRmFvG5-2sEfjOew-qPazvHQtT8H-uTxeE1drmg1IT9QrSBI636SNEu78hMQhYUkY4mQ/exec

NOT the old one:
https://script.google.com/macros/s/AKfycbx9Y6agsYOzwQ9pzeUXnz71VWL9qGQPqmJwkGD5mRTb8EwnnX3X7Jlo7AxOzqN0fbF-DA/exec
```

**4. Check Apps Script Deployment**
```
1. Go to: https://script.google.com
2. Open your project
3. Click "Deploy" → "Manage deployments"
4. Verify "Who has access" = Anyone
5. Copy the current Web App URL
6. Should match the URL above
```

---

## ✅ Success Indicators

### Registration Works When:
- ✅ Form submits without errors
- ✅ "Registration successful" message appears
- ✅ New row appears in Google Sheet
- ✅ Data appears in correct role-specific sheet
- ✅ No "duplicate" error (unless truly duplicate)

### Referral Works When:
- ✅ Share button triggers without errors
- ✅ Coins are awarded (shown in modal)
- ✅ `Referral_Tracking` sheet shows entry
- ✅ Correct coins amount (3 or 5 depending on platform)

---

## 🚀 Next Steps

### 1. Full System Test
- [ ] Test registration with all roles
- [ ] Test referral sharing on all platforms
- [ ] Verify data in Google Sheet
- [ ] Check duplicate prevention works

### 2. Deploy to Web
```
Option 1: Vercel (Recommended)
1. Go to vercel.com
2. Sign up (free)
3. Upload AKSHAREXPO folder
4. Deploy

Option 2: Netlify
1. Go to netlify.com
2. Drag AKSHAREXPO folder
3. Deploy
```

### 3. Generate QR Code
```
1. Get your deployed URL
2. Go to: qr-code-generator.com
3. Paste URL
4. Download QR code
5. Print for expo
```

---

## 📞 Support

**If you still see errors:**

1. **Clear cache** and try in Incognito mode
2. **Check all 5 files** have the correct Web App URL
3. **Verify Apps Script** is deployed with "Anyone" access
4. **Check Google Sheet** has correct Sheet ID in Apps Script

**Console Logs to Look For:**
```javascript
✅ "Registration data submitted to Google Sheets"
✅ "Registration successful"
✅ "Referral data sent to Google Sheets successfully"

❌ "Duplicate registration detected" (means wrong sheet)
❌ "Failed to send registration" (means wrong URL)
```

---

## 🎯 Quick Reference

**Files to Open for Testing:**
```
Registration: AKSHAREXPO/registration.html
Referral: AKSHAREXPO/referral.html
Landing Page: AKSHAREXPO/expo_landing.html
```

**Your Google Sheet:**
```
https://docs.google.com/spreadsheets/d/14gfIXPlZQGuYYAWiW1RHlcDlBf_Tm63JMRrJ-4pyqwk/edit
```

**Your Web App:**
```
https://script.google.com/macros/s/AKfycbzRmFvG5-2sEfjOew-qPazvHQtT8H-uTxeE1drmg1IT9QrSBI636SNEu78hMQhYUkY4mQ/exec
```

---

**Everything is configured! Clear your cache and test again! 🎉**

