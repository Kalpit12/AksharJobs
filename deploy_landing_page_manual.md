# 🚀 Manual AWS Deployment Guide - New Landing Page

## Quick Deployment Steps

### Prerequisites
- ✅ AWS EC2 instance running
- ✅ Your .pem key file
- ✅ EC2 Public IP address

---

## Step 1: Upload Files to AWS

### Option A: Using SCP (Recommended)
```powershell
# Replace with your actual IP and PEM file path
scp -i "C:\path\to\aksharjobs-key.pem" -r C:\Users\kalpi\Desktop\AksharJobs ubuntu@YOUR_IP:/var/www/
```

### Option B: Using FileZilla/WinSCP
1. Open FileZilla or WinSCP
2. Connect to your EC2 instance using SSH
3. Upload the entire AksharJobs folder to `/var/www/`

---

## Step 2: Connect to AWS and Deploy

### Connect via SSH
```powershell
ssh -i "C:\path\to\aksharjobs-key.pem" ubuntu@YOUR_IP
```

### Run Deployment Commands
```bash
# Navigate to project
cd /var/www/AksharJobs

# Setup Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create production environment
cat > .env.production << 'EOF'
MONGO_URI=mongodb+srv://akshar_admin:WDQW9zihOVlhkExy@cluster0.lkow2ar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=TalentMatchDB
HOST=0.0.0.0
PORT=3002
FLASK_ENV=production
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
JWT_SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
FRONTEND_URL=http://YOUR_IP
BACKEND_URL=http://YOUR_IP
GMAIL_EMAIL=kalpitpatel751@gmail.com
GMAIL_APP_PASSWORD=ihab amwy hbov ukqs
SUPABASE_URL=https://tszbswgpyuymnchngcii.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzemJzd2dweXV5bW5jaG5nY2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODI4NDcsImV4cCI6MjA3MDU1ODg0N30.A1a8BYsqOdo1PWenIwna3ThJbkgsmby1hs-9mjiJW8g
GEMINI_API_KEY=AIzaSyBZ3B2OxY-5kXWR2Pe5mb6-nV68gTSJKnA
CLOUDINARY_CLOUD_NAME=drjafm0to
CLOUDINARY_API_KEY=669253238363449
CLOUDINARY_API_SECRET=PTIJiQCtPeVtzkvTJ3crQyWdosQ
GOOGLE_CLIENT_ID=1080296046243-jho2bd61jappal9jnlbg9ih8vietc241.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=http://YOUR_IP/api/auth/google/callback
GOOGLE_API_KEY=AIzaSyDPEUJGX5l7jQqTslQGlYEA1vqgY1o6Qi0
PESAPAL_CONSUMER_KEY=GhBv5UPv75IpMZYyAsUhe+bGkkVfPTLQ
PESAPAL_CONSUMER_SECRET=FvtqCqEat8lSIBIfE7lRkHOiI0w=
EOF

# Build Frontend
cd ../frontend
npm install
echo "REACT_APP_API_URL=http://YOUR_IP/api" > .env.production
npm run build

# Configure Nginx
sudo tee /etc/nginx/sites-available/aksharjobs > /dev/null << 'EOF'
upstream backend {
    server 127.0.0.1:3002;
}

server {
    listen 80;
    listen [::]:80;
    server_name _;
    
    client_max_body_size 10M;
    
    root /var/www/AksharJobs/frontend/build;
    index index.html;
    
    access_log /var/log/nginx/aksharjobs-access.log;
    error_log /var/log/nginx/aksharjobs-error.log;
    
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
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    location /socket.io/ {
        proxy_pass http://backend/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    location /static/ {
        alias /var/www/AksharJobs/frontend/build/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/javascript application/json application/javascript;
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/aksharjobs /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Start Backend with PM2
cd /var/www/AksharJobs/backend
pm2 delete aksharjobs-backend 2>/dev/null || true
pm2 start venv/bin/python3 --name aksharjobs-backend -- app.py
pm2 save

echo "✅ Deployment complete!"
echo "Your new landing page is live at: http://YOUR_IP"
```

---

## Step 3: Verify Deployment

### Check Backend Status
```bash
pm2 status
pm2 logs aksharjobs-backend
```

### Check Nginx Status
```bash
sudo systemctl status nginx
sudo nginx -t
```

### Test Your Site
Open your browser and visit: `http://YOUR_IP`

You should see the new futuristic landing page with:
- ✨ Glassmorphic navbar
- 🎭 Animated hero section
- 💫 Floating elements
- 🌟 Interactive cards
- 📊 Animated statistics
- 🤖 Floating AI chatbot

---

## Troubleshooting

### If Backend Won't Start
```bash
cd /var/www/AksharJobs/backend
source venv/bin/activate
python3 app.py  # Check for errors
```

### If Frontend Won't Load
```bash
ls -la /var/www/AksharJobs/frontend/build/  # Check if build exists
sudo tail -f /var/log/nginx/error.log  # Check Nginx errors
```

### If API Calls Fail
```bash
pm2 logs aksharjobs-backend  # Check backend logs
curl http://localhost:3002/api/health  # Test backend directly
```

---

## New Landing Page Features

### ✨ What's New
1. **Futuristic Design**: Deep navy background with electric blue and violet gradients
2. **Glassmorphic Elements**: Transparent cards with blur effects
3. **Enhanced Logo**: Glowing logo with hover animations in navbar and hero
4. **Animated Hero**: Floating icons, neural network particles, and AI globe
5. **Interactive Cards**: Hover effects with glow and lift animations
6. **Animated Statistics**: Count-up animations with particle effects
7. **Floating Chatbot**: Pulsing AI assistant in bottom-right corner
8. **Responsive Design**: Optimized for all screen sizes

### 🎨 Visual Improvements
- **Typography**: Orbitron for headings, Poppins for body text
- **Colors**: Professional deep navy with electric blue/violet accents
- **Animations**: Smooth Framer Motion transitions
- **Effects**: Glow, blur, gradient, and particle animations

### 📱 Mobile Optimized
- Stacked layouts for mobile devices
- Touch-friendly buttons (44px minimum)
- Optimized font sizes and spacing
- Responsive grid systems

---

## Post-Deployment

### Optional: Add Domain & SSL
1. **Point Domain**: Add A record pointing to your EC2 IP
2. **Install SSL**: `sudo certbot --nginx -d yourdomain.com`
3. **Update URLs**: Change HTTP to HTTPS in environment files

### Monitor Performance
```bash
pm2 monit  # Monitor backend performance
sudo htop  # Check system resources
```

---

## 🎉 Success!

Your new futuristic landing page is now live! 

**Visit**: `http://YOUR_IP`

The landing page now features:
- Professional, AI-powered aesthetic
- Smooth animations and interactions
- Enhanced logo with glow effects
- Modern glassmorphic design
- Fully responsive layout
- Interactive floating elements

Enjoy your new landing page! 🚀
