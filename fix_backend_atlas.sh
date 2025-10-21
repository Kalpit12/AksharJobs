#!/bin/bash
# Fix Backend 502 Error - Switch to MongoDB Atlas
# Run this script on the Ubuntu server

echo "🔧 Fixing Backend 502 Error - Switching to MongoDB Atlas"
echo "=========================================================="
echo ""

echo "🔍 Step 1: Checking current backend status..."
pm2 status backend
echo ""

echo "📝 Step 2: Updating environment configuration for Atlas..."
cd /home/ubuntu/AksharJobs/backend || cd ~/backend || cd ~/AksharJobs/backend || cd /var/www/aksharjobs/backend

# Backup current .env if it exists
if [ -f .env ]; then
    cp .env .env.backup_$(date +%Y%m%d_%H%M%S)
    echo "✅ Backed up existing .env"
fi

# Create/update .env with Atlas connection
cat > .env << 'EOF'
# MongoDB Atlas Configuration
MONGO_URI=mongodb+srv://akshar_admin:WDQW9zihOVlhkExy@cluster0.lkow2ar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=TalentMatchDB

# Gmail Configuration
GMAIL_EMAIL=kalpitpatel751@gmail.com
GMAIL_APP_PASSWORD=ihab amwy hbov ukqs

# Security
SECRET_KEY=6f2b5c8e9d3a4f1b7e0c2d8a5f6e7b3c
JWT_SECRET_KEY=6f2b5c8e9d3a4f1b7e0c2d8a5f6e7b3c

# Gemini AI
GEMINI_API_KEY=AIzaSyBZ3B2OxY-5kXWR2Pe5mb6-nV68gTSJKnA

# Cloudinary
CLOUDINARY_CLOUD_NAME=drjafm0to
CLOUDINARY_API_KEY=669253238363449
CLOUDINARY_API_SECRET=PTIJiQCtPeVtzkvTJ3crQyWdosQ

# Google API
GOOGLE_API_KEY=AIzaSyDPEUJGX5l7jQqTslQGlYEA1vqgY1o6Qi0

# OAuth
GOOGLE_CLIENT_ID=1080296046243-jho2bd61jappal9jnlbg9ih8vietc241.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# Server Configuration
HOST=0.0.0.0
PORT=3002
FRONTEND_URL=http://13.61.35.12:3003
BACKEND_URL=http://13.61.35.12:3002

# Supabase
SUPABASE_URL=https://tszbswgpyuymnchngcii.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzemJzd2dweXV5bW5jaG5nY2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODI4NDcsImV4cCI6MjA3MDU1ODg0N30.A1a8BYsqOdo1PWenIwna3ThJbkgsmby1hs-9mjiJW8g

# SMS Provider
SMS_PROVIDER=mock
EOF

echo "✅ Created .env with Atlas configuration"
echo ""

echo "🔄 Step 3: Restarting backend with Atlas configuration..."
pm2 restart backend || pm2 start app.py --name backend --interpreter python3
pm2 save
echo ""

echo "⏳ Waiting for backend to start..."
sleep 5
echo ""

echo "📊 Step 4: Checking backend status..."
pm2 status backend
echo ""
echo "📝 Recent backend logs:"
pm2 logs backend --lines 20 --nostream
echo ""

echo "🧪 Step 5: Testing connection..."
curl -s http://localhost:3002/ || echo "⚠️  Backend not responding yet"
echo ""

echo "✅ Backend configuration updated!"
echo ""
echo "📱 Your frontend should now work at: http://13.61.35.12:3003"
echo "🔗 Backend API: http://13.61.35.12:3002"
echo ""
echo "💡 If issues persist, check logs with: pm2 logs backend"

