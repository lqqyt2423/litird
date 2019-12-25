'use strict';

module.exports = class User {
  async show(id) {
    const { model } = this;
    const user = await model.User.findById(id);
    if (!user) return null;
    return user;
  }

  async update(id, doc) {
    const { model } = this;
    return await model.User.findByIdAndUpdate(id, { $set: doc });
  }
};
