#!/bin/bash
# Quick check for Nginx + Backend connectivity
# Usage: ./nginx_backend_check.sh

echo "🔍 AksharJobs Backend + Nginx Check"
echo "===================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Check if backend is running
echo -e "\n${YELLOW}1. Checking Backend Process...${NC}"
if pm2 list | grep -q "akshar-backend"; then
    echo -e "${GREEN}✅ Backend process found in PM2${NC}"
    pm2 info akshar-backend | grep -E "status|uptime|restarts"
else
    echo -e "${RED}❌ Backend not running in PM2${NC}"
    echo "Run: pm2 start ecosystem.config.js"
fi

# 2. Check port 3002
echo -e "\n${YELLOW}2. Checking Port 3002...${NC}"
if sudo netstat -tlnp | grep -q ":3002"; then
    echo -e "${GREEN}✅ Port 3002 is listening${NC}"
    sudo netstat -tlnp | grep ":3002"
else
    echo -e "${RED}❌ Nothing listening on port 3002${NC}"
fi

# 3. Health check via localhost
echo -e "\n${YELLOW}3. Backend Health Check (localhost:3002)...${NC}"
if curl -f -s http://localhost:3002/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend health check passed${NC}"
    curl -s http://localhost:3002/api/health | python3 -m json.tool
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    echo "Check logs: pm2 logs akshar-backend"
fi

# 4. Check Nginx status
echo -e "\n${YELLOW}4. Checking Nginx...${NC}"
if sudo systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx is running${NC}"
else
    echo -e "${RED}❌ Nginx is not running${NC}"
    echo "Start it: sudo systemctl start nginx"
fi

# 5. Check Nginx configuration
echo -e "\n${YELLOW}5. Testing Nginx Configuration...${NC}"
if sudo nginx -t &> /dev/null; then
    echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
else
    echo -e "${RED}❌ Nginx configuration has errors${NC}"
    sudo nginx -t
fi

# 6. Check Nginx error log for recent errors
echo -e "\n${YELLOW}6. Recent Nginx Errors (last 10 lines)...${NC}"
if [ -f "/var/log/nginx/error.log" ]; then
    sudo tail -n 10 /var/log/nginx/error.log | grep -E "error|refused|denied" || echo "No recent errors found"
else
    echo "Error log not found"
fi

# 7. Test API endpoint through Nginx (if domain is known)
echo -e "\n${YELLOW}7. Testing API through Nginx...${NC}"
# Try to detect the server IP/domain
SERVER_IP=$(curl -s http://checkip.amazonaws.com || hostname -I | awk '{print $1}')
echo "Server IP: $SERVER_IP"

if curl -f -s http://localhost/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API accessible through Nginx (http://localhost/api/health)${NC}"
elif curl -f -s "http://$SERVER_IP/api/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API accessible through Nginx (http://$SERVER_IP/api/health)${NC}"
else
    echo -e "${RED}❌ Cannot access API through Nginx${NC}"
    echo "Check Nginx proxy configuration for /api/ location"
fi

# 8. Show PM2 logs (last 20 lines)
echo -e "\n${YELLOW}8. Recent Backend Logs...${NC}"
pm2 logs akshar-backend --lines 20 --nostream 2>/dev/null || echo "No logs available"

echo -e "\n${GREEN}===================================="
echo "Check complete!"
echo "====================================${NC}"

