# 📊 AksharJobs Expo - Data Flow Reference

## 🔄 How Data Flows from Landing Page to Google Sheets

```
┌─────────────────────────────────────────────────────────────┐
│                    EXPO LANDING PAGE                         │
│                   (expo_landing.html)                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ├─── User fills registration form
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND JAVASCRIPT                         │
│                 (expo_landing.js)                            │
│                                                              │
│  • Validates form data                                       │
│  • Checks for referral parameters                           │
│  • Calls sendRegistration()                                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ├─── Sends POST/GET request
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│             GOOGLE APPS SCRIPT WEB APP                       │
│         (google_sheets_integration.gs)                       │
│                                                              │
│  • doGet() or doPost() receives data                        │
│  • Validates required fields                                 │
│  • Checks for duplicate email                               │
│  • Calls processRegistration()                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ├─── Saves to multiple sheets
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    GOOGLE SHEETS                             │
│                                                              │
│  📋 AKJOBS_REGISTRATION (All registrations)                 │
│  👥 Role-Specific Sheets (Job_Seekers, Recruiters, etc.)    │
│  🔗 Referral_Tracking (Aggregated referral data)            │
│  🖱️ Referral_Clicks (Individual click tracking)             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Registration Data Flow

### When User Registers:

```javascript
// 1. USER FILLS FORM
{
  fullName: "John Doe",
  email: "john@example.com",
  phone: "+254712345678",
  role: "job_seeker",
  experience: "3-5 years",
  skills: "Python, React, Node.js"
}
        ↓
// 2. FRONTEND PROCESSES
sendRegistration(data)
  → Checks if MongoDB enabled (USE_MONGODB_API)
  → Falls back to Google Sheets (REGISTRATION_WEBHOOK_URL)
        ↓
// 3. GOOGLE APPS SCRIPT RECEIVES
doPost(event) or doGet(event)
  → Parses data
  → Checks for duplicate email
  → Calls processRegistration(data)
        ↓
// 4. DATA SAVED TO SHEETS
✅ Row added to AKJOBS_REGISTRATION
✅ Row added to Job_Seekers sheet
✅ Email indexed for duplicate check
```

**Result in Google Sheet:**

| Timestamp | Full Name | Email | Phone | Role | Experience | Skills |
|-----------|-----------|-------|-------|------|------------|--------|
| 2025-10-01 12:30 | John Doe | john@example.com | +254712... | Job Seeker | 3-5 years | Python, React... |

---

## 🔗 Referral Data Flow

### Scenario 1: User Shares Referral Link

```javascript
// 1. USER CLICKS SHARE BUTTON
shareReferralViaWhatsApp()
  ↓
// 2. FRONTEND TRACKS ACTION
trackReferralShare('whatsapp')
  ↓
// 3. DATA PREPARED
{
  type: 'referral',
  referrerName: 'John Doe',
  referrerEmail: 'john@example.com',
  referrerPhone: '+254712345678',
  referrerRole: 'job_seeker',
  platform: 'whatsapp',
  referralCode: 'AKSHAR2025',
  referredEmail: ''  // Empty for just sharing
}
  ↓
// 4. SENT TO GOOGLE SHEETS
sendReferralDataToSheets(data)
  ↓
// 5. GOOGLE APPS SCRIPT PROCESSES
processReferralTracking(data)
  → Finds or creates user record
  → Awards 3 coins for sharing
  → Does NOT increment referral count (no registration yet)
  → Updates timestamp
```

**Result in Referral_Tracking Sheet:**

| Referrer Name | Referrer Email | Referral Count | Akshar Coins | Platform |
|---------------|----------------|----------------|--------------|----------|
| John Doe | john@example.com | 0 | 3 | whatsapp |

---

### Scenario 2: Someone Registers via Referral Link

```javascript
// 1. NEW USER CLICKS REFERRAL LINK
https://yoursite.com?ref=john@example.com
  ↓
// 2. NEW USER REGISTERS
{
  fullName: "Jane Smith",
  email: "jane@example.com",
  phone: "+254787654321",
  role: "recruiter"
}
  ↓
// 3. FRONTEND DETECTS REFERRER
const referrerEmail = urlParams.get('ref'); // john@example.com
  ↓
// 4. REGISTRATION SAVED FIRST
processRegistration(receiverData)
  → Saves to AKJOBS_REGISTRATION
  → Saves to Recruiters sheet
  ↓
// 5. REFERRAL BONUS PROCESSED
processReferralRegistration(referrerEmail, receiverData)
  ↓
// 6. REFERRER GETS BONUS
{
  type: 'referral',
  referrerEmail: 'john@example.com',
  referredEmail: 'jane@example.com',  // KEY: Identifies unique referral
  platform: 'registration'
}
  ↓
// 7. GOOGLE APPS SCRIPT
processReferralTracking(data)
  → Checks Referral_Clicks for duplicate (john → jane)
  → If NEW: Records click, awards 1 coin to referrer
  → If DUPLICATE: Skips coin award
  → Increments referral count
  → Adds entry to Referral_Clicks sheet
```

**Result in Referral_Tracking Sheet:**

| Referrer Name | Referrer Email | Referral Count | Akshar Coins | Platform |
|---------------|----------------|----------------|--------------|----------|
| John Doe | john@example.com | 1 | 4 | registration |

**Result in Referral_Clicks Sheet:**

| Referrer Email | Referred Email | Timestamp | Coins Awarded |
|----------------|----------------|-----------|---------------|
| john@example.com | jane@example.com | 2025-10-01 13:45 | 1 |

---

## 🪙 Coins System Flow

### Earning Coins

```
┌──────────────────────────────────────────────────┐
│            SHARE REFERRAL LINK                   │
│   (WhatsApp, Email, SMS, LinkedIn, etc.)         │
└──────────────────────────────────────────────────┘
                    ↓
        ┌─────────────────────┐
        │  INSTANT REWARD     │
        │   +3 Coins          │
        └─────────────────────┘
                    ↓
    Updated in Referral_Tracking:
    • Akshar Coins: +3
    • Referral Count: unchanged
    • Platform: recorded


┌──────────────────────────────────────────────────┐
│       SOMEONE REGISTERS VIA YOUR LINK            │
│         (Clicks ?ref=your@email.com)             │
└──────────────────────────────────────────────────┘
                    ↓
        ┌─────────────────────┐
        │  BONUS REWARD       │
        │  Referrer: +1 coin  │
        │  New User: +3 coins │
        └─────────────────────┘
                    ↓
    Updated in Referral_Tracking:
    • Akshar Coins: +1 (bonus)
    • Referral Count: +1
    • Entry in Referral_Clicks
```

### Duplicate Prevention

```
User A shares via WhatsApp
  ↓
+3 coins awarded ✅
  ↓
User B clicks link and registers
  ↓
System checks Referral_Clicks:
  → Does [User A → User B] exist?
  → NO: Award +1 coin ✅
  → YES: Skip (already awarded) ❌
  ↓
Add to Referral_Clicks: [User A → User B]
```

**This ensures:**
- Each share earns 3 coins (once per share action)
- Each unique referral earns 1 bonus coin (once per person)
- Same referral cannot earn coins multiple times

---

## 📊 Complete Data Structure

### 1️⃣ AKJOBS_REGISTRATION Sheet

**Purpose:** Main registration database

**Columns (41 total):**
```
Column A: Timestamp
Column B: Full Name
Column C: Email (UNIQUE - duplicates rejected)
Column D: Phone
Column E: Role

Columns F-J: Job Seeker Fields
  F: Experience
  G: Skills
  H: Location
  I: Job Type
  J: Industry

Columns K-O: Recruiter Fields
  K: Company
  L: Position
  M: Industry
  N: Company Size
  O: Hiring Volume

Columns P-R: Mentor Fields
  P: Expertise
  Q: Mentorship Type
  R: Bio

Columns S-U: Trainer Fields
  S: Specialization
  T: Training Format
  U: Certifications

Columns V-Y: Consultant Fields
  V: Consultant Specialization
  W: Consultant Experience
  X: Consultant Type
  Y: Industry Focus

Columns Z-AB: Volunteer Fields
  Z: Volunteer Interests
  AA: Volunteer Availability
  AB: Volunteer Motivation

Columns AC-AF: Intern Fields
  AC: University
  AD: Field
  AE: Internship Type
  AF: Graduation Year

Columns AG-AK: Community Fields
  AG: Community Organization
  AH: Community Interests
  AI: Community Role
  AJ: Community Experience
  AK: Community Description

Columns AL-AO: University Fields
  AL: University Name
  AM: Department
  AN: University Type
  AO: Student Count

Column AP: Notification Status
Column AQ: Registration Type
```

---

### 2️⃣ Referral_Tracking Sheet

**Purpose:** Aggregated referral statistics per user

**Columns (9 total):**
```
Column A: Referrer Name
Column B: Referrer Email (KEY - one row per user)
Column C: Referrer Phone
Column D: Referrer Role
Column E: Referral Count (how many registered via link)
Column F: Akshar Coins (total accumulated)
Column G: Timestamp (last update)
Column H: Referral Code (AKSHAR2025)
Column I: Platform (last platform used)
```

**Each user has ONE row** that gets updated:
- Share link → Coins +3, Count unchanged
- Someone registers → Coins +1, Count +1

---

### 3️⃣ Referral_Clicks Sheet

**Purpose:** Track individual referral events (prevents duplicates)

**Columns (4 total):**
```
Column A: Referrer Email
Column B: Referred Email
Column C: Timestamp
Column D: Coins Awarded
```

**Each row** = One unique referral event

**Duplicate Check:**
```javascript
// Before awarding coins, system checks:
Does row exist where:
  - Referrer Email = john@example.com
  - Referred Email = jane@example.com

If YES: Skip (already processed)
If NO: Award coins and add row
```

---

### 4️⃣ Role-Specific Sheets

**Purpose:** Filtered data by role for easy analysis

**Sheets created:**
- `Job_Seekers`
- `Recruiters`
- `Mentors`
- `Trainers`
- `Consultants`
- `Volunteers`
- `Interns`
- `Community`
- `Universities`
- `Evangelists`

**Structure:** Same as AKJOBS_REGISTRATION

**Auto-populated:** When user registers, data saved to:
1. AKJOBS_REGISTRATION (main)
2. Corresponding role sheet (filtered)

---

## 🔍 Query Examples

### How to find data in your sheets:

#### Get all Job Seekers with Python skills
```
1. Open "Job_Seekers" sheet
2. Click Data → Create a filter
3. Filter Column G (Skills) → Contains "Python"
```

#### Find total coins earned by a user
```
1. Open "Referral_Tracking" sheet
2. Find their email in Column B
3. Check Column F for total coins
```

#### See who registered via John's referral
```
1. Open "Referral_Clicks" sheet
2. Filter Column A (Referrer Email) = john@example.com
3. Column B shows all people who registered via his link
```

#### Export all registrations from last week
```
1. Open "AKJOBS_REGISTRATION" sheet
2. Filter Column A (Timestamp) → Last 7 days
3. File → Download → CSV
```

---

## 🚀 Integration Status Checklist

Use this to verify your integration is working:

### ✅ Setup Complete
- [ ] Google Sheet created
- [ ] Sheet ID updated in `google_sheets_integration.gs` (line 15)
- [ ] Apps Script deployed as Web App
- [ ] Web App URL updated in `expo_landing.js` (line 291)
- [ ] Web App URL updated in `expo_landing.js` (line 1001)

### ✅ Registration Working
- [ ] Test registration saves to AKJOBS_REGISTRATION
- [ ] Data also saves to role-specific sheet
- [ ] Duplicate email is rejected with error message

### ✅ Referral Tracking Working
- [ ] Share button awards 3 coins immediately
- [ ] Coins appear in Referral_Tracking sheet
- [ ] Registration via referral awards +1 bonus coin
- [ ] Referral count increments correctly
- [ ] Duplicate referrals don't award coins again

### ✅ Data Integrity
- [ ] No duplicate emails in AKJOBS_REGISTRATION
- [ ] Referral_Clicks prevents duplicate bonuses
- [ ] All required fields have data

---

## 📞 Support

**If data isn't saving:**
1. Check browser console (F12) for errors
2. Verify Web App URL is correct
3. Make sure Apps Script is deployed with "Anyone" access
4. Check Apps Script Execution Log for errors

**If coins aren't working:**
1. Check Referral_Tracking sheet exists
2. Verify user has email in localStorage
3. Check browser console for referral tracking errors

**If you see CORS errors:**
This is NORMAL for Google Apps Script! Data is still being saved.

---

🎉 **Your integration is now fully documented!**

All data flows from landing page → Apps Script → Google Sheets automatically.

See `GOOGLE_SHEETS_INTEGRATION_GUIDE.md` for setup instructions.

