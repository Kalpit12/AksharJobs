#!/usr/bin/env python3
"""
WSGI entry point for Gunicorn production server
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

# Gunicorn will use this 'application' object
application = app

if __name__ == "__main__":
    # This is for testing only
    app.run(host='0.0.0.0', port=3002)

