@echo off
echo ========================================
echo    AksharJobs Network Setup
echo ========================================
echo.

echo Checking if running as Administrator...
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Running as Administrator
) else (
    echo ❌ NOT running as Administrator
    echo.
    echo Please right-click this file and select "Run as Administrator"
    echo.
    pause
    exit /b 1
)

echo.
echo Configuring Windows Firewall...
netsh advfirewall firewall add rule name="AksharJobs Backend" dir=in action=allow protocol=TCP localport=3002 >nul 2>&1
netsh advfirewall firewall add rule name="AksharJobs Frontend" dir=in action=allow protocol=TCP localport=3003 >nul 2>&1
echo ✅ Firewall configured

echo.
echo Starting Backend Service...
start "Backend" /d "%~dp0backend" cmd /k "python app.py"

echo.
echo Starting Frontend Service...
start "Frontend" /d "%~dp0frontend" cmd /k "set PORT=3003 && npm start -- --host 0.0.0.0"

echo.
echo ========================================
echo    🎉 Website Started Successfully!
echo ========================================
echo.
echo 📱 LOCAL ACCESS:
echo    Backend: http://localhost:3002
echo    Frontend: http://localhost:3003
echo.
echo 🌐 NETWORK ACCESS (for other PCs):
echo    Backend: http://%COMPUTERNAME%:3002
echo    Frontend: http://%COMPUTERNAME%:3003
echo.
echo 🔍 Your IP Addresses:
ipconfig | findstr "IPv4"
echo.
echo 💡 Other PCs can now access your website using:
echo    http://YOUR_IP_ADDRESS:3003
echo.
echo ⚠️  Make sure both command windows show the services running
echo.
echo Press any key to continue...
pause >nul
