# Fix 502 Backend Errors - Using Native Windows SSH
# This script uses Windows built-in SSH instead of PuTTY

Write-Host "`n🔧 AksharJobs Backend 502 Error Fix Script (Native SSH)" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan

# Configuration
$SERVER_IP = "13.61.35.12"
$SERVER_USER = "ubuntu"
$KEY_FILE = "aksharjobs-key.pem"
$PROJECT_PATH = "/var/www/AksharJobs"

Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow

# Check if key file exists
if (-not (Test-Path $KEY_FILE)) {
    Write-Host "❌ Key file not found: $KEY_FILE" -ForegroundColor Red
    Write-Host "Please ensure the key file is in the current directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Key file found: $KEY_FILE" -ForegroundColor Green

# Test if SSH is available
$sshPath = Get-Command ssh -ErrorAction SilentlyContinue
if (-not $sshPath) {
    Write-Host "❌ SSH command not found!" -ForegroundColor Red
    Write-Host "Please enable OpenSSH Client in Windows Settings" -ForegroundColor Yellow
    Write-Host "Settings > Apps > Optional Features > OpenSSH Client" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ SSH is available" -ForegroundColor Green

Write-Host "`n🔍 Step 1: Checking Backend Status..." -ForegroundColor Cyan
Write-Host "Connecting to server..." -ForegroundColor Gray

# First, ensure key has correct permissions (Windows SSH is picky about this)
icacls $KEY_FILE /inheritance:r 2>$null
icacls $KEY_FILE /grant:r "$($env:USERNAME):(R)" 2>$null

$checkCmd = "pm2 status"
Write-Host "Executing: $checkCmd" -ForegroundColor Gray
ssh -i $KEY_FILE -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" $checkCmd

Write-Host "`n🔍 Step 2: Checking for errors..." -ForegroundColor Cyan
$logsCmd = "pm2 logs akshar-backend --lines 50 --nostream"
Write-Host "Executing: $logsCmd" -ForegroundColor Gray
ssh -i $KEY_FILE -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" $logsCmd

Write-Host "`n🔄 Step 3: Restarting Backend..." -ForegroundColor Cyan
Write-Host "Executing restart sequence..." -ForegroundColor Gray

# Comprehensive restart commands
$restartCommands = "cd $PROJECT_PATH ; echo '🛑 Stopping backend...' ; pm2 stop akshar-backend 2>/dev/null || echo 'Backend was not running' ; echo '🧹 Clearing port 3002...' ; sudo lsof -ti:3002 | xargs sudo kill -9 2>/dev/null || echo 'Port 3002 is clear' ; echo '🚀 Starting backend...' ; pm2 start ecosystem.config.js ; pm2 save ; sleep 3 ; echo '✅ Backend restarted!' ; pm2 status ; echo '' ; echo '🧪 Testing health endpoint...' ; curl -s http://localhost:3002/api/health || echo 'Health check failed - backend may need more time to start'"

ssh -i $KEY_FILE -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" $restartCommands

Write-Host "`n🔍 Step 4: Verifying Backend is Running..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

$verifyCmd = "curl -s http://localhost:3002/api/health ; echo '' ; pm2 status akshar-backend"
Write-Host "Executing: $verifyCmd" -ForegroundColor Gray
ssh -i $KEY_FILE -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" $verifyCmd

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
ssh -i $KEY_FILE -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" $nginxCmd

Write-Host "`n"
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "🎯 Fix Complete!" -ForegroundColor Green
Write-Host ("=" * 60) -ForegroundColor Cyan

Write-Host "`n📝 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Refresh your browser to see if the 502 errors are gone" -ForegroundColor White
Write-Host "2. If errors persist, check the logs above for specific issues" -ForegroundColor White
Write-Host "3. Test your dashboard at: http://$SERVER_IP/dashboard" -ForegroundColor White

Write-Host "`n🔗 Quick Test URLs:" -ForegroundColor Yellow
Write-Host "- Health: http://$SERVER_IP/api/health" -ForegroundColor White
Write-Host "- Data: http://$SERVER_IP/api/data" -ForegroundColor White
Write-Host "- Profile: http://$SERVER_IP/api/jobseeker/profile" -ForegroundColor White

Write-Host "`n💡 If issues persist, run: ssh -i $KEY_FILE $SERVER_USER@$SERVER_IP 'pm2 logs akshar-backend'" -ForegroundColor Cyan
Write-Host ""

