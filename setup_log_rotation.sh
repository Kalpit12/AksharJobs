#!/bin/bash
# Setup automated log rotation for PM2 and Nginx

echo "📝 Setting up Automated Log Rotation"
echo "===================================="

# 1. Setup PM2 log rotation
echo ""
echo "📦 Installing PM2 log rotate module..."
pm2 install pm2-logrotate

echo ""
echo "⚙️  Configuring PM2 log rotation..."
# Keep logs for 30 days
pm2 set pm2-logrotate:retain 30
# Compress logs
pm2 set pm2-logrotate:compress true
# Rotate when log reaches 10MB
pm2 set pm2-logrotate:max_size 10M
# Use date in archived log filename
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
# Rotate at midnight
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'

echo ""
echo "✅ PM2 log rotation configured:"
pm2 conf pm2-logrotate

# 2. Setup Nginx log rotation
echo ""
echo "⚙️  Configuring Nginx log rotation..."

sudo tee /etc/logrotate.d/nginx-akshar > /dev/null << 'EOF'
/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    prerotate
        if [ -d /etc/logrotate.d/httpd-prerotate ]; then \
            run-parts /etc/logrotate.d/httpd-prerotate; \
        fi
    endscript
    postrotate
        invoke-rc.d nginx rotate >/dev/null 2>&1 || true
    endscript
}
EOF

echo "✅ Nginx log rotation configured at /etc/logrotate.d/nginx-akshar"

# 3. Test logrotate
echo ""
echo "🧪 Testing log rotation..."
sudo logrotate -f /etc/logrotate.d/nginx-akshar 2>&1 | head -10

# 4. Create custom application log rotation
echo ""
echo "⚙️  Setting up application log rotation..."

sudo tee /etc/logrotate.d/aksharjobs > /dev/null << 'EOF'
/var/www/AksharJobs/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 ubuntu ubuntu
    dateext
    dateformat -%Y%m%d
}
EOF

echo "✅ Application log rotation configured"

# 5. Create logs directory if it doesn't exist
mkdir -p /var/www/AksharJobs/logs
chown ubuntu:ubuntu /var/www/AksharJobs/logs

# 6. Summary
echo ""
echo "📊 Log Rotation Summary"
echo "======================="
echo ""
echo "✅ PM2 Logs:"
echo "   - Location: ~/.pm2/logs/"
echo "   - Rotation: Daily or when > 10MB"
echo "   - Retention: 30 days"
echo "   - Compression: Yes"
echo ""
echo "✅ Nginx Logs:"
echo "   - Location: /var/log/nginx/"
echo "   - Rotation: Daily"
echo "   - Retention: 14 days"
echo "   - Compression: Yes"
echo ""
echo "✅ App Logs:"
echo "   - Location: /var/www/AksharJobs/logs/"
echo "   - Rotation: Daily"
echo "   - Retention: 30 days"
echo "   - Compression: Yes"
echo ""
echo "🔍 Check logs:"
echo "   pm2 logs akshar-backend"
echo "   sudo tail -f /var/log/nginx/error.log"
echo ""
echo "✨ Log rotation setup complete!"

