# 🚀 Easiest Ways to Run AksharJobs Locally

## **Option 1: Simple Mode (Recommended for Network Access) ⭐**

This is the **easiest way** to run your website and make it accessible to other PCs on your network.

### Quick Start:
1. **Run as Administrator**: Right-click `configure-firewall.bat` → "Run as Administrator"
2. **Start Website**: Double-click `start-simple.bat`
3. **Access from Other PCs**: Use your computer's IP address

### What This Does:
- ✅ Starts backend on `0.0.0.0:5000` (accessible from network)
- ✅ Starts frontend on `0.0.0.0:3001` (accessible from network)
- ✅ Configures Windows Firewall automatically
- ✅ Opens separate command windows for each service

### Network Access:
- **Your PC**: `http://localhost:3001`
- **Other PCs**: `http://YOUR_IP_ADDRESS:3001`
- **Backend API**: `http://YOUR_IP_ADDRESS:5000`

---

## **Option 2: Docker Mode (Current Setup)**

Your existing Docker setup is great for development but requires Docker knowledge.

### Quick Start:
```bash
start-dev.bat
```

### What This Does:
- ✅ Containerized environment
- ✅ Automatic rebuilds
- ✅ Isolated dependencies
- ❌ **Not easily accessible from other PCs** (by default)

---

## **Option 3: XAMPP Mode (Traditional Web Server)**

Good for PHP-heavy projects, but your project is Python/Node.js based.

### Quick Start:
```bash
# Start XAMPP (Apache + MySQL)
# Then run:
start_backend.bat
# In another terminal:
cd frontend && npm start
```

---

## **🔧 Making Docker Accessible to Other PCs**

If you prefer Docker, you can modify your `docker-compose.dev.yml`:

```yaml
services:
  backend:
    ports:
      - "0.0.0.0:5000:5000"  # Allow external access
  frontend:
    ports:
      - "0.0.0.0:3001:3001"  # Allow external access
```

---

## **📱 Testing Network Access**

1. **Find Your IP**: Run `ipconfig` in Command Prompt
2. **From Another PC**: Open browser and go to `http://YOUR_IP:3001`
3. **Test API**: `http://YOUR_IP:5000/test-cors`

---

## **🚨 Troubleshooting**

### Can't Access from Other PCs?
1. **Check Firewall**: Run `configure-firewall.bat` as Administrator
2. **Verify Ports**: Run `netstat -an | findstr ":5000\|:3001"`
3. **Check Antivirus**: Some antivirus software blocks network access

### Port Already in Use?
1. **Kill Process**: `netstat -ano | findstr :5000` then `taskkill /PID <PID>`
2. **Change Ports**: Modify the port numbers in the startup scripts

---

## **💡 Pro Tips**

1. **Use Simple Mode** for quick testing and network access
2. **Use Docker Mode** for development with automatic reloading
3. **Bookmark your IP address** for easy access from other devices
4. **Use your computer name** instead of IP: `http://COMPUTERNAME:3001`

---

## **🎯 Quick Commands**

```bash
# Start Simple Mode (Network Accessible)
start-simple.bat

# Configure Firewall (Run as Administrator)
configure-firewall.bat

# Check if services are running
netstat -an | findstr ":5000\|:3001"

# Find your IP address
ipconfig | findstr "IPv4"
```
