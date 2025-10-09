# 🔧 Admin Stats 404 Error - Quick Fix

## 🐛 The Problem
`GET http://localhost:3002/api/admin/stats` returns 404 NOT FOUND

## ✅ The Solution

The admin routes blueprint needs to be properly registered. I've added a test endpoint to verify.

---

## 🚀 Steps to Fix:

### 1. Stop the Backend Server
Press `Ctrl+C` in your backend terminal to stop the server

### 2. Restart the Backend
```bash
cd backend
python app.py
```

### 3. Test the Admin Routes
Once the server starts, test if admin routes are working:

**In your browser or using curl:**
```
http://localhost:3002/api/admin/test
```

Should return:
```json
{"message": "Admin routes are working!"}
```

### 4. If Test Works, Stats Should Work
If the test endpoint works, the stats endpoint should also work.

---

## 🔍 Debugging Steps

If still getting 404:

### Check 1: Verify Backend Port
Make sure backend is running on port 3002:
```bash
# Look for this in the terminal output:
[URL] Server will be available at: http://localhost:3002
```

### Check 2: Test Basic Endpoint
```bash
curl http://localhost:3002/api/status/health
```

### Check 3: Check Flask Routes
Add this temporarily to `app.py` after all blueprints are registered:
```python
# Debug: Print all registered routes
print("\n📋 Registered Routes:")
for rule in app.url_map.iter_rules():
    if 'admin' in str(rule):
        print(f"  {rule}")
```

### Check 4: Verify Import
In `backend/app.py`, ensure this line exists:
```python
from routes.admin_routes import admin_routes
```

And this line:
```python
app.register_blueprint(admin_routes, url_prefix='/api/admin')
```

---

## 🎯 Expected Routes

After restarting, these should be available:
- `GET /api/admin/test` - Test endpoint (no auth)
- `GET /api/admin/stats` - System statistics (requires admin auth)
- `GET /api/admin/jobseeker-settings` - Job seeker settings
- `GET /api/admin/recruiter-settings` - Recruiter settings

---

## 💡 Alternative: Check if Server is Actually Restarted

Sometimes the old process doesn't stop. Try:

### Windows:
```powershell
# Find Python processes
tasklist | findstr python

# Kill specific process (if needed)
taskkill /F /PID <process_id>

# Then restart
python app.py
```

### Or use a different terminal:
1. Open a NEW terminal/command prompt
2. Navigate to backend folder
3. Run `python app.py`

---

## 📝 What Was Changed

**File: `backend/routes/admin_routes.py`**

Added test route:
```python
@admin_routes.route('/test', methods=['GET'])
def test_route():
    return jsonify({"message": "Admin routes are working!"}), 200
```

Updated `admin_required` decorator to:
- Support Bearer token authentication
- Check both `role` and `userType` for admin
- Better error handling

---

## ✅ Success Indicators

After restart, you should see:
1. ✅ No import errors in terminal
2. ✅ Server starts on port 3002
3. ✅ Test endpoint returns 200 OK
4. ✅ Stats endpoint returns 200 OK (with valid admin token)
5. ✅ Dashboard loads stats without errors

---

## 🆘 If Still Not Working

1. **Share the terminal output** when starting the backend
2. **Check for import errors** - Look for any red error messages
3. **Verify the file exists**: `backend/routes/admin_routes.py`
4. **Check Python version**: Should be Python 3.8+

---

**Try restarting the backend server now! 🚀**

