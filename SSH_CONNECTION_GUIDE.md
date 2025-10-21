# 🔐 SSH Connection Guide - AksharJobs

Quick guide to connect to your Ubuntu server using the PEM key.

## 🚀 Quick Connect

```powershell
.\connect_aksharjobs.ps1
```

## 📝 First Time Setup

### Step 1: Edit Connection Details

Open `connect_aksharjobs.ps1` and set your server details:

```powershell
$SERVER_IP = "your-server-ip"  # Example: "54.123.45.67"
$USERNAME = "ubuntu"            # Usually "ubuntu" for AWS EC2
$PEM_FILE = "aksharjobs-key.pem.bak"
```

### Step 2: Find Your Server IP

**AWS EC2:**
1. Go to AWS Console → EC2 → Instances
2. Select your instance
3. Copy the "Public IPv4 address" or "Public IPv4 DNS"

**Your IP might look like:**
- `54.123.45.67` (IPv4 address)
- `ec2-54-123-45-67.compute-1.amazonaws.com` (DNS name)

### Step 3: Verify PEM File

Your PEM key files:
- ✅ `aksharjobs-key.pem.bak` - For SSH (Linux/Mac/Windows PowerShell)
- ✅ `aksharjobs-key.ppk` - For PuTTY (Windows GUI)

## 🎯 Connection Methods

### Method 1: Automated Script (Recommended)
```powershell
.\connect_aksharjobs.ps1
```

### Method 2: Direct Command
```powershell
ssh -i "aksharjobs-key.pem.bak" ubuntu@YOUR_SERVER_IP
```

### Method 3: Using PuTTY (Windows GUI)
1. Open PuTTY
2. Host Name: `ubuntu@YOUR_SERVER_IP`
3. Connection → SSH → Auth → Private key file: Browse to `aksharjobs-key.ppk`
4. Click "Open"

## 🔧 Troubleshooting

### Error: "Permission denied (publickey)"

**Solution 1: Check PEM file permissions**
```powershell
# Fix permissions
icacls aksharjobs-key.pem.bak /inheritance:r
icacls aksharjobs-key.pem.bak /grant:r "$($env:USERNAME):(R)"
```

**Solution 2: Verify username**
Common usernames for Ubuntu servers:
- `ubuntu` (AWS EC2 Ubuntu)
- `ec2-user` (AWS EC2 Amazon Linux)
- `admin` (Some cloud providers)
- `root` (Some providers, but not recommended)

### Error: "Connection timed out"

**Check these:**
1. ✅ Server is running
2. ✅ Security Group allows SSH (port 22) from your IP
3. ✅ Correct server IP address
4. ✅ Your internet connection

**AWS Security Group Settings:**
- Type: SSH
- Protocol: TCP
- Port: 22
- Source: Your IP or `0.0.0.0/0` (less secure but works everywhere)

### Error: "Host key verification failed"

```powershell
# Remove old host key
ssh-keygen -R YOUR_SERVER_IP
```

### Error: "Bad permissions" on PEM file

```powershell
# Windows - Set correct permissions
icacls aksharjobs-key.pem.bak /reset
icacls aksharjobs-key.pem.bak /inheritance:r
icacls aksharjobs-key.pem.bak /grant:r "$($env:USERNAME):(R)"
```

## 📱 Common Tasks After Connecting

### Check Backend Status
```bash
pm2 status
pm2 logs backend
```

### Restart Backend
```bash
pm2 restart backend
```

### Check Frontend
```bash
pm2 status frontend
pm2 logs frontend
```

### View All Services
```bash
pm2 list
```

### Check Nginx Status
```bash
sudo systemctl status nginx
```

### View Nginx Logs
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Check MongoDB
```bash
sudo systemctl status mongod
```

## 💡 Pro Tips

### Save Connection in SSH Config
Create/edit `~\.ssh\config`:
```
Host aksharjobs
    HostName YOUR_SERVER_IP
    User ubuntu
    IdentityFile C:\Users\kalpi\Desktop\AksharJobs\aksharjobs-key.pem.bak
    ServerAliveInterval 60
```

Then connect with just:
```powershell
ssh aksharjobs
```

### Transfer Files to Server
```powershell
# Upload file to server
scp -i aksharjobs-key.pem.bak local-file.txt ubuntu@YOUR_SERVER_IP:/home/ubuntu/

# Download file from server
scp -i aksharjobs-key.pem.bak ubuntu@YOUR_SERVER_IP:/home/ubuntu/remote-file.txt .
```

### Keep Connection Alive
Add to your SSH command:
```powershell
ssh -i "aksharjobs-key.pem.bak" -o ServerAliveInterval=60 ubuntu@YOUR_SERVER_IP
```

## 🔗 Quick Reference

| Task | Command |
|------|---------|
| Connect | `.\connect_aksharjobs.ps1` |
| Direct SSH | `ssh -i aksharjobs-key.pem.bak ubuntu@IP` |
| Check logs | `pm2 logs` |
| Restart all | `pm2 restart all` |
| Server status | `pm2 status` |
| Exit SSH | `exit` or `Ctrl+D` |

---

**Need help?** Make sure you have:
- ✅ Correct server IP
- ✅ PEM file in project directory
- ✅ SSH port 22 allowed in security group
- ✅ Server is running

