import ExportConfig = require('./config');
import winston = require('winston');
import IORedis = require('ioredis');
import mongoose = require('mongoose');
import motime = require('./mongoose/plugin/motime');
import paginate = require('./mongoose/plugin/paginate');
import Router = require('koa-router');
import Koa = require('koa');

declare namespace Litird {
  interface IMongoosePlugins {
    motime: typeof motime;
    paginate: typeof paginate;
  }

  interface IModel { }
}

declare class Litird {
  config: typeof ExportConfig;
  logger: winston.Logger;
  redis: IORedis.Redis;
  mongoose: typeof mongoose;
  mongoosePlugins: Litird.IMongoosePlugins;
  model: Litird.IModel;
  entity: any;
  service: any;
  server: Koa;
  validator: any;
  validate: any;
  controller: any;
  router: Router;

  start(): void;
  beforeMountRouter(): void;
  onstart(): void;
}

export = Litird;
