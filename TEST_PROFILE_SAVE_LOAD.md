# Test Profile Save & Load Functionality

## 🧪 Testing Blood Group and All Fields Persistence

### **Issue Reported**:
- User edits blood group field (e.g., changes to "B+")
- After refresh, the field reverts to blank
- Need to verify all fields are being saved and loaded correctly

### **Data Flow Analysis**:

```
SAVE FLOW:
MyProfile.jsx → saveSection() → PUT /api/profile/profile → user_profile_routes.py → users collection

LOAD FLOW:
MyProfile.jsx → useEffect() → GET /api/jobseeker/profile → jobseeker_registration_routes.py → users collection (fallback)
```

### **Backend Verification**:

#### 1. **Save Endpoint** (`/api/profile/profile` PUT):
✅ Includes `bloodGroup` in `fields_to_update` list (line 385)
✅ Updates `users` collection with all provided fields
✅ Also updates `resumes` collection for job seekers

#### 2. **Load Endpoint** (`/api/jobseeker/profile` GET):
✅ Has fallback to `users` collection if not in `jobseeker_profiles`
✅ Returns `bloodGroup` in flattened profile (line 462)
✅ Returns all demographic and additional fields

### **Frontend Verification**:

#### 1. **Save Function** (`MyProfile.jsx`):
```javascript
const saveSection = async (section) => {
  const payload = {
    ...profileForm,  // ← Includes all fields including bloodGroup
    skills: [...],
    coreSkills: [...],
    // ...
  };
  
  await axios.put(buildApiUrl('/api/profile/profile'), payload);
  
  // Clear cache to force fresh data
  sessionStorage.removeItem('myProfileData');
  sessionStorage.removeItem('myProfileTimestamp');
}
```

#### 2. **Load Function** (`MyProfile.jsx`):
```javascript
useEffect(() => {
  const fetchFreshData = async () => {
    const res = await axios.get(buildApiUrl('/api/jobseeker/profile'));
    const p = res?.data || {};
    
    setProfileForm(prev => ({
      ...prev,
      bloodGroup: p.bloodGroup || '',  // ← Should load from API
      // ... other fields
    }));
  };
}, [user]);
```

### **Potential Issues**:

1. **Cache Not Cleared Properly**:
   - Cache is cleared on save
   - But browser might still use stale cache

2. **Field Mapping Mismatch**:
   - Frontend sends: `bloodGroup`
   - Backend saves: `bloodGroup`
   - Backend returns: `bloodGroup`
   - Frontend reads: `bloodGroup`
   ✅ All match correctly

3. **Database Update Not Persisting**:
   - Check if MongoDB update is actually writing
   - Check if user ID is correct

### **Test Steps**:

#### **Manual Test**:
1. Open browser DevTools (F12) → Network tab
2. Navigate to MyProfile page
3. Click "Edit" on Demographics section
4. Change Blood Group to "B+"
5. Click "Save"
6. **Verify in Network tab**:
   - Request to `/api/profile/profile` (PUT)
   - Check payload includes `bloodGroup: "B+"`
   - Check response is 200 OK
7. Refresh page (F5)
8. **Verify in Network tab**:
   - Request to `/api/jobseeker/profile` (GET)
   - Check response includes `bloodGroup: "B+"`
9. **Check UI**:
   - Blood Group field should show "B+"

#### **Console Test**:
Add this to browser console on MyProfile page:
```javascript
// Check current state
console.log('Current bloodGroup:', document.querySelector('select[value*="B"]')?.value);

// Check API response
fetch('/api/jobseeker/profile', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
})
.then(r => r.json())
.then(d => console.log('API bloodGroup:', d.bloodGroup));
```

### **Backend Logging**:

Add debug logging to verify data persistence:

```python
# In user_profile_routes.py update_user_profile()
print(f"📋 Received bloodGroup: {data.get('bloodGroup')}")
print(f"📋 Update data bloodGroup: {update_data.get('bloodGroup')}")
print(f"📋 Update result: matched={result.matched_count}, modified={result.modified_count}")

# After update, verify
updated_user = users_collection.find_one({'_id': user_object_id})
print(f"📋 Verified bloodGroup in DB: {updated_user.get('bloodGroup')}")
```

### **Expected Results**:

✅ **Save**:
- Network request shows `bloodGroup: "B+"` in payload
- Backend logs show field being saved
- Response is 200 OK

✅ **Load**:
- Network request returns `bloodGroup: "B+"`
- Frontend state shows `bloodGroup: "B+"`
- UI displays "B+" in dropdown

✅ **After Refresh**:
- Blood Group still shows "B+"
- No revert to blank

### **Common Causes of Blank After Refresh**:

1. ❌ **Frontend not sending field**
   - Fixed: `payload` includes all `profileForm` fields

2. ❌ **Backend not saving field**
   - Fixed: `bloodGroup` in `fields_to_update`

3. ❌ **Backend not returning field**
   - Fixed: `bloodGroup` in flattened profile response

4. ❌ **Frontend not reading field**
   - Fixed: `bloodGroup: p.bloodGroup || ''` in `setProfileForm`

5. ⚠️ **Possible**: Cache issues
   - Solution: Hard refresh (Ctrl+Shift+R)
   - Solution: Clear browser cache

6. ⚠️ **Possible**: Multiple database records
   - Solution: Check if user has records in both `users` and `jobseeker_profiles`
   - Solution: Ensure both are updated

### **Debug Commands**:

#### Check MongoDB directly:
```bash
# Connect to MongoDB
mongo

# Use your database
use aksharjobs

# Find user by email
db.users.findOne({email: "user@example.com"}, {bloodGroup: 1, firstName: 1, email: 1})

# Check if field exists
db.users.find({bloodGroup: {$exists: true, $ne: ""}}).count()
```

#### Test API directly:
```bash
# Save blood group
curl -X PUT http://localhost:3002/api/profile/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bloodGroup": "B+"}'

# Get profile
curl -X GET http://localhost:3002/api/jobseeker/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Fix if Still Not Working**:

If after all checks the field still reverts, add explicit handling:

```python
# In backend/routes/user_profile_routes.py
# Force bloodGroup to be saved even if empty string
if 'bloodGroup' in data:
    update_data['bloodGroup'] = data['bloodGroup']
    print(f"🩸 Explicitly saving bloodGroup: {data['bloodGroup']}")
```

```javascript
// In frontend MyProfile.jsx
// Force field to be included in payload
const payload = {
  ...profileForm,
  bloodGroup: profileForm.bloodGroup || '',  // Include even if empty
  // ...
};
console.log('🩸 Saving bloodGroup:', payload.bloodGroup);
```

### **Next Steps**:

1. Run manual test with Network tab open
2. Check if bloodGroup is in request payload
3. Check if bloodGroup is in response
4. Check browser console for any errors
5. If still failing, add backend logging
6. Check MongoDB directly to verify persistence

---

**Status**: 🔍 **INVESTIGATION REQUIRED**
**Priority**: 🔴 **HIGH** (Data persistence issue)
**Impact**: All editable fields may be affected
