# 🔧 Network Access Troubleshooting Guide

## 🚨 Common Issues and Solutions

### Issue 1: HTTPS vs HTTP Error
**Error**: `Bad request version` with garbled characters
**Cause**: Someone is trying to access your server using HTTPS instead of HTTP

**Solution**:
- ✅ Use `http://` (not `https://`) for local network access
- ✅ Correct URL: `http://192.168.0.34:3003` (not `https://192.168.0.34:3003`)
- ✅ Tell users to use HTTP for testing

### Issue 2: Browser Auto-Redirects to HTTPS
**Problem**: Browser automatically changes `http://` to `https://`

**Solutions**:
1. **Chrome**: Type `http://` explicitly, don't let browser auto-complete
2. **Firefox**: Clear HTTPS cache: Settings → Privacy → Clear Data
3. **Safari**: Disable "Prevent cross-site tracking"
4. **Edge**: Disable "Use secure DNS"

### Issue 3: Mobile Apps Using HTTPS
**Problem**: Some mobile apps automatically use HTTPS

**Solutions**:
1. Use a web browser instead of the app
2. Clear app cache and data
3. Use incognito/private browsing mode

## 🌐 Correct URLs for Network Access

### Your Network URLs (Use HTTP only):
- **Frontend**: `http://192.168.0.34:3003`
- **Backend API**: `http://192.168.0.34:3002`
- **Local Access**: `http://localhost:3003`

### ❌ Don't Use These (HTTPS):
- ~~`https://192.168.0.34:3003`~~ (Will cause errors)
- ~~`https://192.168.0.34:3002`~~ (Will cause errors)

## 🚀 Quick Start (Corrected)

### Step 1: Configure Firewall
```bash
# Run as Administrator
.\configure_network_access.bat
```

### Step 2: Start Network Mode
```bash
# Use the simple network startup
.\start_simple_network.bat
```

### Step 3: Share Correct URL
Share this URL with others: `http://192.168.0.34:3003`

## 📱 Testing Instructions

### For Other People Testing:
1. **Open a web browser** (Chrome, Firefox, Safari, Edge)
2. **Type the URL exactly**: `http://192.168.0.34:3003`
3. **Don't let the browser auto-complete** - type `http://` manually
4. **If you see HTTPS errors**, clear browser cache and try again

### For Mobile Devices:
1. **Use the browser app** (not other apps)
2. **Type the full URL**: `http://192.168.0.34:3003`
3. **If it redirects to HTTPS**, try incognito/private mode

## 🔍 Debugging Steps

### Check if Servers are Running:
```bash
# Test network access
.\test_network.bat
```

### Check Backend API:
```bash
# Test backend directly
curl http://192.168.0.34:3002/api/auth/get_user
```

### Check Frontend:
```bash
# Test frontend directly
curl http://192.168.0.34:3003
```

## 🛠️ Advanced Solutions

### If HTTPS Errors Persist:

#### Option 1: Add HTTPS Support (Advanced)
```python
# In backend/app.py, add SSL support
app.run(
    host=Config.HOST,
    port=Config.PORT,
    debug=True,
    ssl_context='adhoc'  # This requires pyOpenSSL
)
```

#### Option 2: Use a Reverse Proxy
Set up nginx or Apache to handle HTTPS and proxy to your HTTP server.

#### Option 3: Use a Different Port
Change the frontend port to avoid HTTPS redirects:
```bash
# In frontend/package.json
"start": "set PORT=8080 && react-scripts start"
```

## 📊 Success Indicators

### ✅ Working Correctly:
- No "Bad request version" errors in backend logs
- Frontend loads without HTTPS errors
- API calls work from other devices
- Users can complete registration and job applications

### ❌ Still Having Issues:
- Backend logs show HTTPS request errors
- Frontend shows "This site can't be reached"
- API calls fail with CORS errors
- Users can't access the site from other devices

## 🆘 Emergency Fix

If nothing else works:

1. **Stop all servers**:
   ```bash
   .\stop_network_access.bat
   ```

2. **Clear browser cache** on all devices

3. **Restart servers**:
   ```bash
   .\start_simple_network.bat
   ```

4. **Use incognito/private mode** on all devices

5. **Share the exact URL**: `http://192.168.0.34:3003`

## 📞 Support

If you're still having issues:
1. Check the backend console for error messages
2. Verify the IP address hasn't changed
3. Ensure all devices are on the same WiFi network
4. Try using a different browser or device

---

**Remember**: Always use `http://` (not `https://`) for local network testing! 🔧
