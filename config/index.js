'use strict';

// dev test prod
const env = process.env.NODE_ENV || 'dev';

module.exports = {
  env,

  isDev: env === 'dev',

  port: 3000,

  mongoose: {
    url: 'mongodb://127.0.0.1:27017/litird',
    debug: env === 'dev' ? true : false,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  redis: {
    port: 6379,
    host: '127.0.0.1',
  },
};
