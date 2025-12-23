module.exports = {
  apps: [{
    name: 'asco-api',
    script: 'node_modules/.bin/ts-node',
    args: 'src/index.ts',
    cwd: '/home/asco/apps/cacaotrack-agent/server',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: '/home/asco/.pm2/logs/asco-api-error.log',
    out_file: '/home/asco/.pm2/logs/asco-api-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};

