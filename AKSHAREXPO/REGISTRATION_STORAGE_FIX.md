# Registration & Referral Storage Fix 🔧

## Issues Identified & Fixed

### Issue 1: Multiple Roles Not Captured Properly ❌
**Problem**: When using `Object.fromEntries(formData.entries())` with multiple checkboxes having the same name (`name="roles"`), only the LAST checked value was captured.

**Example**:
```javascript
// User selects: Job Seeker + Mentor + Trainer
// Object.fromEntries only kept: "trainer" ❌
```

**Fix Applied**: ✅
```javascript
// NEW CODE: Collect checkboxes separately BEFORE converting to object
const selectedRoles = Array.from(roleInputs)
    .filter(input => input.checked)
    .map(input => input.value);

// Convert other form data (excluding roles checkboxes)
const data = {};
for (let [key, value] of formData.entries()) {
    if (key !== 'roles') {
        data[key] = value;
    }
}

// Add all selected roles
data.roles = selectedRoles.join(', '); // "job_seeker, mentor, trainer"
data.roleCount = selectedRoles.length; // 3
```

---

### Issue 2: Google Sheets doGet Looking for 'role' Instead of 'roles' ❌
**Problem**: The doGet function checked for `e.parameters.role` (singular) but we're now sending `roles` (plural).

**Fix Applied**: ✅
```javascript
// BEFORE:
else if (...&& e.parameters.role) {

// AFTER:
else if (...&& (e.parameters.role || e.parameters.roles)) {
```

---

### Issue 3: Missing Enhanced Logging 📊
**Problem**: Hard to debug what data is being sent and received.

**Fix Applied**: ✅
Added detailed console logging:
```javascript
console.log('✅ Selected roles:', selectedRoles);
console.log('✅ Complete form data:', data);
console.log('✅ Data being sent:', JSON.stringify(data, null, 2));
console.log('🔗 Webhook URL:', url);
console.log('📊 URL Parameters:', params.toString());
console.log('📨 Response status:', response.status);
console.log('✅ Registration response:', result);
```

---

## Files Modified

### 1. `registration.html` ✅
**Lines 1186-1222**: Fixed form data collection
- ✅ Properly collect multiple checkbox values
- ✅ Enhanced logging for debugging
- ✅ Better error handling

**Lines 1271-1295**: Enhanced sendToGoogleSheets logging
- ✅ Added detailed console logs
- ✅ Shows exact URL being sent
- ✅ Shows response details

**Lines 1428-1459**: Enhanced referral logging
- ✅ Added comprehensive logging for referral tracking
- ✅ Shows all referral data being sent

### 2. `google_sheets_integration.gs` ✅
**Line 1001**: Fixed doGet validation
- ✅ Now accepts both `role` and `roles`
- ✅ Added logging for roles field
- ✅ Backward compatible

---

## How to Test

### Test 1: Open Debug Test Page
```
AKSHAREXPO/test_registration_debug.html
```

Click these buttons:
1. **"Test Registration"** - Test single role
2. **"Test Multiple Roles"** - Test 3 roles
3. **"Test Referral Tracking"** - Test referral
4. **"Run All Tests"** - Comprehensive test

### Test 2: Test via Actual Registration Form
1. Open: `registration.html`
2. Select multiple roles (e.g., Job Seeker + Mentor)
3. Fill all required fields
4. Open browser console (F12)
5. Click "Register"
6. **Check console logs** - should show:
   ```
   ✅ Selected roles: ['job_seeker', 'mentor']
   ✅ Complete form data: {fullName: "...", roles: "job_seeker, mentor", ...}
   🔗 Webhook URL: https://script.google.com/...
   📨 Response status: 200 OK
   ✅ Registration response: {success: true, ...}
   ```

### Test 3: Verify in Google Sheets
Open: https://docs.google.com/spreadsheets/d/14gfIXPlZQGuYYAWiW1RHlcDlBf_Tm63JMRrJ-4pyqwk/

Check these sheets:
- ✅ **Main Registration Sheet** - Should have new entry with `roles: "job_seeker, mentor"`
- ✅ **Job_Seekers Sheet** - Should have the entry
- ✅ **Mentors Sheet** - Should have the entry

---

## Expected Console Logs

### Successful Registration:
```
✅ Selected roles: (2) ['job_seeker', 'mentor']
✅ Complete form data: {fullName: "John Doe", email: "john@example.com", ...}
✅ Data being sent: {
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "roles": "job_seeker, mentor",
  "roleCount": 2,
  "timestamp": "2025-10-05T...",
  "type": "registration"
}
🔗 Webhook URL: https://script.google.com/macros/s/AKfycbx.../exec?fullName=John+Doe&email=john%40example.com&...
📊 URL Parameters: fullName=John+Doe&email=john%40example.com&phone=1234567890&roles=job_seeker%2C+mentor&roleCount=2&...
📨 Response status: 200 OK
✅ Registration response: {
  "success": true,
  "message": "Registration successful",
  ...
}
```

### Successful Referral:
```
🎁 Sending referral bonus to Google Sheets
🎁 Referrer email: referrer@example.com
🎁 Referral data being sent: {type: 'referral', referrerEmail: '...', ...}
🎁 Referral bonus URL: https://script.google.com/...
✅ Referral tracked successfully
```

---

## Common Issues & Solutions

### Issue: Registration shows success but not in Google Sheets
**Possible Causes**:
1. Google Sheets script not deployed properly
2. Wrong sheet ID
3. Validation failing in backend

**Debug Steps**:
1. Check console for response
2. Look for `result.error` in response
3. Verify Google Sheets script is deployed
4. Run `test_registration_debug.html` tests

### Issue: Referral not tracked
**Possible Causes**:
1. Missing referrerEmail in URL parameter
2. Type not set to 'referral'
3. Backend validation failing

**Debug Steps**:
1. Check console for `🎁` emoji logs
2. Verify `referrerEmail` is present
3. Check URL includes `type=referral`
4. Test with `test_registration_debug.html`

### Issue: "Missing required fields" error
**Possible Causes**:
1. Field names don't match
2. Empty fields
3. Roles not properly collected

**Debug Steps**:
1. Check console log: "✅ Complete form data"
2. Verify all required fields are present
3. Check `roles` field exists and is not empty
4. Ensure `fullName`, `email`, `phone` are populated

---

## Data Flow

### Registration Flow:
```
1. User fills form
   ↓
2. Selects multiple roles (checkboxes)
   ↓
3. Clicks "Register"
   ↓
4. JavaScript collects: fullName, email, phone, roles (comma-separated), roleCount
   ↓
5. Creates URL: API_URL?fullName=...&email=...&roles=job_seeker, mentor&roleCount=2
   ↓
6. Sends GET request
   ↓
7. Google Sheets doGet() receives parameters
   ↓
8. Validates: fullName, email, phone, roles (or role)
   ↓
9. Calls processRegistration(data)
   ↓
10. Saves to:
    - Main Registration Sheet
    - Job_Seekers Sheet
    - Mentors Sheet
   ↓
11. Returns {success: true}
```

### Referral Flow:
```
1. User registers via referral link (?ref=referrer@example.com)
   ↓
2. Registration completes successfully
   ↓
3. JavaScript calls processReferralRegistration()
   ↓
4. Creates referral data: {type: 'referral', referrerEmail: '...', referredEmail: '...'}
   ↓
5. Sends to API
   ↓
6. doGet() checks: referrerEmail + type='referral'
   ↓
7. Calls processReferralTracking(data)
   ↓
8. Awards coins to referrer
   ↓
9. Records in Referral_Clicks sheet
```

---

## Testing Checklist

### Before Testing:
- ✅ Clear browser cache
- ✅ Open browser console (F12)
- ✅ Have Google Sheets open in another tab

### Test Registration:
- ✅ Select 2-3 roles
- ✅ Fill all required fields
- ✅ Click "Register"
- ✅ Check console for "✅" success logs
- ✅ Check console for response: `{success: true}`
- ✅ Verify no error messages
- ✅ Check Google Sheets for new entry

### Test Referral:
- ✅ Open: `registration.html?ref=test@example.com`
- ✅ Complete registration
- ✅ Check console for "🎁" referral logs
- ✅ Verify referral data sent
- ✅ Check Google Sheets Referral_Tracking sheet

---

## Debug Commands

Run these in browser console to debug:

### Check if registration works:
```javascript
fetch('https://script.google.com/macros/s/AKfycbxSKL04akfo3W_XiUfQJQg0dg3ded6EwsbEEg6VsW1SD5eVoEDV-3EoxH-IgZy-ccEMsQ/exec?' + new URLSearchParams({
    fullName: 'Console Test',
    email: 'console@test.com',
    phone: '9999999999',
    roles: 'job_seeker, mentor',
    roleCount: '2',
    type: 'registration',
    timestamp: new Date().toISOString()
}))
.then(r => r.json())
.then(d => console.log('Result:', d));
```

### Check if referral works:
```javascript
fetch('https://script.google.com/macros/s/AKfycbxSKL04akfo3W_XiUfQJQg0dg3ded6EwsbEEg6VsW1SD5eVoEDV-3EoxH-IgZy-ccEMsQ/exec?' + new URLSearchParams({
    type: 'referral',
    referrerEmail: 'referrer@test.com',
    referredEmail: 'referred@test.com',
    referredName: 'Referred User',
    referrerName: 'Referrer User',
    platform: 'registration',
    timestamp: new Date().toISOString()
}))
.then(r => r.json())
.then(d => console.log('Result:', d));
```

---

## Next Steps

1. **Test the debug page**: `test_registration_debug.html`
2. **Run "Run All Tests"** button
3. **Check console logs** during real registration
4. **Verify in Google Sheets** that data appears
5. **Report back** what you see in console

---

**Status**: ✅ FIXES APPLIED  
**Date**: October 5, 2025  
**Testing**: Use test_registration_debug.html to diagnose  
**Next**: Run tests and check console logs

