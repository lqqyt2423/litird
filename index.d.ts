import ExportConfig = require('./config');
import winston = require('winston');
import IORedis = require('ioredis');
import mongoose = require('mongoose');
import ExportMotime = require('./mongoose/plugin/motime');
import ExportPaginate = require('./mongoose/plugin/paginate');
import Router = require('koa-router');
import Koa = require('koa');

declare namespace Litird {
  interface IMongoosePlugins {
    motime: typeof ExportMotime;
    paginate: typeof ExportPaginate;
  }

  interface IModel { }

  interface IService { }

  interface IController { }

  export class Service {
    app: Litird;

    config: typeof ExportConfig;
    logger: winston.Logger;
    redis: IORedis.Redis;
    model: Litird.IModel;
    service: Litird.IService;
  }

  export class Controller {
    app: Litird;

    config: typeof ExportConfig;
    logger: winston.Logger;
    redis: IORedis.Redis;
    model: Litird.IModel;
    entity: any;
    service: Litird.IService;
    server: Koa;
    validator: any;
    validate: any;
  }
}

declare class Litird {
  static app: Litird;

  config: typeof ExportConfig;
  logger: winston.Logger;
  redis: IORedis.Redis;
  mongoose: typeof mongoose;
  mongoosePlugins: Litird.IMongoosePlugins;
  model: Litird.IModel;
  entity: any;
  service: Litird.IService;
  server: Koa;
  validator: any;
  validate: any;
  controller: Litird.IController;
  router: Router;

  start(): void;
  beforeMountRouter(): void;
  onstart(): void;
}

export = Litird;
