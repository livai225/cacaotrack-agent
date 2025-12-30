module.exports = {
  apps: [{
    name: 'cacaotrack-api',
    script: 'node_modules/.bin/ts-node',
    args: '--transpile-only --no-cache src/index.ts',
    cwd: '/var/www/cacaotrack-agent/server',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: '/home/asco/.pm2/logs/cacaotrack-api-error.log',
    out_file: '/home/asco/.pm2/logs/cacaotrack-api-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};

