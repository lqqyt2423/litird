'use strict';

// development production
const env = process.env.NODE_ENV || 'development';
const isDev = env === 'development';

module.exports = {
  env,
  isDev,

  port: 3000,

  mongoose: {
    url: 'mongodb://127.0.0.1:27017/litird',
    debug: isDev ? true : false,
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
