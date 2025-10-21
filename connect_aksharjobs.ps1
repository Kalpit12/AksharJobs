# Connect to AksharJobs Ubuntu Server
# Uses the aksharjobs-key.pem for authentication

Write-Host "`n🚀 Connecting to AksharJobs Ubuntu Server" -ForegroundColor Cyan
Write-Host "=" -Repeat 50 -ForegroundColor Cyan

# Configuration - EDIT THESE VALUES
$SERVER_IP = "your-server-ip"  # e.g., "54.123.45.67" or "aksharjobs.com"
$USERNAME = "ubuntu"  # Common for AWS EC2: ubuntu, ec2-user, or admin
$PEM_FILE = "aksharjobs-key.pem.bak"

# Validate PEM file exists
if (-not (Test-Path $PEM_FILE)) {
    Write-Host "`n❌ PEM file not found: $PEM_FILE" -ForegroundColor Red
    Write-Host "`nSearching for PEM files..." -ForegroundColor Yellow
    
    $pemFiles = Get-ChildItem -Path . -Filter "*.pem*" -File
    if ($pemFiles) {
        Write-Host "`n✅ Found these key files:" -ForegroundColor Green
        foreach ($file in $pemFiles) {
            Write-Host "   - $($file.Name)" -ForegroundColor White
        }
        Write-Host "`nEdit this script and set PEM_FILE to the correct filename." -ForegroundColor Yellow
    } else {
        Write-Host "`nNo PEM files found in current directory." -ForegroundColor Red
    }
    exit 1
}

# Check if server IP is configured
if ($SERVER_IP -eq "your-server-ip") {
    Write-Host "`n⚠️  Server IP not configured!" -ForegroundColor Yellow
    Write-Host "`nPlease edit this script (connect_aksharjobs.ps1) and set:" -ForegroundColor Cyan
    Write-Host "   - SERVER_IP: Your Ubuntu server IP or hostname" -ForegroundColor White
    Write-Host "   - USERNAME: Usually 'ubuntu', 'ec2-user', or 'admin' for AWS" -ForegroundColor White
    Write-Host ""
    
    # Interactive mode
    $response = Read-Host "Enter server details now? (Y/N)"
    if ($response -eq 'Y' -or $response -eq 'y') {
        $SERVER_IP = Read-Host "Enter server IP or hostname"
        $USERNAME = Read-Host "Enter username (default: ubuntu)"
        if ([string]::IsNullOrWhiteSpace($USERNAME)) {
            $USERNAME = "ubuntu"
        }
    } else {
        exit 1
    }
}

Write-Host "`n✅ Connection Details:" -ForegroundColor Green
Write-Host "   Server:   $SERVER_IP" -ForegroundColor White
Write-Host "   Username: $USERNAME" -ForegroundColor White
Write-Host "   Key File: $PEM_FILE" -ForegroundColor White
Write-Host ""

# Set correct permissions for PEM file (SSH requires restricted permissions)
Write-Host "🔐 Setting PEM file permissions..." -ForegroundColor Yellow
icacls $PEM_FILE /inheritance:r | Out-Null
icacls $PEM_FILE /grant:r "$($env:USERNAME):(R)" | Out-Null

# Build SSH command
$pemPath = Resolve-Path $PEM_FILE
$sshCommand = "ssh -i `"$pemPath`" $USERNAME@$SERVER_IP"

Write-Host "📡 Connecting..." -ForegroundColor Cyan
Write-Host ""

# Open in Windows Terminal if available, otherwise PowerShell
if (Get-Command wt -ErrorAction SilentlyContinue) {
    Start-Process wt -ArgumentList $sshCommand
} else {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $sshCommand
}

Write-Host "✅ SSH terminal opened!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "   - If connection fails, verify SERVER_IP and USERNAME" -ForegroundColor White
Write-Host "   - Check if your server security group allows SSH (port 22)" -ForegroundColor White
Write-Host "   - Make sure the PEM key matches your server" -ForegroundColor White

