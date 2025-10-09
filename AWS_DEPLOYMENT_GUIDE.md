# 🚀 AWS Deployment Guide - AksharJobs

Complete guide to deploy your full-stack application (React + Flask + MongoDB Atlas) on AWS.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [AWS Setup](#aws-setup)
4. [EC2 Instance Setup](#ec2-instance-setup)
5. [Server Configuration](#server-configuration)
6. [Application Deployment](#application-deployment)
7. [Domain & SSL Setup](#domain--ssl-setup)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

---

## 📊 Overview

### Your Application Stack

| Component | Technology | Port | Status |
|-----------|------------|------|--------|
| **Frontend** | React 18.2 | 3003 | ✅ Ready |
| **Backend** | Flask (Python) | 3002 | ✅ Ready |
| **Database** | MongoDB Atlas | Cloud | ✅ Migrated |
| **Web Server** | Nginx | 80/443 | To setup |

### Deployment Architecture

```
Internet
    │
    ▼
Your Domain (e.g., aksharjobs.com)
    │
    ▼
AWS Route 53 (DNS)
    │
    ▼
AWS EC2 Instance
    │
    ├── Nginx (Port 80/443)
    │   ├── /api/* → Backend (Port 3002)
    │   └── /* → Frontend (Static files)
    │
    ├── Backend (Flask - Port 3002)
    │   └── MongoDB Atlas (Cloud)
    │
    └── Frontend Build (Served by Nginx)
```

---

## ✅ Prerequisites

### What You Need

- [ ] AWS Account (Free tier eligible)
- [ ] Domain name (optional, recommended for production)
- [ ] SSH client (PuTTY for Windows, or built-in SSH)
- [ ] Your MongoDB Atlas credentials (already have)
- [ ] Credit card for AWS (required even for free tier)

### Costs Estimate

**Free Tier (First 12 months):**
- ✅ EC2 t2.micro instance: Free
- ✅ 30 GB EBS storage: Free
- ✅ 750 hours/month: Free
- ✅ MongoDB Atlas M0: Free (already using)

**After Free Tier:**
- EC2 t3.micro: ~$7-10/month
- Domain: ~$12/year
- SSL Certificate: Free (Let's Encrypt)

---

## 🔐 AWS Setup

### Step 1: Create AWS Account

1. Go to https://aws.amazon.com/
2. Click **"Create an AWS Account"**
3. Follow signup process:
   - Email address
   - Password
   - Account name: `AksharJobs`
4. Enter payment information (required)
5. Verify phone number
6. Choose **Basic Support (Free)**
7. Complete sign up

### Step 2: Access AWS Console

1. Sign in to AWS Console: https://console.aws.amazon.com/
2. Select region: Choose closest to you
   - **Mumbai:** `ap-south-1` (Recommended for India)
   - **Singapore:** `ap-southeast-1`
   - **US East:** `us-east-1`

---

## 🖥️ EC2 Instance Setup

### Step 1: Launch EC2 Instance

1. **Go to EC2 Dashboard**
   - Search "EC2" in AWS Console
   - Click "Launch Instance"

2. **Name and Tags**
   ```
   Name: AksharJobs-Production
   ```

3. **Choose AMI (Operating System)**
   - Select: **Ubuntu Server 22.04 LTS**
   - 64-bit (x86)
   - ✅ Free tier eligible

4. **Choose Instance Type**
   - Select: **t2.micro** (Free tier)
   - 1 vCPU, 1 GB RAM
   - (Upgrade to t3.small if needed later)

5. **Key Pair (Important!)**
   - Click "Create new key pair"
   - Name: `aksharjobs-key`
   - Type: RSA
   - Format: `.pem` (Linux/Mac) or `.ppk` (Windows/PuTTY)
   - **Download and save securely!**
   - ⚠️ **You can't download it again!**

6. **Network Settings**
   - ✅ Allow SSH traffic from: My IP
   - ✅ Allow HTTPS traffic from the internet
   - ✅ Allow HTTP traffic from the internet

7. **Configure Storage**
   - 20 GB gp3 SSD (Free tier: 30 GB)
   - Root volume

8. **Advanced Details**
   - Keep defaults

9. **Review and Launch**
   - Click **"Launch Instance"**
   - Wait 2-3 minutes for instance to start

### Step 2: Configure Security Group

1. Go to **EC2** → **Security Groups**
2. Find your instance's security group
3. **Add Inbound Rules:**

| Type | Protocol | Port | Source | Description |
|------|----------|------|--------|-------------|
| SSH | TCP | 22 | My IP | SSH access |
| HTTP | TCP | 80 | 0.0.0.0/0 | Web traffic |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Secure web |
| Custom TCP | TCP | 3002 | 0.0.0.0/0 | Backend API (temporary) |
| Custom TCP | TCP | 3003 | 0.0.0.0/0 | Frontend (temporary) |

**Note:** Remove ports 3002 and 3003 after Nginx setup.

### Step 3: Allocate Elastic IP

1. Go to **EC2** → **Elastic IPs**
2. Click **"Allocate Elastic IP address"**
3. Click **"Allocate"**
4. Select the IP → **Actions** → **Associate Elastic IP address**
5. Select your instance
6. Click **"Associate"**

**Your Static IP:** ___________________ (Note this down!)

---

## 🔧 Server Configuration

### Step 1: Connect to EC2

#### On Windows (Using PowerShell)

```powershell
# Navigate to where you saved the .pem file
cd Downloads

# Set correct permissions (if needed)
icacls aksharjobs-key.pem /inheritance:r
icacls aksharjobs-key.pem /grant:r "$($env:USERNAME):(R)"

# Connect to EC2
ssh -i aksharjobs-key.pem ubuntu@YOUR_ELASTIC_IP
```

#### On Mac/Linux

```bash
# Set correct permissions
chmod 400 aksharjobs-key.pem

# Connect to EC2
ssh -i aksharjobs-key.pem ubuntu@YOUR_ELASTIC_IP
```

**First time:** Type `yes` when asked about authenticity.

### Step 2: Update System

```bash
# Update package lists
sudo apt update

# Upgrade installed packages
sudo apt upgrade -y

# Install essential tools
sudo apt install -y git curl wget build-essential software-properties-common
```

### Step 3: Install Python & pip

```bash
# Install Python 3.11
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3.11-dev python3-pip

# Set Python 3.11 as default
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1

# Verify installation
python3 --version  # Should show Python 3.11.x
pip3 --version
```

### Step 4: Install Node.js & npm

```bash
# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher
```

### Step 5: Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx

# Test: Open http://YOUR_ELASTIC_IP in browser
# You should see "Welcome to nginx!"
```

### Step 6: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### Step 7: Setup Firewall

```bash
# Configure UFW firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status
```

---

## 🚀 Application Deployment

### Step 1: Clone Your Repository

```bash
# Create application directory
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www

# Clone your repository
# Option A: If you have it on GitHub
git clone https://github.com/YOUR_USERNAME/AksharJobs.git
cd AksharJobs

# Option B: Upload files using SCP (from your local machine)
# scp -i aksharjobs-key.pem -r C:\Users\kalpi\Desktop\AksharJobs ubuntu@YOUR_ELASTIC_IP:/var/www/
```

**If you don't have a Git repository yet, see [Alternative: Upload Files](#alternative-upload-files)**

### Step 2: Setup Backend

```bash
cd /var/www/AksharJobs/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create production environment file
nano .env.production
```

**Add this content to `.env.production`:**

```env
# MongoDB Atlas Configuration
MONGO_URI=mongodb+srv://akshar_admin:WDQW9zihOVlhkExy@cluster0.lkow2ar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=TalentMatchDB

# Server Configuration
HOST=0.0.0.0
PORT=3002
FLASK_ENV=production
FLASK_DEBUG=False

# Frontend URL (update with your domain later)
FRONTEND_URL=http://YOUR_ELASTIC_IP
BACKEND_URL=http://YOUR_ELASTIC_IP

# Security
SECRET_KEY=GENERATE_A_NEW_SECRET_KEY_HERE
JWT_SECRET_KEY=GENERATE_A_NEW_JWT_KEY_HERE

# Gmail SMTP
GMAIL_EMAIL=kalpitpatel751@gmail.com
GMAIL_APP_PASSWORD=ihab amwy hbov ukqs

# Supabase
SUPABASE_URL=https://tszbswgpyuymnchngcii.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzemJzd2dweXV5bW5jaG5nY2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODI4NDcsImV4cCI6MjA3MDU1ODg0N30.A1a8BYsqOdo1PWenIwna3ThJbkgsmby1hs-9mjiJW8g

# Gemini AI
GEMINI_API_KEY=AIzaSyBZ3B2OxY-5kXWR2Pe5mb6-nV68gTSJKnA

# Cloudinary
CLOUDINARY_CLOUD_NAME=drjafm0to
CLOUDINARY_API_KEY=669253238363449
CLOUDINARY_API_SECRET=PTIJiQCtPeVtzkvTJ3crQyWdosQ

# Google OAuth
GOOGLE_CLIENT_ID=1080296046243-jho2bd61jappal9jnlbg9ih8vietc241.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=http://YOUR_ELASTIC_IP/api/auth/google/callback

# Other APIs
GOOGLE_API_KEY=AIzaSyDPEUJGX5l7jQqTslQGlYEA1vqgY1o6Qi0
PESAPAL_CONSUMER_KEY=GhBv5UPv75IpMZYyAsUhe+bGkkVfPTLQ
PESAPAL_CONSUMER_SECRET=FvtqCqEat8lSIBIfE7lRkHOiI0w=
```

**Save:** Ctrl+O, Enter, Ctrl+X

**Generate New Secret Keys:**
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
# Copy output and replace SECRET_KEY and JWT_SECRET_KEY
```

### Step 3: Test Backend

```bash
# Still in /var/www/AksharJobs/backend with venv activated
python3 app.py
```

**You should see:**
```
[OK] MongoDB connected successfully!
* Running on http://0.0.0.0:3002
```

**Test from another terminal:**
```bash
curl http://localhost:3002/api/health
```

**Stop the test:** Ctrl+C

### Step 4: Setup Backend with PM2

```bash
# Create PM2 ecosystem file
cd /var/www/AksharJobs
nano ecosystem.config.js
```

**Add this content:**

```javascript
module.exports = {
  apps: [
    {
      name: 'aksharjobs-backend',
      cwd: '/var/www/AksharJobs/backend',
      script: '/var/www/AksharJobs/backend/venv/bin/python3',
      args: 'app.py',
      env: {
        FLASK_ENV: 'production',
        PYTHONUNBUFFERED: '1'
      },
      interpreter: 'none',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      error_file: '/var/www/AksharJobs/logs/backend-error.log',
      out_file: '/var/www/AksharJobs/logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
```

**Save and start:**

```bash
# Create logs directory
mkdir -p /var/www/AksharJobs/logs

# Start backend with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command it outputs (sudo ...)

# Check status
pm2 status
pm2 logs aksharjobs-backend
```

### Step 5: Build Frontend

```bash
cd /var/www/AksharJobs/frontend

# Install dependencies
npm install

# Create production environment file
nano .env.production
```

**Add this content:**

```env
REACT_APP_API_URL=http://YOUR_ELASTIC_IP/api
```

**Build for production:**

```bash
npm run build
```

**This creates a `build/` folder with optimized files.**

---

## 🌐 Nginx Configuration

### Step 1: Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/aksharjobs
```

**Add this configuration:**

```nginx
# Backend API server
upstream backend {
    server 127.0.0.1:3002;
}

server {
    listen 80;
    listen [::]:80;
    server_name YOUR_ELASTIC_IP;  # Replace with your domain later
    
    # Increase upload size for resumes
    client_max_body_size 10M;
    
    # Root directory for frontend
    root /var/www/AksharJobs/frontend/build;
    index index.html;
    
    # Logging
    access_log /var/log/nginx/aksharjobs-access.log;
    error_log /var/log/nginx/aksharjobs-error.log;
    
    # API routes - proxy to backend
    location /api/ {
        proxy_pass http://backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Socket.io support (if using websockets)
    location /socket.io/ {
        proxy_pass http://backend/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files - serve directly
    location /static/ {
        alias /var/www/AksharJobs/frontend/build/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # React Router - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;
}
```

### Step 2: Enable Configuration

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/aksharjobs /etc/nginx/sites-enabled/

# Remove default configuration
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

### Step 3: Test Your Application

Open browser and visit: `http://YOUR_ELASTIC_IP`

**You should see your AksharJobs application! 🎉**

---

## 🔒 Domain & SSL Setup

### Option 1: Using a Domain Name

#### Step 1: Point Domain to EC2

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add an **A Record**:
   - Type: `A`
   - Name: `@` (for root) or `www`
   - Value: `YOUR_ELASTIC_IP`
   - TTL: 3600

3. Add CNAME (optional):
   - Type: `CNAME`
   - Name: `www`
   - Value: `your domain.com`

**Wait 10-60 minutes for DNS propagation.**

#### Step 2: Install SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose redirect HTTP to HTTPS: Yes (2)

# Test auto-renewal
sudo certbot renew --dry-run
```

**Certbot automatically updates your Nginx config for HTTPS!**

#### Step 3: Update Environment Variables

Update these files with your domain:

**Backend: `/var/www/AksharJobs/backend/.env.production`**
```env
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://yourdomain.com
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
```

**Frontend: `/var/www/AksharJobs/frontend/.env.production`**
```env
REACT_APP_API_URL=https://yourdomain.com/api
```

**Rebuild frontend:**
```bash
cd /var/www/AksharJobs/frontend
npm run build

# Restart backend
pm2 restart aksharjobs-backend
```

---

## 📊 Monitoring & Maintenance

### PM2 Commands

```bash
# Check status
pm2 status

# View logs
pm2 logs aksharjobs-backend
pm2 logs aksharjobs-backend --lines 100

# Restart
pm2 restart aksharjobs-backend

# Stop
pm2 stop aksharjobs-backend

# Monitor
pm2 monit
```

### System Monitoring

```bash
# Check disk space
df -h

# Check memory
free -h

# Check CPU
top

# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/aksharjobs-access.log
sudo tail -f /var/log/nginx/aksharjobs-error.log
```

### Automated Backups

Create backup script:

```bash
nano /var/www/AksharJobs/backup.sh
```

```bash
#!/bin/bash
# Backup script for AksharJobs

BACKUP_DIR="/var/www/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application code
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/AksharJobs

# Backup Nginx config
tar -czf $BACKUP_DIR/nginx_$DATE.tar.gz /etc/nginx/sites-available/aksharjobs

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

**Make executable and schedule:**

```bash
chmod +x /var/www/AksharJobs/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add this line:
0 2 * * * /var/www/AksharJobs/backup.sh >> /var/www/AksharJobs/logs/backup.log 2>&1
```

---

## 🆘 Troubleshooting

### Issue 1: Backend Not Starting

```bash
# Check logs
pm2 logs aksharjobs-backend --lines 50

# Test manually
cd /var/www/AksharJobs/backend
source venv/bin/activate
python3 app.py

# Check MongoDB connection
python3 -c "from pymongo import MongoClient; client = MongoClient('YOUR_MONGO_URI'); client.admin.command('ping'); print('OK')"
```

### Issue 2: Frontend Shows 502 Bad Gateway

```bash
# Check if backend is running
pm2 status

# Check Nginx error logs
sudo tail -f /var/log/nginx/aksharjobs-error.log

# Restart services
pm2 restart aksharjobs-backend
sudo systemctl restart nginx
```

### Issue 3: API Calls Failing (CORS)

Update backend CORS configuration in `app.py`:

```python
CORS(app, 
     origins=["https://yourdomain.com", "http://yourdomain.com"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True)
```

### Issue 4: Large File Upload Fails

Increase limits in Nginx:

```bash
sudo nano /etc/nginx/sites-available/aksharjobs
```

Add inside `server` block:
```nginx
client_max_body_size 50M;
```

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Issue 5: Out of Memory

```bash
# Check memory usage
free -h

# Add swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 📝 Deployment Checklist

- [ ] EC2 instance created and running
- [ ] Elastic IP allocated and associated
- [ ] Security groups configured
- [ ] SSH access working
- [ ] System updated
- [ ] Python, Node.js, Nginx installed
- [ ] Application code deployed
- [ ] Backend dependencies installed
- [ ] Frontend built successfully
- [ ] PM2 configured and running backend
- [ ] Nginx configured as reverse proxy
- [ ] Application accessible via IP
- [ ] Domain configured (optional)
- [ ] SSL certificate installed (optional)
- [ ] Environment variables set correctly
- [ ] MongoDB Atlas connection verified
- [ ] Backups configured
- [ ] Monitoring setup

---

## 🎓 Next Steps

1. **Custom Domain** - Register and configure
2. **SSL Certificate** - Secure with HTTPS
3. **CDN** - Add CloudFront for faster delivery
4. **Monitoring** - Setup CloudWatch or alternative
5. **CI/CD** - Automate deployments with GitHub Actions
6. **Scaling** - Add Load Balancer when needed
7. **Database Replica** - Atlas supports automatic replication

---

## 📞 Support Resources

- **AWS Documentation:** https://docs.aws.amazon.com/
- **EC2 User Guide:** https://docs.aws.amazon.com/ec2/
- **Nginx Documentation:** https://nginx.org/en/docs/
- **PM2 Documentation:** https://pm2.keymetrics.io/docs/
- **Let's Encrypt:** https://letsencrypt.org/docs/

---

**Total Deployment Time:** 30-60 minutes

**Cost (Free Tier):** $0/month for first year

**Your application will be live at:** `http://YOUR_ELASTIC_IP`

Good luck with your deployment! 🚀

