# 🚀 Recruiter Registration Form - Quick Start Guide

## What's New?

We've created a comprehensive recruiter registration form with **6 detailed sections** to help you build a complete company and hiring profile.

## 📍 How to Access

### Option 1: New Recruiter Signup
1. Go to `/signup`
2. Select **"Recruiter"** as account type
3. Fill basic details (name, email, password, company name)
4. After signup, you'll be redirected to `/recruiter-registration`

### Option 2: Direct Access (Existing Recruiters)
Simply navigate to: `http://localhost:3003/recruiter-registration`

## 📝 Form Sections

### Section 1: 🏢 Company Information
**Required Fields:**
- ✅ Company Name
- ✅ Industry/Sector (select multiple)
- ✅ Company Size
- ✅ Headquarters Country

**Optional Fields:**
- Website URL
- Company LinkedIn
- Headquarters City
- Company Description (max 500 chars)
- Company Logo (PNG/JPG)

### Section 2: 👤 Your Details
**Required Fields:**
- ✅ Full Name
- ✅ Designation/Role
- ✅ Official Email
- ✅ Contact Number

**Optional Fields:**
- LinkedIn Profile
- Preferred Communication Mode

### Section 3: 💼 Job Preferences
**Required Fields:**
- ✅ Position Type (select multiple)
- ✅ Work Type (On-site/Remote/Hybrid)
- ✅ Hiring Departments (select multiple)

**Optional Fields:**
- Number of Positions
- Start Date
- Duration (for internships)
- Compensation Amount & Currency
- Application Deadline
- Work Hours

### Section 4: 🧠 Candidate Requirements
**All Optional:**
- Education Level
- Fields of Study
- Required Skills
- Soft Skills
- Language Requirements
- Minimum Experience
- Academic Performance

### Section 5: 💬 Benefits & Policies
**All Optional:**
- Provide Certificates? (Yes/No)
- Offer Stipends? (Yes/No)
- Provide LOR? (Yes/No)
- Offer PPO? (Yes/No)
- Work Culture
- Perks (select multiple)

### Section 6: 🚀 Hiring Process
**All Optional:**
- Hiring Stages (select multiple)
- Process Duration
- Interview Mode
- Interview Platforms (select multiple)

## 🎯 Navigation Tips

1. **Section Navigation**: Use the top bar to jump between sections
2. **Previous/Next Buttons**: Navigate sequentially through sections
3. **Real-time Validation**: Errors show immediately as you type
4. **Multi-select**: Check multiple boxes for array fields
5. **Skip Option**: Available on final section if you want to complete later

## ✅ Submission

Once you complete all required fields:
1. Review your information
2. Click **"Complete Registration"** on Section 6
3. Success message appears with countdown
4. Auto-redirect to Recruiter Dashboard

## 🔧 Testing the Form

### Start the Application
```bash
# Backend (from project root)
cd backend
python app.py

# Frontend (from project root in new terminal)
cd frontend
npm start
```

### Test Scenario 1: Complete New Registration
1. Navigate to `http://localhost:3003/signup`
2. Select "Recruiter" account type
3. Fill in:
   - First Name: John
   - Last Name: Doe
   - Email: john.doe@techcorp.com
   - Phone: +254712345678
   - Password: Test@1234
   - Company: TechCorp Kenya
4. Complete signup
5. Fill comprehensive form (you'll be auto-redirected)
6. Test navigation between sections
7. Submit and verify redirect to dashboard

### Test Scenario 2: Update Existing Profile
1. Login as existing recruiter
2. Navigate to `http://localhost:3003/recruiter-registration`
3. Update any fields
4. Submit changes
5. Verify changes saved

### Test Scenario 3: Mobile View
1. Open browser dev tools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (iPhone 12, Samsung Galaxy, etc.)
4. Test form responsiveness
5. Verify all sections display correctly

## 📊 Data Structure

Your completed profile will include:

```json
{
  "companyName": "TechCorp Kenya",
  "industries": ["Information Technology", "SaaS"],
  "companySize": "51–200 employees",
  "positionTypes": ["Full-Time", "Internship"],
  "workType": "Hybrid",
  "hiringDepartments": ["Software Development", "Data Science"],
  "perks": ["Mentorship", "Flexible Hours", "Remote Work"],
  "profileCompleted": true
}
```

## 🎨 UI Features

- **Gradient Header**: Modern purple gradient design
- **Section Icons**: Each section has a unique icon
- **Progress Indication**: Active section highlighted
- **Smooth Animations**: Fade-in effects between sections
- **Error Highlighting**: Red borders on invalid fields
- **Success Animation**: Checkmark with progress bar

## 🔐 Security Features

- ✅ JWT Authentication Required
- ✅ File Upload Validation
- ✅ Input Sanitization
- ✅ CORS Protection
- ✅ Secure Token Storage

## 🐛 Common Issues & Solutions

### Issue: Form not loading
**Solution**: Ensure you're logged in with a recruiter account

### Issue: Cannot upload logo
**Solution**: Check file is PNG or JPG format, max size limits

### Issue: Multi-select not working
**Solution**: Click the checkbox, not just the label

### Issue: Validation errors
**Solution**: Check required fields marked with red star (*)

### Issue: Not redirecting after submit
**Solution**: Check browser console for errors, verify backend is running

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎓 Best Practices

1. **Complete Required Sections First**: Focus on Sections 1-3
2. **Be Specific**: Detailed information improves candidate matching
3. **Use Multi-select Wisely**: Select all relevant options
4. **Update Regularly**: Keep your profile current
5. **Upload Logo**: Increases company credibility

## 📞 API Endpoints

### Complete Profile
```bash
POST http://localhost:5000/api/recruiters/complete-profile
Headers: Authorization: Bearer <your-token>
Content-Type: multipart/form-data
```

### Get Profile
```bash
GET http://localhost:5000/api/recruiters/profile
Headers: Authorization: Bearer <your-token>
```

### Update Profile
```bash
PUT http://localhost:5000/api/recruiters/update-profile
Headers: Authorization: Bearer <your-token>
Content-Type: application/json
```

## 🎉 What Happens After Submission?

1. ✅ Data saved to MongoDB
2. ✅ Profile marked as complete
3. ✅ Success animation displays
4. ✅ 3-second countdown begins
5. ✅ Auto-redirect to Recruiter Dashboard
6. ✅ Enhanced job posting available with your profile data

## 📈 Next Steps

After completing your profile:
1. Post your first job
2. Browse candidate resumes
3. Set up automated job alerts
4. Manage applications
5. Use AI-powered candidate matching

## 💡 Pro Tips

- 📝 **Save Time**: Complete optional sections to enhance matching
- 🎯 **Be Accurate**: Correct information = better candidates
- 🔄 **Update Often**: Keep compensation and positions current
- 📊 **Use Analytics**: Track profile views and applications
- 💬 **Engage**: Respond to candidate messages promptly

---

**Need Help?**
- Check the main documentation: `RECRUITER_REGISTRATION_GUIDE.md`
- Contact support: support@aksharjobs.com
- Report issues: GitHub Issues

**Happy Recruiting! 🚀**

