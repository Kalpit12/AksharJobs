
@echo off
echo ========================================
echo   🚀 Deploy New Landing Page to AWS
echo ========================================
echo.

echo Step 1: Checking build files...
if not exist "frontend\build" (
    echo ❌ Build folder not found! Building now...
    cd frontend
    call npm run build
    cd ..
) else (
    echo ✅ Build folder exists
)
echo.

echo Step 2: Checking AWS credentials...
echo Please provide your AWS details:
echo.

set /p AWS_IP="Enter your EC2 Public IP: "
set /p PEM_FILE="Enter path to your .pem file (e.g., C:\path\to\aksharjobs-key.pem): "

echo.
echo Step 3: Uploading files to AWS...
echo This may take a few minutes...

:: Upload the entire project to AWS
scp -i "%PEM_FILE%" -r . ubuntu@%AWS_IP%:/var/www/AksharJobs

if %errorlevel% neq 0 (
    echo ❌ Upload failed! Please check:
    echo   1. IP address is correct
    echo   2. PEM file path is correct
    echo   3. You have SSH access to the instance
    echo.
    pause
    exit /b 1
)

echo ✅ Files uploaded successfully!
echo.

echo Step 4: Deploying on AWS server...
echo Running deployment commands on AWS...

ssh -i "%PEM_FILE%" ubuntu@%AWS_IP% << 'EOF'
cd /var/www/AksharJobs

echo "Setting up backend..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt

echo "Creating production environment..."
cat > .env.production << 'ENVEOF'
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
ENVEOF

echo "Building frontend..."
cd ../frontend
npm install
echo "REACT_APP_API_URL=http://YOUR_IP/api" > .env.production
npm run build

echo "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/aksharjobs > /dev/null << 'NGINXEOF'
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
NGINXEOF

sudo ln -sf /etc/nginx/sites-available/aksharjobs /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

echo "Starting backend with PM2..."
cd /var/www/AksharJobs/backend
pm2 delete aksharjobs-backend 2>/dev/null || true
pm2 start venv/bin/python3 --name aksharjobs-backend -- app.py
pm2 save

echo "✅ Deployment complete!"
echo "Your new landing page is now live at: http://YOUR_IP"
EOF

echo.
echo ========================================
echo   🎉 Deployment Complete!
echo ========================================
echo.
echo Your new futuristic landing page is now live at:
echo http://%AWS_IP%
echo.
echo Features deployed:
echo ✅ Glassmorphic navbar with enhanced logo
echo ✅ Animated hero section with floating elements
echo ✅ Interactive cards with hover effects
echo ✅ Animated statistics counters
echo ✅ Floating AI chatbot
echo ✅ Responsive design for all devices
echo.
echo Next steps:
echo 1. Visit http://%AWS_IP% to see your new landing page
echo 2. Test all interactive elements
echo 3. Check mobile responsiveness
echo 4. Consider adding a domain name and SSL certificate
echo.
pause
