# 🔗 Google Sheets Integration Guide for AksharJobs Expo

## 📊 What Data Gets Stored

Your Google Sheets integration automatically stores **THREE types of data**:

### 1. 📝 Registration Data
- User's full name, email, phone, role
- Role-specific information (experience, skills, company, etc.)
- Timestamp of registration
- Duplicate email prevention

**Stored in these sheets:**
- `AKJOBS_REGISTRATION` (main sheet with all registrations)
- Role-specific sheets (`Job_Seekers`, `Recruiters`, `Mentors`, etc.)

### 2. 🔗 Referral Tracking Data  
- Who shared the referral link
- Which platform they used (WhatsApp, Email, SMS, etc.)
- Referral count for each user
- Total AksharCoins earned

**Stored in:**
- `Referral_Tracking` (aggregated data per user)
- `Referral_Clicks` (individual click tracking)

### 3. 🪙 Coins System
- **3 coins** awarded when user shares referral link
- **1 bonus coin** awarded when someone registers via their link
- Prevents duplicate coin awards for same referral

---

## 🚀 Setup Instructions (5 Minutes)

### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"Blank spreadsheet"**
3. Name it: `AksharJobs Expo Registration Data`
4. **Copy the Sheet ID** from URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
                                        ^^^^^^^^^^^^^^^^^^^
   ```

### Step 2: Deploy Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete the default code
3. **Copy ALL code** from `google_sheets_integration.gs`
4. **Update Line 15** with your Sheet ID:
   ```javascript
   const SHEET_ID = 'YOUR_SHEET_ID_HERE'; // Replace this!
   ```

5. Click **💾 Save** (or Ctrl+S)

6. Click **Deploy** → **New deployment**
   - Type: **Web app**
   - Description: `AksharJobs Expo Integration v1`
   - Execute as: **Me**
   - Who has access: **Anyone** ⚠️ Important!
   - Click **Deploy**

7. **Authorize** the script (Google will ask for permissions)

8. **Copy the Web App URL** (looks like):
   ```
   https://script.google.com/macros/s/ABCD.../exec
   ```

### Step 3: Update Expo Landing Page

1. Open `AKSHAREXPO/expo_landing.js`
2. Find **line 291** (around there)
3. Replace the URL:
   ```javascript
   const REGISTRATION_WEBHOOK_URL = 'YOUR_WEB_APP_URL_FROM_STEP_2';
   ```

4. Also update line 1001:
   ```javascript
   const REFERRAL_WEBHOOK_URL = 'YOUR_WEB_APP_URL_FROM_STEP_2';
   ```

**Both should be the SAME URL!**

---

## ✅ Test Your Integration

### Test Method 1: Direct Browser Test

1. Open your Web App URL in browser:
   ```
   https://script.google.com/macros/s/YOUR_ID/exec
   ```

2. You should see:
   ```json
   {
     "message": "AksharJobs Expo Registration & Referral API is running",
     "timestamp": "2025-10-01T..."
   }
   ```

### Test Method 2: Test from Apps Script Editor

1. In Apps Script Editor, click **Run** dropdown
2. Select **`testSetup`** function
3. Click ▶️ **Run**
4. Check **Execution log** - should see ✅ success messages

### Test Method 3: Test Full Registration Flow

1. Open your expo landing page (`expo_landing.html`)
2. Fill out the registration form
3. Submit
4. Go to your Google Sheet
5. You should see:
   - New row in `AKJOBS_REGISTRATION` sheet
   - New row in role-specific sheet (e.g., `Job_Seekers`)

### Test Method 4: Test Referral System

1. Open expo landing page
2. Click "Start Referring" button
3. Click "Share via WhatsApp"
4. Go to your Google Sheet
5. Check `Referral_Tracking` sheet
6. Should see entry with:
   - Your email
   - Platform: `whatsapp`
   - Akshar coins: `3`

---

## 📋 Data Structure Reference

### AKJOBS_REGISTRATION Sheet Columns
```
A: Timestamp
B: Full Name
C: Email (unique - duplicates prevented)
D: Phone
E: Role (Job Seeker, Recruiter, Mentor, etc.)
F-J: Job Seeker fields (Experience, Skills, Location, etc.)
K-O: Recruiter fields (Company, Position, etc.)
P-R: Mentor fields (Expertise, Type, Bio)
S-U: Trainer fields (Specialization, Format, Certifications)
V-Y: Consultant fields
Z-AB: Volunteer fields
AC-AF: Intern fields
AG-AK: Community fields
AL-AO: University fields
AP: Notification Status
AQ: Registration Type
```

### Referral_Tracking Sheet Columns
```
A: Referrer Name
B: Referrer Email
C: Referrer Phone
D: Referrer Role
E: Referral Count (how many people registered via their link)
F: Akshar Coins (total coins earned)
G: Timestamp (last update)
H: Referral Code (AKSHAR2025)
I: Platform (last platform used)
```

### Referral_Clicks Sheet Columns
```
A: Referrer Email
B: Referred Email (person who registered)
C: Timestamp
D: Coins Awarded
```

---

## 🎯 Coins System Explained

### How Coins Are Earned

#### Scenario 1: User Shares Referral Link
```
User clicks "Share via WhatsApp"
  ↓
System awards 3 coins immediately
  ↓
Entry added to Referral_Tracking with:
  - Platform: whatsapp
  - Akshar Coins: +3
  - Referral Count: unchanged
```

#### Scenario 2: Someone Registers via Referral Link
```
New user clicks referral link (with ?ref=referrer@email.com)
  ↓
New user completes registration
  ↓
System awards:
  - Referrer: +1 bonus coin
  - New user: +3 welcome coins
  ↓
Entry added to Referral_Clicks to prevent duplicates
  ↓
Referral_Tracking updated:
  - Referral Count: +1
  - Akshar Coins: +1
```

### Duplicate Prevention

The system **prevents duplicate rewards** by:
1. Checking `Referral_Clicks` sheet for existing referrer-referred pair
2. Only awarding coins if this is a NEW unique referral
3. Each referrer-referred pair can only earn coins ONCE

---

## 🔍 Viewing Your Data

### Option 1: Google Sheets Web Interface
1. Open your Google Sheet
2. Click tabs at bottom to switch between sheets:
   - `AKJOBS_REGISTRATION` - All registrations
   - `Referral_Tracking` - Aggregated referral stats
   - `Referral_Clicks` - Individual referral events
   - `Job_Seekers`, `Recruiters`, etc. - Role-specific data

### Option 2: Export Data
1. File → Download → CSV/Excel/PDF
2. Choose specific sheet to export
3. Use for analytics, reporting, email campaigns

### Option 3: Google Sheets API (Advanced)
```javascript
// Already built into your expo_landing.js!
// Use these functions:

// Get all referral data
getReferralData(email);

// Check if user is registered
checkUserRegistration(email);
```

---

## 🐛 Troubleshooting

### Problem: "Registration not saving"
**Solution:**
1. Check Web App URL is correct in `expo_landing.js`
2. Make sure Web App is deployed with "Anyone" access
3. Check browser console for errors (F12)
4. Verify Sheet ID in `google_sheets_integration.gs` line 15

### Problem: "Duplicate emails are being saved"
**Solution:**
- This shouldn't happen! The script checks for duplicates
- If it does, check Apps Script **Execution log** for errors
- The duplicate check is in `processRegistration()` function

### Problem: "Coins not being awarded"
**Solution:**
1. Check `Referral_Tracking` sheet exists
2. Verify Web App URL in `expo_landing.js` line 1001
3. Check browser console for referral tracking errors
4. Make sure user has valid email in localStorage

### Problem: "CORS errors"
**Solution:**
- This is normal! Google Apps Script uses `no-cors` mode
- The data IS being saved, you just can't read the response
- Check your Google Sheet to verify data is there

---

## 📊 Advanced Features

### Export Registrations to Excel
```javascript
// In Apps Script Editor, create new function:
function exportToCSV() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('AKJOBS_REGISTRATION');
  const data = sheet.getDataRange().getValues();
  
  // Process data as needed
  Logger.log('Total registrations: ' + (data.length - 1));
}
```

### Get Registration Count by Role
```javascript
function getRegistrationStats() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('AKJOBS_REGISTRATION');
  const data = sheet.getDataRange().getValues();
  
  const stats = {};
  for (let i = 1; i < data.length; i++) {
    const role = data[i][4]; // Column E
    stats[role] = (stats[role] || 0) + 1;
  }
  
  Logger.log(stats);
  return stats;
}
```

### Send Email Notifications (Advanced)
```javascript
function sendWelcomeEmail(email, name) {
  MailApp.sendEmail({
    to: email,
    subject: 'Welcome to AksharJobs Expo!',
    htmlBody: `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for registering for AksharJobs Expo.</p>
      <p>Your referral code: AKSHAR2025</p>
    `
  });
}
```

---

## 🔒 Security & Privacy

### Data Protection
- ✅ Email duplicate checking prevents spam
- ✅ No personal data exposed in URLs
- ✅ Google Apps Script runs on Google's secure servers
- ✅ Only you can access the Google Sheet

### Best Practices
1. **Don't share** your Web App URL publicly (only use in your app)
2. **Backup** your Google Sheet regularly (File → Make a copy)
3. **Monitor** the `Referral_Clicks` sheet for unusual activity
4. **Set up notifications** in Google Sheets for new entries

---

## 📞 Need Help?

### Common Questions

**Q: Can I use MongoDB instead?**
A: Yes! Set `USE_MONGODB_API = true` in `expo_api_config.js` and follow `EXPO_DEPLOYMENT_SIMPLE.md`

**Q: How do I see real-time registrations during expo?**
A: Open your Google Sheet on a laptop/tablet. It updates automatically!

**Q: Can multiple people access the sheet?**
A: Yes! Share the Google Sheet with your team (view or edit access)

**Q: What if I hit Google Sheets limits?**
A: Free tier supports 5 million cells. That's ~50,000 full registrations!

**Q: Can I customize the coins rewards?**
A: Yes! Edit the `AKSHAR_COINS_REWARDS` object in `google_sheets_integration.gs`

---

## 🎉 You're All Set!

Your integration is now complete! Here's what happens automatically:

1. ✅ User registers → Saved to Google Sheets
2. ✅ User shares referral → 3 coins awarded
3. ✅ Someone registers via link → Referrer gets +1 coin, new user gets +3
4. ✅ Duplicate emails → Prevented automatically
5. ✅ All data → Accessible in your Google Sheet 24/7

**Next Steps:**
1. Test the full registration flow
2. Test the referral system  
3. Share your expo landing page with attendees
4. Monitor registrations in real-time during expo

**Your Google Sheet Link:**
```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
```

Bookmark this for easy access during your expo! 🚀

