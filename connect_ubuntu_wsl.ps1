# Connect to Ubuntu via WSL (Windows Subsystem for Linux)

Write-Host "`n🐧 Connecting to Ubuntu (WSL)..." -ForegroundColor Cyan

# Check if WSL is available
$wslCheck = wsl --list --quiet 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ WSL is not installed or not available" -ForegroundColor Red
    Write-Host "Install WSL: wsl --install" -ForegroundColor Yellow
    exit 1
}

# Start Ubuntu in Windows Terminal (if available) or new PowerShell window
if (Get-Command wt -ErrorAction SilentlyContinue) {
    Write-Host "✅ Opening Ubuntu in Windows Terminal..." -ForegroundColor Green
    Start-Process wt -ArgumentList "wsl -d Ubuntu"
} else {
    Write-Host "✅ Opening Ubuntu in new window..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "wsl -d Ubuntu"
}

Write-Host "✅ Ubuntu terminal opened!" -ForegroundColor Green

