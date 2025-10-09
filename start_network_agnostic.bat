@echo off
echo ========================================
echo    AksharJobs - Network Agnostic
echo ========================================
echo.

echo 🔍 Detecting network configuration...
echo.

cd /d "%~dp0backend"

echo 📡 Starting backend server with automatic network detection...
echo 🌐 The server will automatically adapt to your current network
echo 📱 You can access it from any device on the same network
echo.

python app.py

echo.
echo ✅ Backend server stopped.
pause
