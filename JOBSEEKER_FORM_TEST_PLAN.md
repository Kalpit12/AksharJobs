# 🧪 Job Seeker Registration Form - Comprehensive Test Plan

## 📋 Test Environment
- **Frontend URL**: http://localhost:3003/complete-profile
- **Backend URL**: http://localhost:3002
- **Database**: MongoDB Atlas (TalentMatchDB)

---

## ✅ Test Cases

### 1. **Form Navigation & Progress Bar** ✨
**Test Steps:**
1. Navigate to http://localhost:3003/complete-profile
2. Verify the progress bar shows 7 steps
3. Click on each step in the progress bar
4. Verify:
   - ✓ Current step is highlighted
   - ✓ Completed steps show checkmarks
   - ✓ Can only click on completed or current steps
   - ✓ Step labels are visible and not cut off

**Expected Result**: Progress bar should be functional and visually appealing

---

### 2. **Section 1: Personal Information** 👤
**Test Steps:**
1. Fill in all required fields:
   - Full Name: "John Doe"
   - Email: "john.doe@example.com" (should be editable)
   - Mobile: "1234567890"
   - Date of Birth: Select any date
   - Gender: Select "Male"
   - Current Location: "New York"
   - Current Address: "123 Main St"
   - PIN Code: "10001"
   - Willing to Relocate: Select "Yes"
   - LinkedIn: "https://linkedin.com/in/johndoe"
   - Portfolio: "https://johndoe.com"
   - GitHub: "https://github.com/johndoe"
2. Upload Profile Photo (optional)
3. Click "Next"

**Expected Result**: 
- ✓ All fields accept input
- ✓ Email field is NOT readonly
- ✓ Validation works for required fields
- ✓ Photo upload preview shows

---

### 3. **Section 2: Education Details** 🎓
**Test Steps:**
1. Fill in education details:
   - Highest Education: "Bachelor's Degree"
   - University Name: Select from dropdown
   - Try selecting "Other - Please specify"
   - Enter custom university name: "Test University"
   - Degree: "B.Tech in Computer Science"
   - Graduation Year: "2023"
   - CGPA: "8.5"
   - Major Subjects: "Data Structures, Algorithms"
2. Click "Next"

**Expected Result**: 
- ✓ University dropdown contains 400+ universities
- ✓ When "Other" is selected, text input appears
- ✓ Custom university name is required when "Other" is selected
- ✓ Validation works correctly

---

### 4. **Section 3: Employment Information** 💼
**Test Steps:**
1. Fill in employment details:
   - Current Employment Status: "Employed"
   - Current Job Title: "Software Engineer"
   - Current Company: "Tech Corp"
   - Work Experience: "2 years"
   - Previous Companies: "Startup Inc, Tech Hub"
   - Salary Expectation: "80000-100000"
2. Click "Next"

**Expected Result**: 
- ✓ All fields accept input
- ✓ Validation works for required fields

---

### 5. **Section 4: Skills & Expertise** 🧠
**Test Steps:**
1. Test multi-select dropdowns:
   - Technical Skills: Select multiple (e.g., "JavaScript", "Python", "React")
   - Soft Skills: Select multiple (e.g., "Communication", "Leadership")
   - Languages Known: Select multiple (e.g., "English", "Spanish", "Hindi")
   - Certifications: Enter text
2. Verify:
   - ✓ Can open/close dropdown
   - ✓ Can select multiple items
   - ✓ Selected items show checkmarks
   - ✓ Can deselect items
   - ✓ Selected count shows (e.g., "3 selected")
   - ✓ Dropdown closes when clicking outside
3. Click "Next"

**Expected Result**: Multi-select dropdowns work smoothly

---

### 6. **Section 5: Job Preferences** 🎯
**Test Steps:**
1. Test multi-select for job preferences:
   - Job Type: Select multiple (e.g., "Full-time", "Contract")
   - Preferred Industry: Select multiple (e.g., "Technology", "Finance")
   - Preferred Cities: Select multiple (e.g., "New York", "San Francisco")
   - Work Mode: Select "Remote"
   - Notice Period: "30 days"
2. Click "Next"

**Expected Result**: All dropdowns and inputs work correctly

---

### 7. **Section 6: Career Goals** 🚀
**Test Steps:**
1. Fill in career goals:
   - Career Objectives: "Become a senior developer"
   - Short Term Goals: "Master React and Node.js"
   - Long Term Goals: "Lead a tech team"
2. Click "Next"

**Expected Result**: All text areas accept input

---

### 8. **Section 7: Additional Information** ℹ️
**Test Steps:**
1. Fill in additional info:
   - Achievements: "Won hackathon 2023"
   - Hobbies: "Photography, Hiking"
   - Additional Info: "Open to learning new technologies"
2. Upload Resume (optional)
3. Click "Submit Profile"

**Expected Result**: Form submits successfully

---

### 9. **Form State Persistence** 💾
**Test Steps:**
1. Fill in Section 1 with some data
2. Refresh the page (F5)
3. Verify:
   - ✓ Form loads on the same section
   - ✓ Previously entered data is preserved
   - ✓ Selected options in dropdowns are preserved
4. Navigate to Section 3
5. Refresh the page
6. Verify you're still on Section 3 with data intact

**Expected Result**: Form state persists across page reloads

---

### 10. **Form Validation** ✅
**Test Steps:**
1. Try to click "Next" without filling required fields
2. Verify:
   - ✓ Error messages appear below fields
   - ✓ Fields are highlighted in red
   - ✓ Cannot proceed to next step
3. Fill in required fields
4. Verify:
   - ✓ Error messages disappear
   - ✓ Can proceed to next step

**Expected Result**: Validation prevents proceeding with incomplete data

---

### 11. **Form Submission** 🎉
**Test Steps:**
1. Complete all 7 sections with valid data
2. Click "Submit Profile"
3. Verify:
   - ✓ Loading spinner appears
   - ✓ Success message shows
   - ✓ Redirects to success page
   - ✓ Form data is saved to database
4. Check backend logs for successful save

**Expected Result**: 
- Form submits without errors
- Redirects to `/jobseeker-registration-success`
- Data is saved to MongoDB

---

### 12. **Backend Integration** 🔌
**Test Steps:**
1. Open browser console (F12)
2. Submit the form
3. Check Network tab:
   - ✓ POST request to `/api/jobseeker/complete-profile`
   - ✓ Status: 200 OK
   - ✓ Response contains success message
4. Check backend terminal:
   - ✓ No errors
   - ✓ Shows "Profile updated successfully"

**Expected Result**: No console errors, successful API call

---

### 13. **Data Verification** 🔍
**Test Steps:**
1. After successful submission, navigate to Contact Me page
2. Verify all filled data is displayed:
   - ✓ Personal information
   - ✓ Education details
   - ✓ Employment information
   - ✓ Skills (technical, soft, languages)
   - ✓ Job preferences
   - ✓ Career goals
   - ✓ Additional information

**Expected Result**: All data reflects accurately on Contact Me page

---

### 14. **Responsive Design** 📱
**Test Steps:**
1. Open browser DevTools
2. Switch to mobile view (375px width)
3. Navigate through all sections
4. Verify:
   - ✓ Form is readable on mobile
   - ✓ Progress bar adapts to small screens
   - ✓ Buttons are accessible
   - ✓ Dropdowns work on mobile

**Expected Result**: Form is fully responsive

---

### 15. **Edge Cases** ⚠️
**Test Steps:**
1. Try entering very long text (1000+ characters) in text areas
2. Try selecting all options in multi-select
3. Try uploading very large files (>10MB)
4. Try uploading non-image files as profile photo
5. Try entering invalid email format
6. Try entering non-numeric characters in phone number

**Expected Result**: Form handles edge cases gracefully

---

## 🐛 Known Issues to Test

1. **Email Field**: Was previously readonly - now should be editable ✅
2. **useCallback Error**: Was causing crashes - now fixed ✅
3. **University Dropdown**: Should have 400+ universities with "Other" option ✅
4. **Progress Bar**: Should not have connecting line, text should not be cut off ✅
5. **Navigation Path**: Should redirect to `/jobseeker-registration-success` not `/jobseeker-success` ✅

---

## 📊 Test Results Template

| Test Case | Status | Notes |
|-----------|--------|-------|
| 1. Form Navigation | ⏳ Pending | |
| 2. Personal Information | ⏳ Pending | |
| 3. Education Details | ⏳ Pending | |
| 4. Employment Information | ⏳ Pending | |
| 5. Skills & Expertise | ⏳ Pending | |
| 6. Job Preferences | ⏳ Pending | |
| 7. Career Goals | ⏳ Pending | |
| 8. Additional Information | ⏳ Pending | |
| 9. Form State Persistence | ⏳ Pending | |
| 10. Form Validation | ⏳ Pending | |
| 11. Form Submission | ⏳ Pending | |
| 12. Backend Integration | ⏳ Pending | |
| 13. Data Verification | ⏳ Pending | |
| 14. Responsive Design | ⏳ Pending | |
| 15. Edge Cases | ⏳ Pending | |

---

## 🚀 Quick Test Commands

### Start Frontend:
```bash
cd frontend
npm start
```

### Start Backend:
```bash
cd backend
python app.py
```

### Clear Browser Cache:
- Press `Ctrl + Shift + Delete`
- Clear all cached data
- Hard refresh: `Ctrl + F5`

---

## 📝 Bug Report Template

**Issue**: [Brief description]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Behavior**: 

**Actual Behavior**: 

**Console Errors**: 

**Screenshots**: [If applicable]

---

## ✅ Success Criteria

- [ ] All 15 test cases pass
- [ ] No console errors
- [ ] No backend errors
- [ ] Form data saves to database
- [ ] Data displays correctly on Contact Me page
- [ ] Form is responsive on all devices
- [ ] Form state persists across reloads

---

**Test Date**: October 10, 2025
**Tester**: AI Assistant
**Status**: Ready for Testing 🎯

