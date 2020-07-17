'use strict';

const app = require('litird').app;

/**
 * @param {Context} ctx
 */
module.exports = async function logger(ctx, next) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  app.logger.info(`${ctx.method} ${ctx.url} ${ctx.status} ${ctx.length || 0} - ${ms}ms`);
};
