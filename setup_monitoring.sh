#!/bin/bash
# Setup Server Monitoring System

echo "🔍 Setting up AksharJobs Server Monitoring"
echo "==========================================="
echo ""

# Make monitoring script executable
chmod +x /var/www/AksharJobs/server_monitoring.sh

# Create log directory
sudo mkdir -p /var/log/aksharjobs
sudo chown ubuntu:ubuntu /var/log/aksharjobs

# Create monitoring log file
sudo touch /var/log/aksharjobs-monitoring.log
sudo chown ubuntu:ubuntu /var/log/aksharjobs-monitoring.log

# Install required tools if not present
echo "📦 Installing required tools..."
if ! command -v jq &> /dev/null; then
    sudo apt-get update -qq
    sudo apt-get install -y jq bc
    echo "✅ Installed jq and bc"
else
    echo "✅ jq and bc already installed"
fi

# Setup cron job for monitoring (every 5 minutes)
CRON_JOB="*/5 * * * * /var/www/AksharJobs/server_monitoring.sh >> /var/log/aksharjobs-monitoring.log 2>&1"

if crontab -l 2>/dev/null | grep -q "server_monitoring.sh"; then
    echo "✅ Monitoring cron job already exists"
else
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo "✅ Monitoring cron job added (runs every 5 minutes)"
fi

# Create PM2 monitoring integration
echo ""
echo "📊 Setting up PM2 monitoring..."
pm2 install pm2-server-monit 2>/dev/null || echo "⚠️  pm2-server-monit already installed or not available"

echo ""
echo "✅ Monitoring setup complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Monitoring Details:"
echo ""
echo "  📁 Log file: /var/log/aksharjobs-monitoring.log"
echo "  ⏰ Frequency: Every 5 minutes (via cron)"
echo "  🔧 Manual run: /var/www/AksharJobs/server_monitoring.sh"
echo ""
echo "📊 View monitoring log:"
echo "  tail -f /var/log/aksharjobs-monitoring.log"
echo ""
echo "⚙️  Configure alerts in: /var/www/AksharJobs/server_monitoring.sh"
echo "  - Set email address"
echo "  - Configure Slack webhook"
echo "  - Adjust thresholds"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

