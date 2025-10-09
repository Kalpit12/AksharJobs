# Redis Setup for Real-time Status Tracking

## Installation

### Windows
1. Download Redis for Windows from: https://github.com/microsoftarchive/redis/releases
2. Extract and run `redis-server.exe`
3. Or use Docker: `docker run -d -p 6379:6379 redis:alpine`

### Linux/Mac
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS with Homebrew
brew install redis

# Start Redis
redis-server
```

## Configuration

The application will automatically connect to Redis on `localhost:6379` (default port).

## Environment Variables (Optional)

You can set these environment variables to customize Redis connection:

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Testing

Once Redis is running, the real-time status tracking will work automatically. Users will see:

- **Header**: "Online" when active, "Offline" when inactive
- **Profile Page**: "Active" when online, "Inactive" when offline

## Features

- **Activity Detection**: Tracks mouse, keyboard, and scroll activity
- **Page Visibility**: Automatically sets offline when tab is hidden
- **Heartbeat**: Sends periodic heartbeats to maintain online status
- **Real-time Updates**: WebSocket connection for instant status changes
- **Auto-cleanup**: Inactive users automatically go offline after 5 minutes
