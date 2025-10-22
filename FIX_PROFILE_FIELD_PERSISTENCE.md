# Fix Profile Field Persistence Issue

## 🐛 Issue Description
Fields edited in MyProfile page (e.g., Blood Group) revert to blank after page refresh.

## 🔍 Root Cause Analysis

The data flow for profile save/load is:
1. **Save**: MyProfile → `/api/profile/profile` (PUT) → `users` collection
2. **Load**: MyProfile → `/api/jobseeker/profile` (GET) → `users` collection (fallback)

### Potential Issues Identified:
1. ✅ Frontend state not including all fields → **VERIFIED: All fields included**
2. ✅ Backend not saving all fields → **VERIFIED: All fields in `fields_to_update`**
3. ✅ Backend not returning all fields → **VERIFIED: All fields in response**
4. ⚠️ **Possible**: Data not persisting to MongoDB
5. ⚠️ **Possible**: Cache issues preventing fresh data load

## 🛠️ Fixes Applied

### 1. **Enhanced Logging - Frontend** (`MyProfile.jsx`):

```javascript
// Before save
console.log(`🔍 Current profileForm state:`, profileForm);
console.log(`🩸 Blood Group in payload:`, payload.bloodGroup);
console.log(`👤 Demographics fields in payload:`, {
  bloodGroup, dateOfBirth, gender, community, nationality, currentCity
});

// After load
console.log('🩸 Blood Group received from API:', p.bloodGroup);
console.log('👤 Demographics fields received:', {
  bloodGroup, dateOfBirth, gender, community, nationality, currentCity
});
```

### 2. **Enhanced Logging - Backend Save** (`user_profile_routes.py`):

```python
# Before update
print(f"🩸 Blood Group in request: {data.get('bloodGroup')}")
print(f"👤 Demographics fields in request: bloodGroup={data.get('bloodGroup')}, gender={data.get('gender')}, dateOfBirth={data.get('dateOfBirth')}")
print(f"🌍 Location fields in request: nationality={data.get('nationality')}, currentCity={data.get('currentCity')}")

# After update - verify persistence
updated_user = users_collection.find_one({'_id': user_object_id})
print(f"✅ Verified in DB - Blood Group: {updated_user.get('bloodGroup')}")
print(f"✅ Verified in DB - Gender: {updated_user.get('gender')}, DOB: {updated_user.get('dateOfBirth')}")
```

### 3. **Enhanced Logging - Backend Load** (`jobseeker_registration_routes.py`):

```python
# Before returning
print(f"🩸 Returning Blood Group: {flattened_profile.get('bloodGroup')}")
print(f"👤 Returning Demographics: bloodGroup={flattened_profile.get('bloodGroup')}, gender={flattened_profile.get('gender')}, dateOfBirth={flattened_profile.get('dateOfBirth')}")
print(f"🌍 Returning Location: nationality={flattened_profile.get('nationality')}, currentCity={flattened_profile.get('currentCity')}")
```

## 🧪 Testing Instructions

### Step 1: Edit Blood Group
1. Navigate to MyProfile page
2. Open Browser DevTools (F12) → Console tab
3. Click "Edit" on Demographics section
4. Change Blood Group to "B+"
5. Click "Save"

### Step 2: Verify Save in Console
Look for these logs:
```
💾 Saving demographics section...
🔍 Current profileForm state: {...}
🩸 Blood Group in payload: B+
👤 Demographics fields in payload: {bloodGroup: "B+", ...}
📤 Sending payload for demographics: {...}
✅ demographics section saved successfully
```

### Step 3: Verify Save in Backend
Check backend terminal for:
```
🩸 Blood Group in request: B+
👤 Demographics fields in request: bloodGroup=B+, gender=..., dateOfBirth=...
📋 Update result: matched=1, modified=1
✅ Verified in DB - Blood Group: B+
✅ Profile updated successfully for user ...
```

### Step 4: Refresh Page (F5)

### Step 5: Verify Load in Console
Look for these logs:
```
🔄 Loading profile data...
⚡ Loading from cache (fast!) OR fetching fresh data...
✅ Profile data loaded successfully: {...}
🩸 Blood Group received from API: B+
👤 Demographics fields received: {bloodGroup: "B+", ...}
```

### Step 6: Verify Load in Backend
Check backend terminal for:
```
🩸 Returning Blood Group: B+
👤 Returning Demographics: bloodGroup=B+, gender=..., dateOfBirth=...
✅ Profile retrieved successfully for user ...
```

### Step 7: Verify UI
- Blood Group dropdown should display "B+"
- Field should NOT be blank

## 📊 Expected Results

### ✅ **Success Scenario**:
1. Frontend logs show Blood Group in save payload
2. Backend logs show Blood Group in request
3. Backend logs show Blood Group verified in DB
4. After refresh: Backend logs show Blood Group in response
5. After refresh: Frontend logs show Blood Group received
6. After refresh: UI displays Blood Group correctly

### ❌ **Failure Scenarios**:

#### Scenario A: Frontend not sending
- ❌ Blood Group missing from payload
- ✅ Fix: Check if field is in `profileForm` state

#### Scenario B: Backend not saving
- ❌ Blood Group in request but not in DB after save
- ✅ Fix: Check MongoDB connection, check if field is in `fields_to_update`

#### Scenario C: Backend not returning
- ❌ Blood Group in DB but not in API response
- ✅ Fix: Check if field is in `flattened_profile`

#### Scenario D: Frontend not updating state
- ❌ Blood Group in API response but not in `profileForm`
- ✅ Fix: Check `setProfileForm` in `fetchFreshData`

#### Scenario E: Cache issue
- ❌ Old data from cache
- ✅ Fix: Clear cache with Ctrl+Shift+R (hard refresh)

## 🔧 Debugging Commands

### Check MongoDB Directly:
```bash
# Connect to MongoDB
mongo

# Use database
use aksharjobs

# Find user by email
db.users.findOne(
  {email: "user@example.com"}, 
  {bloodGroup: 1, gender: 1, dateOfBirth: 1, firstName: 1, email: 1}
)

# Check all users with bloodGroup
db.users.find({bloodGroup: {$exists: true, $ne: ""}}).pretty()
```

### Test API Directly:
```bash
# Get auth token from localStorage in browser console
# localStorage.getItem('token')

# Test save
curl -X PUT http://localhost:3002/api/profile/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"bloodGroup": "B+", "gender": "male", "dateOfBirth": "1990-01-01"}'

# Test load
curl -X GET http://localhost:3002/api/jobseeker/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Check Browser Network Tab:
1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Click "Save" button
4. Find request to `/api/profile/profile`
5. Check "Payload" tab → verify bloodGroup is included
6. Check "Response" tab → verify 200 OK
7. Refresh page
8. Find request to `/api/jobseeker/profile`
9. Check "Response" tab → verify bloodGroup is in response

## 🚀 Next Steps

### If Issue Persists After Logging:

1. **Check the logs** to identify exact failure point
2. **Verify MongoDB** is actually persisting the data
3. **Clear all caches**:
   - Browser cache (Ctrl+Shift+Delete)
   - SessionStorage: `sessionStorage.clear()`
   - LocalStorage: `localStorage.clear()` (will log you out)
4. **Test with different field** (e.g., gender, dateOfBirth) to see if issue is field-specific
5. **Check for multiple user records** in database

### Additional Fixes if Needed:

If logs show data is saved but not retrieved:
- Check if user has records in both `users` and `jobseeker_profiles` collections
- Ensure fallback logic is working correctly
- Verify user ID is consistent across save/load

If logs show data is not being saved:
- Check MongoDB connection health
- Check for database write permissions
- Check for any validation errors
- Try saving a minimal payload with just bloodGroup

## 📝 Summary

All necessary logging has been added to track the complete data flow:
- ✅ Frontend save logging
- ✅ Backend save logging with DB verification
- ✅ Backend load logging
- ✅ Frontend load logging

**Run the test** and check the console/terminal logs to identify exactly where the data is being lost.

---

**Status**: 🔍 **DEBUGGING ENABLED**
**Action Required**: Test save/load and review logs
**Expected Result**: Logs will reveal exact failure point
