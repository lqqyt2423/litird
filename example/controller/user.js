'use strict';

const Controller = require('litird').Controller;

module.exports = class User extends Controller {
  /**
   * @param {Context} ctx
   */
  async show(ctx) {
    const id = ctx.params.id;
    const user = await this.service.user.show(id);
    if (user) ctx.body = { data: this.entity.user.parse(user) };
  }
};
