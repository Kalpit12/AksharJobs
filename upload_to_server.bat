@echo off
REM Upload PM2 deployment files to Ubuntu server (Windows version)
REM Usage: upload_to_server.bat [user@]hostname

if "%1"=="" (
    echo Usage: upload_to_server.bat [user@]hostname
    echo Example: upload_to_server.bat ubuntu@13.127.45.123
    exit /b 1
)

set SERVER=%1
set REMOTE_PATH=/var/www/AksharJobs

echo 📤 Uploading PM2 deployment files to %SERVER%
echo ==============================================
echo.

REM Upload files using scp
echo Uploading ecosystem.config.js...
scp ecosystem.config.js %SERVER%:%REMOTE_PATH%/

echo Uploading backend/app_production.py...
scp backend\app_production.py %SERVER%:%REMOTE_PATH%/backend/

echo Uploading deploy_backend_pm2.sh...
scp deploy_backend_pm2.sh %SERVER%:%REMOTE_PATH%/

echo Uploading monitor_backend.sh...
scp monitor_backend.sh %SERVER%:%REMOTE_PATH%/

echo Uploading setup_pm2_startup.sh...
scp setup_pm2_startup.sh %SERVER%:%REMOTE_PATH%/

echo Uploading nginx_backend_check.sh...
scp nginx_backend_check.sh %SERVER%:%REMOTE_PATH%/

echo Uploading PM2_DEPLOYMENT_GUIDE.md...
scp PM2_DEPLOYMENT_GUIDE.md %SERVER%:%REMOTE_PATH%/

echo Uploading pm2_commands.md...
scp pm2_commands.md %SERVER%:%REMOTE_PATH%/

echo.
echo 🔧 Making scripts executable on server...
ssh %SERVER% "cd /var/www/AksharJobs && chmod +x deploy_backend_pm2.sh monitor_backend.sh setup_pm2_startup.sh nginx_backend_check.sh backend/app_production.py"

echo.
echo ✅ Upload complete!
echo.
echo 📋 Next steps (run on server):
echo   ssh %SERVER%
echo   cd /var/www/AksharJobs
echo   ./deploy_backend_pm2.sh
echo.

pause

