# AksharJobs - Network Agnostic Startup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    AksharJobs - Network Agnostic" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔍 Detecting network configuration..." -ForegroundColor Yellow
Write-Host ""

# Change to backend directory
Set-Location "$PSScriptRoot\backend"

Write-Host "📡 Starting backend server with automatic network detection..." -ForegroundColor Green
Write-Host "🌐 The server will automatically adapt to your current network" -ForegroundColor Green
Write-Host "📱 You can access it from any device on the same network" -ForegroundColor Green
Write-Host ""

# Start the Python backend
python app.py

Write-Host ""
Write-Host "✅ Backend server stopped." -ForegroundColor Green
Read-Host "Press Enter to continue"
