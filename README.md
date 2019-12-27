# README

## init project

```bash
npm i litird -g

mkdir example
cd example
litird-init
npm i
npm start
```

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
  validator
  validate
  controller
  router
  middleware

load order:
  index.js
  app.js
  config
  logger
  redis
  mongoose
  mongoose/plugin
  model
  baiji-entity
  entity
  service
  koa
  validator
  controller
  router
  middleware
```
