'use strict';

const Litird = require('litird');

class App extends Litird {
  onstart() {
    this.logger.info('app started');
  }

  beforeMountRouter() {
    this.server.use(require('./middleware/logger')(this));
    this.logger.info('load middleware logger');
  }
}

new App().start();
