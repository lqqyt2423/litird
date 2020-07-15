'use strict';

const Litird = require('./litird');

class Service {
  get app() {
    return Litird.app;
  }

  get config() {
    return this.app.config;
  }

  get logger() {
    return this.app.logger;
  }

  get redis() {
    return this.app.redis;
  }

  get model() {
    return this.app.model;
  }
}

module.exports = Service;
