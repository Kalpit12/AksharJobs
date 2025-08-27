# 🐳 AksharJobs Docker Setup Guide

This guide explains how to run your AksharJobs website locally using Docker with live reload capabilities.

## 📋 Prerequisites

- Docker Desktop installed and running
- Git (to clone/pull your repository)

## 🏗️ Project Structure

```
AksharJobs/
├── backend/                 # Flask API
│   ├── Dockerfile          # Production backend image
│   ├── Dockerfile.dev      # Development backend image
│   ├── .dockerignore       # Files to exclude from Docker
│   ├── app.py             # Main Flask application
│   └── requirements.txt    # Python dependencies
├── frontend/               # React application
│   ├── Dockerfile          # Production frontend image
│   ├── Dockerfile.dev      # Development frontend image
│   ├── .dockerignore       # Files to exclude from Docker
│   ├── nginx.conf          # Nginx configuration
│   └── package.json        # Node.js dependencies
├── docker-compose.yml      # Production services
├── docker-compose.dev.yml  # Development services with live reload
├── start-docker.bat        # Start production services
├── start-dev.bat           # Start development services
├── stop-docker.bat         # Stop production services
└── stop-dev.bat            # Stop development services
```

## 🚀 Quick Start

### Option 1: Production Setup (Nginx + Built React App)
```bash
# Start services
./start-docker.bat

# Or manually:
docker-compose up --build -d
```

**Access URLs:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000

### Option 2: Development Setup (Live Reload)
```bash
# Start development services
./start-dev.bat

# Or manually:
docker-compose -f docker-compose.dev.yml up --build -d
```

**Access URLs:**
- Frontend: http://localhost:3001 (React dev server)
- Backend API: http://localhost:5000 (Flask with auto-reload)

## 🔧 Manual Docker Commands

### Production Services
```bash
# Build and start
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart
```

### Development Services
```bash
# Build and start with live reload
docker-compose -f docker-compose.dev.yml up --build -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down

# Restart services
docker-compose -f docker-compose.dev.yml restart
```

## 📁 File Placement

### Backend Files
- Place all your Flask files in the `backend/` directory
- The container will mount this directory, so changes are reflected immediately
- Excluded from Docker: `__pycache__/`, `venv/`, `venv38/`

### Frontend Files
- Place all your React files in the `frontend/` directory
- For development: Changes auto-reload via React dev server
- For production: Builds and serves via Nginx

## 🌐 Port Configuration

| Service | Container Port | Host Port | URL |
|---------|----------------|-----------|-----|
| Backend API | 5000 | 5000 | http://localhost:5000 |
| Frontend (Production) | 80 | 8080 | http://localhost:8080 |
| Frontend (Development) | 3001 | 3001 | http://localhost:3001 |

## 🔄 Live Reload Features

### Backend (Flask)
- **Auto-reload**: Flask development server restarts on code changes
- **Volume mounting**: Local `./backend/` directory mounted to container
- **Hot reload**: No need to rebuild Docker image

### Frontend (React)
- **Development mode**: React dev server with hot reload
- **Volume mounting**: Local `./frontend/` directory mounted to container
- **File watching**: Polling enabled for Docker compatibility

## 🧹 Browser Cache Management

### Development Mode
- React dev server handles cache busting automatically
- Hard refresh (Ctrl+F5) if needed

### Production Mode
- Nginx configured with proper cache headers
- Static assets cached for 1 year
- HTML files not cached (always fresh)

### Manual Cache Clearing
```bash
# Clear browser cache
# Chrome: Ctrl+Shift+Delete
# Firefox: Ctrl+Shift+Delete

# Or use incognito/private browsing
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   netstat -ano | findstr :5000
   netstat -ano | findstr :8080
   
   # Kill the process or change ports in docker-compose.yml
   ```

2. **Container won't start**
   ```bash
   # Check logs
   docker-compose logs
   
   # Check container status
   docker-compose ps
   ```

3. **Changes not reflecting**
   ```bash
   # Ensure volume mounting is working
   docker exec -it aksharjobs-backend ls /app
   docker exec -it aksharjobs-frontend ls /app
   ```

4. **Build failures**
   ```bash
   # Clean up and rebuild
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

### Useful Commands

```bash
# View running containers
docker ps

# View container logs
docker logs <container_name>

# Access container shell
docker exec -it <container_name> /bin/bash

# View container resources
docker stats

# Clean up unused resources
docker system prune -f
```

## 🔒 Security Notes

- Development mode exposes Flask debug information
- Production mode uses Nginx for better security
- Environment variables should be managed via `.env` files
- Database connections should use proper authentication

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Flask Development Server](https://flask.palletsprojects.com/en/2.3.x/server/)

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify Docker Desktop is running
3. Check container logs: `docker-compose logs`
4. Ensure ports are not already in use
5. Try rebuilding: `docker-compose up --build`
