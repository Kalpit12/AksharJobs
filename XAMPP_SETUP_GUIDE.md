# XAMPP Setup Guide for Resume to Job Description Matcher

This guide will help you set up your website to run through XAMPP so others can access it locally on your network.

## Prerequisites
- XAMPP installed and running
- Python 3.7+ installed
- Node.js and npm installed

## Step-by-Step Setup

### 1. Configure Apache Virtual Host

1. **Copy the virtual host configuration:**
   - Copy the contents of `xampp_vhost.conf`
   - Paste it into: `C:\xampp\apache\conf\extra\resume-matcher.conf`

2. **Enable the virtual host:**
   - Open `C:\xampp\apache\conf\httpd.conf`
   - Add this line at the end:
     ```apache
     Include conf/extra/resume-matcher.conf
     ```

3. **Enable required Apache modules:**
   - In `C:\xampp\apache\conf\httpd.conf`, ensure these lines are uncommented:
     ```apache
     LoadModule rewrite_module modules/mod_rewrite.so
     LoadModule proxy_module modules/mod_proxy.so
     LoadModule proxy_http_module modules/mod_proxy_http.so
     LoadModule headers_module modules/mod_headers.so
     ```

### 2. Configure Windows Hosts File

1. **Open hosts file as Administrator:**
   - Navigate to: `C:\Windows\System32\drivers\etc\`
   - Right-click on `hosts` file → Open with → Notepad (as Administrator)

2. **Add these lines:**
   ```
   127.0.0.1 resume-matcher.local
   127.0.0.1 www.resume-matcher.local
   ```

3. **Save the file**

### 3. Build the Frontend

1. **Run the build script:**
   ```bash
   build_frontend.bat
   ```
   
   Or manually:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

### 4. Start the Backend

1. **Run the backend startup script:**
   ```bash
   start_backend.bat
   ```
   
   Or manually:
   ```bash
   cd backend
   venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```

### 5. Start XAMPP Services

1. **Open XAMPP Control Panel**
2. **Start Apache** (click Start button)
3. **Start MySQL** (if your app uses it)

### 6. Test Your Website

1. **Local access:**
   - Frontend: `http://resume-matcher.local`
   - Backend API: `http://localhost:5000`

2. **Network access (for others):**
   - Find your computer's IP address: `ipconfig` in CMD
   - Others can access: `http://YOUR_IP_ADDRESS`
   - Example: `http://192.168.1.100`

## Troubleshooting

### Common Issues:

1. **Port 80 already in use:**
   - Stop other web servers (IIS, etc.)
   - Change Apache port in `httpd.conf` from 80 to 8080

2. **CORS errors:**
   - Ensure backend is running on port 5000
   - Check that proxy configuration is correct

3. **React Router not working:**
   - Verify `.htaccess` file is in `frontend/build/`
   - Ensure `mod_rewrite` is enabled

4. **Permission denied:**
   - Run XAMPP as Administrator
   - Check file permissions

### Testing Network Access:

1. **Find your IP:**
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" under your network adapter

2. **Test from another device:**
   - Connect to same WiFi network
   - Open browser and go to: `http://YOUR_IP_ADDRESS`

3. **Firewall settings:**
   - Allow Apache through Windows Firewall
   - Allow port 80 (or your custom port)

## Security Notes

- This setup is for **local development/testing only**
- Don't expose to the internet without proper security
- Consider using HTTPS for production
- Regularly update XAMPP and dependencies

## Quick Commands

```bash
# Build frontend
build_frontend.bat

# Start backend
start_backend.bat

# Restart Apache (in XAMPP Control Panel)
# Click Stop, then Start for Apache
```

## Access URLs

- **Local:** `http://resume-matcher.local`
- **Network:** `http://YOUR_IP_ADDRESS`
- **Backend API:** `http://localhost:5000/api`

Your website should now be accessible to others on your local network through XAMPP!
