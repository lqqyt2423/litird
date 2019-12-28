'use strict';

const Litird = require('litird');

class App extends Litird {
  onstart() {
    this.logger.info('app started');
  }

  beforeMountRouter() {
    this.server.use(require('./middleware/logger'));
    this.logger.info('load middleware logger');

    this.server.use(require('koa-conditional-get')());
    this.logger.info('load middleware koa-conditional-get');

    this.server.use(require('koa-etag')());
    this.logger.info('load middleware koa-etag');
  }
}

new App().start();
