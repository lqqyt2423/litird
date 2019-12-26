'use strict';

module.exports = class User {
  async show(ctx) {
    const id = ctx.params.id;
    const user = await this.service.user.show(id);
    if (user) ctx.body = { data: this.entity.user.parse(user) };
  }
};
