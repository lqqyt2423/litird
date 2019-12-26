'use strict';

module.exports = app => function User() {
  const { mongoose } = app;
  const { Schema } = mongoose;

  const UserSchema = new Schema({
    name: String,
    age: Number,
    gender: Number,
  });

  return mongoose.model('User', UserSchema);
};
