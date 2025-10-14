# PM2 Commands for AksharJobs

## Initial Setup

```bash
# Install PM2 globally (if not already installed)
npm install -g pm2

# Navigate to project directory
cd /home/ubuntu/AksharJobs

# Make the production script executable
chmod +x backend/app_production.py

# Start the backend with PM2
pm2 start ecosystem.config.js

# Save the PM2 process list (to survive reboots)
pm2 save

# Setup PM2 to start on system boot
pm2 startup systemd
# Then run the command that PM2 outputs
```

## Common Operations

```bash
# Check status
pm2 status
pm2 list

# View logs
pm2 logs akshar-backend          # Live logs
pm2 logs akshar-backend --lines 100  # Last 100 lines
pm2 logs akshar-backend --err    # Only errors

# Restart
pm2 restart akshar-backend

# Stop
pm2 stop akshar-backend

# Delete from PM2
pm2 delete akshar-backend

# Monitor in real-time
pm2 monit

# Show detailed info
pm2 info akshar-backend
pm2 describe akshar-backend
```

## Health Check

```bash
# Test the health endpoint
curl http://localhost:3002/api/health

# Or with JSON formatting
curl http://localhost:3002/api/health | python3 -m json.tool
```

## Troubleshooting

```bash
# If process not found, check PM2 list
pm2 list

# Check if anything is running on port 3002
sudo netstat -tlnp | grep :3002
sudo lsof -i :3002

# Kill anything on port 3002
sudo kill -9 $(sudo lsof -t -i:3002)

# Clear PM2 logs
pm2 flush

# Restart with fresh logs
pm2 restart akshar-backend --update-env

# If all else fails, reload the ecosystem config
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
```

## Auto-Restart on Failure

PM2 will automatically:
- Restart if the process crashes
- Restart if memory exceeds 1GB
- Wait 4 seconds between restart attempts
- Stop trying after 10 consecutive failures in 10 seconds

## Testing the Auto-Restart

```bash
# Simulate a crash by killing the process
pm2 stop akshar-backend
# PM2 should automatically restart it

# Check restart count
pm2 info akshar-backend | grep restart
```

## Nginx Integration Notes

Your Nginx config should proxy to:
```nginx
location /api/ {
    proxy_pass http://localhost:3002;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    
    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

## Quick Start Command (Copy-Paste)

```bash
cd /home/ubuntu/AksharJobs && chmod +x backend/app_production.py && pm2 start ecosystem.config.js && pm2 save
```

## Emergency Backend Restart

```bash
# One-liner to restart backend when API fails
pm2 restart akshar-backend || (pm2 delete akshar-backend; pm2 start ecosystem.config.js; pm2 save)
```

