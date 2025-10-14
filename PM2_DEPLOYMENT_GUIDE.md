# PM2 Backend Deployment Guide

Complete guide for deploying the AksharJobs Flask backend with PM2 process manager.

## 🎯 What This Fixes

- **Problem**: Backend not running → Nginx shows "connection refused" for `/api/*` routes
- **Solution**: PM2 keeps backend running 24/7 with auto-restart on crashes

## 📋 Prerequisites

1. Ubuntu server with SSH access
2. Python 3.8+ installed
3. Node.js and npm installed
4. MongoDB running (local or Atlas)

## 🚀 Quick Deployment

### On Your Local Machine

```bash
# 1. Upload files to server
scp ecosystem.config.js ubuntu@YOUR_SERVER_IP:/home/ubuntu/AksharJobs/
scp backend/app_production.py ubuntu@YOUR_SERVER_IP:/home/ubuntu/AksharJobs/backend/
scp deploy_backend_pm2.sh ubuntu@YOUR_SERVER_IP:/home/ubuntu/AksharJobs/
scp monitor_backend.sh ubuntu@YOUR_SERVER_IP:/home/ubuntu/AksharJobs/
scp setup_pm2_startup.sh ubuntu@YOUR_SERVER_IP:/home/ubuntu/AksharJobs/
scp nginx_backend_check.sh ubuntu@YOUR_SERVER_IP:/home/ubuntu/AksharJobs/
```

### On Your Server

```bash
# 2. Connect to server
ssh ubuntu@YOUR_SERVER_IP

# 3. Navigate to project
cd /home/ubuntu/AksharJobs

# 4. Make scripts executable
chmod +x *.sh

# 5. Deploy backend with PM2
./deploy_backend_pm2.sh

# 6. Setup auto-start on boot (one-time)
./setup_pm2_startup.sh

# 7. Verify everything is working
./nginx_backend_check.sh
```

## ✅ Verification Steps

### 1. Check PM2 Status

```bash
pm2 status
```

You should see:
```
┌────┬──────────────────┬─────────────┬─────────┬─────────┬──────────┐
│ id │ name             │ mode        │ ↺       │ status  │ cpu      │
├────┼──────────────────┼─────────────┼─────────┼─────────┼──────────┤
│ 0  │ akshar-backend   │ fork        │ 0       │ online  │ 0%       │
└────┴──────────────────┴─────────────┴─────────┴─────────┴──────────┘
```

### 2. Test Health Endpoint

```bash
curl http://localhost:3002/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-14T...",
  "database": "connected",
  "port": 3002
}
```

### 3. Test Through Nginx

```bash
curl http://YOUR_DOMAIN/api/health
# Or
curl http://YOUR_SERVER_IP/api/health
```

### 4. Check Logs

```bash
pm2 logs akshar-backend
```

## 📁 Files Created

| File | Purpose |
|------|---------|
| `ecosystem.config.js` | PM2 configuration |
| `backend/app_production.py` | Production entry point with health check |
| `deploy_backend_pm2.sh` | Automated deployment script |
| `monitor_backend.sh` | Health monitoring script |
| `setup_pm2_startup.sh` | Configure auto-start on boot |
| `nginx_backend_check.sh` | Comprehensive diagnostic tool |

## 🔧 Common Operations

### View Logs

```bash
# Live logs
pm2 logs akshar-backend

# Last 100 lines
pm2 logs akshar-backend --lines 100

# Only errors
pm2 logs akshar-backend --err
```

### Restart Backend

```bash
pm2 restart akshar-backend
```

### Stop Backend

```bash
pm2 stop akshar-backend
```

### Monitor Resources

```bash
pm2 monit
```

### Show Detailed Info

```bash
pm2 info akshar-backend
```

## 🔍 Troubleshooting

### Backend Not Starting

```bash
# Check PM2 list
pm2 list

# Check error logs
pm2 logs akshar-backend --err --lines 50

# Check if port is blocked
sudo netstat -tlnp | grep :3002

# Kill any blocking process
sudo kill -9 $(sudo lsof -t -i:3002)

# Restart
pm2 restart akshar-backend
```

### Connection Refused Errors

```bash
# Run comprehensive check
./nginx_backend_check.sh

# Common issues:
# 1. Backend not running → pm2 start ecosystem.config.js
# 2. Port mismatch → Check ecosystem.config.js and Nginx config
# 3. Firewall → sudo ufw allow 3002
```

### Database Connection Issues

```bash
# Check MongoDB status
sudo systemctl status mongod

# Or for MongoDB Atlas, check connection string in .env
cat backend/.env | grep MONGO_URI

# Test connection
cd backend
python3 -c "from database import get_database; db = get_database(); print(db.list_collection_names())"
```

### PM2 Process Crashes Repeatedly

```bash
# View crash logs
pm2 logs akshar-backend --err

# Common causes:
# 1. Missing environment variables
# 2. Port already in use
# 3. Python dependencies missing
# 4. MongoDB not accessible

# Check dependencies
pip3 list | grep -i flask

# Reinstall if needed
cd /home/ubuntu/AksharJobs
pip3 install -r backend/requirements.txt
```

## 🔄 Auto-Restart Configuration

PM2 is configured to automatically:
- ✅ Restart on crashes
- ✅ Restart if memory exceeds 1GB
- ✅ Wait 4 seconds between restart attempts
- ✅ Stop after 10 consecutive failures
- ✅ Start on system boot

Configuration in `ecosystem.config.js`:
```javascript
autorestart: true,
max_memory_restart: '1G',
min_uptime: '10s',
max_restarts: 10,
restart_delay: 4000
```

## 📊 Monitoring

### Option 1: Built-in Health Monitor

Run the monitoring script in the background:

```bash
# Start monitor
nohup ./monitor_backend.sh > monitor.log 2>&1 &

# Check monitor status
ps aux | grep monitor_backend

# View monitor logs
tail -f monitor.log

# Stop monitor
pkill -f monitor_backend.sh
```

### Option 2: PM2 Plus (Optional)

Free monitoring dashboard:

```bash
pm2 plus
```

Follow the prompts to link your server to PM2's web dashboard.

## 🌐 Nginx Configuration

Your Nginx config should include:

```nginx
location /api/ {
    proxy_pass http://localhost:3002;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    
    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

After any Nginx config changes:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 🔐 Security Notes

1. **Environment Variables**: Store sensitive data in `backend/.env`
2. **Firewall**: Only expose necessary ports (80, 443)
3. **PM2 Logs**: Contains sensitive data, protect with proper permissions
4. **Regular Updates**: Keep PM2 and dependencies updated

```bash
# Update PM2
npm install -g pm2@latest
pm2 update

# Update Python packages
pip3 install -r backend/requirements.txt --upgrade
```

## 📈 Performance Tuning

For high traffic, consider:

1. **Multiple Instances** (cluster mode):
```javascript
// In ecosystem.config.js
instances: 4,  // Or use "max" for all CPU cores
exec_mode: "cluster"
```

2. **Load Balancing**: Use Nginx upstream with multiple backend instances

3. **Caching**: Implement Redis for session/data caching

## 🆘 Emergency Commands

### Complete Reset

```bash
# Stop everything
pm2 delete all

# Kill any processes on 3002
sudo kill -9 $(sudo lsof -t -i:3002)

# Restart fresh
pm2 start ecosystem.config.js
pm2 save
```

### Quick Restart (One-liner)

```bash
pm2 restart akshar-backend || (pm2 delete akshar-backend; pm2 start ecosystem.config.js; pm2 save)
```

## 📞 Support

If issues persist:
1. Run `./nginx_backend_check.sh` and save output
2. Collect logs: `pm2 logs akshar-backend --lines 200 > backend_logs.txt`
3. Check Nginx logs: `sudo tail -n 100 /var/log/nginx/error.log > nginx_errors.txt`

---

**Last Updated**: October 2025  
**Tested On**: Ubuntu 20.04/22.04 LTS

