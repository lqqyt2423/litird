'use strict';

const Service = require('litird').Service;

module.exports = class User extends Service {
  async show(id) {
    const { model } = this;
    const user = await model.User.findById(id);
    if (!user) return null;
    return user;
  }
};
