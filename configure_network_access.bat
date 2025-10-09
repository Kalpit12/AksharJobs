@echo off
echo ========================================
echo    AksharJobs - Network Access Setup
echo ========================================
echo.

echo 🔧 Configuring Windows Firewall for network access...
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Running as Administrator - proceeding with firewall configuration
) else (
    echo ❌ This script requires Administrator privileges
    echo 📋 Please right-click and "Run as administrator"
    pause
    exit /b 1
)

echo.
echo 🔥 Configuring Windows Firewall rules...

REM Allow inbound connections on port 3002 (Backend)
echo Adding firewall rule for Backend (Port 3002)...
netsh advfirewall firewall add rule name="AksharJobs Backend" dir=in action=allow protocol=TCP localport=3002
if %errorLevel% == 0 (
    echo ✅ Backend firewall rule added successfully
) else (
    echo ⚠️  Backend firewall rule may already exist
)

REM Allow inbound connections on port 3003 (Frontend)
echo Adding firewall rule for Frontend (Port 3003)...
netsh advfirewall firewall add rule name="AksharJobs Frontend" dir=in action=allow protocol=TCP localport=3003
if %errorLevel% == 0 (
    echo ✅ Frontend firewall rule added successfully
) else (
    echo ⚠️  Frontend firewall rule may already exist
)

echo.
echo 🌐 Getting your local IP address...

REM Get local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "ip=%%a"
    set "ip=!ip: =!"
    goto :found_ip
)
:found_ip

echo.
echo 📍 Your local IP address: %ip%
echo.
echo 🌍 Network Access Information:
echo    Backend API: http://%ip%:3002
echo    Frontend: http://%ip%:3003
echo.
echo 📱 Share this URL with others on your WiFi: http://%ip%:3003
echo.
echo ✅ Firewall configuration complete!
echo.
echo 🚀 You can now start the servers using:
echo    start_network_access.bat
echo.
pause
