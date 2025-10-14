# Deploy JobSeeker Dashboard Using WinSCP (Easiest Method)

## Why WinSCP?
Your SSH key (`C:\Users\kalpi\key.pem`) is having permission issues with Windows command-line SSH. WinSCP is a free GUI tool that handles this perfectly and is much easier to use.

---

## 📥 Step 1: Download and Install WinSCP

1. **Download WinSCP:** https://winscp.net/eng/download.php
   - Click the green "DOWNLOAD WINSCP" button
   - Choose the "Installation package"

2. **Install WinSCP:**
   - Run the downloaded installer
   - Follow the installation wizard (default options are fine)
   - Launch WinSCP when installation completes

---

## 🔐 Step 2: Configure Connection to Your Server

1. **Open WinSCP** (it should open to the Login screen)

2. **Enter connection details:**
   ```
   File protocol: SFTP
   Host name: 13.61.35.12
   Port number: 22
   User name: ubuntu
   Password: (leave blank)
   ```

3. **Configure SSH Key:**
   - Click the **"Advanced..."** button
   - In the left panel, navigate to: **SSH → Authentication**
   - In "Private key file", click the **"..."** button (Browse)
   - Navigate to: `C:\Users\kalpi\key.pem`
   - Select the file
   - WinSCP might ask to convert it to PuTTY format (.ppk) - click **"OK"** if prompted
   - Click **"OK"** to close Advanced settings

4. **Save the session (optional but recommended):**
   - Click **"Save"** button
   - Session name: "AksharJobs Server"
   - Click **"OK"**

5. **Click "Login"**
   - If asked about host key, click **"Yes"** to add it to cache
   - You should now be connected!

---

## 📁 Step 3: Navigate to Correct Folders

### On the LEFT side (Your Computer):
1. Navigate to: `C:\Users\kalpi\Desktop\AksharJobs\frontend\build\`
2. You should see folders like: `static`, and files like `index.html`, `manifest.json`, etc.

### On the RIGHT side (Server):
1. Navigate to: `/var/www/AksharJobs/frontend/build/`
2. You might see old files here

---

## 🚀 Step 4: Upload Files

1. **Select ALL files and folders** in the LEFT panel (your computer's build folder)
   - Press `Ctrl+A` to select all
   - You should see: `static` folder, `index.html`, `asset-manifest.json`, etc.

2. **Drag and drop** from LEFT to RIGHT (or click the "Upload" button)

3. **When prompted about existing files:**
   - Select **"Overwrite"** or **"Yes to All"**
   - Make sure **"Remember"** or **"Use same choice for all"** is checked
   - Click **"OK"** or **"Yes"**

4. **Wait for upload to complete:**
   - You'll see a progress window
   - Should take 1-2 minutes depending on connection
   - When complete, the progress window will close

---

## ⚙️ Step 5: Set Permissions and Reload Nginx

After files are uploaded, you need to set proper permissions and reload Nginx.

### Option A: Using WinSCP's built-in terminal
1. In WinSCP, press **`Ctrl+T`** to open terminal (or Commands → Open Terminal)
2. In the terminal window, run these commands:

```bash
cd /var/www/AksharJobs/frontend/build
sudo chown -R ubuntu:www-data .
sudo chmod -R 755 .
sudo find . -type f -exec chmod 644 {} \;
sudo systemctl reload nginx
exit
```

### Option B: Using PuTTY
1. Download PuTTY: https://www.putty.org/
2. Open PuTTY
3. Load your saved session or enter:
   - Host: `13.61.35.12`
   - Port: `22`
   - Connection type: SSH
4. Under Connection → SSH → Auth → Credentials:
   - Browse to your `key.pem` file (or the `.ppk` file WinSCP created)
5. Click "Open"
6. Login as: `ubuntu`
7. Run the commands above

### Option C: Use Windows Terminal with proper permissions
1. Open PowerShell as Administrator
2. Run:
```powershell
# Fix key permissions
icacls "C:\Users\kalpi\key.pem" /inheritance:r
icacls "C:\Users\kalpi\key.pem" /grant:r "$($env:USERNAME):(R)"

# Then SSH in
ssh -i "C:\Users\kalpi\key.pem" ubuntu@13.61.35.12

# On the server, run:
cd /var/www/AksharJobs/frontend/build
sudo chown -R ubuntu:www-data .
sudo chmod -R 755 .
sudo find . -type f -exec chmod 644 {} \;
sudo systemctl reload nginx
exit
```

---

## ✅ Step 6: Verify Deployment

1. **Open your web browser**

2. **Navigate to:** `http://13.61.35.12`

3. **Clear browser cache:**
   - Press `Ctrl + Shift + Delete`
   - Select "Cached images and files"
   - Click "Clear data"

4. **Login as a job seeker:**
   - Use your job seeker credentials

5. **Look for the "Go to Dashboard" button:**
   - It should appear on the homepage after login
   - It appears alongside "Find Jobs" and "Post a Job" buttons

6. **Click "Go to Dashboard":**
   - You should be taken to: `http://13.61.35.12/jobseeker-dashboard`
   - You should see the new beautiful dashboard with sidebar

7. **Test the dashboard:**
   - Click different sidebar menu items
   - Try clicking the bookmark icon on a job card
   - Click "Apply Now" on a job
   - Navigate between sections

---

## 🎯 Expected Result

After successful deployment, you should see:

### Homepage:
- Standard homepage with hero section
- **NEW:** "Go to Dashboard" button (for logged-in job seekers)

### Dashboard (`/jobseeker-dashboard`):
- **Left sidebar** with navigation menu (Dashboard, Jobs, Applications, etc.)
- **Top bar** with search and user profile
- **Main content** area with:
  - Welcome message
  - Profile completion card (75%)
  - Statistics cards (Applications, Interviews, Profile Views, Saved Jobs)
  - Recommended jobs
  - Upcoming interviews
  - Recent applications table

### All Sections Working:
- ✅ Dashboard (overview)
- ✅ Browse Jobs
- ✅ My Applications
- ✅ Saved Jobs
- ✅ Interviews
- ✅ Recommended
- ✅ Messages
- ✅ My Profile
- ✅ Resume/CV
- ✅ Career Resources
- ✅ Settings

---

## 🔧 Troubleshooting

### Problem: WinSCP can't convert the key
**Solution:** 
- Download PuTTYgen: https://www.puttygen.com/
- Open PuTTYgen
- Click "Load" → select your `key.pem`
- Click "Save private key" → save as `key.ppk`
- Use the `.ppk` file in WinSCP

### Problem: Can't see the dashboard after deployment
**Solution:**
1. Make sure you cleared browser cache
2. Try hard refresh: `Ctrl + F5`
3. Try in incognito/private browsing mode
4. Check browser console (F12) for errors

### Problem: Dashboard loads but looks broken
**Solution:**
1. Check if all files were uploaded (especially the `static` folder)
2. Verify file permissions were set correctly
3. Check Nginx error logs:
   ```bash
   ssh -i "C:\Users\kalpi\key.pem" ubuntu@13.61.35.12
   sudo tail -f /var/log/nginx/error.log
   ```

### Problem: "404 Not Found" on dashboard route
**Solution:**
1. Verify Nginx configuration has the correct `try_files` directive
2. SSH into server and check:
   ```bash
   sudo nano /etc/nginx/sites-available/default
   # Should have: try_files $uri $uri/ /index.html;
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## 📊 Verification Checklist

After deployment, check all these:

- [ ] Homepage loads correctly
- [ ] No JavaScript console errors
- [ ] "Go to Dashboard" button visible (when logged in as job seeker)
- [ ] Dashboard loads at `/jobseeker-dashboard`
- [ ] Sidebar navigation works
- [ ] All menu items switch sections
- [ ] Job cards display correctly
- [ ] Bookmark icons work (toggle save/unsave)
- [ ] "Apply Now" buttons work
- [ ] Applications table displays
- [ ] Interview cards show up
- [ ] Profile section accessible
- [ ] Settings section accessible
- [ ] Logout button works

---

## 🎉 Success!

Once you see the dashboard loading correctly with all features working, your deployment is complete!

**Your JobSeeker Dashboard is now LIVE!** 🚀

---

## 📞 Need More Help?

If you encounter any issues:

1. **Check the files were uploaded:**
   - In WinSCP, right panel should show all files in `/var/www/AksharJobs/frontend/build/`
   - Should include `index.html`, `static` folder, etc.

2. **Verify Nginx is running:**
   ```bash
   ssh -i key.pem ubuntu@13.61.35.12
   sudo systemctl status nginx
   ```

3. **Check backend is running:**
   ```bash
   pm2 status
   pm2 logs akshar-backend --lines 20
   ```

4. **View recent Nginx logs:**
   ```bash
   sudo tail -n 50 /var/log/nginx/error.log
   sudo tail -n 50 /var/log/nginx/access.log
   ```

---

**WinSCP is the recommended method for Windows users!** It's GUI-based, handles SSH keys perfectly, and is very reliable. 💪

