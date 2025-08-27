@echo off
echo Configuring Windows Firewall for AksharJobs Network Access...
echo.

echo Adding firewall rules for Backend (Port 5000)...
netsh advfirewall firewall add rule name="AksharJobs Backend" dir=in action=allow protocol=TCP localport=5000

echo Adding firewall rules for Frontend (Port 3002)...
netsh advfirewall firewall add rule name="AksharJobs Frontend" dir=in action=allow protocol=TCP localport=3002

echo.
echo Firewall rules added successfully!
echo.
echo Your website should now be accessible from other PCs on your network.
echo.
echo To verify, run: netstat -an | findstr ":5000\|:3002"
echo.
pause
