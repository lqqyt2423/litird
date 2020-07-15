'use strict';

const Litird = require('./litird');

class Controller {
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

  get entity() {
    return this.app.entity;
  }

  get validate() {
    return this.app.validate;
  }
}

module.exports = Controller;
