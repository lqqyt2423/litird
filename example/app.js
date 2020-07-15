'use strict';

const Litird = require('litird');

// constructor => beforeMountRouter => onready => start() => onstart
class App extends Litird {
  constructor() {
    super({ redis: true, mongo: true });
  }

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
