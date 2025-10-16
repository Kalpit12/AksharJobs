import os
import socket
from dotenv import load_dotenv
import cloudinary

# Load environment variables from .env files
load_dotenv('.env.production')
load_dotenv('.env.local')
load_dotenv('.env')

# Dynamic network detection
def get_local_ip():
    """Get the local IP address that other devices on the network can reach"""
    try:
        # Create a socket to get local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # Connect to a remote address (doesn't actually connect)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        # Fallback to localhost if network detection fails
        return "127.0.0.1"

def get_network_config():
    """Get network-agnostic configuration for global accessibility"""
    local_ip = get_local_ip()
    
    # Environment-based configuration with network detection
    config = {
        'HOST': os.getenv('HOST', 'localhost'),
        'PORT': int(os.getenv('PORT', 3002)),
        'FRONTEND_HOST': os.getenv('FRONTEND_HOST', local_ip),
        'FRONTEND_PORT': int(os.getenv('FRONTEND_PORT', 3003)),
        'ALLOWED_ORIGINS': [
            # Local network origins
            f"http://{local_ip}:3003",
            f"http://{local_ip}:3000",
            f"http://{local_ip}:3002",
            f"http://127.0.0.1:3003",
            f"http://127.0.0.1:3000",
            f"http://127.0.0.1:3002",
            f"http://localhost:3003",
            f"http://localhost:3000",
            f"http://localhost:3002",
            
            # Common local network ranges
            "http://192.168.1.0/24",
            "http://192.168.0.0/24",
            "http://10.0.0.0/8",
            "http://172.16.0.0/12",
            
            # Public IP origins (for external access)
            "*"  # Allow all origins for maximum accessibility
        ]
    }
    
    # Add additional origins if specified
    additional_origins = os.getenv('ADDITIONAL_ORIGINS', '')
    if additional_origins:
        config['ALLOWED_ORIGINS'].extend(additional_origins.split(','))
    
    # Add environment-specific origins
    if os.getenv('NODE_ENV') == 'production':
        config['ALLOWED_ORIGINS'].extend([
            'https://yourdomain.com',
            'https://www.yourdomain.com'
        ])
    
    return config

# Get network configuration
NETWORK_CONFIG = get_network_config()

# Add fallback values for database connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "resume_matcher")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

class Config:
    # Network configuration
    HOST = NETWORK_CONFIG['HOST']
    PORT = NETWORK_CONFIG['PORT']
    FRONTEND_HOST = NETWORK_CONFIG['FRONTEND_HOST']
    FRONTEND_PORT = NETWORK_CONFIG['FRONTEND_PORT']
    ALLOWED_ORIGINS = NETWORK_CONFIG['ALLOWED_ORIGINS']
    
    JWT_SECRET_KEY = SECRET_KEY
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours in seconds (extended from 1 hour)
    
    # OAuth Configuration with dynamic redirects
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
    LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
    LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")
    
    # Dynamic OAuth Redirect URIs based on current network
    GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", f"http://{NETWORK_CONFIG['HOST']}:{NETWORK_CONFIG['PORT']}/api/auth/google/callback")
    LINKEDIN_REDIRECT_URI = os.getenv("LINKEDIN_REDIRECT_URI", f"http://{NETWORK_CONFIG['HOST']}:{NETWORK_CONFIG['PORT']}/api/auth/linkedin/callback")

    

