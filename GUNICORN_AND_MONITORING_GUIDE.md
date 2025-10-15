# 🚀 Gunicorn & Server Monitoring - Complete Guide

## ✅ Status: Fixed & Ready

All issues debugged and resolved!

---

## Part 1: Gunicorn Production Server

### 🔍 **What Was the Problem?**

- PM2 app name conflict (`akshar-backend` was used for both Flask and Gunicorn)
- Solution: Use unique name `akshar-gunicorn`

### ✅ **Gunicorn Works Perfectly!**

Tested manually and confirmed working:
```bash
✅ Gunicorn v23.0.0 running
✅ Backend responding correctly
✅ All routes loading properly
```

### 🚀 **Deploy Gunicorn Now:**

```bash
# 1. Stop current backend
pm2 stop akshar-backend

# 2. Start Gunicorn
pm2 start /var/www/AksharJobs/ecosystem.config.gunicorn-fixed.js

# 3. Save PM2 config
pm2 save

# 4. Verify
pm2 status
pm2 logs akshar-gunicorn --lines 20
curl http://localhost:3002/
```

### 📊 **Gunicorn Configuration:**

- **Workers**: 3 (optimized for small instance)
- **Threads per worker**: 2  
- **Total concurrent requests**: 6
- **Worker class**: gthread (threaded)
- **Timeout**: 120 seconds
- **Port**: 3002

### 🔄 **Rollback (if needed):**

```bash
pm2 delete akshar-gunicorn
pm2 start /var/www/AksharJobs/ecosystem.config.js
pm2 save
```

---

## Part 2: Server Monitoring & Alerts

### 📊 **Monitoring Features:**

✅ **System Health:**
- Disk usage monitoring (Alert at 80%)
- Memory usage monitoring (Alert at 85%)
- CPU usage monitoring (Alert at 90%)

✅ **Service Health:**
- PM2 services status
- Backend health check
- Nginx status
- MongoDB connection

✅ **Log Management:**
- Large log file detection
- Automatic log rotation integration

### 🔔 **Alert Channels:**

The monitoring system supports:
- **Console output** (with color coding)
- **Log file** (/var/log/aksharjobs-monitoring.log)
- **Email** (configure in script)
- **Slack** (configure webhook URL)

### 🛠️ **Setup Monitoring:**

```bash
# 1. Install monitoring
/var/www/AksharJobs/setup_monitoring.sh

# 2. Test monitoring
/var/www/AksharJobs/server_monitoring.sh

# 3. View monitoring logs
tail -f /var/log/aksharjobs-monitoring.log
```

### ⚙️ **Configure Alerts:**

Edit `/var/www/AksharJobs/server_monitoring.sh`:

```bash
# 1. Set your email
ALERT_EMAIL="your-email@example.com"

# 2. Set Slack webhook (optional)
# Uncomment and add your webhook URL in send_alert() function

# 3. Adjust thresholds
DISK_THRESHOLD=80      # Disk usage alert
MEMORY_THRESHOLD=85    # Memory usage alert
CPU_THRESHOLD=90       # CPU usage alert
```

### 📅 **Monitoring Schedule:**

- **Frequency**: Every 5 minutes (via cron)
- **Manual run**: `/var/www/AksharJobs/server_monitoring.sh`
- **Logs**: `/var/log/aksharjobs-monitoring.log`

### 📋 **Monitoring Checks:**

| Check | Threshold | Action |
|-------|-----------|--------|
| Disk Usage | >80% | Alert |
| Memory Usage | >85% | Alert |
| CPU Usage | >90% | Alert |
| PM2 Services | Any down | Alert |
| Backend Health | Non-200 | Alert |
| Nginx Status | Not running | Alert |
| Log Files | >100MB | Warning |

---

## 🎯 Quick Deployment

### Deploy Everything:

```bash
# 1. Connect to server
ssh -i aksharjobs-key.pem ubuntu@13.61.35.12

# 2. Setup monitoring
/var/www/AksharJobs/setup_monitoring.sh

# 3. Test monitoring
/var/www/AksharJobs/server_monitoring.sh

# 4. Deploy Gunicorn (optional)
pm2 stop akshar-backend
pm2 start /var/www/AksharJobs/ecosystem.config.gunicorn-fixed.js
pm2 save
```

---

## 📊 Benefits

### Gunicorn:
- ✅ **6x concurrent requests** (vs 1 with Flask dev)
- ✅ Production-grade WSGI server
- ✅ Better stability under load
- ✅ Proper worker management
- ✅ Graceful restarts

### Monitoring:
- ✅ **Proactive issue detection**
- ✅ Automatic alerts
- ✅ Resource tracking
- ✅ Service health monitoring
- ✅ Log management

---

## 🔍 Verification

### Check Gunicorn:
```bash
pm2 status
pm2 logs akshar-gunicorn
curl http://localhost:3002/
```

### Check Monitoring:
```bash
# View current status
/var/www/AksharJobs/server_monitoring.sh

# View monitoring history
tail -50 /var/log/aksharjobs-monitoring.log

# Check cron jobs
crontab -l | grep monitoring
```

---

## 📚 Files Created

### Gunicorn:
- `/var/www/AksharJobs/ecosystem.config.gunicorn-fixed.js` - Fixed PM2 config
- `/var/www/AksharJobs/backend/wsgi.py` - WSGI entry point

### Monitoring:
- `/var/www/AksharJobs/server_monitoring.sh` - Monitoring script
- `/var/www/AksharJobs/setup_monitoring.sh` - Setup script
- `/var/log/aksharjobs-monitoring.log` - Monitoring log

---

## 🆘 Troubleshooting

### Gunicorn not starting?
```bash
# Check logs
pm2 logs akshar-gunicorn --lines 50

# Test manually
cd /var/www/AksharJobs/backend
source venv/bin/activate
gunicorn --bind 0.0.0.0:3002 wsgi:application
```

### Monitoring not working?
```bash
# Check cron
crontab -l

# Run manually
/var/www/AksharJobs/server_monitoring.sh

# Check dependencies
which jq bc
```

---

## ✅ Summary

**Gunicorn**: ✅ Fixed and ready to deploy  
**Monitoring**: ✅ Ready to activate  
**All Issues**: ✅ Resolved

Deploy at your convenience! 🚀

---

**Last Updated**: October 15, 2025  
**Status**: Production Ready

