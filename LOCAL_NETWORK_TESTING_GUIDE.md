# 🌐 Local Network Testing Guide

This guide will help you access your AksharJobs website from any device on your local network (phone, tablet, another computer).

## 📋 Prerequisites

- Both devices must be on the same Wi-Fi network
- Windows Firewall must allow connections (see step 3)

## 🚀 Quick Start

### Step 1: Find Your Local IP Address

Run this command in PowerShell:
```powershell
# Get your local IP address
(Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*"}).IPAddress
```

Or use the helper script:
```powershell
.\get_local_ip.ps1
```

Example output: `192.168.1.100` (your IP will be different)

### Step 2: Start the Backend Server

```powershell
cd backend
python start_backend.py
```

The backend will automatically start on `0.0.0.0:3002` (accessible from network)

### Step 3: Start the Servers

**Backend (Terminal 1):**
```powershell
cd backend
.\start_backend_network.ps1
```
Or: `python start_backend.py`

**Frontend (Terminal 2):**
```powershell
cd frontend
.\start_frontend_network.ps1
```

This will start both servers accessible from your network:
- Backend: `0.0.0.0:3002`
- Frontend: `0.0.0.0:3003`

### Step 4: Configure Windows Firewall

You need to allow connections to ports 3002 and 3003:

**Option A: Using PowerShell (Run as Administrator)**
```powershell
# Allow Backend (port 3002)
New-NetFirewallRule -DisplayName "AksharJobs Backend" -Direction Inbound -LocalPort 3002 -Protocol TCP -Action Allow

# Allow Frontend (port 3003)
New-NetFirewallRule -DisplayName "AksharJobs Frontend" -Direction Inbound -LocalPort 3003 -Protocol TCP -Action Allow
```

**Option B: Manual Configuration**
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Click "Next"
5. Enter port `3002` → Click "Next"
6. Select "Allow the connection" → Click "Next"
7. Leave all profiles checked → Click "Next"
8. Name it "AksharJobs Backend" → Click "Finish"
9. Repeat for port `3003` (name it "AksharJobs Frontend")

### Step 5: Access from Other Devices

On your other device (phone, tablet, etc.), open a web browser and go to:

```
http://YOUR_LOCAL_IP:3003
```

For example, if your IP is `192.168.1.100`:
```
http://192.168.1.100:3003
```

## 📱 Testing Checklist

- [ ] Both devices are on the same Wi-Fi network
- [ ] Backend server is running (check http://YOUR_IP:3002 in browser)
- [ ] Frontend server is running (check http://YOUR_IP:3003 in browser)
- [ ] Firewall rules are added
- [ ] You're using the correct IP address (not 127.0.0.1 or localhost)

## 🔍 Troubleshooting

### Issue: Can't connect from other device

**Solution 1: Check firewall**
```powershell
# Test if ports are open (run on your PC)
Test-NetConnection -ComputerName localhost -Port 3002
Test-NetConnection -ComputerName localhost -Port 3003
```

**Solution 2: Verify servers are running**
- Backend: Visit `http://localhost:3002` on your PC
- Frontend: Visit `http://localhost:3003` on your PC

**Solution 3: Check network connectivity**
```powershell
# From your other device, ping your PC
ping YOUR_LOCAL_IP
```

### Issue: Backend shows 502 errors

Make sure MongoDB is running:
```powershell
# Check MongoDB status
Get-Service MongoDB
```

### Issue: Wrong IP address

Your local IP should start with:
- `192.168.x.x` (most common)
- `10.x.x.x` (some networks)
- `172.16.x.x` to `172.31.x.x` (some networks)

❌ **NOT** `127.0.0.1` (that's localhost only)

## 🎯 Quick Test

1. Start backend: `cd backend && python start_backend.py`
2. Start frontend: `cd frontend && npm run start:network`
3. Get your IP: `.\get_local_ip.ps1`
4. On your phone, visit: `http://YOUR_IP:3003`

## 📝 Notes

- Your local IP may change if you disconnect/reconnect to Wi-Fi
- Both servers must remain running while testing
- The backend is already configured with CORS for local network access
- Keep the PowerShell windows open (don't close them)

## 🔐 Security Note

This configuration is for **local testing only**. The servers are accessible to anyone on your Wi-Fi network. Don't use this configuration for production or on public Wi-Fi.

---

**Need help?** Check that:
1. ✅ Same Wi-Fi network
2. ✅ Correct IP (not 127.0.0.1)
3. ✅ Firewall ports open (3002, 3003)
4. ✅ Both servers running

