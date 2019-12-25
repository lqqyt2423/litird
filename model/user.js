'use strict';

module.exports = class User {
  init() {
    const { mongoose } = this;
    const { Schema } = mongoose;

    const UserSchema = new Schema({
      name: String,
      age: Number,
      gender: Number,
    });

    return mongoose.model('User', UserSchema);
  }
};
