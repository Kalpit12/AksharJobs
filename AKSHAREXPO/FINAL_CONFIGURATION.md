# ✅ AksharJobs Expo - Final Configuration

**Last Updated:** October 1, 2025 10:11 UTC  
**Status:** ✅ READY TO USE

---

## 🎯 Complete Setup Summary

### Google Sheet Configuration
```
Sheet ID: 14gfIXPlZQGuYYAWiW1RHlcDlBf_Tm63JMRrJ-4pyqwk

Sheet URL: https://docs.google.com/spreadsheets/d/14gfIXPlZQGuYYAWiW1RHlcDlBf_Tm63JMRrJ-4pyqwk/edit

Main Sheet Name: AksharJobs Expo Registration Data
```

### Web App API (LATEST VERSION)
```
URL: https://script.google.com/macros/s/AKfycbwwVFrbMaPH0kSEUZ6GiEHe6rAVOLraTn80xkciBeX1HecJymeOjEFR90qkGn-NzQVCYw/exec

Status: ✅ Running (with fixed referral tracking)
Deployed: October 1, 2025 10:11 UTC
Version: v2 (includes array parameter fix)
```

---

## ✅ All Files Updated (5 Files)

### 1. `google_sheets_integration.gs`
- **Line 15:** Sheet ID = `14gfIXPlZQGuYYAWiW1RHlcDlBf_Tm63JMRrJ-4pyqwk`
- **Line 18:** Main sheet name = `AksharJobs Expo Registration Data`
- **Lines 774-777:** ✅ Added `getParam()` helper function (FIXED REFERRAL BUG)

### 2. `expo_landing.js`
- **Line 291:** REGISTRATION_WEBHOOK_URL = `...AKfycbwwVFrbMaPH0kSEUZ6GiEHe6rAVOLraTn80xkciBeX1HecJymeOjEFR90qkGn-NzQVCYw...`
- **Line 1001:** REFERRAL_WEBHOOK_URL = `...AKfycbwwVFrbMaPH0kSEUZ6GiEHe6rAVOLraTn80xkciBeX1HecJymeOjEFR90qkGn-NzQVCYw...`

### 3. `expo_api_config.js`
- **Line 30:** GOOGLE_SHEETS_WEB_APP_URL = `...AKfycbwwVFrbMaPH0kSEUZ6GiEHe6rAVOLraTn80xkciBeX1HecJymeOjEFR90qkGn-NzQVCYw...`
- **Line 66:** USE_MONGODB_API = `false`

### 4. `registration.html`
- **Line 974:** REGISTRATION_FORM_WEBHOOK_URL = `...AKfycbwwVFrbMaPH0kSEUZ6GiEHe6rAVOLraTn80xkciBeX1HecJymeOjEFR90qkGn-NzQVCYw...`

### 5. `referral.html`
- **Line 841:** REFERRAL_WEBHOOK_URL = `...AKfycbwwVFrbMaPH0kSEUZ6GiEHe6rAVOLraTn80xkciBeX1HecJymeOjEFR90qkGn-NzQVCYw...`

---

## 🔧 What Was Fixed

### Bug: Referral Tracking Not Working

**Problem:**
- Google Apps Script receives URL parameters as arrays: `{type: ['referral']}`
- Code was checking: `e.parameters.type === 'referral'`
- This failed because `['referral'] !== 'referral'`

**Solution:**
- Added `getParam()` helper function to extract values from arrays
- Updated all parameter checks to use `getParam()`
- Now correctly processes: `getParam('type') === 'referral'` ✅

**Affected Functions:**
- ✅ Referral tracking (`type === 'referral'`)
- ✅ Registration check (`type === 'check_registration'`)
- ✅ Get referrals (`action === 'get_referrals'`)

---

## 🧪 Testing Instructions

### IMPORTANT: Clear Browser Cache!
```
Chrome: Ctrl + Shift + Delete → Clear cached images and files
Firefox: Ctrl + Shift + Delete → Cached Web Content
Safari: Cmd + Option + E

OR use Incognito/Private mode for testing
```

### Test 1: Registration Flow

1. **Open:** `AKSHAREXPO/registration.html` in browser (Incognito mode)

2. **Fill form:**
   - Full Name: Test User 2
   - Email: testuser2@example.com
   - Phone: +254712345678
   - Role: Job Seeker

3. **Submit**

4. **Check Console (F12):**
   - Should see: "Registration successful" ✅
   - Should NOT see: "Duplicate registration" ❌

5. **Check Google Sheet:**
   - Open: https://docs.google.com/spreadsheets/d/14gfIXPlZQGuYYAWiW1RHlcDlBf_Tm63JMRrJ-4pyqwk/edit
   - Look for tab: `AksharJobs Expo Registration Data`
   - Should see new row with test data ✅

### Test 2: Referral Tracking

1. **Open:** `AKSHAREXPO/referral.html` in browser (Incognito mode)

2. **Register first** (if needed):
   - Fill registration form
   - Submit

3. **Click "Share via WhatsApp"**

4. **Check Console (F12):**
   - Should see: "Referral data sent to Google Sheets successfully" ✅
   - Should see: "Referral iframe loaded successfully" ✅

5. **Check Google Sheet:**
   - Look for tab: `Referral_Tracking`
   - Should see entry with:
     - Your name & email
     - Platform: whatsapp
     - Akshar Coins: 5 (WhatsApp reward)
     - Timestamp ✅

### Test 3: Referral Registration (Advanced)

1. **Get referral link:**
   - Format: `referral.html?ref=youremail@example.com`

2. **Open in new incognito window**

3. **Register with NEW email**

4. **Check Google Sheet:**
   - Original referrer should get +1 bonus coin
   - Entry in `Referral_Clicks` sheet
   - Referral count incremented

---

## ✅ Expected Behavior

### Registration
```
User submits form
    ↓
Validates data locally
    ↓
Sends to: https://script.google.com/.../exec?role=job_seeker&fullName=...
    ↓
doGet() receives parameters as arrays
    ↓
Converts arrays to strings with getParam()
    ↓
processRegistration() saves data
    ↓
Saves to: "AksharJobs Expo Registration Data" sheet
    ↓
Also saves to: "Job_Seekers" (role-specific sheet)
    ↓
Success response returned
```

### Referral Tracking
```
User clicks "Share"
    ↓
Sends to: https://script.google.com/.../exec?type=referral&referrerEmail=...
    ↓
doGet() receives: {type: ['referral'], referrerEmail: ['user@email.com']}
    ↓
getParam('type') extracts: 'referral' ✅
    ↓
processReferralTracking() saves data
    ↓
Finds or creates user record in Referral_Tracking
    ↓
Awards coins (5 for WhatsApp, 3 for others)
    ↓
Updates timestamp
    ↓
Success response returned
```

---

## 📊 Google Sheet Structure

### Tabs Created Automatically

**On First Registration:**
1. ✅ `AksharJobs Expo Registration Data` - Main registrations
2. ✅ `Job_Seekers` (or other role-specific sheet)

**On First Referral:**
3. ✅ `Referral_Tracking` - Aggregated user stats
4. ✅ `Referral_Clicks` - Individual referral events

**Additional Role Sheets** (created as users register):
- `Recruiters`
- `Mentors`
- `Trainers`
- `Consultants`
- `Volunteers`
- `Interns`
- `Community`
- `Universities`
- `Evangelists`

---

## 🎯 Coins System

### Earning Opportunities

| Action | Coins Earned | Sheet Updated |
|--------|--------------|---------------|
| Share via WhatsApp | +5 coins | Referral_Tracking |
| Share via LinkedIn | +4 coins | Referral_Tracking |
| Share via Email | +3 coins | Referral_Tracking |
| Share via SMS | +3 coins | Referral_Tracking |
| Share via Twitter | +3 coins | Referral_Tracking |
| Share via Facebook | +3 coins | Referral_Tracking |
| Share via Telegram | +3 coins | Referral_Tracking |
| Copy referral code | +3 coins | Referral_Tracking |
| Someone registers via link | +1 bonus | Referral_Tracking + Referral_Clicks |

### Duplicate Prevention

**Scenario 1: Multiple Shares**
- User can share multiple times
- Each share action earns coins
- Tracked by total shares count

**Scenario 2: Referral Registration**
- System checks `Referral_Clicks` sheet
- If [Referrer → Referred] pair exists: Skip coins ❌
- If NEW pair: Award +1 bonus coin ✅
- Records in `Referral_Clicks` to prevent future duplicates

---

## 🐛 Troubleshooting

### ❌ "Registration not saving"

**Checklist:**
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Try Incognito/Private mode
- [ ] Check console for errors (F12)
- [ ] Verify Apps Script is deployed with "Anyone" access
- [ ] Verify Sheet ID is correct in Apps Script (line 15)

**Fix:**
1. Open Apps Script Editor
2. Click **Deploy** → **Manage deployments**
3. Verify "Who has access" = **Anyone**
4. If not, edit deployment and change to "Anyone"

---

### ❌ "Referral tracking not saving"

**Checklist:**
- [ ] Clear browser cache (CRITICAL!)
- [ ] Apps Script has latest code (with `getParam()` function)
- [ ] Web App URL is the LATEST one (ends in `...Gn-NzQVCYw`)
- [ ] User is registered first

**Fix:**
1. Clear browser cache or use Incognito mode
2. Verify Apps Script has lines 774-777 with `getParam()` function
3. Re-deploy if needed (Deploy → Manage deployments → Edit → New version)

---

### ❌ "Duplicate registration error"

**This is CORRECT behavior** if:
- Same email already registered
- Prevents spam and duplicate entries

**If false positive:**
- Check you're using the correct Sheet ID
- Check the email isn't actually in the sheet already
- Different capitalizations count as same email

---

### ❌ "CORS errors in console"

**This is NORMAL!** ✅

Google Apps Script uses no-cors mode. You'll see CORS errors but data IS being saved.

**Verify:**
- Check Google Sheet directly
- Check Apps Script Execution log (View → Logs)
- Look for iframe success messages in console

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
```
1. Go to vercel.com
2. Sign up (free)
3. Click "Add New" → "Project"
4. Upload AKSHAREXPO folder
5. Deploy (takes 2 minutes)
6. Get URL: https://yourproject.vercel.app
```

### Option 2: Netlify
```
1. Go to netlify.com
2. Drag AKSHAREXPO folder to drop zone
3. Deploy (takes 2 minutes)
4. Get URL: https://yourproject.netlify.app
```

### Option 3: GitHub Pages
```
1. Create GitHub repository
2. Upload AKSHAREXPO files
3. Settings → Pages → Enable
4. Get URL: https://yourusername.github.io/repo
```

---

## 📱 For Your Expo

### Pre-Expo Checklist
- [ ] Test registration with all 10 roles
- [ ] Test referral system with all platforms
- [ ] Verify data appears in Google Sheet
- [ ] Generate QR code (qr-code-generator.com)
- [ ] Print QR code poster
- [ ] Deploy to web (Vercel/Netlify)
- [ ] Share deployed URL with team
- [ ] Open Google Sheet on laptop/tablet for monitoring

### During Expo
- [ ] Display QR code at booth
- [ ] Monitor Google Sheet for real-time registrations
- [ ] Check internet connection
- [ ] Have backup registration forms (just in case)
- [ ] Respond to any registration issues

### After Expo
- [ ] Export data: File → Download → CSV
- [ ] Send thank you emails
- [ ] Award top referrers
- [ ] Analyze conversion rates
- [ ] Follow up with leads

---

## 📞 Quick Reference

### Your URLs

**Google Sheet:**
```
https://docs.google.com/spreadsheets/d/14gfIXPlZQGuYYAWiW1RHlcDlBf_Tm63JMRrJ-4pyqwk/edit
```

**Web App API:**
```
https://script.google.com/macros/s/AKfycbwwVFrbMaPH0kSEUZ6GiEHe6rAVOLraTn80xkciBeX1HecJymeOjEFR90qkGn-NzQVCYw/exec
```

### Test Files

**Registration:**
```
AKSHAREXPO/registration.html
```

**Referral:**
```
AKSHAREXPO/referral.html
```

**Landing Page:**
```
AKSHAREXPO/expo_landing.html
```

---

## ✅ Final Checklist

Before going live:

- [x] Google Sheet created ✅
- [x] Apps Script deployed ✅
- [x] All 5 files updated with Web App URL ✅
- [x] Referral tracking bug fixed ✅
- [ ] Test registration (do this now)
- [ ] Test referral sharing (do this now)
- [ ] Deploy to web
- [ ] Generate QR code
- [ ] Ready for expo! 🎉

---

**Your integration is complete and ready to use!** 🚀

Clear your browser cache, test registration and referrals, and you're good to go!

For any issues, check the Troubleshooting section above.

