#!/bin/bash
# Setup automatic backup rotation via cron

echo "⚙️  Setting up automatic backup rotation"
echo "========================================"

# Make the rotation script executable
chmod +x /var/www/AksharJobs/auto_backup_rotation.sh

# Create cron job (runs daily at 2 AM)
CRON_JOB="0 2 * * * /var/www/AksharJobs/auto_backup_rotation.sh >> /var/log/backup_rotation.log 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "auto_backup_rotation.sh"; then
    echo "✅ Cron job already exists"
else
    # Add cron job
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo "✅ Cron job added: Daily at 2 AM"
fi

echo ""
echo "📋 Current cron jobs:"
crontab -l | grep "auto_backup_rotation" || echo "No backup rotation cron found"

echo ""
echo "✅ Setup complete!"
echo ""
echo "ℹ️  The backup rotation will run automatically daily at 2 AM"
echo "ℹ️  You can also run it manually: /var/www/AksharJobs/auto_backup_rotation.sh"

