module.exports = {
  apps : [{
    name: 'personal',
    script: 'dist/main.js',
    instances: 2,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'root',
      host : '39.97.188.63',
      ref  : 'origin/master',
      repo : 'git@code.aliyun.com:18161518841tb/nest-mba.git',
      path : '/www/server',
      'post-deploy' : 'npm install && npm run build && pm2 reload ecosystem.config.js',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};
