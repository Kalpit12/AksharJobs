#!/bin/bash
# AksharJobs AWS Deployment Script
# Run this on your EC2 instance after connecting

set -e  # Exit on error

echo "========================================"
echo "AksharJobs AWS Deployment"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}Please don't run as root. Run as ubuntu user.${NC}"
   exit 1
fi

echo -e "${YELLOW}Step 1: System Update${NC}"
sudo apt update
sudo apt upgrade -y
echo -e "${GREEN}✅ System updated${NC}"
echo ""

echo -e "${YELLOW}Step 2: Install Dependencies${NC}"
sudo apt install -y git curl wget build-essential software-properties-common nginx
echo -e "${GREEN}✅ Basic dependencies installed${NC}"
echo ""

echo -e "${YELLOW}Step 3: Install Python 3.11${NC}"
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3.11-dev python3-pip
echo -e "${GREEN}✅ Python installed${NC}"
python3.11 --version
echo ""

echo -e "${YELLOW}Step 4: Install Node.js${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
echo -e "${GREEN}✅ Node.js installed${NC}"
node --version
npm --version
echo ""

echo -e "${YELLOW}Step 5: Install PM2${NC}"
sudo npm install -g pm2
echo -e "${GREEN}✅ PM2 installed${NC}"
pm2 --version
echo ""

echo -e "${YELLOW}Step 6: Create Application Directory${NC}"
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
echo -e "${GREEN}✅ Directory created${NC}"
echo ""

echo -e "${YELLOW}Step 7: Setup Application${NC}"
if [ ! -d "/var/www/AksharJobs" ]; then
    echo "Please upload your application files to /var/www/AksharJobs"
    echo "From your local machine, run:"
    echo "  scp -i aksharjobs-key.pem -r C:\\Users\\kalpi\\Desktop\\AksharJobs ubuntu@YOUR_IP:/var/www/"
    echo ""
    read -p "Press Enter when files are uploaded..."
fi

if [ ! -d "/var/www/AksharJobs" ]; then
    echo -e "${RED}❌ Application directory not found!${NC}"
    exit 1
fi

cd /var/www/AksharJobs
echo -e "${GREEN}✅ Found application directory${NC}"
echo ""

echo -e "${YELLOW}Step 8: Setup Backend${NC}"
cd /var/www/AksharJobs/backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
echo -e "${GREEN}✅ Backend dependencies installed${NC}"
echo ""

# Create production env if not exists
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}Creating .env.production...${NC}"
    read -p "Enter your Elastic IP or domain: " SERVER_IP
    
    SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
    JWT_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
    
    cat > .env.production << EOF
# MongoDB Atlas Configuration
MONGO_URI=mongodb+srv://akshar_admin:WDQW9zihOVlhkExy@cluster0.lkow2ar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=TalentMatchDB

# Server Configuration
HOST=0.0.0.0
PORT=3002
FLASK_ENV=production
FLASK_DEBUG=False

# URLs
FRONTEND_URL=http://${SERVER_IP}
BACKEND_URL=http://${SERVER_IP}

# Security
SECRET_KEY=${SECRET_KEY}
JWT_SECRET_KEY=${JWT_KEY}

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
GOOGLE_REDIRECT_URI=http://${SERVER_IP}/api/auth/google/callback

# Other APIs
GOOGLE_API_KEY=AIzaSyDPEUJGX5l7jQqTslQGlYEA1vqgY1o6Qi0
PESAPAL_CONSUMER_KEY=GhBv5UPv75IpMZYyAsUhe+bGkkVfPTLQ
PESAPAL_CONSUMER_SECRET=FvtqCqEat8lSIBIfE7lRkHOiI0w=
EOF
    echo -e "${GREEN}✅ Created .env.production${NC}"
else
    echo -e "${GREEN}✅ .env.production exists${NC}"
fi
echo ""

echo -e "${YELLOW}Step 9: Build Frontend${NC}"
cd /var/www/AksharJobs/frontend

npm install
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

if [ ! -f ".env.production" ]; then
    echo "REACT_APP_API_URL=http://${SERVER_IP}/api" > .env.production
fi

npm run build
echo -e "${GREEN}✅ Frontend built${NC}"
echo ""

echo -e "${YELLOW}Step 10: Configure Nginx${NC}"
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

sudo ln -sf /etc/nginx/sites-available/aksharjobs /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t
if [ $? -eq 0 ]; then
    sudo systemctl reload nginx
    echo -e "${GREEN}✅ Nginx configured${NC}"
else
    echo -e "${RED}❌ Nginx configuration error!${NC}"
    exit 1
fi
echo ""

echo -e "${YELLOW}Step 11: Setup PM2${NC}"
cd /var/www/AksharJobs

mkdir -p logs

# Create PM2 ecosystem
cat > ecosystem.config.js << 'EOF'
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
      out_file: '/var/www/AksharJobs/logs/backend-out.log'
    }
  ]
};
EOF

pm2 start ecosystem.config.js
pm2 save

echo ""
echo -e "${YELLOW}Setting up PM2 startup script...${NC}"
pm2 startup | grep "sudo" | bash

echo -e "${GREEN}✅ PM2 configured${NC}"
echo ""

echo -e "${YELLOW}Step 12: Configure Firewall${NC}"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
echo "y" | sudo ufw enable
echo -e "${GREEN}✅ Firewall configured${NC}"
echo ""

echo "========================================"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "========================================"
echo ""
echo "Your application is now live!"
echo ""
echo "Access your app at: http://${SERVER_IP}"
echo ""
echo "Useful commands:"
echo "  pm2 status              - Check backend status"
echo "  pm2 logs                - View backend logs"
echo "  pm2 restart aksharjobs-backend  - Restart backend"
echo "  sudo systemctl status nginx     - Check Nginx status"
echo ""
echo "Next steps:"
echo "1. Test your application: http://${SERVER_IP}"
echo "2. Setup domain and SSL (see AWS_DEPLOYMENT_GUIDE.md)"
echo "3. Configure backups"
echo ""
echo "For troubleshooting, see AWS_DEPLOYMENT_GUIDE.md"
echo ""

