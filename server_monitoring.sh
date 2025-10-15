#!/bin/bash
# Server Monitoring and Alert System

# Configuration
ALERT_EMAIL="admin@aksharjobs.com"  # Change this to your email
DISK_THRESHOLD=80  # Alert if disk usage > 80%
MEMORY_THRESHOLD=85  # Alert if memory usage > 85%
CPU_THRESHOLD=90  # Alert if CPU usage > 90%
LOG_FILE="/var/log/aksharjobs-monitoring.log"

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to send alert (you can configure this with email/Slack/etc)
send_alert() {
    local severity=$1
    local message=$2
    log_message "[$severity] ALERT: $message"
    
    # Uncomment to send email (requires mail command configured)
    # echo "$message" | mail -s "AksharJobs Server Alert - $severity" "$ALERT_EMAIL"
    
    # Example: Send to Slack (uncomment and add your webhook URL)
    # curl -X POST -H 'Content-type: application/json' \
    #   --data "{\"text\":\"[$severity] $message\"}" \
    #   YOUR_SLACK_WEBHOOK_URL
}

# Check Disk Usage
check_disk_usage() {
    local disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$disk_usage" -gt "$DISK_THRESHOLD" ]; then
        send_alert "CRITICAL" "Disk usage is ${disk_usage}% (threshold: ${DISK_THRESHOLD}%)"
        echo -e "${RED}❌ CRITICAL: Disk usage is ${disk_usage}%${NC}"
    elif [ "$disk_usage" -gt $((DISK_THRESHOLD - 10)) ]; then
        send_alert "WARNING" "Disk usage is ${disk_usage}% (approaching threshold)"
        echo -e "${YELLOW}⚠️  WARNING: Disk usage is ${disk_usage}%${NC}"
    else
        echo -e "${GREEN}✅ Disk usage is ${disk_usage}% - OK${NC}"
    fi
}

# Check Memory Usage
check_memory_usage() {
    local memory_usage=$(free | awk 'NR==2 {printf "%.0f", $3/$2 * 100}')
    
    if [ "$memory_usage" -gt "$MEMORY_THRESHOLD" ]; then
        send_alert "CRITICAL" "Memory usage is ${memory_usage}% (threshold: ${MEMORY_THRESHOLD}%)"
        echo -e "${RED}❌ CRITICAL: Memory usage is ${memory_usage}%${NC}"
    elif [ "$memory_usage" -gt $((MEMORY_THRESHOLD - 10)) ]; then
        send_alert "WARNING" "Memory usage is ${memory_usage}% (approaching threshold)"
        echo -e "${YELLOW}⚠️  WARNING: Memory usage is ${memory_usage}%${NC}"
    else
        echo -e "${GREEN}✅ Memory usage is ${memory_usage}% - OK${NC}"
    fi
}

# Check CPU Usage
check_cpu_usage() {
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    
    if (( $(echo "$cpu_usage > $CPU_THRESHOLD" | bc -l) )); then
        send_alert "CRITICAL" "CPU usage is ${cpu_usage}% (threshold: ${CPU_THRESHOLD}%)"
        echo -e "${RED}❌ CRITICAL: CPU usage is ${cpu_usage}%${NC}"
    elif (( $(echo "$cpu_usage > $CPU_THRESHOLD - 10" | bc -l) )); then
        send_alert "WARNING" "CPU usage is ${cpu_usage}% (approaching threshold)"
        echo -e "${YELLOW}⚠️  WARNING: CPU usage is ${cpu_usage}%${NC}"
    else
        echo -e "${GREEN}✅ CPU usage is ${cpu_usage}% - OK${NC}"
    fi
}

# Check PM2 Services
check_pm2_services() {
    local service_count=$(pm2 jlist | jq -r '.[] | select(.pm2_env.status != "online") | .name' | wc -l)
    
    if [ "$service_count" -gt 0 ]; then
        local down_services=$(pm2 jlist | jq -r '.[] | select(.pm2_env.status != "online") | .name' | tr '\n' ', ')
        send_alert "CRITICAL" "PM2 services down: ${down_services}"
        echo -e "${RED}❌ CRITICAL: ${service_count} PM2 service(s) down: ${down_services}${NC}"
    else
        echo -e "${GREEN}✅ All PM2 services online${NC}"
    fi
}

# Check Backend Health
check_backend_health() {
    local health_response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/)
    
    if [ "$health_response" != "200" ]; then
        send_alert "CRITICAL" "Backend health check failed (HTTP ${health_response})"
        echo -e "${RED}❌ CRITICAL: Backend not responding properly (HTTP ${health_response})${NC}"
    else
        echo -e "${GREEN}✅ Backend health check passed${NC}"
    fi
}

# Check Nginx Status
check_nginx_status() {
    if ! systemctl is-active --quiet nginx; then
        send_alert "CRITICAL" "Nginx is not running"
        echo -e "${RED}❌ CRITICAL: Nginx is not running${NC}"
    else
        echo -e "${GREEN}✅ Nginx is running${NC}"
    fi
}

# Check MongoDB Connection
check_mongodb() {
    local mongo_status=$(pm2 logs akshar-backend --lines 100 --nostream 2>/dev/null | grep -c "MongoDB connected successfully" || echo "0")
    
    if [ "$mongo_status" -eq 0 ]; then
        send_alert "WARNING" "MongoDB connection not confirmed in recent logs"
        echo -e "${YELLOW}⚠️  WARNING: MongoDB connection not confirmed${NC}"
    else
        echo -e "${GREEN}✅ MongoDB connection OK${NC}"
    fi
}

# Check Log File Sizes
check_log_sizes() {
    local large_logs=$(find ~/.pm2/logs /var/log/nginx -type f -size +100M 2>/dev/null)
    
    if [ -n "$large_logs" ]; then
        send_alert "WARNING" "Large log files detected (>100MB)"
        echo -e "${YELLOW}⚠️  WARNING: Large log files detected${NC}"
        echo "$large_logs"
    else
        echo -e "${GREEN}✅ Log file sizes OK${NC}"
    fi
}

# Main monitoring function
main() {
    echo "╔════════════════════════════════════════╗"
    echo "║   AksharJobs Server Health Monitor    ║"
    echo "║     $(date '+%Y-%m-%d %H:%M:%S')          ║"
    echo "╚════════════════════════════════════════╝"
    echo ""
    
    log_message "Starting health check..."
    
    echo "📊 System Resources:"
    echo "-------------------"
    check_disk_usage
    check_memory_usage
    check_cpu_usage
    
    echo ""
    echo "🔧 Services Status:"
    echo "-------------------"
    check_pm2_services
    check_backend_health
    check_nginx_status
    check_mongodb
    
    echo ""
    echo "📝 Log Health:"
    echo "-------------------"
    check_log_sizes
    
    echo ""
    log_message "Health check completed"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Run main function
main

