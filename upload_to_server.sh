#!/bin/bash
# Upload PM2 deployment files to Ubuntu server
# Usage: ./upload_to_server.sh [user@]hostname

if [ -z "$1" ]; then
    echo "Usage: ./upload_to_server.sh [user@]hostname"
    echo "Example: ./upload_to_server.sh ubuntu@13.127.45.123"
    exit 1
fi

SERVER=$1
REMOTE_PATH="/var/www/AksharJobs"

echo "📤 Uploading PM2 deployment files to $SERVER"
echo "=============================================="

# Create array of files to upload
FILES=(
    "ecosystem.config.js"
    "backend/app_production.py"
    "deploy_backend_pm2.sh"
    "monitor_backend.sh"
    "setup_pm2_startup.sh"
    "nginx_backend_check.sh"
    "PM2_DEPLOYMENT_GUIDE.md"
    "pm2_commands.md"
)

# Upload each file
for file in "${FILES[@]}"; do
    echo "Uploading $file..."
    if scp "$file" "$SERVER:$REMOTE_PATH/$file"; then
        echo "✅ $file uploaded"
    else
        echo "❌ Failed to upload $file"
    fi
done

echo ""
echo "🔧 Making scripts executable on server..."
ssh "$SERVER" << 'EOF'
    cd /var/www/AksharJobs
    chmod +x deploy_backend_pm2.sh
    chmod +x monitor_backend.sh
    chmod +x setup_pm2_startup.sh
    chmod +x nginx_backend_check.sh
    chmod +x backend/app_production.py
EOF

echo ""
echo "✅ Upload complete!"
echo ""
echo "📋 Next steps (run on server):"
echo "  ssh $SERVER"
echo "  cd /var/www/AksharJobs"
echo "  ./deploy_backend_pm2.sh"
echo ""

