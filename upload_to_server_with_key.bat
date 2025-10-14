@echo off
REM Upload PM2 deployment files to Ubuntu server with SSH key (Windows version)
REM Usage: upload_to_server_with_key.bat [user@]hostname [path_to_key]

if "%1"=="" (
    echo Usage: upload_to_server_with_key.bat [user@]hostname [path_to_key]
    echo Example: upload_to_server_with_key.bat ubuntu@13.61.35.12 C:\Users\kalpi\.ssh\akshar-key.pem
    exit /b 1
)

if "%2"=="" (
    echo Error: SSH key path required
    echo Usage: upload_to_server_with_key.bat [user@]hostname [path_to_key]
    echo Example: upload_to_server_with_key.bat ubuntu@13.61.35.12 C:\Users\kalpi\.ssh\akshar-key.pem
    exit /b 1
)

set SERVER=%1
set SSH_KEY=%2
set REMOTE_PATH=/var/www/AksharJobs

echo 📤 Uploading PM2 deployment files to %SERVER%
echo 🔑 Using SSH key: %SSH_KEY%
echo ==============================================
echo.

REM Upload files using scp with SSH key
echo Uploading ecosystem.config.js...
scp -i "%SSH_KEY%" ecosystem.config.js %SERVER%:%REMOTE_PATH%/

echo Uploading backend/app_production.py...
scp -i "%SSH_KEY%" backend\app_production.py %SERVER%:%REMOTE_PATH%/backend/

echo Uploading deploy_backend_pm2.sh...
scp -i "%SSH_KEY%" deploy_backend_pm2.sh %SERVER%:%REMOTE_PATH%/

echo Uploading monitor_backend.sh...
scp -i "%SSH_KEY%" monitor_backend.sh %SERVER%:%REMOTE_PATH%/

echo Uploading setup_pm2_startup.sh...
scp -i "%SSH_KEY%" setup_pm2_startup.sh %SERVER%:%REMOTE_PATH%/

echo Uploading nginx_backend_check.sh...
scp -i "%SSH_KEY%" nginx_backend_check.sh %SERVER%:%REMOTE_PATH%/

echo Uploading PM2_DEPLOYMENT_GUIDE.md...
scp -i "%SSH_KEY%" PM2_DEPLOYMENT_GUIDE.md %SERVER%:%REMOTE_PATH%/

echo Uploading pm2_commands.md...
scp -i "%SSH_KEY%" pm2_commands.md %SERVER%:%REMOTE_PATH%/

echo.
echo 🔧 Making scripts executable on server...
ssh -i "%SSH_KEY%" %SERVER% "cd /var/www/AksharJobs && chmod +x deploy_backend_pm2.sh monitor_backend.sh setup_pm2_startup.sh nginx_backend_check.sh backend/app_production.py"

echo.
echo ✅ Upload complete!
echo.
echo 📋 Next steps (run on server):
echo   ssh -i "%SSH_KEY%" %SERVER%
echo   cd /var/www/AksharJobs
echo   ./deploy_backend_pm2.sh
echo.

pause

