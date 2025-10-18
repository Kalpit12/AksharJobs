# Fix 502 Backend Errors - AWS Server Restart Script
# This script will diagnose and fix the backend server issues

Write-Host "🔧 AksharJobs Backend 502 Error Fix Script" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

# Configuration
$SERVER_IP = "13.61.35.12"
$SERVER_USER = "ubuntu"
$KEY_FILE = "aksharjobs-key.ppk"
$PROJECT_PATH = "/var/www/AksharJobs"

Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow

# Check if PuTTY's plink is available (for SSH from Windows)
$plinkPath = "C:\Program Files\PuTTY\plink.exe"
if (-not (Test-Path $plinkPath)) {
    Write-Host "❌ PuTTY's plink.exe not found at $plinkPath" -ForegroundColor Red
    Write-Host "Please install PuTTY from: https://www.putty.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ PuTTY found" -ForegroundColor Green

# Check if key file exists
if (-not (Test-Path $KEY_FILE)) {
    Write-Host "❌ Key file not found: $KEY_FILE" -ForegroundColor Red
    Write-Host "Please ensure the key file is in the current directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Key file found" -ForegroundColor Green

Write-Host "`n🔍 Step 1: Checking Backend Status..." -ForegroundColor Cyan

# Command to check PM2 status
$checkCmd = "pm2 status"
Write-Host "Executing: $checkCmd" -ForegroundColor Gray
& $plinkPath -i $KEY_FILE -batch "$SERVER_USER@$SERVER_IP" $checkCmd

Write-Host "`n🔍 Step 2: Checking for errors..." -ForegroundColor Cyan
$logsCmd = "pm2 logs akshar-backend --lines 50 --nostream"
Write-Host "Executing: $logsCmd" -ForegroundColor Gray
& $plinkPath -i $KEY_FILE -batch "$SERVER_USER@$SERVER_IP" $logsCmd

Write-Host "`n🔄 Step 3: Restarting Backend..." -ForegroundColor Cyan

# Comprehensive restart commands - use semicolons for bash compatibility
$restartCommands = "cd $PROJECT_PATH ; echo '🛑 Stopping backend...' ; pm2 stop akshar-backend 2>/dev/null || echo 'Backend was not running' ; echo '🧹 Clearing port 3002...' ; sudo lsof -ti:3002 | xargs sudo kill -9 2>/dev/null || echo 'Port 3002 is clear' ; echo '🚀 Starting backend...' ; pm2 start ecosystem.config.js ; pm2 save ; sleep 3 ; echo '✅ Backend restarted!' ; pm2 status ; echo '' ; echo '🧪 Testing health endpoint...' ; curl -s http://localhost:3002/api/health || echo 'Health check failed - backend may need more time to start'"

Write-Host "Executing restart sequence..." -ForegroundColor Gray
& $plinkPath -i $KEY_FILE -batch "$SERVER_USER@$SERVER_IP" $restartCommands

Write-Host "`n🔍 Step 4: Verifying Backend is Running..." -ForegroundColor Cyan

# Wait a moment for backend to fully start
Start-Sleep -Seconds 3

$verifyCmd = "curl -s http://localhost:3002/api/health ; echo '' ; pm2 status akshar-backend"
Write-Host "Executing: $verifyCmd" -ForegroundColor Gray
& $plinkPath -i $KEY_FILE -batch "$SERVER_USER@$SERVER_IP" $verifyCmd

Write-Host "`n🌐 Step 5: Testing Public Endpoint..." -ForegroundColor Cyan

try {
    $healthUrl = "http://${SERVER_IP}/api/health"
    $response = Invoke-WebRequest -Uri $healthUrl -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Public endpoint is working!" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Public endpoint test failed: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "This might be an Nginx configuration issue or backend is still starting" -ForegroundColor Yellow
}

Write-Host "`n📊 Step 6: Checking Nginx Status..." -ForegroundColor Cyan
$nginxCmd = "sudo systemctl status nginx --no-pager -l ; echo '' ; sudo nginx -t"
Write-Host "Executing: $nginxCmd" -ForegroundColor Gray
& $plinkPath -i $KEY_FILE -batch "$SERVER_USER@$SERVER_IP" $nginxCmd

Write-Host "`n" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "🎯 Fix Complete!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan

Write-Host "`n📝 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Refresh your browser to see if the 502 errors are gone" -ForegroundColor White
Write-Host "2. If errors persist, check the logs above for specific issues" -ForegroundColor White
Write-Host "3. Test your dashboard at: http://$SERVER_IP/dashboard" -ForegroundColor White

Write-Host "`n🔗 Quick Test URLs:" -ForegroundColor Yellow
Write-Host "- Health: http://$SERVER_IP/api/health" -ForegroundColor White
Write-Host "- Data: http://$SERVER_IP/api/data" -ForegroundColor White
Write-Host "- Profile: http://$SERVER_IP/api/jobseeker/profile" -ForegroundColor White

Write-Host "`n💡 If issues persist, run: pm2 logs akshar-backend" -ForegroundColor Cyan
Write-Host ""

