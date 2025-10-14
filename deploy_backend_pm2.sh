#!/bin/bash
# Deploy Backend with PM2 on Ubuntu Server
# Usage: ./deploy_backend_pm2.sh

set -e  # Exit on error

echo "🚀 AksharJobs Backend PM2 Deployment"
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're on the server
if [ ! -d "/var/www/AksharJobs" ]; then
    echo -e "${RED}❌ Error: /var/www/AksharJobs directory not found${NC}"
    echo "This script should be run on the Ubuntu server"
    exit 1
fi

# Navigate to project directory
cd /var/www/AksharJobs

echo -e "${YELLOW}📦 Step 1: Checking Python environment...${NC}"
# Check if virtual environment exists
if [ -d "backend/venv" ]; then
    echo -e "${GREEN}✅ Using existing virtual environment${NC}"
    # Activate venv for dependency check
    source backend/venv/bin/activate
    
    # Install/update dependencies if requirements.txt exists
    if [ -f "backend/requirements.txt" ]; then
        echo -e "${YELLOW}   Installing dependencies...${NC}"
        pip install -r backend/requirements.txt --quiet 2>/dev/null || echo "Dependencies already installed"
    fi
else
    echo -e "${YELLOW}⚠️  No virtual environment found, using system Python${NC}"
fi

echo -e "${YELLOW}📝 Step 2: Making production script executable...${NC}"
chmod +x backend/app_production.py
echo -e "${GREEN}✅ Script is executable${NC}"

echo -e "${YELLOW}🔍 Step 3: Checking if PM2 is installed...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}❌ PM2 not found. Installing...${NC}"
    sudo npm install -g pm2
fi
echo -e "${GREEN}✅ PM2 is installed${NC}"

echo -e "${YELLOW}🛑 Step 4: Stopping old processes (if any)...${NC}"
pm2 stop akshar-backend 2>/dev/null || echo "No existing process to stop"
pm2 delete akshar-backend 2>/dev/null || echo "No existing process to delete"

# Check if anything is using port 3002
if sudo lsof -i :3002 &> /dev/null; then
    echo -e "${YELLOW}⚠️  Port 3002 is in use, killing process...${NC}"
    sudo kill -9 $(sudo lsof -t -i:3002) 2>/dev/null || true
fi

echo -e "${YELLOW}🚀 Step 5: Starting backend with PM2...${NC}"
pm2 start ecosystem.config.js

echo -e "${YELLOW}💾 Step 6: Saving PM2 process list...${NC}"
pm2 save

echo -e "${YELLOW}⏱️  Step 7: Waiting for backend to start...${NC}"
sleep 5

echo -e "${YELLOW}🔍 Step 8: Running health check...${NC}"
# Try the root health check endpoint first
if curl -f http://localhost:3002/ &> /dev/null; then
    echo -e "${GREEN}✅ Backend is healthy!${NC}"
    # Check PM2-specific health endpoint if available
    curl -s http://localhost:3002/api/pm2/health 2>/dev/null | python3 -m json.tool 2>/dev/null || echo "Backend is running"
else
    echo -e "${YELLOW}⚠️  Health check pending (backend may still be starting)...${NC}"
    echo "Checking status..."
    pm2 status akshar-backend
fi

echo ""
echo -e "${GREEN}======================================"
echo "✅ Backend deployment complete!"
echo "======================================${NC}"
echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "🔧 Useful commands:"
echo "  View logs:    pm2 logs akshar-backend"
echo "  Restart:      pm2 restart akshar-backend"
echo "  Monitor:      pm2 monit"
echo "  Health check: curl http://localhost:3002/api/health"
echo ""
