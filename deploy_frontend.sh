#!/bin/bash
# Deploy new frontend build to server
# Usage: ./deploy_frontend.sh

set -e

echo "🚀 Deploying New Frontend Design"
echo "================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if we're on the server
if [ ! -d "/var/www/AksharJobs" ]; then
    echo -e "${RED}❌ Error: /var/www/AksharJobs directory not found${NC}"
    echo "This script should be run on the Ubuntu server"
    exit 1
fi

cd /var/www/AksharJobs

echo -e "${YELLOW}📁 Step 1: Creating backup of current frontend...${NC}"
if [ -d "frontend/build" ]; then
    sudo cp -r frontend/build frontend/build_backup_$(date +%Y%m%d_%H%M%S)
    echo -e "${GREEN}✅ Backup created${NC}"
else
    echo -e "${YELLOW}⚠️  No existing build directory found${NC}"
fi

echo -e "${YELLOW}🗑️  Step 2: Removing old build directory...${NC}"
sudo rm -rf frontend/build
echo -e "${GREEN}✅ Old build removed${NC}"

echo -e "${YELLOW}📦 Step 3: Creating new build directory...${NC}"
sudo mkdir -p frontend/build
sudo chown -R ubuntu:www-data frontend/build
sudo chmod -R 755 frontend/build
echo -e "${GREEN}✅ New build directory created with proper permissions${NC}"

echo -e "${YELLOW}📋 Step 4: Waiting for upload to complete...${NC}"
echo "Please upload your build files to /var/www/AksharJobs/frontend/build/"
echo "You can use: scp -r local_build/* ubuntu@server:/var/www/AksharJobs/frontend/build/"
echo ""
echo "Press Enter when upload is complete..."
read -p ""

echo -e "${YELLOW}🔧 Step 5: Setting proper permissions...${NC}"
sudo chown -R ubuntu:www-data frontend/build
sudo chmod -R 755 frontend/build
sudo chmod 644 frontend/build/index.html
echo -e "${GREEN}✅ Permissions set correctly${NC}"

echo -e "${YELLOW}🧪 Step 6: Testing frontend access...${NC}"
if [ -f "frontend/build/index.html" ]; then
    echo -e "${GREEN}✅ index.html found${NC}"
    echo "Frontend deployment complete!"
else
    echo -e "${RED}❌ index.html not found. Please check upload.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}======================================"
echo "✅ Frontend deployment complete!"
echo "======================================${NC}"
echo ""
echo "🌐 Your new design should now be live at:"
echo "   http://13.61.35.12"
echo ""
echo "🔄 If you don't see changes, try:"
echo "   1. Hard refresh (Ctrl+F5)"
echo "   2. Clear browser cache"
echo "   3. Check Nginx is serving the new files"
echo ""
