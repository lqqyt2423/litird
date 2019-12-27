'use strict';

const path = require('path');
const fs = require('fs');
const delegate = require('delegates');
const Koa = require('koa');
const Router = require('koa-router');
const Redis = require("ioredis");
const autoBind = require('auto-bind');
const winston = require('winston');

const cwd = process.cwd();
const getPath = (...p) => path.join(cwd, ...p);
const lowerFirstLetter = str => str.charAt(0).toLowerCase() + str.slice(1);
const merge = (target, source) => {
  const keys = Object.keys(source);
  keys.forEach(k => {
    target[k] = source[k];
  });
};

module.exports = class Litird {
  constructor() {
    const app = this;

    const config = app.config = require('./config');
    merge(config, require(getPath('config')));
    try {
      merge(config, require(getPath('config', `${config.env}.js`)));
    } catch (err) {
      // do nothing
    }

    const loggerFormats = [
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
    ];
    if (config.env === 'dev') {
      loggerFormats.unshift(winston.format.colorize());
    }
    const logger = app.logger = winston.createLogger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(...loggerFormats)
    });

    app.redis = new Redis(config.redis);
    logger.info('load redis');

    const mongoose = app.mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    mongoose.connect(config.mongoose.url, config.mongoose.options);
    mongoose.set('debug', config.mongoose.debug);

    app.mongoosePlugins = {
      motime: require('./mongoose/plugin/motime'),
      paginate: require('./mongoose/plugin/paginate'),
    }

    const model = app.model = {};
    try {
      const files = fs.readdirSync(getPath('model'));
      for (const file of files) {
        if (!/\.js$/.test(file)) continue;
        const fn = require(getPath('model', file));
        if (typeof fn === 'function') {
          const modelFn = fn(app);
          if (typeof modelFn === 'function') {
            model[modelFn.name] = modelFn();
            logger.info('load model %s', modelFn.name);
          } else {
            logger.warn('model %s modelFn is not a function', file);
          }
        } else {
          logger.warn('model %s is not a function', file);
        }
      }
    } catch (err) {
      logger.warn('model load error');
      logger.error(err);
    }

    // todo 循环引用
    app.Entity = require('baiji-entity');
    app.Entity.types = {
      string: { default: '' },
      number: { default: 0 },
      boolean: { default: false },
      date: { format: 'iso', default: '' },
    };
    const entity = app.entity = {};
    try {
      const files = fs.readdirSync(getPath('entity'));
      for (const file of files) {
        if (!/\.js$/.test(file)) continue;
        const fn = require(getPath('entity', file));
        if (typeof fn === 'function') {
          const entityFn = fn(app);
          if (typeof entityFn === 'function') {
            entity[entityFn.name] = entityFn();
            logger.info('load entity %s', entityFn.name);
          } else {
            logger.warn('entity %s entityFn is not a function', file);
          }
        } else {
          logger.warn('entity %s is not a function', file);
        }
      }
    } catch (err) {
      logger.warn('entity load error');
      logger.error(err);
    }

    const service = app.service = {};
    try {
      const files = fs.readdirSync(getPath('service'));
      for (const file of files) {
        if (!/\.js$/.test(file)) continue;
        const fn = require(getPath('service', file));
        if (typeof fn === 'function') {
          const ins = new fn();
          autoBind(ins);
          ins.app = app;
          delegate(ins, 'app')
            .getter('config')
            .getter('logger')
            .getter('redis')
            .getter('model')
            .getter('service');
          const sname = lowerFirstLetter(fn.name);
          service[sname] = ins;
          logger.info('load service %s', sname);
        } else {
          logger.warn('service %s is not a function', file);
        }
      }
    } catch (err) {
      logger.warn('service load error');
      logger.error(err);
    }

    const server = app.server = new Koa();
    logger.info('create new koa server');

    const controller = app.controller = {};
    try {
      const files = fs.readdirSync(getPath('controller'));
      for (const file of files) {
        if (!/\.js$/.test(file)) continue;
        const fn = require(getPath('controller', file));
        if (typeof fn === 'function') {
          const ins = new fn();
          autoBind(ins);
          ins.app = app;
          delegate(ins, 'app')
            .getter('config')
            .getter('logger')
            .getter('redis')
            .getter('model')
            .getter('entity')
            .getter('service')
            .getter('server')
            .getter('controller');
          const cname = lowerFirstLetter(fn.name);
          controller[cname] = ins;
          logger.info('load controller %s', cname);
        } else {
          logger.warn('service %s is not a function', file);
        }
      }
    } catch (err) {
      logger.warn('controller load error');
      logger.error(err);
    }

    const router = app.router = new Router();
    require(getPath('router'))(app);

    this.beforeMountRouter();

    server.use(require('koa-bodyparser')());
    server.use(router.routes());
    server.use(router.allowedMethods());
  }

  start() {
    this.server.listen(this.config.port, () => {
      this.logger.info('server listen at %s', this.config.port);
      this.onstart();
    });
  }

  beforeMountRouter() { }

  onstart() {
    this.logger.info('app started');
  }
};
