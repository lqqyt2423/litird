import { Server } from 'http';
import ExportConfig = require('./config');
import { EggConsoleLogger } from 'egg-logger';
import IORedis = require('ioredis');
import mongoose = require('mongoose');
import ExportMotime = require('./mongoose/plugin/motime');
import ExportPaginate = require('./mongoose/plugin/paginate');
import Router = require('koa-router');
import Koa = require('koa');

declare class Litird {
  app: Litird.App;

  config: Litird.IConfig;
  logger: EggConsoleLogger;
  Redis: typeof IORedis;
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
  httpServer: Server;

  start(): void;
  beforeMountRouter(): void;
  onstart(): void;
  onready(): void;
}

declare namespace Litird {
  type Config = typeof ExportConfig;
  interface IConfig extends Config { };

  interface IMongoosePlugins {
    motime: typeof ExportMotime;
    paginate: typeof ExportPaginate;
  }

  interface IModel { }

  interface IService { }

  interface IController { }

  interface App extends Litird { }

  export class Service {
    app: App;

    config: IConfig;
    logger: EggConsoleLogger;
    redis: IORedis.Redis;
    model: IModel;
    service: IService;
  }

  export class Controller {
    app: App;

    config: IConfig;
    logger: EggConsoleLogger;
    redis: IORedis.Redis;
    model: IModel;
    entity: any;
    service: IService;
    server: Koa;
    validator: any;
    validate: any;
  }
}

export = Litird;
