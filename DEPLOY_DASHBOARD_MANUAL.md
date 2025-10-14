# Manual Deployment Guide - JobSeeker Dashboard

## Quick Deployment Steps

### Option 1: Using the Deployment Script (Easiest)

1. **Run the deployment script:**
   ```cmd
   .\deploy_dashboard.bat
   ```

2. **Enter your details when prompted:**
   - EC2 Server IP: `13.61.35.12`
   - Path to your .pem file: `[Your SSH key path]`

3. **Confirm deployment** and wait for completion

4. **Access your dashboard:**
   - Open: `http://13.61.35.12`
   - Login as a job seeker
   - Click "Go to Dashboard"

---

### Option 2: Manual Upload (If you prefer manual steps)

#### Step 1: Prepare the Server
```bash
# SSH into your server
ssh -i "YOUR_KEY.pem" ubuntu@13.61.35.12

# Create backup of current build
cd /var/www/AksharJobs/frontend
sudo cp -r build build_backup_$(date +%Y%m%d_%H%M%S)

# Clean old build
sudo rm -rf build/*

# Ensure proper permissions
sudo chown -R ubuntu:www-data build
sudo chmod -R 755 build
```

#### Step 2: Upload Files from Your Computer
```cmd
# From your local machine (Windows PowerShell/CMD)
scp -i "YOUR_KEY.pem" -r C:\Users\kalpi\Desktop\AksharJobs\frontend\build\* ubuntu@13.61.35.12:/var/www/AksharJobs/frontend/build/
```

#### Step 3: Set Permissions on Server
```bash
# SSH back into server
ssh -i "YOUR_KEY.pem" ubuntu@13.61.35.12

# Set proper permissions
cd /var/www/AksharJobs/frontend/build
sudo chown -R ubuntu:www-data .
sudo chmod -R 755 .
sudo find . -type f -exec chmod 644 {} \;
```

#### Step 4: Reload Nginx
```bash
# Test Nginx configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

#### Step 5: Verify Deployment
```bash
# Check if files exist
ls -lah /var/www/AksharJobs/frontend/build/
ls -lah /var/www/AksharJobs/frontend/build/index.html

# Check Nginx status
sudo systemctl status nginx
```

---

### Option 3: Using WinSCP (GUI Method)

If you prefer a graphical interface:

1. **Download WinSCP** (if not installed): https://winscp.net/

2. **Connect to your server:**
   - Protocol: SFTP
   - Host: `13.61.35.12`
   - Port: 22
   - Username: `ubuntu`
   - Password: Leave empty
   - Advanced → SSH → Authentication → Private key file: Select your .pem file

3. **Navigate to:** `/var/www/AksharJobs/frontend/build/`

4. **Backup existing build:**
   - Right-click on `build` folder → Duplicate
   - Rename to `build_backup_[date]`

5. **Delete contents** of the `build` folder (not the folder itself)

6. **Upload new files:**
   - Local side: Navigate to `C:\Users\kalpi\Desktop\AksharJobs\frontend\build\`
   - Select all files and folders inside `build`
   - Drag and drop to the server's `build` folder

7. **Set permissions:**
   - Right-click on `build` folder → Properties → Set to `755`
   - Right-click on files → Properties → Set to `644`

8. **Reload Nginx via SSH:**
   ```bash
   sudo systemctl reload nginx
   ```

---

## Verification Checklist

After deployment, verify everything works:

- [ ] **Homepage loads:** `http://13.61.35.12`
- [ ] **No JavaScript errors** in browser console (F12)
- [ ] **Login works** for job seekers
- [ ] **"Go to Dashboard" button** appears on homepage for logged-in job seekers
- [ ] **Dashboard loads:** `http://13.61.35.12/jobseeker-dashboard`
- [ ] **All sections work:** Click each sidebar menu item
- [ ] **Buttons are functional:** Try saving a job, viewing details, etc.
- [ ] **Styling is correct:** Colors, layout, and design match expectations

---

## Troubleshooting

### Issue: "404 Not Found" on dashboard
**Solution:**
```bash
# Verify Nginx configuration
ssh -i "YOUR_KEY.pem" ubuntu@13.61.35.12
sudo nano /etc/nginx/sites-available/default

# Ensure this line exists in the location / block:
try_files $uri $uri/ /index.html;

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### Issue: "Uncaught SyntaxError: Unexpected token '<'"
**Solution:**
```bash
# This means Nginx is serving HTML instead of JS files
# Check Nginx configuration:
sudo nano /etc/nginx/sites-available/default

# Ensure root path is correct:
root /var/www/AksharJobs/frontend/build;

# Reload Nginx
sudo systemctl reload nginx
```

### Issue: "Permission denied" when uploading
**Solution:**
```bash
# On server, fix permissions:
cd /var/www/AksharJobs/frontend
sudo chown -R ubuntu:www-data build
sudo chmod -R 755 build
```

### Issue: Old content still showing
**Solution:**
1. Clear browser cache: `Ctrl + Shift + Delete`
2. Hard refresh: `Ctrl + F5`
3. Try incognito/private window
4. Check browser console for cached resources

### Issue: Backend API calls failing
**Solution:**
```bash
# Check if backend is running
ssh -i "YOUR_KEY.pem" ubuntu@13.61.35.12
pm2 status

# If not running, start it:
pm2 start akshar-backend

# Check logs:
pm2 logs akshar-backend
```

---

## Post-Deployment Tasks

### 1. Clear Browser Cache
- Open browser
- Press `Ctrl + Shift + Delete`
- Select "Cached images and files"
- Click "Clear data"

### 2. Test All Features
- Login as different user types
- Navigate all dashboard sections
- Test button interactions
- Verify saved jobs work
- Check application tracking

### 3. Monitor Logs
```bash
# Nginx access log
sudo tail -f /var/log/nginx/access.log

# Nginx error log
sudo tail -f /var/log/nginx/error.log

# Backend logs (if using PM2)
pm2 logs akshar-backend
```

---

## Quick Reference Commands

### Check Deployment Status
```bash
# SSH into server
ssh -i "YOUR_KEY.pem" ubuntu@13.61.35.12

# Check build files
ls -lah /var/www/AksharJobs/frontend/build/

# Check Nginx
sudo systemctl status nginx
sudo nginx -t

# Check backend (PM2)
pm2 status
pm2 logs akshar-backend --lines 50
```

### Rollback to Previous Version
```bash
# If something goes wrong, restore backup:
cd /var/www/AksharJobs/frontend
sudo rm -rf build
sudo cp -r build_backup_YYYYMMDD_HHMMSS build
sudo chown -R ubuntu:www-data build
sudo chmod -R 755 build
sudo systemctl reload nginx
```

---

## Success Indicators

✅ **Deployment Successful when:**
- Homepage loads without errors
- JavaScript files load correctly (check Network tab in browser DevTools)
- Dashboard is accessible at `/jobseeker-dashboard`
- All interactive features work
- No console errors
- Backend API calls work
- Login/logout functionality works

---

## Need Help?

### Useful Commands
```bash
# View last 100 lines of Nginx error log
sudo tail -n 100 /var/log/nginx/error.log

# Check disk space
df -h

# Check file permissions
ls -lah /var/www/AksharJobs/frontend/build/

# Restart Nginx (if reload doesn't work)
sudo systemctl restart nginx

# Check which files are being served
curl -I http://13.61.35.12/index.html
curl -I http://13.61.35.12/static/js/main.c6804a5b.js
```

---

**Last Updated:** October 14, 2025  
**Build Version:** main.c6804a5b.js  
**Status:** Ready for Deployment

