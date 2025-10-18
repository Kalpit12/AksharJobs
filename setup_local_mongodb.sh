#!/bin/bash
# Setup Local MongoDB on AWS Ubuntu Server

echo "=========================================="
echo "  Setting up Local MongoDB"
echo "=========================================="
echo ""

# Check if MongoDB is already installed
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is already installed"
    
    # Check if it's running
    if systemctl is-active --quiet mongod; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is installed but not running"
        echo "Starting MongoDB..."
        sudo systemctl start mongod
        sudo systemctl enable mongod
        echo "✅ MongoDB started"
    fi
else
    echo "📦 Installing MongoDB..."
    echo ""
    
    # Install MongoDB
    sudo apt-get update
    sudo apt-get install -y mongodb
    
    # Start and enable MongoDB
    sudo systemctl start mongodb
    sudo systemctl enable mongodb
    
    echo "✅ MongoDB installed and started"
fi

echo ""
echo "Checking MongoDB status..."
sudo systemctl status mongodb --no-pager -l | head -15

echo ""
echo "Testing MongoDB connection..."
if mongosh --eval "db.version()" 2>/dev/null || mongo --eval "db.version()" 2>/dev/null; then
    echo "✅ MongoDB is accessible"
else
    echo "⚠️  MongoDB connection test inconclusive"
fi

echo ""
echo "=========================================="
echo "  MongoDB Setup Complete!"
echo "=========================================="
echo ""
echo "Next step: Update .env to use local MongoDB"
echo "Run: nano /var/www/AksharJobs/backend/.env"
echo ""
echo "Change MONGO_URI to:"
echo "MONGO_URI=mongodb://localhost:27017/"
echo ""

