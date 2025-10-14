# JobSeeker Dashboard Deployment Script
# PowerShell version with proper SSH key handling

$ErrorActionPreference = "Stop"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Deploy JobSeeker Dashboard to Server" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$SERVER_IP = "13.61.35.12"
$SSH_KEY = "C:\Users\kalpi\key.pem"
$REMOTE_PATH = "/var/www/AksharJobs/frontend/build/"
$LOCAL_BUILD = "frontend\build"

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Server: ubuntu@$SERVER_IP"
Write-Host "  SSH Key: $SSH_KEY"
Write-Host "  Remote Path: $REMOTE_PATH"
Write-Host ""

# Check if SSH key exists
if (-not (Test-Path $SSH_KEY)) {
    Write-Host "[ERROR] SSH key not found at: $SSH_KEY" -ForegroundColor Red
    Write-Host "Please update the SSH_KEY variable in this script with the correct path." -ForegroundColor Yellow
    exit 1
}

# Check if build folder exists
if (-not (Test-Path $LOCAL_BUILD)) {
    Write-Host "[ERROR] Build folder not found at: $LOCAL_BUILD" -ForegroundColor Red
    Write-Host "Please run 'npm run build' in the frontend directory first." -ForegroundColor Yellow
    exit 1
}

Write-Host "[INFO] Files to upload:" -ForegroundColor Green
Get-ChildItem -Path $LOCAL_BUILD -Recurse | Measure-Object | ForEach-Object { Write-Host "  Total items: $($_.Count)" }

Write-Host ""
$confirm = Read-Host "Continue with deployment? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Step 1: Testing SSH Connection" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

try {
    # Test SSH connection
    $testCmd = "ssh -i `"$SSH_KEY`" -o StrictHostKeyChecking=no -o UserKnownHostsFile=NUL ubuntu@$SERVER_IP echo 'Connection successful'"
    Write-Host "[INFO] Testing connection..." -ForegroundColor Yellow
    Invoke-Expression $testCmd
    Write-Host "[OK] SSH connection successful" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] SSH connection failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting steps:" -ForegroundColor Yellow
    Write-Host "1. Verify SSH key path is correct: $SSH_KEY"
    Write-Host "2. Try using WinSCP (GUI method) instead"
    Write-Host "3. Check if you can connect manually: ssh -i `"$SSH_KEY`" ubuntu@$SERVER_IP"
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Step 2: Preparing Server Directory" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

$prepareCmd = @"
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no ubuntu@$SERVER_IP "bash -c 'cd /var/www/AksharJobs/frontend && sudo mkdir -p build && sudo chown -R ubuntu:www-data build && sudo chmod -R 755 build'"
"@

try {
    Write-Host "[INFO] Creating and setting permissions on server..." -ForegroundColor Yellow
    Invoke-Expression $prepareCmd
    Write-Host "[OK] Server directory prepared" -ForegroundColor Green
}
catch {
    Write-Host "[WARNING] Could not prepare directory, will try to upload anyway..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Step 3: Uploading Files" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "[INFO] This may take a few minutes..." -ForegroundColor Yellow
Write-Host ""

# Upload files using SCP
$scpCmd = "scp -i `"$SSH_KEY`" -o StrictHostKeyChecking=no -r $LOCAL_BUILD\* ubuntu@${SERVER_IP}:$REMOTE_PATH"

try {
    Invoke-Expression $scpCmd
    Write-Host ""
    Write-Host "[OK] Files uploaded successfully" -ForegroundColor Green
}
catch {
    Write-Host ""
    Write-Host "[ERROR] File upload failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative method:" -ForegroundColor Yellow
    Write-Host "1. Download WinSCP: https://winscp.net/"
    Write-Host "2. Connect using your SSH key"
    Write-Host "3. Upload files from: $LOCAL_BUILD"
    Write-Host "4. To server location: $REMOTE_PATH"
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Step 4: Setting Permissions" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

$permCmd = @"
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no ubuntu@$SERVER_IP "bash -c 'cd $REMOTE_PATH && sudo chown -R ubuntu:www-data . && sudo chmod -R 755 . && sudo find . -type f -exec chmod 644 {} \;'"
"@

try {
    Write-Host "[INFO] Setting file permissions..." -ForegroundColor Yellow
    Invoke-Expression $permCmd
    Write-Host "[OK] Permissions set correctly" -ForegroundColor Green
}
catch {
    Write-Host "[WARNING] Could not set all permissions, but files are uploaded" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Step 5: Reloading Nginx" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

$nginxCmd = @"
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no ubuntu@$SERVER_IP "bash -c 'sudo nginx -t && sudo systemctl reload nginx'"
"@

try {
    Write-Host "[INFO] Testing and reloading Nginx..." -ForegroundColor Yellow
    Invoke-Expression $nginxCmd
    Write-Host "[OK] Nginx reloaded successfully" -ForegroundColor Green
}
catch {
    Write-Host "[WARNING] Nginx reload may have failed, but files are uploaded" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your JobSeeker Dashboard is now live!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access your dashboard:" -ForegroundColor Yellow
Write-Host "  1. Open: http://$SERVER_IP" -ForegroundColor White
Write-Host "  2. Login as a job seeker" -ForegroundColor White
Write-Host "  3. Click 'Go to Dashboard' button" -ForegroundColor White
Write-Host "  4. Explore the new dashboard!" -ForegroundColor White
Write-Host ""
Write-Host "[TIP] Clear browser cache (Ctrl+Shift+Delete) if you see old content" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

