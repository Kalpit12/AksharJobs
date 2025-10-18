# Quick Backend Status Check Script
# This script checks the backend status WITHOUT making any changes

Write-Host "📊 AksharJobs Backend Status Check" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

$SERVER_IP = "13.61.35.12"
$SERVER_USER = "ubuntu"
$KEY_FILE = "aksharjobs-key.ppk"
$plinkPath = "C:\Program Files\PuTTY\plink.exe"

Write-Host "`n1️⃣ Testing Public API Endpoint..." -ForegroundColor Yellow
try {
    $healthUrl = "http://${SERVER_IP}/api/health"
    Write-Host "   Testing: $healthUrl" -ForegroundColor Gray
    $response = Invoke-WebRequest -Uri $healthUrl -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ Backend is responding!" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Green
    Write-Host "`n   🎉 Your backend is WORKING! No fix needed." -ForegroundColor Green
    exit 0
} catch {
    Write-Host "   ❌ Backend not responding: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "   Error Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
}

Write-Host "`n2️⃣ Checking if PuTTY is available..." -ForegroundColor Yellow
if (Test-Path $plinkPath) {
    Write-Host "   ✅ PuTTY found" -ForegroundColor Green
    
    if (Test-Path $KEY_FILE) {
        Write-Host "   ✅ Key file found" -ForegroundColor Green
        
        Write-Host "`n3️⃣ Checking PM2 status on server..." -ForegroundColor Yellow
        & $plinkPath -i $KEY_FILE -batch "$SERVER_USER@$SERVER_IP" "pm2 status akshar-backend" 2>$null
        
        Write-Host "`n4️⃣ Checking if backend process is running..." -ForegroundColor Yellow
        & $plinkPath -i $KEY_FILE -batch "$SERVER_USER@$SERVER_IP" "ps aux | grep -v grep | grep 'app_production.py' || echo 'Backend process not found'" 2>$null
        
        Write-Host "`n5️⃣ Checking port 3002..." -ForegroundColor Yellow
        & $plinkPath -i $KEY_FILE -batch "$SERVER_USER@$SERVER_IP" "sudo lsof -i :3002 || echo 'Nothing listening on port 3002'" 2>$null
        
        Write-Host "`n6️⃣ Recent backend logs..." -ForegroundColor Yellow
        & $plinkPath -i $KEY_FILE -batch "$SERVER_USER@$SERVER_IP" "pm2 logs akshar-backend --lines 20 --nostream 2>/dev/null || echo 'No PM2 logs available'" 2>$null
    } else {
        Write-Host "   ❌ Key file not found: $KEY_FILE" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ PuTTY not found at $plinkPath" -ForegroundColor Red
}

Write-Host "`n" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "📋 Diagnosis Complete" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

Write-Host "`n🔧 To fix the issues, run: .\fix_502_errors.ps1" -ForegroundColor Yellow
Write-Host ""

