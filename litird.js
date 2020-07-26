'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const autoBind = require('auto-bind');
const { EggConsoleLogger } = require('egg-logger');
const Parameter = require('parameter');

const loader = require('./loader');
const getPath = loader.getPath;

const merge = (target, source) => {
  const keys = Object.keys(source);
  keys.forEach(k => {
    target[k] = source[k];
  });
};

// copy from auto-bind: Gets all non-builtin properties up the prototype chain
const getAllProperties = object => {
  const properties = new Set();

  do {
    for (const key of Reflect.ownKeys(object)) {
      properties.add([object, key]);
    }
  } while ((object = Reflect.getPrototypeOf(object)) && object !== Object.prototype);

  return properties;
};

class Litird {
  constructor(options = {}) {
    // single instance
    if (Litird.app) return Litird.app;
    const app = Litird.app = this;

    options = this.options = {
      redis: true, // init redis
      mongo: true, // init mongo
      koaOptions: {}, // koa constructor options
      ...options,
    };

    const config = this.initConfig();
    app.logger = new EggConsoleLogger({ level: config.isDev ? 'DEBUG' : 'INFO' });
    if (options.redis) this.initRedis();
    if (options.mongo) this.initMongo();
    this.initEntity();
    const serviceClass = this.initService();
    const server = this.initServer();
    this.initValidator();
    this.initController(serviceClass);

    const router = app.router = new Router();
    require(getPath('router'));
    server.use(require('koa-bodyparser')());
    this.beforeMountRouter();
    server.use(router.routes());
    server.use(router.allowedMethods());

    // ready
    this.tsHelper();
    this.handleError();
    this.onready();
  }

  initConfig() {
    const config = this.config = require('./config');
    merge(config, require(getPath('config')));
    try {
      merge(config, require(getPath('config', `${config.env}.js`)));
    } catch (err) {
      // do nothing
    }

    return config;
  }

  initRedis() {
    const Redis = this.Redis = require('ioredis');
    this.redis = new Redis(this.config.redis);
    this.logger.info('load redis');
  }

  initMongo() {
    const mongoose = this.mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    mongoose.connect(this.config.mongoose.url, this.config.mongoose.options);
    mongoose.set('debug', this.config.mongoose.debug);

    this.mongoosePlugins = {
      motime: require('./mongoose/plugin/motime'),
      paginate: require('./mongoose/plugin/paginate'),
    }

    const model = this.model = {};
    loader.load(this.logger, 'model', (err, res) => {
      model[res.uname] = res.func;
    });
  }

  initEntity() {
    // todo cycle ref
    this.Entity = require('baiji-entity');
    this.Entity.types = {
      string: { default: '' },
      number: { default: 0 },
      boolean: { default: false },
      date: { format: 'iso', default: '' },
    };
    const entity = this.entity = {};
    loader.load(this.logger, 'entity', (err, res) => {
      entity[res.lname] = res.func;
    }, false);
  }

  initService() {
    const app = this;
    const logger = this.logger;

    const serviceClass = {};
    const service = app.service = {};
    loader.load(logger, 'service', (err, res) => {
      const _class = res.func;
      const _name = res.lname;
      serviceClass[_name] = _class;

      const _ins = new _class();
      autoBind(_ins);
      _ins.service = service;
      service[_name] = _ins;
    });

    return serviceClass;
  }

  initServer() {
    const server = this.server = new Koa(this.options.koaOptions);
    const logger = this.logger;
    logger.info('create new koa server');

    // change koa onerror console to logger
    server.onerror = function (err) {
      if (!(err instanceof Error)) throw new TypeError(util.format('non-error thrown: %j', err));

      if (404 == err.status || err.expose) return;
      if (this.silent) return;

      logger.error(err);
    };

    return server;
  }

  initValidator() {
    const app = this;
    const validator = app.validator = new Parameter({
      convert: true,
      widelyUndefined: true
    });
    validator.addRule('objectid', (rule, value) => {
      if (!/^\w{24}$/.test(value)) return 'must be ObjectId';
    });
    validator.addRule('mobile', (rule, value) => {
      if (!/^1\d{10}$/.test(value)) return 'must be mobile';
    });
    validator.addRule('boolean', Parameter.TYPE_MAP.boolean, true, function (value) {
      if (value === true || value === 'true' || value === 1 || value === '1') return true;
      return false;
    });

    // hook validator.validate
    app.validate = (rules, obj) => {
      const errors = validator.validate(rules, obj);
      if (errors) {
        const err = new Error('Validation Failed');
        errors.forEach(item => {
          const field = item.field;
          item.message = (rules[field] && rules[field].message) || item.message;
        });
        err.errors = errors;
        throw err;
      }
    };
    this.logger.info('load validator');
  }

  initController(serviceClass) {
    const app = this;
    const logger = this.logger;

    const controller = app.controller = {};
    loader.load(logger, 'controller', (err, res) => {
      const fns = {};
      const _class = res.func;

      for (const [object, key] of getAllProperties(_class.prototype)) {
        if (key === 'constructor') continue;

        const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
        if (descriptor && typeof descriptor.value === 'function') {
          fns[key] = async function (...args) {
            const ins = new _class();
            const fn = ins[key];

            const service = {};
            const serviceCaches = {};
            Object.keys(serviceClass).forEach(s_name => {
              Object.defineProperty(service, s_name, {
                get() {
                  if (serviceCaches[s_name]) return serviceCaches[s_name];
                  const _ins = new serviceClass[s_name];
                  autoBind(_ins);
                  _ins.service = service;

                  serviceCaches[s_name] = _ins;
                  return _ins;
                }
              })
            });
            ins.service = service;

            return fn.call(ins, ...args);
          };
        }
      }

      controller[res.lname] = fns;
    });
  }

  onready() {
    this.logger.info('app ready');
  }

  start() {
    this.httpServer = this.server.listen(this.config.port, () => {
      this.logger.info('server listen at %s', this.config.port);
      this.listenstop();
      this.onstart();
    });
  }

  beforeMountRouter() { }

  tsHelper() {
    if (!this.config.isDev) return;
    const flag = process.argv.slice(2).some(i => i === '--ts-helper');
    if (!flag) return;
    require('./ts_helper')(this.logger);
    this.logger.info('generate index.d.ts');
  }

  listenstop() {
    process.on('SIGINT', () => {
      this.httpServer.close((err) => {
        this.logger.info('server close');
        if (err) this.logger.error(err);
        process.exit(err ? 1 : 0);
      });
    });
  }

  handleError() {
    process.on('uncaughtException', err => {
      this.logger.error('uncaughtException', err);
    });

    process.on('unhandledRejection', err => {
      this.logger.error('unhandledRejection', err);
    });
  }

  onstart() {
    this.logger.info('app started');
  }
}

module.exports = Litird;
