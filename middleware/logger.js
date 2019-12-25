'use strict';

module.exports = async function logger(ctx, next) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  this.logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
};
