module.exports = {
  apps: [
    {
      name: 'akshar-backend',
      // Use Gunicorn for production WSGI server
      script: '/var/www/AksharJobs/backend/venv/bin/gunicorn',
      args: '--bind 0.0.0.0:3002 --workers 4 --threads 2 --worker-class gthread --timeout 120 --access-logfile - --error-logfile - wsgi:application',
      cwd: '/var/www/AksharJobs/backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        FLASK_ENV: 'production',
        PYTHONUNBUFFERED: '1',
        GUNICORN_CMD_ARGS: '--log-level=info'
      },
      error_file: '~/.pm2/logs/akshar-backend-error.log',
      out_file: '~/.pm2/logs/akshar-backend-out.log',
      log_file: '~/.pm2/logs/akshar-backend-combined.log',
      time: true,
      // Restart settings
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      // Health monitoring
      listen_timeout: 10000,
      kill_timeout: 5000,
      // Auto restart on crashes
      exp_backoff_restart_delay: 100
    }
  ]
};

