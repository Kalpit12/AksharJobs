#!/usr/bin/env python3
"""
Production entry point for AksharJobs Flask Backend
Optimized for PM2 process management
"""

import os
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.absolute()
sys.path.insert(0, str(backend_dir))

# Change to backend directory
os.chdir(backend_dir)

# Import the Flask app
from app import app

# Note: Health check endpoint already exists at / in app.py
# Additional health endpoint for PM2 monitoring
@app.route('/api/pm2/health', methods=['GET'])
def pm2_health_check():
    """PM2-specific health check endpoint"""
    from datetime import datetime
    from flask import jsonify
    
    try:
        # Quick MongoDB connection check
        from database import get_database
        db = get_database()
        db.command('ping')
        db_status = 'connected'
    except Exception as e:
        db_status = f'error: {str(e)}'
    
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'database': db_status,
        'port': 3002,
        'pm2_managed': True
    }), 200

if __name__ == '__main__':
    print("🚀 Starting AksharJobs Backend (Production Mode)")
    print("=" * 50)
    print(f"📍 Working Directory: {os.getcwd()}")
    print(f"🌐 Server: http://0.0.0.0:3002")
    print(f"📊 Health Check: http://localhost:3002/api/health")
    print("=" * 50)
    
    # Run in production mode (no debug, no reloader)
    app.run(
        host='0.0.0.0',
        port=3002,
        debug=False,  # Production mode
        use_reloader=False,  # PM2 handles restarts
        threaded=True  # Better concurrency
    )

