# 🎯 Role Flow Quick Reference Guide
## AksharJobs Platform - At a Glance

---

## 📋 Quick Navigation
- [User Roles Summary](#user-roles-summary)
- [Job Seeker Quick Flows](#job-seeker-quick-flows)
- [Recruiter Quick Flows](#recruiter-quick-flows)
- [Feature Access Matrix](#feature-access-matrix)
- [Key User Journeys](#key-user-journeys)

---

## 👥 User Roles Summary

### 1. 👤 Job Seeker
**Primary Goal:** Find and apply for suitable jobs

**Key Capabilities:**
- ✅ Upload and manage resume
- ✅ Search and browse jobs
- ✅ Apply to positions
- ✅ Track applications
- ✅ View match scores
- ✅ Complete profile
- ✅ Earn and redeem Akshar Coins
- ✅ Use referral system

**Dashboard Access:** `/jobseeker-dashboard`

---

### 2. 🏢 Recruiter
**Primary Goal:** Post jobs and hire candidates

**Key Capabilities:**
- ✅ Post job openings
- ✅ Browse candidate profiles
- ✅ Manage applications
- ✅ Update candidate status
- ✅ View analytics
- ✅ Complete company profile
- ✅ Earn and spend Akshar Coins
- ✅ Use referral system

**Dashboard Access:** `/recruiter-dashboard`

---

### 3. 👑 Admin (Limited Scope)
**Primary Goal:** System management

**Key Capabilities:**
- ✅ Manage users
- ✅ Manage communities
- ✅ View system analytics
- ✅ Configure settings

**Dashboard Access:** `/admin`

---

## 🎯 Job Seeker Quick Flows

### Flow 1: Quick Start (First Time User)
```
1. Sign Up → 2. Verify Phone → 3. Verify Email
           ↓
4. Select Communities → 5. Upload Resume → 6. Complete Profile
           ↓
7. Browse Jobs → 8. Apply → 9. Track Applications
```

**Time to First Application:** ~10 minutes

---

### Flow 2: Daily User Journey
```
1. Login → 2. Check Dashboard
           ↓
3. View New Job Matches → 4. Review Applications Status
           ↓
5. Apply to New Jobs → 6. Update Profile
```

**Average Session:** 5-15 minutes

---

### Flow 3: Resume Upload & Matching
```
Resume Upload (PDF/DOCX)
           ↓
AI Text Extraction (Gemini API)
           ↓
Parse Skills, Education, Experience
           ↓
Store in Database + GridFS
           ↓
Enable Job Matching
           ↓
Award ₳5 Akshar Coins
```

**Processing Time:** 30-60 seconds

---

### Flow 4: Job Application Process
```
Browse Jobs → Filter by Skills/Location/Community
           ↓
View Job Details (8 sections)
           ↓
Check Match Score (AI-calculated)
           ↓
Click Apply Button
           ↓
Confirm Application
           ↓
Spend ₳2 Coins → Email Confirmation
           ↓
Application Status: Pending
```

**Time per Application:** 2-5 minutes

---

### Flow 5: Application Status Progression
```
Pending → AI Screening → Reviewing → Shortlisted
                              ↓
                         Interview
                              ↓
                      Hired / Rejected
```

**Email Notifications:** At each status change

---

### Flow 6: Profile Completion Journey
```
Start: 0% Complete
           ↓
Add Personal Info (5 fields) → 45%
           ↓
Add Professional Summary → 55%
           ↓
Add Skills (10+) → 70%
           ↓
Add Education → 80%
           ↓
Add Work Experience → 90%
           ↓
Add Projects/Certifications → 100%
           ↓
Award ₳5 Coins + Enable All Features
```

**Profile Completion Goal:** 100%

---

## 🏢 Recruiter Quick Flows

### Flow 1: Quick Start (First Time Recruiter)
```
1. Sign Up with Company Info → 2. Verify Phone → 3. Verify Email
           ↓
4. Select Communities → 5. Complete Company Profile
           ↓
6. Post First Job → 7. Browse Candidates → 8. Manage Applications
```

**Time to First Job Post:** ~15 minutes

---

### Flow 2: Daily Recruiter Journey
```
1. Login → 2. Check Dashboard
           ↓
3. Review New Applications → 4. Update Candidate Status
           ↓
5. Browse New Candidates → 6. View Analytics
           ↓
7. Post New Job / Update Existing
```

**Average Session:** 15-30 minutes

---

### Flow 3: Job Posting Process
```
Open Post Job Modal
           ↓
Fill 8 Sections:
  • Basic Info (title, location, salary)
  • Required Skills (10-12)
  • Responsibilities (8)
  • Requirements (5)
  • Benefits (7)
  • Company Culture
  • Application Process (5 steps)
           ↓
Select Target Communities
           ↓
AI Generates Improvement Suggestions
           ↓
Submit → Spend ₳5 Coins
           ↓
Job Posted + Notify Matched Candidates
```

**Time per Job Post:** 10-20 minutes

---

### Flow 4: Candidate Review Process
```
CV Browser → Apply Filters
           ↓
Filter by:
  • Community
  • Skills
  • Experience
  • Location
  • Education
           ↓
View Candidate Cards (with match scores)
           ↓
Click to View Full Profile
           ↓
Review:
  • Resume
  • Skills Breakdown
  • Work History
  • Projects
           ↓
Actions:
  • Download Resume
  • Shortlist
  • Contact
  • Compare
```

**Time per Candidate Review:** 3-5 minutes

---

### Flow 5: Application Management Flow
```
Recruiter Tracker → Select Job Posting
           ↓
View All Applicants
           ↓
For Each Application:
  • Review Match Score
  • Review Resume
  • View Application Details
           ↓
Update Status:
  Pending → AI Screening → Reviewing
           ↓
  Shortlisted → Interview → Hired/Rejected
           ↓
Add Notes + Auto-send Email Notification
```

**Status Updates:** Real-time with email alerts

---

### Flow 6: Analytics & Insights
```
Analytics Dashboard
           ↓
View Metrics:
  • Total Applications
  • Average Match Scores
  • Time to Hire
  • Conversion Rates
           ↓
Skills Gap Analysis per Job
           ↓
Set Match Score Thresholds
           ↓
View Historical Performance
           ↓
Competitor Analysis
```

**Update Frequency:** Real-time

---

## 🔄 Common Flows (Both Roles)

### Flow 1: Registration & Verification
```
Visit Signup Page
           ↓
Choose Role (Job Seeker / Recruiter)
           ↓
Enter Basic Information
           ↓
Select Communities (from 10 options)
           ↓
Phone Verification:
  • Enter phone number
  • Receive SMS code
  • Verify 6-digit code
  • 10-min expiration, 3 attempts
           ↓
Email Verification:
  • Enter email
  • Receive email code
  • Verify 6-digit code
  • 10-min expiration, 3 attempts
           ↓
Account Created → Auto-login
           ↓
Redirect to Role-specific Dashboard
```

**Total Time:** 5-8 minutes

---

### Flow 2: Login Process
```
Visit Login Page
           ↓
Enter Email + Password
           ↓
Submit
           ↓
JWT Token Generated
           ↓
Auto-redirect based on role:
  • Job Seeker → /jobseeker-dashboard
  • Recruiter → /recruiter-dashboard
  • Admin → /admin
```

**Login Time:** < 5 seconds

---

### Flow 3: Akshar Coins System
```
Access: Profile Dropdown → "Promo Code & Coins"
           ↓
Akshar Coins Tab
           ↓
View Current Balance (e.g., ₳10)
           ↓
Earn Coins:
  • Share Promo Code: ₳5
  • Referral Signup: ₳5
  • Complete Profile: ₳5
  • First Application/Post: ₳3
  • Daily Login: ₳3
           ↓
Redeem Coins:
  • Job Application: ₳2
  • Job Post: ₳5
  • Resume Views (5): ₳1
  • Premium Plans: ₳50-350
           ↓
View Transaction History
```

**Starting Balance:** ₳10

---

### Flow 4: Promo Code & Referral
```
Access: Profile → Promo Code & Coins
           ↓
Promo Codes Tab
           ↓
View Your Unique Code (USERNAME_XXXX)
           ↓
Share Options:
  • Copy to Clipboard
  • Social Media (FB, Twitter, LinkedIn)
  • WhatsApp / Email
           ↓
When Someone Uses Your Code:
  • You earn ₳5
  • They earn ₳5
  • Both notified via email
           ↓
View Referral Statistics:
  • Total Referrals
  • Successful Signups
  • Total Coins Earned
```

---

### Flow 5: Community System
```
Select Communities During:
  • Signup
  • Profile Update
           ↓
Available Communities (10):
  1. 🌍 All Communities
  2. 💻 Software Developers
  3. 📊 Data Scientists
  4. 🏥 Healthcare Workers
  5. 📢 Marketing Professionals
  6. 💰 Finance Professionals
  7. 🎨 Designers
  8. 💼 Sales Professionals
  9. 🎓 Education Professionals
  10. ⚙️ Engineering
           ↓
Benefits:
  • Community-based job feed
  • Targeted job postings
  • Community member search
  • Better job matching
```

---

## 📊 Feature Access Matrix

### Core Features

| Feature | Job Seeker | Recruiter | Admin |
|---------|:----------:|:---------:|:-----:|
| **Authentication** |
| Sign Up | ✅ | ✅ | ❌ |
| Login | ✅ | ✅ | ✅ |
| Phone Verification | ✅ | ✅ | ❌ |
| Email Verification | ✅ | ✅ | ❌ |
| Two-Factor Auth | ✅ | ✅ | ✅ |
| **Profile** |
| Complete Profile | ✅ | ✅ | ✅ |
| Profile Tracker | ✅ | ✅ | ❌ |
| Upload Resume | ✅ | ❌ | ❌ |
| Company Profile | ❌ | ✅ | ❌ |
| Contact Me Page | ✅ | ✅ | ❌ |
| **Jobs** |
| Browse Jobs | ✅ | ✅ | ✅ |
| Apply to Jobs | ✅ | ❌ | ❌ |
| Post Jobs | ❌ | ✅ | ❌ |
| Manage Jobs | ❌ | ✅ | ✅ |
| View Job Analytics | ❌ | ✅ | ✅ |
| **Candidates** |
| CV Browser | ❌ | ✅ | ✅ |
| View Resumes | ❌ | ✅ | ✅ |
| Download Resumes | ❌ | ✅ | ✅ |
| Shortlist Candidates | ❌ | ✅ | ✅ |
| **Applications** |
| Submit Application | ✅ | ❌ | ❌ |
| Application Tracker | ✅ | ❌ | ❌ |
| Manage Applications | ❌ | ✅ | ✅ |
| Update Status | ❌ | ✅ | ✅ |
| **Coins & Referrals** |
| Akshar Coins | ✅ | ✅ | ❌ |
| Earn Coins | ✅ | ✅ | ❌ |
| Redeem Coins | ✅ | ✅ | ❌ |
| Promo Code | ✅ | ✅ | ❌ |
| Referral System | ✅ | ✅ | ❌ |
| **Communities** |
| Join Communities | ✅ | ✅ | ❌ |
| View Community Jobs | ✅ | ❌ | ✅ |
| Post to Communities | ❌ | ✅ | ❌ |
| Manage Communities | ❌ | ❌ | ✅ |
| **Analytics** |
| Application Stats | ✅ | ❌ | ✅ |
| Recruitment Analytics | ❌ | ✅ | ✅ |
| Match Score Analytics | ✅ | ✅ | ✅ |
| System Analytics | ❌ | ❌ | ✅ |

---

## 🎯 Key User Journeys

### Journey 1: Job Seeker Success Path
```
DAY 1: Sign Up
  └─ Create account with verification
  └─ Upload resume (₳5 earned)
  └─ Complete profile (₳5 earned)
  └─ Balance: ₳20

DAY 2-7: Job Search
  └─ Browse 50+ jobs
  └─ Apply to 10 jobs (₳20 spent)
  └─ Balance: ₳0
  └─ Share promo code (₳5 earned)

WEEK 2: Application Tracking
  └─ 3 applications → Reviewing
  └─ 2 applications → Shortlisted
  └─ 1 interview scheduled

WEEK 3: Success
  └─ Interview completed
  └─ Job offer received
  └─ Status: Hired ✅
```

---

### Journey 2: Recruiter Success Path
```
DAY 1: Sign Up
  └─ Create account with company info
  └─ Complete company profile (₳5 earned)
  └─ Balance: ₳15

DAY 2-3: Job Posting
  └─ Post 3 job openings (₳15 spent)
  └─ Target specific communities
  └─ Balance: ₳0

WEEK 1: Application Review
  └─ 50 applications received
  └─ Filter by match score (>70%)
  └─ Shortlist 15 candidates
  └─ Schedule 5 interviews

WEEK 2-3: Hiring
  └─ Complete interviews
  └─ Send offers
  └─ 2 positions filled ✅
```

---

## 📈 Match Score Guide

### Score Breakdown (Total: 100%)

**Component Weights:**
```
Skills Match:     40% ████████
Education Match:  20% ████
Experience Match: 20% ████
Semantic Match:   20% ████
```

### Score Categories
```
90-100% → Excellent Match  🟢 [Priority]
80-89%  → Very Good Match  🟢 [Recommended]
70-79%  → Good Match       🟡 [Consider]
60-69%  → Moderate Match   🟡 [Review]
50-59%  → Fair Match       🟠 [Low Priority]
40-49%  → Low Match        🟠 [Not Recommended]
0-39%   → Poor Match       🔴 [Reject]
```

---

## ⏱️ Time Estimates

### Job Seeker Activities
| Activity | Time Estimate |
|----------|--------------|
| Sign Up | 5-8 minutes |
| Upload Resume | 1-2 minutes |
| Complete Profile | 15-20 minutes |
| Browse Jobs | 5-10 minutes |
| Apply per Job | 2-5 minutes |
| Check Application Status | 1-2 minutes |

### Recruiter Activities
| Activity | Time Estimate |
|----------|--------------|
| Sign Up | 8-10 minutes |
| Complete Company Profile | 10-15 minutes |
| Post Job | 10-20 minutes |
| Review Candidate | 3-5 minutes |
| Update Application Status | 1-2 minutes |
| Weekly Analytics Review | 10-15 minutes |

---

## 🎨 Visual Elements Guide

### Status Colors
```
✅ Success    → Green   (#10b981)
⏳ Pending    → Yellow  (#fbbf24)
📝 Reviewing  → Blue    (#3b82f6)
⭐ Interview  → Purple  (#8b5cf6)
❌ Rejected   → Red     (#ef4444)
```

### Role Colors
```
👤 Job Seeker → Purple Theme (#667eea - #764ba2)
🏢 Recruiter  → Blue Theme   (#3b82f6 - #2563eb)
👑 Admin      → Dark Theme   (#1f2937 - #111827)
```

### Badge Indicators
```
Job Seeker Badge: Purple pill with "Job Seeker" 👤
Recruiter Badge:  Blue pill with "Recruiter" 🏢
Admin Badge:      Dark pill with "Admin" 👑
```

---

## 🔔 Notification Types

### Email Notifications
```
📧 Job Seekers:
  • Application submitted confirmation
  • Application status updates
  • Interview scheduled
  • New matching jobs
  • Profile views
  • Coins earned/spent
  • Referral signup

📧 Recruiters:
  • New application received
  • Candidate status updated
  • Job posting approved
  • High match candidate alert
  • Interview reminders
  • Subscription renewal
```

### In-App Notifications
```
🔔 Real-time alerts (30s polling):
  • New messages
  • Status changes
  • System updates
  • Feature announcements
```

---

## 💰 Akshar Coins Quick Reference

### Earning Opportunities
```
₳5 → Share Promo Code (when used)
₳5 → Referral Signup (both parties)
₳5 → Complete Profile (100%)
₳3 → First Application (job seeker)
₳3 → First Job Post (recruiter)
₳3 → Daily Login Streak
```

### Redemption Options
```
₳2   → Apply to Job (premium)
₳5   → Post Job
₳1   → Resume Views (pack of 5)
₳50  → Premium Basic Plan
₳150 → Premium Pro Plan
₳350 → Premium Enterprise Plan
```

### Starting Balance
```
All New Users: ₳10
```

---

## 🎯 Success Metrics

### Job Seeker Success Indicators
```
✅ Profile 100% complete
✅ Resume uploaded
✅ 10+ applications submitted
✅ 70%+ average match score
✅ 3+ interviews scheduled
✅ Job offer received
```

### Recruiter Success Indicators
```
✅ Company profile 100% complete
✅ 3+ jobs posted
✅ 50+ applications received
✅ 80%+ average match score
✅ 10+ candidates shortlisted
✅ 2+ positions filled
```

---

## 🚀 Quick Start Checklists

### Job Seeker Onboarding Checklist
```
□ Sign up with email and phone verification
□ Select communities (choose 2-3 relevant)
□ Upload resume (PDF or DOCX)
□ Complete profile (aim for 100%)
□ Add profile picture
□ Review and apply to 3 jobs
□ Set up job alerts
□ Share promo code to earn coins
```

### Recruiter Onboarding Checklist
```
□ Sign up with company information
□ Complete phone and email verification
□ Select target communities
□ Complete company profile (100%)
□ Upload company logo
□ Post first job (use all 8 sections)
□ Set up candidate filters
□ Review analytics dashboard
```

---

## 📱 Mobile vs Desktop Features

### Available on All Devices
```
✅ Authentication & Sign up
✅ Profile management
✅ Job browsing
✅ Application tracking
✅ Notifications
✅ Settings
```

### Best on Desktop
```
💻 Analytics dashboard (wide charts)
💻 CV Browser (multiple filters)
💻 Candidate comparison (side-by-side)
💻 Job posting form (multiple sections)
💻 Bulk operations
```

### Optimized for Mobile
```
📱 Quick job applications
📱 Status updates
📱 Push notifications
📱 Resume upload
📱 Profile editing
📱 Messaging
```

---

## 🔗 Important Routes

### Job Seeker Routes
```
/signup                        → Sign up page
/login                         → Login page
/jobseeker-dashboard          → Main dashboard
/upload                       → Upload resume
/profile                      → View/edit profile
/alljobs                      → Browse jobs
/appliedjobs                  → Applied jobs list
/application-tracker          → Track applications
/contact-me                   → Public profile
/settings                     → Settings page
```

### Recruiter Routes
```
/signup                        → Sign up page
/login                         → Login page
/recruiter-dashboard          → Main dashboard
/recruiter-complete-profile   → Complete profile
/cv-browser                   → Browse candidates
/recruiter-tracker            → Manage applications
/viewtopcandidates            → Top candidates
/viewallcandidates            → All candidates
/analytics-dashboard          → Analytics
/contact-me                   → Company profile
```

### Common Routes
```
/promo-code                    → Promo & coins
/home                         → Landing page
/about                        → About us
/privacy-policy               → Privacy policy
/terms-of-service             → Terms of service
```

---

## 🆘 Quick Troubleshooting

### Common Issues & Solutions

**Login Issues:**
```
Problem: Can't log in
Solution: Check email/password, clear cache, reset password
```

**Resume Upload Issues:**
```
Problem: Resume not uploading
Solution: Check file format (PDF/DOCX only), max 5MB
```

**Application Issues:**
```
Problem: Can't apply to jobs
Solution: Ensure resume uploaded, profile complete, sufficient coins
```

**Match Score Issues:**
```
Problem: Low match scores
Solution: Update skills in profile, complete all sections
```

**Coin Issues:**
```
Problem: Coins not credited
Solution: Check transaction history, verify action completed
```

---

## 📞 Support & Help

### Getting Help
```
1. Check this Quick Reference Guide
2. Review Complete Flow Diagrams
3. Visit Help Center (in app)
4. Contact Support via email
5. Join community forums
```

### Support Channels
```
📧 Email: support@aksharjobs.com
💬 In-app Chat: Available 9 AM - 6 PM
📱 Phone: +1-XXX-XXX-XXXX
🌐 Help Center: /help
```

---

## ✅ Summary

### Platform Highlights
- **2 Main User Roles** (Job Seekers & Recruiters)
- **50+ Features** across both roles
- **10 Communities** for targeted matching
- **AI-Powered Matching** (75% accuracy)
- **Real-time Tracking** (30s updates)
- **Coin Economy** (earn & redeem)
- **Referral System** (both earn ₳5)
- **Mobile Responsive** (all devices)

### Key Metrics
- **Sign Up Time:** 5-8 minutes
- **Time to First Application:** ~10 minutes
- **Time to First Job Post:** ~15 minutes
- **Average Match Accuracy:** 75%
- **Starting Coins:** ₳10
- **Real-time Update Frequency:** 30 seconds

---

**Document Version:** 1.0
**Last Updated:** October 5, 2025
**Platform:** AksharJobs
**Purpose:** Quick Reference for Role Flows & Features

**Related Documents:**
- COMPLETE_ROLE_FLOW_DIAGRAMS.md (Detailed flows)
- Website_Architecture_Map.md (Technical architecture)
- README.md (Project overview)


