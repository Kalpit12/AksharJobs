# 🧪 AksharJobs Testing Guide
## Manual Testing Instructions for Launch

---

## 🎯 **PRIORITY 1: CRITICAL USER FLOWS**

### Test 1: Homepage & Public Access
**Time Required**: ~10 minutes

```
1. Open homepage (http://localhost:3003/)
   ✓ Page loads without errors
   ✓ Featured jobs display
   ✓ Statistics show correct numbers
   ✓ Search bar is visible

2. Test Search
   ✓ Enter a job title, click search
   ✓ Verify redirect to job listings

3. Test Categories
   ✓ Click any category card
   ✓ Verify redirect with filter applied

4. Test Companies Link
   ✓ Click "Companies" in navigation
   ✓ Verify companies page loads
   ✓ Verify company cards display
   ✓ Test search and filters

5. Test Registration Buttons
   ✓ Click "GET STARTED"
   ✓ Verify signup page loads
   ✓ Click "SIGN IN"
   ✓ Verify login page loads
```

---

### Test 2: User Registration (Job Seeker)
**Time Required**: ~5 minutes

```
1. Navigate to /signup
2. Select "Job Seeker" role
3. Fill out form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: Test123!@#
4. Submit form
   ✓ No errors displayed
   ✓ Redirects to email verification or dashboard
   ✓ User data saved in database

5. Try logging out and back in
   ✓ Login works with same credentials
```

---

### Test 3: User Registration (Recruiter)
**Time Required**: ~5 minutes

```
1. Navigate to /signup
2. Select "Recruiter" role
3. Fill out form with test data
4. Submit form
   ✓ No errors displayed
   ✓ Redirects to recruiter registration form
   ✓ Complete profile form
   ✓ Verify saves successfully
```

---

### Test 4: Job Seeker Dashboard
**Time Required**: ~15 minutes

```
1. Login as job seeker
2. Verify dashboard loads
   ✓ User name displays correctly
   ✓ Profile photo shows (if uploaded)
   ✓ Navigation sidebar works

3. Test Job Search
   ✓ Search by title
   ✓ Search by location
   ✓ Apply filters (job type, experience, etc.)
   ✓ View job details
   ✓ Save a job
   ✓ Verify saved jobs appear in "Saved Jobs"

4. Test Application Flow
   ✓ Click "Apply Now" on a job
   ✓ Fill application form
   ✓ Upload resume (test small PDF/DOC)
   ✓ Submit application
   ✓ Verify application appears in "My Applications"

5. Test Profile
   ✓ Click "My Profile"
   ✓ Edit profile information
   ✓ Upload profile photo
   ✓ Save changes
   ✓ Verify changes persist after refresh
```

---

### Test 5: Recruiter Dashboard
**Time Required**: ~20 minutes

```
1. Login as recruiter
2. Verify dashboard loads
   ✓ Statistics display correctly
   ✓ Recent applications show
   ✓ Quick actions work

3. Test Job Posting
   ✓ Click "Post New Job"
   ✓ Fill all required fields
   ✓ Add skills (comma-separated)
   ✓ Submit form
   ✓ Verify job appears in "Job Postings"

4. Test Internship Posting
   ✓ Click "Post Internship"
   ✓ Fill form
   ✓ Submit
   ✓ Verify appears in "Internships"

5. Test Job Management
   ✓ View posted jobs
   ✓ Click "View" on a job
   ✓ Click "Edit" on a job
   ✓ Modify job details
   ✓ Save changes
   ✓ Verify changes saved

6. Test Candidate Tracker
   ✓ Navigate to "Candidate Tracker"
   ✓ View applications
   ✓ Filter by status
   ✓ Click "View Details" on application
   ✓ Update application status
   ✓ Verify status updates

7. Test Messages
   ✓ Navigate to "Messages"
   ✓ Verify messages load (if any)

8. Test Settings
   ✓ Navigate to "Settings"
   ✓ Update profile
   ✓ Update company information
   ✓ Change notification settings
   ✓ Save changes
   ✓ Verify changes persist
```

---

## 🎯 **PRIORITY 2: ERROR SCENARIOS**

### Test 6: Invalid Inputs
**Time Required**: ~10 minutes

```
1. Test Invalid Email
   - Try registering with: "notanemail"
   ✓ Error message displays

2. Test Short Password
   - Try password: "123"
   ✓ Error message displays

3. Test Missing Required Fields
   - Submit forms with empty required fields
   ✓ Validation messages display

4. Test Invalid Job ID
   - Try accessing: /job-details/invalid-id
   ✓ Error page or redirect occurs

5. Test Invalid ObjectId
   - Try API: /api/jobs/get_job/invalid-id
   ✓ Returns 400 Bad Request error
```

---

### Test 7: Authentication & Authorization
**Time Required**: ~10 minutes

```
1. Test Unauthorized Access
   - Logout
   - Try accessing: /jobseeker-dashboard
   ✓ Redirects to login page

2. Test Role-Based Access
   - Login as job seeker
   - Try accessing: /recruiter-dashboard
   ✓ Access denied or redirect

3. Test Token Expiration
   - Clear localStorage token
   - Try accessing protected page
   ✓ Redirects to login

4. Test Invalid Token
   - Set invalid token in localStorage
   - Try accessing protected page
   ✓ Redirects to login or shows error
```

---

### Test 8: Network Errors
**Time Required**: ~5 minutes

```
1. Test API Failure
   - Turn off backend server
   - Try loading job listings
   ✓ Error message displays
   ✓ User-friendly message shown
   ✓ No page crash

2. Test Slow Network
   - Use browser DevTools to throttle network
   ✓ Loading spinners show
   ✓ Page remains responsive
   ✓ Eventually loads or shows error
```

---

## 🎯 **PRIORITY 3: CROSS-BROWSER TESTING**

### Test 9: Browser Compatibility
**Time Required**: ~30 minutes

```
For Each Browser (Chrome, Firefox, Safari, Edge):

1. Homepage
   ✓ Loads correctly
   ✓ Styling looks good
   ✓ Animations work

2. Login/Signup
   ✓ Forms work
   ✓ Validation works
   ✓ Can authenticate

3. Dashboard
   ✓ Layout looks correct
   ✓ All features work
   ✓ Navigation smooth

4. Mobile View
   ✓ Responsive design works
   ✓ Navigation menu works
   ✓ Forms usable on mobile
```

---

## 🎯 **PRIORITY 4: PERFORMANCE TESTING**

### Test 10: Load Times
**Time Required**: ~15 minutes

```
Use Browser DevTools > Network Tab

1. Homepage
   ✓ Total load < 2 seconds
   ✓ No blocking requests

2. Dashboard
   ✓ Initial load < 3 seconds
   ✓ Subsequent loads faster

3. Job Listings
   ✓ Load < 2 seconds
   ✓ Scrolling smooth

4. Large Datasets
   - Create 100+ jobs (test data)
   ✓ Pagination works
   ✓ Search remains fast
   ✓ No performance degradation
```

---

## 🐛 **BUG REPORTING TEMPLATE**

When you find a bug, document it like this:

```
**Bug Title**: [Short description]

**Priority**: Critical / High / Medium / Low

**Steps to Reproduce**:
1. Go to...
2. Click on...
3. Enter...
4. Click...

**Expected Result**:
[What should happen]

**Actual Result**:
[What actually happened]

**Environment**:
- Browser: Chrome 118
- OS: Windows 10
- Screen: 1920x1080
- User Role: Job Seeker

**Console Errors**: (if any)
[Copy from browser console]

**Screenshots**: (if applicable)
[Attach screenshots]
```

---

## ✅ **TESTING CHECKLIST**

### Before Testing
- [ ] Backend server running
- [ ] Frontend server running (port 3003)
- [ ] Database connected
- [ ] Test user accounts created
- [ ] Browser console open (F12)

### During Testing
- [ ] Check browser console for errors
- [ ] Test on different screen sizes
- [ ] Test with and without data
- [ ] Test happy path and error paths
- [ ] Document all bugs found

### After Testing
- [ ] Compile bug report
- [ ] Prioritize issues
- [ ] Verify critical fixes
- [ ] Re-test fixed bugs
- [ ] Sign off when all critical bugs fixed

---

## 🚨 **CRITICAL ISSUES - BLOCK LAUNCH**

These issues MUST be fixed before launch:

- ❌ Page completely crashes (white screen)
- ❌ Cannot register new users
- ❌ Cannot login
- ❌ Cannot post jobs (recruiters)
- ❌ Cannot apply to jobs (job seekers)
- ❌ Data loss (user data not saved)
- ❌ Security vulnerabilities (exposed credentials, etc.)
- ❌ Payment system broken (if applicable)

---

## ⚠️ **HIGH PRIORITY - FIX BEFORE LAUNCH**

Should be fixed but won't block launch:

- ⚠️ Broken navigation links
- ⚠️ Error messages unclear
- ⚠️ Images not loading
- ⚠️ Search not working properly
- ⚠️ Mobile layout broken
- ⚠️ Slow page loads (> 5 seconds)

---

## 📊 **TEST RESULTS TEMPLATE**

```
# Test Results - [Date]

## Summary
- Tests Executed: X
- Tests Passed: Y
- Tests Failed: Z
- Critical Bugs: N
- High Priority Bugs: M

## Critical Issues
1. [Issue description]
2. [Issue description]

## High Priority Issues
1. [Issue description]
2. [Issue description]

## Medium/Low Priority Issues
1. [Issue description]
2. [Issue description]

## Recommendations
- [Recommendation 1]
- [Recommendation 2]

## Launch Readiness: ✅ GO / ⚠️ CAUTION / ❌ NO-GO
```

---

## 🎉 **FINAL PRE-LAUNCH TEST**

**The "Mom Test"**: Can someone non-technical use the site?

```
1. Ask a non-technical person to:
   - Register for an account
   - Find and apply to a job
   - Update their profile

2. Observe:
   ✓ Can they complete tasks without help?
   ✓ Do they understand error messages?
   ✓ Is the flow intuitive?
   ✓ Do they encounter any bugs?

If they can do it smoothly, you're ready! 🚀
```

---

**Good luck with testing! Remember: It's better to find bugs now than after launch! 🐛🔍**
