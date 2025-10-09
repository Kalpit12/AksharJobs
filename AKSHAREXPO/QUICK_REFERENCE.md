# 🚀 AksharJobs Expo - Quick Reference Guide

## 🔗 Important URLs

### Google Apps Script API
```
https://script.google.com/macros/s/AKfycbwjl75BoBiVOf2vEKXSioM7_ZhY1n5q5DluxxgGjx6uHK21b6KffVC94NGMqlaUN3XklQ/exec
```

### Main Pages
- **Landing Page**: `expo_landing.html`
- **Referral Page**: `referral.html`
- **Registration Page**: `registration.html`

---

## 👥 Test User Credentials

### Hemant Patel
```
Email: hemant.patel@maxproinfotech.com
Role: Recruiter
Coins: 10
Status: ✅ Registered
```

### Shefali Patel
```
Email: shefalipatel232@gmail.com
Role: Job Seeker
Coins: 10
Status: ✅ Registered
```

### Krish Kumar
```
Email: krishkumar514@gmail.com
Status: ✅ Registered
```

---

## 🧪 Quick Test Commands

### Open Main Landing Page
```powershell
start expo_landing.html
```

### Open Referral Page
```powershell
start referral.html
```

### Test Login System
```powershell
start test_hemant_login.html
```

### Test Referral Tracking
```powershell
start test_referral_sync.html
```

### Comprehensive API Test
```powershell
start test_new_google_script.html
```

---

## 🔑 Key Features

### 1. Login
1. Click "Login" button in header
2. Enter registered email
3. Click "Login" button in modal
4. Dashboard appears with user info

### 2. Referral Sharing
1. Login first (if not already)
2. Click "Start Referring" button
3. Choose platform to share
4. Earn 3 coins per share
5. Shares tracked in Google Sheets

### 3. Quick Registration
1. Try to login with unregistered email
2. Click "Register Now" in error message
3. Complete registration form
4. Automatically logged in

---

## 📊 Google Sheets Structure

### Registration Sheet
```
Columns: Name | Email | Phone | Role | Akshar Coins | Registration Date | Last Login
```

### Referral_Tracking Sheet
```
Columns: Referrer Email | Referrer Name | Platform | Coins Earned | Total Shares | Share Count | Timestamp | Date
```

---

## 🔧 Common API Calls

### Check if User is Registered
```javascript
fetch(`${API_URL}?type=check_registration&email=user@example.com`)
```

### Update Login Timestamp
```javascript
fetch(`${API_URL}?type=update_login&email=user@example.com&timestamp=${new Date().toISOString()}`)
```

### Track Referral Share
```javascript
fetch(`${API_URL}?type=referral_share&referrerEmail=user@example.com&referrerName=User&platform=whatsapp&coinsEarned=3&totalShares=1&shareCount=1&timestamp=${new Date().toISOString()}`)
```

---

## 📁 File Locations

### Core Files
- `AKSHAREXPO/expo_landing.html` - Main landing page
- `AKSHAREXPO/expo_landing.js` - Landing page logic
- `AKSHAREXPO/expo_api_config.js` - API configuration
- `AKSHAREXPO/referral.html` - Referral page
- `AKSHAREXPO/registration.html` - Registration page
- `AKSHAREXPO/google_sheets_integration.gs` - Google Apps Script

### Test Files
- `AKSHAREXPO/test_new_google_script.html` - Comprehensive test
- `AKSHAREXPO/test_hemant_login.html` - Hemant login test
- `AKSHAREXPO/test_shefali_login.html` - Shefali login test
- `AKSHAREXPO/test_referral_sync.html` - Referral sync test

---

## 💡 Quick Troubleshooting

### Login Not Working
1. Check if email is registered in Google Sheets
2. Verify API URL is correct
3. Check browser console for errors
4. Try test users (Hemant or Shefali)

### Referral Not Tracking
1. Ensure user is logged in
2. Check browser console for API responses
3. Verify Google Sheets has `Referral_Tracking` sheet
4. Test with `test_referral_sync.html`

### API Not Responding
1. Test API status: Open API URL in browser
2. Should return: `{"message":"AksharJobs Expo Registration & Referral API is running"...}`
3. If not working, check Google Apps Script deployment

---

## 🎯 System Status Check

Run this command to check overall system health:
```powershell
start test_new_google_script.html
```

**Expected Results**:
- ✅ API Status: Success
- ✅ Referral Share: Success
- ✅ Registration Check: Working
- ✅ Login Update: Working

---

## 📝 Important Code Snippets

### Get Current Logged-In User (JavaScript)
```javascript
function getCurrentUserEmail() {
    return localStorage.getItem('aksharJobsUserEmail');
}
```

### Check if User is Logged In
```javascript
function isUserLoggedIn() {
    return localStorage.getItem('aksharJobsUserEmail') !== null;
}
```

### Logout User
```javascript
function logoutUser() {
    localStorage.removeItem('aksharJobsUserEmail');
    localStorage.removeItem('aksharJobsUserData');
    location.reload();
}
```

---

## 🎨 CSS Classes

### Login Button
```css
.nav-login-btn {
    background-color: #e6f2ff;
    color: #007bff;
    padding: 8px 20px;
    border-radius: 20px;
}
```

### User Profile Button
```css
.nav-user-profile {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}
```

---

## 📞 Need Help?

1. Check `SYSTEM_STATUS_VERIFICATION.md` for detailed status
2. Review `LOGIN_SYSTEM_COMPLETE.md` for login system details
3. Check browser console for error messages
4. Test with provided test files
5. Verify Google Sheets permissions

---

**Last Updated**: October 8, 2025  
**System Status**: ✅ Fully Operational

