#!/bin/bash
# Deploy recent fixes to AWS EC2 Server
# Run this script from your local machine (Windows with Git Bash)

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "========================================"
echo "🚀 Deploying AksharJobs Updates to AWS"
echo "========================================"
echo ""

# Configuration
AWS_IP="13.6.35.12"
AWS_USER="ubuntu"
AWS_KEY="aksharjobs-key.pem"  # Update this path if different
PROJECT_PATH="/var/www/AksharJobs"

echo -e "${YELLOW}Step 1: Git Status Check${NC}"
echo "Modified files:"
git status --short
echo ""

read -p "Do you want to commit these changes? (y/n): " confirm
if [ "$confirm" = "y" ]; then
    echo -e "${YELLOW}Step 2: Committing changes...${NC}"
    
    # Add only the important files (not test scripts)
    git add backend/routes/intern_routes.py
    git add backend/routes/jobseeker_registration_routes.py
    git add backend/services/auth_service.py
    git add backend/utils/profile_progress.py
    git add frontend/src/pages/InternRegistrationForm.jsx
    git add frontend/src/pages/JobSeekerDashboard.jsx
    git add frontend/src/pages/JobSeekerRegistrationFormComprehensive.jsx
    
    git commit -m "Fix: Age verification (18+), draft save, profile progress, and MyProfile data display"
    
    echo -e "${GREEN}✅ Changes committed${NC}"
    echo ""
    
    echo -e "${YELLOW}Step 3: Pushing to repository...${NC}"
    git push origin main
    echo -e "${GREEN}✅ Pushed to repository${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping commit step${NC}"
fi

echo ""
echo -e "${YELLOW}Step 4: Connecting to AWS server...${NC}"
echo "Deploying to: $AWS_USER@$AWS_IP"
echo ""

# Create deployment commands for the server
cat > /tmp/aws_deploy_commands.sh << 'DEPLOY_SCRIPT'
#!/bin/bash
set -e

echo "🔄 Updating AksharJobs on server..."
cd /var/www/AksharJobs

# Pull latest changes
echo "📥 Pulling latest code from repository..."
git pull origin main

# Update backend dependencies if needed
echo "📦 Checking backend dependencies..."
cd backend
source venv/bin/activate
pip install -r requirements.txt --quiet

# Restart backend
echo "🔄 Restarting backend with PM2..."
pm2 restart aksharjobs-backend

# Check status
echo "✅ Deployment complete!"
pm2 status aksharjobs-backend

echo ""
echo "✅ Backend is now running with latest fixes!"
DEPLOY_SCRIPT

echo -e "${YELLOW}Step 5: Deploying to AWS...${NC}"
echo ""
echo "You have two options:"
echo ""
echo "Option A: Deploy via SSH (requires key)"
echo "  Run: ssh -i $AWS_KEY $AWS_USER@$AWS_IP 'bash -s' < /tmp/aws_deploy_commands.sh"
echo ""
echo "Option B: Manual deployment"
echo "  1. SSH into server: ssh -i $AWS_KEY $AWS_USER@$AWS_IP"
echo "  2. Run these commands:"
echo "     cd /var/www/AksharJobs"
echo "     git pull origin main"
echo "     cd backend"
echo "     source venv/bin/activate"
echo "     pip install -r requirements.txt"
echo "     pm2 restart aksharjobs-backend"
echo ""

read -p "Do you want to deploy now via SSH? (y/n): " deploy_now
if [ "$deploy_now" = "y" ]; then
    echo -e "${YELLOW}Connecting to AWS and deploying...${NC}"
    ssh -i "$AWS_KEY" "$AWS_USER@$AWS_IP" 'bash -s' < /tmp/aws_deploy_commands.sh
    echo -e "${GREEN}✅ Deployment complete!${NC}"
else
    echo -e "${YELLOW}⚠️  Please deploy manually using the commands above${NC}"
fi

echo ""
echo "========================================"
echo -e "${GREEN}✅ Deployment Process Complete!${NC}"
echo "========================================"
echo ""
echo "🌐 Your website: http://$AWS_IP"
echo ""
echo "📝 What was deployed:"
echo "  ✅ Age verification (18+)"
echo "  ✅ Draft save functionality"
echo "  ✅ Profile progress calculation"
echo "  ✅ MyProfile data display fixes"
echo ""
echo "🧪 Test now:"
echo "  1. Go to http://$AWS_IP"
echo "  2. Register a new user (must be 18+)"
echo "  3. Fill the registration form"
echo "  4. Click 'Save as Draft' or 'Complete Registration'"
echo "  5. Go to MyProfile page"
echo "  6. ✅ Your data should be displayed!"
echo ""

