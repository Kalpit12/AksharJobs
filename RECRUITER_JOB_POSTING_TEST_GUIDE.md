# 📝 Recruiter Job Posting - Testing Guide

## Overview
This guide provides comprehensive instructions for testing the job posting functionality on the recruiter side.

## 🔧 What Was Fixed

### Backend Improvements
1. **Flexible Data Format Support**
   - Now accepts both old format (camelCase: `jobTitle`, `companyName`, etc.)
   - And new format (snake_case: `title`, `company`, etc.)
   - Automatic data mapping between formats

2. **JWT Authentication**
   - Added `@jwt_required(optional=True)` decorator
   - Automatically extracts recruiter ID from JWT token
   - Falls back to `recruiter_id` in request data if no JWT

3. **Better Logging**
   - Added detailed console logging for debugging
   - Shows recruiter ID, free job posts, and data received
   - Helps track down issues quickly

4. **Enhanced Salary Handling**
   - Supports both `salaryRange` string
   - And separate `salary_min`, `salary_max`, `salary_currency`, `salary_period`
   - Automatically constructs salary range from components

5. **Skills Format Support**
   - Accepts skills as comma-separated string
   - Or as array of strings
   - Automatically converts arrays to strings

## 📁 Files Modified

### Backend
- `backend/routes/job_routes.py` - Updated `/add_job` endpoint
  - Added flexible data format support
  - Enhanced error handling
  - Better logging

### Test Scripts Created
- `backend/test_job_posting.py` - Automated test script
- `backend/setup_test_recruiter_for_posting.py` - Setup script

## 🚀 Quick Start - Testing Job Posting

### Step 1: Setup Test Recruiter

```bash
cd backend
python setup_test_recruiter_for_posting.py
```

This will create/update a test recruiter with:
- **Email**: recruiter@test.com
- **Password**: Test123!@#
- **Free Job Posts**: 10
- **Company**: Test Company Inc

### Step 2: Make Sure Backend is Running

```bash
cd backend
python app.py
```

Backend should be running on `http://localhost:3002`

### Step 3: Run Automated Tests

```bash
cd backend
python test_job_posting.py
```

This will:
1. Login as the test recruiter
2. Test job posting with old format (camelCase)
3. Test job posting with new format (snake_case)
4. Fetch and display created jobs
5. Show test summary

## 🧪 Manual Testing via Frontend

### Test via NewPostJob Page

1. **Login as Recruiter**
   ```
   Email: recruiter@test.com
   Password: Test123!@#
   ```

2. **Navigate to Post Job**
   - Go to: `http://localhost:3000/post-job`
   - Or click "Post Job" from recruiter dashboard

3. **Fill in Job Details**
   - Job Title: "Senior Software Engineer"
   - Company Name: (auto-filled from profile)
   - Location: "San Francisco, CA"
   - Job Type: Full-time
   - Work Mode: Remote/Hybrid/On-site
   - Experience Level: Mid-Level/Senior/Junior
   - Salary Range:
     - Min: 100000
     - Max: 150000
     - Currency: USD
     - Period: yearly
   - Description: "We are hiring..."
   - Responsibilities: "Lead development..."
   - Requirements: "5+ years experience..."
   - Skills: "Python, JavaScript, React"
   - Benefits: "Health insurance, 401k..."
   - Application Deadline: (select future date)

4. **Submit**
   - Click "Post Job" button
   - Should see success message
   - Redirect to recruiter dashboard
   - Job should appear in posted jobs list

### Test via JobDescription Page (Old Format)

1. **Navigate to**: `http://localhost:3000/job-description`

2. **Fill in Job Details** (uses old camelCase format)
   - Job Title
   - Company Name
   - Company Website
   - Industry
   - Location
   - Remote Option
   - Job Type
   - Salary Range (as single string)
   - Experience
   - Skills (comma-separated)
   - Responsibilities
   - Education
   - Deadline
   - Description

3. **Submit and Verify**

## 🔍 Data Format Examples

### Old Format (camelCase)
```json
{
  "recruiter_id": "user_id_here",
  "jobTitle": "Senior Python Developer",
  "companyName": "TechCorp Solutions",
  "companyWebsite": "https://techcorp.com",
  "industry": "Technology",
  "location": "San Francisco, CA",
  "remoteOption": "Hybrid",
  "jobType": "Full-time",
  "salaryRange": "USD 120,000 - 150,000 yearly",
  "experience": "5+ years",
  "skills": "Python, Django, Flask, PostgreSQL",
  "responsibilities": "Lead backend development...",
  "education": "Bachelor's in CS",
  "deadline": "2025-02-15",
  "description": "We are looking for..."
}
```

### New Format (snake_case)
```json
{
  "title": "Full Stack Developer",
  "company": "WebDev Inc",
  "location": "New York, NY",
  "job_type": "Full-time",
  "work_mode": "Remote",
  "experience_level": "Mid-Level",
  "salary_min": "90000",
  "salary_max": "130000",
  "salary_currency": "USD",
  "salary_period": "yearly",
  "description": "Join our team...",
  "responsibilities": "Develop features...",
  "requirements": "3+ years experience...",
  "required_skills": ["JavaScript", "React", "Node.js"],
  "benefits": "Health insurance, 401k...",
  "application_deadline": "2025-03-01",
  "industry": "Technology"
}
```

## ✅ What to Verify

### 1. Job Creation
- [ ] Job is created successfully
- [ ] Job ID is returned
- [ ] Success message displayed
- [ ] Free job post count decremented

### 2. Data Persistence
- [ ] Job appears in database
- [ ] All fields saved correctly
- [ ] Salary range constructed properly
- [ ] Skills converted to correct format
- [ ] Dates saved in correct format

### 3. Job Display
- [ ] Job appears on recruiter dashboard
- [ ] Job appears in job listings
- [ ] All details display correctly
- [ ] Job can be viewed by job seekers
- [ ] Application process works

### 4. Free Job Posts
- [ ] Recruiter with free posts can post
- [ ] Free post count decreases after posting
- [ ] Error shown when no free posts remaining
- [ ] Premium recruiters have unlimited posts

### 5. Form Validation
- [ ] Required fields enforced
- [ ] Date validation works
- [ ] Salary validation works
- [ ] Skills input works (tags/comma-separated)

## 🐛 Common Issues & Solutions

### Issue 1: "No free job posts remaining"
**Solution:**
```bash
# Run setup script to give free posts
python setup_test_recruiter_for_posting.py
```

### Issue 2: Backend not responding
**Solution:**
```bash
# Check backend is running
curl http://localhost:3002/api/jobs/

# Restart backend
cd backend
python app.py
```

### Issue 3: Authentication fails
**Solution:**
1. Clear browser cache and localStorage
2. Login again with test credentials
3. Check JWT token is valid

### Issue 4: Job not appearing
**Solution:**
1. Check browser console for errors
2. Check backend logs
3. Verify database connection
4. Run: `python test_job_posting.py` to debug

### Issue 5: Data format errors
**Solution:**
- The backend now supports both formats
- Check console logs to see data received
- Verify field names match expected format

## 📊 Expected Test Results

### Automated Test Output
```
============================================================
  🧪 JOB POSTING SYSTEM TEST
============================================================

============================================================
  🔐 LOGGING IN AS RECRUITER
============================================================
✅ Status Code: 200
✅ Login successful!
👤 User ID: 507f1f77bcf86cd799439011
🎫 Token: eyJhbGciOiJIUzI1NiIs...

============================================================
  📝 TEST 1: JOB POSTING - OLD FORMAT (camelCase)
============================================================
✅ Status Code: 201
🎉 Job posted successfully!
🆔 Job ID: 507f1f77bcf86cd799439012
💳 Free posts remaining: 9

============================================================
  📝 TEST 2: JOB POSTING - NEW FORMAT (snake_case)
============================================================
✅ Status Code: 201
🎉 Job posted successfully!
🆔 Job ID: 507f1f77bcf86cd799439013
💳 Free posts remaining: 8

============================================================
  📊 TEST SUMMARY
============================================================
Old Format (camelCase): ✅ PASSED
New Format (snake_case): ✅ PASSED

🎉 At least one format works! Job posting is functional.
```

## 🔗 Related Endpoints

### POST `/api/jobs/add_job`
- Creates a new job posting
- Requires authentication (JWT optional)
- Supports both data formats
- Returns job ID and remaining free posts

### GET `/api/jobs`
- Lists all jobs
- Supports filtering
- Returns paginated results

### GET `/api/jobs/{job_id}`
- Gets specific job details
- Returns full job object

### PUT `/api/jobs/update_job/{job_id}`
- Updates existing job
- Requires recruiter ownership

### DELETE `/api/jobs/{job_id}`
- Deletes job posting
- Requires recruiter ownership

## 📝 Database Schema

### Jobs Collection
```javascript
{
  _id: ObjectId,
  recruiter_id: String,
  job_title: String,
  company_name: String,
  company_website: String,
  industry: String,
  location: String,
  remote_option: String,
  work_mode: String,
  job_type: String,
  salary_range: String,
  salary_min: String,
  salary_max: String,
  salary_currency: String,
  salary_period: String,
  experience_required: String,
  experience_level: String,
  required_skills: String,
  responsibilities: String,
  requirements: String,
  education_required: String,
  benefits: String,
  application_deadline: String,
  description: String,
  views: Number,
  applicants: Array,
  target_communities: Array,
  all_communities: Boolean,
  community_requirements: String,
  created_at: DateTime,
  updated_at: DateTime
}
```

## 🎯 Success Criteria

Job posting is working correctly if:
1. ✅ Recruiter can login successfully
2. ✅ Job posting form loads without errors
3. ✅ Form validation works for required fields
4. ✅ Job is created in database
5. ✅ Success message displayed to user
6. ✅ Job appears in recruiter's posted jobs
7. ✅ Job appears in public job listings
8. ✅ Job seekers can view and apply to job
9. ✅ Free job post count decrements correctly
10. ✅ Both old and new data formats work

## 🔐 Security Checks

- [ ] Only authenticated recruiters can post jobs
- [ ] Recruiter can only edit their own jobs
- [ ] JWT tokens validated properly
- [ ] SQL injection prevented (using MongoDB)
- [ ] XSS prevented in job descriptions
- [ ] File uploads validated (if any)
- [ ] Rate limiting in place (if configured)

## 📞 Need Help?

If tests fail or you encounter issues:

1. Check backend logs for errors
2. Run `python test_job_posting.py` for automated testing
3. Verify database connection
4. Check free job post credits
5. Review browser console for frontend errors
6. Check network tab for API responses

## 🎉 Next Steps

After successful testing:
1. Test job editing functionality
2. Test job deletion
3. Test job application process
4. Test recruiter dashboard job display
5. Test job seeker job viewing
6. Test search and filtering
7. Load test with multiple jobs
8. Test premium recruiter features

---

**Last Updated**: January 2025
**Status**: ✅ Ready for Testing
**Version**: 1.0.0

