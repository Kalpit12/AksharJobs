# 🌐 AksharJobs Network Access Setup

This guide will help you make your AksharJobs website accessible to other people on the same WiFi network for testing purposes.

## 🚀 Quick Start (3 Steps)

### Step 1: Configure Firewall
```bash
# Run as Administrator
configure_network_access.bat
```

### Step 2: Start Network Mode
```bash
start_network_access.bat
```

### Step 3: Share the URL
The script will show your network URL. Share it with others:
```
http://YOUR_IP_ADDRESS:3003
```

## 📁 Files Created

| File | Purpose |
|------|---------|
| `configure_network_access.bat` | Configures Windows Firewall (run as admin) |
| `start_network_access.bat` | Starts both servers for network access |
| `stop_network_access.bat` | Stops all servers |
| `test_network.bat` | Tests if network access is working |
| `test_network_access.py` | Python script to test connectivity |
| `NETWORK_TESTING_GUIDE.md` | Detailed testing instructions |

## 🔧 How It Works

### Backend Configuration
- **Host**: `0.0.0.0` (accepts connections from any IP)
- **Port**: `3002`
- **CORS**: Configured to allow all origins
- **API**: Available at `http://YOUR_IP:3002/api/*`

### Frontend Configuration
- **Host**: `0.0.0.0` (accessible from any IP)
- **Port**: `3003` [[memory:8454402]]
- **API Calls**: Automatically detect network IP
- **Website**: Available at `http://YOUR_IP:3003`

### Network Detection
The system automatically detects your local IP address and configures both frontend and backend to work with it.

## 🧪 Testing Checklist

### ✅ Basic Connectivity
- [ ] Run `test_network.bat` - all tests should pass
- [ ] Access `http://localhost:3003` on your computer
- [ ] Access `http://YOUR_IP:3003` on your computer
- [ ] Access `http://YOUR_IP:3003` from other devices

### ✅ Full Feature Testing
- [ ] **User Registration**: New users can sign up
- [ ] **Login**: Users can log in with credentials
- [ ] **Profile Setup**: Users can complete profiles
- [ ] **Resume Upload**: Resume extraction works
- [ ] **Job Search**: Job search and filtering works
- [ ] **Job Application**: Users can apply to jobs
- [ ] **Application Tracker**: Users can view applications
- [ ] **Recruiter Features**: Recruiters can manage jobs
- [ ] **Cross-Device**: Works on mobile, tablet, different browsers

## 🔧 Troubleshooting

### Common Issues

#### "This site can't be reached"
1. Check if servers are running: `start_network_access.bat`
2. Configure firewall: `configure_network_access.bat` (as admin)
3. Verify IP address hasn't changed

#### "Connection refused"
1. Backend not running: Check port 3002
2. Frontend not running: Check port 3003
3. Restart servers: `stop_network_access.bat` then `start_network_access.bat`

#### Other devices can't access
1. Ensure all devices are on same WiFi
2. Check Windows Firewall settings
3. Try disabling antivirus temporarily
4. Verify IP address is correct

### Getting Your IP Address
```bash
# Method 1: Check startup script output
start_network_access.bat

# Method 2: Command prompt
ipconfig | findstr "IPv4"

# Method 3: Run test
test_network.bat
```

## 📱 Device Testing

### Mobile Devices
- **Android**: Chrome, Firefox, Samsung Internet
- **iOS**: Safari, Chrome, Firefox
- **Tablets**: iPad, Android tablets

### Desktop Browsers
- **Windows**: Chrome, Firefox, Edge, Safari
- **Mac**: Safari, Chrome, Firefox
- **Linux**: Chrome, Firefox

## 🛡️ Security Notes

- This setup is for **testing purposes only**
- Don't use in production without proper security measures
- Firewall rules allow connections from any IP
- Consider using VPN for external access

## 📊 Performance

### Expected Performance
- **Local Network**: Fast response times
- **Multiple Users**: Supports concurrent users
- **Mobile**: Responsive design works well
- **Cross-Platform**: Consistent experience

### Optimization Tips
- Close unnecessary applications
- Use wired connection for host computer
- Ensure good WiFi signal strength
- Monitor server resources

## 🎯 Success Criteria

Your network access is working when:
- ✅ Multiple devices can access the site
- ✅ All features work across devices
- ✅ Users can complete full workflows
- ✅ No network or CORS errors
- ✅ Real-time updates work properly

## 📞 Support

If you need help:
1. Check `NETWORK_TESTING_GUIDE.md` for detailed instructions
2. Run `test_network.bat` to diagnose issues
3. Check console logs in server windows
4. Verify all devices are on same network

---

**Ready to test! 🚀**

Run `start_network_access.bat` and share the URL with your team!
