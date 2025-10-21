# Connect to Ubuntu Server with Saved Credentials
# Edit the connection details below

# ===== EDIT YOUR CONNECTION DETAILS HERE =====
$SSH_USERNAME = "your_username"
$SSH_SERVER = "your_server_ip"  # Example: "192.168.1.100" or "example.com"
$SSH_PORT = "22"
$SSH_KEY_PATH = ""  # Optional: path to SSH key file, e.g., "C:\Users\YourName\.ssh\id_rsa"
# =============================================

Write-Host "`n🌐 Connecting to Ubuntu Server" -ForegroundColor Cyan
Write-Host "=" -Repeat 50 -ForegroundColor Cyan

# Validate configuration
if ($SSH_USERNAME -eq "your_username" -or $SSH_SERVER -eq "your_server_ip") {
    Write-Host "`n❌ Please edit this script and set your connection details!" -ForegroundColor Red
    Write-Host "`nEdit: connect_ubuntu_saved.ps1" -ForegroundColor Yellow
    Write-Host "Set:" -ForegroundColor Yellow
    Write-Host "  - SSH_USERNAME (e.g., 'ubuntu', 'root', 'admin')" -ForegroundColor White
    Write-Host "  - SSH_SERVER (e.g., '192.168.1.100' or 'example.com')" -ForegroundColor White
    Write-Host "  - SSH_PORT (default: 22)" -ForegroundColor White
    Write-Host "  - SSH_KEY_PATH (optional, for key-based auth)" -ForegroundColor White
    exit 1
}

Write-Host "`n✅ Connection Details:" -ForegroundColor Green
Write-Host "   Username: $SSH_USERNAME" -ForegroundColor White
Write-Host "   Server:   $SSH_SERVER" -ForegroundColor White
Write-Host "   Port:     $SSH_PORT" -ForegroundColor White

# Build SSH command
if ($SSH_KEY_PATH -and (Test-Path $SSH_KEY_PATH)) {
    $sshCommand = "ssh -i `"$SSH_KEY_PATH`" $SSH_USERNAME@$SSH_SERVER -p $SSH_PORT"
    Write-Host "   Auth:     SSH Key" -ForegroundColor White
} else {
    $sshCommand = "ssh $SSH_USERNAME@$SSH_SERVER -p $SSH_PORT"
    Write-Host "   Auth:     Password" -ForegroundColor White
}

Write-Host "`n🔐 Connecting..." -ForegroundColor Yellow

# Open in Windows Terminal if available
if (Get-Command wt -ErrorAction SilentlyContinue) {
    Start-Process wt -ArgumentList $sshCommand
} else {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $sshCommand
}

Write-Host "✅ Ubuntu terminal opened!" -ForegroundColor Green
Write-Host "`n💡 Tip: You can save multiple connection scripts for different servers" -ForegroundColor Cyan

