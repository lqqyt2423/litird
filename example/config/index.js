'use strict';

module.exports = {
  port: 3000,

  mongoose: {
    url: 'mongodb://127.0.0.1:27017/example',
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
