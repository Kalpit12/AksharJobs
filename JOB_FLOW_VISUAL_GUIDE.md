# 🎨 Complete Job Flow - Visual Guide

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        COMPLETE JOB FLOW DIAGRAM                         │
│                         AksharJobs Platform                              │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: JOB CREATION (Recruiter Side)                                   │
└──────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │  Recruiter  │
    │   Logs In   │
    └──────┬──────┘
           │
           ▼
    ┌─────────────────┐
    │  Dashboard      │◄──────── Check: Free job posts > 0
    │  "Post Job"     │          Or Premium subscription
    └──────┬──────────┘
           │
           ▼
    ┌──────────────────────────────────┐
    │  Job Posting Form                │
    │  ────────────────────            │
    │  • Job Title                     │
    │  • Company Name                  │
    │  • Location                      │
    │  • Job Type (Full-time, etc.)    │
    │  • Salary Range                  │
    │  • Required Skills (list)        │
    │  • Responsibilities (list)       │
    │  • Requirements                  │
    │  • Education Required            │
    │  • Benefits                      │
    │  • Company Culture               │
    │  • Application Deadline          │
    │  • Community Targeting           │
    └───────────┬──────────────────────┘
                │
                ▼
    ┌─────────────────────┐
    │  Validation         │
    │  • Required fields  │
    │  • Format check     │
    │  • Credit check     │
    └──────┬──────────────┘
           │
           ▼
    ┌──────────────────────────┐
    │  POST /api/jobs/add_job  │
    └──────┬───────────────────┘
           │
           ▼
    ┌──────────────────────────┐
    │  Database Insert         │
    │  • jobs collection       │
    │  • Link to recruiter_id  │
    │  • Set created_at        │
    │  • Initialize views: 0   │
    │  • Initialize applicants │
    └──────┬───────────────────┘
           │
           ▼
    ┌──────────────────────────┐
    │  Consume Credit          │
    │  free_job_posts -= 1     │
    └──────┬───────────────────┘
           │
           ▼
    ┌──────────────────────────┐
    │  ✅ Job Posted!          │
    │  Job ID: xxxxx           │
    └──────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: JOB PUBLICATION (Multiple Display Locations)                    │
└──────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │   Job Posted     │
                    │   in Database    │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
    ┌──────────────────┐      ┌──────────────────┐
    │ Recruiter View   │      │  Public View     │
    └─────────┬────────┘      └────────┬─────────┘
              │                        │
    ┌─────────┴─────────┐    ┌─────────┴──────────┐
    │                   │    │                    │
    ▼                   ▼    ▼                    ▼
┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌──────────────┐
│Recruiter │  │ Application  │  │All Jobs  │  │Job Seeker    │
│Dashboard │  │   Tracker    │  │  Page    │  │  Dashboard   │
│          │  │  (Recruiter) │  │          │  │              │
│"My Jobs" │  │              │  │(Public)  │  │"Recommended" │
└──────────┘  └──────────────┘  └──────────┘  └──────────────┘

Display Information:
┌────────────────────────────────────────┐
│  JOB CARD                              │
│  ────────                              │
│  📋 Full Stack Developer               │
│  🏢 Test Tech Solutions                │
│  📍 Nairobi, Kenya                     │
│  💼 Full-time • Mid-Level              │
│  💰 KES 150K - 250K/month              │
│  ────────────────────────────          │
│  Skills: Python, JS, React, Node...    │
│  ────────────────────────────          │
│  [View Details] [Apply Now]            │
└────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: JOB DISCOVERY & APPLICATION (Job Seeker Side)                   │
└──────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │ Job Seeker  │
    │  Logs In    │
    └──────┬──────┘
           │
           ▼
    ┌────────────────────┐
    │  Browse Jobs       │
    │  • All Jobs        │
    │  • Recommended     │
    │  • Search/Filter   │
    │  • By Community    │
    └──────┬─────────────┘
           │
           ▼
    ┌────────────────────────────────┐
    │  Click Job Card                │
    │  GET /api/jobs/get_job/:id     │
    └──────┬─────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────────┐
    │  Job Details Modal/Page              │
    │  ──────────────────                  │
    │  📋 Complete Job Information         │
    │  🛠️  Required Skills                 │
    │  📋 Responsibilities                 │
    │  💡 AI Improvement Suggestions       │
    │  📚 Additional Requirements          │
    │  🎁 Benefits & Perks                 │
    │  🏢 Company Culture                  │
    │  📝 Application Process              │
    │  ──────────────────                  │
    │  🎯 YOUR MATCH SCORE: 75.5%          │
    │  ──────────────────                  │
    │  [Apply for this Job]                │
    └───────────┬──────────────────────────┘
                │
                ▼
    ┌────────────────────────────┐
    │  Application Form          │
    │  ──────────────            │
    │  Cover Letter: (optional)  │
    │  ┌──────────────────────┐  │
    │  │ I am excited to...   │  │
    │  │                      │  │
    │  └──────────────────────┘  │
    │  [Submit Application]      │
    └───────────┬────────────────┘
                │
                ▼
    ┌───────────────────────────┐
    │  Check for Duplicates     │
    │  Query: job_id +          │
    │         applicant_id      │
    └───────┬───────────────────┘
            │
            ▼
    ┌───────────────────────────────────┐
    │  POST /api/application/apply      │
    │  ────────────────────────          │
    │  • job_id                         │
    │  • applicant_id (from JWT)        │
    │  • cover_letter                   │
    │  • applicant_name                 │
    │  • applicant_email                │
    │  • status: "pending"              │
    │  • applied_at: NOW()              │
    └───────┬───────────────────────────┘
            │
            ▼
    ┌───────────────────────────────────┐
    │  Calculate Match Score (AI)       │
    │  ────────────────────              │
    │  • Skill matching: 70%            │
    │  • Education matching: 80%        │
    │  • Experience matching: 76%       │
    │  • Final score: 75.5%             │
    └───────┬───────────────────────────┘
            │
            ▼
    ┌───────────────────────────────────┐
    │  Database Operations              │
    │  ────────────────────              │
    │  1. Insert into applications      │
    │  2. Update job.applicants array   │
    │  3. Send confirmation email       │
    └───────┬───────────────────────────┘
            │
            ▼
    ┌───────────────────────────────────┐
    │  ✅ Application Submitted!         │
    │  ────────────────────              │
    │  • Application ID: xxxxx          │
    │  • Status: Pending                │
    │  • Match Score: 75.5%             │
    │  • Email sent ✉️                  │
    └───────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 4: APPLICATION TRACKING (Dual View System)                         │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────┐  ┌─────────────────────────────────┐
│  JOB SEEKER VIEW                │  │  RECRUITER VIEW                 │
│  ─────────────────              │  │  ─────────────────              │
│  Application Tracker            │  │  Candidate Management           │
└─────────────────────────────────┘  └─────────────────────────────────┘
            │                                      │
            ▼                                      ▼
┌──────────────────────────┐        ┌──────────────────────────────┐
│ GET /api/tracker/        │        │ GET /api/tracker/            │
│     job-seeker/          │        │     recruiter/               │
│     applications         │        │     candidates               │
└───────┬──────────────────┘        └──────┬───────────────────────┘
        │                                   │
        ▼                                   ▼
┌──────────────────────────────┐   ┌───────────────────────────────┐
│ MY APPLICATIONS              │   │ CANDIDATE LIST                │
│ ──────────────               │   │ ──────────────                │
│ 1. Full Stack Developer      │   │ Application for:              │
│    Test Tech Solutions       │   │ Full Stack Developer          │
│    ─────────────             │   │ ─────────────                 │
│    Status: ⏳ Pending         │   │ Test JobSeeker                │
│    Applied: Oct 20, 2025     │   │ test_jobseeker@email.com      │
│    Match Score: 75.5%        │   │ ─────────────                 │
│    ─────────────             │   │ Status: Pending               │
│    [View Details]            │   │ Match Score: 75.5%            │
│    [Withdraw]                │   │ Applied: Oct 20, 2025         │
│                              │   │ ─────────────                 │
│ STATISTICS                   │   │ [View Profile]                │
│ ──────────                   │   │ [Update Status] ▼             │
│ Total Applications: 1        │   │   • Pending                   │
│ Pending: 1                   │   │   • Reviewing                 │
│ Interviews: 0                │   │   • Shortlisted               │
│ Offers: 0                    │   │   • Interview                 │
│                              │   │   • Hired                     │
│ [Refresh] (30s auto)         │   │   • Rejected                  │
└──────────────────────────────┘   └───────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 5: STATUS MANAGEMENT & PROGRESSION                                 │
└──────────────────────────────────────────────────────────────────────────┘

    ┌────────────────────┐
    │  Recruiter Reviews │
    │    Application     │
    └──────┬─────────────┘
           │
           ▼
    ┌────────────────────────────────┐
    │  Select New Status             │
    │  ────────────────              │
    │  Current: Pending              │
    │  ────────────────              │
    │  Change to:                    │
    │  ( ) Pending                   │
    │  (•) Reviewing  ◄── Selected   │
    │  ( ) Shortlisted               │
    │  ( ) Interview                 │
    │  ( ) Hired                     │
    │  ( ) Rejected                  │
    │  ────────────────              │
    │  Notes: (optional)             │
    │  [Update Status]               │
    └────────┬───────────────────────┘
             │
             ▼
    ┌────────────────────────────────┐
    │  POST /api/tracker/            │
    │       update-status            │
    │  ────────────────              │
    │  • user_id                     │
    │  • job_id                      │
    │  • status: "reviewing"         │
    │  • notes                       │
    │  • updated_at: NOW()           │
    └────────┬───────────────────────┘
             │
             ▼
    ┌────────────────────────────────┐
    │  Update Database               │
    │  ────────────────              │
    │  applications.update_one()     │
    │  • status = "reviewing"        │
    │  • updated_at = timestamp      │
    │  • Add to history array        │
    └────────┬───────────────────────┘
             │
             ▼
    ┌────────────────────────────────┐
    │  Send Email Notification       │
    │  ────────────────              │
    │  To: Applicant                 │
    │  Subject: Application Update   │
    │  Body: Status changed to       │
    │        "Under Review"          │
    └────────┬───────────────────────┘
             │
             ▼
    ┌────────────────────────────────┐
    │  Real-time Update              │
    │  ────────────────              │
    │  • Recruiter sees update       │
    │  • Job seeker sees update      │
    │    (on next refresh/30s poll)  │
    └────────────────────────────────┘

STATUS PROGRESSION TIMELINE:
════════════════════════════

Day 1    Day 3      Day 7         Day 10       Day 15
  │        │          │             │            │
  ▼        ▼          ▼             ▼            ▼
┌────┐  ┌────────┐ ┌──────────┐  ┌────────┐  ┌──────┐
│Pend│→ │Reviewing│→│Shortlist│→ │Interview│→ │ Hired│
│ing │  │         │ │  ed     │  │         │  │      │
└────┘  └────────┘ └──────────┘  └────────┘  └──────┘
          │                                      │
          └──────────────────────────────────────┘
                         │
                         ▼
                    ┌─────────┐
                    │Rejected │
                    └─────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 6: NOTIFICATIONS & COMMUNICATION                                   │
└──────────────────────────────────────────────────────────────────────────┘

Email Notification Flow:
─────────────────────────

    ┌──────────────────┐
    │  Status Change   │
    │    Triggered     │
    └────────┬─────────┘
             │
             ▼
    ┌─────────────────────────────┐
    │  Email Service Called        │
    │  ─────────────────           │
    │  send_application_status_    │
    │  notification()              │
    └────────┬────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────┐
    │  Compose Email                      │
    │  ──────────────                     │
    │  From: noreply@aksharjobs.com       │
    │  To: applicant@email.com            │
    │  Subject: Application Update        │
    │  ──────────────                     │
    │  Template:                          │
    │  • Professional HTML design         │
    │  • Job details                      │
    │  • Status update                    │
    │  • Next steps                       │
    │  • Company branding                 │
    └────────┬────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────┐
    │  SMTP Send                   │
    │  ──────────                  │
    │  Gmail SMTP / SendGrid       │
    │  Async (non-blocking)        │
    └────────┬────────────────────┘
             │
             ▼
    ┌─────────────────────────────┐
    │  ✉️  Email Delivered         │
    │  ──────────                  │
    │  Log result                  │
    │  Track delivery status       │
    └──────────────────────────────┘

Email Types:
────────────
1. 📩 Application Submitted
2. 👀 Application Under Review
3. ⭐ Shortlisted
4. 📅 Interview Scheduled (with date/time)
5. 🎉 Offer Extended
6. 😔 Application Not Successful

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 7: ANALYTICS & INSIGHTS                                            │
└──────────────────────────────────────────────────────────────────────────┘

Match Score Breakdown:
──────────────────────

    ┌──────────────────────────────┐
    │  AI Match Score Engine       │
    └────────┬─────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────┐      ┌─────────────┐
│Job Seeker│      │   Job       │
│ Profile  │      │Requirements │
└────┬────┘      └──────┬──────┘
     │                  │
     └────────┬─────────┘
              │
              ▼
    ┌─────────────────────────┐
    │  Analysis Components    │
    ├─────────────────────────┤
    │  1. Skills Match        │
    │     • Technical skills  │
    │     • Soft skills       │
    │     Score: 70%          │
    │                         │
    │  2. Education Match     │
    │     • Degree level      │
    │     • Field of study    │
    │     Score: 80%          │
    │                         │
    │  3. Experience Match    │
    │     • Years of exp      │
    │     • Relevance         │
    │     Score: 76%          │
    └────────┬────────────────┘
             │
             ▼
    ┌─────────────────────────┐
    │  Weighted Average       │
    │  ─────────────          │
    │  Skills:    70% × 0.4   │
    │  Education: 80% × 0.3   │
    │  Experience:76% × 0.3   │
    │  ─────────────          │
    │  FINAL: 75.5%           │
    └─────────────────────────┘

Application Statistics:
───────────────────────

Job Seeker Dashboard:
┌────────────────────────┐
│  MY APPLICATION STATS  │
├────────────────────────┤
│  Total Applied:     12 │
│  Pending:            3 │
│  Under Review:       2 │
│  Shortlisted:        1 │
│  Interviews:         2 │
│  Offers:             1 │
│  Rejected:           3 │
│  ────────────────────  │
│  Success Rate:   16.7% │
│  Avg Match Score:  78% │
└────────────────────────┘

Recruiter Dashboard:
┌────────────────────────┐
│  JOB POSTING STATS     │
├────────────────────────┤
│  Active Jobs:        5 │
│  Total Views:      234 │
│  Applications:      47 │
│  ────────────────────  │
│  This Month:         8 │
│  Hired:              2 │
│  In Process:        12 │
└────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ DATA FLOW SUMMARY                                                        │
└──────────────────────────────────────────────────────────────────────────┘

Collections in MongoDB:
───────────────────────

1. users
   ├─ _id: ObjectId
   ├─ userType: "recruiter" | "job_seeker"
   ├─ email, firstName, lastName
   ├─ free_job_posts (recruiter)
   ├─ free_applications (job_seeker)
   └─ skills, education, experience (job_seeker)

2. jobs
   ├─ _id: ObjectId
   ├─ recruiter_id: ObjectId (ref: users)
   ├─ job_title, company_name, location
   ├─ job_type, salary_range
   ├─ required_skills, responsibilities
   ├─ benefits, requirements
   ├─ applicants: [ObjectId]
   ├─ views: Number
   └─ created_at: DateTime

3. applications
   ├─ _id: ObjectId
   ├─ job_id: ObjectId (ref: jobs)
   ├─ applicant_id: ObjectId (ref: users)
   ├─ applicant_name, applicant_email
   ├─ job_title, company_name
   ├─ status: "pending" | "reviewing" | ...
   ├─ cover_letter: String
   ├─ final_score, skill_score, education_score
   ├─ applied_at, updated_at
   └─ interview_date, interview_mode (if applicable)

API Flow:
─────────

Jobs:
  POST   /api/jobs/add_job           Create new job
  GET    /api/jobs/get_jobs          List all jobs
  GET    /api/jobs/get_job/:id       Get specific job
  GET    /api/jobs/recruiter         Get recruiter's jobs

Applications:
  POST   /api/application/apply      Submit application
  GET    /api/application/my-applications    Get user's apps
  PUT    /api/application/update_status      Update status

Tracking:
  GET    /api/tracker/job-seeker/applications   Job seeker view
  GET    /api/tracker/recruiter/candidates      Recruiter view
  POST   /api/tracker/update-status             Update with notification
  GET    /api/tracker/statistics                Get stats

Authentication Flow:
  POST   /api/auth/login             Login
  POST   /api/auth/register          Register
  POST   /api/auth/verify-email      Email verification
  GET    /api/auth/me                Get current user (JWT)

┌──────────────────────────────────────────────────────────────────────────┐
│ REAL-TIME FEATURES                                                       │
└──────────────────────────────────────────────────────────────────────────┘

Polling Mechanism:
──────────────────

    Job Seeker Tracker                     Recruiter Tracker
    ──────────────────                     ─────────────────
           │                                      │
           ▼                                      ▼
    Every 30 seconds                       Every 30 seconds
           │                                      │
           ▼                                      ▼
    GET /api/tracker/                      GET /api/tracker/
        job-seeker/applications                recruiter/candidates
           │                                      │
           ▼                                      ▼
    Update UI with new data                Update UI with new data
    • New applications                     • New applications
    • Status changes                       • Status changes
    • Match scores                         • Application counts

Instant Updates:
────────────────
• Job posting → Immediate visibility
• Application submission → Instant confirmation
• Status changes → Real-time email + UI update
• Match score calculation → Automatic on apply

┌──────────────────────────────────────────────────────────────────────────┐
│ SYSTEM ARCHITECTURE                                                      │
└──────────────────────────────────────────────────────────────────────────┘

Frontend (React - Port 3003)
    ├─ Pages
    │  ├─ PostJob.jsx
    │  ├─ AllJobs.jsx
    │  ├─ PublicJobs.jsx
    │  ├─ JobSeekerDashboard.jsx
    │  ├─ RecruiterDashboard.jsx
    │  ├─ JobSeekerApplicationTracker.jsx
    │  └─ RecruiterTracker.jsx
    │
    ├─ Components
    │  ├─ JobDisplay.jsx
    │  ├─ JobCreationForm.jsx
    │  ├─ ApplicationCard.jsx
    │  └─ StatusUpdater.jsx
    │
    └─ API Clients
       ├─ jobApi.js
       ├─ applicationApi.js
       └─ authApi.js

Backend (Flask - Port 3002)
    ├─ Routes
    │  ├─ job_routes.py
    │  ├─ application_routes.py
    │  ├─ application_tracker_routes.py
    │  └─ auth_routes.py
    │
    ├─ Services
    │  ├─ job_service.py
    │  ├─ application_service.py
    │  ├─ application_tracking_service.py
    │  ├─ email_notification_service.py
    │  └─ match_score_service.py
    │
    ├─ Models
    │  ├─ job_model.py
    │  ├─ application_model.py
    │  └─ user_model.py
    │
    └─ Utils
       ├─ db.py
       └─ jwt_utils.py

Database (MongoDB - Port 27017)
    └─ TalentMatchDB
       ├─ users
       ├─ jobs
       ├─ applications
       └─ tracking_history

┌──────────────────────────────────────────────────────────────────────────┐
│ END OF VISUAL GUIDE                                                      │
└──────────────────────────────────────────────────────────────────────────┘

This visual guide illustrates the complete job flow from creation to tracking,
showing all interactions, data flows, and system components in the AksharJobs
platform.

For detailed test results, see: COMPLETE_JOB_FLOW_TEST_RESULTS.md

