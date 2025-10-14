#!/bin/bash
# Monitor and auto-restart backend if health check fails
# Usage: ./monitor_backend.sh
# Or run in background: nohup ./monitor_backend.sh > monitor.log 2>&1 &

HEALTH_ENDPOINT="http://localhost:3002/api/health"
CHECK_INTERVAL=30  # seconds
MAX_FAILURES=3
failure_count=0

echo "🔍 Starting AksharJobs Backend Monitor"
echo "Health Check URL: $HEALTH_ENDPOINT"
echo "Check Interval: ${CHECK_INTERVAL}s"
echo "Max Failures Before Restart: $MAX_FAILURES"
echo "========================================"

while true; do
    # Perform health check
    if curl -f -s "$HEALTH_ENDPOINT" > /dev/null 2>&1; then
        if [ $failure_count -gt 0 ]; then
            echo "✅ [$(date)] Backend recovered"
        fi
        failure_count=0
    else
        failure_count=$((failure_count + 1))
        echo "❌ [$(date)] Health check failed (attempt $failure_count/$MAX_FAILURES)"
        
        if [ $failure_count -ge $MAX_FAILURES ]; then
            echo "⚠️  [$(date)] Max failures reached. Restarting backend..."
            
            # Try to restart with PM2
            if pm2 restart akshar-backend; then
                echo "✅ [$(date)] PM2 restart command sent"
                failure_count=0
                sleep 10  # Give it time to start
            else
                echo "❌ [$(date)] PM2 restart failed. Trying full restart..."
                pm2 delete akshar-backend 2>/dev/null || true
                pm2 start ecosystem.config.js
                pm2 save
                failure_count=0
                sleep 10
            fi
        fi
    fi
    
    sleep $CHECK_INTERVAL
done

