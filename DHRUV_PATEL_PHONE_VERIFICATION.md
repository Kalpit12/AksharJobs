# Phone Number Verification for Dhruv Patel

## Quick Check

### Option 1: Using Browser Console
1. Login as **Dhruv Patel**
2. Open browser console (F12)
3. Run these commands:

```javascript
// Check localStorage
console.log('Phone:', localStorage.getItem('phone'));
console.log('User Phone:', localStorage.getItem('userPhone'));
console.log('First Name:', localStorage.getItem('firstName'));
console.log('Last Name:', localStorage.getItem('lastName'));

// Show all user data
const userData = {
    firstName: localStorage.getItem('firstName'),
    lastName: localStorage.getItem('lastName'),
    email: localStorage.getItem('email'),
    phone: localStorage.getItem('phone') || localStorage.getItem('userPhone')
};
console.table(userData);
```

### Option 2: Using Verification Page
1. Open `test_user_phone_display.html` in your browser
2. Make sure Dhruv Patel is logged in
3. The page will automatically display:
   - ✅ User information
   - 📱 Phone number (large display)
   - 💾 localStorage data
   - ✅ Verification status

---

## Where to See Phone Number

### 1. **Dashboard Profile Section**
- Navigate to: `/jobseeker-dashboard`
- Click on "My Profile" in sidebar
- Scroll to "Personal Information"
- **Phone Number field** will show Dhruv's phone

### 2. **Registration Form**
- Navigate to: `/jobseeker-registration`
- Phone will be **pre-filled** in the "Phone Number" field
- Located under "Personal Information" section

### 3. **Top Bar User Profile**
- In the dashboard top bar
- Click on user avatar/name
- Phone might be visible in user details

---

## Expected Data for Dhruv Patel

```json
{
  "firstName": "Dhruv",
  "lastName": "Patel",
  "email": "dhruv.patel@example.com",
  "phone": "+1 XXX XXX XXXX",  // ← This should be populated
  "role": "jobSeeker"
}
```

---

## Verification Steps

### Step 1: Check if Dhruv Patel is logged in
```javascript
const firstName = localStorage.getItem('firstName');
const lastName = localStorage.getItem('lastName');
console.log(`Logged in as: ${firstName} ${lastName}`);
// Should show: "Logged in as: Dhruv Patel"
```

### Step 2: Check phone in localStorage
```javascript
const phone = localStorage.getItem('phone') || localStorage.getItem('userPhone');
console.log(`Phone Number: ${phone}`);
// Should show: "Phone Number: +1 XXX XXX XXXX"
```

### Step 3: Check AuthContext user object
```javascript
// In React DevTools, select any component
// Find "AuthContext" in the component tree
// Look at the "user" object
// It should have a "phone" property
```

---

## Troubleshooting

### Issue 1: Phone number not showing

**Solution A: Check if phone was entered during signup**
- If Dhruv Patel signed up before phone field was added
- They need to:
  1. Go to profile/registration form
  2. Add phone number manually
  3. Save profile

**Solution B: Re-login**
```
1. Logout from dashboard
2. Login again with Dhruv Patel credentials
3. Phone should be fetched from backend
4. Check localStorage again
```

**Solution C: Check backend response**
```javascript
// After login, check Network tab in DevTools
// Look for login API response
// Verify it includes "phone" field
```

### Issue 2: Phone is in database but not displaying

**Solution: Force refresh user data**
```javascript
// Clear localStorage
localStorage.clear();

// Login again
// This will fetch fresh data from backend
```

---

## Manual Test

### Test Phone Display
1. **Login as Dhruv Patel**
   ```
   Email: dhruv.patel@example.com
   Password: [Dhruv's password]
   ```

2. **Check localStorage**
   - Open DevTools → Application → Local Storage
   - Look for keys: `phone`, `userPhone`
   - They should contain Dhruv's phone number

3. **Navigate to Profile**
   ```
   Dashboard → My Profile → Personal Information
   ```
   - Phone Number field should show: `+1 XXX XXX XXXX`

4. **Navigate to Registration Form**
   ```
   Dashboard → Complete Profile button
   ```
   - Phone Number field should be **pre-filled**

---

## Quick SQL Query (if you have database access)

```sql
-- Find Dhruv Patel's phone in database
SELECT firstName, lastName, email, phone 
FROM users 
WHERE firstName = 'Dhruv' AND lastName = 'Patel';
```

---

## Backend API Check

### Check Login Response
```bash
# Login as Dhruv Patel and check response
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dhruv.patel@example.com",
    "password": "DhruvPassword123"
  }'

# Response should include:
# {
#   "token": "...",
#   "firstName": "Dhruv",
#   "lastName": "Patel",
#   "email": "dhruv.patel@example.com",
#   "phone": "+1 XXX XXX XXXX",  ← CHECK THIS
#   "role": "jobSeeker"
# }
```

---

## Visual Verification Checklist

- [ ] Dhruv Patel is logged in
- [ ] localStorage has `phone` or `userPhone` key
- [ ] Phone value is not null/undefined
- [ ] Phone shows in dashboard profile
- [ ] Phone shows in registration form
- [ ] Phone persists after page refresh
- [ ] Phone format is correct (e.g., +1 234 567 8900)

---

## Success Indicators

✅ **Phone in localStorage**: 
```
localStorage.getItem('phone') = "+1 234 567 8900"
```

✅ **Phone in Dashboard**: 
```
Dashboard > My Profile > Phone Number = "+1 234 567 8900"
```

✅ **Phone in Registration Form**: 
```
Registration Form > Phone Number (pre-filled) = "+1 234 567 8900"
```

---

## Contact Info Verification

### For Dhruv Patel
```
Name: Dhruv Patel
Email: dhruv.patel@example.com
Phone: [TO BE VERIFIED]
Role: Job Seeker
```

### How to Get Phone Number
1. **From Database**: Query users table
2. **From localStorage**: `localStorage.getItem('phone')`
3. **From API**: Call `/api/jobseeker/profile` with Dhruv's token
4. **From UI**: Dashboard > My Profile > Personal Information

---

## Next Steps

1. ✅ **Verify Login**: Make sure Dhruv Patel is logged in
2. 📱 **Check Phone**: Use verification tool or console
3. 🔍 **Test Display**: Navigate to profile/registration form
4. ✏️ **Update if Missing**: Add phone via profile edit
5. ✅ **Confirm**: Phone should persist and display everywhere

---

## Support Commands

### Clear and Re-login
```javascript
// Clear all data
localStorage.clear();
sessionStorage.clear();

// Reload page
location.reload();

// Login again as Dhruv Patel
```

### Force Fetch User Data
```javascript
// Fetch user profile
const token = localStorage.getItem('token');
fetch('http://localhost:3002/api/jobseeker/profile', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
.then(res => res.json())
.then(data => {
    console.log('User Profile:', data);
    console.log('Phone:', data.phone);
});
```

---

## Summary

To see Dhruv Patel's phone number:
1. ✅ Login as Dhruv Patel
2. ✅ Open `test_user_phone_display.html`
3. ✅ OR check browser console: `localStorage.getItem('phone')`
4. ✅ OR navigate to Dashboard > My Profile

**Expected Result**: Phone number should be visible in all locations! 📱

