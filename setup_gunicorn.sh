#!/bin/bash
# Setup Gunicorn production WSGI server

echo "🚀 Setting up Gunicorn Production Server"
echo "========================================"

cd /var/www/AksharJobs/backend || exit 1

# Activate virtual environment
echo "📦 Activating virtual environment..."
source venv/bin/activate

# Install Gunicorn
echo ""
echo "📥 Installing Gunicorn..."
pip install gunicorn

# Verify installation
echo ""
echo "✅ Gunicorn version:"
gunicorn --version

# Test WSGI application
echo ""
echo "🔍 Testing WSGI application..."
python -c "from wsgi import application; print('✅ WSGI app loaded successfully')"

echo ""
echo "📝 Creating deployment instructions..."
cat > /var/www/AksharJobs/GUNICORN_DEPLOYMENT.md << 'EOF'
# Gunicorn Deployment Guide

## Switch from Flask Dev Server to Gunicorn

### Current Setup (Flask Dev Server):
- Uses: `backend/app_production.py`
- PM2 Config: `ecosystem.config.js`

### New Setup (Gunicorn):
- Uses: `backend/wsgi.py` with Gunicorn
- PM2 Config: `ecosystem.config.gunicorn.js`

## Deployment Steps:

### 1. Stop current backend:
```bash
pm2 stop akshar-backend
```

### 2. Deploy with Gunicorn:
```bash
pm2 delete akshar-backend
pm2 start ecosystem.config.gunicorn.js
pm2 save
```

### 3. Verify:
```bash
pm2 status
pm2 logs akshar-backend --lines 20
curl http://localhost:3002/api/health
```

## Benefits:
- ✅ Production-grade WSGI server
- ✅ Better concurrency (4 workers, 2 threads each)
- ✅ Improved stability and performance
- ✅ Proper timeout handling (120s)
- ✅ Thread-safe request handling

## Configuration:
- Workers: 4 (CPU cores * 2 + 1)
- Threads per worker: 2
- Worker class: gthread (threaded workers)
- Timeout: 120 seconds
- Port: 3002

## Rollback (if needed):
```bash
pm2 delete akshar-backend
pm2 start ecosystem.config.js
pm2 save
```
EOF

echo "✅ Created GUNICORN_DEPLOYMENT.md"

echo ""
echo "✨ Gunicorn setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. Review: /var/www/AksharJobs/GUNICORN_DEPLOYMENT.md"
echo "2. Deploy: pm2 delete akshar-backend && pm2 start ecosystem.config.gunicorn.js"
echo "3. Save: pm2 save"

