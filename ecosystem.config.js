module.exports = {
  apps: [
    {
      name: 'oppj-pss',
      script: 'npm',
      args: 'start',
      autorestart: true,
      max_restarts: 10,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3010,
      },
    },
  ],
}
