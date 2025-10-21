# Connect to Ubuntu Server via SSH

Write-Host "`n🌐 Connect to Ubuntu Server via SSH" -ForegroundColor Cyan
Write-Host "=" -Repeat 50 -ForegroundColor Cyan

# Prompt for connection details
Write-Host "`nEnter SSH connection details:" -ForegroundColor Yellow
$username = Read-Host "Username"
$server = Read-Host "Server IP or hostname"
$port = Read-Host "Port (default: 22, press Enter to skip)"

if ([string]::IsNullOrWhiteSpace($port)) {
    $port = "22"
}

$sshCommand = "ssh $username@$server -p $port"

Write-Host "`n📋 Connection command: $sshCommand" -ForegroundColor Cyan
Write-Host "🔐 You will be prompted for password..." -ForegroundColor Yellow

# Open in Windows Terminal if available, otherwise PowerShell
if (Get-Command wt -ErrorAction SilentlyContinue) {
    Write-Host "`n✅ Opening SSH connection in Windows Terminal..." -ForegroundColor Green
    Start-Process wt -ArgumentList $sshCommand
} else {
    Write-Host "`n✅ Opening SSH connection in new terminal..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $sshCommand
}

Write-Host "✅ SSH terminal opened!" -ForegroundColor Green

