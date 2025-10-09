# 🎯 AksharJobs Expo - Complete Integration Package

## 📦 What You Have

This folder contains a **complete, production-ready expo registration system** with:

✅ **Registration System** - Collect attendee information  
✅ **Referral Program** - Viral growth with coin rewards  
✅ **Google Sheets Integration** - FREE data storage (no server needed)  
✅ **MongoDB Option** - Advanced scalability (optional)  
✅ **Responsive Design** - Works on all devices  
✅ **QR Code System** - Easy expo check-in  
✅ **Multi-role Support** - 10 different user types  

---

## 📁 File Structure

### 🎨 Frontend Files (Landing Page)
```
expo_landing.html       - Main landing page
expo_landing.css        - Styles and animations  
expo_landing.js         - All frontend logic (2000+ lines)
expo_api_config.js      - Integration configuration
```

### 🔧 Backend Integration
```
google_sheets_integration.gs  - Google Apps Script (1400+ lines)
                              - Handles registration, referrals, coins
                              - Auto-creates sheets
                              - Prevents duplicates
```

### 📚 Documentation
```
GOOGLE_SHEETS_INTEGRATION_GUIDE.md  - Complete setup guide
DATA_FLOW_REFERENCE.md              - Visual data flow diagrams
QUICK_SETUP_CHECKLIST.md            - 5-minute setup checklist
README_INTEGRATION.md               - This file
```

### 🖼️ Assets
```
AK logo.jpg            - AksharJobs logo
favicon.ico            - Website favicon
```

---

## 🚀 Quick Start (Choose Your Path)

### Path 1: Google Sheets (Recommended - 5 min)
**Best for:** Most expos, quick setup, FREE forever

✅ No server needed  
✅ No database setup  
✅ Works instantly  
✅ Stores 50,000+ registrations  

**Follow:** `QUICK_SETUP_CHECKLIST.md`

---

### Path 2: MongoDB + Backend (Advanced - 30 min)
**Best for:** Large scale events, advanced analytics

🔧 Requires server deployment  
🔧 Requires MongoDB database  
🔧 More setup complexity  
✅ Better performance at scale  
✅ Real-time analytics  

**Follow:** `../EXPO_DEPLOYMENT_SIMPLE.md`

---

## 🎯 Features Overview

### 1️⃣ Registration System

**Collects:**
- Basic info (name, email, phone, role)
- Role-specific details (experience, company, skills, etc.)
- Timestamps and metadata

**Features:**
- ✅ Email duplicate prevention
- ✅ Form validation
- ✅ Mobile responsive
- ✅ Success notifications
- ✅ Auto-save to localStorage

**Stores in:**
- `AKJOBS_REGISTRATION` (main sheet)
- Role-specific sheets (Job_Seekers, Recruiters, etc.)

---

### 2️⃣ Referral System

**How it Works:**
```
Share link → Get 3 coins immediately
Someone registers via link → Get 1 bonus coin
```

**Features:**
- ✅ Unique referral links with email tracking
- ✅ Multi-platform sharing (WhatsApp, Email, SMS, etc.)
- ✅ Duplicate prevention (can't earn coins twice for same person)
- ✅ Real-time coin balance
- ✅ Leaderboard ready

**Stores in:**
- `Referral_Tracking` (aggregated stats per user)
- `Referral_Clicks` (individual events for duplicate prevention)

---

### 3️⃣ Coins System (AksharCoins)

**Earning Opportunities:**

| Action | Coins Earned |
|--------|-------------|
| Share via WhatsApp | +3 coins |
| Share via Email | +3 coins |
| Share via SMS | +3 coins |
| Share via LinkedIn | +3 coins |
| Share via Twitter | +3 coins |
| Share via Facebook | +3 coins |
| Share via Telegram | +3 coins |
| Copy referral code | +3 coins |
| Someone registers via your link | +1 bonus coin |

**Rewards Tiers:**
- 50 coins = Early Access
- 100 coins = Free Premium
- 200 coins = VIP Support

---

### 4️⃣ Multi-Role Support

Supports **10 different user types**, each with custom fields:

1. **Job Seekers** - Experience, Skills, Location, Job Type
2. **Recruiters** - Company, Position, Hiring Volume
3. **Mentors** - Expertise, Mentorship Type, Bio
4. **Trainers** - Specialization, Format, Certifications
5. **Consultants** - Specialization, Experience, Type
6. **Volunteers** - Interests, Availability, Motivation
7. **Interns** - University, Field, Graduation Year
8. **Communities** - Organization, Interests, Role
9. **Universities** - Name, Department, Student Count
10. **Evangelists** - Special early access tier

---

## 📊 Data Storage Structure

### Google Sheets Layout

```
Your Google Sheet
├── AKJOBS_REGISTRATION      (All registrations)
├── Job_Seekers              (Filtered: job seekers only)
├── Recruiters               (Filtered: recruiters only)
├── Mentors                  (Filtered: mentors only)
├── Trainers                 (Filtered: trainers only)
├── Consultants              (Filtered: consultants only)
├── Volunteers               (Filtered: volunteers only)
├── Interns                  (Filtered: interns only)
├── Community                (Filtered: community only)
├── Universities             (Filtered: universities only)
├── Evangelists              (Filtered: evangelists only)
├── Referral_Tracking        (User referral stats)
└── Referral_Clicks          (Individual referral events)
```

**Auto-created** - You don't need to create these manually!

---

## 🔄 Data Flow Summary

### Registration Flow
```
User fills form
    ↓
expo_landing.js validates
    ↓
Sends to Google Apps Script
    ↓
google_sheets_integration.gs processes
    ↓
Checks for duplicate email
    ↓
Saves to Google Sheets (2 sheets)
    ↓
Returns success message
```

### Referral Flow
```
User clicks "Share"
    ↓
trackReferralShare() called
    ↓
Awards 3 coins immediately
    ↓
Sends to Google Apps Script
    ↓
Updates Referral_Tracking sheet
    ↓
Coin balance updated
```

### Referral Registration Flow
```
New user clicks referral link (?ref=email)
    ↓
Registers normally
    ↓
System detects referrer from URL
    ↓
Checks Referral_Clicks for duplicate
    ↓
If NEW: Awards +1 coin to referrer
    ↓
Records in Referral_Clicks
    ↓
Increments referral count
```

**See:** `DATA_FLOW_REFERENCE.md` for visual diagrams

---

## ⚙️ Configuration Files

### 1. google_sheets_integration.gs
**Location:** Apps Script Editor  
**Key Settings:**
```javascript
Line 15: SHEET_ID = 'your-sheet-id'
```

### 2. expo_api_config.js
**Key Settings:**
```javascript
Line 30: GOOGLE_SHEETS_WEB_APP_URL = 'your-web-app-url'
Line 66: USE_MONGODB_API = false
```

### 3. expo_landing.js
**Key Settings:**
```javascript
Line 291: REGISTRATION_WEBHOOK_URL = 'your-web-app-url'
Line 1001: REFERRAL_WEBHOOK_URL = 'your-web-app-url'
```

---

## 🧪 Testing Your Integration

### Test Checklist

- [ ] **Web App Health Check**
  - Visit Web App URL in browser
  - Should see JSON response

- [ ] **Apps Script Functions**
  - Run `testSetup()` in Apps Script
  - Check Execution log for ✅ messages

- [ ] **Registration Form**
  - Fill form with test data
  - Submit
  - Check Google Sheet for new row

- [ ] **Duplicate Prevention**
  - Register with same email twice
  - Should see "Email already registered" error

- [ ] **Referral Sharing**
  - Click "Start Referring"
  - Share via WhatsApp
  - Check Referral_Tracking for 3 coins

- [ ] **Referral Registration**
  - Copy referral link with ?ref=your@email.com
  - Open in incognito/private window
  - Register new user
  - Check Referral_Tracking for +1 coin
  - Check Referral_Clicks for event

---

## 🎨 Customization Options

### Change Colors/Branding

**Edit:** `expo_landing.css`
```css
:root {
  --primary-color: #667eea;    /* Main purple */
  --secondary-color: #764ba2;  /* Dark purple */
  --accent-color: #f093fb;     /* Light pink */
}
```

### Change Coin Rewards

**Edit:** `google_sheets_integration.gs` (Lines 434-448)
```javascript
function getCoinsForSharing(platform) {
  const shareRewards = {
    'whatsapp': 3,   // Change this
    'email': 3,      // Change this
    // etc.
  };
}
```

### Change Referral Code

**Edit:** Multiple files, search for `AKSHAR2025`

### Add/Remove User Roles

**Edit:** 
1. `google_sheets_integration.gs` (Lines 23-34)
2. `expo_landing.js` (Lines 399-409)
3. Update form fields in `expo_landing.html`

---

## 📈 Analytics & Reporting

### Built-in Analytics

**View in Google Sheets:**

1. **Total Registrations**
   ```
   Open AKJOBS_REGISTRATION
   Count rows (minus header)
   ```

2. **Registrations by Role**
   ```
   Count rows in each role-specific sheet
   ```

3. **Top Referrers**
   ```
   Open Referral_Tracking
   Sort by Column F (Akshar Coins) descending
   ```

4. **Referral Conversion Rate**
   ```
   Open Referral_Tracking
   Referral Count (Col E) / Total Shares
   ```

### Export Data

**From Google Sheets:**
- File → Download → CSV/Excel
- Use for email campaigns
- Import to other tools

**Advanced:**
- Connect to Google Data Studio
- Create visualizations
- Share dashboards with team

---

## 🔒 Security & Privacy

### Data Protection

✅ **Email Validation** - Prevents spam  
✅ **Duplicate Prevention** - No duplicate emails  
✅ **Secure Storage** - Google's secure servers  
✅ **Access Control** - Only you can view the sheet  
✅ **No Public URLs** - Referral tracking via GET params only  

### GDPR Compliance

**To be compliant:**
1. Add privacy policy to landing page
2. Add "I agree" checkbox to form
3. Provide data deletion option
4. Document data retention policy

**Template added to expo_landing.html:**
- Privacy notice in footer
- Can be customized as needed

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
```bash
1. Go to vercel.com
2. Sign up (free)
3. Upload AKSHAREXPO folder
4. Deploy
5. Get URL: https://yourproject.vercel.app
```

### Option 2: Netlify
```bash
1. Go to netlify.com  
2. Drag AKSHAREXPO folder to drop zone
3. Deploy
4. Get URL: https://yourproject.netlify.app
```

### Option 3: GitHub Pages
```bash
1. Create GitHub repo
2. Upload files
3. Settings → Pages → Enable
4. Get URL: https://yourusername.github.io/repo
```

### Option 4: Local Network (Expo)
```bash
1. Install Python: python -m http.server 8000
2. Or Node: npx http-server
3. Share local IP: http://192.168.x.x:8000
4. Works on same WiFi network
```

---

## 📱 QR Code for Expo

### Generate QR Code

**Option 1: Online**
1. Go to [qr-code-generator.com](https://www.qr-code-generator.com/)
2. Paste your deployed URL
3. Download PNG/SVG
4. Print for expo booth

**Option 2: Built-in**
- Open expo_landing.html
- Scroll to QR section
- Click "Generate QR Code"
- Download automatically generated

---

## 🎯 During Your Expo

### Setup Checklist

**Before Expo:**
- [ ] Test full registration flow
- [ ] Test referral system
- [ ] Generate QR code
- [ ] Print QR code poster
- [ ] Test on mobile devices
- [ ] Share URL with team
- [ ] Open Google Sheet on laptop/tablet

**During Expo:**
- [ ] Display QR code at booth
- [ ] Monitor Google Sheet for registrations
- [ ] Check internet connection
- [ ] Have backup registration forms printed
- [ ] Respond to registration issues quickly

**After Expo:**
- [ ] Export data from Google Sheets
- [ ] Send thank you emails
- [ ] Analyze referral performance
- [ ] Award top referrers
- [ ] Follow up with leads

---

## 🐛 Common Issues & Solutions

### "Data not saving to Google Sheets"

**Checklist:**
- [ ] Web App URL correct in all files?
- [ ] Apps Script deployed with "Anyone" access?
- [ ] Sheet ID correct in Apps Script?
- [ ] Clear browser cache and retry

### "CORS error in console"

**Solution:** This is NORMAL! Data IS being saved. Google Apps Script uses no-cors mode.

**Verify:** Check your Google Sheet - data should be there.

### "Coins not awarding"

**Checklist:**
- [ ] User registered first?
- [ ] Referral_Tracking sheet exists?
- [ ] Check browser console for errors
- [ ] Verify localStorage has user email

### "Duplicate registrations"

**This shouldn't happen** - Script checks for duplicates.

**If it does:**
1. Check Apps Script Execution log for errors
2. Manually delete duplicates from sheet
3. Re-test with new email

---

## 📞 Support & Resources

### Documentation
- ✅ `GOOGLE_SHEETS_INTEGRATION_GUIDE.md` - Full setup guide
- ✅ `DATA_FLOW_REFERENCE.md` - Visual diagrams
- ✅ `QUICK_SETUP_CHECKLIST.md` - Quick reference
- ✅ `../EXPO_DEPLOYMENT_SIMPLE.md` - MongoDB option

### Code Structure
- **2000+ lines** of JavaScript (expo_landing.js)
- **1400+ lines** of Apps Script (google_sheets_integration.gs)
- **Fully commented** and documented
- **Production-ready** and tested

### Need Help?
1. Check browser console (F12)
2. Check Apps Script Execution log
3. Review documentation files
4. Test with simple data first

---

## 🎉 You're Ready!

**What you have:**
- ✅ Complete registration system
- ✅ Viral referral program
- ✅ Automated coin rewards
- ✅ FREE Google Sheets storage
- ✅ Real-time data access
- ✅ Mobile-responsive design
- ✅ Production-ready code

**Next steps:**
1. Follow `QUICK_SETUP_CHECKLIST.md`
2. Test everything
3. Deploy to web
4. Generate QR code
5. Start your expo! 🚀

---

**Built with ❤️ for AksharJobs**

Questions? Review the documentation files or check the inline comments in the code!

Good luck with your expo! 🎯

