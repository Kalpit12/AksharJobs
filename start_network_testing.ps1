# Complete Network Testing Setup Script
# This script handles everything needed to test from another device

Write-Host "`n🚀 AksharJobs Network Testing Setup" -ForegroundColor Cyan
Write-Host "=" -Repeat 50 -ForegroundColor Cyan

# Step 1: Get local IP
Write-Host "`n📍 Step 1: Finding your local IP address..." -ForegroundColor Yellow
& "$PSScriptRoot\get_local_ip.ps1"

# Step 2: Check firewall
Write-Host "`n🔥 Step 2: Checking firewall configuration..." -ForegroundColor Yellow

$backendRule = Get-NetFirewallRule -DisplayName "AksharJobs Backend*" -ErrorAction SilentlyContinue
$frontendRule = Get-NetFirewallRule -DisplayName "AksharJobs Frontend*" -ErrorAction SilentlyContinue

if ($backendRule -and $frontendRule) {
    Write-Host "✅ Firewall rules are configured!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Firewall rules are not configured!" -ForegroundColor Yellow
    Write-Host "   Would you like to configure them now? (Requires Administrator)" -ForegroundColor White
    $response = Read-Host "   Configure firewall? (Y/N)"
    
    if ($response -eq 'Y' -or $response -eq 'y') {
        Start-Process powershell -Verb RunAs -ArgumentList "-NoExit", "-File", "$PSScriptRoot\setup_firewall.ps1"
        Write-Host "`n⏳ Please complete the firewall setup in the Administrator window..." -ForegroundColor Yellow
        Read-Host "Press Enter when firewall setup is complete"
    }
}

# Step 3: Guide to start servers
Write-Host "`n🖥️  Step 3: Starting servers..." -ForegroundColor Yellow
Write-Host "`nYou need to start TWO servers in separate terminals:" -ForegroundColor Cyan

Write-Host "`n📦 Terminal 1 - Backend:" -ForegroundColor Green
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   .\start_backend_network.ps1" -ForegroundColor White

Write-Host "`n📦 Terminal 2 - Frontend:" -ForegroundColor Green
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   .\start_frontend_network.ps1" -ForegroundColor White

Write-Host "`n💡 Quick Start Options:" -ForegroundColor Cyan
Write-Host "   [1] Start Backend only" -ForegroundColor White
Write-Host "   [2] Start Frontend only" -ForegroundColor White
Write-Host "   [3] Open both terminals (you start manually)" -ForegroundColor White
Write-Host "   [4] Skip (I'll start them myself)" -ForegroundColor White

$choice = Read-Host "`nEnter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host "`n🚀 Starting Backend..." -ForegroundColor Green
        $backendPath = Join-Path $PSScriptRoot "backend"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; .\start_backend_network.ps1"
    }
    "2" {
        Write-Host "`n🚀 Starting Frontend..." -ForegroundColor Green
        $frontendPath = Join-Path $PSScriptRoot "frontend"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; .\start_frontend_network.ps1"
    }
    "3" {
        Write-Host "`n🚀 Opening terminals..." -ForegroundColor Green
        $backendPath = Join-Path $PSScriptRoot "backend"
        $frontendPath = Join-Path $PSScriptRoot "frontend"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Backend Terminal' -ForegroundColor Green; Write-Host 'Run: .\start_backend_network.ps1' -ForegroundColor Yellow; cd '$backendPath'"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Frontend Terminal' -ForegroundColor Green; Write-Host 'Run: .\start_frontend_network.ps1' -ForegroundColor Yellow; cd '$frontendPath'"
    }
    "4" {
        Write-Host "`n✅ Skipping server startup" -ForegroundColor Green
    }
    default {
        Write-Host "`n⚠️  Invalid choice. Please start servers manually." -ForegroundColor Yellow
    }
}

# Step 4: Final instructions
Write-Host "`n✅ Setup Complete!" -ForegroundColor Green
Write-Host "`n📱 To test from another device:" -ForegroundColor Cyan
Write-Host "   1. Ensure both devices are on the same Wi-Fi network" -ForegroundColor White
Write-Host "   2. Make sure both servers are running" -ForegroundColor White
Write-Host "   3. On your other device, visit the URL shown above" -ForegroundColor White

Write-Host "`n📚 For detailed guide, see: LOCAL_NETWORK_TESTING_GUIDE.md" -ForegroundColor Yellow

Write-Host ""

