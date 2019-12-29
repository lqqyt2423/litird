'use strict';

// http://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
  apps: [{
    name: 'example',
    script: 'app.js',

    args: '',
    instances: 1,
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    kill_timeout: 3000,
  }]
};
