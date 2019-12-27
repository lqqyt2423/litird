'use strict';

// http://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
  apps: [{
    name: 'example',
    script: 'app.js',

    args: '',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }]
};
