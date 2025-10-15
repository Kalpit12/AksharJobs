module.exports = {
  apps: [
    {
      name: 'akshar-gunicorn',  // Changed name to avoid conflict
      script: '/var/www/AksharJobs/backend/venv/bin/gunicorn',
      args: '--bind 0.0.0.0:3002 --workers 3 --threads 2 --worker-class gthread --timeout 120 --access-logfile - --error-logfile - --log-level info wsgi:application',
      cwd: '/var/www/AksharJobs/backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        FLASK_ENV: 'production',
        PYTHONUNBUFFERED: '1'
      },
      error_file: '~/.pm2/logs/akshar-gunicorn-error.log',
      out_file: '~/.pm2/logs/akshar-gunicorn-out.log',
      log_file: '~/.pm2/logs/akshar-gunicorn-combined.log',
      time: true,
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      listen_timeout: 10000,
      kill_timeout: 5000,
      exp_backoff_restart_delay: 100
    }
  ]
};

