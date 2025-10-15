#!/bin/bash
# Master deployment script for all server improvements

echo "🚀 AksharJobs Server Improvements Deployment"
echo "==========================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}This script will:${NC}"
echo "  1. ✅ Clean up backend disk space"
echo "  2. ✅ Setup automatic backup rotation"
echo "  3. ✅ Install and configure Gunicorn (production WSGI)"
echo "  4. ✅ Setup automated log rotation"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

echo ""
echo -e "${YELLOW}[1/4] Cleaning up backend disk space...${NC}"
bash /var/www/AksharJobs/cleanup_backend.sh

echo ""
echo -e "${YELLOW}[2/4] Setting up automatic backup rotation...${NC}"
bash /var/www/AksharJobs/setup_auto_rotation.sh

echo ""
echo -e "${YELLOW}[3/4] Setting up Gunicorn production server...${NC}"
bash /var/www/AksharJobs/setup_gunicorn.sh

echo ""
echo -e "${YELLOW}[4/4] Setting up automated log rotation...${NC}"
bash /var/www/AksharJobs/setup_log_rotation.sh

echo ""
echo -e "${GREEN}✨ All improvements deployed successfully!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1️⃣  Review Gunicorn deployment:"
echo "   cat /var/www/AksharJobs/GUNICORN_DEPLOYMENT.md"
echo ""
echo "2️⃣  Switch to Gunicorn (optional, recommended):"
echo "   pm2 delete akshar-backend"
echo "   pm2 start ecosystem.config.gunicorn.js"
echo "   pm2 save"
echo ""
echo "3️⃣  Verify services:"
echo "   pm2 status"
echo "   df -h"
echo "   crontab -l"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

