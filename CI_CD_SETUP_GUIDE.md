# 🚀 GitHub Actions CI/CD Setup Guide

## 🎯 **Production-Grade Automated Deployment**

Transform your deployment from manual uploads to fully automated CI/CD with GitHub Actions!

---

## 📋 **What You'll Get**

✅ **Push to Deploy** - Commit changes, push to main, and deployment happens automatically
✅ **Zero Manual Work** - No more SSH sessions or file uploads
✅ **Automatic Backups** - Last 5 deployments auto-saved for quick rollback
✅ **Health Checks** - Automatic verification after each deployment
✅ **Team Ready** - Multiple developers can deploy seamlessly
✅ **Audit Trail** - All deployments logged and tracked on GitHub

---

## 🚀 **Quick Start (5 Minutes)**

### **Step 1: Generate SSH Key on EC2**
```bash
# SSH into your EC2 instance
ssh -i aksharjobs-key.pem ubuntu@13.61.35.12

# Generate new SSH key for GitHub
ssh-keygen -t rsa -b 4096 -C "github-deploy"
# Press Enter for all prompts (no passphrase)

# Display public key
cat ~/.ssh/id_rsa.pub
# Copy this output ☝️
```

### **Step 2: Add Deploy Key to GitHub**
1. Go to your GitHub repo
2. **Settings** → **Deploy Keys** → **Add deploy key**
3. Title: `EC2 Deploy Key`
4. Paste the public key from Step 1
5. ✅ **Check "Allow write access"** (important!)
6. Click **Add key**

### **Step 3: Get Private Key**
```bash
# Still on EC2, display private key
cat ~/.ssh/id_rsa
# Copy the ENTIRE output including BEGIN and END lines
```

### **Step 4: Add GitHub Secrets**

Go to: **Repo** → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Create these **3 secrets**:

| Name | Value |
|------|-------|
| `EC2_HOST` | `13.61.35.12` (your EC2 IP) |
| `EC2_USER` | `ubuntu` |
| `EC2_KEY` | Private key from Step 3 (entire content) |

### **Step 5: Configure EC2**
```bash
# Still SSH'd into EC2

# Set Git remote to SSH
cd /var/www/AksharJobs
git remote set-url origin git@github.com:YOUR_USERNAME/AksharJobs.git

# Test GitHub connection
ssh -T git@github.com
# Should see: "Hi YOUR_USERNAME! You've successfully authenticated..."

# Setup passwordless sudo for deployment
echo "ubuntu ALL=(ALL) NOPASSWD: /bin/cp, /bin/rm, /bin/chown, /bin/chmod, /usr/bin/systemctl reload nginx" | sudo tee /etc/sudoers.d/github-deploy
sudo chmod 440 /etc/sudoers.d/github-deploy
```

### **Step 6: Test It! 🎉**
```bash
# Make a small change
echo "# CI/CD Test" >> README.md

# Commit and push
git add .
git commit -m "Test CI/CD deployment"
git push origin main

# 🎊 Go to GitHub → Actions tab and watch it deploy!
```

---

## 🔧 **Workflow Features**

Your workflow (`.github/workflows/deploy.yml`) includes:

| Feature | Description |
|---------|-------------|
| 🚀 **Auto-trigger** | Deploys on every push to `main` |
| 🔘 **Manual trigger** | Can also run manually from Actions tab |
| 📦 **Frontend build** | Builds React app in GitHub cloud |
| ⬆️ **File upload** | Transfers build files to EC2 |
| 🔄 **Git pull** | Updates backend code |
| 💾 **Auto backup** | Saves current version before deploying |
| 📚 **Dependency update** | Installs/updates pip packages |
| 🔄 **Service restart** | Restarts PM2 backend processes |
| 🔐 **Permission fix** | Sets correct file permissions |
| 🌐 **Nginx reload** | Applies changes without downtime |
| 🧹 **Cleanup** | Removes old backups (keeps last 5) |
| ✅ **Health check** | Verifies deployment success |

---

## 📊 **Deployment Process**

```
Developer pushes code
        ↓
GitHub Actions starts
        ↓
Install Node.js & dependencies
        ↓
Build React frontend
        ↓
Upload build to EC2 (/tmp)
        ↓
SSH into EC2
        ↓
Create backup of current version
        ↓
Pull latest code from GitHub
        ↓
Replace old build with new build
        ↓
Update backend Python dependencies
        ↓
Restart PM2 processes
        ↓
Set file permissions
        ↓
Reload Nginx
        ↓
Run health checks
        ↓
✅ Deployment complete!
```

**Total time**: ~2-3 minutes ⚡

---

## 🎮 **How to Use**

### Automatic Deployment (Default)
```bash
# 1. Make your changes
git add .
git commit -m "Add new feature"
git push origin main

# 2. Done! Check GitHub Actions tab to watch it deploy
```

### Manual Deployment
1. Go to GitHub → **Actions** tab
2. Click **Deploy AksharJobs to EC2**
3. Click **Run workflow** → Select `main` → **Run workflow**

---

## 🔍 **Monitoring Deployments**

### On GitHub
- **Actions** tab shows all deployments
- Click any workflow to see detailed logs
- Green ✅ = Success
- Red ❌ = Failed (click to see error logs)

### On EC2
```bash
# Check PM2 status
pm2 status

# View PM2 logs
pm2 logs

# Check Nginx
sudo systemctl status nginx

# List recent deployments
ls -lh /var/www/AksharJobs/frontend/ | grep build_backup
```

---

## 🔄 **Rollback Procedure**

If a deployment breaks something:

```bash
# SSH to EC2
ssh -i aksharjobs-key.pem ubuntu@13.61.35.12

# List available backups
cd /var/www/AksharJobs/frontend
ls -lh | grep build_backup

# Example output:
# build_backup_20250114_143022
# build_backup_20250114_120015

# Restore previous version (replace with actual backup name)
sudo rm -rf build
sudo cp -r build_backup_20250114_120015 build
sudo chown -R www-data:www-data build
sudo chmod -R 755 build
sudo systemctl reload nginx

# Done! Previous version is now live
```

---

## 🚨 **Troubleshooting**

### ❌ Error: "Permission denied (publickey)"

**Cause**: Deploy key not configured or doesn't have write access

**Fix**:
```bash
# On EC2, test GitHub connection
ssh -T git@github.com

# Should see success message
# If not, check deploy key in GitHub Settings → Deploy Keys
```

### ❌ Error: "sudo: no tty present"

**Cause**: Ubuntu user needs passwordless sudo

**Fix**:
```bash
# On EC2
echo "ubuntu ALL=(ALL) NOPASSWD: /bin/cp, /bin/rm, /bin/chown, /bin/chmod, /usr/bin/systemctl reload nginx" | sudo tee /etc/sudoers.d/github-deploy
sudo chmod 440 /etc/sudoers.d/github-deploy
```

### ❌ Error: "npm ERR! code ELIFECYCLE"

**Cause**: Build failed

**Fix**: 
- Check GitHub Actions logs for specific error
- Test build locally: `cd frontend && npm run build`
- Fix errors and push again

### ❌ Changes not showing on website

**Cause**: Browser cache or deployment incomplete

**Fix**:
```bash
# Clear browser cache (Ctrl+Shift+Delete)

# On EC2, verify files updated
ls -lh /var/www/AksharJobs/frontend/build/
# Check timestamp on files

# Force Nginx reload
sudo systemctl reload nginx
```

---

## 🎯 **Best Practices**

1. ✅ **Use feature branches** for development
2. ✅ **Test locally** before pushing to main
3. ✅ **Watch first deployment** to ensure it works
4. ✅ **Check Actions tab** after each push
5. ✅ **Monitor PM2 logs** after deployment
6. ✅ **Keep backups** for quick rollback
7. ✅ **Document changes** in commit messages

---

## 🔐 **Security Notes**

✅ **SSH keys** stored in GitHub Secrets (encrypted)
✅ **Limited sudo** access (only required commands)
✅ **No passwords** in code or config files
✅ **Deploy keys** with write access only to this repo
✅ **Automatic backups** for recovery

---

## 📚 **Additional Resources**

- **Detailed Guide**: `GITHUB_ACTIONS_CICD_SETUP.md`
- **Quick Reference**: `CICD_QUICK_REFERENCE.md`
- **Workflow File**: `.github/workflows/deploy.yml`
- **PM2 Guide**: `PM2_DEPLOYMENT_GUIDE.md`

---

## 🎊 **You're Ready to Deploy!**

Once setup is complete, your workflow is simply:

```bash
git add .
git commit -m "Your changes"
git push origin main
# ✨ Magic happens!
```

**No more**: Manual SSH, WinSCP uploads, file permissions fixes, service restarts

**You get**: Automated, tested, production-grade deployments! 🚀

---

**Questions?** Check the detailed setup guide or GitHub Actions logs!
