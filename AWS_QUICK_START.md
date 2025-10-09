# ⚡ AWS Deployment - Quick Start

**Get your AksharJobs app live on AWS in 30 minutes!**

---

## 🎯 Prerequisites

✅ MongoDB Atlas (Done - 192 documents migrated)  
✅ AWS Account  
✅ 30-60 minutes of time

---

## 🚀 5-Step Deployment

### Step 1: Launch EC2 (5 min)

1. Go to [AWS EC2 Console](https://console.aws.amazon.com/ec2/)
2. Click **"Launch Instance"**
3. Choose:
   - Name: `AksharJobs-Production`
   - OS: **Ubuntu 22.04 LTS**
   - Instance type: **t2.micro** (Free tier)
   - Create new key pair: `aksharjobs-key.pem` ⚠️ **Download & save!**
   - Allow: SSH, HTTP, HTTPS
4. Click **"Launch"**

### Step 2: Get Elastic IP (2 min)

1. Go to **EC2** → **Elastic IPs**
2. Click **"Allocate"**
3. Associate with your instance
4. **Note your IP:** ___________________

### Step 3: Connect & Setup (10 min)

```powershell
# Connect to EC2
ssh -i aksharjobs-key.pem ubuntu@YOUR_IP

# Run setup script (copy-paste all at once)
sudo apt update && sudo apt upgrade -y && \
sudo apt install -y git curl wget nginx && \
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && \
sudo apt install -y nodejs && \
sudo npm install -g pm2 && \
sudo add-apt-repository ppa:deadsnakes/ppa -y && \
sudo apt install -y python3.11 python3.11-venv python3-pip && \
echo "✅ Setup complete!"
```

### Step 4: Deploy Application (10 min)

```bash
# Create directory
sudo mkdir -p /var/www && sudo chown -R $USER:$USER /var/www
cd /var/www

# Upload your code (from local machine):
# scp -i aksharjobs-key.pem -r C:\Users\kalpi\Desktop\AksharJobs ubuntu@YOUR_IP:/var/www/

# OR clone from GitHub:
# git clone https://github.com/YOUR_REPO/AksharJobs.git

# Setup Backend
cd AksharJobs/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create production env
cat > .env.production << EOF
MONGO_URI=mongodb+srv://akshar_admin:WDQW9zihOVlhkExy@cluster0.lkow2ar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=TalentMatchDB
HOST=0.0.0.0
PORT=3002
FLASK_ENV=production
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
EOF

# Test backend
python3 app.py  # Should see: MongoDB connected successfully!
# Press Ctrl+C to stop

# Build Frontend
cd ../frontend
npm install
echo "REACT_APP_API_URL=http://YOUR_IP/api" > .env.production
npm run build
```

### Step 5: Configure Nginx & Start (5 min)

```bash
# Configure Nginx
sudo tee /etc/nginx/sites-available/aksharjobs << 'EOF'
upstream backend { server 127.0.0.1:3002; }
server {
    listen 80;
    server_name _;
    root /var/www/AksharJobs/frontend/build;
    index index.html;
    client_max_body_size 10M;
    
    location /api/ {
        proxy_pass http://backend/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location / { try_files $uri /index.html; }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/aksharjobs /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Start backend with PM2
cd /var/www/AksharJobs/backend
pm2 start venv/bin/python3 --name aksharjobs-backend -- app.py
pm2 save
pm2 startup  # Run the command it outputs

# Check status
pm2 status
```

---

## ✅ Verify

Open: **http://YOUR_IP**

You should see AksharJobs! 🎉

---

## 🔒 Optional: Add Domain & SSL

### With Domain (e.g., aksharjobs.com)

1. **Point Domain to IP**
   - Add A Record: `@` → `YOUR_IP`

2. **Install SSL**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d aksharjobs.com -d www.aksharjobs.com
   ```

3. **Update URLs**
   ```bash
   # Update frontend
   cd /var/www/AksharJobs/frontend
   echo "REACT_APP_API_URL=https://aksharjobs.com/api" > .env.production
   npm run build
   
   # Restart backend
   pm2 restart aksharjobs-backend
   ```

---

## 🛠️ Common Commands

```bash
# View logs
pm2 logs aksharjobs-backend

# Restart app
pm2 restart aksharjobs-backend

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Update code
cd /var/www/AksharJobs
git pull
cd frontend && npm run build
pm2 restart aksharjobs-backend
```

---

## 📊 Costs

**Free Tier (12 months):** $0/month
- EC2 t2.micro
- 30 GB storage
- MongoDB Atlas M0

**After Free Tier:** ~$10-15/month
- EC2 t3.micro
- Elastic IP
- Storage

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't connect to EC2 | Check security group allows SSH from your IP |
| 502 Bad Gateway | Check `pm2 status`, restart backend |
| Frontend not loading | Verify build exists: `ls /var/www/AksharJobs/frontend/build` |
| API errors | Check backend logs: `pm2 logs` |

---

## 📚 Full Guide

For detailed instructions, see: `AWS_DEPLOYMENT_GUIDE.md`

---

**Quick Links:**
- EC2 Console: https://console.aws.amazon.com/ec2/
- Your App: http://YOUR_IP
- Atlas Dashboard: https://cloud.mongodb.com

**Deployment Time:** ~30 minutes  
**Difficulty:** Intermediate  
**Cost:** Free (first 12 months)

🚀 **Happy Deploying!**

