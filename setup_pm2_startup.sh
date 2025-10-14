#!/bin/bash
# Setup PM2 to start on system boot
# Run this ONCE after deploying with PM2

echo "🔧 Setting up PM2 startup on system boot"
echo "=========================================="

# Generate the startup script
echo "Step 1: Generating startup script..."
pm2 startup systemd

echo ""
echo "Step 2: Saving current PM2 process list..."
pm2 save

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 To verify the setup:"
echo "  1. Check PM2 list: pm2 list"
echo "  2. Reboot the server: sudo reboot"
echo "  3. After reboot, check if backend is running: pm2 list"
echo ""
echo "🔍 To test without rebooting:"
echo "  sudo systemctl status pm2-ubuntu"
echo ""

