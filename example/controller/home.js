'use strict';

const Controller = require('litird').Controller;

module.exports = class Home extends Controller {
  /**
   * @param {Context} ctx
   */
  index(ctx) {
    ctx.body = 'hello litird';
  }
};
