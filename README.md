# Litird

一个简单的服务框架，基于 koa，类似于 egg。

## 初始化项目

```bash
npm i litird -g

mkdir example
cd example
litird-init
npm i
npm start
```

## app 加载顺序

```txt
constructor => beforeMountRouter => onready => start() => onstart
```

## 属性字段

```txt
app properties:
  config
  logger
  redis
  mongoose
  mongoosePlugins
  model
  entity
  service
  server
  validator
  validate
  controller
  router
  httpServer

service properties:
  app
  config
  logger
  redis
  model
  service

controller properties:
  app
  config
  logger
  redis
  model
  entity
  service
  validate
```
